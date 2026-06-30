"""
src/features/time_features.py
==============================
Time-based feature engineering for hourly energy demand series.
Generates 31+ features including temporal, lag, rolling, and calendar features.
"""
from __future__ import annotations

import logging

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# US Federal Holidays (approximate — common peak/trough days)
_US_HOLIDAYS = {
    (1, 1):   "New Year's Day",
    (7, 4):   "Independence Day",
    (12, 25): "Christmas Day",
    (11, 11): "Veterans Day",
}


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add 31+ temporal and lag features to an hourly energy DataFrame.

    Input
    -----
    df : pd.DataFrame with DatetimeIndex and 'MW' column.

    Output
    ------
    pd.DataFrame with all original columns plus engineered features.
    """
    df = df.copy()
    idx = df.index

    # ── Basic calendar ────────────────────────────────────────────────────────
    df["hour"]         = idx.hour
    df["day_of_week"]  = idx.dayofweek          # 0=Mon … 6=Sun
    df["day_of_month"] = idx.day
    df["day_of_year"]  = idx.dayofyear
    df["week"]         = idx.isocalendar().week.astype(int)
    df["month"]        = idx.month
    df["quarter"]      = idx.quarter
    df["year"]         = idx.year

    # ── Season (meteorological) ───────────────────────────────────────────────
    season_map = {12: "Winter", 1: "Winter", 2: "Winter",
                  3: "Spring", 4: "Spring", 5: "Spring",
                  6: "Summer", 7: "Summer", 8: "Summer",
                  9: "Fall",   10: "Fall",  11: "Fall"}
    df["season"]       = df["month"].map(season_map)
    df["season_num"]   = df["season"].map({"Winter": 0, "Spring": 1, "Summer": 2, "Fall": 3})

    # ── Binary flags ──────────────────────────────────────────────────────────
    df["is_weekend"]   = (df["day_of_week"] >= 5).astype(int)
    df["is_weekday"]   = 1 - df["is_weekend"]
    df["is_holiday"]   = df.apply(
        lambda r: int((r["month"], r["day_of_month"]) in _US_HOLIDAYS), axis=1
    )
    df["is_business_hour"] = ((df["hour"] >= 8) & (df["hour"] <= 18) & df["is_weekday"].astype(bool)).astype(int)
    df["is_peak_hour"] = ((df["hour"] >= 12) & (df["hour"] <= 20)).astype(int)
    df["is_night"]     = ((df["hour"] >= 22) | (df["hour"] <= 6)).astype(int)

    # ── Cyclical encoding (sin/cos) ───────────────────────────────────────────
    df["hour_sin"]     = np.sin(2 * np.pi * df["hour"]       / 24)
    df["hour_cos"]     = np.cos(2 * np.pi * df["hour"]       / 24)
    df["month_sin"]    = np.sin(2 * np.pi * df["month"]      / 12)
    df["month_cos"]    = np.cos(2 * np.pi * df["month"]      / 12)
    df["dow_sin"]      = np.sin(2 * np.pi * df["day_of_week"] / 7)
    df["dow_cos"]      = np.cos(2 * np.pi * df["day_of_week"] / 7)

    # ── Lag features ─────────────────────────────────────────────────────────
    df["lag_1"]        = df["MW"].shift(1)      # 1 hour ago
    df["lag_24"]       = df["MW"].shift(24)     # same hour yesterday
    df["lag_48"]       = df["MW"].shift(48)     # same hour 2 days ago
    df["lag_168"]      = df["MW"].shift(168)    # same hour last week
    df["lag_8760"]     = df["MW"].shift(8760)   # same hour last year

    # ── Rolling statistics ────────────────────────────────────────────────────
    df["rolling_mean_24"]  = df["MW"].rolling(24,   min_periods=1).mean()
    df["rolling_std_24"]   = df["MW"].rolling(24,   min_periods=1).std()
    df["rolling_mean_168"] = df["MW"].rolling(168,  min_periods=1).mean()
    df["rolling_std_168"]  = df["MW"].rolling(168,  min_periods=1).std()
    df["rolling_min_24"]   = df["MW"].rolling(24,   min_periods=1).min()
    df["rolling_max_24"]   = df["MW"].rolling(24,   min_periods=1).max()

    # ── Trend features ────────────────────────────────────────────────────────
    df["log_MW"]       = np.log(df["MW"].clip(lower=1))
    df["diff_1"]       = df["MW"].diff(1)
    df["diff_24"]      = df["MW"].diff(24)
    df["pct_change_24"] = df["MW"].pct_change(24) * 100

    logger.info(
        "Feature engineering complete: %d features added for %d records.",
        df.shape[1] - 1, len(df),
    )
    return df


def select_feature_columns(df: pd.DataFrame, exclude: list[str] | None = None) -> list[str]:
    """Return list of feature column names (excludes 'MW' and any custom exclusions)."""
    exclude = exclude or []
    exclude += ["MW", "season"]  # 'season' is categorical — use season_num instead
    return [c for c in df.columns if c not in exclude]
