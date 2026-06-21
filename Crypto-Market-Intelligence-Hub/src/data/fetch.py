"""Live price fetching from yfinance and CoinGecko.

This module provides functions to download the latest OHLCV data
for any crypto asset so the API can serve fresh predictions without
relying solely on the static CSV dataset.
"""
from __future__ import annotations

import logging
import time
from datetime import datetime, timedelta
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)

# CoinGecko symbol → yfinance ticker map (most common assets)
COINGECKO_TO_YFINANCE: dict[str, str] = {
    "bitcoin": "BTC-USD",
    "ethereum": "ETH-USD",
    "solana": "SOL-USD",
    "binance_coin": "BNB-USD",
    "cardano": "ADA-USD",
    "dogecoin": "DOGE-USD",
    "polygon": "MATIC-USD",
    "avalanche": "AVAX-USD",
    "chainlink": "LINK-USD",
    "litecoin": "LTC-USD",
    "polkadot": "DOT-USD",
    "uniswap": "UNI-USD",
    "stellar": "XLM-USD",
    "tron": "TRX-USD",
    "xrp": "XRP-USD",
}


def fetch_yfinance(
    asset: str,
    start: Optional[str] = None,
    end: Optional[str] = None,
    period: str = "2y",
) -> pd.DataFrame:
    """Download OHLCV data for *asset* via yfinance.

    Parameters
    ----------
    asset : str
        Internal asset name (e.g. ``"bitcoin"``).  Will be mapped to a
        yfinance ticker via :data:`COINGECKO_TO_YFINANCE`.  If not found,
        the value is used directly (e.g. ``"BTC-USD"``).
    start, end : str, optional
        ISO date strings. If omitted, ``period`` is used.
    period : str
        yfinance period string, e.g. ``"1y"``, ``"2y"``, ``"max"``.

    Returns
    -------
    pd.DataFrame
        Long-format DataFrame with columns: date, open, high, low, close, volume, asset.
    """
    try:
        import yfinance as yf  # lazy import — not required for core pipeline
    except ImportError as exc:
        raise ImportError("yfinance is required for live fetching. Run: pip install yfinance") from exc

    ticker = COINGECKO_TO_YFINANCE.get(asset.lower(), asset.upper())
    logger.info("Fetching %s (%s) via yfinance …", asset, ticker)

    if start and end:
        raw = yf.download(ticker, start=start, end=end, progress=False)
    else:
        raw = yf.download(ticker, period=period, progress=False)

    if raw.empty:
        raise ValueError(f"yfinance returned no data for ticker '{ticker}'")

    df = raw.reset_index()
    # Flatten MultiIndex columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = ["_".join(c).strip("_").lower() for c in df.columns]
    else:
        df.columns = [c.lower() for c in df.columns]

    # Normalise column names
    col_map = {
        "date": "date", "datetime": "date",
        "open": "open", f"open_{ticker.lower()}": "open",
        "high": "high", f"high_{ticker.lower()}": "high",
        "low": "low", f"low_{ticker.lower()}": "low",
        "close": "close", f"close_{ticker.lower()}": "close",
        "volume": "volume", f"volume_{ticker.lower()}": "volume",
    }
    df = df.rename(columns={k: v for k, v in col_map.items() if k in df.columns})
    df["date"] = pd.to_datetime(df["date"])
    df["asset"] = asset.lower()

    keep = [c for c in ["date", "open", "high", "low", "close", "volume", "asset"] if c in df.columns]
    return df[keep].sort_values("date").reset_index(drop=True)


def fetch_coingecko(
    asset: str,
    days: int = 365,
    currency: str = "usd",
    api_key: str = "",
) -> pd.DataFrame:
    """Fetch daily OHLCV from CoinGecko public API.

    Parameters
    ----------
    asset : str
        CoinGecko coin ID (e.g. ``"bitcoin"``).
    days : int
        Number of historical days to retrieve (max 365 on free tier).
    currency : str
        vs-currency (default ``"usd"``).
    api_key : str
        Optional Pro/Enterprise API key.

    Returns
    -------
    pd.DataFrame
        Long-format OHLCV DataFrame.
    """
    import httpx

    base_url = "https://api.coingecko.com/api/v3"
    headers = {"x-cg-demo-api-key": api_key} if api_key else {}
    url = f"{base_url}/coins/{asset}/ohlc"
    params = {"vs_currency": currency, "days": days}

    logger.info("Fetching %s OHLC from CoinGecko (days=%d) …", asset, days)
    try:
        resp = httpx.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise RuntimeError(f"CoinGecko API error: {exc.response.status_code}") from exc

    data = resp.json()
    df = pd.DataFrame(data, columns=["timestamp", "open", "high", "low", "close"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms", utc=True).dt.tz_localize(None)
    df["asset"] = asset.lower()
    df = df[["date", "open", "high", "low", "close", "asset"]]
    return df.sort_values("date").reset_index(drop=True)


def get_current_price(asset: str, currency: str = "usd") -> dict:
    """Return the latest price snapshot from CoinGecko simple/price endpoint."""
    import httpx

    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": asset,
        "vs_currencies": currency,
        "include_24hr_change": "true",
        "include_market_cap": "true",
        "include_24hr_vol": "true",
    }
    resp = httpx.get(url, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json().get(asset, {})
