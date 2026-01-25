'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ModelMetrics } from '@/types'

interface ModelComparisonProps {
  metrics: ModelMetrics[]
}

export default function ModelComparison({ metrics }: ModelComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="model" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="mae" fill="#3b82f6" name="MAE" />
          <Bar dataKey="rmse" fill="#8b5cf6" name="RMSE" />
          <Bar dataKey="mape" fill="#f59e0b" name="MAPE" />
        </BarChart>
      </ResponsiveContainer>

      {/* Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">MAE</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">RMSE</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">MAPE</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">MASE</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">R²</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => (
              <tr
                key={metric.model}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  idx === 0 ? 'bg-green-50' : ''
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-900">
                  {metric.model}
                  {idx === 0 && (
                    <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      Best
                    </span>
                  )}
                </td>
                <td className="text-center py-3 px-4 text-gray-700">{metric.mae.toFixed(2)}</td>
                <td className="text-center py-3 px-4 text-gray-700">{metric.rmse.toFixed(2)}</td>
                <td className="text-center py-3 px-4 text-gray-700">{metric.mape.toFixed(1)}%</td>
                <td className="text-center py-3 px-4 text-gray-700">{metric.mase.toFixed(2)}</td>
                <td className="text-center py-3 px-4 text-gray-700">{metric.r2.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metric Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-1">MAE / RMSE</h4>
          <p className="text-xs text-blue-700">
            Mean Absolute Error and Root Mean Squared Error. Lower is better.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-1">MAPE / MASE</h4>
          <p className="text-xs text-purple-700">
            Percentage and scaled errors. Lower values indicate better accuracy.
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">R² Score</h4>
          <p className="text-xs text-green-700">
            Coefficient of determination. Closer to 1.0 means better fit.
          </p>
        </div>
      </div>
    </div>
  )
}
