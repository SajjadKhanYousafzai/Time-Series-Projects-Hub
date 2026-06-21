"""Reusable Streamlit metrics components."""
import streamlit as st
import pandas as pd


def render_asset_metrics(summary_row: pd.Series) -> None:
    """Render a 4-column metric row for a single asset."""
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Records", f"{int(summary_row.get('rows', 0)):,}")
    c2.metric("Mean Close", f"${summary_row.get('mean_close', 0):,.2f}")
    c3.metric("ATH", f"${summary_row.get('max_close', 0):,.2f}")
    if "sharpe_ratio" in summary_row:
        c4.metric("Sharpe Ratio", f"{summary_row['sharpe_ratio']:.3f}")
    else:
        c4.metric("Min Close", f"${summary_row.get('min_close', 0):,.4f}")


def render_model_metrics(metrics: dict) -> None:
    """Render a metrics card for model evaluation results."""
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("MAE", f"{metrics.get('mae', 0):.4f}")
    c2.metric("RMSE", f"{metrics.get('rmse', 0):.4f}")
    c3.metric("MAPE", f"{metrics.get('mape', 0):.2f}%")
    c4.metric("R²", f"{metrics.get('r2', 0):.4f}")
