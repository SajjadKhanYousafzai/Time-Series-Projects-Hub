import os
import glob
import pandas as pd


def load_all(dataset_dir: str):
    """Load all CSVs under `dataset_dir` into a single DataFrame.

    Expects per-asset CSV files with a `Date` column and OHLCV columns.
    Returns a long-format DataFrame with an additional `asset` column.
    """
    pattern = os.path.join(dataset_dir, "*.csv")
    files = glob.glob(pattern)
    if not files:
        raise FileNotFoundError(f"No CSV files found in {dataset_dir}")

    frames = []
    for fp in sorted(files):
        asset = os.path.splitext(os.path.basename(fp))[0]
        df = pd.read_csv(fp)
        if "Date" in df.columns:
            df = df.rename(columns={"Date": "date"})
            df["date"] = pd.to_datetime(df["date"])
        df["asset"] = asset
        frames.append(df)

    combined = pd.concat(frames, ignore_index=True)
    return combined
