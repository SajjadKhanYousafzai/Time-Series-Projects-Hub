"""Integration test — end-to-end pipeline smoke test."""
from pathlib import Path
import pytest
import pandas as pd


ROOT = Path(__file__).resolve().parents[2]


def test_load_all_returns_dataframe():
    from src.data.load import load_all
    data_dir = ROOT / "data" / "raw"
    if not data_dir.exists() or not any(data_dir.glob("*.csv")):
        pytest.skip("Raw data not available; skipping integration test.")
    df = load_all(str(data_dir))
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert "asset" in df.columns


def test_full_pipeline_runs():
    from src.data.load import load_all
    from src.data.clean import basic_clean
    from src.features.returns import add_return_features
    from src.models.evaluate import summary_by_asset

    data_dir = ROOT / "data" / "raw"
    if not data_dir.exists() or not any(data_dir.glob("*.csv")):
        pytest.skip("Raw data not available; skipping integration test.")

    df = load_all(str(data_dir))
    df = basic_clean(df)
    df = add_return_features(df, windows=[7, 30])
    summary = summary_by_asset(df)

    assert len(summary) > 0
    assert "rows" in summary.columns
    assert "mean_close" in summary.columns


def test_arima_pipeline_small():
    """Quick ARIMA pipeline on synthetic data (no real data needed)."""
    from src.models.arima_model import run_arima_pipeline
    import numpy as np

    n = 150
    dates = pd.date_range("2022-01-01", periods=n, freq="D")
    close = 100 + np.random.default_rng(0).normal(0, 5, n).cumsum()
    df = pd.DataFrame({"date": dates, "close": np.abs(close), "asset": "test_coin"})

    result = run_arima_pipeline(df, "test_coin", steps=10)
    assert "metrics" in result
    assert "forecast" in result
    assert len(result["forecast"]) == 10
