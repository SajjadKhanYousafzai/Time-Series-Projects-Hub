"""Prophet model: fitting, prediction, and component decomposition."""
from __future__ import annotations

import logging
from typing import Any

import pandas as pd

logger = logging.getLogger(__name__)


def fit_prophet(
    df_asset: pd.DataFrame,
    seasonality_mode: str = "multiplicative",
    yearly_seasonality: bool = True,
    weekly_seasonality: bool = True,
    changepoint_prior_scale: float = 0.05,
    interval_width: float = 0.80,
) -> Any:
    """Fit a Prophet model on a single asset's price series.

    Parameters
    ----------
    df_asset : pd.DataFrame
        DataFrame with ``date`` and ``close`` columns.
    seasonality_mode : str
        ``"multiplicative"`` or ``"additive"``.
    yearly_seasonality, weekly_seasonality : bool
        Enable/disable seasonality components.
    changepoint_prior_scale : float
        Flexibility of the trend changepoints.
    interval_width : float
        Width of the uncertainty interval.

    Returns
    -------
    Prophet
        Fitted Prophet model instance.
    """
    try:
        from prophet import Prophet
    except ImportError as exc:
        raise ImportError("prophet is required. Run: pip install prophet") from exc

    prophet_df = df_asset[["date", "close"]].rename(columns={"date": "ds", "close": "y"})
    prophet_df = prophet_df.dropna()

    model = Prophet(
        seasonality_mode=seasonality_mode,
        yearly_seasonality=yearly_seasonality,
        weekly_seasonality=weekly_seasonality,
        daily_seasonality=False,
        changepoint_prior_scale=changepoint_prior_scale,
        interval_width=interval_width,
    )
    model.fit(prophet_df)
    logger.info("Prophet fitted on %d observations.", len(prophet_df))
    return model


def forecast_prophet(model: Any, periods: int = 30) -> pd.DataFrame:
    """Generate a future forecast from a fitted Prophet model.

    Returns
    -------
    pd.DataFrame
        Prophet forecast DataFrame (ds, yhat, yhat_lower, yhat_upper, …).
    """
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast


def run_prophet_pipeline(
    df: pd.DataFrame,
    asset: str,
    train_frac: float = 0.8,
    forecast_periods: int = 30,
) -> dict:
    """End-to-end Prophet pipeline for a single asset."""
    from .evaluate import compute_metrics

    asset_df = df[df["asset"] == asset].sort_values("date")
    split = int(len(asset_df) * train_frac)
    train_df = asset_df.iloc[:split]
    test_df = asset_df.iloc[split:]

    model = fit_prophet(train_df)
    forecast = forecast_prophet(model, periods=len(test_df) + forecast_periods)

    # Align test predictions
    test_pred = (
        forecast[forecast["ds"].isin(test_df["date"])]["yhat"].values
    )
    y_test = test_df["close"].values[: len(test_pred)]
    metrics = compute_metrics(y_test, test_pred, model_name="Prophet", asset=asset)

    future_fc = forecast.tail(forecast_periods)[["ds", "yhat", "yhat_lower", "yhat_upper"]]
    logger.info("Prophet pipeline done for %s: %s", asset, metrics)
    return {"asset": asset, "metrics": metrics, "forecast": future_fc, "model": model}
