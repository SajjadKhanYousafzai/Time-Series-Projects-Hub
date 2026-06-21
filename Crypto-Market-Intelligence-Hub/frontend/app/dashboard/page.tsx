import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Activity, BarChart2, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Dashboard",
  description: "Real-time crypto market overview — prices, correlations, volatility and performance metrics.",
};

export default function DashboardPage() {
  const topAssets = [
    { name: "Bitcoin", symbol: "BTC", price: 67_350, change: 2.14 },
    { name: "Ethereum", symbol: "ETH", price: 3_580, change: -1.23 },
    { name: "Solana", symbol: "SOL", price: 172, change: 4.87 },
    { name: "BNB", symbol: "BNB", price: 598, change: 0.45 },
    { name: "XRP", symbol: "XRP", price: 0.52, change: -0.89 },
    { name: "Dogecoin", symbol: "DOGE", price: 0.143, change: 6.21 },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Market Dashboard</h1>
            <p className="text-xs text-muted">49 Assets · Sep 2014 – Jan 2026</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/predictions" className="btn-primary text-sm">
              Run Forecast →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BarChart2, label: "Total Assets", value: "49", color: "text-primary" },
            { icon: Activity, label: "Records", value: "112K+", color: "text-accent" },
            { icon: TrendingUp, label: "Avg Correlation", value: "0.70", color: "text-success" },
            { icon: DollarSign, label: "Date Range", value: "11+ Yrs", color: "text-warning" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-5">
              <kpi.icon className={`w-6 h-6 ${kpi.color} mb-3`} />
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-muted mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Top Assets Table */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Top Assets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
                  <th className="text-left pb-3">Asset</th>
                  <th className="text-right pb-3">Price</th>
                  <th className="text-right pb-3">24h Change</th>
                  <th className="text-right pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {topAssets.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{asset.name}</p>
                          <p className="text-xs text-muted">{asset.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 font-mono">
                      ${asset.price.toLocaleString()}
                    </td>
                    <td className={`text-right py-3 font-medium ${asset.change >= 0 ? "text-success" : "text-danger"}`}>
                      {asset.change >= 0 ? "+" : ""}{asset.change}%
                    </td>
                    <td className="text-right py-3">
                      <Link
                        href={`/predictions?asset=${asset.name.toLowerCase()}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Forecast →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📊 Market Structure</h2>
            <div className="space-y-3 text-sm text-muted">
              <p>• Average cross-asset correlation: <span className="text-white font-medium">0.70</span></p>
              <p>• Bitcoin dominates as vol anchor</p>
              <p>• Meme coins (DOGE, SHIB, PEPE) show highest volatility</p>
              <p>• Stablecoins (USDT, USDC) near-zero correlation</p>
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📅 Seasonal Patterns</h2>
            <div className="space-y-3 text-sm text-muted">
              <p>• <span className="text-success font-medium">Q4 (Oct–Dec)</span>: historically strongest</p>
              <p>• <span className="text-danger font-medium">Jun–Sep</span>: consistently weakest</p>
              <p>• &quot;Uptober&quot; effect: BTC +32% avg in October</p>
              <p>• Year-over-year BTC returns range: -73% to +305%</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            💡 Connect the FastAPI backend to see live predictions.{" "}
            <Link href="http://localhost:8000/docs" className="text-primary hover:underline" target="_blank">
              View API Docs →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
