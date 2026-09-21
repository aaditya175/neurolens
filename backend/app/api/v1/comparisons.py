"""Comparisons and Longitudinal Analysis Router (Section 5.8)."""

import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Study, Patient, Analysis, Comparison, User, AuditLog
from backend.app.api.v1.deps import get_current_user
from neurolens_ml.longitudinal.rano import RANOEvaluator

router = APIRouter(tags=["Comparisons"])


@router.post("/patients/{id}/compare")
async def create_study_comparison(
    id: str,
    body: dict = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enqueue longitudinal comparison between baseline and follow-up studies with RANO evaluation."""
    baseline_id = body.get("baseline_study_id")
    followup_id = body.get("followup_study_id")

    if not baseline_id or not followup_id:
        raise HTTPException(status_code=400, detail="Both baseline_study_id and followup_study_id are required")

    # Fetch analyses
    b_stmt = select(Analysis).where(Analysis.study_id == baseline_id)
    f_stmt = select(Analysis).where(Analysis.study_id == followup_id)

    b_res = await db.execute(b_stmt)
    f_res = await db.execute(f_stmt)

    b_analysis = b_res.scalar_one_or_none()
    f_analysis = f_res.scalar_one_or_none()

    if not b_analysis or not f_analysis:
        raise HTTPException(status_code=400, detail="Both studies must have completed analyses before comparison.")

    # Evaluate RANO criteria
    evaluator = RANOEvaluator()
    b_regions = b_analysis.result.get("segmentation", {}).get("regions", {})
    f_regions = f_analysis.result.get("segmentation", {}).get("regions", {})
    b_lesions = b_analysis.result.get("segmentation", {}).get("lesion_count", 1)
    f_lesions = f_analysis.result.get("segmentation", {}).get("lesion_count", 1)

    comp_result = evaluator.evaluate_comparison(
        baseline_study_id=baseline_id,
        followup_study_id=followup_id,
        baseline_regions=b_regions,
        followup_regions=f_regions,
        baseline_lesion_count=b_lesions,
        followup_lesion_count=f_lesions,
    )

    # Save to database
    comparison_id = str(uuid.uuid4())
    comparison = Comparison(
        id=comparison_id,
        patient_id=id,
        baseline_study_id=baseline_id,
        followup_study_id=followup_id,
        result=comp_result.model_dump(),
    )
    db.add(comparison)
    db.add(AuditLog(user_id=current_user.id, action="longitudinal_comparison", entity_type="comparison", entity_id=comparison_id))

    await db.commit()
    await db.refresh(comparison)

    return comparison.result


@router.get("/comparisons/{id}")
async def get_comparison(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve saved comparison record."""
    stmt = select(Comparison).where(Comparison.id == id)
    res = await db.execute(stmt)
    comp = res.scalar_one_or_none()
    if not comp:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return comp.result


@router.get("/patients/{id}/timeline")
async def get_patient_timeline(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve ordered volumetric time-series points across patient studies."""
    stmt = select(Study).where(Study.patient_id == id).order_by(Study.created_at.asc())
    s_res = await db.execute(stmt)
    studies = s_res.scalars().all()

    points = []
    for s in studies:
        a_stmt = select(Analysis).where(Analysis.study_id == s.id)
        a_res = await db.execute(a_stmt)
        analysis = a_res.scalar_one_or_none()

        if analysis and isinstance(analysis.result, dict):
            seg = analysis.result.get("segmentation", {})
            regions = seg.get("regions", {})
            points.append({
                "study_id": s.id,
                "date": s.created_at.strftime("%Y-%m-%d"),
                "wt_volume_ml": regions.get("WT", {}).get("volume_ml", 0.0),
                "tc_volume_ml": regions.get("TC", {}).get("volume_ml", 0.0),
                "et_volume_ml": regions.get("ET", {}).get("volume_ml", 0.0),
                "midline_shift_mm": analysis.result.get("location", {}).get("midline_shift_mm", 0.0),
                "urgency_score": analysis.result.get("urgency", {}).get("score", 0.0),
            })

    return {"patient_id": id, "data_points": points}
