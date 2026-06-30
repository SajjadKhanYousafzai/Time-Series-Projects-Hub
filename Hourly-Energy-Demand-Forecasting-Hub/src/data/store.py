"""
src/data/store.py
=================
Save and load processed DataFrames as Parquet via PyArrow.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)

_THIS_FILE    = Path(__file__).resolve()
_PROJECT_ROOT = _THIS_FILE.parents[2]
_PROCESSED    = _PROJECT_ROOT / "datasets" / "processed"


def save_parquet(
    df: pd.DataFrame,
    region: str,
    processed_dir: Optional[Path] = None,
) -> Path:
    """
    Save a cleaned DataFrame to data/processed/{region}.parquet.

    Parameters
    ----------
    df           : DataFrame  Must have DatetimeIndex and 'MW' column.
    region       : str        Region key (e.g. 'AEP').
    processed_dir: Path       Override processed directory.

    Returns
    -------
    Path  Path to the saved parquet file.
    """
    out_dir = processed_dir or _PROCESSED
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{region.upper()}.parquet"
    df.to_parquet(path, engine="pyarrow", compression="snappy")
    logger.info("Saved %s → %s  (%.1f KB)", region, path, path.stat().st_size / 1024)
    return path


def load_parquet(
    region: str,
    processed_dir: Optional[Path] = None,
) -> pd.DataFrame:
    """
    Load a processed region DataFrame from data/processed/{region}.parquet.

    Parameters
    ----------
    region       : str   Region key.
    processed_dir: Path  Override processed directory.

    Returns
    -------
    pd.DataFrame  Hourly DataFrame with DatetimeIndex and 'MW' column.
    """
    out_dir = processed_dir or _PROCESSED
    path    = out_dir / f"{region.upper()}.parquet"

    if not path.exists():
        raise FileNotFoundError(
            f"Processed parquet not found: {path}\n"
            f"Run `python scripts/run_pipeline.py` first."
        )

    df = pd.read_parquet(path, engine="pyarrow")
    df.index = pd.to_datetime(df.index)
    df.index.name = "datetime"
    logger.info("Loaded %s from parquet: %d records", region, len(df))
    return df


def list_processed_regions(processed_dir: Optional[Path] = None) -> list[str]:
    """Return list of regions that have a processed parquet file."""
    out_dir = processed_dir or _PROCESSED
    return [p.stem for p in sorted(out_dir.glob("*.parquet"))]
