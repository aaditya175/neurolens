"""Jobs router for polling async pipeline execution."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import Job, User
from backend.app.schemas.job import JobOut
from backend.app.api.v1.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/{id}", response_model=JobOut)
async def get_job_status(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the live status, progress %, and current pipeline stage of an analysis job."""
    stmt = select(Job).where(Job.id == id)
    res = await db.execute(stmt)
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
