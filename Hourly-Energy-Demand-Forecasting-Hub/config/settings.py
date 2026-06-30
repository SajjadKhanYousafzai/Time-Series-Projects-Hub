"""
config/settings.py
==================
Pydantic BaseSettings for the Energy Demand Forecasting Suite.
All configurable values live here — no hardcoded paths in src/.
"""
from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings


_PROJECT_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    # ── Project ───────────────────────────────────────────────────────────────
    project_name: str = "Hourly Energy Demand Forecasting Hub"
    version: str      = "1.0.0"
    debug: bool       = False

    # ── Paths ─────────────────────────────────────────────────────────────────
    project_root: Path  = _PROJECT_ROOT
    data_raw_dir: Path  = _PROJECT_ROOT / "datasets" / "raw"
    data_proc_dir: Path = _PROJECT_ROOT / "datasets" / "processed"
    data_int_dir: Path  = _PROJECT_ROOT / "datasets" / "interim"
    models_dir: Path    = _PROJECT_ROOT / "models"
    logs_dir: Path      = _PROJECT_ROOT / "logs"

    # ── API ───────────────────────────────────────────────────────────────────
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True

    # ── Dashboard ─────────────────────────────────────────────────────────────
    dashboard_port: int = 8501

    # ── Redis ─────────────────────────────────────────────────────────────────
    redis_host: str = "localhost"
    redis_port: int = 6379
    cache_ttl: int  = 3600   # seconds

    # ── Model Defaults ────────────────────────────────────────────────────────
    default_region: str    = "AEP"
    default_model: str     = "arima"
    default_horizon: int   = 24
    default_confidence: float = 0.95
    train_test_ratio: float   = 0.80
    cv_folds: int             = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
