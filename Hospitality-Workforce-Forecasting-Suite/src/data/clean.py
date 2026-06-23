"""
src/data/clean.py
=================
Cleaning and validation for the Hospitality employment time series.
"""
from __future__ import annotations

import logging

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def validate_series(series: pd.Series) -> pd.Series:
    """
    Validate that the series has a proper DatetimeIndex at monthly frequency
    and contains no negative values.
    """
    if not isinstance(series.index, pd.DatetimeIndex):
        raise TypeError("Series must have a DatetimeIndex.")
    if series.isna().any():
        n_missing = series.isna().sum()
        logger.warning("%d NaN values found — forward-filling.", n_missing)
        series = series.ffill().bfill()
    if (series <= 0).any():
        n_bad = (series <= 0).sum()
        logger.warning("%d non-positive values found — replacing with NaN then interpolating.", n_bad)
        series = series.where(series > 0).interpolate(method="time")
    return series


def ensure_monthly_frequency(series: pd.Series) -> pd.Series:
    """Ensure the series is at Month-Start (MS) frequency with no gaps."""
    full_idx = pd.date_range(series.index.min(), series.index.max(), freq="MS")
    if len(full_idx) != len(series):
        missing = full_idx.difference(series.index)
        logger.warning("Filling %d missing months via linear interpolation.", len(missing))
        series = series.reindex(full_idx).interpolate(method="time")
    else:
        series = series.asfreq("MS")
    return series


def detect_outliers(series: pd.Series, z_threshold: float = 4.0) -> pd.Series:
    """
    Flag and interpolate extreme outliers using z-score on log returns.
    A z-score > threshold is considered an outlier.
    """
    log_ret = np.log(series / series.shift(1)).dropna()
    z = (log_ret - log_ret.mean()) / log_ret.std()
    outlier_dates = z[z.abs() > z_threshold].index
    if len(outlier_dates):
        logger.warning("Outliers detected at: %s", list(outlier_dates.date))
        series = series.copy()
        series[outlier_dates] = np.nan
        series = series.interpolate(method="time")
    return series


def basic_clean(series: pd.Series, detect_outliers_flag: bool = True) -> pd.Series:
    """
    Full cleaning pipeline:
    1. Validate
    2. Ensure monthly frequency
    3. Optionally detect & interpolate outliers
    """
    series = validate_series(series)
    series = ensure_monthly_frequency(series)
    if detect_outliers_flag:
        series = detect_outliers(series)
    logger.info("Cleaning complete. Shape: %s, range: %.1f – %.1f K",
                series.shape, series.min(), series.max())
    return series
