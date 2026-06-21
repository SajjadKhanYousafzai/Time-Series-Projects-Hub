"""Application settings using Pydantic BaseSettings.

All values can be overridden via environment variables or a .env file.
"""
from __future__ import annotations

from pathlib import Path
from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Paths ────────────────────────────────────────────────────────────────
    data_path: Path = Field(default=ROOT_DIR / "data" / "raw", description="Raw data directory")
    processed_path: Path = Field(default=ROOT_DIR / "data" / "processed", description="Processed data directory")
    models_path: Path = Field(default=ROOT_DIR / "data" / "models", description="Saved models directory")

    # ── API ──────────────────────────────────────────────────────────────────
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_reload: bool = Field(default=False)
    secret_key: str = Field(default="changeme-in-production")
    allowed_origins: list[str] = Field(default=["http://localhost:3000", "http://localhost:8501"])

    # ── External APIs ────────────────────────────────────────────────────────
    coinmarketcap_api_key: str = Field(default="")
    coingecko_api_key: str = Field(default="")  # optional — free tier works without key

    # ── MLflow / Experiment Tracking ─────────────────────────────────────────
    mlflow_tracking_uri: str = Field(default="")

    # ── Cache ────────────────────────────────────────────────────────────────
    redis_url: str = Field(default="redis://localhost:6379/0")
    cache_ttl_seconds: int = Field(default=300)

    # ── Logging ──────────────────────────────────────────────────────────────
    log_level: str = Field(default="INFO")
    log_format: str = Field(default="json")  # "json" | "text"

    # ── Monitoring ───────────────────────────────────────────────────────────
    sentry_dsn: str = Field(default="")

    # ── Misc ─────────────────────────────────────────────────────────────────
    pythonunbuffered: int = Field(default=1)
    environment: str = Field(default="development")  # development | staging | production

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def data_raw_dir(self) -> Path:
        return self.data_path

    @property
    def data_processed_dir(self) -> Path:
        return self.processed_path


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
