"""Historical OHLCV data router."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.api.schemas import HistoricalResponse, OHLCVRecord, AssetSummary
from src.api.dependencies import get_data_path
from src.data.load import load_all
from src.data.clean import basic_clean

logger = logging.getLogger(__name__)
router = APIRouter()


def _load_asset(data_path: Path, asset: str):
    """Load and clean data for a single asset from raw CSVs."""
    asset_file = data_path / f"{asset}.csv"
    if not asset_file.exists():
        raise HTTPException(status_code=404, detail=f"Asset '{asset}' not found in data directory.")
    import pandas as pd
    df = pd.read_csv(asset_file)
    if "Date" in df.columns:
        df = df.rename(columns={"Date": "date"})
        import pandas as pd
        df["date"] = pd.to_datetime(df["date"])
    df.columns = [c.lower() for c in df.columns]
    df["asset"] = asset
    return basic_clean(df)


@router.get(
    "/history/{asset}",
    response_model=HistoricalResponse,
    summary="Get historical OHLCV data for an asset",
)
async def get_history(
    asset: str,
    start: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(500, ge=1, le=5000, description="Max rows to return"),
    data_path: Path = Depends(get_data_path),
) -> HistoricalResponse:
    """Return historical OHLCV records for *asset*.

    Filters by date range and limits the number of rows returned.
    """
    logger.info("GET /history/%s  start=%s end=%s limit=%d", asset, start, end, limit)
    df = _load_asset(data_path, asset.lower())

    if start:
        import pandas as pd
        df = df[df["date"] >= pd.to_datetime(start)]
    if end:
        import pandas as pd
        df = df[df["date"] <= pd.to_datetime(end)]

    df = df.sort_values("date").tail(limit)

    records = [
        OHLCVRecord(
            date=row["date"],
            open=float(row.get("open", 0)),
            high=float(row.get("high", 0)),
            low=float(row.get("low", 0)),
            close=float(row["close"]),
            volume=float(row["volume"]) if "volume" in row and row["volume"] == row["volume"] else None,
            asset=asset,
        )
        for _, row in df.iterrows()
    ]

    return HistoricalResponse(
        asset=asset,
        records=records,
        total=len(records),
        start_date=records[0].date if records else None,
        end_date=records[-1].date if records else None,
    )


@router.get("/assets", summary="List all available assets")
async def list_assets(data_path: Path = Depends(get_data_path)) -> dict:
    """Return a list of all available asset names."""
    if not data_path.exists():
        return {"assets": [], "count": 0}
    assets = sorted(p.stem for p in data_path.glob("*.csv"))
    return {"assets": assets, "count": len(assets)}
