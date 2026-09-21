"""High-level MongoDB document synchronization and audit persistence service."""

import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from backend.app.core.mongodb import get_mongo_db, mongo_manager

logger = logging.getLogger("neurolens.mongo_service")


class MongoPersistenceService:
    """Synchronizes all operational entities and analysis JSON into MongoDB."""

    @staticmethod
    async def save_patient(patient_data: Dict[str, Any]) -> bool:
        """Upsert patient document."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = dict(patient_data)
            doc["updated_at"] = datetime.utcnow().isoformat()
            await db.patients.update_one(
                {"id": doc["id"]},
                {"$set": doc},
                upsert=True,
            )
            return True
        except Exception as e:
            logger.warning(f"Failed to persist patient in MongoDB: {e}")
            return False

    @staticmethod
    async def save_study(study_data: Dict[str, Any]) -> bool:
        """Upsert study document."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = dict(study_data)
            doc["updated_at"] = datetime.utcnow().isoformat()
            await db.studies.update_one(
                {"id": doc["id"]},
                {"$set": doc},
                upsert=True,
            )
            return True
        except Exception as e:
            logger.warning(f"Failed to persist study in MongoDB: {e}")
            return False

    @staticmethod
    async def save_analysis(study_id: str, analysis_result: Dict[str, Any]) -> bool:
        """Save complete Section 7.1 AnalysisResult JSON document."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = {
                "study_id": study_id,
                "result": analysis_result,
                "saved_at": datetime.utcnow().isoformat(),
            }
            await db.analyses.update_one(
                {"study_id": study_id},
                {"$set": doc},
                upsert=True,
            )
            return True
        except Exception as e:
            logger.warning(f"Failed to persist analysis in MongoDB: {e}")
            return False

    @staticmethod
    async def save_mask_revision(mask_data: Dict[str, Any]) -> bool:
        """Save mask revision record (AI v1 or doctor v2)."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = dict(mask_data)
            doc["created_at"] = datetime.utcnow().isoformat()
            await db.masks.insert_one(doc)
            return True
        except Exception as e:
            logger.warning(f"Failed to persist mask in MongoDB: {e}")
            return False

    @staticmethod
    async def save_report(report_data: Dict[str, Any]) -> bool:
        """Upsert clinical report document."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = dict(report_data)
            doc["updated_at"] = datetime.utcnow().isoformat()
            await db.reports.update_one(
                {"id": doc["id"]},
                {"$set": doc},
                upsert=True,
            )
            return True
        except Exception as e:
            logger.warning(f"Failed to persist report in MongoDB: {e}")
            return False

    @staticmethod
    async def save_comparison(comparison_data: Dict[str, Any]) -> bool:
        """Save longitudinal comparison document."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            doc = dict(comparison_data)
            doc["saved_at"] = datetime.utcnow().isoformat()
            await db.comparisons.update_one(
                {"id": doc["id"]},
                {"$set": doc},
                upsert=True,
            )
            return True
        except Exception as e:
            logger.warning(f"Failed to persist comparison in MongoDB: {e}")
            return False

    @staticmethod
    async def log_activity(
        action: str,
        user_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Log audit event directly into MongoDB activity_logs."""
        db = get_mongo_db()
        if db is None:
            return False
        try:
            log_doc = {
                "action": action,
                "user_id": user_id,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "metadata": metadata or {},
                "created_at": datetime.utcnow().isoformat(),
            }
            await db.activity_logs.insert_one(log_doc)
            return True
        except Exception as e:
            logger.warning(f"Failed to log activity in MongoDB: {e}")
            return False

    @staticmethod
    async def get_stats() -> Dict[str, Any]:
        """Return MongoDB connection status and document counts per collection."""
        db = get_mongo_db()
        if db is None or not mongo_manager.is_connected:
            return {
                "status": "disconnected",
                "is_connected": False,
                "database": None,
                "counts": {},
            }

        try:
            counts = {
                "patients": await db.patients.count_documents({}),
                "studies": await db.studies.count_documents({}),
                "analyses": await db.analyses.count_documents({}),
                "masks": await db.masks.count_documents({}),
                "reports": await db.reports.count_documents({}),
                "comparisons": await db.comparisons.count_documents({}),
                "activity_logs": await db.activity_logs.count_documents({}),
            }
            return {
                "status": "connected",
                "is_connected": True,
                "database": db.name,
                "counts": counts,
            }
        except Exception as e:
            return {
                "status": "error",
                "is_connected": False,
                "error": str(e),
                "counts": {},
            }

    @staticmethod
    async def export_collection(collection_name: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Export documents from a given collection (excluding internal _id)."""
        db = get_mongo_db()
        if db is None:
            return []
        try:
            cursor = db[collection_name].find({}, {"_id": 0}).limit(limit)
            return await cursor.to_list(length=limit)
        except Exception as e:
            logger.warning(f"Failed to export MongoDB collection {collection_name}: {e}")
            return []


mongo_service = MongoPersistenceService()
