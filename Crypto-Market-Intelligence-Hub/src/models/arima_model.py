"""ARIMA model: grid search, fitting, and prediction."""
from __future__ import annotations

import logging
import warnings
from itertools import product
from typing import Any

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def grid_search_arima(
    series: pd.Series,
    p_range: list[int] | None = None,
    d: int = 1,
    q_range: list[int] | None = None,
    ic: str = "aic",
) -> tuple[int, int, int]:
    """Find the best (p, d, q) order by minimising AIC or BIC.

    Parameters
    ----------
    series : pd.Series
        Univariate time series (raw prices or log prices).
    p_range, q_range : list[int]
        Candidate AR and MA orders.
    d : int
        Fixed differencing order.
    ic : str
        Information criterion: ``"aic"`` or ``"bic"``.

    Returns
    -------
    tuple[int, int, int]
        Best (p, d, q) order.
    """
    from statsmodels.tsa.arima.model import ARIMA

    p_range = p_range or [0, 1, 2, 3]
    q_range = q_range or [0, 1, 2, 3]
    best_ic = np.inf
    best_order = (1, d, 1)

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        for p, q in product(p_range, q_range):
            try:
                res = ARIMA(series, order=(p, d, q)).fit()
                score = getattr(res, ic)
                if score < best_ic:
                    best_ic = score
                    best_order = (p, d, q)
            except Exception:  # noqa: BLE001
                continue

    logger.info("Best ARIMA order: %s  (%s=%.2f)", best_order, ic.upper(), best_ic)
    return best_order


def fit_arima(series: pd.Series, order: tuple[int, int, int]) -> Any:
    """Fit an ARIMA model and return the fitted result."""
    from statsmodels.tsa.arima.model import ARIMA

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        model = ARIMA(series, order=order).fit()
    return model


def predict_arima(
    model: Any,
    steps: int = 30,
    train_series: pd.Series | None = None,
) -> pd.Series:
    """Generate an out-of-sample forecast.

    Parameters
    ----------
    model
        Fitted ARIMA result from :func:`fit_arima`.
    steps : int
        Number of steps to forecast ahead.
    train_series : pd.Series, optional
        If provided, the index is used to build the future DatetimeIndex.

    Returns
    -------
    pd.Series
        Forecast values with a DatetimeIndex if possible.
    """
    forecast = model.forecast(steps=steps)
    if train_series is not None and hasattr(train_series.index, "freq"):
        try:
            last_date = train_series.index[-1]
            freq = pd.infer_freq(train_series.index) or "D"
            future_index = pd.date_range(start=last_date, periods=steps + 1, freq=freq)[1:]
            forecast = pd.Series(forecast.values, index=future_index)
        except Exception:  # noqa: BLE001
            pass
    return forecast


def run_arima_pipeline(
    df: pd.DataFrame,
    asset: str,
    train_frac: float = 0.8,
    steps: int = 30,
) -> dict:
    """End-to-end ARIMA pipeline for a single asset.

    Returns a result dict with keys: asset, order, metrics, forecast.
    """
    from .evaluate import compute_metrics

    asset_df = df[df["asset"] == asset].set_index("date").sort_index()
    close = asset_df["close"].dropna()

    split = int(len(close) * train_frac)
    train, test = close.iloc[:split], close.iloc[split:]

    order = grid_search_arima(train)
    model = fit_arima(train, order)

    # In-sample test predictions
    pred = model.predict(start=len(train), end=len(close) - 1)
    metrics = compute_metrics(test.values, pred.values, model_name="ARIMA", asset=asset)

    # Future forecast
    future = predict_arima(model, steps=steps, train_series=close)

    logger.info("ARIMA pipeline done for %s: %s", asset, metrics)
    return {"asset": asset, "order": order, "metrics": metrics, "forecast": future, "model": model}
