"""Pydantic schemas for Users and Authentication."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class UserCreate(BaseModel):
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$")
    password: str = Field(min_length=6)
    role: str = "doctor"  # 'doctor' or 'admin'


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenRefreshRequest(BaseModel):
    refresh_token: str
