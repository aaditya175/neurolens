"""Test health and metadata endpoints."""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "neurolens-api"
    assert "disclaimer" in data
    assert "not a medical device" in data["disclaimer"]
    assert "X-Clinical-Disclaimer" in response.headers


def test_version():
    response = client.get("/version")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "NeuroLens API"
    assert "version" in data


def test_model_info():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "segmentation" in data
    assert "classical_ml" in data
    assert "dbscan" in data["classical_ml"]
    assert "kmeans_gmm" in data["classical_ml"]
