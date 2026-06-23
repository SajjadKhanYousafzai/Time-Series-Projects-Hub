"""src/api/schemas.py — Pydantic v2 request/response models."""
from __future__ import annotations
from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    records: int = 0


class EmploymentPoint(BaseModel):
    date: date
    employees: float = Field(..., description="Employment in thousands")


class HistoricalResponse(BaseModel):
    series: list[EmploymentPoint]
    total_records: int
    start_date: date
    end_date: date
    min_employees: float
    max_employees: float
    mean_employees: float


class ForecastRequest(BaseModel):
    model: str = Field("sarima", description="Model: 'sarima', 'holt_winters', or 'naive'")
    horizon: int = Field(24, ge=1, le=60, description="Months ahead to forecast")
    confidence: float = Field(0.95, ge=0.5, le=0.99, description="Confidence interval level")


class ForecastPoint(BaseModel):
    date: date
    forecast: float
    lower: Optional[float] = None
    upper: Optional[float] = None


class ForecastResponse(BaseModel):
    model: str
    horizon: int
    confidence: float
    forecast: list[ForecastPoint]
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None


class DecompositionPoint(BaseModel):
    date: date
    observed: float
    trend: Optional[float] = None
    seasonal: float
    residual: Optional[float] = None


class DecompositionResponse(BaseModel):
    model: str = "additive"
    period: int = 12
    components: list[DecompositionPoint]


class StationarityResponse(BaseModel):
    adf_statistic: float
    adf_p_value: float
    adf_is_stationary: bool
    kpss_statistic: float
    kpss_p_value: float
    kpss_is_stationary: bool
    interpretation: str
