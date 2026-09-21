"""Tests for Authentication endpoints."""

import uuid
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_auth_flow():
    unique_email = f"admin_{uuid.uuid4().hex[:6]}@neurolens.local"
    
    # 1. Register user
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": unique_email, "password": "admin_secure_password_123", "role": "admin"},
    )
    assert reg_res.status_code == 200, reg_res.text
    reg_data = reg_res.json()
    assert reg_data["email"] == unique_email
    assert reg_data["role"] == "admin"

    # 2. Login with credentials
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": "admin_secure_password_123"},
    )
    assert login_res.status_code == 200, login_res.text
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    token = token_data["access_token"]

    # 3. Check /me with token
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    me_data = me_res.json()
    assert me_data["email"] == unique_email
