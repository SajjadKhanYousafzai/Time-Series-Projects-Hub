"""
scripts/run_all.py
==================
End-to-end data pipeline for the Hospitality Workforce Forecasting Suite.
  1. Load raw CSV
  2. Clean & validate
  3. Save as Parquet
"""
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.data.load import load_hospitality
from src.data.clean import basic_clean
from src.data.store import save_series

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


def run():
    logger.info("=" * 60)
    logger.info("Hospitality Workforce Forecasting Suite - Data Pipeline")
    logger.info("=" * 60)

    # 1. Load
    logger.info("Step 1/3 - Loading raw CSV...")
    series = load_hospitality()
    logger.info("  Loaded: %d records | %s -> %s",
                len(series), series.index[0].date(), series.index[-1].date())

    # 2. Clean
    logger.info("Step 2/3 - Cleaning & validating...")
    series = basic_clean(series, detect_outliers_flag=True)
    logger.info("  Clean: %d records | range %.1f - %.1f K",
                len(series), series.min(), series.max())

    # 3. Store
    logger.info("Step 3/3 - Saving to Parquet...")
    out = save_series(series)
    logger.info("  Saved: %s", out)

    logger.info("=" * 60)
    logger.info("Pipeline complete. Ready to start API and Dashboard.")
    logger.info("=" * 60)


if __name__ == "__main__":
    run()
