"""Page 1 — Market Overview."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

import streamlit as st
import pandas as pd

from src.data.load import load_all
from src.data.clean import basic_clean
from src.features.returns import add_return_features
from src.models.evaluate import summary_by_asset
from src.visualization.charts import (
    rolling_volatility_chart,
    correlation_heatmap,
)
from src.dashboard.components.metrics import render_asset_metrics

st.set_page_config(page_title="Market Overview | Crypto Hub", page_icon="📊", layout="wide")

st.title("📊 Market Overview")
st.markdown("High-level view of the crypto market — coverage, price tiers, and cross-asset correlations.")

# ── Data Loading ───────────────────────────────────────────────────────────────
@st.cache_data(ttl=3600, show_spinner="Loading market data…")
def load_data():
    data_path = ROOT / "data" / "raw"
    if not data_path.exists() or not any(data_path.glob("*.csv")):
        data_path = ROOT / "Dataset"  # fallback to old location
    df = load_all(str(data_path))
    df = basic_clean(df)
    df = add_return_features(df)
    return df

df = load_data()
summary = summary_by_asset(df)

# ── Filters ────────────────────────────────────────────────────────────────────
assets = sorted(df["asset"].unique())
selected = st.sidebar.multiselect("Select Assets", assets, default=assets[:10])
df_filtered = df[df["asset"].isin(selected)] if selected else df

# ── KPI metrics ────────────────────────────────────────────────────────────────
col1, col2, col3, col4 = st.columns(4)
col1.metric("Assets", df_filtered["asset"].nunique())
col2.metric("Total Records", f"{len(df_filtered):,}")
col3.metric("Date Range", f"{df_filtered['date'].min().year}–{df_filtered['date'].max().year}")
col4.metric("Avg Corr", f"{df_filtered.pivot_table(index='date', columns='asset', values='close').corr().mean().mean():.2f}")

st.markdown("---")

# ── Asset Coverage ─────────────────────────────────────────────────────────────
st.subheader("📅 Data Coverage by Asset")
coverage = (
    df_filtered.groupby("asset")["date"].count()
    .sort_values(ascending=True)
    .reset_index()
    .rename(columns={"date": "trading_days"})
)
import plotly.express as px
fig_cov = px.bar(
    coverage, x="trading_days", y="asset", orientation="h",
    title="Trading Days Available per Asset",
    template="plotly_dark", height=max(400, len(coverage) * 18),
    color="trading_days", color_continuous_scale="Viridis",
)
fig_cov.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_cov, use_container_width=True)

# ── Correlation Heatmap ────────────────────────────────────────────────────────
st.subheader("🔗 Cross-Asset Correlation")
pivot = df_filtered.pivot_table(index="date", columns="asset", values="close")
if pivot.shape[1] >= 2:
    st.plotly_chart(correlation_heatmap(pivot), use_container_width=True)
else:
    st.info("Select at least 2 assets to view the correlation heatmap.")

# ── Rolling Volatility ─────────────────────────────────────────────────────────
st.subheader("📉 Rolling 30-Day Volatility")
st.plotly_chart(rolling_volatility_chart(df_filtered, window=30), use_container_width=True)

# ── Summary Table ──────────────────────────────────────────────────────────────
st.subheader("📋 Asset Summary Table")
summary_filtered = summary[summary["asset"].isin(df_filtered["asset"].unique())]
st.dataframe(
    summary_filtered.style.format({
        "mean_close": "${:,.2f}",
        "max_close": "${:,.2f}",
        "min_close": "${:,.2f}",
        "sharpe_ratio": "{:.3f}" if "sharpe_ratio" in summary_filtered.columns else None,
    }).background_gradient(subset=["mean_close"], cmap="Blues"),
    use_container_width=True,
    hide_index=True,
)
