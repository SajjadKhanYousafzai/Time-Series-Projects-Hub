"""Evaluation metrics and asset-level summaries.

Migrated from src/evaluate.py and expanded with MAPE, R², and Sharpe ratio.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


# ── Scalar metrics ────────────────────────────────────────────────────────────

def mae(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Mean Absolute Error."""
    return float(np.mean(np.abs(y_true - y_pred)))


def rmse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Root Mean Squared Error."""
    return float(np.sqrt(np.mean((y_true - y_pred) ** 2)))


def mape(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-8) -> float:
    """Mean Absolute Percentage Error (%)."""
    return float(np.mean(np.abs((y_true - y_pred) / (np.abs(y_true) + eps))) * 100)


def r2_score(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Coefficient of determination R²."""
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    return float(1 - ss_res / (ss_tot + 1e-10))


def sharpe_ratio(returns: np.ndarray, risk_free_rate: float = 0.0, periods: int = 365) -> float:
    """Annualised Sharpe Ratio for daily returns."""
    excess = returns - risk_free_rate / periods
    std = np.std(excess)
    if std < 1e-10:
        return 0.0
    return float(np.mean(excess) / std * np.sqrt(periods))


def compute_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    model_name: str = "",
    asset: str = "",
) -> dict[str, float | str]:
    """Compute all regression metrics for a forecast.

    Parameters
    ----------
    y_true : array-like
        Ground truth values.
    y_pred : array-like
        Predicted values.
    model_name : str
        Optional model identifier for the output dict.
    asset : str
        Optional asset identifier.

    Returns
    -------
    dict
        Keys: model, asset, mae, rmse, mape, r2
    """
    y_true_arr = np.asarray(y_true, dtype=float)
    y_pred_arr = np.asarray(y_pred, dtype=float)
    return {
        "model": model_name,
        "asset": asset,
        "mae": round(mae(y_true_arr, y_pred_arr), 4),
        "rmse": round(rmse(y_true_arr, y_pred_arr), 4),
        "mape": round(mape(y_true_arr, y_pred_arr), 4),
        "r2": round(r2_score(y_true_arr, y_pred_arr), 4),
    }


# ── DataFrame-level summaries ─────────────────────────────────────────────────

def summary_by_asset(df: pd.DataFrame) -> pd.DataFrame:
    """Return a dataset summary (rows, date range, mean/max close, Sharpe) per asset.

    Parameters
    ----------
    df : pd.DataFrame
        Long-format DataFrame with date, asset, close, and optionally log_return.

    Returns
    -------
    pd.DataFrame
        One row per asset with descriptive statistics.
    """
    agg_dict: dict = {
        "rows": ("date", "count"),
        "start": ("date", "min"),
        "end": ("date", "max"),
        "mean_close": ("close", "mean"),
        "max_close": ("close", "max"),
        "min_close": ("close", "min"),
    }

    out = df.groupby("asset").agg(**agg_dict).reset_index()

    # Sharpe ratio if log_return available
    if "log_return" in df.columns:
        sharpe = (
            df.dropna(subset=["log_return"])
            .groupby("asset")["log_return"]
            .apply(lambda s: sharpe_ratio(s.values))
            .reset_index()
            .rename(columns={"log_return": "sharpe_ratio"})
        )
        out = out.merge(sharpe, on="asset", how="left")

    return out
