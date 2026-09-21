"""Mask model for tracking AI vs Doctor-edited segmentation versions."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from backend.app.core.database import Base


class Mask(Base):
    __tablename__ = "masks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), index=True, nullable=False)
    version = Column(Integer, default=1, nullable=False)
    source = Column(String(16), default="ai", nullable=False)  # 'ai' or 'doctor'
    path = Column(String(512), nullable=False)
    created_by = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
