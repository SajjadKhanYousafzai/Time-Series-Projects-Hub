"""
src/features/stationarity.py
=============================
Stationarity tests and differencing utilities for hourly energy series.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass

import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller, kpss

logger = logging.getLogger(__name__)


@dataclass
class StationarityResult:
    test: str
    statistic: float
    p_value: float
    critical_values: dict[str, float]
    is_stationary: bool
    interpretation: str


def adf_test(series: pd.Series, significance: float = 0.05) -> StationarityResult:
    """
    Augmented Dickey-Fuller test.
    H₀: unit root exists (series is non-stationary).
    Reject H₀ → stationary.
    """
    result = adfuller(series.dropna(), autolag="AIC")
    stat, pval, _, _, crit = result[0], result[1], result[2], result[3], result[4]
    is_stationary = pval < significance
    interp = (
        f"ADF stat={stat:.4f}, p={pval:.4f}. "
        + ("Series IS stationary (reject H₀)." if is_stationary
           else "Series is NOT stationary (fail to reject H₀).")
    )
    logger.info(interp)
    return StationarityResult(
        test="ADF", statistic=stat, p_value=pval,
        critical_values={k: round(v, 4) for k, v in crit.items()},
        is_stationary=is_stationary, interpretation=interp,
    )


def kpss_test(series: pd.Series, significance: float = 0.05) -> StationarityResult:
    """
    KPSS test.
    H₀: series IS stationary.
    Reject H₀ → non-stationary.
    """
    with np.errstate(divide="ignore", invalid="ignore"):
        stat, pval, _, crit = kpss(series.dropna(), regression="c", nlags="auto")
    is_stationary = pval > significance
    interp = (
        f"KPSS stat={stat:.4f}, p={pval:.4f}. "
        + ("Series IS stationary (fail to reject H₀)." if is_stationary
           else "Series is NOT stationary (reject H₀).")
    )
    logger.info(interp)
    return StationarityResult(
        test="KPSS", statistic=stat, p_value=pval,
        critical_values={k: round(v, 4) for k, v in crit.items()},
        is_stationary=is_stationary, interpretation=interp,
    )


def make_stationary(series: pd.Series, max_d: int = 2) -> tuple[pd.Series, int]:
    """
    Difference the series until ADF confirms stationarity.

    Returns
    -------
    (differenced_series, n_differences_applied)
    """
    d = 0
    s = series.copy()
    while not adf_test(s).is_stationary and d < max_d:
        s = s.diff().dropna()
        d += 1
        logger.info("Applied differencing d=%d", d)
    return s, d
