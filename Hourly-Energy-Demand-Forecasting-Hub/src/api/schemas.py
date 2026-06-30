"""
src/api/schemas.py
==================
Pydantic v2 request/response schemas for the Energy Forecasting API.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    available_regions: list[str]
    processed_regions: list[str]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HistoryPoint(BaseModel):
    datetime: datetime
    MW: float


class HistoryResponse(BaseModel):
    region: str
    n_records: int
    start: datetime
    end: datetime
    data: list[HistoryPoint]


class PredictRequest(BaseModel):
    region: str = Field("AEP", description="PJM region key (e.g. AEP, PJME, COMED)")
    model: Literal["arima", "xgboost", "lstm"] = Field(
        "arima", description="Forecasting model to use"
    )
    horizon: int = Field(24, ge=1, le=168, description="Forecast horizon in hours (1–168)")
    confidence: float = Field(0.95, ge=0.80, le=0.99, description="Confidence interval level")


class ForecastPoint(BaseModel):
    datetime: datetime
    forecast_MW: float
    lower_MW: Optional[float] = None
    upper_MW: Optional[float] = None


class PredictResponse(BaseModel):
    region: str
    model: str
    horizon: int
    confidence: float
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    forecast: list[ForecastPoint]


class DecomposeResponse(BaseModel):
    region: str
    model: Literal["additive", "multiplicative"] = "additive"
    period: int
    trend: list[float]
    seasonal: list[float]
    residual: list[float]
    dates: list[datetime]


class StationarityResponse(BaseModel):
    region: str
    series: Literal["raw", "diff1", "log_returns"]
    adf_statistic: float
    adf_p_value: float
    adf_critical_1pct: float
    adf_critical_5pct: float
    kpss_statistic: float
    kpss_p_value: float
    is_stationary: bool
    interpretation: str
