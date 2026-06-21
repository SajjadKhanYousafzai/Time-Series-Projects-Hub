"""Technical indicator features: RSI, MACD, Bollinger Bands, ATR, OBV.

All functions operate on a single-asset DataFrame (sorted by date ascending)
with OHLCV columns: open, high, low, close, volume.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


# ── Internal helpers ─────────────────────────────────────────────────────────

def _ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


# ── Public indicators ─────────────────────────────────────────────────────────

def compute_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    """Relative Strength Index."""
    delta = close.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(alpha=1 / period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1 / period, adjust=False).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def compute_macd(
    close: pd.Series,
    fast: int = 12,
    slow: int = 26,
    signal: int = 9,
) -> tuple[pd.Series, pd.Series, pd.Series]:
    """MACD line, signal line, and histogram.

    Returns
    -------
    tuple[pd.Series, pd.Series, pd.Series]
        (macd_line, signal_line, histogram)
    """
    fast_ema = _ema(close, fast)
    slow_ema = _ema(close, slow)
    macd_line = fast_ema - slow_ema
    signal_line = _ema(macd_line, signal)
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram


def compute_bollinger_bands(
    close: pd.Series,
    window: int = 20,
    num_std: float = 2.0,
) -> tuple[pd.Series, pd.Series, pd.Series]:
    """Bollinger Bands: upper, middle (SMA), lower.

    Returns
    -------
    tuple[pd.Series, pd.Series, pd.Series]
        (upper_band, middle_band, lower_band)
    """
    middle = close.rolling(window=window, min_periods=1).mean()
    std = close.rolling(window=window, min_periods=1).std()
    upper = middle + num_std * std
    lower = middle - num_std * std
    return upper, middle, lower


def compute_atr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> pd.Series:
    """Average True Range."""
    prev_close = close.shift(1)
    tr = pd.concat(
        [
            (high - low),
            (high - prev_close).abs(),
            (low - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr.ewm(alpha=1 / period, adjust=False).mean()


def compute_obv(close: pd.Series, volume: pd.Series) -> pd.Series:
    """On-Balance Volume."""
    direction = np.sign(close.diff()).fillna(0)
    return (direction * volume).cumsum()


def add_technical_indicators(
    df: pd.DataFrame,
    rsi_period: int = 14,
    macd_fast: int = 12,
    macd_slow: int = 26,
    macd_signal: int = 9,
    bb_window: int = 20,
    bb_std: float = 2.0,
    atr_period: int = 14,
) -> pd.DataFrame:
    """Add all technical indicators to a long-format DataFrame.

    Operates per-asset group. Requires: open, high, low, close, volume, asset, date.

    New columns added:
        rsi, macd, macd_signal, macd_hist,
        bb_upper, bb_middle, bb_lower, bb_width, bb_pct,
        atr, obv
    """
    df = df.copy()
    df = df.sort_values(["asset", "date"]).reset_index(drop=True)

    result_parts: list[pd.DataFrame] = []

    for _, grp in df.groupby("asset", sort=False):
        grp = grp.copy()
        close = grp["close"]

        # RSI
        grp["rsi"] = compute_rsi(close, rsi_period)

        # MACD
        grp["macd"], grp["macd_signal"], grp["macd_hist"] = compute_macd(
            close, macd_fast, macd_slow, macd_signal
        )

        # Bollinger Bands
        grp["bb_upper"], grp["bb_middle"], grp["bb_lower"] = compute_bollinger_bands(
            close, bb_window, bb_std
        )
        grp["bb_width"] = grp["bb_upper"] - grp["bb_lower"]
        # %B: position within bands
        denom = (grp["bb_upper"] - grp["bb_lower"]).replace(0, np.nan)
        grp["bb_pct"] = (close - grp["bb_lower"]) / denom

        # ATR
        if all(c in grp.columns for c in ("high", "low")):
            grp["atr"] = compute_atr(grp["high"], grp["low"], close, atr_period)

        # OBV
        if "volume" in grp.columns:
            grp["obv"] = compute_obv(close, grp["volume"])

        result_parts.append(grp)

    return pd.concat(result_parts, ignore_index=True)
