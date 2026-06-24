export interface HealthResponse {
  status: string;
  version: string;
  records: number;
}

export interface EmploymentPoint {
  date: string;
  employees: number;
}

export interface HistoricalResponse {
  series: EmploymentPoint[];
  total_records: number;
  start_date: string;
  end_date: string;
  min_employees: number;
  max_employees: number;
  mean_employees: number;
}

export interface ForecastRequest {
  model: string;
  horizon: number;
  confidence: number;
}

export interface ForecastPoint {
  date: string;
  forecast: number;
  lower: number | null;
  upper: number | null;
}

export interface ForecastResponse {
  model: string;
  horizon: number;
  confidence: number;
  forecast: ForecastPoint[];
  mae: number | null;
  rmse: number | null;
  mape: number | null;
}

export interface DecompositionPoint {
  date: string;
  observed: number;
  trend: number | null;
  seasonal: number;
  residual: number | null;
}

export interface DecompositionResponse {
  model: string;
  period: number;
  components: DecompositionPoint[];
}

export interface StationarityResponse {
  adf_statistic: number;
  adf_p_value: number;
  adf_is_stationary: boolean;
  kpss_statistic: number;
  kpss_p_value: number;
  kpss_is_stationary: boolean;
  interpretation: string;
}
