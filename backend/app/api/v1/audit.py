"""Audit Log Router (Section 7, 8, 11)."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models import AuditLog, User
from backend.app.api.v1.deps import get_current_user

router = APIRouter(tags=["Audit"])


@router.get("/audit-log")
async def get_audit_log(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve compliance audit trail entries."""
    stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    res = await db.execute(stmt)
    entries = res.scalars().all()

    return [
        {
            "id": entry.id,
            "user_id": entry.user_id,
            "action": entry.action,
            "entity_type": entry.entity_type,
            "entity_id": entry.entity_id,
            "ip": entry.ip,
            "created_at": entry.created_at.isoformat(),
        }
        for entry in entries
    ]
