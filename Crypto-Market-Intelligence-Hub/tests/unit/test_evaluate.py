"""Unit tests for src.models.evaluate module."""
import numpy as np
import pytest
from src.models.evaluate import mae, rmse, mape, r2_score, sharpe_ratio, compute_metrics, summary_by_asset


def test_mae_perfect():
    assert mae(np.array([1.0, 2.0, 3.0]), np.array([1.0, 2.0, 3.0])) == 0.0


def test_rmse_perfect():
    assert rmse(np.array([1.0, 2.0]), np.array([1.0, 2.0])) == 0.0


def test_mape_known_value():
    y_true = np.array([100.0, 200.0])
    y_pred = np.array([110.0, 220.0])
    result = mape(y_true, y_pred)
    assert abs(result - 10.0) < 0.01  # 10% error


def test_r2_perfect():
    y = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
    assert abs(r2_score(y, y) - 1.0) < 1e-6


def test_r2_mean_predictor():
    y = np.array([1.0, 2.0, 3.0])
    pred = np.full_like(y, y.mean())
    assert abs(r2_score(y, pred)) < 0.01


def test_sharpe_all_positive():
    returns = np.full(365, 0.001)
    sr = sharpe_ratio(returns)
    assert sr > 0


def test_compute_metrics_returns_dict():
    m = compute_metrics(np.array([1.0, 2.0, 3.0]), np.array([1.1, 2.1, 3.1]), "test", "btc")
    assert "mae" in m and "rmse" in m and "mape" in m and "r2" in m


def test_summary_by_asset(sample_ohlcv_df):
    from src.features.returns import add_return_features
    df_with_ret = add_return_features(sample_ohlcv_df)
    result = summary_by_asset(df_with_ret)
    assert "asset" in result.columns
    assert len(result) == 2  # bitcoin, ethereum
    assert "sharpe_ratio" in result.columns
