"""API v1 router registry."""

from fastapi import APIRouter
from .auth import router as auth_router
from .patients import router as patients_router
from .studies import router as studies_router
from .jobs import router as jobs_router
from .reports import router as reports_router
from .comparisons import router as comparisons_router
from .worklist import router as worklist_router
from .insights import router as insights_router
from .audit import router as audit_router
from .mongodb_export import router as mongo_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(patients_router)
api_router.include_router(studies_router)
api_router.include_router(jobs_router)
api_router.include_router(reports_router)
api_router.include_router(comparisons_router)
api_router.include_router(worklist_router)
api_router.include_router(insights_router)
api_router.include_router(audit_router)
api_router.include_router(mongo_router)

__all__ = ["api_router"]

