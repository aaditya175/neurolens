"""Analysis model storing Section 7.1 JSON results."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), unique=True, index=True, nullable=False)
    result = Column(JSON, nullable=False)  # Full Section 7.1 AnalysisResult JSON
    model_versions = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
