"""
src/api/routers/health.py
=========================
Health check endpoint.
"""
from datetime import datetime

from fastapi import APIRouter

from ..schemas import HealthResponse
from src.data.load import list_regions
from src.data.store import list_processed_regions

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="API Health Check")
async def health_check() -> HealthResponse:
    """Returns API status, available regions, and processed regions."""
    return HealthResponse(
        status="ok",
        available_regions=list_regions(),
        processed_regions=list_processed_regions(),
        timestamp=datetime.utcnow(),
    )
