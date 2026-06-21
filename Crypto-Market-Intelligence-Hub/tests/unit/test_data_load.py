import os
from pathlib import Path
from src.data.load import load_all


def test_load_all_basic():
    repo_root = Path(__file__).resolve().parents[2]
    # Prefer new data/raw/ location; fall back to legacy Dataset/
    data_dir = repo_root / "data" / "raw"
    if not data_dir.exists() or not any(data_dir.glob("*.csv")):
        data_dir = repo_root / "Dataset"
    df = load_all(str(data_dir))
    # basic expectations
    assert not df.empty
    assert "asset" in df.columns
    assert "date" in df.columns
    assert df["asset"].nunique() >= 1
