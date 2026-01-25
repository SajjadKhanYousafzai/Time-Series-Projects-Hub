'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import ForecastChart from '@/components/ForecastChart'
import ModelComparison from '@/components/ModelComparison'
import CommoditySelector from '@/components/CommoditySelector'
import { fetchForecastData, fetchModelMetrics } from '@/lib/api'
import type { ForecastData, ModelMetrics } from '@/types'

export default function Dashboard() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Potato')
  const [selectedModel, setSelectedModel] = useState<string>('XGBoost')
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [forecast, metrics] = await Promise.all([
          fetchForecastData(selectedCommodity, selectedModel),
          fetchModelMetrics(selectedCommodity)
        ])
        setForecastData(forecast)
        setModelMetrics(metrics)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCommodity, selectedModel])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Commodity Selector */}
        <div className="mb-8">
          <CommoditySelector
            selected={selectedCommodity}
            onSelect={setSelectedCommodity}
          />
        </div>

        {/* Stats Cards */}
        {forecastData && (
          <StatsCards
            currentPrice={forecastData.currentPrice}
            forecastPrice={forecastData.forecastPrice}
            priceChange={forecastData.priceChange}
            confidence={forecastData.confidence}
          />
        )}

        {/* Main Forecast Chart */}
        <div className="mt-8 card">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Price Forecast - {selectedCommodity}
            </h2>
            <div className="flex gap-2">
              {['XGBoost', 'Prophet', 'SARIMA', 'LSTM'].map(model => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedModel === model
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : forecastData ? (
            <ForecastChart data={forecastData} />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              No forecast data available
            </div>
          )}
        </div>

        {/* Model Comparison */}
        <div className="mt-8 card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Model Performance Comparison
          </h2>
          {modelMetrics.length > 0 ? (
            <ModelComparison metrics={modelMetrics} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              Loading model metrics...
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Data source: Kalimati Fruits and Vegetable Market, Nepal | 
            Updated: {new Date().toLocaleDateString()} |
            Forecast horizon: 30 days
          </p>
        </div>
      </main>
    </div>
  )
}
