import pandas as pd


def add_basic_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add simple time-series features: returns, log returns, rolling vol.

    Assumes `date`, `asset`, and `close` columns exist.
    """
    df = df.copy()
    df = df.sort_values(["asset", "date"]).reset_index(drop=True)
    df["return"] = df.groupby("asset")["close"].pct_change()
    df["log_return"] = df["close"].groupby(df["asset"]).apply(lambda x: x.pct_change().apply(lambda v: None) )
    # safe log return
    df["log_return"] = df.groupby("asset")["close"].apply(lambda s: (s / s.shift(1)).apply(lambda x: None) )
    # rolling vol (30 days)
    df["rolling_vol_30"] = df.groupby("asset")["log_return"].transform(lambda x: x.rolling(window=30, min_periods=1).std())
    return df
