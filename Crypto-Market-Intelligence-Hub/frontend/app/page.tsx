import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, BarChart3, Bot, Zap, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Crypto Market Intelligence Hub — AI-Powered Forecasting",
  description:
    "End-to-end cryptocurrency market analysis and forecasting across 49 digital assets using ARIMA, Prophet, LSTM and GRU models.",
};

const stats = [
  { label: "Assets Covered", value: "49" },
  { label: "Trading Records", value: "112K+" },
  { label: "Date Range", value: "11+ Years" },
  { label: "ML Models", value: "4" },
];

const features = [
  {
    icon: BarChart3,
    title: "Market Overview",
    desc: "Coverage charts, correlation heatmaps, volatility regimes and performance metrics across all assets.",
    href: "/dashboard",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Technical Analysis",
    desc: "Interactive RSI, MACD, Bollinger Bands, ATR and OBV charts with candlestick visualization.",
    href: "/dashboard",
    color: "text-accent",
  },
  {
    icon: Bot,
    title: "AI Forecasting",
    desc: "ARIMA, Prophet, LSTM and GRU models with 30-day forecasts and confidence intervals.",
    href: "/predictions",
    color: "text-success",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-white text-lg">Crypto Hub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/predictions" className="nav-link">Predictions</Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="nav-link"
            >
              GitHub
            </Link>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm">
            Launch Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-grid overflow-hidden">
        <div className="absolute inset-0 bg-glow-blue pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            End-to-End Crypto Intelligence Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Predict</span> Crypto Markets{" "}
            <br className="hidden md:block" />
            with <span className="text-gradient">AI Precision</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Comprehensive analysis of 49 digital assets using ARIMA, Prophet, LSTM and GRU
            models — 11+ years of market data, 112K+ trading records.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-base">
              Explore Dashboard
            </Link>
            <Link href="/predictions" className="btn-outline text-base">
              Run Forecast
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6 text-center animate-slide-up">
              <p className="text-3xl font-bold text-gradient">{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Analyze Crypto Markets
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            From raw data loading to deep-learning forecasts — a complete production-grade ML pipeline.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href}>
                <div className="glass-card p-8 hover:border-primary/40 hover:shadow-glow-blue transition-all duration-300 cursor-pointer group h-full">
                  <f.icon className={`w-10 h-10 ${f.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-20 px-6 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">💡 Key Market Insights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["🔗 High Correlation", "Avg cross-asset correlation ≈ 0.7 — crypto moves together"],
              ["📉 ARCH Effects", "Strong volatility clustering; Bitcoin is the least volatile major asset"],
              ["📅 Seasonality", "Q4 (Oct–Dec) historically strongest; June–Sep weakest"],
              ["🤖 Best Model", "LSTM/GRU best RMSE; Prophet best for trend decomposition"],
              ["📊 Non-Stationarity", "Raw prices have unit roots — log returns are the correct target"],
              ["⚡ Boom-Bust", "BTC suffered >80% drawdowns in each cycle despite 100x+ ATH returns"],
            ].map(([title, desc]) => (
              <div key={title as string} className="glass-card p-5 flex gap-4 items-start">
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-muted text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-muted text-sm">
        <p>
          Crypto Market Intelligence Hub · Data: Yahoo Finance · Sep 2014 → Jan 2026
        </p>
        <p className="mt-1 text-xs">
          For educational and research purposes only. Not financial advice.
        </p>
      </footer>
    </main>
  );
}
