"""MongoDB Document Inspection and Synchronization API."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from backend.app.services.mongo_service import mongo_service
from backend.app.models import User
from backend.app.api.v1.deps import get_current_user

router = APIRouter(prefix="/mongo", tags=["MongoDB Persistence"])


@router.get("/stats")
async def get_mongodb_status():
    """Retrieve MongoDB connection health and document statistics."""
    stats = await mongo_service.get_stats()
    return stats


@router.get("/export/{collection_name}")
async def export_mongodb_collection(
    collection_name: str,
    limit: int = Query(50, ge=1, le=500),
    current_user: User = Depends(get_current_user),
):
    """Export raw documents from a specific MongoDB collection."""
    allowed = ["patients", "studies", "analyses", "masks", "reports", "comparisons", "activity_logs"]
    if collection_name not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid collection. Allowed collections: {', '.join(allowed)}",
        )

    docs = await mongo_service.export_collection(collection_name, limit=limit)
    return {
        "collection": collection_name,
        "count": len(docs),
        "documents": docs,
    }
