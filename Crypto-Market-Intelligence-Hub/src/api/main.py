"""FastAPI application — Crypto Market Intelligence Hub API."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import get_settings
from src.utils.logger import setup_logging
from src.api.routers import health, historical, predictions

setup_logging()
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup → yield → shutdown."""
    logger.info("🚀 Crypto Market Intelligence Hub API starting up…")
    logger.info("Environment: %s | Data path: %s", settings.environment, settings.data_path)
    yield
    logger.info("👋 API shutting down.")


app = FastAPI(
    title="Crypto Market Intelligence Hub",
    description=(
        "Production REST API for cryptocurrency market analysis, "
        "technical indicators, and multi-model price forecasting."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(historical.router, prefix="/api/v1", tags=["Historical"])
app.include_router(predictions.router, prefix="/api/v1", tags=["Predictions"])


@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Resource not found."})


@app.exception_handler(500)
async def server_error_handler(request, exc):
    logger.exception("Unhandled server error")
    return JSONResponse(status_code=500, content={"detail": "Internal server error."})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
        log_level=settings.log_level.lower(),
    )
