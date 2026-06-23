"""src/api/routers/historical.py — Historical employment data endpoints."""
from fastapi import APIRouter, HTTPException
from ..schemas import HistoricalResponse, EmploymentPoint, DecompositionResponse, DecompositionPoint, StationarityResponse
from src.data.store import load_processed
from src.features.decomposition import classical_decompose
from src.features.stationarity import adf_test, kpss_test

router = APIRouter()


def _get_series():
    try:
        return load_processed()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/history", response_model=HistoricalResponse)
async def get_history(start: str = None, end: str = None):
    """Return full employment history, optionally filtered by date range."""
    series = _get_series()
    if start:
        series = series[series.index >= start]
    if end:
        series = series[series.index <= end]
    points = [EmploymentPoint(date=d.date(), employees=v) for d, v in series.items()]
    return HistoricalResponse(
        series=points,
        total_records=len(series),
        start_date=series.index.min().date(),
        end_date=series.index.max().date(),
        min_employees=round(series.min(), 2),
        max_employees=round(series.max(), 2),
        mean_employees=round(series.mean(), 2),
    )


@router.get("/decompose", response_model=DecompositionResponse)
async def get_decomposition(model: str = "additive"):
    """Return seasonal decomposition components."""
    series = _get_series()
    dec = classical_decompose(series, model=model)
    points = []
    for dt in series.index:
        points.append(DecompositionPoint(
            date=dt.date(),
            observed=round(float(dec["observed"][dt]), 3),
            trend=round(float(dec["trend"][dt]), 3) if dt in dec["trend"].dropna().index else None,
            seasonal=round(float(dec["seasonal"][dt]), 3),
            residual=round(float(dec["residual"][dt]), 3) if dt in dec["residual"].dropna().index else None,
        ))
    return DecompositionResponse(model=model, period=12, components=points)


@router.get("/stationarity", response_model=StationarityResponse)
async def get_stationarity():
    """Return ADF and KPSS test results on the raw employment series."""
    series = _get_series()
    adf = adf_test(series)
    kpss = kpss_test(series)
    interp = (
        "Raw employment levels are NON-STATIONARY. "
        "First-difference log returns are stationary and should be used for modelling."
    )
    return StationarityResponse(
        adf_statistic=round(adf.statistic, 4),
        adf_p_value=round(adf.p_value, 4),
        adf_is_stationary=adf.is_stationary,
        kpss_statistic=round(kpss.statistic, 4),
        kpss_p_value=round(kpss.p_value, 4),
        kpss_is_stationary=kpss.is_stationary,
        interpretation=interp,
    )
