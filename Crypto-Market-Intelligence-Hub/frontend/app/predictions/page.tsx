import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Price Predictions",
  description: "Run ARIMA, Prophet, LSTM and GRU forecasting models on any crypto asset.",
};

const MODELS = [
  { id: "prophet", name: "Prophet", desc: "Trend + seasonality decomposition with 80% CI bands", badge: "Best CI" },
  { id: "arima", name: "ARIMA", desc: "Grid-searched (p,d,q) — best for short horizons", badge: "Interpretable" },
  { id: "lstm", name: "LSTM", desc: "Stacked LSTM with BatchNorm + Dropout — best RMSE", badge: "Deep Learning" },
  { id: "gru", name: "GRU", desc: "~30% fewer params than LSTM, comparable accuracy", badge: "Efficient" },
];

const ASSETS = ["bitcoin", "ethereum", "solana", "binance_coin", "cardano", "dogecoin", "xrp", "polygon", "avalanche", "chainlink"];

export default function PredictionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Brain className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-xl font-bold text-white">AI Price Forecasting</h1>
            <p className="text-xs text-muted">ARIMA · Prophet · LSTM · GRU</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Model Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Choose a Forecasting Model</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {MODELS.map((m) => (
              <div key={m.id} className="glass-card p-6 hover:border-accent/40 hover:shadow-glow-purple transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span className="metric-badge bg-accent/20 text-accent border border-accent/30">{m.badge}</span>
                </div>
                <p className="text-sm text-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Launch */}
        <section className="glass-card p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">🚀 Run a Forecast</h2>
          <p className="text-muted text-sm mb-6">
            Use the Streamlit dashboard or the FastAPI backend to run live model inference.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="http://localhost:8501"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center text-sm"
            >
              Open Streamlit Dashboard →
            </a>
            <a
              href="http://localhost:8000/docs#/Predictions/predict_api_v1_predict_post"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-center text-sm"
            >
              FastAPI Interactive Docs →
            </a>
          </div>
        </section>

        {/* Model Comparison Table */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">📊 Model Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
                  <th className="text-left pb-3">Model</th>
                  <th className="text-right pb-3">Horizon</th>
                  <th className="text-right pb-3">Strength</th>
                  <th className="text-right pb-3">Params</th>
                  <th className="text-right pb-3">CI Bands</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ["ARIMA", "1–10 days", "Short-term linear", "~6", "No"],
                  ["Prophet", "7–90 days", "Trend & seasonality", "~20", "Yes (80%)"],
                  ["LSTM", "7–60 days", "Non-linear patterns", "~400K", "No"],
                  ["GRU", "7–60 days", "Non-linear (faster)", "~280K", "No"],
                ].map(([model, horizon, strength, params, ci]) => (
                  <tr key={model as string} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 font-medium text-white">{model}</td>
                    <td className="text-right py-3">{horizon}</td>
                    <td className="text-right py-3">{strength}</td>
                    <td className="text-right py-3 font-mono">{params}</td>
                    <td className={`text-right py-3 ${ci === "Yes (80%)" ? "text-success" : "text-muted"}`}>{ci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
