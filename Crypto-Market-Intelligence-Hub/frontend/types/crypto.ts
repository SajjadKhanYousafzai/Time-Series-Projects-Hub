/** TypeScript interfaces for crypto market data. */

export interface OHLCVRecord {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  asset: string;
}

export interface HistoricalResponse {
  asset: string;
  currency: string;
  records: OHLCVRecord[];
  total: number;
  start_date?: string;
  end_date?: string;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lower?: number;
  upper?: number;
}

export interface PredictionResponse {
  asset: string;
  model: "arima" | "prophet" | "lstm" | "gru";
  horizon: number;
  current_price?: number;
  forecast: ForecastPoint[];
  metrics?: {
    mae: number;
    rmse: number;
    mape: number;
    r2: number;
  };
  generated_at: string;
}

export interface AssetInfo {
  id: string;
  name: string;
  symbol: string;
  currentPrice?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
}

export type ModelType = "prophet" | "arima" | "lstm" | "gru";

export interface MarketStats {
  totalAssets: number;
  totalRecords: number;
  dateRange: string;
  avgCorrelation: number;
}
