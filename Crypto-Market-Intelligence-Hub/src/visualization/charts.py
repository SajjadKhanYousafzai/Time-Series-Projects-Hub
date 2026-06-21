"""Plotly chart builders for crypto market visualisation."""
from __future__ import annotations

from typing import Optional

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots


DARK_TEMPLATE = "plotly_dark"
PRIMARY_COLOR = "#00d4ff"
SUCCESS_COLOR = "#00ff88"
DANGER_COLOR = "#ff4466"
ACCENT_COLOR = "#7c3aed"


def candlestick_chart(
    df: pd.DataFrame,
    asset: str,
    title: str | None = None,
    show_volume: bool = True,
) -> go.Figure:
    """Interactive OHLCV candlestick chart with optional volume bar.

    Parameters
    ----------
    df : pd.DataFrame
        Must have columns: date, open, high, low, close, (volume).
    asset : str
        Asset name for the title.
    show_volume : bool
        Whether to render a volume sub-plot.
    """
    rows = 2 if show_volume and "volume" in df.columns else 1
    row_heights = [0.7, 0.3] if rows == 2 else [1.0]

    fig = make_subplots(
        rows=rows, cols=1, shared_xaxes=True,
        vertical_spacing=0.03, row_heights=row_heights,
    )

    fig.add_trace(
        go.Candlestick(
            x=df["date"],
            open=df["open"], high=df["high"],
            low=df["low"], close=df["close"],
            increasing_line_color=SUCCESS_COLOR,
            decreasing_line_color=DANGER_COLOR,
            name=asset.title(),
        ),
        row=1, col=1,
    )

    if rows == 2:
        colors = [
            SUCCESS_COLOR if c >= o else DANGER_COLOR
            for c, o in zip(df["close"], df["open"])
        ]
        fig.add_trace(
            go.Bar(x=df["date"], y=df["volume"], marker_color=colors, name="Volume", opacity=0.6),
            row=2, col=1,
        )

    fig.update_layout(
        title=title or f"{asset.title()} — OHLCV",
        template=DARK_TEMPLATE,
        xaxis_rangeslider_visible=False,
        height=600,
        showlegend=False,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
    )
    return fig


def price_forecast_chart(
    historical: pd.DataFrame,
    forecast: pd.DataFrame,
    asset: str,
    ci_lower: Optional[pd.Series] = None,
    ci_upper: Optional[pd.Series] = None,
) -> go.Figure:
    """Line chart showing historical price + forecast with optional CI band."""
    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=historical["date"], y=historical["close"],
        name="Historical", line=dict(color=PRIMARY_COLOR, width=1.5),
    ))

    fig.add_trace(go.Scatter(
        x=forecast["date"] if "date" in forecast.columns else forecast.index,
        y=forecast["yhat"] if "yhat" in forecast.columns else forecast.values,
        name="Forecast", line=dict(color=ACCENT_COLOR, width=2, dash="dash"),
    ))

    if ci_lower is not None and ci_upper is not None:
        x_ci = list(forecast["date"]) + list(forecast["date"])[::-1]
        y_ci = list(ci_upper) + list(ci_lower)[::-1]
        fig.add_trace(go.Scatter(
            x=x_ci, y=y_ci, fill="toself",
            fillcolor="rgba(124,58,237,0.15)",
            line=dict(color="rgba(255,255,255,0)"),
            name="80% CI",
        ))

    fig.update_layout(
        title=f"{asset.title()} — Price Forecast",
        template=DARK_TEMPLATE, height=500,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        xaxis_title="Date", yaxis_title="Price (USD)",
    )
    return fig


def correlation_heatmap(df_pivot: pd.DataFrame) -> go.Figure:
    """Hierarchically-clustered correlation heatmap."""
    import numpy as np
    from scipy.cluster.hierarchy import dendrogram, linkage
    from scipy.spatial.distance import squareform

    corr = df_pivot.corr()
    dist = 1 - corr.abs()
    np.fill_diagonal(dist.values, 0)
    linkage_matrix = linkage(squareform(dist.values), method="ward")
    dendro = dendrogram(linkage_matrix, no_plot=True)
    order = dendro["leaves"]
    corr_sorted = corr.iloc[order, order]

    fig = go.Figure(go.Heatmap(
        z=corr_sorted.values,
        x=corr_sorted.columns,
        y=corr_sorted.index,
        colorscale="RdBu_r",
        zmid=0, zmin=-1, zmax=1,
        text=corr_sorted.round(2).values,
        texttemplate="%{text}",
        colorbar=dict(title="Corr"),
    ))
    fig.update_layout(
        title="Asset Correlation Matrix (Hierarchical Clustering)",
        template=DARK_TEMPLATE, height=700,
        paper_bgcolor="rgba(0,0,0,0)",
    )
    return fig


def rolling_volatility_chart(df: pd.DataFrame, window: int = 30) -> go.Figure:
    """Multi-asset rolling volatility line chart."""
    fig = go.Figure()
    vol_col = f"rolling_vol_{window}"
    for asset, grp in df.groupby("asset"):
        if vol_col not in grp.columns:
            continue
        fig.add_trace(go.Scatter(
            x=grp["date"], y=grp[vol_col], name=str(asset),
            mode="lines", line=dict(width=1),
        ))
    fig.update_layout(
        title=f"Rolling {window}-day Volatility (Log Return Std)",
        template=DARK_TEMPLATE, height=450,
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis_title="Date", yaxis_title="Volatility",
    )
    return fig


def model_comparison_bar(metrics_df: pd.DataFrame) -> go.Figure:
    """Grouped bar chart comparing model metrics (MAE, RMSE, MAPE)."""
    metrics = ["mae", "rmse", "mape"]
    fig = make_subplots(rows=1, cols=3, subplot_titles=[m.upper() for m in metrics])
    colors = [PRIMARY_COLOR, SUCCESS_COLOR, DANGER_COLOR, ACCENT_COLOR]

    for i, metric in enumerate(metrics):
        for j, (model_name, grp) in enumerate(metrics_df.groupby("model")):
            fig.add_trace(
                go.Bar(
                    x=grp["asset"], y=grp[metric],
                    name=str(model_name),
                    marker_color=colors[j % len(colors)],
                    showlegend=(i == 0),
                ),
                row=1, col=i + 1,
            )

    fig.update_layout(
        title="Model Performance Comparison",
        template=DARK_TEMPLATE, height=400,
        paper_bgcolor="rgba(0,0,0,0)",
        barmode="group",
    )
    return fig
