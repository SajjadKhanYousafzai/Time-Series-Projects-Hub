import { TrendingUp, Calendar } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kalimati Tarkari Forecast
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-Powered Vegetable Price Prediction System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
