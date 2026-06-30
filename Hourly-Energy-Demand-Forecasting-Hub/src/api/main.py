"""
src/api/main.py
===============
FastAPI application entry-point for the Energy Demand Forecasting API.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .routers import health, history, predict

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("⚡ Energy Forecasting API starting up…")
    yield
    logger.info("⚡ Energy Forecasting API shutting down.")


app = FastAPI(
    title="⚡ Hourly Energy Demand Forecasting API",
    description=(
        "REST API for PJM regional hourly energy demand forecasting. "
        "Provides historical data, time series decomposition, stationarity tests, "
        "and multi-model forecasts (ARIMA · XGBoost · LSTM)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router,   prefix="/api/v1", tags=["Health"])
app.include_router(history.router,  prefix="/api/v1", tags=["History"])
app.include_router(predict.router,  prefix="/api/v1", tags=["Forecast"])


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to Swagger UI."""
    return RedirectResponse(url="/docs")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
