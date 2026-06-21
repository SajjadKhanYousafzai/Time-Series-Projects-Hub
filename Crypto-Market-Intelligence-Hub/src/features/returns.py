"""Return-based features: log returns, rolling volatility, drawdown.

All functions expect a long-format DataFrame with at minimum:
  - ``date``  : datetime column
  - ``asset`` : string asset identifier
  - ``close`` : closing price
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def add_return_features(
    df: pd.DataFrame,
    windows: list[int] | None = None,
) -> pd.DataFrame:
    """Add return-based feature columns grouped by asset.

    New columns added:
        return          : simple daily return
        log_return      : log(close_t / close_{t-1})
        rolling_vol_N   : rolling std of log_return over N days (for each window)
        cumulative_ret  : cumulative return from first observation
        drawdown        : percentage drawdown from rolling max

    Parameters
    ----------
    df : pd.DataFrame
        Long-format OHLCV DataFrame.
    windows : list[int], optional
        Rolling window sizes in days. Defaults to [7, 14, 30, 90].

    Returns
    -------
    pd.DataFrame
        DataFrame with new feature columns appended.
    """
    if windows is None:
        windows = [7, 14, 30, 90]

    df = df.copy()
    df = df.sort_values(["asset", "date"]).reset_index(drop=True)

    # Simple return
    df["return"] = df.groupby("asset")["close"].pct_change()

    # Log return
    df["log_return"] = df.groupby("asset")["close"].transform(
        lambda s: np.log(s / s.shift(1))
    )

    # Rolling volatility for each window
    for w in windows:
        col = f"rolling_vol_{w}"
        df[col] = df.groupby("asset")["log_return"].transform(
            lambda s, _w=w: s.rolling(window=_w, min_periods=max(1, _w // 2)).std()
        )

    # Cumulative return (rebased to 1.0 at first date per asset)
    df["cumulative_ret"] = df.groupby("asset")["close"].transform(
        lambda s: s / s.iloc[0]
    )

    # Drawdown from rolling peak
    df["rolling_max"] = df.groupby("asset")["close"].transform(
        lambda s: s.cummax()
    )
    df["drawdown"] = (df["close"] - df["rolling_max"]) / df["rolling_max"]
    df = df.drop(columns=["rolling_max"])

    return df
