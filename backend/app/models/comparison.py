"""Longitudinal comparison model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), index=True, nullable=False)
    baseline_study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    followup_study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    result = Column(JSON, nullable=False)  # volume deltas, RANO classification, etc.
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
