"""
src/models/naive_model.py
==========================
Seasonal Naive baseline model — uses same month from prior year as prediction.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)


@dataclass
class NaiveResult:
    model_name: str = "Seasonal Naive"
    test_predictions: Optional[pd.Series] = None
    forecast: Optional[pd.Series] = None


class SeasonalNaiveForecaster:
    """
    Seasonal Naive: yhat_t = y_{t - s}  where s = seasonal_period.
    For monthly data with s=12: predict using the same month last year.
    """

    def __init__(self, seasonal_period: int = 12):
        self.seasonal_period = seasonal_period
        self._train: Optional[pd.Series] = None

    def fit(self, train: pd.Series) -> "SeasonalNaiveForecaster":
        self._train = train
        logger.info("Seasonal Naive fitted on %d observations.", len(train))
        return self

    def forecast(self, steps: int = 24) -> NaiveResult:
        if self._train is None:
            raise RuntimeError("Call fit() first.")
        last_date = self._train.index[-1]
        future_idx = pd.date_range(
            last_date + pd.DateOffset(months=1), periods=steps, freq="MS"
        )
        preds = []
        for dt in future_idx:
            ref = dt - pd.DateOffset(years=1)
            if ref in self._train.index:
                preds.append(self._train[ref])
            else:
                # Fall back to last available same-month value
                same_month = self._train[self._train.index.month == dt.month]
                preds.append(same_month.iloc[-1] if not same_month.empty else self._train.iloc[-1])
        return NaiveResult(forecast=pd.Series(preds, index=future_idx, name="employees"))

    def train_test_forecast(
        self, series: pd.Series, test_ratio: float = 0.2, horizon: int = 24
    ) -> NaiveResult:
        split = int(len(series) * (1 - test_ratio))
        train, test = series.iloc[:split], series.iloc[split:]
        self.fit(train)
        # Test predictions using train data
        test_preds = []
        for dt in test.index:
            ref = dt - pd.DateOffset(years=1)
            if ref in train.index:
                test_preds.append(train[ref])
            else:
                same_month = train[train.index.month == dt.month]
                test_preds.append(same_month.iloc[-1] if not same_month.empty else train.iloc[-1])
        result = self.forecast(steps=horizon)
        result.test_predictions = pd.Series(test_preds, index=test.index, name="employees")
        return result
