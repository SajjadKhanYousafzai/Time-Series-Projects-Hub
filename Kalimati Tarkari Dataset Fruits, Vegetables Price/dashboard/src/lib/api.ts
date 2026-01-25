import axios from 'axios'
import type { ForecastData, ModelMetrics } from '@/types'

// API base URL - update with your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Fetch forecast data for a specific commodity and model
 */
export async function fetchForecastData(
  commodity: string,
  model: string = 'XGBoost'
): Promise<ForecastData> {
  try {
    const response = await axios.get<ForecastData>(
      `${API_BASE_URL}/forecast`,
      {
        params: { commodity, model },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching forecast data:', error)
    // Return mock data for development
    return getMockForecastData(commodity, model)
  }
}

/**
 * Fetch model performance metrics for a commodity
 */
export async function fetchModelMetrics(commodity: string): Promise<ModelMetrics[]> {
  try {
    const response = await axios.get<ModelMetrics[]>(
      `${API_BASE_URL}/metrics`,
      {
        params: { commodity },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching model metrics:', error)
    // Return mock data for development
    return getMockModelMetrics()
  }
}

/**
 * Mock data generator for development/testing
 */
function getMockForecastData(commodity: string, model: string): ForecastData {
  const basePrice = 50 + Math.random() * 50
  const trend = (Math.random() - 0.5) * 0.1
  
  const historical: any[] = []
  const forecast: any[] = []
  
  // Generate 90 days of historical data
  for (let i = 90; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const noise = (Math.random() - 0.5) * 10
    historical.push({
      date: date.toISOString().split('T')[0],
      value: basePrice + trend * (90 - i) + noise,
    })
  }
  
  // Generate 30 days of forecast
  for (let i = 1; i <= 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const noise = (Math.random() - 0.5) * 5
    forecast.push({
      date: date.toISOString().split('T')[0],
      value: basePrice + trend * (90 + i) + noise,
    })
  }
  
  const currentPrice = historical[historical.length - 1].value
  const forecastPrice = forecast[forecast.length - 1].value
  const priceChange = ((forecastPrice - currentPrice) / currentPrice) * 100
  
  return {
    commodity,
    currentPrice: Math.round(currentPrice * 100) / 100,
    forecastPrice: Math.round(forecastPrice * 100) / 100,
    priceChange: Math.round(priceChange * 100) / 100,
    confidence: 85 + Math.random() * 10,
    historical,
    forecast,
    confidenceInterval: {
      lower: forecast.map(p => ({ ...p, value: p.value * 0.9 })),
      upper: forecast.map(p => ({ ...p, value: p.value * 1.1 })),
    },
  }
}

function getMockModelMetrics(): ModelMetrics[] {
  return [
    { model: 'XGBoost', mae: 4.23, rmse: 6.15, mape: 8.4, mase: 0.85, r2: 0.94 },
    { model: 'LightGBM', mae: 4.45, rmse: 6.32, mape: 8.8, mase: 0.89, r2: 0.93 },
    { model: 'Prophet', mae: 5.12, rmse: 7.21, mape: 10.2, mase: 1.02, r2: 0.91 },
    { model: 'SARIMA', mae: 5.67, rmse: 7.89, mape: 11.3, mase: 1.13, r2: 0.89 },
    { model: 'LSTM', mae: 6.21, rmse: 8.45, mape: 12.4, mase: 1.24, r2: 0.87 },
  ]
}
