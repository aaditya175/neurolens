"""Reports router for clinical report generation, editing, and PDF exports."""

import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Study, Patient, Analysis, Report, User, AuditLog
from backend.app.api.v1.deps import get_current_user
from backend.app.services.report_service import ReportService
from backend.app.storage.file_storage import storage

router = APIRouter(tags=["Reports"])


@router.post("/studies/{id}/report")
async def create_or_generate_report(
    id: str,
    body: Optional[dict] = Body(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate or retrieve structured clinical draft report for a study."""
    study_stmt = select(Study).where(Study.id == id)
    s_res = await db.execute(study_stmt)
    study = s_res.scalar_one_or_none()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    patient_stmt = select(Patient).where(Patient.id == study.patient_id)
    p_res = await db.execute(patient_stmt)
    patient = p_res.scalar_one_or_none()

    analysis_stmt = select(Analysis).where(Analysis.study_id == id)
    a_res = await db.execute(analysis_stmt)
    analysis = a_res.scalar_one_or_none()

    if not analysis or not isinstance(analysis.result, dict):
        raise HTTPException(status_code=400, detail="Study has not completed analysis yet.")

    # Check for existing report
    rep_stmt = select(Report).where(Report.study_id == id)
    r_res = await db.execute(rep_stmt)
    report = r_res.scalar_one_or_none()

    custom_impression = body.get("impression") if body else None

    report_content = ReportService.build_report_data(
        patient_code=patient.code if patient else "PT-UNKNOWN",
        study_id=study.id,
        analysis_dict=analysis.result,
        sequences=study.sequences_present or ["t1", "t1ce", "t2", "flair"],
        impression=custom_impression,
        status="draft",
    )

    if not report:
        report = Report(
            id=str(uuid.uuid4()),
            study_id=study.id,
            content=report_content,
            status="draft",
            created_by=current_user.id,
        )
        db.add(report)
    else:
        # Update existing draft
        if report.status != "signed":
            report.content = report_content
            db.add(report)

    # Audit log
    db.add(AuditLog(user_id=current_user.id, action="generate_report", entity_type="report", entity_id=report.id))

    await db.commit()
    await db.refresh(report)

    return {"id": report.id, "study_id": study.id, "status": report.status, "content": report.content}


@router.put("/reports/{id}")
async def update_report(
    id: str,
    body: dict = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Edit report impression or transition status (draft -> reviewed -> signed)."""
    rep_stmt = select(Report).where(Report.id == id)
    r_res = await db.execute(rep_stmt)
    report = r_res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.status == "signed":
        raise HTTPException(status_code=400, detail="Signed reports are locked and cannot be edited.")

    new_status = body.get("status", report.status)
    if new_status not in ["draft", "reviewed", "signed"]:
        raise HTTPException(status_code=400, detail="Invalid report status")

    content = dict(report.content)
    if "impression" in body:
        content["impression"] = body["impression"]
    content["status"] = new_status

    report.content = content
    report.status = new_status

    if new_status == "signed":
        report.signed_at = datetime.utcnow()

    db.add(report)
    db.add(AuditLog(user_id=current_user.id, action=f"report_status_{new_status}", entity_type="report", entity_id=report.id))

    await db.commit()
    await db.refresh(report)

    return {"id": report.id, "status": report.status, "content": report.content}


@router.get("/reports/{id}")
async def get_report(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get report data by ID."""
    rep_stmt = select(Report).where(Report.id == id)
    r_res = await db.execute(rep_stmt)
    report = r_res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"id": report.id, "study_id": report.study_id, "status": report.status, "content": report.content}


@router.get("/reports/{id}/pdf")
async def download_report_pdf(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download compiled PDF report."""
    rep_stmt = select(Report).where(Report.id == id)
    r_res = await db.execute(rep_stmt)
    report = r_res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    study_dir = storage.get_study_dir(report.study_id)
    pdf_path = study_dir / f"report_{report.id}.pdf"

    # Compile PDF if not yet cached or if updated
    ReportService.render_pdf(report.content, str(pdf_path))
    report.pdf_path = str(pdf_path)
    db.add(report)
    db.add(AuditLog(user_id=current_user.id, action="download_report_pdf", entity_type="report", entity_id=report.id))
    await db.commit()

    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=f"NeuroLens_Report_{report.content.get('patient_code', 'Patient')}.pdf",
    )
