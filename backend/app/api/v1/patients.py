"""Patients router (pseudonymised records)."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Patient, User
from backend.app.schemas.patient import PatientCreate, PatientOut
from backend.app.api.v1.deps import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("", response_model=PatientOut)
async def create_patient(
    patient_in: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a pseudonymised patient record (no names, only generated/code ID)."""
    # Check if patient code already exists
    stmt = select(Patient).where(Patient.code == patient_in.code)
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Patient code already exists")

    patient = Patient(
        code=patient_in.code,
        age=patient_in.age,
        sex=patient_in.sex,
        created_by=current_user.id,
    )
    db.add(patient)
    await db.commit()
    await db.refresh(patient)

    # Sync to MongoDB
    from backend.app.services.mongo_service import mongo_service
    await mongo_service.save_patient({
        "id": patient.id,
        "code": patient.code,
        "age": patient.age,
        "sex": patient.sex,
        "created_by": current_user.id,
        "created_at": patient.created_at.isoformat(),
    })
    await mongo_service.log_activity(
        action="create_patient",
        user_id=current_user.id,
        entity_type="patient",
        entity_id=patient.id,
    )

    return patient


@router.get("", response_model=List[PatientOut])
async def list_patients(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all registered pseudonymised patients."""
    stmt = select(Patient).order_by(Patient.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{id}", response_model=PatientOut)
async def get_patient(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get patient by UUID."""
    stmt = select(Patient).where(Patient.id == id)
    res = await db.execute(stmt)
    patient = res.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
