"""Studies router handling uploads, volume streaming, and analysis triggers."""

import os
import uuid
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Study, Patient, Job, Analysis, User, AuditLog
from backend.app.schemas.study import StudyOut, StudyUploadResponse
from backend.app.schemas.job import JobOut
from backend.app.storage.file_storage import storage
from backend.app.services.anonymize import identify_sequence_from_filename
from backend.app.workers.job_runner import execute_analysis_job
from backend.app.api.v1.deps import get_current_user

router = APIRouter(prefix="/studies", tags=["Studies"])


@router.post("", response_model=StudyUploadResponse)
async def upload_study(
    patient_id: str = Form(...),
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload multi-sequence MRI study (NIfTI files or DICOM archive)."""
    # 1. Validate Patient
    patient_stmt = select(Patient).where(Patient.id == patient_id)
    p_res = await db.execute(patient_stmt)
    patient = p_res.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    study_id = str(uuid.uuid4())
    study_dir = storage.get_study_dir(study_id)
    detected_sequences = []

    # 2. Save and classify uploaded files
    for upload in files:
        filename = upload.filename or "unknown"
        seq_type = identify_sequence_from_filename(filename)

        if filename.endswith(".zip"):
            # Extract zip
            zip_dest = study_dir / filename
            await storage.save_uploaded_file(upload, zip_dest)
            extracted = storage.extract_safe_zip(zip_dest, study_dir)
            zip_dest.unlink(missing_ok=True)
            for ef in extracted:
                ef_seq = identify_sequence_from_filename(ef.name)
                if ef_seq and ef_seq not in detected_sequences:
                    detected_sequences.append(ef_seq)
        else:
            # Direct sequence file
            save_name = f"{seq_type}.nii.gz" if seq_type else filename
            target = study_dir / save_name
            await storage.save_uploaded_file(upload, target)
            if seq_type and seq_type not in detected_sequences:
                detected_sequences.append(seq_type)

    # 3. Create Study Record
    study = Study(
        id=study_id,
        patient_id=patient.id,
        status="uploaded",
        sequences_present=detected_sequences,
        storage_path=str(study_dir),
        created_by=current_user.id,
    )
    db.add(study)

    # Log audit event
    audit = AuditLog(
        user_id=current_user.id,
        action="upload",
        entity_type="study",
        entity_id=study.id,
    )
    db.add(audit)

    await db.commit()
    await db.refresh(study)

    return StudyUploadResponse(
        study_id=study.id,
        patient_id=patient.id,
        status=study.status,
        sequences_detected=detected_sequences,
        message="Study uploaded and pseudonymised successfully",
    )


@router.get("", response_model=List[StudyOut])
async def list_studies(
    patient_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List studies with optional patient filtering."""
    stmt = select(Study)
    if patient_id:
        stmt = stmt.where(Study.patient_id == patient_id)
    stmt = stmt.order_by(Study.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{id}", response_model=StudyOut)
async def get_study(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get study metadata."""
    stmt = select(Study).where(Study.id == id)
    res = await db.execute(stmt)
    study = res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study


@router.delete("/{id}")
async def delete_study(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Permanently delete study and all associated files/masks."""
    stmt = select(Study).where(Study.id == id)
    res = await db.execute(stmt)
    study = res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    storage.delete_study_data(study.id)
    await db.delete(study)
    await db.commit()
    return {"status": "deleted", "study_id": id}


@router.get("/{id}/volume/{sequence}")
async def get_study_volume(
    id: str,
    sequence: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Stream NIfTI volume (gzip) for the 3-plane viewer."""
    stmt = select(Study).where(Study.id == id)
    res = await db.execute(stmt)
    study = res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    study_dir = Path(study.storage_path)
    # Search for requested sequence file
    target = None
    for cand in study_dir.glob(f"*{sequence.lower()}*.nii*"):
        target = cand
        break

    if not target or not target.exists():
        raise HTTPException(status_code=404, detail=f"Sequence volume '{sequence}' not found")

    return FileResponse(
        path=str(target),
        media_type="application/gzip",
        filename=target.name,
    )


@router.post("/{id}/analyze", response_model=JobOut)
async def analyze_study(
    id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enqueue full analysis pipeline for a study."""
    stmt = select(Study).where(Study.id == id)
    res = await db.execute(stmt)
    study = res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    job = Job(
        study_id=study.id,
        type="analysis",
        status="queued",
        progress=0,
        stage="queued",
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Trigger background execution
    background_tasks.add_task(execute_analysis_job, job.id)

    return job


@router.get("/{id}/analysis")
async def get_study_analysis(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the full Section 7.1 AnalysisResult JSON for an analyzed study."""
    stmt = select(Analysis).where(Analysis.study_id == id)
    res = await db.execute(stmt)
    analysis = res.scalar_one_or_none()
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not ready or not found. Ensure the study has been analyzed.",
        )
    return analysis.result


@router.get("/{id}/mask")
async def get_study_mask(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download the segmentation NIfTI mask for the study."""
    stmt = select(Study).where(Study.id == id)
    res = await db.execute(stmt)
    study = res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    study_dir = Path(study.storage_path)
    mask_file = None
    for cand in study_dir.glob("*mask*.nii*"):
        mask_file = cand
        break

    if not mask_file or not mask_file.exists():
        raise HTTPException(status_code=404, detail="Mask file not found")

    return FileResponse(
        path=str(mask_file),
        media_type="application/gzip",
        filename=mask_file.name,
    )
