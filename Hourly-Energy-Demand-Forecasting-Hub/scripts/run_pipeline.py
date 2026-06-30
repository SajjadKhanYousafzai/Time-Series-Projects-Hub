"""
scripts/run_pipeline.py
=======================
Full data pipeline: load → clean → store parquet for all PJM regions.

Usage
-----
    python scripts/run_pipeline.py               # process all regions
    python scripts/run_pipeline.py --region AEP  # single region
    python scripts/run_pipeline.py --region AEP PJME  # multiple regions
"""
from __future__ import annotations

import argparse
import logging
import sys
import time
from pathlib import Path

# Allow running from project root
sys.path.insert(0, str(Path(__file__).parents[1]))

from src.data.load import load_region, list_regions
from src.data.clean import basic_clean
from src.data.store import save_parquet

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


def process_region(region: str) -> bool:
    """Load, clean, and store a single region. Returns True on success."""
    t0 = time.perf_counter()
    log.info("Processing %s…", region)
    try:
        df = load_region(region)
        df = basic_clean(df, region=region)
        path = save_parquet(df, region)
        elapsed = time.perf_counter() - t0
        log.info(
            "✅  %s — %d records  (%.1f s)  → %s",
            region, len(df), elapsed, path.name,
        )
        return True
    except Exception as e:
        log.error("❌  %s failed: %s", region, e)
        return False


def main():
    parser = argparse.ArgumentParser(
        description="PJM Energy Demand — Data Pipeline"
    )
    parser.add_argument(
        "--region", nargs="*", default=None,
        help="Region(s) to process. Default: all available.",
    )
    args = parser.parse_args()

    regions = [r.upper() for r in args.region] if args.region else list_regions()

    log.info("=== Energy Demand Pipeline ===")
    log.info("Regions to process: %s", regions)

    results = {r: process_region(r) for r in regions}

    success = sum(results.values())
    failed  = len(results) - success

    log.info("=" * 50)
    log.info("Pipeline complete — %d/%d regions processed.", success, len(results))
    if failed:
        log.error("Failed regions: %s", [r for r, ok in results.items() if not ok])

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
