"""Shared helper utilities: formatters, date utilities."""
from __future__ import annotations

from datetime import date, datetime
from typing import Union


def format_price(value: float, decimals: int = 2, currency: str = "USD") -> str:
    """Format a price value with currency symbol.

    Examples
    --------
    >>> format_price(42350.75)
    '$42,350.75'
    >>> format_price(0.00045, decimals=6)
    '$0.000450'
    """
    if value >= 1:
        return f"${value:,.{decimals}f}"
    # For very small prices use more decimal places
    return f"${value:.{max(decimals, 6)}f}"


def format_pct(value: float, decimals: int = 2, signed: bool = True) -> str:
    """Format a decimal fraction as a percentage string.

    Examples
    --------
    >>> format_pct(0.1523)
    '+15.23%'
    >>> format_pct(-0.05)
    '-5.00%'
    """
    pct = value * 100
    sign = "+" if signed and pct >= 0 else ""
    return f"{sign}{pct:.{decimals}f}%"


def date_range_str(start: Union[date, datetime, str], end: Union[date, datetime, str]) -> str:
    """Return a human-readable date range string.

    Examples
    --------
    >>> date_range_str("2020-01-01", "2026-01-01")
    'Jan 2020 → Jan 2026'
    """
    def _parse(d):
        if isinstance(d, (date, datetime)):
            return d
        return datetime.fromisoformat(str(d))

    s, e = _parse(start), _parse(end)
    return f"{s.strftime('%b %Y')} → {e.strftime('%b %Y')}"


def slugify(text: str) -> str:
    """Convert text to lowercase slug (for file names / URLs)."""
    return text.lower().replace(" ", "_").replace("-", "_")


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Return numerator/denominator or *default* if denominator is zero."""
    if abs(denominator) < 1e-10:
        return default
    return numerator / denominator
