# ── Config / Settings ──────────────────────────────────────────────────────────
from __future__ import annotations
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    environment: str = "development"
    log_level: str = "INFO"
    log_format: str = "text"

    # Paths
    data_path: Path = ROOT / "data" / "raw"
    processed_path: Path = ROOT / "data" / "processed"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True
    secret_key: str = "changeme-set-a-strong-secret-in-production"
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:8501"]

    # Frontend
    next_public_api_url: str = "http://localhost:8000"

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl_seconds: int = 300

    # Model defaults
    forecast_horizon: int = 24   # months ahead
    cv_folds: int = 5
    train_test_ratio: float = 0.8


settings = Settings()
