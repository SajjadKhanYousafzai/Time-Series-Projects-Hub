"""GRU model: build, train, and predict (mirrors lstm_model.py using GRU cells)."""
from __future__ import annotations

import logging

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

logger = logging.getLogger(__name__)


def build_gru(
    seq_len: int,
    units: list[int] | None = None,
    dropout_rate: float = 0.2,
    batch_norm: bool = True,
    dense_units: int = 32,
    learning_rate: float = 0.001,
):
    """Build a stacked GRU model.

    Same architecture as :func:`src.models.lstm_model.build_lstm` but uses
    GRU cells — ~30% fewer parameters with comparable accuracy.
    """
    try:
        import tensorflow as tf
        from tensorflow import keras
    except ImportError as exc:
        raise ImportError("TensorFlow is required. Run: pip install tensorflow") from exc

    units = units or [128, 64]
    inputs = keras.Input(shape=(seq_len, 1))
    x = inputs
    for i, n_units in enumerate(units):
        return_seq = i < len(units) - 1
        x = keras.layers.GRU(n_units, return_sequences=return_seq)(x)
        if batch_norm:
            x = keras.layers.BatchNormalization()(x)
        x = keras.layers.Dropout(dropout_rate)(x)
    x = keras.layers.Dense(dense_units, activation="relu")(x)
    outputs = keras.layers.Dense(1)(x)

    model = keras.Model(inputs, outputs)
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss="mse",
    )
    logger.info("GRU model built: %d params", model.count_params())
    return model


def run_gru_pipeline(
    df: pd.DataFrame,
    asset: str,
    seq_len: int = 60,
    train_frac: float = 0.8,
    forecast_steps: int = 30,
) -> dict:
    """End-to-end GRU pipeline for a single asset (mirrors LSTM pipeline)."""
    from .evaluate import compute_metrics
    from .lstm_model import train_lstm
    from src.features.pipeline import prepare_sequences

    asset_df = df[df["asset"] == asset].sort_values("date")
    close = asset_df["close"].values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(close).flatten()

    split = int(len(scaled) * train_frac)
    train_scaled, test_scaled = scaled[:split], scaled[split - seq_len :]

    X_train, y_train = prepare_sequences(train_scaled, seq_len)
    X_test, y_test_s = prepare_sequences(test_scaled, seq_len)

    val_split = int(len(X_train) * 0.9)
    X_val, y_val = X_train[val_split:], y_train[val_split:]
    X_train, y_train = X_train[:val_split], y_train[:val_split]

    model = build_gru(seq_len)
    train_lstm(model, X_train, y_train, X_val, y_val)  # same training loop

    test_pred_s = model.predict(X_test, verbose=0).flatten()
    test_pred = scaler.inverse_transform(test_pred_s.reshape(-1, 1)).flatten()
    y_test = scaler.inverse_transform(y_test_s.reshape(-1, 1)).flatten()
    metrics = compute_metrics(y_test, test_pred, model_name="GRU", asset=asset)

    last_seq = scaled[-seq_len:]
    future_preds_s: list[float] = []
    for _ in range(forecast_steps):
        seq = last_seq[-seq_len:].reshape(1, seq_len, 1)
        next_val = model.predict(seq, verbose=0)[0, 0]
        future_preds_s.append(next_val)
        last_seq = np.append(last_seq, next_val)

    future_pred = scaler.inverse_transform(
        np.array(future_preds_s).reshape(-1, 1)
    ).flatten()

    logger.info("GRU pipeline done for %s: %s", asset, metrics)
    return {
        "asset": asset,
        "metrics": metrics,
        "forecast": future_pred,
        "model": model,
        "scaler": scaler,
    }
