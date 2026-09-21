"""Unit and Integration Tests for MongoDB Document Persistence."""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.services.mongo_service import MongoPersistenceService
from backend.app.core.mongodb import mongo_manager


@pytest.mark.asyncio
async def test_mongo_service_offline_resilience():
    """Verify that MongoPersistenceService methods handle offline states gracefully without raising exceptions."""
    service = MongoPersistenceService()

    # Even if MongoDB server is offline or disconnected, all methods return False/empty without crashing
    saved_pat = await service.save_patient({"id": "pt-test", "code": "PT-01"})
    assert isinstance(saved_pat, bool)

    saved_study = await service.save_study({"id": "study-test", "patient_id": "pt-test"})
    assert isinstance(saved_study, bool)

    saved_analysis = await service.save_analysis("study-test", {"status": "ok", "volumes": {"WT": 10.5}})
    assert isinstance(saved_analysis, bool)

    saved_mask = await service.save_mask_revision({"study_id": "study-test", "mask_version": 2})
    assert isinstance(saved_mask, bool)

    saved_report = await service.save_report({"id": "rep-test", "study_id": "study-test", "content": {}})
    assert isinstance(saved_report, bool)

    saved_comp = await service.save_comparison({"id": "comp-test", "patient_id": "pt-test", "result": {}})
    assert isinstance(saved_comp, bool)

    logged = await service.log_activity("test_action", user_id="user-1")
    assert isinstance(logged, bool)

    stats = await service.get_stats()
    assert "status" in stats
    assert "counts" in stats

    exported = await service.export_collection("studies")
    assert isinstance(exported, list)


@pytest.mark.asyncio
async def test_mongo_stats_endpoint():
    """Verify GET /api/v1/mongo/stats returns connection and collection metrics."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/mongo/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert "is_connected" in data
        assert "counts" in data
