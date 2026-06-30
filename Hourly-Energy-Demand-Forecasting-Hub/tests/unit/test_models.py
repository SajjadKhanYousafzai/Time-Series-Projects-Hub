"""
tests/unit/test_models.py
=========================
Unit tests for forecasting models.
"""
import numpy as np
import pandas as pd
import pytest

from src.models.arima_model import ARIMAForecaster, ARIMAResult
from src.models.evaluate import compute_metrics, compare_models, MetricsResult
from src.features.time_features import add_time_features


@pytest.fixture
def short_series():
    """200 hours of synthetic data — fast enough for ARIMA fit in tests."""
    rng = np.random.default_rng(42)
    n = 200
    t = np.arange(n)
    vals = 10_000 + 500 * np.sin(2 * np.pi * t / 24) + rng.normal(0, 100, n)
    idx = pd.date_range("2022-01-01", periods=n, freq="h")
    return pd.Series(vals, index=idx, name="MW")


# ── ARIMA ──────────────────────────────────────────────────────────────────────

def test_arima_fit_returns_self(short_series):
    model = ARIMAForecaster(order=(1, 1, 1))
    result = model.fit(short_series)
    assert result is model


def test_arima_forecast_returns_result(short_series):
    model = ARIMAForecaster(order=(1, 1, 1))
    model.fit(short_series)
    result = model.forecast(steps=24)
    assert isinstance(result, ARIMAResult)
    assert result.forecast is not None
    assert len(result.forecast) == 24


def test_arima_not_fitted_raises():
    model = ARIMAForecaster()
    with pytest.raises(RuntimeError, match="not fitted"):
        model.forecast(steps=10)


def test_arima_train_test_split(short_series):
    model = ARIMAForecaster(order=(1, 1, 1))
    result = model.train_test_forecast(short_series, test_ratio=0.2, horizon=12)
    assert result.test_predictions is not None
    assert result.forecast is not None


# ── Evaluate ───────────────────────────────────────────────────────────────────

def test_compute_metrics_perfect_prediction():
    y = pd.Series([100.0, 200.0, 300.0])
    metrics = compute_metrics(y, y, model_name="Perfect")
    assert metrics.mae  == pytest.approx(0.0, abs=1e-10)
    assert metrics.rmse == pytest.approx(0.0, abs=1e-10)
    assert metrics.mape == pytest.approx(0.0, abs=1e-10)


def test_compute_metrics_known_values():
    y_true = pd.Series([100.0, 200.0])
    y_pred = pd.Series([110.0, 190.0])
    metrics = compute_metrics(y_true, y_pred)
    assert metrics.mae == pytest.approx(10.0, rel=1e-6)


def test_compare_models_sorts_by_rmse():
    results = [
        MetricsResult("B", mae=5.0, rmse=7.0, mape=3.0, n_test=100),
        MetricsResult("A", mae=3.0, rmse=4.0, mape=2.0, n_test=100),
        MetricsResult("C", mae=8.0, rmse=10.0, mape=5.0, n_test=100),
    ]
    df = compare_models(results)
    assert list(df["model"]) == ["A", "B", "C"]


# ── Time Features ──────────────────────────────────────────────────────────────

def test_add_time_features_adds_columns(short_series):
    df = pd.DataFrame({"MW": short_series})
    result = add_time_features(df)
    expected_cols = ["hour", "day_of_week", "month", "season", "is_weekend",
                     "lag_24", "rolling_mean_24", "hour_sin", "hour_cos"]
    for col in expected_cols:
        assert col in result.columns, f"Missing column: {col}"


def test_add_time_features_no_data_loss(short_series):
    df = pd.DataFrame({"MW": short_series})
    result = add_time_features(df)
    assert len(result) == len(short_series)
