"""Shared FastAPI dependencies."""
from __future__ import annotations

from pathlib import Path
from typing import Annotated

from fastapi import Depends

from config.settings import Settings, get_settings


def get_data_path(settings: Annotated[Settings, Depends(get_settings)]) -> Path:
    """Return the raw data directory path."""
    return settings.data_raw_dir


def get_processed_path(settings: Annotated[Settings, Depends(get_settings)]) -> Path:
    """Return the processed data directory path."""
    return settings.data_processed_dir
