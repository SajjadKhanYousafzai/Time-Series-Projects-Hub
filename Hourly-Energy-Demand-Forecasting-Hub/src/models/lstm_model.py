"""
src/models/lstm_model.py
========================
LSTM wrapper for loading and running inference on saved Keras/TF models.
The saved model lives at models/{REGION}/lstm_model/.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

_THIS_FILE    = Path(__file__).resolve()
_PROJECT_ROOT = _THIS_FILE.parents[2]
_MODELS_DIR   = _PROJECT_ROOT / "models"


class LSTMForecaster:
    """
    Wrapper around a saved Keras LSTM model for hourly energy demand.

    The model is loaded lazily on first call to predict() or forecast().
    Requires tensorflow ≥ 2.12 (not in core requirements.txt — install separately).
    """

    def __init__(self, region: str = "AEP"):
        self.region     = region.upper()
        self.model_dir  = _MODELS_DIR / self.region / "lstm_model"
        self._model     = None
        self._feature_cols: list[str] = []
        self._load_metadata()

    def _load_metadata(self) -> None:
        """Load feature_cols.json and model_metrics.json if available."""
        import json

        fc_path = _MODELS_DIR / self.region / "feature_cols.json"
        mm_path = _MODELS_DIR / self.region / "model_metrics.json"

        if fc_path.exists():
            with open(fc_path) as f:
                data = json.load(f)
                self._feature_cols = data if isinstance(data, list) else data.get("feature_cols", [])
            logger.info("Loaded %d feature columns for %s LSTM.", len(self._feature_cols), self.region)

        if mm_path.exists():
            with open(mm_path) as f:
                self._metrics = json.load(f)
            logger.info("Model metrics loaded: %s", self._metrics)

    def _load_model(self) -> None:
        """Lazily load Keras model from SavedModel directory."""
        try:
            import tensorflow as tf  # type: ignore
        except ImportError:
            raise ImportError(
                "TensorFlow not installed. Run: pip install tensorflow\n"
                "Note: tensorflow is an optional dependency not in requirements.txt."
            )

        if not self.model_dir.exists():
            raise FileNotFoundError(
                f"LSTM SavedModel not found: {self.model_dir}\n"
                f"Only AEP region has a pre-trained LSTM model."
            )

        self._model = tf.saved_model.load(str(self.model_dir))
        logger.info("LSTM model loaded from %s", self.model_dir)

    def predict(
        self,
        X: np.ndarray,
        batch_size: int = 512,
    ) -> np.ndarray:
        """
        Run inference on prepared feature array X.

        Parameters
        ----------
        X          : np.ndarray  shape (n_samples, n_timesteps, n_features)
        batch_size : int         batch size for inference

        Returns
        -------
        np.ndarray  shape (n_samples,) — predicted MW values
        """
        if self._model is None:
            self._load_model()

        import tensorflow as tf  # type: ignore
        X_tensor = tf.constant(X, dtype=tf.float32)
        preds    = self._model(X_tensor, training=False)
        return preds.numpy().flatten()

    def forecast_from_df(
        self,
        df: pd.DataFrame,
        lookback: int = 168,
        horizon: int = 24,
    ) -> pd.Series:
        """
        Generate a `horizon`-step ahead forecast using the last `lookback` hours of df.

        Parameters
        ----------
        df       : pd.DataFrame  DataFrame with feature columns (output of add_time_features).
        lookback : int           Number of past hours to use as context.
        horizon  : int           Forecast horizon in hours.

        Returns
        -------
        pd.Series  Forecast with DatetimeIndex.
        """
        feat_cols = self._feature_cols or [c for c in df.columns if c != "MW"]
        X = df[feat_cols].values[-lookback:].reshape(1, lookback, len(feat_cols))
        preds = self.predict(X)

        last_dt  = df.index[-1]
        fc_index = pd.date_range(last_dt + pd.Timedelta(hours=1), periods=horizon, freq="h")
        return pd.Series(preds[:horizon], index=fc_index, name="MW_forecast")

    @property
    def is_available(self) -> bool:
        """True if the saved model files exist on disk."""
        return self.model_dir.exists()
