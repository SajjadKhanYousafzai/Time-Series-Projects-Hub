"""Minimal runnable pipeline for Crypto-Market-Intelligence-Hub.

Usage:
    python scripts/run_all.py

This script performs a light-weight reproducible run: loads CSVs,
performs basic cleaning and feature engineering, and writes a small
summary CSV to `experiments/summary_by_asset.csv`.
"""
from pathlib import Path
from src.data.load import load_all
from src.data.clean import basic_clean
from src.features import add_basic_features
from src.evaluate import summary_by_asset


def main():
    root = Path(__file__).resolve().parents[1]
    dataset_dir = root / "Dataset"
    out_dir = root / "experiments"
    out_dir.mkdir(exist_ok=True)

    print(f"Loading data from {dataset_dir}")
    df = load_all(str(dataset_dir))
    print(f"Loaded {len(df):,} rows from {df['asset'].nunique()} assets")

    df = basic_clean(df)
    df = add_basic_features(df)

    summary = summary_by_asset(df)
    out_csv = out_dir / "summary_by_asset.csv"
    summary.to_csv(out_csv, index=False)
    print(f"Wrote summary to {out_csv}")


if __name__ == "__main__":
    main()
