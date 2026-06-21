"""Streamlit dashboard — Crypto Market Intelligence Hub.

Entry point: streamlit run src/dashboard/app.py
"""
import sys
from pathlib import Path

# Ensure project root on path
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import streamlit as st

st.set_page_config(
    page_title="Crypto Market Intelligence Hub",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "Get Help": "https://github.com/your-org/Crypto-Market-Intelligence-Hub",
        "Report a bug": None,
        "About": "**Crypto Market Intelligence Hub** — End-to-End Forecasting & Analysis",
    },
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    /* Dark fintech theme */
    .stApp { background-color: #0a0e1a; color: #e2e8f0; }
    .stSidebar { background-color: #0f1629; }
    .metric-card {
        background: linear-gradient(135deg, #1a1f3c 0%, #0f1629 100%);
        border: 1px solid #2d3561;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    h1, h2, h3 { color: #00d4ff !important; }
    .stSelectbox > div > div { background-color: #1a1f3c; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Sidebar navigation ────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.icons8.com/color/96/cryptocurrency.png", width=60)
    st.title("Crypto Intelligence")
    st.markdown("---")
    st.markdown("### Navigation")
    st.page_link("app.py", label="🏠 Home", icon="🏠")
    st.page_link("pages/01_Market_Overview.py", label="📊 Market Overview")
    st.page_link("pages/02_Technical_Analysis.py", label="📈 Technical Analysis")
    st.page_link("pages/03_Predictions.py", label="🤖 Predictions")
    st.markdown("---")
    st.caption("Data: Yahoo Finance · Sep 2014 → Jan 2026")

# ── Home page content ─────────────────────────────────────────────────────────
st.title("🚀 Crypto Market Intelligence Hub")
st.markdown(
    """
    > **Volatility · Correlations · Regime Behavior · Multi-Model Price Forecasting**

    Comprehensive analysis of daily OHLCV data across **49 leading digital assets**
    from September 2014 to January 2026 — **112,000+ trading records**.
    """
)

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Assets Covered", "49", help="Top 50 crypto assets by market cap")
with col2:
    st.metric("Trading Records", "112K+", help="Daily OHLCV records")
with col3:
    st.metric("Date Range", "11+ Years", help="Sep 2014 → Jan 2026")
with col4:
    st.metric("Forecasting Models", "4", help="ARIMA · Prophet · LSTM · GRU")

st.markdown("---")

col_a, col_b = st.columns(2)
with col_a:
    st.subheader("📊 What's Inside")
    st.markdown(
        """
        - **Market Overview** — Price tiers, coverage, cross-asset correlations
        - **Technical Analysis** — RSI, MACD, Bollinger Bands, ATR, OBV
        - **Volatility Regimes** — Rolling volatility, ARCH effects, drawdowns
        - **Predictions** — ARIMA / Prophet / LSTM / GRU forecasts
        """
    )
with col_b:
    st.subheader("💡 Key Findings")
    st.markdown(
        """
        - Average cross-asset correlation ≈ **0.7** — highly correlated universe
        - Bitcoin is the **least volatile** major asset (vol anchor)
        - **Q4 (Oct–Dec)** is historically the strongest quarter
        - LSTM/GRU achieve best RMSE; Prophet best for trend decomposition
        """
    )

st.info("👈 Use the sidebar to navigate to Market Overview, Technical Analysis, or Predictions.")
