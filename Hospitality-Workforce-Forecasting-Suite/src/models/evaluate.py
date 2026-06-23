"""
src/models/evaluate.py
=======================
Model evaluation: MAE, RMSE, MAPE, and 5-fold rolling cross-validation.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Callable

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error

logger = logging.getLogger(__name__)


@dataclass
class MetricsResult:
    model_name: str
    mae: float
    rmse: float
    mape: float
    n_test: int

    def to_dict(self) -> dict:
        return {
            "model": self.model_name,
            "mae":   round(self.mae, 4),
            "rmse":  round(self.rmse, 4),
            "mape":  round(self.mape, 4),
            "n_test": self.n_test,
        }


def compute_metrics(
    y_true: pd.Series,
    y_pred: pd.Series,
    model_name: str = "Model",
) -> MetricsResult:
    """Compute MAE, RMSE, MAPE between actuals and predictions."""
    y_true = y_true.dropna()
    y_pred = y_pred.reindex(y_true.index).dropna()
    common = y_true.index.intersection(y_pred.index)
    y_true, y_pred = y_true[common], y_pred[common]

    mae  = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true.replace(0, np.nan))) * 100

    result = MetricsResult(model_name=model_name, mae=mae, rmse=rmse, mape=mape, n_test=len(y_true))
    logger.info("%s — MAE=%.2f  RMSE=%.2f  MAPE=%.2f%%", model_name, mae, rmse, mape)
    return result


def rolling_cross_validate(
    series: pd.Series,
    model_factory: Callable,
    n_folds: int = 5,
    test_size: int = 12,
    min_train_size: int = 60,
) -> dict:
    """
    Time-series rolling window cross-validation.

    Parameters
    ----------
    series       : full time series
    model_factory: callable that returns a fresh fitted model given a training Series
    n_folds      : number of folds
    test_size    : months per test fold
    min_train_size: minimum training months before first fold

    Returns
    -------
    dict with 'fold_metrics', 'mean_mae', 'mean_rmse', 'mean_mape', 'std_mae', ...
    """
    total = len(series)
    fold_metrics = []

    for fold in range(n_folds):
        test_end   = total - fold * test_size
        test_start = test_end - test_size
        train_end  = test_start

        if train_end < min_train_size:
            logger.warning("Fold %d: insufficient training data (%d < %d). Skipping.", fold + 1, train_end, min_train_size)
            continue

        train = series.iloc[:train_end]
        test  = series.iloc[test_start:test_end]

        try:
            model = model_factory(train)
            preds = model.forecast(steps=len(test))
            if hasattr(preds, "forecast"):
                pred_series = preds.forecast
            else:
                pred_series = preds
            pred_series.index = test.index
            m = compute_metrics(test, pred_series, model_name=f"fold_{fold+1}")
            fold_metrics.append(m)
            logger.info("Fold %d — MAE=%.2f  RMSE=%.2f  MAPE=%.2f%%", fold + 1, m.mae, m.rmse, m.mape)
        except Exception as e:
            logger.error("Fold %d failed: %s", fold + 1, e)

    if not fold_metrics:
        return {}

    maes  = [m.mae  for m in fold_metrics]
    rmses = [m.rmse for m in fold_metrics]
    mapes = [m.mape for m in fold_metrics]

    return {
        "fold_metrics": [m.to_dict() for m in fold_metrics],
        "mean_mae":  round(np.mean(maes),  3),
        "std_mae":   round(np.std(maes),   3),
        "mean_rmse": round(np.mean(rmses), 3),
        "std_rmse":  round(np.std(rmses),  3),
        "mean_mape": round(np.mean(mapes), 3),
        "std_mape":  round(np.std(mapes),  3),
    }


def compare_models(results: list[MetricsResult]) -> pd.DataFrame:
    """Return a sorted DataFrame ranking models by RMSE."""
    df = pd.DataFrame([r.to_dict() for r in results])
    return df.sort_values("rmse").reset_index(drop=True)
