"""
src/models/holtwinters_model.py
================================
Holt-Winters Triple Exponential Smoothing forecaster.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

logger = logging.getLogger(__name__)


@dataclass
class HoltWintersResult:
    model_name: str = "Holt-Winters"
    aic: float = 0.0
    bic: float = 0.0
    train_predictions: Optional[pd.Series] = None
    test_predictions: Optional[pd.Series] = None
    forecast: Optional[pd.Series] = None
    forecast_lower: Optional[pd.Series] = None
    forecast_upper: Optional[pd.Series] = None


class HoltWintersForecaster:
    """Holt-Winters triple exponential smoothing (additive trend + additive seasonality)."""

    def __init__(
        self,
        trend: str = "add",
        seasonal: str = "add",
        seasonal_periods: int = 12,
        damped_trend: bool = False,
    ):
        self.trend = trend
        self.seasonal = seasonal
        self.seasonal_periods = seasonal_periods
        self.damped_trend = damped_trend
        self._fit_result = None

    def fit(self, train: pd.Series) -> "HoltWintersForecaster":
        model = ExponentialSmoothing(
            train,
            trend=self.trend,
            seasonal=self.seasonal,
            seasonal_periods=self.seasonal_periods,
            damped_trend=self.damped_trend,
            initialization_method="estimated",
        )
        self._fit_result = model.fit(optimized=True, remove_bias=True)
        logger.info(
            "Holt-Winters fitted. AIC=%.2f BIC=%.2f",
            self._fit_result.aic, self._fit_result.bic,
        )
        return self

    def forecast(self, steps: int = 24) -> HoltWintersResult:
        if self._fit_result is None:
            raise RuntimeError("Call fit() first.")
        fc = self._fit_result.forecast(steps)
        # Holt-Winters in statsmodels doesn't have native CI; simulate using residual std
        resid_std = self._fit_result.resid.std()
        z = 1.96
        lower = fc - z * resid_std
        upper = fc + z * resid_std
        return HoltWintersResult(
            aic=self._fit_result.aic,
            bic=self._fit_result.bic,
            forecast=fc,
            forecast_lower=lower,
            forecast_upper=upper,
        )

    def train_test_forecast(
        self, series: pd.Series, test_ratio: float = 0.2, horizon: int = 24
    ) -> HoltWintersResult:
        split = int(len(series) * (1 - test_ratio))
        train, test = series.iloc[:split], series.iloc[split:]
        self.fit(train)
        test_pred = self._fit_result.forecast(len(test))
        test_pred.index = test.index
        result = self.forecast(steps=horizon)
        result.train_predictions = self._fit_result.fittedvalues
        result.test_predictions = test_pred
        return result
