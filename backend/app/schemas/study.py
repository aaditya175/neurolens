"""Pydantic schemas for Study records."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class StudyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    acquired_at: datetime
    status: str
    sequences_present: List[str]
    created_at: datetime


class StudyUploadResponse(BaseModel):
    study_id: str
    patient_id: str
    status: str
    sequences_detected: List[str]
    message: str
