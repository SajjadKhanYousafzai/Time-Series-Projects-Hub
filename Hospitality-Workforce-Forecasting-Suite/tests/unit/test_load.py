"""tests/unit/test_load.py"""
import pytest
import pandas as pd
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from src.data.load import load_hospitality


def test_load_returns_series():
    s = load_hospitality()
    assert isinstance(s, pd.Series)


def test_load_correct_length():
    s = load_hospitality()
    assert len(s) == 348


def test_load_date_range():
    s = load_hospitality()
    assert s.index[0].year == 1990
    assert s.index[-1].year == 2018


def test_load_positive_values():
    s = load_hospitality()
    assert (s > 0).all()


def test_load_monthly_frequency():
    s = load_hospitality()
    assert s.index.freq is not None or str(s.index.freq) == "MS"
