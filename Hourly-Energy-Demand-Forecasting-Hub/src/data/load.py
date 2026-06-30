"""
src/data/load.py
================
Load any PJM regional hourly energy CSV into a clean, datetime-indexed DataFrame.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)

_THIS_FILE   = Path(__file__).resolve()
_PROJECT_ROOT = _THIS_FILE.parents[2]
_RAW_DIR     = _PROJECT_ROOT / "datasets" / "raw"

# Canonical region → filename mapping
REGION_FILES: dict[str, str] = {
    "AEP":      "AEP_hourly.csv",
    "COMED":    "COMED_hourly.csv",
    "DAYTON":   "DAYTON_hourly.csv",
    "DEOK":     "DEOK_hourly.csv",
    "DOM":      "DOM_hourly.csv",
    "DUQ":      "DUQ_hourly.csv",
    "EKPC":     "EKPC_hourly.csv",
    "FE":       "FE_hourly.csv",
    "NI":       "NI_hourly.csv",
    "PJME":     "PJME_hourly.csv",
    "PJMW":     "PJMW_hourly.csv",
    "PJM_LOAD": "PJM_Load_hourly.csv",
    "PJM_EST":  "pjm_hourly_est.csv",
}


def list_regions() -> list[str]:
    """Return list of available region keys."""
    return sorted(REGION_FILES.keys())


def load_region(
    region: str,
    raw_dir: Optional[Path] = None,
    freq: str = "h",
) -> pd.DataFrame:
    """
    Load a PJM regional hourly CSV file.

    Parameters
    ----------
    region  : str   Region key (e.g. 'AEP', 'PJME'). Case-insensitive.
    raw_dir : Path  Override data/raw directory.
    freq    : str   Resampling frequency. Default 'h' (hourly).

    Returns
    -------
    pd.DataFrame
        DataFrame with DatetimeIndex (UTC-naive) and a single 'MW' column.
    """
    region = region.upper()
    if region not in REGION_FILES:
        raise ValueError(
            f"Unknown region '{region}'. Available: {list_regions()}"
        )

    raw_dir = raw_dir or _RAW_DIR
    path    = raw_dir / REGION_FILES[region]

    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")

    df = pd.read_csv(path, parse_dates=["Datetime"])
    # Normalise column names
    df.columns = [c.strip() for c in df.columns]
    value_col  = [c for c in df.columns if c != "Datetime"][0]
    df = df.rename(columns={"Datetime": "datetime", value_col: "MW"})
    df = df.set_index("datetime").sort_index()
    df.index.name = "datetime"

    # Resample to ensure regular hourly frequency
    df = df.resample(freq).mean()

    logger.info(
        "Loaded %s: %d hourly records  (%s → %s)",
        region, len(df), df.index[0].date(), df.index[-1].date(),
    )
    return df


def load_all_regions(raw_dir: Optional[Path] = None) -> dict[str, pd.DataFrame]:
    """Load all available regions into a dict keyed by region name."""
    results: dict[str, pd.DataFrame] = {}
    for region in list_regions():
        try:
            results[region] = load_region(region, raw_dir=raw_dir)
        except FileNotFoundError:
            logger.warning("Skipping %s — file not found.", region)
    return results


def load_est_parquet(raw_dir: Optional[Path] = None) -> pd.DataFrame:
    """Load the est_hourly.parquet file (pre-combined PJM estimated series)."""
    raw_dir = raw_dir or _RAW_DIR
    path = raw_dir / "est_hourly.paruqet"   # note: original typo preserved
    if not path.exists():
        path = raw_dir / "est_hourly.parquet"
    df = pd.read_parquet(path)
    df.index = pd.to_datetime(df.index)
    df.index.name = "datetime"
    return df.sort_index()
