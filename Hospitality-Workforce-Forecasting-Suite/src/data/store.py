"""
src/data/store.py
=================
Persist cleaned time series to Parquet for fast downstream reads.
"""
from __future__ import annotations

import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED = _PROJECT_ROOT / "data" / "processed"


def save_series(series: pd.Series, filename: str = "hospitality.parquet") -> Path:
    """Save a pd.Series (with DatetimeIndex) as Parquet."""
    PROCESSED.mkdir(parents=True, exist_ok=True)
    out = PROCESSED / filename
    df = series.reset_index()
    df.columns = ["date", "employees"]
    df.to_parquet(out, index=False, engine="pyarrow", compression="snappy")
    logger.info("Saved -> %s  (%d rows, %.1f KB)", out.name, len(df), out.stat().st_size / 1024)
    return out


def load_processed(filename: str = "hospitality.parquet") -> pd.Series:
    """Load processed Parquet back into a DatetimeIndex Series."""
    path = PROCESSED / filename
    if not path.exists():
        raise FileNotFoundError(f"Processed file not found: {path}. Run the pipeline first.")
    df = pd.read_parquet(path)
    series = df.set_index("date")["employees"]
    series.index = pd.to_datetime(series.index)
    series = series.asfreq("MS")
    return series
