"""Celery worker configuration."""

from celery import Celery
from backend.app.core.config import settings

celery_app = Celery(
    "neurolens_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
