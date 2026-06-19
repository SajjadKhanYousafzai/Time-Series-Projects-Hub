import pandas as pd
import numpy as np


def summary_by_asset(df: pd.DataFrame) -> pd.DataFrame:
    """Return a small summary (rows, start, end, mean vol) per asset."""
    out = (
        df.groupby("asset").agg(
            rows=("date", "count"),
            start=("date", "min"),
            end=("date", "max"),
            mean_close=("close", "mean"),
        )
        .reset_index()
    )
    return out
