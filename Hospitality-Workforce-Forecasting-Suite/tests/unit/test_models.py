"""tests/unit/test_models.py"""
import pytest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from src.models import (
    SARIMAForecaster, HoltWintersForecaster, SeasonalNaiveForecaster,
    compute_metrics,
)


def test_holt_winters_forecast(short_series):
    """HW should run on 60-month series without error."""
    m = HoltWintersForecaster()
    result = m.train_test_forecast(short_series, test_ratio=0.2, horizon=12)
    assert result.forecast is not None
    assert len(result.forecast) == 12


def test_naive_forecast(short_series):
    """Seasonal Naive should produce exactly horizon predictions."""
    m = SeasonalNaiveForecaster()
    result = m.train_test_forecast(short_series, test_ratio=0.2, horizon=12)
    assert result.forecast is not None
    assert len(result.forecast) == 12


def test_metrics_mae_positive(short_series):
    """MAE should always be > 0 for imperfect predictions."""
    m = SeasonalNaiveForecaster()
    result = m.train_test_forecast(short_series, test_ratio=0.2, horizon=12)
    split = int(len(short_series) * 0.8)
    test = short_series.iloc[split:]
    metrics = compute_metrics(test, result.test_predictions)
    assert metrics.mae > 0
    assert metrics.mape > 0
