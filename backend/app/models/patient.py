"""Patient model (strictly pseudonymised, no names or direct PHI)."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from backend.app.core.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(64), unique=True, index=True, nullable=False)  # e.g., "PT-A82F9"
    age = Column(Integer, nullable=True)
    sex = Column(String(10), nullable=True)  # "M", "F", "Other"
    created_by = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
