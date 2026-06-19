import os
from src.data.load import load_all


def test_load_all_basic():
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    dataset_dir = os.path.join(repo_root, "Dataset")
    df = load_all(dataset_dir)
    # basic expectations
    assert not df.empty
    assert "asset" in df.columns
