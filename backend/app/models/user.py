"""User model for authentication and RBAC."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from backend.app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="doctor", nullable=False)  # 'doctor' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
