"""
src/models/evaluate.py
=======================
Model evaluation: MAE, RMSE, MAPE, and rolling cross-validation.
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
            "model":  self.model_name,
            "mae":    round(self.mae,  4),
            "rmse":   round(self.rmse, 4),
            "mape":   round(self.mape, 4),
            "n_test": self.n_test,
        }


def compute_metrics(
    y_true: pd.Series | np.ndarray,
    y_pred: pd.Series | np.ndarray,
    model_name: str = "Model",
) -> MetricsResult:
    """Compute MAE, RMSE, MAPE between actuals and predictions."""
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)
    mask = ~(np.isnan(yt) | np.isnan(yp)) & (yt != 0)
    yt, yp = yt[mask], yp[mask]

    mae  = mean_absolute_error(yt, yp)
    rmse = float(np.sqrt(mean_squared_error(yt, yp)))
    mape = float(np.mean(np.abs((yt - yp) / yt)) * 100)

    result = MetricsResult(model_name=model_name, mae=mae, rmse=rmse, mape=mape, n_test=len(yt))
    logger.info("%s — MAE=%.2f  RMSE=%.2f  MAPE=%.2f%%", model_name, mae, rmse, mape)
    return result


def rolling_cross_validate(
    series: pd.Series,
    model_factory: Callable,
    n_folds: int = 5,
    test_size: int = 24 * 7,   # 1 week of hourly data
    min_train_size: int = 24 * 90,  # at least 90 days
) -> dict:
    """
    Rolling window cross-validation for hourly time series.

    Parameters
    ----------
    series         : pd.Series  Full hourly energy series.
    model_factory  : Callable   factory(train) → fitted model with .predict(steps) method
    n_folds        : int        Number of CV folds.
    test_size      : int        Hours per test fold (default: 1 week = 168 hours).
    min_train_size : int        Minimum training hours (default: 90 days = 2160 hours).

    Returns
    -------
    dict  'fold_metrics', 'mean_mae', 'mean_rmse', 'mean_mape', 'std_*'
    """
    total       = len(series)
    fold_metrics = []

    for fold in range(n_folds):
        test_end   = total - fold * test_size
        test_start = test_end - test_size
        train_end  = test_start

        if train_end < min_train_size:
            logger.warning(
                "Fold %d: insufficient training data (%d < %d). Skipping.",
                fold + 1, train_end, min_train_size,
            )
            continue

        train = series.iloc[:train_end]
        test  = series.iloc[test_start:test_end]

        try:
            model  = model_factory(train)
            preds  = model.forecast(steps=len(test))
            pred_s = preds.forecast if hasattr(preds, "forecast") else preds
            pred_s = pd.Series(pred_s.values if hasattr(pred_s, "values") else pred_s,
                               index=test.index)
            m = compute_metrics(test, pred_s, model_name=f"fold_{fold+1}")
            fold_metrics.append(m)
        except Exception as e:
            logger.error("Fold %d failed: %s", fold + 1, e)

    if not fold_metrics:
        return {}

    maes  = [m.mae  for m in fold_metrics]
    rmses = [m.rmse for m in fold_metrics]
    mapes = [m.mape for m in fold_metrics]

    return {
        "fold_metrics": [m.to_dict() for m in fold_metrics],
        "mean_mae":   round(np.mean(maes),  3),
        "std_mae":    round(np.std(maes),   3),
        "mean_rmse":  round(np.mean(rmses), 3),
        "std_rmse":   round(np.std(rmses),  3),
        "mean_mape":  round(np.mean(mapes), 3),
        "std_mape":   round(np.std(mapes),  3),
    }


def compare_models(results: list[MetricsResult]) -> pd.DataFrame:
    """Return a DataFrame ranking models by RMSE (ascending)."""
    df = pd.DataFrame([r.to_dict() for r in results])
    return df.sort_values("rmse").reset_index(drop=True)
