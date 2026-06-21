"""Shared pytest fixtures for all test suites."""
from __future__ import annotations

import pandas as pd
import numpy as np
import pytest


@pytest.fixture(scope="session")
def sample_ohlcv_df() -> pd.DataFrame:
    """Generate a minimal OHLCV DataFrame with two assets."""
    n = 200
    dates = pd.date_range("2022-01-01", periods=n, freq="D")
    rng = np.random.default_rng(42)

    records = []
    for asset in ["bitcoin", "ethereum"]:
        close = 1000 + rng.normal(0, 20, n).cumsum()
        close = np.abs(close)
        records.append(pd.DataFrame({
            "date": dates,
            "open": close * (1 - rng.uniform(0, 0.01, n)),
            "high": close * (1 + rng.uniform(0, 0.02, n)),
            "low":  close * (1 - rng.uniform(0, 0.02, n)),
            "close": close,
            "volume": rng.uniform(1e6, 1e8, n),
            "asset": asset,
        }))

    return pd.concat(records, ignore_index=True)


@pytest.fixture(scope="session")
def single_asset_df(sample_ohlcv_df) -> pd.DataFrame:
    """Bitcoin-only slice of the sample DataFrame."""
    return sample_ohlcv_df[sample_ohlcv_df["asset"] == "bitcoin"].copy()
