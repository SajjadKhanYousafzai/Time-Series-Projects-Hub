"""Root-level conftest — makes fixtures/ conftest available to all tests."""
import sys
from pathlib import Path

# Ensure project root is on Python path for all tests
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

# Re-export fixtures from fixtures/conftest.py
from tests.fixtures.conftest import sample_ohlcv_df, single_asset_df  # noqa: F401, E402
