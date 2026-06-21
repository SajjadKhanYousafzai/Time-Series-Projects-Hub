"""Unit tests for the FastAPI health endpoint."""
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)


def test_health_returns_200():
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_response_schema():
    response = client.get("/api/v1/health")
    data = response.json()
    assert "status" in data
    assert "version" in data
    assert "environment" in data
    assert data["status"] == "ok"


def test_docs_accessible():
    response = client.get("/docs")
    assert response.status_code == 200


def test_unknown_route_returns_404():
    response = client.get("/api/v1/nonexistent")
    assert response.status_code == 404
