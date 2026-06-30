"""
tests/fixtures/conftest.py
==========================
Shared pytest fixtures — synthetic hourly energy series for fast unit tests.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
import pytest


@pytest.fixture(scope="session")
def hourly_series() -> pd.Series:
    """
    Synthetic hourly energy series (1 year = 8760 points).
    Includes trend, daily cycle, weekly cycle, and noise.
    """
    rng = np.random.default_rng(42)
    n   = 8760
    t   = np.arange(n)

    trend    = 10_000 + t * 0.1
    daily    = 2_000 * np.sin(2 * np.pi * t / 24 - np.pi / 2)
    weekly   = 500   * np.sin(2 * np.pi * t / (24 * 7))
    noise    = rng.normal(0, 200, n)

    values   = trend + daily + weekly + noise
    values   = np.clip(values, 5_000, 25_000)

    idx = pd.date_range("2020-01-01", periods=n, freq="h")
    return pd.Series(values, index=idx, name="MW", dtype="float64")


@pytest.fixture(scope="session")
def hourly_df(hourly_series) -> pd.DataFrame:
    """DataFrame with 'MW' column and DatetimeIndex."""
    return pd.DataFrame({"MW": hourly_series})


@pytest.fixture(scope="session")
def small_series() -> pd.Series:
    """Tiny 500-point series for fast model tests."""
    rng    = np.random.default_rng(0)
    n      = 500
    t      = np.arange(n)
    values = 10_000 + 1_000 * np.sin(2 * np.pi * t / 24) + rng.normal(0, 100, n)
    idx    = pd.date_range("2022-01-01", periods=n, freq="h")
    return pd.Series(values, index=idx, name="MW", dtype="float64")
