import pandas as pd

# Columns that must be numeric
_NUMERIC_COLS = ("open", "high", "low", "close", "volume")


def basic_clean(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning for OHLCV data.

    - Lowercase column names
    - Coerce OHLCV columns to float (handles CSVs read as object dtype)
    - Parse date column to datetime
    - Drop rows with missing or non-positive `close`
    """
    df = df.copy()
    df.columns = [c.lower() for c in df.columns]

    # Coerce numeric columns — silently turns unparseable strings into NaN
    for col in _NUMERIC_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    # Drop rows missing date or close
    drop_subset = [c for c in ("date", "close") if c in df.columns]
    df = df.dropna(subset=drop_subset)

    # Remove zero or negative prices
    if "close" in df.columns:
        df = df[df["close"] > 0]

    return df
