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
  yoyComparison, years, sources, seasons, seasonMonths,
} from './data';

/* ═══════════ CONSTANTS ═══════════ */
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

/* ═══════════ HELPERS ═══════════ */
/** Get the production value based on source filter */
function getSourceValue(row: { production: number; wind: number; solar: number }, source: string): number {
  if (source === 'Wind') return row.wind;
  if (source === 'Solar') return row.solar;
  return row.production;
}

/** Get label for current source */
function sourceLabel(source: string): string {
  if (source === 'all') return 'All Sources';
  return source;
}

/** Build active filter description chips */
function activeFilterDesc(source: string, season: string, year: string): string[] {
  const parts: string[] = [];
  if (source !== 'all') parts.push(`Source: ${source}`);
  if (season !== 'all') parts.push(`Season: ${season}`);
  if (year !== 'all') parts.push(`Year: ${year}`);
  return parts;
}

/* ═══════════ TOOLTIP ═══════════ */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="p-3 text-sm rounded-lg" style={{ background: 'rgba(10, 14, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
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

/* ═══════════ FILTER BADGE ═══════════ */
function FilterBadges({ filters }: { filters: string[] }) {
  if (filters.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {filters.map((f) => (
        <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
          <Filter className="w-2.5 h-2.5" /> {f}
        </span>
      ))}
    </div>
  );
}

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

  const activeFilterCount = [selectedSource, selectedSeason, selectedYear].filter(v => v !== 'all').length;
  const filterLabels = activeFilterDesc(selectedSource, selectedSeason, selectedYear);

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
              <span className="gradient-text">Wind &amp; Solar Energy</span>
              <span className="text-slate-400 font-normal text-lg md:text-xl ml-3">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Interactive EDA &amp; Forecasting — {summaryStats.totalRecords} hourly records · {summaryStats.dateRange}
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
        {activeFilterCount > 0 && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-semibold ml-auto">
            <Filter className="w-3 h-3" /> {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
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
      <KPICards selectedSource={selectedSource} selectedSeason={selectedSeason} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab source={selectedSource} season={selectedSeason} year={selectedYear} filterLabels={filterLabels} />
      )}
      {activeTab === 'analysis' && (
        <AnalysisTab source={selectedSource} season={selectedSeason} year={selectedYear} filterLabels={filterLabels} />
      )}
      {activeTab === 'forecasting' && <ForecastingTab />}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-500 text-sm pb-6">
        <p>Built by <a href="https://www.linkedin.com/in/sajjad-ali-shah47/" className="text-blue-400 hover:text-blue-300 underline" target="_blank">Sajjad Ali Shah</a> — Wind &amp; Solar Energy Production Dashboard</p>
      </footer>
    </div>
  );
}

/* ═══════════ KPI CARDS ═══════════ */
function KPICards({ selectedSource, selectedSeason }: { selectedSource: string; selectedSeason: string }) {
  const kpiData = useMemo(() => {
    // Get source-specific info
    if (selectedSource === 'all') {
      const seasonInfo = selectedSeason !== 'all'
        ? seasonalStats.find(s => s.season === selectedSeason)
        : null;
      return {
        total: summaryStats.totalProduction,
        avg: seasonInfo ? `${seasonInfo.mean.toLocaleString()} MWh` : summaryStats.avgDaily,
        peak: seasonInfo ? seasonInfo.season : summaryStats.peakSeason,
        split: `${summaryStats.windShare} / ${summaryStats.solarShare}`,
        subTotal: selectedSeason !== 'all' ? `${selectedSeason} season` : '2020-2025',
        subAvg: selectedSeason !== 'all' ? `avg in ${selectedSeason}` : 'per day',
      };
    }
    const src = sourceStats.find(s => s.source === selectedSource)!;
    const seasonInfo = selectedSeason !== 'all'
      ? seasonalStats.find(s => s.season === selectedSeason)
      : null;
    const avgVal = seasonInfo
      ? getSourceValue({ production: seasonInfo.mean, wind: seasonInfo.wind, solar: seasonInfo.solar }, selectedSource)
      : src.mean;
    return {
      total: `${(src.totalMWh / 1e6).toFixed(0)}M MWh`,
      avg: `${avgVal.toLocaleString()} MWh`,
      peak: seasonInfo ? seasonInfo.season : summaryStats.peakSeason,
      split: `${src.share}% of total`,
      subTotal: `${selectedSource} only`,
      subAvg: selectedSeason !== 'all' ? `avg ${selectedSource} in ${selectedSeason}` : 'per record',
    };
  }, [selectedSource, selectedSeason]);

  const cards = [
    { label: 'Total Production', value: kpiData.total, sub: kpiData.subTotal, icon: <Zap className="w-5 h-5 text-amber-400" />, glow: 'glow-amber' },
    { label: 'Average Output', value: kpiData.avg, sub: kpiData.subAvg, icon: <Activity className="w-5 h-5 text-blue-400" />, glow: 'glow-blue' },
    { label: 'Peak Season', value: kpiData.peak, sub: `${summaryStats.peakMonth} at ${summaryStats.peakHour}`, icon: <Snowflake className="w-5 h-5 text-cyan-400" />, glow: 'glow-blue' },
    { label: selectedSource === 'all' ? 'Wind / Solar Split' : 'Source Share', value: kpiData.split, sub: 'by records', icon: <Wind className="w-5 h-5 text-purple-400" />, glow: 'glow-purple' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((m, i) => (
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
  );
}

/* ═══════════ OVERVIEW TAB ═══════════ */
function OverviewTab({ source, season, year, filterLabels }: { source: string; season: string; year: string; filterLabels: string[] }) {
  // Monthly chart — filters by source AND season
  const monthlyData = useMemo(() => {
    let data = monthlyAvg.map(m => ({
      month: m.month,
      value: getSourceValue(m, source),
    }));
    // If season selected, only show months in that season
    if (season !== 'all') {
      const months = seasonMonths[season];
      data = data.filter(d => months.includes(d.month));
    }
    return data;
  }, [source, season]);

  // Yearly chart — filters by year AND source
  const yearlyData = useMemo(() => {
    let data = yearlyAvg.map(y => ({
      year: y.year,
      value: getSourceValue(y, source),
    }));
    if (year !== 'all') {
      data = data.filter(d => d.year === year);
    }
    return data;
  }, [source, year]);

  // Pie chart — filters by source
  const pieData = useMemo(() => {
    if (source === 'all') return sourceStats;
    return sourceStats.filter(s => s.source === source);
  }, [source]);

  // Day of week — filters by source
  const dowData = useMemo(() => {
    return dayOfWeek.map(d => ({
      day: d.day,
      value: getSourceValue(d, source),
    }));
  }, [source]);

  const chartColor = source === 'Wind' ? '#3b82f6' : source === 'Solar' ? '#f59e0b' : '#3b82f6';

  return (
    <div className="space-y-6">
      {/* Monthly Trend + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Monthly Production — {sourceLabel(source)}{season !== 'all' ? ` · ${season}` : ''}
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source') || f.startsWith('Season'))} />
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name={sourceLabel(source)} stroke={chartColor} strokeWidth={2.5} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {season !== 'all' && (
            <p className="text-xs text-blue-400/70 mt-2 text-center">
              Showing only {season} months: {seasonMonths[season].join(', ')}
            </p>
          )}
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
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${impactColors[insight.impact]}`}>{insight.impact}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Growth + Source Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Yearly Average — {sourceLabel(source)}
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source') || f.startsWith('Year'))} />
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name={sourceLabel(source)} radius={[8, 8, 0, 0]}>
                  {yearlyData.map((_, i) => (
                    <Cell key={i} fill={source !== 'all' ? chartColor : CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            {year !== 'all'
              ? `Showing ${year}: ${yearlyData[0]?.value.toLocaleString()} MWh average`
              : 'Notable 27.5% jump between 2022 → 2023 suggests new capacity'
            }
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Energy Source Distribution
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source'))} />
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  dataKey="share"
                  nameKey="source"
                  label={({ source: s, share }: any) => `${s}: ${share}%`}
                  labelLine={true}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={2}
                >
                  {pieData.map((s, i) => (
                    <Cell key={i} fill={s.source === 'Wind' ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map(src => (
              <div key={src.source} className="flex items-center gap-2 text-sm">
                {src.source === 'Wind' ? <Wind className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span className="text-slate-300">
                  <span className={`font-bold ${src.source === 'Wind' ? 'text-blue-400' : 'text-amber-400'}`}>{src.source}</span> — {src.records.toLocaleString()} records
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day of Week */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          Daily Production — {sourceLabel(source)}
        </h2>
        <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source'))} />
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name={sourceLabel(source)} radius={[8, 8, 0, 0]}>
                {dowData.map((_, i) => (
                  <Cell key={i} fill={i >= 5 ? '#22d3ee' : chartColor} />
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
function AnalysisTab({ source, season, year, filterLabels }: { source: string; season: string; year: string; filterLabels: string[] }) {
  // Hourly — filtered by source
  const filteredHourly = useMemo(() => {
    return hourlyAvg.map(h => ({
      ...h,
      display: getSourceValue(h, source),
    }));
  }, [source]);

  // Seasonal — filtered by season AND source
  const filteredSeasonal = useMemo(() => {
    let data = seasonalStats.map(s => ({
      season: s.season,
      value: getSourceValue({ production: s.mean, wind: s.wind, solar: s.solar }, source),
      cv: s.cv,
      std: s.std,
      mean: s.mean,
    }));
    if (season !== 'all') {
      data = data.filter(d => d.season === season);
    }
    return data;
  }, [source, season]);

  // YoY — filtered by year
  const displayedYears = useMemo(() => {
    if (year === 'all') return years;
    return [Number(year)];
  }, [year]);

  // Monthly Wind vs Solar — filtered by source AND season
  const filteredMonthlyVs = useMemo(() => {
    let data = monthlyAvg;
    if (season !== 'all') {
      const months = seasonMonths[season];
      data = data.filter(d => months.includes(d.month));
    }
    return data;
  }, [season]);

  const chartColor = source === 'Wind' ? '#3b82f6' : source === 'Solar' ? '#f59e0b' : '#8b5cf6';

  return (
    <div className="space-y-6">
      {/* Hourly Wind vs Solar + Filtered Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Hourly: Wind vs Solar
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
            Solar bell curve peaks at 13:00 · Wind stays flat ~5,000-5,600 MWh
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Hourly Pattern — {sourceLabel(source)}
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source'))} />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredHourly}>
                <defs>
                  <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="display" name={sourceLabel(source)} stroke={chartColor} strokeWidth={2.5} fill="url(#hourlyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {source === 'Solar' ? 'Solar output is zero at night, peaks at 11,800 MWh at 13:00'
              : source === 'Wind' ? 'Wind output stays stable ~5,000-5,600 MWh across all hours'
              : 'Select a source filter to see individual hourly patterns'
            }
          </p>
        </div>
      </div>

      {/* Seasonal + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            Seasonal Production — {sourceLabel(source)}
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source') || f.startsWith('Season'))} />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSeasonal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="season" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name={sourceLabel(source)} radius={[8, 8, 0, 0]}>
                  {filteredSeasonal.map((s, i) => (
                    <Cell key={i} fill={SEASON_COLORS[s.season] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {season !== 'all'
              ? `${season}: ${filteredSeasonal[0]?.value.toLocaleString()} MWh (${sourceLabel(source)})`
              : source === 'Solar'
              ? 'Solar peaks in Summer (5,960 MWh) — opposite of Wind'
              : 'Winter leads at 7,342 MWh avg — 49% above Summer'
            }
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-400" />
            Source Comparison Radar
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
                {(source === 'all' || source === 'Wind') && (
                  <Radar name="Wind" dataKey="Wind" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                )}
                {(source === 'all' || source === 'Solar') && (
                  <Radar name="Solar" dataKey="Solar" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                )}
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
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            Year-over-Year Comparison
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Year'))} />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yoyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {displayedYears.map((yr, i) => (
                  <Line key={yr} type="monotone" dataKey={String(yr)} name={String(yr)}
                    stroke={CHART_COLORS[year === 'all' ? i : 0]}
                    strokeWidth={year === 'all' ? 2 : 3}
                    dot={{ r: year === 'all' ? 2.5 : 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {year !== 'all'
              ? `Showing ${year} monthly pattern — select "All Years" to compare`
              : '2023+ consistently outperforms prior years across all months'
            }
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            Monthly: Wind vs Solar{season !== 'all' ? ` · ${season}` : ''}
          </h2>
          <FilterBadges filters={filterLabels.filter(f => f.startsWith('Source') || f.startsWith('Season'))} />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMonthlyVs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {(source === 'all' || source === 'Wind') && (
                  <Bar dataKey="wind" name="Wind" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                )}
                {(source === 'all' || source === 'Solar') && (
                  <Bar dataKey="solar" name="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {source === 'Wind' ? 'Wind peaks in winter (Feb/Dec)'
              : source === 'Solar' ? 'Solar peaks slightly in summer (Jul/Aug)'
              : 'Wind dominates in winter, Solar steadier across months'
            }
            {season !== 'all' ? ` — showing ${season} months only` : ''}
          </p>
        </div>
      </div>

      {/* Variability */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Seasonal Variability (CV %)
        </h2>
        <FilterBadges filters={filterLabels.filter(f => f.startsWith('Season'))} />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredSeasonal} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[50, 70]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="season" tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="cv" name="CV %" radius={[0, 8, 8, 0]}>
                {filteredSeasonal.map((s, i) => (
                  <Cell key={i} fill={SEASON_COLORS[s.season]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          {season !== 'all'
            ? `${season}: CV = ${filteredSeasonal[0]?.cv}%`
            : 'All seasons ~58-66% CV — variability is inherent to renewables'
          }
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
            RMSE vs MAE
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

      {/* Summary Panel */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Model Summary &amp; Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-green-400">Best Model</h3>
            <p className="text-2xl font-bold">{bestModel.model}</p>
            <p className="text-xs text-slate-400">Deep learning with 2-layer LSTM (64 units). Captures non-linear temporal dependencies.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-400">Training Details</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• {summaryStats.days.toLocaleString()} days of data</li>
              <li>• 60-day test period</li>
              <li>• 60-step lookback window</li>
              <li>• 15 epochs, batch 32</li>
              <li>• Adam optimizer, MSE loss</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-purple-400">Recommendations</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• <strong>Prophet</strong> for interpretability</li>
              <li>• <strong>LSTM</strong> for best accuracy</li>
              <li>• Consider ensemble of both</li>
              <li>• Add weather data</li>
              <li>• Retrain monthly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Improvement Chart */}
      <div className="glass-card chart-container">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Model Accuracy Improvement
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { metric: 'RMSE Reduction', 'ARIMA to Prophet': 36, 'Prophet to LSTM': 15 },
              { metric: 'MAE Reduction', 'ARIMA to Prophet': 39, 'Prophet to LSTM': 19 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} domain={[0, 50]} />
              <YAxis type="category" dataKey="metric" tick={{ fontSize: 12, fill: '#94a3b8' }} width={120} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Legend />
              <Bar dataKey="ARIMA to Prophet" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Prophet to LSTM" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Prophet cuts ARIMA error by 36% · LSTM further reduces by 15% · Total: 46% improvement
        </p>
      </div>
    </div>
  );
}
