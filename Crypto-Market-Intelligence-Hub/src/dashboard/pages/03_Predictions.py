"""Page 3 — Predictions."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

import streamlit as st
import pandas as pd

st.set_page_config(page_title="Predictions | Crypto Hub", page_icon="🤖", layout="wide")
st.title("🤖 Price Forecasting")
st.markdown("Run ARIMA · Prophet · LSTM · GRU models and compare their 30-day forecasts.")


@st.cache_data(ttl=3600, show_spinner="Loading data…")
def load_asset_data(asset: str):
    from src.data.load import load_all
    from src.data.clean import basic_clean
    data_path = ROOT / "data" / "raw"
    if not data_path.exists() or not any(data_path.glob("*.csv")):
        data_path = ROOT / "Dataset"
    df = load_all(str(data_path))
    df = basic_clean(df)
    return df[df["asset"] == asset].sort_values("date").reset_index(drop=True)


# ── Controls ───────────────────────────────────────────────────────────────────
data_path = ROOT / "data" / "raw"
if not data_path.exists():
    data_path = ROOT / "Dataset"
assets = sorted(p.stem for p in data_path.glob("*.csv"))

col1, col2, col3 = st.columns(3)
with col1:
    asset = st.selectbox("Asset", assets, index=assets.index("bitcoin") if "bitcoin" in assets else 0)
with col2:
    model_choice = st.selectbox("Forecasting Model", ["prophet", "arima", "lstm", "gru"])
with col3:
    horizon = st.slider("Forecast Horizon (days)", 7, 60, 30)

run_btn = st.button("🚀 Run Forecast", type="primary", use_container_width=True)

if run_btn:
    asset_df = load_asset_data(asset)
    current_price = float(asset_df["close"].iloc[-1])

    st.info(f"Running **{model_choice.upper()}** on **{asset.title()}** — {horizon}-day forecast…")

    with st.spinner("Training model and generating forecast…"):
        try:
            if model_choice == "prophet":
                from src.models.prophet_model import run_prophet_pipeline
                result = run_prophet_pipeline(asset_df, asset, forecast_periods=horizon)
                fc = result["forecast"].tail(horizon)
                pred_vals = fc["yhat"].values
                lower = fc["yhat_lower"].values
                upper = fc["yhat_upper"].values
                metrics = result["metrics"]
                has_ci = True

            elif model_choice == "arima":
                from src.models.arima_model import run_arima_pipeline
                result = run_arima_pipeline(asset_df, asset, steps=horizon)
                pred_vals = result["forecast"].values[:horizon]
                lower = upper = None
                metrics = result["metrics"]
                has_ci = False

            elif model_choice == "lstm":
                from src.models.lstm_model import run_lstm_pipeline
                result = run_lstm_pipeline(asset_df, asset, forecast_steps=horizon)
                pred_vals = result["forecast"][:horizon]
                lower = upper = None
                metrics = result["metrics"]
                has_ci = False

            elif model_choice == "gru":
                from src.models.gru_model import run_gru_pipeline
                result = run_gru_pipeline(asset_df, asset, forecast_steps=horizon)
                pred_vals = result["forecast"][:horizon]
                lower = upper = None
                metrics = result["metrics"]
                has_ci = False

            # ── KPIs ───────────────────────────────────────────────────────────
            k1, k2, k3, k4 = st.columns(4)
            k1.metric("Current Price", f"${current_price:,.2f}")
            k2.metric("Forecast (Day 30)", f"${pred_vals[-1]:,.2f}",
                      delta=f"{((pred_vals[-1]/current_price)-1)*100:.1f}%")
            k3.metric("RMSE", f"{metrics.get('rmse', 0):.2f}")
            k4.metric("MAPE", f"{metrics.get('mape', 0):.2f}%")

            # ── Forecast Chart ─────────────────────────────────────────────────
            import plotly.graph_objects as go
            from datetime import timedelta
            last_date = asset_df["date"].iloc[-1]
            future_dates = [last_date + timedelta(days=i + 1) for i in range(len(pred_vals))]
            hist_tail = asset_df.tail(180)

            fig = go.Figure()
            fig.add_trace(go.Scatter(x=hist_tail["date"], y=hist_tail["close"],
                                     name="Historical", line=dict(color="#00d4ff", width=1.5)))
            fig.add_trace(go.Scatter(x=future_dates, y=pred_vals,
                                     name=f"{model_choice.upper()} Forecast",
                                     line=dict(color="#7c3aed", width=2, dash="dash")))
            if has_ci and lower is not None:
                x_ci = future_dates + future_dates[::-1]
                y_ci = list(upper) + list(lower)[::-1]
                fig.add_trace(go.Scatter(x=x_ci, y=y_ci, fill="toself",
                                         fillcolor="rgba(124,58,237,0.15)",
                                         line=dict(color="rgba(0,0,0,0)"), name="80% CI"))
            fig.update_layout(template="plotly_dark", height=500, title=f"{asset.title()} — {model_choice.upper()} Forecast",
                              paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig, use_container_width=True)

            # ── Forecast Table ─────────────────────────────────────────────────
            st.subheader("📋 Forecast Values")
            fc_df = pd.DataFrame({"Date": future_dates, "Forecast (USD)": pred_vals})
            if has_ci and lower is not None:
                fc_df["Lower (80% CI)"] = lower
                fc_df["Upper (80% CI)"] = upper
            st.dataframe(fc_df.style.format({"Forecast (USD)": "${:,.2f}",
                                              "Lower (80% CI)": "${:,.2f}",
                                              "Upper (80% CI)": "${:,.2f}"}),
                         use_container_width=True, hide_index=True)

        except Exception as exc:
            st.error(f"❌ Model failed: {exc}")
            st.exception(exc)
else:
    st.markdown("Configure the asset and model above, then click **Run Forecast**.")
