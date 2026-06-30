"""
src/api/routers/history.py
==========================
Historical data retrieval endpoint.
"""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..schemas import HistoryPoint, HistoryResponse
from src.data.store import load_parquet

router = APIRouter()


@router.get(
    "/history",
    response_model=HistoryResponse,
    summary="Retrieve Historical Energy Demand",
)
async def get_history(
    region: str = Query("AEP", description="PJM region key"),
    start:  Optional[datetime] = Query(None, description="Start datetime filter"),
    end:    Optional[datetime] = Query(None, description="End datetime filter"),
    limit:  int = Query(1000, ge=1, le=50000, description="Max records to return"),
) -> HistoryResponse:
    """
    Return historical hourly energy demand for a given PJM region.

    The response is filtered by optional start/end datetime bounds
    and capped at `limit` records (newest first by default).
    """
    try:
        df = load_parquet(region.upper())
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    if start:
        df = df[df.index >= start]
    if end:
        df = df[df.index <= end]

    df = df.tail(limit)

    return HistoryResponse(
        region=region.upper(),
        n_records=len(df),
        start=df.index[0],
        end=df.index[-1],
        data=[
            HistoryPoint(datetime=idx, MW=float(row["MW"]))
            for idx, row in df.iterrows()
        ],
    )


@router.get(
    "/regions",
    summary="List Available Regions",
)
async def list_available_regions() -> dict:
    """Return all supported PJM region keys and their descriptions."""
    from src.data.load import REGION_FILES
    return {
        "regions": [
            {"key": k, "file": v} for k, v in sorted(REGION_FILES.items())
        ]
    }
