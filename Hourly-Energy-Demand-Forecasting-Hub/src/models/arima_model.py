"""
src/models/arima_model.py
=========================
ARIMA / SARIMA forecaster for hourly energy demand.
"""
from __future__ import annotations

import logging
import warnings
from dataclasses import dataclass, field
from typing import Optional

import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

logger = logging.getLogger(__name__)
warnings.filterwarnings("ignore")


@dataclass
class ARIMAResult:
    model_name: str = "ARIMA"
    order: tuple = (1, 1, 1)
    seasonal_order: tuple = (0, 0, 0, 0)
    aic: float = 0.0
    bic: float = 0.0
    fitted: Optional[pd.Series] = None
    test_predictions: Optional[pd.Series] = None
    forecast: Optional[pd.Series] = None
    forecast_lower: Optional[pd.Series] = None
    forecast_upper: Optional[pd.Series] = None
    residuals: Optional[pd.Series] = None


class ARIMAForecaster:
    """
    ARIMA(p,d,q) or SARIMA(p,d,q)(P,D,Q,s) forecaster.

    For short hourly horizons, use ARIMA(5,1,0) or ARIMA(1,1,1).
    For daily-seasonal patterns, use SARIMA with s=24.
    """

    def __init__(
        self,
        order: tuple = (1, 1, 1),
        seasonal_order: tuple = (0, 0, 0, 0),
        trend: str = "n",
    ):
        self.order         = order
        self.seasonal_order = seasonal_order
        self.trend         = trend
        self._fit_result   = None

    def fit(self, train: pd.Series) -> "ARIMAForecaster":
        model = SARIMAX(
            train,
            order=self.order,
            seasonal_order=self.seasonal_order,
            trend=self.trend,
            enforce_stationarity=True,
            enforce_invertibility=True,
        )
        self._fit_result = model.fit(disp=False)
        logger.info(
            "ARIMA%s%s fitted — AIC=%.2f  BIC=%.2f",
            self.order, self.seasonal_order,
            self._fit_result.aic, self._fit_result.bic,
        )
        return self

    def predict(self, start, end) -> pd.Series:
        if self._fit_result is None:
            raise RuntimeError("Model not fitted. Call fit() first.")
        return self._fit_result.predict(start=start, end=end)

    def forecast(self, steps: int = 24, alpha: float = 0.05) -> ARIMAResult:
        if self._fit_result is None:
            raise RuntimeError("Model not fitted. Call fit() first.")
        fc  = self._fit_result.get_forecast(steps=steps)
        ci  = fc.conf_int(alpha=alpha)
        return ARIMAResult(
            model_name=f"ARIMA{self.order}",
            order=self.order,
            seasonal_order=self.seasonal_order,
            aic=self._fit_result.aic,
            bic=self._fit_result.bic,
            fitted=self._fit_result.fittedvalues,
            forecast=fc.predicted_mean,
            forecast_lower=ci.iloc[:, 0],
            forecast_upper=ci.iloc[:, 1],
            residuals=self._fit_result.resid,
        )

    def train_test_forecast(
        self, series: pd.Series, test_ratio: float = 0.2, horizon: int = 24
    ) -> ARIMAResult:
        split = int(len(series) * (1 - test_ratio))
        train, test = series.iloc[:split], series.iloc[split:]
        self.fit(train)
        test_pred = self.predict(test.index[0], test.index[-1])
        result = self.forecast(steps=horizon)
        result.test_predictions = test_pred
        return result
