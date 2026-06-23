"""tests/fixtures/conftest.py — Shared test fixtures."""
import pytest
import pandas as pd
import numpy as np


@pytest.fixture
def sample_series() -> pd.Series:
    """348-point synthetic monthly employment series (mirrors real data structure)."""
    idx = pd.date_range("1990-01-01", periods=348, freq="MS")
    np.random.seed(42)
    trend = np.linspace(1064, 2000, 348)
    seasonal = 50 * np.sin(2 * np.pi * np.arange(348) / 12)
    noise = np.random.normal(0, 5, 348)
    values = trend + seasonal + noise
    return pd.Series(values, index=idx, name="employees")


@pytest.fixture
def short_series(sample_series) -> pd.Series:
    """First 60 months only (for fast model tests)."""
    return sample_series.iloc[:60]
