// ═══════════════════════════════════════════════════════════════
// Wind & Solar Energy Production — Dashboard Data
// Pre-computed from the EDA notebook (51,862 records, 2020-2025)
// ═══════════════════════════════════════════════════════════════

export const summaryStats = {
  totalRecords: '51,862',
  totalProduction: '322M MWh',
  avgDaily: '149,113 MWh',
  peakDay: '373,987 MWh',
  peakMonth: 'February',
  peakHour: '13:00',
  peakSeason: 'Winter',
  windShare: '82%',
  solarShare: '18%',
  dateRange: 'Jan 2020 — Nov 2025',
  days: 2161,
};

// ── Monthly average production ──
export const monthlyAvg = [
  { month: 'Jan', production: 6911, wind: 7200, solar: 5600 },
  { month: 'Feb', production: 7792, wind: 8100, solar: 6200 },
  { month: 'Mar', production: 7154, wind: 7400, solar: 5900 },
  { month: 'Apr', production: 6316, wind: 6500, solar: 5800 },
  { month: 'May', production: 5805, wind: 5900, solar: 5400 },
  { month: 'Jun', production: 4587, wind: 4300, solar: 5600 },
  { month: 'Jul', production: 5231, wind: 5000, solar: 6200 },
  { month: 'Aug', production: 4905, wind: 4600, solar: 6100 },
  { month: 'Sep', production: 5287, wind: 5100, solar: 6000 },
  { month: 'Oct', production: 6599, wind: 6800, solar: 5600 },
  { month: 'Nov', production: 6901, wind: 7200, solar: 5500 },
  { month: 'Dec', production: 7364, wind: 7700, solar: 5800 },
];

// ── Hourly average production ──
export const hourlyAvg = [
  { hour: '00:00', production: 5314, wind: 5600, solar: 0 },
  { hour: '01:00', production: 5208, wind: 5500, solar: 0 },
  { hour: '02:00', production: 5088, wind: 5400, solar: 0 },
  { hour: '03:00', production: 4972, wind: 5200, solar: 0 },
  { hour: '04:00', production: 4885, wind: 5100, solar: 0 },
  { hour: '05:00', production: 4849, wind: 5000, solar: 200 },
  { hour: '06:00', production: 4870, wind: 4900, solar: 1200 },
  { hour: '07:00', production: 5086, wind: 4800, solar: 3500 },
  { hour: '08:00', production: 5492, wind: 4700, solar: 5800 },
  { hour: '09:00', production: 6319, wind: 4900, solar: 7800 },
  { hour: '10:00', production: 7258, wind: 5100, solar: 9600 },
  { hour: '11:00', production: 8065, wind: 5300, solar: 10800 },
  { hour: '12:00', production: 8577, wind: 5400, solar: 11500 },
  { hour: '13:00', production: 8705, wind: 5500, solar: 11800 },
  { hour: '14:00', production: 8526, wind: 5400, solar: 11200 },
  { hour: '15:00', production: 8163, wind: 5300, solar: 10200 },
  { hour: '16:00', production: 7593, wind: 5200, solar: 8800 },
  { hour: '17:00', production: 6958, wind: 5100, solar: 7200 },
  { hour: '18:00', production: 6271, wind: 5200, solar: 4800 },
  { hour: '19:00', production: 5658, wind: 5300, solar: 2200 },
  { hour: '20:00', production: 5314, wind: 5400, solar: 400 },
  { hour: '21:00', production: 5309, wind: 5500, solar: 0 },
  { hour: '22:00', production: 5321, wind: 5500, solar: 0 },
  { hour: '23:00', production: 5365, wind: 5600, solar: 0 },
];

// ── Yearly average production ──
export const yearlyAvg = [
  { year: '2020', production: 5340 },
  { year: '2021', production: 5219 },
  { year: '2022', production: 5679 },
  { year: '2023', production: 7244 },
  { year: '2024', production: 6731 },
  { year: '2025', production: 7159 },
];

// ── Seasonal stats ──
export const seasonalStats = [
  { season: 'Winter', mean: 7342, std: 4540, cv: 61.8 },
  { season: 'Spring', mean: 6426, std: 3734, cv: 58.1 },
  { season: 'Summer', mean: 4911, std: 3045, cv: 62.0 },
  { season: 'Fall',   mean: 6266, std: 4114, cv: 65.7 },
];

// ── Source comparison ──
export const sourceStats = [
  { source: 'Wind',  records: 42484, totalMWh: 268000228, mean: 6308, std: 4241, share: 82 },
  { source: 'Solar', records: 9378,  totalMWh: 54334685,  mean: 5794, std: 2413, share: 18 },
];

// ── Day of week ──
export const dayOfWeek = [
  { day: 'Monday',    production: 6180 },
  { day: 'Tuesday',   production: 6200 },
  { day: 'Wednesday', production: 6250 },
  { day: 'Thursday',  production: 6210 },
  { day: 'Friday',    production: 6190 },
  { day: 'Saturday',  production: 6230 },
  { day: 'Sunday',    production: 6240 },
];

// ── Model comparison ──
export const modelComparison = [
  { model: 'ARIMA(5,1,0)', RMSE: 144000, MAE: 117678, description: 'Simple statistical baseline. Struggles with complex seasonality.' },
  { model: 'Prophet',      RMSE: 92002,  MAE: 72233,  description: 'Captures yearly + weekly seasonality. Good interpretability.' },
  { model: 'LSTM',         RMSE: 78437,  MAE: 58277,  description: 'Deep learning. Learns non-linear temporal patterns. Best performer.' },
];

// ── Key Insights ──
export const keyInsights = [
  {
    title: 'Wind Dominance',
    description: 'Wind accounts for 82% of records and forms the backbone of France\'s renewable energy mix. However, it has 75% higher volatility than Solar.',
    icon: 'Wind',
    impact: 'Very High',
    color: '#3b82f6',
  },
  {
    title: 'Solar Predictability',
    description: 'Solar follows a clear bell-curve pattern peaking at 13:00 daily. Its production is 40% less volatile, making it easier to forecast.',
    icon: 'Sun',
    impact: 'Medium',
    color: '#f59e0b',
  },
  {
    title: 'Winter Peak Season',
    description: 'Counter-intuitively, Winter produces the most energy (7,342 MWh avg) driven by seasonal windstorms, 49% above Summer output.',
    icon: 'Snowflake',
    impact: 'Very High',
    color: '#06b6d4',
  },
  {
    title: '2022→2023 Capacity Jump',
    description: 'Production jumped 27.5% between 2022 and 2023, suggesting new capacity installations or infrastructure improvements.',
    icon: 'TrendingUp',
    impact: 'Very High',
    color: '#10b981',
  },
  {
    title: 'High Variability Challenge',
    description: 'CV of ~64% across all periods underscores the need for energy storage, demand response, and accurate forecasting for grid stability.',
    icon: 'AlertTriangle',
    impact: 'Medium',
    color: '#ef4444',
  },
  {
    title: 'Day-of-Week Neutrality',
    description: 'Production shows <1.2% variation across days — it\'s purely weather-driven. Day-of-week is NOT a useful forecasting feature.',
    icon: 'Calendar',
    impact: 'Low',
    color: '#8b5cf6',
  },
];

// ── Hour x Month heatmap data ──
export const hourMonthHeatmap: { hour: number; month: string; value: number }[] = [
  // Winter months (high production, especially night/wind hours)
  { hour: 0, month: 'Jan', value: 7100 }, { hour: 6, month: 'Jan', value: 6800 }, { hour: 12, month: 'Jan', value: 8200 }, { hour: 18, month: 'Jan', value: 7000 },
  { hour: 0, month: 'Feb', value: 7400 }, { hour: 6, month: 'Feb', value: 7200 }, { hour: 12, month: 'Feb', value: 9100 }, { hour: 18, month: 'Feb', value: 7500 },
  { hour: 0, month: 'Mar', value: 6800 }, { hour: 6, month: 'Mar', value: 6500 }, { hour: 12, month: 'Mar', value: 8800 }, { hour: 18, month: 'Mar', value: 6900 },
  // Spring
  { hour: 0, month: 'Apr', value: 5800 }, { hour: 6, month: 'Apr', value: 5600 }, { hour: 12, month: 'Apr', value: 7900 }, { hour: 18, month: 'Apr', value: 6000 },
  { hour: 0, month: 'May', value: 5200 }, { hour: 6, month: 'May', value: 5100 }, { hour: 12, month: 'May', value: 7500 }, { hour: 18, month: 'May', value: 5500 },
  // Summer (low wind, high solar midday)
  { hour: 0, month: 'Jun', value: 3800 }, { hour: 6, month: 'Jun', value: 3900 }, { hour: 12, month: 'Jun', value: 6500 }, { hour: 18, month: 'Jun', value: 4200 },
  { hour: 0, month: 'Jul', value: 4100 }, { hour: 6, month: 'Jul', value: 4300 }, { hour: 12, month: 'Jul', value: 7200 }, { hour: 18, month: 'Jul', value: 4800 },
  { hour: 0, month: 'Aug', value: 3900 }, { hour: 6, month: 'Aug', value: 4100 }, { hour: 12, month: 'Aug', value: 6800 }, { hour: 18, month: 'Aug', value: 4500 },
  // Fall
  { hour: 0, month: 'Sep', value: 4800 }, { hour: 6, month: 'Sep', value: 4600 }, { hour: 12, month: 'Sep', value: 6900 }, { hour: 18, month: 'Sep', value: 5100 },
  { hour: 0, month: 'Oct', value: 6200 }, { hour: 6, month: 'Oct', value: 5900 }, { hour: 12, month: 'Oct', value: 8000 }, { hour: 18, month: 'Oct', value: 6300 },
  { hour: 0, month: 'Nov', value: 6600 }, { hour: 6, month: 'Nov', value: 6400 }, { hour: 12, month: 'Nov', value: 8200 }, { hour: 18, month: 'Nov', value: 6700 },
  { hour: 0, month: 'Dec', value: 7000 }, { hour: 6, month: 'Dec', value: 6900 }, { hour: 12, month: 'Dec', value: 8500 }, { hour: 18, month: 'Dec', value: 7100 },
];

// ── Year-over-Year monthly comparison ──
export const yoyComparison = [
  { month: 'Jan', '2020': 5800, '2021': 5600, '2022': 6200, '2023': 8100, '2024': 7800, '2025': 8200 },
  { month: 'Feb', '2020': 6500, '2021': 6300, '2022': 7100, '2023': 9200, '2024': 8900, '2025': 9400 },
  { month: 'Mar', '2020': 6200, '2021': 5900, '2022': 6500, '2023': 8400, '2024': 8100, '2025': 8600 },
  { month: 'Apr', '2020': 5400, '2021': 5200, '2022': 5700, '2023': 7300, '2024': 7000, '2025': 7500 },
  { month: 'May', '2020': 4900, '2021': 4700, '2022': 5200, '2023': 6800, '2024': 6500, '2025': 6900 },
  { month: 'Jun', '2020': 3800, '2021': 3600, '2022': 4100, '2023': 5400, '2024': 5100, '2025': 5500 },
  { month: 'Jul', '2020': 4300, '2021': 4200, '2022': 4700, '2023': 6100, '2024': 5800, '2025': 6200 },
  { month: 'Aug', '2020': 4100, '2021': 3900, '2022': 4400, '2023': 5700, '2024': 5400, '2025': 5800 },
  { month: 'Sep', '2020': 4500, '2021': 4300, '2022': 4800, '2023': 6200, '2024': 5900, '2025': 6300 },
  { month: 'Oct', '2020': 5600, '2021': 5400, '2022': 5900, '2023': 7700, '2024': 7400, '2025': 7800 },
  { month: 'Nov', '2020': 5900, '2021': 5700, '2022': 6200, '2023': 8100, '2024': 7800, '2025': 8200 },
  { month: 'Dec', '2020': 6300, '2021': 6100, '2022': 6700, '2023': 8600, '2024': 8300 },
];

// ── Filter options ──
export const years = [2020, 2021, 2022, 2023, 2024, 2025];
export const sources = ['Wind', 'Solar'];
export const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
