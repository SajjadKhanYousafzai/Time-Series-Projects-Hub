"""Data persistence — save/load processed DataFrames as Parquet."""
from __future__ import annotations

import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)


def save_parquet(df: pd.DataFrame, path: Path | str, *, overwrite: bool = True) -> Path:
    """Persist *df* to a Parquet file at *path*.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame to serialise.
    path : Path | str
        Destination file path (will be created including parents).
    overwrite : bool
        If False and the file already exists, skip writing.

    Returns
    -------
    Path
        Resolved path of the saved file.
    """
    dest = Path(path)
    if dest.exists() and not overwrite:
        logger.debug("Parquet already exists, skipping: %s", dest)
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(dest, index=False, engine="pyarrow")
    logger.info("Saved %d rows → %s", len(df), dest)
    return dest


def load_parquet(path: Path | str) -> pd.DataFrame:
    """Load a Parquet file into a DataFrame.

    Parameters
    ----------
    path : Path | str
        Path to the Parquet file.

    Returns
    -------
    pd.DataFrame
        Loaded DataFrame.

    Raises
    ------
    FileNotFoundError
        If the file does not exist.
    """
    src = Path(path)
    if not src.exists():
        raise FileNotFoundError(f"Parquet file not found: {src}")
    df = pd.read_parquet(src, engine="pyarrow")
    logger.info("Loaded %d rows ← %s", len(df), src)
    return df


def save_asset_parquet(df: pd.DataFrame, processed_dir: Path | str) -> dict[str, Path]:
    """Split *df* by asset and save one Parquet file per asset.

    Parameters
    ----------
    df : pd.DataFrame
        Combined long-format DataFrame with an ``asset`` column.
    processed_dir : Path | str
        Directory under which per-asset files will be written.

    Returns
    -------
    dict[str, Path]
        Mapping of asset name → saved file path.
    """
    base = Path(processed_dir)
    saved: dict[str, Path] = {}
    for asset, group in df.groupby("asset"):
        dest = base / f"{asset}.parquet"
        save_parquet(group.reset_index(drop=True), dest)
        saved[str(asset)] = dest
    logger.info("Saved %d asset Parquet files to %s", len(saved), base)
    return saved


def load_asset_parquet(asset: str, processed_dir: Path | str) -> pd.DataFrame:
    """Load a single asset's Parquet file."""
    path = Path(processed_dir) / f"{asset}.parquet"
    return load_parquet(path)
