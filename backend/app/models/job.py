"""Job model for tracking async Celery pipeline tasks."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from backend.app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), index=True, nullable=False)
    type = Column(String(32), default="analysis", nullable=False)  # analysis, comparison
    status = Column(String(32), default="queued", nullable=False)  # queued, running, done, failed
    progress = Column(Integer, default=0, nullable=False)  # 0 to 100
    stage = Column(String(64), default="queued", nullable=False)  # qc, preprocess, segment, postprocess, classify, etc.
    error = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
