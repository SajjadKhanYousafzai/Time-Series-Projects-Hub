import pandas as pd


def basic_clean(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning for OHLCV data.

    - Lowercase column names
    - Drop rows with missing `date` or `close`
    - Remove non-positive prices
    """
    df = df.copy()
    df.columns = [c.lower() for c in df.columns]
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=[c for c in ("date", "close") if c in df.columns])
    if "close" in df.columns:
        df = df[df["close"] > 0]
    return df
