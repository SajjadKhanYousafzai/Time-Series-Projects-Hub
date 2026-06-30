"""
tests/integration/test_pipeline.py
====================================
Integration test: load → clean → store → load back.
Runs against real data/raw/ if available, otherwise skips.
"""
import os
import pytest
import pandas as pd
from pathlib import Path

ROOT = Path(__file__).parents[2]
RAW_DIR = ROOT / "data" / "raw"

pytestmark = pytest.mark.skipif(
    not (RAW_DIR / "AEP_hourly.csv").exists(),
    reason="data/raw/AEP_hourly.csv not found — run scripts/run_pipeline.py first",
)


def test_full_pipeline_aep(tmp_path):
    from src.data.load import load_region
    from src.data.clean import basic_clean
    from src.data.store import save_parquet, load_parquet

    # Load
    df = load_region("AEP")
    assert len(df) > 0
    assert "MW" in df.columns

    # Clean
    df_clean = basic_clean(df, region="AEP")
    assert df_clean["MW"].isna().sum() == 0
    assert isinstance(df_clean.index, pd.DatetimeIndex)

    # Store + reload
    path = save_parquet(df_clean, "AEP", processed_dir=tmp_path)
    assert path.exists()

    df_reloaded = load_parquet("AEP", processed_dir=tmp_path)
    assert len(df_reloaded) == len(df_clean)
    assert df_reloaded["MW"].iloc[0] == pytest.approx(df_clean["MW"].iloc[0], rel=1e-6)
