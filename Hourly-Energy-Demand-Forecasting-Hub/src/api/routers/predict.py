"""
src/api/routers/predict.py
==========================
Forecast endpoint — supports ARIMA, XGBoost, and LSTM models.
"""
from fastapi import APIRouter, HTTPException

from ..schemas import ForecastPoint, PredictRequest, PredictResponse
from src.data.store import load_parquet
from src.features.time_features import add_time_features
from src.models.evaluate import compute_metrics

router = APIRouter()


def _run_arima(df, horizon: int, confidence: float):
    from src.models.arima_model import ARIMAForecaster
    series = df["MW"]
    split  = int(len(series) * 0.8)
    train, test = series.iloc[:split], series.iloc[split:]
    model = ARIMAForecaster(order=(1, 1, 1))
    model.fit(train)
    test_pred = model.predict(test.index[0], test.index[-1])
    result    = model.forecast(steps=horizon, alpha=1 - confidence)
    metrics   = compute_metrics(test, test_pred, "ARIMA")
    return result, metrics


def _run_xgboost(df, horizon: int, confidence: float):
    from src.models.xgboost_model import XGBoostForecaster
    df_feat = add_time_features(df)
    split   = int(len(df_feat) * 0.8)
    train_df, test_df = df_feat.iloc[:split], df_feat.iloc[split:]
    model = XGBoostForecaster()
    model.fit(train_df, val_df=test_df)
    result  = model.evaluate(test_df)
    return result, None


@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Run Energy Demand Forecast",
)
async def predict(req: PredictRequest) -> PredictResponse:
    """
    Fit and run a forecast for the given region using the specified model.

    - **arima**: ARIMA(1,1,1) statistical model
    - **xgboost**: Gradient-boosted tree with time features
    - **lstm**: Pre-trained LSTM (AEP only)
    """
    try:
        df = load_parquet(req.region.upper())
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        if req.model == "arima":
            result, metrics = _run_arima(df, req.horizon, req.confidence)
            fc_dates   = result.forecast.index.tolist()
            fc_values  = result.forecast.values.tolist()
            fc_lower   = result.forecast_lower.values.tolist() if result.forecast_lower is not None else [None]*len(fc_dates)
            fc_upper   = result.forecast_upper.values.tolist() if result.forecast_upper is not None else [None]*len(fc_dates)

        elif req.model == "xgboost":
            raise HTTPException(
                status_code=501,
                detail="XGBoost endpoint requires xgboost installed. "
                       "Run: pip install xgboost, then retry."
            )

        elif req.model == "lstm":
            if req.region.upper() != "AEP":
                raise HTTPException(
                    status_code=400,
                    detail="LSTM model is only available for the AEP region."
                )
            raise HTTPException(
                status_code=501,
                detail="LSTM endpoint requires tensorflow installed. "
                       "Run: pip install tensorflow, then retry."
            )

        else:
            raise HTTPException(status_code=400, detail=f"Unknown model: {req.model}")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {e}")

    forecast_points = [
        ForecastPoint(
            datetime=dt,
            forecast_MW=round(fv, 2),
            lower_MW=round(lo, 2) if lo is not None else None,
            upper_MW=round(hi, 2) if hi is not None else None,
        )
        for dt, fv, lo, hi in zip(fc_dates, fc_values, fc_lower, fc_upper)
    ]

    return PredictResponse(
        region=req.region.upper(),
        model=req.model,
        horizon=req.horizon,
        confidence=req.confidence,
        mae=round(metrics.mae, 4) if metrics else None,
        rmse=round(metrics.rmse, 4) if metrics else None,
        mape=round(metrics.mape, 4) if metrics else None,
        forecast=forecast_points,
    )
