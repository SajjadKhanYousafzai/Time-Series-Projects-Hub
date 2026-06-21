"""Model registry — save and load trained models.

Supports:
  - statsmodels ARIMA results (via pickle/joblib)
  - Prophet models (via joblib)
  - TensorFlow/Keras models (native SavedModel / HDF5)
  - sklearn scalers (via joblib)
"""
from __future__ import annotations

import logging
import pickle
from pathlib import Path
from typing import Any

import joblib

logger = logging.getLogger(__name__)

REGISTRY_DIR_DEFAULT = Path("data/models")


def _resolve_dir(directory: Path | str | None) -> Path:
    d = Path(directory) if directory else REGISTRY_DIR_DEFAULT
    d.mkdir(parents=True, exist_ok=True)
    return d


# ── Save ──────────────────────────────────────────────────────────────────────

def save_sklearn(obj: Any, name: str, directory: Path | str | None = None) -> Path:
    """Persist any joblib-serialisable object (sklearn, statsmodels, Prophet)."""
    d = _resolve_dir(directory)
    dest = d / f"{name}.joblib"
    joblib.dump(obj, dest)
    logger.info("Saved %s → %s", name, dest)
    return dest


def save_keras(model: Any, name: str, directory: Path | str | None = None) -> Path:
    """Save a Keras model in the native SavedModel format."""
    d = _resolve_dir(directory)
    dest = d / name
    model.save(dest)
    logger.info("Saved Keras model %s → %s", name, dest)
    return dest


# ── Load ──────────────────────────────────────────────────────────────────────

def load_sklearn(name: str, directory: Path | str | None = None) -> Any:
    """Load a joblib-serialised object."""
    d = _resolve_dir(directory)
    src = d / f"{name}.joblib"
    if not src.exists():
        raise FileNotFoundError(f"Model not found: {src}")
    obj = joblib.load(src)
    logger.info("Loaded %s ← %s", name, src)
    return obj


def load_keras(name: str, directory: Path | str | None = None) -> Any:
    """Load a saved Keras model."""
    try:
        import tensorflow as tf
    except ImportError as exc:
        raise ImportError("TensorFlow is required to load Keras models.") from exc
    d = _resolve_dir(directory)
    src = d / name
    if not src.exists():
        raise FileNotFoundError(f"Keras model not found: {src}")
    model = tf.keras.models.load_model(src)
    logger.info("Loaded Keras model %s ← %s", name, src)
    return model


def list_models(directory: Path | str | None = None) -> list[str]:
    """List all saved models in the registry directory."""
    d = _resolve_dir(directory)
    names = [p.stem for p in d.glob("*.joblib")]
    names += [p.name for p in d.iterdir() if p.is_dir()]
    return sorted(names)
