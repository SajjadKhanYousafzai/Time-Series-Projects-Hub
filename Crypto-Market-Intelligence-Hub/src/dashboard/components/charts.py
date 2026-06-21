"""Reusable Streamlit chart components."""
import streamlit as st
import plotly.graph_objects as go
import pandas as pd


def price_line_chart(df: pd.DataFrame, asset: str, color: str = "#00d4ff") -> None:
    """Render a simple close price line chart."""
    fig = go.Figure(go.Scatter(
        x=df["date"], y=df["close"],
        fill="tozeroy",
        fillcolor="rgba(0,212,255,0.05)",
        line=dict(color=color, width=1.5),
        name=asset.title(),
    ))
    fig.update_layout(
        template="plotly_dark", height=350,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        xaxis_title="Date", yaxis_title="Price (USD)",
        title=f"{asset.title()} Close Price",
    )
    st.plotly_chart(fig, use_container_width=True)


def returns_distribution_chart(df: pd.DataFrame, asset: str) -> None:
    """Histogram of daily log returns."""
    if "log_return" not in df.columns:
        return
    returns = df["log_return"].dropna()
    fig = go.Figure(go.Histogram(
        x=returns, nbinsx=100,
        marker_color="#7c3aed", opacity=0.8,
        name="Log Returns",
    ))
    fig.update_layout(
        template="plotly_dark", height=300,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        title=f"{asset.title()} — Daily Log Return Distribution",
        xaxis_title="Log Return", yaxis_title="Count",
    )
    st.plotly_chart(fig, use_container_width=True)
