"""Structured logging setup."""
from __future__ import annotations

import logging
import logging.config
import os
from pathlib import Path

import yaml


def setup_logging(config_path: str | Path | None = None, log_level: str = "INFO") -> None:
    """Configure logging from YAML config file or sensible defaults.

    Parameters
    ----------
    config_path : str | Path, optional
        Path to ``logging.yaml``. Defaults to ``config/logging.yaml`` relative
        to the repository root.
    log_level : str
        Fallback log level if config file is not found.
    """
    if config_path is None:
        root = Path(__file__).resolve().parents[2]
        config_path = root / "config" / "logging.yaml"

    config_path = Path(config_path)

    # Ensure log directory exists
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    if config_path.exists():
        with open(config_path) as f:
            config = yaml.safe_load(f)
        try:
            logging.config.dictConfig(config)
            return
        except Exception:  # noqa: BLE001
            pass  # fall through to basic config

    # Fallback to basic config
    logging.basicConfig(
        level=getattr(logging, log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )


def get_logger(name: str) -> logging.Logger:
    """Return a named logger.

    Usage
    -----
    >>> logger = get_logger(__name__)
    >>> logger.info("Hello from %s", __name__)
    """
    return logging.getLogger(name)
