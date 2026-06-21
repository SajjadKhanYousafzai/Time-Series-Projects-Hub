"""Predictions router — run forecasting models on request."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException

from src.api.schemas import PredictionRequest, PredictionResponse, ForecastPoint
from src.api.dependencies import get_data_path
from src.data.load import load_all
from src.data.clean import basic_clean

logger = logging.getLogger(__name__)
router = APIRouter()

SUPPORTED_MODELS = {"arima", "prophet", "lstm", "gru"}


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Generate price forecast for an asset",
)
async def predict(
    request: PredictionRequest,
    data_path: Path = Depends(get_data_path),
) -> PredictionResponse:
    """Run the specified forecasting model and return a price forecast.

    - **asset**: crypto asset identifier (e.g. ``bitcoin``)
    - **model**: ``arima`` | ``prophet`` | ``lstm`` | ``gru``
    - **horizon**: number of days to forecast (1–90)
    """
    if request.model not in SUPPORTED_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model}' not supported. Choose from: {sorted(SUPPORTED_MODELS)}",
        )

    logger.info("POST /predict  asset=%s model=%s horizon=%d", request.asset, request.model, request.horizon)

    # Load data
    asset_file = data_path / f"{request.asset}.csv"
    if not asset_file.exists():
        raise HTTPException(status_code=404, detail=f"Asset '{request.asset}' not found.")

    import pandas as pd
    df = pd.read_csv(asset_file)
    df.columns = [c.lower() for c in df.columns]
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
    df["asset"] = request.asset
    df = basic_clean(df)

    current_price = float(df["close"].iloc[-1]) if not df.empty else None
    last_date = df["date"].iloc[-1]

    # Run the chosen model
    try:
        forecast_points = _run_model(df, request.asset, request.model, request.horizon, last_date)
    except Exception as exc:
        logger.exception("Model %s failed for asset %s", request.model, request.asset)
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(exc)}") from exc

    return PredictionResponse(
        asset=request.asset,
        model=request.model,
        horizon=request.horizon,
        current_price=current_price,
        forecast=forecast_points,
    )


def _run_model(df, asset, model_name, horizon, last_date) -> list[ForecastPoint]:
    """Dispatch to the appropriate model pipeline."""
    future_dates = [last_date + timedelta(days=i + 1) for i in range(horizon)]

    if model_name == "prophet":
        from src.models.prophet_model import run_prophet_pipeline
        result = run_prophet_pipeline(df, asset, forecast_periods=horizon)
        fc = result["forecast"]
        points = []
        for _, row in fc.iterrows():
            points.append(ForecastPoint(
                date=row["ds"],
                predicted=float(row["yhat"]),
                lower=float(row["yhat_lower"]) if "yhat_lower" in row else None,
                upper=float(row["yhat_upper"]) if "yhat_upper" in row else None,
            ))
        return points

    elif model_name == "arima":
        from src.models.arima_model import run_arima_pipeline
        result = run_arima_pipeline(df, asset, steps=horizon)
        forecast_vals = result["forecast"].values
        return [
            ForecastPoint(date=d, predicted=float(v))
            for d, v in zip(future_dates, forecast_vals)
        ]

    elif model_name == "lstm":
        from src.models.lstm_model import run_lstm_pipeline
        result = run_lstm_pipeline(df, asset, forecast_steps=horizon)
        return [
            ForecastPoint(date=d, predicted=float(v))
            for d, v in zip(future_dates, result["forecast"])
        ]

    elif model_name == "gru":
        from src.models.gru_model import run_gru_pipeline
        result = run_gru_pipeline(df, asset, forecast_steps=horizon)
        return [
            ForecastPoint(date=d, predicted=float(v))
            for d, v in zip(future_dates, result["forecast"])
        ]

    return []


@router.get("/predict/{asset}", summary="Quick GET-based forecast (Prophet, 30 days)")
async def predict_get(
    asset: str,
    horizon: int = 30,
    data_path: Path = Depends(get_data_path),
) -> PredictionResponse:
    """Convenience GET endpoint using Prophet with default 30-day horizon."""
    req = PredictionRequest(asset=asset, model="prophet", horizon=horizon)
    return await predict(req, data_path)
