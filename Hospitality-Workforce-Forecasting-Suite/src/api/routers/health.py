"""src/api/routers/health.py"""
from fastapi import APIRouter
from ..schemas import HealthResponse
from src.data.store import load_processed

router = APIRouter()


@router.get("/api/v1/health", response_model=HealthResponse)
async def health_check():
    try:
        series = load_processed()
        records = len(series)
    except Exception:
        records = 0
    return HealthResponse(status="ok", version="1.0.0", records=records)
