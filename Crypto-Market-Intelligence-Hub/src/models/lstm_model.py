"""LSTM model: build, train, and predict."""
from __future__ import annotations

import logging
from typing import Any

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

logger = logging.getLogger(__name__)


def build_lstm(
    seq_len: int,
    units: list[int] | None = None,
    dropout_rate: float = 0.2,
    batch_norm: bool = True,
    dense_units: int = 32,
    learning_rate: float = 0.001,
) -> Any:
    """Build a stacked LSTM model with optional Batch Normalization.

    Parameters
    ----------
    seq_len : int
        Look-back window (time steps per input sequence).
    units : list[int]
        Sizes for each stacked LSTM layer.
    dropout_rate : float
        Dropout fraction after each LSTM layer.
    batch_norm : bool
        Whether to insert BatchNormalization after each LSTM.
    dense_units : int
        Size of the pre-output Dense layer.
    learning_rate : float
        Adam optimizer learning rate.

    Returns
    -------
    keras.Model
        Compiled Keras LSTM model.
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
        x = keras.layers.LSTM(n_units, return_sequences=return_seq)(x)
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
    logger.info("LSTM model built: %d params", model.count_params())
    return model


def train_lstm(
    model: Any,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_val: np.ndarray,
    y_val: np.ndarray,
    epochs: int = 100,
    batch_size: int = 32,
) -> Any:
    """Train the LSTM model with EarlyStopping and ReduceLROnPlateau."""
    try:
        from tensorflow import keras
    except ImportError as exc:
        raise ImportError("TensorFlow is required.") from exc

    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=10, restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6
        ),
    ]
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=0,
    )
    logger.info("LSTM training complete (%d epochs used).", len(history.history["loss"]))
    return history


def run_lstm_pipeline(
    df: pd.DataFrame,
    asset: str,
    seq_len: int = 60,
    train_frac: float = 0.8,
    forecast_steps: int = 30,
) -> dict:
    """End-to-end LSTM pipeline for a single asset."""
    from .evaluate import compute_metrics
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

    model = build_lstm(seq_len)
    train_lstm(model, X_train, y_train, X_val, y_val)

    # Test predictions
    test_pred_s = model.predict(X_test, verbose=0).flatten()
    test_pred = scaler.inverse_transform(test_pred_s.reshape(-1, 1)).flatten()
    y_test = scaler.inverse_transform(y_test_s.reshape(-1, 1)).flatten()
    metrics = compute_metrics(y_test, test_pred, model_name="LSTM", asset=asset)

    # Iterative future forecast
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

    logger.info("LSTM pipeline done for %s: %s", asset, metrics)
    return {
        "asset": asset,
        "metrics": metrics,
        "forecast": future_pred,
        "model": model,
        "scaler": scaler,
    }
