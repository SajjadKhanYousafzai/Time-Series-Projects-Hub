"""Unit tests for src.data.clean module."""
import pandas as pd
import numpy as np
import pytest
from src.data.clean import basic_clean


def test_basic_clean_lowercases_columns():
    df = pd.DataFrame({"Date": ["2022-01-01"], "Close": [100.0], "Asset": ["btc"]})
    result = basic_clean(df)
    assert all(c == c.lower() for c in result.columns)


def test_basic_clean_removes_zero_close():
    df = pd.DataFrame({
        "date": pd.to_datetime(["2022-01-01", "2022-01-02"]),
        "close": [0.0, 100.0],
    })
    result = basic_clean(df)
    assert len(result) == 1
    assert result["close"].iloc[0] == 100.0


def test_basic_clean_drops_nan_close():
    df = pd.DataFrame({
        "date": pd.to_datetime(["2022-01-01", "2022-01-02"]),
        "close": [np.nan, 200.0],
    })
    result = basic_clean(df)
    assert len(result) == 1


def test_basic_clean_parses_date_strings():
    df = pd.DataFrame({"date": ["2022-01-01", "2022-01-02"], "close": [100.0, 200.0]})
    result = basic_clean(df)
    assert pd.api.types.is_datetime64_any_dtype(result["date"])
