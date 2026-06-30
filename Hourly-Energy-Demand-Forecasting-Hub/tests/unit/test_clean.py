"""
tests/unit/test_clean.py
========================
Unit tests for src.data.clean module.
"""
import numpy as np
import pandas as pd
import pytest

from src.data.clean import (
    basic_clean,
    detect_outliers,
    ensure_hourly_frequency,
    remove_duplicates,
    validate_dataframe,
)


@pytest.fixture
def clean_df():
    idx = pd.date_range("2022-01-01", periods=100, freq="h")
    return pd.DataFrame({"MW": np.random.default_rng(1).uniform(8000, 15000, 100)}, index=idx)


def test_validate_dataframe_passes_clean_data(clean_df):
    result = validate_dataframe(clean_df)
    assert result["MW"].isna().sum() == 0


def test_validate_dataframe_fills_nan(clean_df):
    clean_df.iloc[10, 0] = np.nan
    result = validate_dataframe(clean_df)
    assert result["MW"].isna().sum() == 0


def test_remove_duplicates_deduplicates():
    idx    = pd.date_range("2022-01-01", periods=5, freq="h")
    dup_idx = idx.append(idx[:2])  # add 2 duplicate timestamps
    df     = pd.DataFrame({"MW": np.ones(7)}, index=dup_idx)
    result = remove_duplicates(df)
    assert len(result) == 5
    assert not result.index.duplicated().any()


def test_ensure_hourly_frequency_fills_gap(clean_df):
    gapped = clean_df.drop(clean_df.index[5])  # remove 1 hour
    result = ensure_hourly_frequency(gapped)
    assert len(result) == len(clean_df)


def test_detect_outliers_removes_spikes(clean_df):
    clean_df.iloc[20, 0] = 1_000_000  # extreme spike
    result = detect_outliers(clean_df, z_threshold=4.0)
    assert result["MW"].iloc[20] < 1_000_000


def test_basic_clean_full_pipeline(clean_df):
    result = basic_clean(clean_df, region="TEST")
    assert isinstance(result, pd.DataFrame)
    assert "MW" in result.columns
    assert result["MW"].isna().sum() == 0
    assert isinstance(result.index, pd.DatetimeIndex)
