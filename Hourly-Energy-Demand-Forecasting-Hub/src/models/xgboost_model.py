"""
src/models/xgboost_model.py
============================
XGBoost gradient-boosted tree forecaster for hourly energy demand.
Uses time-based features from src/features/time_features.py.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error

logger = logging.getLogger(__name__)


@dataclass
class XGBResult:
    model_name: str = "XGBoost"
    feature_importance: dict = field(default_factory=dict)
    test_predictions: Optional[pd.Series] = None
    forecast: Optional[pd.Series] = None
    mae: float = 0.0
    rmse: float = 0.0
    mape: float = 0.0


class XGBoostForecaster:
    """
    XGBoost-based hourly energy demand forecaster.

    Uses time-feature columns (hour, day_of_week, month, lag_24, lag_168, etc.)
    produced by src.features.time_features.add_time_features().
    """

    def __init__(
        self,
        n_estimators: int   = 1000,
        max_depth: int      = 6,
        learning_rate: float = 0.05,
        subsample: float    = 0.8,
        colsample: float    = 0.8,
        early_stopping: int = 50,
        random_state: int   = 42,
    ):
        self.params = dict(
            n_estimators=n_estimators,
            max_depth=max_depth,
            learning_rate=learning_rate,
            subsample=subsample,
            colsample_bytree=colsample,
            random_state=random_state,
            n_jobs=-1,
            objective="reg:squarederror",
        )
        self.early_stopping = early_stopping
        self._model         = None
        self._feature_cols: list[str] = []

    def fit(
        self,
        train_df: pd.DataFrame,
        val_df: Optional[pd.DataFrame] = None,
        feature_cols: Optional[list[str]] = None,
        target_col: str = "MW",
    ) -> "XGBoostForecaster":
        """
        Fit XGBoost on a feature-engineered DataFrame.

        Parameters
        ----------
        train_df     : DataFrame from add_time_features()
        val_df       : Optional validation set for early stopping
        feature_cols : list of feature column names (default: all non-target cols)
        target_col   : Target column name (default 'MW')
        """
        try:
            import xgboost as xgb  # type: ignore
        except ImportError:
            raise ImportError(
                "XGBoost not installed. Run: pip install xgboost\n"
                "Note: xgboost is an optional dependency."
            )

        non_feature = [target_col, "season"]
        self._feature_cols = feature_cols or [
            c for c in train_df.columns if c not in non_feature
        ]

        X_train = train_df[self._feature_cols].values
        y_train = train_df[target_col].values

        fit_kwargs: dict = {}
        if val_df is not None:
            X_val  = val_df[self._feature_cols].values
            y_val  = val_df[target_col].values
            fit_kwargs["eval_set"] = [(X_val, y_val)]
            fit_kwargs["verbose"]  = False

        self._model = xgb.XGBRegressor(**self.params)
        self._model.fit(X_train, y_train, **fit_kwargs)

        importance = dict(zip(
            self._feature_cols,
            self._model.feature_importances_.tolist()
        ))
        logger.info(
            "XGBoost fitted on %d samples, %d features.",
            len(X_train), len(self._feature_cols),
        )
        return self

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        if self._model is None:
            raise RuntimeError("Model not fitted. Call fit() first.")
        X = df[self._feature_cols].values
        return self._model.predict(X)

    def evaluate(
        self,
        test_df: pd.DataFrame,
        target_col: str = "MW",
    ) -> XGBResult:
        """Run inference on test_df and compute MAE/RMSE/MAPE."""
        preds = self.predict(test_df)
        y     = test_df[target_col].values
        pred_series = pd.Series(preds, index=test_df.index, name="MW_pred")

        mask = y != 0
        mae  = mean_absolute_error(y, preds)
        rmse = float(np.sqrt(mean_squared_error(y, preds)))
        mape = float(np.mean(np.abs((y[mask] - preds[mask]) / y[mask])) * 100)

        logger.info("XGBoost — MAE=%.2f  RMSE=%.2f  MAPE=%.2f%%", mae, rmse, mape)

        importance = {}
        if self._model is not None:
            importance = dict(zip(self._feature_cols, self._model.feature_importances_.tolist()))

        return XGBResult(
            test_predictions=pred_series,
            mae=mae, rmse=rmse, mape=mape,
            feature_importance=importance,
        )

    def save(self, path: Path) -> None:
        """Save the fitted model to disk (JSON format)."""
        if self._model is None:
            raise RuntimeError("Model not fitted.")
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        self._model.save_model(str(path))
        logger.info("XGBoost model saved → %s", path)

    def load(self, path: Path) -> "XGBoostForecaster":
        """Load a previously saved model."""
        try:
            import xgboost as xgb  # type: ignore
        except ImportError:
            raise ImportError("xgboost not installed. Run: pip install xgboost")
        self._model = xgb.XGBRegressor()
        self._model.load_model(str(path))
        logger.info("XGBoost model loaded from %s", path)
        return self
