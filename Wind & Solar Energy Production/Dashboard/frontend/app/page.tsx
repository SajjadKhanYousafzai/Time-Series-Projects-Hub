'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  Wind, Sun, Calendar, TrendingUp, AlertTriangle,
  BarChart3, Activity, Layers, Filter, X, ChevronDown,
  Zap, Snowflake, Award, Clock, Target,
} from 'lucide-react';
import {
  monthlyAvg, hourlyAvg, yearlyAvg, seasonalStats, sourceStats,
  dayOfWeek, modelComparison, keyInsights, summaryStats,
  yoyComparison, years, sources, seasons,
} from './data';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];
const SEASON_COLORS: Record<string, string> = { Winter: '#3b82f6', Spring: '#10b981', Summer: '#f59e0b', Fall: '#8b5cf6' };
const PIE_COLORS = ['#3b82f6', '#f59e0b'];

const iconMap: Record<string, React.ReactNode> = {
  Wind: <Wind className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Snowflake: <Snowflake className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
};

const impactColors: Record<string, string> = {
  'Very High': 'bg-rose-500/20 text-rose-400',
  'Medium': 'bg-amber-500/20 text-amber-400',
  'Low': 'bg-sky-500/20 text-sky-400',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-sm" style={{ background: 'rgba(10, 14, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-slate-300 mb-1 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value} MWh
        </p>
      ))}
    </div>
  );
};

type TabKey = 'overview' | 'analysis' | 'forecasting';

/* ═══════════ FILTER BAR ═══════════ */
function FilterBar({
  selectedSource, setSelectedSource,
  selectedSeason, setSelectedSeason,
  selectedYear, setSelectedYear,
}: {
  selectedSource: string; setSelectedSource: (v: string) => void;
  selectedSeason: string; setSelectedSeason: (v: string) => void;
  selectedYear: string; setSelectedYear: (v: string) => void;
}) {
  const hasFilters = selectedSource !== 'all' || selectedSeason !== 'all' || selectedYear !== 'all';
  const clearAll = () => { setSelectedSource('all'); setSelectedSeason('all'); setSelectedYear('all'); };

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-300">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="ml-auto flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors">
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FilterSelect label="Energy Source" value={selectedSource} onChange={setSelectedSource}
          options={[{ value: 'all', label: 'All Sources' }, ...sources.map(s => ({ value: s, label: s }))]} />
        <FilterSelect label="Season" value={selectedSeason} onChange={setSelectedSeason}
          options={[{ value: 'all', label: 'All Seasons' }, ...seasons.map(s => ({ value: s, label: s }))]} />
        <FilterSelect label="Year" value={selectedYear} onChange={setSelectedYear}
          options={[{ value: 'all', label: 'All Years' }, ...years.map(y => ({ value: String(y), label: String(y) }))]} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none cursor-pointer hover:bg-white/[0.06] transition-colors"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-slate-800 text-slate-200">{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const activeFilters = [selectedSource, selectedSeason, selectedYear].filter(v => v !== 'all').length;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { key: 'analysis', label: 'Deep Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'forecasting', label: 'Forecasting', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-amber-500/20 border border-white/10">
            <Zap className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Wind & Solar Energy</span>
              <span className="text-slate-400 font-normal text-lg md:text-xl ml-3">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Interactive EDA & Forecasting — {summaryStats.totalRecords} hourly records · {summaryStats.dateRange}
            </p>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.key
                ? 'tab-active'
                : 'glass-card text-slate-400 hover:text-white'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        {activeFilters > 0 && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-semibold ml-auto">
            <Filter className="w-3 h-3" /> {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
          </span>
        )}
      </nav>

      {/* Filters */}
      <FilterBar
        selectedSource={selectedSource} setSelectedSource={setSelectedSource}
        selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Production', value: summaryStats.totalProduction, sub: '2020-2025', icon: <Zap className="w-5 h-5 text-amber-400" />, glow: 'glow-amber' },
          { label: 'Avg Daily Output', value: summaryStats.avgDaily, sub: 'per day', icon: <Activity className="w-5 h-5 text-blue-400" />, glow: 'glow-blue' },
          { label: 'Peak Season', value: summaryStats.peakSeason, sub: `${summaryStats.peakMonth} at ${summaryStats.peakHour}`, icon: <Snowflake className="w-5 h-5 text-cyan-400" />, glow: 'glow-blue' },
          { label: 'Wind / Solar Split', value: `${summaryStats.windShare} / ${summaryStats.solarShare}`, sub: 'by records', icon: <Wind className="w-5 h-5 text-purple-400" />, glow: 'glow-purple' },
        ].map((m, i) => (
          <div key={i} className={`glass-card metric-card p-5 ${m.glow} animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                <h3 className="text-xl md:text-2xl font-bold mt-1">{m.value}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.sub}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.05]">{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab selectedYear={selectedYear} />}
      {activeTab === 'analysis' && <AnalysisTab selectedSource={selectedSource} selectedSeason={selectedSeason} />}
      {activeTab === 'forecasting' && <ForecastingTab />}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-500 text-sm pb-6">
        <p>Built by <a href="https://www.linkedin.com/in/sajjad-ali-shah47/" className="text-blue-400 hover:text-blue-300 underline" target="_blank">Sajjad Ali Shah</a> — Wind & Solar Energy Production Dashboard</p>
      </footer>
    </div>
  );
}

/* ═══════════ OVERVIEW TAB ═══════════ */
function OverviewTab({ selectedYear }: { selectedYear: string }) {
  const filteredYearly = useMemo(() => {
    if (selectedYear === 'all') return yearlyAvg;
    return yearlyAvg.filter(y => y.year === selectedYear);
  }, [selectedYear]);

  return (
    <div className="space-y-6">
      {/* Monthly Trend + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Average Monthly Production Pattern
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAvg}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="production" name="Avg Production" stroke="#3b82f6" strokeWidth={2.5} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4 overflow-auto max-h-[440px]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Key Insights
          </h2>
          {keyInsights.map((insight, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] transition-all">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span style={{ color: insight.color }}>{iconMap[insight.icon]}</span>
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
                <span className={`impact-badge ${impactColors[insight.impact]}`}>{insight.impact}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Growth + Source Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Yearly Average Production {selectedYear !== 'all' ? `(${selectedYear})` : '(2020-2025)'}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="production" name="Avg Production" radius={[8, 8, 0, 0]}>
                  {filteredYearly.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Notable 27.5% jump between 2022 → 2023 suggests new capacity installations
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Energy Source Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceStats}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  dataKey="share"
                  nameKey="source"
                  label={({ source, share }: any) => `${source}: ${share}%`}
                  labelLine={true}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={2}
                >
                  {sourceStats.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300"><span className="font-bold text-blue-400">Wind</span> — {sourceStats[0].records.toLocaleString()} records</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300"><span className="font-bold text-amber-400">Solar</span> — {sourceStats[1].records.toLocaleString()} records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day of Week */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          Average Production by Day of Week
        </h2>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[5800, 6400]} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="production" name="Avg Production" radius={[8, 8, 0, 0]}>
                {dayOfWeek.map((_, i) => (
                  <Cell key={i} fill={i >= 5 ? '#22d3ee' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Near-uniform production across all days — energy output is weather-driven, not schedule-driven
        </p>
      </div>
    </div>
  );
}

/* ═══════════ ANALYSIS TAB ═══════════ */
function AnalysisTab({ selectedSource, selectedSeason }: { selectedSource: string; selectedSeason: string }) {
  const filteredHourly = useMemo(() => {
    if (selectedSource === 'all') return hourlyAvg.map(h => ({ ...h, display: h.production }));
    const key = selectedSource.toLowerCase() as 'wind' | 'solar';
    return hourlyAvg.map(h => ({ ...h, display: h[key] }));
  }, [selectedSource]);

  const filteredSeasonal = useMemo(() => {
    if (selectedSeason === 'all') return seasonalStats;
    return seasonalStats.filter(s => s.season === selectedSeason);
  }, [selectedSeason]);

  return (
    <div className="space-y-6">
      {/* Hourly Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Hourly Production: Wind vs Solar
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyAvg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="wind" name="Wind" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="solar" name="Solar" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Solar follows a bell curve peaking at 13:00 · Wind stays relatively flat across hours
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Overall Hourly Pattern {selectedSource !== 'all' ? `(${selectedSource})` : ''}
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredHourly}>
                <defs>
                  <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="display" name="Avg Production" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#hourlyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal + Source Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            Seasonal Production {selectedSeason !== 'all' ? `(${selectedSeason})` : ''}
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSeasonal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="season" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mean" name="Mean Production" radius={[8, 8, 0, 0]}>
                  {filteredSeasonal.map((s, i) => (
                    <Cell key={i} fill={SEASON_COLORS[s.season] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Winter leads at 7,342 MWh avg — 49% higher than Summer (4,911 MWh)
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-400" />
            Source Production Comparison
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { metric: 'Mean (K)', Wind: 6.3, Solar: 5.8 },
                { metric: 'Std Dev (K)', Wind: 4.2, Solar: 2.4 },
                { metric: 'Records (K)', Wind: 42.5, Solar: 9.4 },
                { metric: 'Total (M)', Wind: 268, Solar: 54 },
                { metric: 'CV %', Wind: 67, Solar: 42 },
              ]} outerRadius="70%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar name="Wind" dataKey="Wind" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Radar name="Solar" dataKey="Solar" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* YoY + Monthly Wind vs Solar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            Year-over-Year Monthly Comparison
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yoyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {years.map((yr, i) => (
                  <Line key={yr} type="monotone" dataKey={String(yr)} name={String(yr)}
                    stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 2.5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            2023+ consistently outperforms prior years across all months
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            Monthly Production: Wind vs Solar
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAvg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="wind" name="Wind" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="solar" name="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Wind peaks in winter (Feb/Dec) · Solar is steadier but peaks slightly in summer
          </p>
        </div>
      </div>

      {/* Variability Analysis */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Seasonal Variability (Coefficient of Variation %)
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[50, 70]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="season" tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="cv" name="CV %" radius={[0, 8, 8, 0]}>
                {seasonalStats.map((s, i) => (
                  <Cell key={i} fill={SEASON_COLORS[s.season]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          All seasons show similar CV (~58-66%) — variability is inherent to renewable energy, not season-specific
        </p>
      </div>
    </div>
  );
}

/* ═══════════ FORECASTING TAB ═══════════ */
function ForecastingTab() {
  const bestModel = modelComparison[modelComparison.length - 1];

  return (
    <div className="space-y-6">
      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelComparison.map((m, i) => (
          <div key={i} className={`glass-card p-5 ${i === modelComparison.length - 1 ? 'ring-2 ring-green-500/50 glow-blue' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{m.model}</p>
              {i === modelComparison.length - 1 && (
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> BEST
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold" style={{ color: CHART_COLORS[i] }}>{m.RMSE.toLocaleString()}</p>
                <p className="text-xs text-slate-500">RMSE</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-300">{m.MAE.toLocaleString()}</p>
                <p className="text-xs text-slate-500">MAE</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-white/[0.05] pt-3">{m.description}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            RMSE Comparison (Lower = Better)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => v.toLocaleString()} />
                <Bar dataKey="RMSE" name="RMSE" radius={[8, 8, 0, 0]}>
                  {modelComparison.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            RMSE vs MAE Comparison
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => v.toLocaleString()} />
                <Legend />
                <Bar dataKey="RMSE" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAE" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Summary Panel */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Model Summary & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-green-400">Best Model</h3>
            <p className="text-2xl font-bold">{bestModel.model}</p>
            <p className="text-xs text-slate-400">Deep learning with 2-layer LSTM (64 units each). Captures non-linear temporal dependencies in energy production data.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-400">Training Details</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• {summaryStats.days.toLocaleString()} days of daily data</li>
              <li>• 60-day test period</li>
              <li>• 60-step lookback window</li>
              <li>• 15 epochs, batch size 32</li>
              <li>• Adam optimizer, MSE loss</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-purple-400">Recommendations</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Use <strong>Prophet</strong> for interpretable forecasts</li>
              <li>• Use <strong>LSTM</strong> for highest accuracy</li>
              <li>• Consider ensemble of both</li>
              <li>• Add weather data for improvement</li>
              <li>• Retrain monthly for best results</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Improvement Visualization */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Model Accuracy Improvement
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { metric: 'RMSE Reduction', 'ARIMA→Prophet': 36, 'Prophet→LSTM': 15 },
              { metric: 'MAE Reduction', 'ARIMA→Prophet': 39, 'Prophet→LSTM': 19 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} domain={[0, 50]} />
              <YAxis type="category" dataKey="metric" tick={{ fontSize: 12, fill: '#94a3b8' }} width={120} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Legend />
              <Bar dataKey="ARIMA→Prophet" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Prophet→LSTM" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Prophet reduces ARIMA error by 36% · LSTM further reduces Prophet error by 15% · Total ARIMA→LSTM improvement: 46%
        </p>
      </div>
    </div>
  );
}
