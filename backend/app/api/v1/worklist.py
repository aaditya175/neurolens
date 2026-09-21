"""Triage Worklist Router (Section 6.7, 7, 9.2)."""

from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Study, Patient, Analysis, User
from backend.app.api.v1.deps import get_current_user

router = APIRouter(tags=["Worklist"])


@router.get("/worklist")
async def get_triage_worklist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve prioritized triage study worklist ranked by urgency score."""
    stmt = select(Study).order_by(Study.created_at.desc())
    s_res = await db.execute(stmt)
    studies = s_res.scalars().all()

    worklist_items = []
    for s in studies:
        p_stmt = select(Patient).where(Patient.id == s.patient_id)
        p_res = await db.execute(p_stmt)
        patient = p_res.scalar_one_or_none()

        a_stmt = select(Analysis).where(Analysis.study_id == s.id)
        a_res = await db.execute(a_stmt)
        analysis = a_res.scalar_one_or_none()

        urgency_score = 0.20
        badges = []
        tumour_type = "unknown"
        needs_review = False

        if analysis and isinstance(analysis.result, dict):
            urg = analysis.result.get("urgency", {})
            urgency_score = urg.get("score", 0.20)
            clf = analysis.result.get("classification", {})
            tumour_type = clf.get("ensemble", {}).get("label", "unknown")
            unc = analysis.result.get("uncertainty", {})
            needs_review = unc.get("needs_review", False)

            if needs_review:
                badges.append("needs_review")
            loc = analysis.result.get("location", {})
            if loc.get("midline_shift_mm", 0.0) > 2.0:
                badges.append("mass_effect")
            seg = analysis.result.get("segmentation", {})
            if seg.get("lesion_count", 1) > 1:
                badges.append("multifocal")

        worklist_items.append({
            "study_id": s.id,
            "patient_id": s.patient_id,
            "patient_code": patient.code if patient else "UNKNOWN",
            "status": s.status,
            "tumour_type": tumour_type,
            "urgency_score": round(urgency_score, 2),
            "needs_review": needs_review,
            "badges": badges,
            "created_at": s.created_at.isoformat(),
        })

    # Sort descending by urgency score
    worklist_items.sort(key=lambda x: x["urgency_score"], reverse=True)
    return worklist_items
