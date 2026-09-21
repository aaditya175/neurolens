"""Pydantic schemas for Job records."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    study_id: str
    type: str
    status: str
    progress: int
    stage: str
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
