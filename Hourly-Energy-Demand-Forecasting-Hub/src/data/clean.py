"""
src/data/clean.py
=================
Cleaning and validation for PJM hourly energy series.
"""
from __future__ import annotations

import logging

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def validate_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Assert DatetimeIndex, fill NaN via forward-fill, reject non-positive MW.
    """
    if not isinstance(df.index, pd.DatetimeIndex):
        raise TypeError("DataFrame must have a DatetimeIndex.")

    n_missing = df["MW"].isna().sum()
    if n_missing:
        logger.warning("%d NaN values — forward-fill then backward-fill.", n_missing)
        df["MW"] = df["MW"].ffill().bfill()

    n_neg = (df["MW"] <= 0).sum()
    if n_neg:
        logger.warning("%d non-positive MW values — replacing with NaN then interpolating.", n_neg)
        df["MW"] = df["MW"].where(df["MW"] > 0).interpolate(method="time")

    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """
    Drop duplicate timestamps — common in PJM daylight-saving transitions.
    Keeps first occurrence.
    """
    n_dupes = df.index.duplicated().sum()
    if n_dupes:
        logger.warning("Removing %d duplicate timestamps (DST artefacts).", n_dupes)
        df = df[~df.index.duplicated(keep="first")]
    return df


def ensure_hourly_frequency(df: pd.DataFrame) -> pd.DataFrame:
    """
    Reindex to a complete hourly DatetimeIndex — fills any missing hours
    via time-weighted linear interpolation.
    """
    full_idx = pd.date_range(df.index.min(), df.index.max(), freq="h")
    if len(full_idx) != len(df):
        n_missing = len(full_idx) - len(df)
        logger.warning("Filling %d missing hourly slots via linear interpolation.", n_missing)
        df = df.reindex(full_idx).interpolate(method="time")
        df.index.name = "datetime"
    return df


def detect_outliers(df: pd.DataFrame, z_threshold: float = 5.0) -> pd.DataFrame:
    """
    Flag and interpolate extreme outliers using z-score on hourly log-returns.
    A z-score above threshold is considered an outlier.

    Parameters
    ----------
    df          : DataFrame with 'MW' column
    z_threshold : float  default 5.0 — higher than daily threshold due to hourly noise
    """
    log_ret = np.log(df["MW"] / df["MW"].shift(1)).dropna()
    z       = (log_ret - log_ret.mean()) / log_ret.std()
    outlier_idx = z[z.abs() > z_threshold].index

    if len(outlier_idx):
        logger.warning(
            "%d outlier hours detected (z > %.1f) — time-interpolating.",
            len(outlier_idx), z_threshold,
        )
        df = df.copy()
        df.loc[outlier_idx, "MW"] = np.nan
        df["MW"] = df["MW"].interpolate(method="time")

    return df


def basic_clean(
    df: pd.DataFrame,
    region: str = "",
    detect_outliers_flag: bool = True,
    z_threshold: float = 5.0,
) -> pd.DataFrame:
    """
    Full cleaning pipeline:
    1. validate_dataframe   — NaN fill, non-positive check
    2. remove_duplicates    — DST artefacts
    3. ensure_hourly_frequency — gap interpolation
    4. detect_outliers      — z-score spike removal (optional)

    Returns
    -------
    pd.DataFrame  Clean hourly DataFrame with 'MW' column.
    """
    df = validate_dataframe(df)
    df = remove_duplicates(df)
    df = ensure_hourly_frequency(df)
    if detect_outliers_flag:
        df = detect_outliers(df, z_threshold=z_threshold)

    logger.info(
        "[%s] Cleaning complete — %d hourly records  range: %.0f–%.0f MW",
        region or "?", len(df), df["MW"].min(), df["MW"].max(),
    )
    return df
