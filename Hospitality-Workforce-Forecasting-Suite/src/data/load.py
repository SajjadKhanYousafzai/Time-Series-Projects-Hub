"""
src/data/load.py
================
Load the Hospitality Employees CSV into a clean, date-indexed Pandas Series.
"""
from __future__ import annotations

import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)

# src/data/load.py → parents: [0]=src/data, [1]=src, [2]=project_root
_THIS_FILE = Path(__file__).resolve()
_PROJECT_ROOT = _THIS_FILE.parents[2]
DEFAULT_CSV = _PROJECT_ROOT / "data" / "raw" / "HospitalityEmployees.csv"


def load_hospitality(path: Path | str = DEFAULT_CSV) -> pd.Series:
    """
    Load the HospitalityEmployees.csv file.

    The raw CSV has alternating lines:
        date (MM/DD/YYYY)
        employees (float, thousands)

    Returns
    -------
    pd.Series
        Monthly employment (thousands), DatetimeIndex, freq='MS'.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")

    raw = path.read_text(encoding="utf-8").strip().splitlines()
    if len(raw) % 2 != 0:
        raise ValueError(f"Expected even number of lines (date+value pairs), got {len(raw)}")

    dates, values = [], []
    for i in range(0, len(raw), 2):
        dates.append(raw[i].strip())
        values.append(float(raw[i + 1].strip()))

    series = pd.Series(
        data=values,
        index=pd.to_datetime(dates, format="%m/%d/%Y"),
        name="employees",
        dtype="float64",
    )
    series.index.name = "date"
    series = series.asfreq("MS")  # Month Start frequency
    series = series.sort_index()

    logger.info(
        "Loaded %d monthly records from %s to %s",
        len(series), series.index[0].date(), series.index[-1].date(),
    )
    return series


def load_as_dataframe(path: Path | str = DEFAULT_CSV) -> pd.DataFrame:
    """Return as a DataFrame with a 'date' column for API serialisation."""
    s = load_hospitality(path)
    return s.reset_index().rename(columns={"index": "date"})
