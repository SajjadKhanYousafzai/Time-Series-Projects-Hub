"""
src/api/main.py
===============
FastAPI application for the Hospitality Workforce Forecasting Suite.
"""
from __future__ import annotations

import logging
import logging.config
from contextlib import asynccontextmanager
from pathlib import Path

import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health, historical, predictions

# ── Logging ───────────────────────────────────────────────────────────────────
LOG_CFG = Path(__file__).resolve().parents[3] / "config" / "logging.yaml"
Path("logs").mkdir(exist_ok=True)
if LOG_CFG.exists():
    with open(LOG_CFG) as f:
        logging.config.dictConfig(yaml.safe_load(f))

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Hospitality Workforce Forecasting Suite API starting up")
    yield
    logger.info("API shutting down")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hospitality Workforce Forecasting Suite",
    description=(
        "REST API for California hospitality employment analysis. "
        "Historical data (1990-2018), SARIMA & Holt-Winters forecasts, "
        "seasonal decomposition, and stationarity diagnostics."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8501", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router,      tags=["Health"])
app.include_router(historical.router,  prefix="/api/v1", tags=["Historical Data"])
app.include_router(predictions.router, prefix="/api/v1", tags=["Forecasting"])
