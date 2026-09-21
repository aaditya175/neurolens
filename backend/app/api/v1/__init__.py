"""API v1 router registry."""

from fastapi import APIRouter
from .auth import router as auth_router
from .patients import router as patients_router
from .studies import router as studies_router
from .jobs import router as jobs_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(patients_router)
api_router.include_router(studies_router)
api_router.include_router(jobs_router)

__all__ = ["api_router"]
