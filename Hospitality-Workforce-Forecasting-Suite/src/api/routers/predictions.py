"""src/api/routers/predictions.py — Forecasting endpoints."""
from fastapi import APIRouter, HTTPException
from ..schemas import ForecastRequest, ForecastResponse, ForecastPoint
from src.data.store import load_processed
from src.models import (
    SARIMAForecaster, HoltWintersForecaster, SeasonalNaiveForecaster,
    compute_metrics,
)

router = APIRouter()

MODEL_MAP = {
    "sarima":        SARIMAForecaster,
    "holt_winters":  HoltWintersForecaster,
    "naive":         SeasonalNaiveForecaster,
}


@router.post("/predict", response_model=ForecastResponse)
async def predict(req: ForecastRequest):
    """Run a forecast model and return predictions with confidence intervals."""
    model_key = req.model.lower().replace("-", "_")
    if model_key not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown model '{req.model}'. Choose from: {list(MODEL_MAP)}")
    try:
        series = load_processed()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    try:
        forecaster = MODEL_MAP[model_key]()
        result = forecaster.train_test_forecast(series, test_ratio=0.2, horizon=req.horizon)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {e}")

    # Compute test metrics
    mae, rmse, mape = None, None, None
    if result.test_predictions is not None:
        split = int(len(series) * 0.8)
        test = series.iloc[split:]
        m = compute_metrics(test, result.test_predictions, model_name=req.model)
        mae, rmse, mape = round(m.mae, 3), round(m.rmse, 3), round(m.mape, 3)

    forecast = result.forecast
    lower = getattr(result, "forecast_lower", None)
    upper = getattr(result, "forecast_upper", None)

    points = []
    for dt in forecast.index:
        points.append(ForecastPoint(
            date=dt.date(),
            forecast=round(float(forecast[dt]), 3),
            lower=round(float(lower[dt]), 3) if lower is not None else None,
            upper=round(float(upper[dt]), 3) if upper is not None else None,
        ))

    return ForecastResponse(
        model=req.model,
        horizon=req.horizon,
        confidence=req.confidence,
        forecast=points,
        mae=mae, rmse=rmse, mape=mape,
    )
