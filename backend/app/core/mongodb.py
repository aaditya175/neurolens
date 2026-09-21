"""Asynchronous MongoDB connection manager using Motor."""

import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings

logger = logging.getLogger("neurolens.mongodb")


class MongoDBManager:
    """Manages AsyncIOMotorClient lifecycle and database access."""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None
        self.is_connected: bool = False

    async def connect(self):
        """Establish asynchronous connection to MongoDB and ensure indexes."""
        if not settings.MONGODB_ENABLED:
            logger.info("MongoDB persistence is disabled via configuration.")
            return

        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=2000,
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            # Ping database to verify connection
            await self.client.admin.command("ping")
            self.is_connected = True
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URL} (db: {settings.MONGODB_DB_NAME})")

            # Initialize indexes
            await self._create_indexes()
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB connection notice: Unable to reach {settings.MONGODB_URL} ({e}). Running in offline/graceful fallback mode.")

    async def _create_indexes(self):
        """Ensure standard query indexes exist across collections."""
        if not self.is_connected or self.db is None:
            return

        try:
            # Patients index
            await self.db.patients.create_index("id", unique=True)
            await self.db.patients.create_index("code")

            # Studies index
            await self.db.studies.create_index("id", unique=True)
            await self.db.studies.create_index("patient_id")

            # Analyses index
            await self.db.analyses.create_index("study_id", unique=True)

            # Masks index
            await self.db.masks.create_index("study_id")

            # Reports index
            await self.db.reports.create_index("study_id")
            await self.db.reports.create_index("id", unique=True)

            # Comparisons index
            await self.db.comparisons.create_index("patient_id")

            # Audit logs index
            await self.db.activity_logs.create_index("created_at")
        except Exception as e:
            logger.warning(f"Index creation notice: {e}")

    async def close(self):
        """Close MongoDB connection gracefully."""
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")


mongo_manager = MongoDBManager()


def get_mongo_db() -> Optional[AsyncIOMotorDatabase]:
    """Get active MongoDB database instance if connected."""
    if mongo_manager.is_connected:
        return mongo_manager.db
    return None
