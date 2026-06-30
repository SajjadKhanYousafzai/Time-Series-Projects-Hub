"""
tests/unit/test_load.py
=======================
Unit tests for src.data.load module.
"""
from pathlib import Path

import pandas as pd
import pytest

from src.data.load import list_regions, load_region, REGION_FILES


def test_list_regions_returns_list():
    regions = list_regions()
    assert isinstance(regions, list)
    assert len(regions) > 0


def test_region_files_mapping_complete():
    """All expected regions should be in the mapping."""
    expected = {"AEP", "COMED", "DAYTON", "PJME", "PJMW"}
    assert expected.issubset(set(REGION_FILES.keys()))


def test_load_region_invalid_raises():
    with pytest.raises(ValueError, match="Unknown region"):
        load_region("INVALID_REGION")


def test_load_region_missing_file_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        load_region("AEP", raw_dir=tmp_path)


def test_load_region_from_synthetic(tmp_path):
    """Test loading with a synthetic CSV in the expected alternating format."""
    # Create a minimal 2-column CSV
    csv_content = "Datetime,AEP_MW\n2020-01-01 00:00:00,12000.0\n2020-01-01 01:00:00,11500.0\n"
    csv_path = tmp_path / "AEP_hourly.csv"
    csv_path.write_text(csv_content)

    df = load_region("AEP", raw_dir=tmp_path)

    assert isinstance(df, pd.DataFrame)
    assert "MW" in df.columns
    assert isinstance(df.index, pd.DatetimeIndex)
    assert len(df) == 2
