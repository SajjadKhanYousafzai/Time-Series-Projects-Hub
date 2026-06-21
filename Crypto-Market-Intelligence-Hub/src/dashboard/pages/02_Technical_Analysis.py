"""Page 2 — Technical Analysis."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

import streamlit as st
import pandas as pd

from src.data.load import load_all
from src.data.clean import basic_clean
from src.features.technical import add_technical_indicators
from src.visualization.charts import candlestick_chart

st.set_page_config(page_title="Technical Analysis | Crypto Hub", page_icon="📈", layout="wide")
st.title("📈 Technical Analysis")
st.markdown("RSI · MACD · Bollinger Bands · ATR · OBV — interactive charting for any asset.")


@st.cache_data(ttl=3600, show_spinner="Loading data…")
def load_data():
    data_path = ROOT / "data" / "raw"
    if not data_path.exists() or not any(data_path.glob("*.csv")):
        data_path = ROOT / "Dataset"
    df = load_all(str(data_path))
    df = basic_clean(df)
    return add_technical_indicators(df)


df = load_data()
assets = sorted(df["asset"].unique())

# ── Controls ───────────────────────────────────────────────────────────────────
col1, col2, col3 = st.columns([2, 1, 1])
with col1:
    asset = st.selectbox("Select Asset", assets, index=assets.index("bitcoin") if "bitcoin" in assets else 0)
with col2:
    days = st.slider("Days to display", min_value=90, max_value=1000, value=365, step=90)
with col3:
    show_vol = st.checkbox("Show Volume", value=True)

asset_df = df[df["asset"] == asset].sort_values("date").tail(days)

# ── Candlestick ────────────────────────────────────────────────────────────────
st.subheader(f"🕯️ {asset.title()} — Candlestick Chart")
st.plotly_chart(candlestick_chart(asset_df, asset, show_volume=show_vol), use_container_width=True)

# ── RSI ────────────────────────────────────────────────────────────────────────
st.subheader("RSI (14)")
import plotly.graph_objects as go
fig_rsi = go.Figure()
fig_rsi.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["rsi"], name="RSI", line=dict(color="#00d4ff")))
fig_rsi.add_hline(y=70, line_dash="dash", line_color="#ff4466", annotation_text="Overbought")
fig_rsi.add_hline(y=30, line_dash="dash", line_color="#00ff88", annotation_text="Oversold")
fig_rsi.update_layout(template="plotly_dark", height=300, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_rsi, use_container_width=True)

# ── MACD ───────────────────────────────────────────────────────────────────────
st.subheader("MACD (12, 26, 9)")
fig_macd = go.Figure()
fig_macd.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["macd"], name="MACD", line=dict(color="#00d4ff")))
fig_macd.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["macd_signal"], name="Signal", line=dict(color="#ff4466", dash="dash")))
colors = ["#00ff88" if v >= 0 else "#ff4466" for v in asset_df["macd_hist"]]
fig_macd.add_trace(go.Bar(x=asset_df["date"], y=asset_df["macd_hist"], name="Histogram", marker_color=colors, opacity=0.6))
fig_macd.update_layout(template="plotly_dark", height=300, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_macd, use_container_width=True)

# ── Bollinger Bands ────────────────────────────────────────────────────────────
st.subheader("Bollinger Bands (20, 2σ)")
fig_bb = go.Figure()
fig_bb.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["close"], name="Close", line=dict(color="#00d4ff", width=1.5)))
fig_bb.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["bb_upper"], name="Upper", line=dict(color="#7c3aed", dash="dot")))
fig_bb.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["bb_middle"], name="SMA20", line=dict(color="#888", dash="dash")))
fig_bb.add_trace(go.Scatter(
    x=list(asset_df["date"]) + list(asset_df["date"])[::-1],
    y=list(asset_df["bb_upper"]) + list(asset_df["bb_lower"])[::-1],
    fill="toself", fillcolor="rgba(124,58,237,0.1)", line=dict(color="rgba(255,255,255,0)"), name="BB Band",
))
fig_bb.add_trace(go.Scatter(x=asset_df["date"], y=asset_df["bb_lower"], name="Lower", line=dict(color="#7c3aed", dash="dot")))
fig_bb.update_layout(template="plotly_dark", height=400, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_bb, use_container_width=True)
