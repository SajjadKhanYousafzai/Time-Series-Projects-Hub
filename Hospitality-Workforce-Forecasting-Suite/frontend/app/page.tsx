import type { Metadata } from "next";
import Link from "next/link";
import { Users, TrendingUp, BarChart3, Brain, Calendar, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospitality Workforce forecasting — AI Labor Analytics",
  description:
    "Data-driven scheduling and forecasting for the hospitality sector. Predict labor demand, analyze seasonality, and run time-series forecasts.",
};

const stats = [
  { label: "Historical Records", value: "348" },
  { label: "Date Range", value: "29 Years" },
  { label: "Frequency", value: "Monthly" },
  { label: "Fitted Models", value: "3" },
];

const features = [
  {
    icon: BarChart3,
    title: "Labor Dashboard",
    desc: "Interactive overview of workforce levels, moving averages, and historical employment trends since 1990.",
    href: "/dashboard",
    color: "text-amber-500",
  },
  {
    icon: Users,
    title: "Statistical Diagnostics",
    desc: "ADF/KPSS stationarity tests, correlation analysis, and classical trend-seasonal decomposition.",
    href: "/dashboard",
    color: "text-amber-400",
  },
  {
    icon: Brain,
    title: "Demand Forecasting",
    desc: "SARIMA, Holt-Winters, and Seasonal Naive models with confidence intervals for future labor demand.",
    href: "/predictions",
    color: "text-emerald-400",
  },
];

const insights = [
  ["📅 Strong Seasonality", "Consistent summer spikes (July/August) and winter troughs (Jan/Feb) matching tourism patterns."],
  ["📈 Growth Trend", "Long-term upward trend representing the steady expansion of the hospitality industry over three decades."],
  ["📊 Unit Root Present", "Raw series is highly non-stationary. First-differencing ensures reliable model training."],
  ["🤖 Dynamic Models", "Holt-Winters captures varying seasonal amplitudes, while SARIMA models complex auto-correlations."],
  ["💼 Recessions & Cycles", "Major macro events, like the 2008 financial crisis, are isolated in residual component analysis."],
  ["📉 Benchmark Error", "Custom models reduce forecasting error by over 60% compared to a simple Seasonal Naive baseline."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Workforce Suite</span>
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
          <Link href="/dashboard" className="btn-primary text-sm flex items-center gap-1.5">
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Strategic Staffing & Capacity Optimization
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
            Optimize <span className="text-gradient">Workforce Planning</span> <br />
            with <span className="text-gradient">Predictive Analytics</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-grade time-series forecasting suite for the hospitality sector.
            Leverage SARIMA and Holt-Winters to forecast staffing levels up to 60 months ahead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-base">
              Explore Dashboard
            </Link>
            <Link href="/predictions" className="btn-outline text-base">
              Run Staff Forecast
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6 text-center">
              <p className="text-3xl font-bold text-gradient">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Designed for Professional Staffing Operations
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A comprehensive toolset addressing seasonality, long-term trends, and prediction uncertainties in labor economics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href}>
                <div className="glass-card p-8 hover:border-primary/40 hover:shadow-glow-amber transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  <f.icon className={`w-10 h-10 ${f.color} mb-5 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-20 px-6 bg-zinc-950/50 border-y border-border relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">💡 Workforce Planning Insights</h2>
          <p className="text-slate-400 text-center mb-12 max-w-lg mx-auto text-sm">
            Core findings from exploratory analysis and model diagnostic processes.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map(([title, desc]) => (
              <div key={title} className="glass-card p-5">
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-slate-500 text-sm relative z-10">
        <p>
          Hospitality Workforce Forecasting Suite · Monthly California Employment Data (1990 – 2018)
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Powered by FastAPI backend, Streamlit dashboards, and Next.js portal.
        </p>
      </footer>
    </main>
  );
}
