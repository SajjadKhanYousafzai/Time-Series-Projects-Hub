import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react'

interface StatsCardsProps {
  currentPrice: number
  forecastPrice: number
  priceChange: number
  confidence: number
}

export default function StatsCards({
  currentPrice,
  forecastPrice,
  priceChange,
  confidence,
}: StatsCardsProps) {
  const isPositive = priceChange > 0
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Price */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-3xl font-bold text-gray-900">
              NPR {currentPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per Kg</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Forecast Price */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">30-Day Forecast</p>
            <p className="text-3xl font-bold text-gray-900">
              NPR {forecastPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">predicted</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Price Change */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Expected Change</p>
            <p className={`text-3xl font-bold ${
              isPositive ? 'text-red-600' : 'text-green-600'
            }`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">in 30 days</p>
          </div>
          <div className={`p-3 rounded-lg ${
            isPositive ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-8 h-8 text-red-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-green-600" />
            )}
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Forecast Confidence</p>
            <p className="text-3xl font-bold text-gray-900">
              {confidence.toFixed(1)}%
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
