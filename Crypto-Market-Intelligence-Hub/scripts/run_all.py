"""Production pipeline — load, clean, feature engineer, and summarise all assets.

Usage:
    python scripts/run_all.py

Writes output to data/processed/ and notebooks/experiments/.
"""
from pathlib import Path
import logging
import sys

# Ensure project root on path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.utils.logger import setup_logging
from src.data.load import load_all
from src.data.clean import basic_clean
from src.data.store import save_parquet, save_asset_parquet
from src.features.returns import add_return_features
from src.features.technical import add_technical_indicators
from src.models.evaluate import summary_by_asset

setup_logging()
logger = logging.getLogger(__name__)


def main() -> None:
    # ── Resolve data paths ────────────────────────────────────────────────────
    raw_dir = ROOT / "data" / "raw"
    if not raw_dir.exists() or not any(raw_dir.glob("*.csv")):
        # Fallback to legacy Dataset/ directory
        raw_dir = ROOT / "Dataset"
        logger.warning("data/raw/ empty; falling back to Dataset/")

    processed_dir = ROOT / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    experiments_dir = ROOT / "notebooks" / "experiments"
    experiments_dir.mkdir(parents=True, exist_ok=True)

    # ── Load & Clean ──────────────────────────────────────────────────────────
    logger.info("Loading data from %s", raw_dir)
    df = load_all(str(raw_dir))
    logger.info("Loaded %d rows from %d assets", len(df), df["asset"].nunique())

    df = basic_clean(df)
    logger.info("After cleaning: %d rows", len(df))

    # ── Feature Engineering ───────────────────────────────────────────────────
    df = add_return_features(df, windows=[7, 14, 30, 90])
    df = add_technical_indicators(df)
    logger.info("Features added. Final shape: %s", df.shape)

    # ── Persist ───────────────────────────────────────────────────────────────
    save_parquet(df, processed_dir / "all_assets.parquet")
    save_asset_parquet(df, processed_dir)

    # ── Summary ───────────────────────────────────────────────────────────────
    summary = summary_by_asset(df)
    summary_csv = experiments_dir / "summary_by_asset.csv"
    summary.to_csv(summary_csv, index=False)
    logger.info("Summary written → %s", summary_csv)

    logger.info("Pipeline complete ✅")
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
