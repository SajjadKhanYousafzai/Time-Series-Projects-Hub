"""
src/visualization/charts.py
=============================
Plotly/matplotlib chart helpers for energy demand analysis.
All charts use a consistent dark amber theme.
"""
from __future__ import annotations

from typing import Optional

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# ── Colour Palette ─────────────────────────────────────────────────────────────
PALETTE = {
    "bg":          "#0F1117",
    "surface":     "#1A1D27",
    "amber":       "#F59E0B",
    "amber_light": "#FCD34D",
    "teal":        "#14B8A6",
    "rose":        "#FB7185",
    "violet":      "#A78BFA",
    "sky":         "#38BDF8",
    "text":        "#F1F5F9",
    "muted":       "#94A3B8",
    "border":      "#2D3147",
    "green":       "#4ADE80",
    "red":         "#F87171",
}

_LAYOUT_BASE = dict(
    paper_bgcolor=PALETTE["bg"],
    plot_bgcolor=PALETTE["surface"],
    font=dict(color=PALETTE["text"], family="Inter, sans-serif"),
    xaxis=dict(gridcolor=PALETTE["border"], showgrid=True),
    yaxis=dict(gridcolor=PALETTE["border"], showgrid=True),
    legend=dict(bgcolor=PALETTE["surface"], bordercolor=PALETTE["border"], borderwidth=1),
    margin=dict(l=60, r=30, t=60, b=50),
)


def _base_layout(**kwargs) -> dict:
    return {**_LAYOUT_BASE, **kwargs}


def plot_time_series(
    series: pd.Series,
    region: str = "",
    title: str = "",
    rolling_window: int = 24 * 7,
) -> go.Figure:
    """Full time series with rolling average overlay."""
    rolling = series.rolling(rolling_window, min_periods=1).mean()
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=series.index, y=series.values,
        name="Hourly MW", mode="lines",
        line=dict(color=PALETTE["amber"], width=1), opacity=0.6,
    ))
    fig.add_trace(go.Scatter(
        x=rolling.index, y=rolling.values,
        name=f"{rolling_window}h Rolling Mean", mode="lines",
        line=dict(color=PALETTE["teal"], width=2.5),
    ))
    fig.update_layout(
        **_base_layout(title=title or f"{region} — Hourly Energy Demand"),
        xaxis_title="Date",
        yaxis_title="Energy Demand (MW)",
    )
    return fig


def plot_forecast(
    train: pd.Series,
    test: pd.Series,
    forecast: pd.Series,
    ci_lower: Optional[pd.Series] = None,
    ci_upper: Optional[pd.Series] = None,
    model_name: str = "Forecast",
    region: str = "",
) -> go.Figure:
    """Actual vs. predicted + future forecast with CI band."""
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=train.index[-24*30:], y=train.values[-24*30:],
        name="Train (last 30d)", mode="lines",
        line=dict(color=PALETTE["amber"], width=1.5), opacity=0.6,
    ))
    fig.add_trace(go.Scatter(
        x=test.index, y=test.values,
        name="Actual (Test)", mode="lines",
        line=dict(color=PALETTE["amber"], width=2.5),
    ))
    fig.add_trace(go.Scatter(
        x=forecast.index, y=forecast.values,
        name=f"{model_name} Forecast", mode="lines",
        line=dict(color=PALETTE["teal"], width=2, dash="dash"),
    ))
    if ci_lower is not None and ci_upper is not None:
        fig.add_trace(go.Scatter(
            x=pd.concat([ci_upper, ci_lower[::-1]]).index,
            y=pd.concat([ci_upper, ci_lower[::-1]]).values,
            fill="toself", fillcolor=f"rgba(20,184,166,0.12)",
            line=dict(color="rgba(0,0,0,0)"),
            name="95% CI",
        ))
    fig.update_layout(
        **_base_layout(title=f"{region} — {model_name} vs Actual"),
        xaxis_title="Date", yaxis_title="Energy Demand (MW)",
    )
    return fig


def plot_hourly_profile(df: pd.DataFrame, region: str = "") -> go.Figure:
    """Average demand by hour-of-day — weekday vs. weekend."""
    df = df.copy()
    df["hour"]       = df.index.hour
    df["is_weekend"] = (df.index.dayofweek >= 5).astype(int)

    wd = df[df["is_weekend"] == 0].groupby("hour")["MW"].mean()
    we = df[df["is_weekend"] == 1].groupby("hour")["MW"].mean()

    fig = go.Figure()
    fig.add_trace(go.Bar(x=wd.index, y=wd.values, name="Weekday",
                         marker_color=PALETTE["amber"]))
    fig.add_trace(go.Bar(x=we.index, y=we.values, name="Weekend",
                         marker_color=PALETTE["sky"]))
    fig.update_layout(
        **_base_layout(title=f"{region} — Average Hourly Profile: Weekday vs Weekend"),
        xaxis_title="Hour of Day", yaxis_title="Mean MW",
        barmode="group",
    )
    return fig


def plot_seasonal_heatmap(df: pd.DataFrame, region: str = "") -> go.Figure:
    """Hour-of-day × Month heatmap of mean energy demand."""
    df = df.copy()
    df["hour"]  = df.index.hour
    df["month"] = df.index.month
    pivot = df.groupby(["month", "hour"])["MW"].mean().unstack()

    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    fig = go.Figure(go.Heatmap(
        z=pivot.values,
        x=list(range(24)),
        y=[months[m-1] for m in pivot.index],
        colorscale="YlOrBr",
        colorbar=dict(title="Mean MW"),
    ))
    fig.update_layout(
        **_base_layout(title=f"{region} — Seasonal Heatmap: Hour × Month"),
        xaxis_title="Hour of Day", yaxis_title="Month",
    )
    return fig


def plot_decomposition(
    observed: pd.Series,
    trend: pd.Series,
    seasonal: pd.Series,
    residual: pd.Series,
    region: str = "",
) -> go.Figure:
    """4-panel classical decomposition chart."""
    fig = make_subplots(rows=4, cols=1, shared_xaxes=True,
                        subplot_titles=["Observed", "Trend", "Seasonal", "Residual"])
    colors = [PALETTE["amber"], PALETTE["teal"], PALETTE["violet"], PALETTE["rose"]]
    for i, (data, color) in enumerate(zip(
        [observed, trend, seasonal, residual], colors
    ), start=1):
        fig.add_trace(go.Scatter(
            x=data.index, y=data.values, mode="lines",
            line=dict(color=color, width=1.5), showlegend=False,
        ), row=i, col=1)
    fig.update_layout(
        **_base_layout(title=f"{region} — Classical Decomposition"),
        height=800,
    )
    return fig


def plot_model_comparison(metrics: list[dict]) -> go.Figure:
    """Grouped bar chart comparing MAE / RMSE / MAPE across models."""
    models = [m["model"] for m in metrics]
    fig = make_subplots(rows=1, cols=3,
                        subplot_titles=["MAE", "RMSE", "MAPE (%)"])
    palette = [PALETTE["teal"], PALETTE["violet"], PALETTE["sky"],
               PALETTE["amber"], PALETTE["rose"]]

    for col, metric in enumerate(["mae", "rmse", "mape"], start=1):
        for i, m in enumerate(metrics):
            fig.add_trace(go.Bar(
                name=m["model"], x=[m["model"]], y=[m[metric]],
                marker_color=palette[i % len(palette)],
                showlegend=(col == 1),
            ), row=1, col=col)

    fig.update_layout(**_base_layout(title="Model Comparison"), barmode="group")
    return fig
