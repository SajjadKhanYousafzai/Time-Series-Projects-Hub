'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  ShoppingCart, Tag, Calendar, DollarSign, Fuel, AlertTriangle,
  TrendingUp, Store, Award, BarChart3, Activity, Layers, Filter, X, ChevronDown,
} from 'lucide-react';
import {
  monthlySales, monthlySalesByYear, topFamilies, dayOfWeekSales, promoImpact,
  storeTypeSales, modelComparison, monthlyPattern, oilVsSales,
  keyInsights, summaryStats, years, storeTypes, families, cities,
} from './data';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Tag: <Tag className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Fuel: <Fuel className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
};

const impactColors: Record<string, string> = {
  'Very High': 'bg-rose-500/20 text-rose-400',
  'Medium': 'bg-amber-500/20 text-amber-400',
  'Low': 'bg-sky-500/20 text-sky-400',
  'Event': 'bg-purple-500/20 text-purple-400',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="text-slate-300 mb-1 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

type TabKey = 'overview' | 'analysis' | 'models';

/* ===== FILTER BAR COMPONENT ===== */
function FilterBar({
  selectedYear, setSelectedYear,
  selectedStoreType, setSelectedStoreType,
  selectedFamily, setSelectedFamily,
  selectedCity, setSelectedCity,
}: {
  selectedYear: string; setSelectedYear: (v: string) => void;
  selectedStoreType: string; setSelectedStoreType: (v: string) => void;
  selectedFamily: string; setSelectedFamily: (v: string) => void;
  selectedCity: string; setSelectedCity: (v: string) => void;
}) {
  const hasFilters = selectedYear !== 'all' || selectedStoreType !== 'all' || selectedFamily !== 'all' || selectedCity !== 'all';

  const clearAll = () => {
    setSelectedYear('all');
    setSelectedStoreType('all');
    setSelectedFamily('all');
    setSelectedCity('all');
  };

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <FilterSelect label="Year" value={selectedYear} onChange={setSelectedYear}
          options={[{ value: 'all', label: 'All Years' }, ...years.map(y => ({ value: String(y), label: String(y) }))]} />
        <FilterSelect label="Store Type" value={selectedStoreType} onChange={setSelectedStoreType}
          options={[{ value: 'all', label: 'All Types' }, ...storeTypes.map(t => ({ value: t, label: `Type ${t}` }))]} />
        <FilterSelect label="Product Family" value={selectedFamily} onChange={setSelectedFamily}
          options={[{ value: 'all', label: 'All Families' }, ...families.map(f => ({ value: f, label: f }))]} />
        <FilterSelect label="City" value={selectedCity} onChange={setSelectedCity}
          options={[{ value: 'all', label: 'All Cities' }, ...cities.map(c => ({ value: c, label: c }))]} />
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

/* ===== MAIN PAGE ===== */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Filter state
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStoreType, setSelectedStoreType] = useState('all');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  // Filtered monthly sales
  const filteredMonthlySales = useMemo(() => {
    if (selectedYear === 'all') return monthlySales;
    const yr = parseInt(selectedYear);
    return monthlySalesByYear[yr] || [];
  }, [selectedYear]);

  // Active filter count
  const activeFilters = [selectedYear, selectedStoreType, selectedFamily, selectedCity].filter(v => v !== 'all').length;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { key: 'analysis', label: 'Deep Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'models', label: 'Model Performance', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Store className="w-9 h-9 text-blue-500" />
            <span className="gradient-text">Store Sales Forecasting</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Time series analysis &amp; forecasting of 3M+ records across 54 Favorita stores in Ecuador
          </p>
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
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
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
        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
        selectedStoreType={selectedStoreType} setSelectedStoreType={setSelectedStoreType}
        selectedFamily={selectedFamily} setSelectedFamily={setSelectedFamily}
        selectedCity={selectedCity} setSelectedCity={setSelectedCity}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Records', value: summaryStats.totalRecords, icon: <BarChart3 className="w-5 h-5 text-blue-400" /> },
          { label: 'Stores', value: summaryStats.stores, icon: <Store className="w-5 h-5 text-green-400" /> },
          { label: 'Product Families', value: summaryStats.families, icon: <ShoppingCart className="w-5 h-5 text-purple-400" /> },
          { label: 'Features Built', value: summaryStats.features, icon: <Layers className="w-5 h-5 text-amber-400" /> },
        ].map((m, i) => (
          <div key={i} className="glass-card metric-card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                <h3 className="text-2xl font-bold mt-1">{m.value}</h3>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.05]">{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab filteredMonthlySales={filteredMonthlySales} selectedYear={selectedYear} selectedFamily={selectedFamily} />}
      {activeTab === 'analysis' && <AnalysisTab selectedStoreType={selectedStoreType} />}
      {activeTab === 'models' && <ModelsTab />}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-500 text-sm pb-6">
        <p>Built by <a href="https://www.linkedin.com/in/sajjad-ali-shah47/" className="text-blue-400 hover:text-blue-300 underline" target="_blank">Sajjad Ali Shah</a> — Store Sales Time Series Forecasting</p>
      </footer>
    </div>
  );
}

/* ===== OVERVIEW TAB ===== */
function OverviewTab({ filteredMonthlySales, selectedYear, selectedFamily }: {
  filteredMonthlySales: { month: string; sales: number }[];
  selectedYear: string;
  selectedFamily: string;
}) {
  const filteredFamilies = useMemo(() => {
    if (selectedFamily === 'all') return topFamilies;
    return topFamilies.filter(f => f.family === selectedFamily);
  }, [selectedFamily]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Monthly Sales Trend {selectedYear !== 'all' ? `(${selectedYear})` : '(2013–2017)'}
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredMonthlySales}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={selectedYear !== 'all' ? 0 : 5} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="url(#salesGrad)" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            {selectedFamily !== 'all' ? `Sales: ${selectedFamily}` : 'Top 10 Product Families'}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredFamilies} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                <YAxis type="category" dataKey="family" tick={{ fontSize: 10, fill: '#94a3b8' }} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                  {filteredFamilies.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            Sales by Day of Week
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {dayOfWeekSales.map((_, i) => (
                    <Cell key={i} fill={i === 6 ? '#10b981' : i >= 5 ? '#22d3ee' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== ANALYSIS TAB ===== */
function AnalysisTab({ selectedStoreType }: { selectedStoreType: string }) {
  const filteredStoreTypes = useMemo(() => {
    if (selectedStoreType === 'all') return storeTypeSales;
    return storeTypeSales.filter(s => s.type === `Type ${selectedStoreType}`);
  }, [selectedStoreType]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-green-400" />
            Promotion Impact on Sales
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promoImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgSales" name="Avg Sales" radius={[8, 8, 0, 0]}>
                  <Cell fill="#64748b" />
                  <Cell fill="#10b981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Items on promotion sell ~3x more on average — promotions are highly effective!
          </p>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" />
            {selectedStoreType !== 'all' ? `Store Type ${selectedStoreType}` : 'Average Sales by Store Type'}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedStoreType === 'all' ? (
                <RadarChart data={storeTypeSales} outerRadius="70%">
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="type" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Radar name="Avg Sales" dataKey="avgSales" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              ) : (
                <BarChart data={filteredStoreTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgSales" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Fuel className="w-5 h-5 text-rose-400" />
            Oil Price vs Sales Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oilVsSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="oil" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Oil ($)" />
                <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Sales (K)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Monthly Sales Pattern (Avg)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPattern}>
                <defs>
                  <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} fill="url(#monthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== MODELS TAB ===== */
function ModelsTab() {
  const bestModel = modelComparison[modelComparison.length - 1];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modelComparison.map((m, i) => (
          <div key={i} className={`glass-card p-5 ${i === modelComparison.length - 1 ? 'ring-2 ring-green-500/50' : ''}`}>
            <p className="text-xs text-slate-400">{m.model}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: CHART_COLORS[i] }}>{m.RMSLE.toFixed(4)}</p>
            <p className="text-xs text-slate-500 mt-1">RMSLE</p>
            {i === modelComparison.length - 1 && (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block font-semibold">BEST</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card chart-container">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            RMSLE Comparison (Lower = Better)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="model" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="RMSLE" radius={[8, 8, 0, 0]}>
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
            All Metrics Comparison
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="model" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="RMSE" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAE" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Model Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-400">Best Model</h3>
            <p className="text-2xl font-bold">{bestModel.model}</p>
            <p className="text-xs text-slate-400">Gradient boosting handles large datasets efficiently and captures non-linear patterns.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-green-400">Training Details</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• {summaryStats.totalRecords} training records</li>
              <li>• {summaryStats.features} engineered features</li>
              <li>• Time-based train/val split</li>
              <li>• Period: {summaryStats.trainPeriod}</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-purple-400">Top Features</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• sales_lag_7 (weekly lag)</li>
              <li>• sales_roll_mean_7 (7-day avg)</li>
              <li>• onpromotion (promo status)</li>
              <li>• day_of_week</li>
              <li>• family_encoded</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
