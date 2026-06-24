import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Brain, Cpu, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Workforce Demand Forecasting Models",
  description: "Configure and execute SARIMA, Holt-Winters, and seasonal naive predictions for hospitality staff planning.",
};

const MODELS = [
  {
    id: "sarima",
    name: "SARIMA",
    desc: "Seasonal Autoregressive Integrated Moving Average: captures 12-month lag relations and long-term trends.",
    badge: "Most Accurate",
    features: ["Seasonal lags", "Parameter tuning", "80/95% CI bands"]
  },
  {
    id: "holt_winters",
    name: "Holt-Winters",
    desc: "Triple Exponential Smoothing: dynamically adjusts level, trend, and multiplicative seasonal variations.",
    badge: "Highly Adaptive",
    features: ["Multiplicative seasonality", "Dynamic smoothing", "Instant training"]
  },
  {
    id: "naive",
    name: "Seasonal Naive",
    desc: "Baseline model: assumes workforce numbers match the historical value from exactly 12 months prior.",
    badge: "Baseline Bench",
    features: ["Simple logic", "Zero params", "No training"]
  },
];

export default function PredictionsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">Workforce Forecasting Models</h1>
            <p className="text-xs text-slate-400">SARIMA · Holt-Winters · Seasonal Naive</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Model Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available Time-Series Models</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {MODELS.map((m) => (
              <div key={m.id} className="glass-card p-6 flex flex-col hover:border-primary/40 hover:shadow-glow-amber transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span className="metric-badge bg-primary/10 text-primary border border-primary/20">{m.badge}</span>
                </div>
                <p className="text-sm text-slate-400 mb-6 flex-grow">{m.desc}</p>
                <div className="space-y-1.5 pt-4 border-t border-border/50">
                  {m.features.map((f) => (
                    <div key={f} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Launch Forecast */}
        <section className="glass-card p-8 mb-12 bg-zinc-950/20">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Run Model Inference
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Launch the interactive Streamlit dashboard to tune hyperparameters, run cross-validation backtests, and view interactive plots. Alternatively, fetch raw predictions programmatically via our OpenAPI.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="http://localhost:8501"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center text-sm flex items-center justify-center gap-1"
              >
                Launch Dashboard (Streamlit)
              </a>
              <a
                href="http://localhost:8000/docs#/Forecasting/predict_api_v1_predict_post"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center text-sm flex items-center justify-center gap-1"
              >
                FastAPI Swagger Docs
              </a>
            </div>
          </div>
        </section>

        {/* Model Comparison Table */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" /> Model Comparison & Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-border">
                  <th className="pb-3 text-left">Model</th>
                  <th className="pb-3 text-right">Optimal Horizon</th>
                  <th className="pb-3 text-right">Strengths</th>
                  <th className="pb-3 text-right">Confidence Bands</th>
                  <th className="pb-3 text-right">Relative MAE</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ["SARIMA", "12–24 months", "Captures moving-average dynamics", "Yes (Parametric)", "Lowest (Optimal)"],
                  ["Holt-Winters", "12–36 months", "Handles dynamic variance", "Yes (Simulated)", "Moderate"],
                  ["Seasonal Naive", "12 months", "Zero-effort baseline comparison", "No", "High (Baseline)"],
                ].map(([model, horizon, strength, ci, mae]) => (
                  <tr key={model} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white">{model}</td>
                    <td className="text-right py-3 text-slate-400">{horizon}</td>
                    <td className="text-right py-3">{strength}</td>
                    <td className={`text-right py-3 font-medium ${ci.startsWith("Yes") ? "text-emerald-400" : "text-slate-500"}`}>{ci}</td>
                    <td className={`text-right py-3 font-medium ${mae.startsWith("Lowest") ? "text-primary" : "text-slate-400"}`}>{mae}</td>
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
