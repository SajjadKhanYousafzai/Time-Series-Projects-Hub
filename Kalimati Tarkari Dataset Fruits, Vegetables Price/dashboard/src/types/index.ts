export interface ForecastData {
  commodity: string
  currentPrice: number
  forecastPrice: number
  priceChange: number
  confidence: number
  historical: DataPoint[]
  forecast: DataPoint[]
  confidenceInterval?: {
    lower: DataPoint[]
    upper: DataPoint[]
  }
}

export interface DataPoint {
  date: string
  value: number
}

export interface ModelMetrics {
  model: string
  mae: number
  rmse: number
  mape: number
  mase: number
  r2: number
}

export interface Commodity {
  name: string
  category: string
  unit: string
  avgPrice: number
}

export interface StatsCardData {
  label: string
  value: string | number
  change?: number
  icon: string
}
