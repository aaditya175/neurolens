"""Study model for MRI studies."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class Study(Base):
    __tablename__ = "studies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), index=True, nullable=False)
    acquired_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(32), default="uploaded", nullable=False)  # uploaded, analyzing, analyzed, failed
    sequences_present = Column(JSON, default=list, nullable=False)  # ['t1', 't1ce', 't2', 'flair']
    storage_path = Column(String(512), nullable=False)
    created_by = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
