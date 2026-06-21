"""Unit tests for src.features modules."""
import numpy as np
import pytest
from src.features.returns import add_return_features
from src.features.technical import (
    compute_rsi, compute_macd, compute_bollinger_bands, compute_atr, add_technical_indicators
)


def test_add_return_features_adds_columns(sample_ohlcv_df):
    result = add_return_features(sample_ohlcv_df)
    for col in ["return", "log_return", "rolling_vol_30", "cumulative_ret", "drawdown"]:
        assert col in result.columns, f"Missing column: {col}"


def test_cumulative_ret_starts_at_one(sample_ohlcv_df):
    result = add_return_features(sample_ohlcv_df)
    for asset, grp in result.groupby("asset"):
        first_val = grp.sort_values("date")["cumulative_ret"].iloc[0]
        assert abs(first_val - 1.0) < 1e-6, f"{asset}: cumulative_ret should start at 1.0"


def test_drawdown_non_positive(sample_ohlcv_df):
    result = add_return_features(sample_ohlcv_df)
    assert (result["drawdown"] <= 0 + 1e-10).all(), "Drawdown values should be ≤ 0"


def test_rsi_range():
    import pandas as pd
    close = pd.Series([float(i) + 1 for i in range(100)])
    rsi = compute_rsi(close, period=14).dropna()
    assert (rsi >= 0).all() and (rsi <= 100).all(), "RSI must be in [0, 100]"


def test_macd_returns_three_series():
    import pandas as pd
    close = pd.Series([float(i + 1) for i in range(100)])
    macd_line, signal, hist = compute_macd(close)
    assert len(macd_line) == len(close)
    assert len(signal) == len(close)
    assert len(hist) == len(close)


def test_bollinger_bands_upper_gte_lower():
    import pandas as pd
    close = pd.Series([float(100 + i % 10) for i in range(100)])
    upper, mid, lower = compute_bollinger_bands(close)
    valid = ~(upper.isna() | lower.isna())
    assert (upper[valid] >= lower[valid] - 1e-10).all()


def test_add_technical_indicators_adds_rsi(sample_ohlcv_df):
    result = add_technical_indicators(sample_ohlcv_df)
    assert "rsi" in result.columns
    assert "macd" in result.columns
    assert "bb_upper" in result.columns
