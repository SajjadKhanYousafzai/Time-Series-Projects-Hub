"""
src/models/sarima_model.py
==========================
SARIMA forecasting model for the Hospitality employment series.
"""
from __future__ import annotations

import logging
import warnings
from dataclasses import dataclass, field
from typing import Optional

import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

logger = logging.getLogger(__name__)
warnings.filterwarnings("ignore")


@dataclass
class SARIMAResult:
    model_name: str = "SARIMA"
    order: tuple = (1, 1, 1)
    seasonal_order: tuple = (1, 1, 1, 12)
    aic: float = 0.0
    bic: float = 0.0
    train_predictions: Optional[pd.Series] = None
    test_predictions: Optional[pd.Series] = None
    forecast: Optional[pd.Series] = None
    forecast_lower: Optional[pd.Series] = None
    forecast_upper: Optional[pd.Series] = None
    residuals: Optional[pd.Series] = None
    params: dict = field(default_factory=dict)


class SARIMAForecaster:
    """SARIMA(p,d,q)(P,D,Q,s) forecaster with residual diagnostics."""

    def __init__(
        self,
        order: tuple = (1, 1, 1),
        seasonal_order: tuple = (1, 1, 1, 12),
        trend: str = "n",
    ):
        self.order = order
        self.seasonal_order = seasonal_order
        self.trend = trend
        self._fit_result = None

    def fit(self, train: pd.Series) -> "SARIMAForecaster":
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
            "SARIMA%s%s fitted. AIC=%.2f BIC=%.2f",
            self.order, self.seasonal_order,
            self._fit_result.aic, self._fit_result.bic,
        )
        return self

    def predict(self, start: int | str, end: int | str) -> pd.Series:
        if self._fit_result is None:
            raise RuntimeError("Model not fitted. Call fit() first.")
        return self._fit_result.predict(start=start, end=end)

    def forecast(self, steps: int = 24, alpha: float = 0.05) -> SARIMAResult:
        if self._fit_result is None:
            raise RuntimeError("Model not fitted. Call fit() first.")
        fc = self._fit_result.get_forecast(steps=steps)
        ci = fc.conf_int(alpha=alpha)
        result = SARIMAResult(
            order=self.order,
            seasonal_order=self.seasonal_order,
            aic=self._fit_result.aic,
            bic=self._fit_result.bic,
            forecast=fc.predicted_mean,
            forecast_lower=ci.iloc[:, 0],
            forecast_upper=ci.iloc[:, 1],
            residuals=self._fit_result.resid,
        )
        return result

    def train_test_forecast(
        self, series: pd.Series, test_ratio: float = 0.2, horizon: int = 24
    ) -> SARIMAResult:
        split = int(len(series) * (1 - test_ratio))
        train, test = series.iloc[:split], series.iloc[split:]
        self.fit(train)
        test_pred = self.predict(test.index[0], test.index[-1])
        result = self.forecast(steps=horizon)
        result.train_predictions = self.predict(train.index[0], train.index[-1])
        result.test_predictions = test_pred
        return result
