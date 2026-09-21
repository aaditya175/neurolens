"""Audit log and Case Embedding models."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    action = Column(String(64), nullable=False)  # view, upload, edit_mask, export_pdf, delete
    entity_type = Column(String(32), nullable=False)  # study, patient, report, mask
    entity_id = Column(String(36), nullable=False)
    ip = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)


class CaseEmbedding(Base):
    __tablename__ = "case_embeddings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), unique=True, index=True, nullable=False)
    embedding = Column(JSON, nullable=False)  # Array of floats
    label = Column(String(64), nullable=False)  # glioma, meningioma, etc.
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
