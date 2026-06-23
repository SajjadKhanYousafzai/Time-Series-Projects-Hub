"""
src/features/decomposition.py
==============================
Seasonal decomposition and derived features for the hospitality time series.
"""
from __future__ import annotations

import logging

import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose, STL

logger = logging.getLogger(__name__)


def classical_decompose(
    series: pd.Series,
    model: str = "additive",
    period: int = 12,
) -> dict:
    """
    Classical seasonal decomposition (trend + seasonal + residual).

    Parameters
    ----------
    series : pd.Series  Monthly employment series.
    model  : str        'additive' or 'multiplicative'.
    period : int        Seasonal period (12 for monthly).

    Returns
    -------
    dict with keys: trend, seasonal, residual, observed.
    """
    result = seasonal_decompose(series, model=model, period=period, extrapolate_trend="freq")
    logger.info("Decomposition complete (model=%s, period=%d)", model, period)
    return {
        "observed":  result.observed,
        "trend":     result.trend,
        "seasonal":  result.seasonal,
        "residual":  result.resid,
    }


def stl_decompose(series: pd.Series, period: int = 12) -> dict:
    """STL (Seasonal-Trend decomposition using LOESS) — more robust to outliers."""
    result = STL(series, period=period, robust=True).fit()
    return {
        "observed":  series,
        "trend":     result.trend,
        "seasonal":  result.seasonal,
        "residual":  result.resid,
    }


def engineer_features(series: pd.Series) -> pd.DataFrame:
    """
    Build a feature DataFrame from the monthly series:
    - log_return
    - rolling_mean_12 / rolling_std_12
    - seasonal_index (month-of-year average / overall mean)
    - yoy_change (year-over-year % change)
    - drawdown from rolling max
    """
    df = pd.DataFrame({"employees": series})
    df["log_return"]      = np.log(df["employees"] / df["employees"].shift(1))
    df["rolling_mean_12"] = df["employees"].rolling(12).mean()
    df["rolling_std_12"]  = df["employees"].rolling(12).std()
    df["yoy_change"]      = df["employees"].pct_change(12) * 100
    roll_max              = df["employees"].cummax()
    df["drawdown"]        = (df["employees"] - roll_max) / roll_max * 100
    df["month"]           = df.index.month
    # Seasonal index: monthly average / overall mean
    monthly_avg = df.groupby("month")["employees"].transform("mean")
    df["seasonal_index"]  = monthly_avg / df["employees"].mean()
    logger.info("Engineered %d features for %d observations.", df.shape[1] - 1, len(df))
    return df
