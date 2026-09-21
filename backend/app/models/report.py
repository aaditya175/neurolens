"""Clinical report model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), index=True, nullable=False)
    content = Column(JSON, nullable=False)  # structured findings, impression
    status = Column(String(32), default="draft", nullable=False)  # draft, reviewed, signed
    created_by = Column(String(36), nullable=True)
    signed_at = Column(DateTime, nullable=True)
    pdf_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
