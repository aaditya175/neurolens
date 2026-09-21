"""Pydantic schemas for Patient records."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PatientCreate(BaseModel):
    code: str = Field(min_length=3, max_length=64, description="Pseudonymised code, e.g. PT-10492")
    age: Optional[int] = Field(None, ge=0, le=130)
    sex: Optional[str] = Field(None, pattern="^(M|F|Other)$")


class PatientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    age: Optional[int] = None
    sex: Optional[str] = None
    created_at: datetime
