"""Pydantic schemas for API request and response models."""
from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── OHLCV ─────────────────────────────────────────────────────────────────────

class OHLCVRecord(BaseModel):
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: Optional[float] = None
    asset: str


class HistoricalResponse(BaseModel):
    asset: str
    currency: str = "USD"
    records: list[OHLCVRecord]
    total: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    model_config = {"json_encoders": {datetime: lambda v: v.isoformat()}}


# ── Predictions ───────────────────────────────────────────────────────────────

class PredictionRequest(BaseModel):
    asset: str = Field(..., examples=["bitcoin"], description="Asset identifier")
    model: str = Field(
        default="prophet",
        examples=["prophet", "arima", "lstm", "gru"],
        description="Forecasting model to use",
    )
    horizon: int = Field(default=30, ge=1, le=90, description="Forecast horizon in days")


class ForecastPoint(BaseModel):
    date: datetime
    predicted: float
    lower: Optional[float] = None
    upper: Optional[float] = None


class PredictionResponse(BaseModel):
    asset: str
    model: str
    horizon: int
    current_price: Optional[float] = None
    forecast: list[ForecastPoint]
    metrics: Optional[dict] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Health ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    checks: dict[str, str] = Field(default_factory=dict)


# ── Market Summary ────────────────────────────────────────────────────────────

class AssetSummary(BaseModel):
    asset: str
    rows: int
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    mean_close: Optional[float] = None
    max_close: Optional[float] = None
    min_close: Optional[float] = None
    sharpe_ratio: Optional[float] = None
