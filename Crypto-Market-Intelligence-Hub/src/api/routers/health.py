"""Health check router."""
from datetime import datetime

from fastapi import APIRouter

from src.api.schemas import HealthResponse
from config.settings import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check() -> HealthResponse:
    """Return API health status and version."""
    checks: dict[str, str] = {}

    # Check data path accessibility
    try:
        data_ok = settings.data_raw_dir.exists()
        checks["data_dir"] = "ok" if data_ok else "missing"
    except Exception:
        checks["data_dir"] = "error"

    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.environment,
        timestamp=datetime.utcnow(),
        checks=checks,
    )
