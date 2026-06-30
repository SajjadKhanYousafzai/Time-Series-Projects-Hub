"""
src/dashboard/app.py
====================
Streamlit 4-page dashboard for Hourly Energy Demand Forecasting.
Dark amber theme — consistent with the project visual identity.

Pages:
  1. 🏠 Home          — Project overview and dataset summary
  2. 📊 Data Explorer — Interactive time series and pattern exploration
  3. 🤖 Forecast      — Run ARIMA / XGBoost forecasts and compare
  4. 📐 Analysis      — Decomposition, stationarity, ACF/PACF
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
import streamlit as st

# Allow running from project root
sys.path.insert(0, str(Path(__file__).parents[2]))

from src.data.load import list_regions, load_region
from src.data.store import load_parquet, list_processed_regions
from src.features.time_features import add_time_features
from src.visualization.charts import (
    plot_time_series,
    plot_hourly_profile,
    plot_seasonal_heatmap,
    plot_decomposition,
    plot_forecast,
    plot_model_comparison,
)

# ── Page Config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="⚡ Energy Demand Forecasting",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
  .stApp { background-color: #0F1117; }
  .metric-card {
    background: #1A1D27; border: 1px solid #2D3147;
    border-radius: 12px; padding: 20px; text-align: center;
  }
  .metric-value { font-size: 2rem; font-weight: 700; color: #F59E0B; }
  .metric-label { font-size: 0.85rem; color: #94A3B8; margin-top: 4px; }
  h1, h2, h3 { color: #F59E0B !important; }
  .sidebar .sidebar-content { background-color: #1A1D27; }
</style>
""", unsafe_allow_html=True)

# ── Sidebar Navigation ─────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## ⚡ Energy Forecasting")
    st.markdown("---")
    page = st.radio(
        "Navigate",
        ["🏠 Home", "📊 Data Explorer", "🤖 Forecast", "📐 Analysis"],
        label_visibility="collapsed",
    )
    st.markdown("---")
    processed = list_processed_regions()
    all_regions = list_regions()
    available = processed if processed else all_regions

    region = st.selectbox(
        "📍 Select Region",
        options=available,
        index=0,
        help="Choose a PJM energy region to analyze.",
    )
    st.markdown("---")
    st.caption("Data: PJM Interconnection LLC  |  Kaggle")
    st.caption("Built by Sajjad Khan Yousafzai")


# ── Data Loader (cached) ───────────────────────────────────────────────────────
@st.cache_data(show_spinner="Loading data…", ttl=3600)
def get_data(reg: str) -> pd.DataFrame:
    try:
        return load_parquet(reg)
    except FileNotFoundError:
        return load_region(reg)


# ════════════════════════════════════════════════════════════════════════════════
# PAGE 1: HOME
# ════════════════════════════════════════════════════════════════════════════════
if page == "🏠 Home":
    st.title("⚡ Hourly Energy Demand Forecasting Hub")
    st.markdown(
        "> **End-to-end time series forecasting for PJM regional electricity demand.** "
        "Covering 11 regions across the Eastern US interconnection grid."
    )

    col1, col2, col3, col4 = st.columns(4)
    metrics_data = [
        ("11", "PJM Regions"),
        ("14", "Data Files"),
        ("~1M+", "Hourly Records"),
        ("3", "Forecast Models"),
    ]
    for col, (value, label) in zip([col1, col2, col3, col4], metrics_data):
        with col:
            st.markdown(f"""
            <div class="metric-card">
              <div class="metric-value">{value}</div>
              <div class="metric-label">{label}</div>
            </div>""", unsafe_allow_html=True)

    st.markdown("---")

    col_l, col_r = st.columns([3, 2])
    with col_l:
        st.subheader("📑 About the Dataset")
        st.markdown("""
        **Source:** [Kaggle — Hourly Energy Consumption](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption)

        **PJM Interconnection LLC (PJM)** is one of the world's largest grid operators, managing
        electricity transmission across 13 US states and DC.

        | Field | Value |
        |-------|-------|
        | **Unit** | Megawatts (MW) |
        | **Frequency** | Hourly |
        | **Coverage** | Delaware · Illinois · Indiana · Kentucky · Maryland · Michigan · New Jersey · North Carolina · Ohio · Pennsylvania · Tennessee · Virginia · West Virginia · DC |
        | **Regions** | AEP · COMED · DAYTON · DEOK · DOM · DUQ · EKPC · FE · NI · PJME · PJMW |
        """)

    with col_r:
        st.subheader("🤖 Forecasting Models")
        st.markdown("""
        | Model | Type | Horizon |
        |-------|------|---------|
        | **ARIMA(1,1,1)** | Statistical | 1–168h |
        | **XGBoost** | Gradient Boost | 1–168h |
        | **LSTM** | Deep Learning | 24h (AEP) |

        **Evaluation Metrics:** MAE · RMSE · MAPE
        **Validation:** 80/20 split + rolling CV
        """)

    st.subheader("📋 Pipeline Overview")
    st.markdown("""
    ```
    Raw CSV → Data Cleaning → Feature Engineering → Model Training → Evaluation → Forecast → API / Dashboard
    ```
    1. **Load** — Parse hourly CSV for any of 11 PJM regions
    2. **Clean** — Remove duplicates (DST), fill gaps, detect outliers (z > 5σ)
    3. **Features** — 31+ time-based features: hour, lag_24, lag_168, rolling stats, cyclical encoding
    4. **Model** — ARIMA, XGBoost, or LSTM depending on accuracy/speed trade-off
    5. **Evaluate** — MAE/RMSE/MAPE on test set + rolling cross-validation
    6. **Serve** — FastAPI REST endpoints · Streamlit dashboard
    """)


# ════════════════════════════════════════════════════════════════════════════════
# PAGE 2: DATA EXPLORER
# ════════════════════════════════════════════════════════════════════════════════
elif page == "📊 Data Explorer":
    st.title(f"📊 Data Explorer — {region}")

    df = get_data(region)
    st.success(f"✅ Loaded **{len(df):,}** hourly records  |  {df.index[0].date()} → {df.index[-1].date()}")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Mean MW", f"{df['MW'].mean():.0f}")
    col2.metric("Peak MW", f"{df['MW'].max():.0f}")
    col3.metric("Min MW",  f"{df['MW'].min():.0f}")
    col4.metric("Std MW",  f"{df['MW'].std():.0f}")

    st.plotly_chart(
        plot_time_series(df["MW"], region=region, rolling_window=24 * 7),
        use_container_width=True,
    )

    col_a, col_b = st.columns(2)
    with col_a:
        st.plotly_chart(plot_hourly_profile(df, region=region), use_container_width=True)
    with col_b:
        st.plotly_chart(plot_seasonal_heatmap(df, region=region), use_container_width=True)


# ════════════════════════════════════════════════════════════════════════════════
# PAGE 3: FORECAST
# ════════════════════════════════════════════════════════════════════════════════
elif page == "🤖 Forecast":
    st.title(f"🤖 Forecast — {region}")

    col1, col2, col3 = st.columns(3)
    model_choice = col1.selectbox("Model", ["ARIMA", "Seasonal Naive"])
    horizon      = col2.slider("Horizon (hours)", 24, 168, 24, step=24)
    test_ratio   = col3.slider("Test ratio", 0.10, 0.30, 0.20, step=0.05)

    if st.button("▶ Run Forecast", type="primary"):
        df = get_data(region)
        series = df["MW"]
        split  = int(len(series) * (1 - test_ratio))
        train, test = series.iloc[:split], series.iloc[split:]

        with st.spinner(f"Fitting {model_choice}…"):
            if model_choice == "ARIMA":
                from src.models.arima_model import ARIMAForecaster
                from src.models.evaluate import compute_metrics
                m = ARIMAForecaster(order=(1, 1, 1))
                m.fit(train)
                test_pred = m.predict(test.index[0], test.index[-1])
                result    = m.forecast(steps=horizon)
                metrics   = compute_metrics(test, test_pred, "ARIMA")
                fc        = result.forecast
                fc_lower  = result.forecast_lower
                fc_upper  = result.forecast_upper

            else:  # Seasonal Naive
                from src.models.evaluate import compute_metrics
                test_preds = []
                for dt in test.index:
                    ref = dt - pd.DateOffset(hours=24 * 7)
                    val = train.iloc[-1] if ref not in train.index else train[ref]
                    test_preds.append(val)
                test_pred = pd.Series(test_preds, index=test.index)
                fc_idx    = pd.date_range(train.index[-1] + pd.Timedelta(hours=1), periods=horizon, freq="h")
                fc        = pd.Series(
                    [train[dt - pd.DateOffset(hours=24*7)] if (dt - pd.DateOffset(hours=24*7)) in train.index
                     else train.iloc[-1] for dt in fc_idx],
                    index=fc_idx,
                )
                fc_lower = fc_upper = None
                metrics  = compute_metrics(test, test_pred, "Seasonal Naive")

        col1m, col2m, col3m = st.columns(3)
        col1m.metric("MAE",  f"{metrics.mae:.1f} MW")
        col2m.metric("RMSE", f"{metrics.rmse:.1f} MW")
        col3m.metric("MAPE", f"{metrics.mape:.2f}%")

        st.plotly_chart(
            plot_forecast(train, test, fc, fc_lower, fc_upper,
                          model_name=model_choice, region=region),
            use_container_width=True,
        )


# ════════════════════════════════════════════════════════════════════════════════
# PAGE 4: ANALYSIS
# ════════════════════════════════════════════════════════════════════════════════
elif page == "📐 Analysis":
    st.title(f"📐 Analysis — {region}")
    df = get_data(region)

    tab1, tab2, tab3 = st.tabs(["Decomposition", "Stationarity", "ACF / PACF"])

    with tab1:
        st.subheader("Classical Additive Decomposition")
        sample_size = min(24 * 365 * 2, len(df))  # up to 2 years
        sample = df["MW"].iloc[-sample_size:]
        from statsmodels.tsa.seasonal import seasonal_decompose
        with st.spinner("Decomposing…"):
            result = seasonal_decompose(sample, model="additive", period=24 * 7, extrapolate_trend="freq")
        st.plotly_chart(
            plot_decomposition(result.observed, result.trend, result.seasonal, result.resid, region),
            use_container_width=True,
        )

    with tab2:
        st.subheader("Stationarity Tests — ADF & KPSS")
        from src.features.stationarity import adf_test, kpss_test
        sample_s = df["MW"].iloc[-8760:]  # last year
        adf = adf_test(sample_s)
        kp  = kpss_test(sample_s)
        col_a, col_b = st.columns(2)
        with col_a:
            st.markdown("**ADF Test** (H₀: unit root)")
            st.metric("Statistic",    f"{adf.statistic:.4f}")
            st.metric("p-value",      f"{adf.p_value:.4f}")
            st.metric("Stationary?",  "✅ Yes" if adf.is_stationary else "❌ No")
        with col_b:
            st.markdown("**KPSS Test** (H₀: stationary)")
            st.metric("Statistic",    f"{kp.statistic:.4f}")
            st.metric("p-value",      f"{kp.p_value:.4f}")
            st.metric("Stationary?",  "✅ Yes" if kp.is_stationary else "❌ No")
        st.info(adf.interpretation)

    with tab3:
        st.subheader("ACF / PACF")
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
        sample_a = df["MW"].iloc[-24 * 90:]  # last 90 days
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 4))
        fig.patch.set_facecolor("#0F1117")
        for ax in [ax1, ax2]:
            ax.set_facecolor("#1A1D27")
            ax.tick_params(colors="#94A3B8")
        plot_acf(sample_a, lags=72, ax=ax1, color="#F59E0B", title="ACF (72 lags)")
        plot_pacf(sample_a, lags=72, ax=ax2, color="#14B8A6", title="PACF (72 lags)")
        for ax in [ax1, ax2]:
            ax.title.set_color("#F59E0B")
        st.pyplot(fig)
        plt.close()


if __name__ == "__main__":
    pass  # Run via: streamlit run src/dashboard/app.py
