'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts'
import type { ForecastData } from '@/types'

interface ForecastChartProps {
  data: ForecastData
}

export default function ForecastChart({ data }: ForecastChartProps) {
  // Combine historical and forecast data
  const chartData = [
    ...data.historical.slice(-60).map(d => ({
      date: d.date,
      actual: d.value,
      forecast: null,
      lower: null,
      upper: null,
    })),
    ...data.forecast.map((d, idx) => ({
      date: d.date,
      actual: null,
      forecast: d.value,
      lower: data.confidenceInterval?.lower[idx]?.value || null,
      upper: data.confidenceInterval?.upper[idx]?.value || null,
    })),
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          label={{ value: 'Price (NPR/Kg)', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: any) => [`NPR ${value?.toFixed(2)}`, '']}
          labelFormatter={formatDate}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        
        {/* Confidence interval */}
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="#93c5fd"
          fillOpacity={0.2}
          name="Upper Bound"
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="#93c5fd"
          fillOpacity={0.2}
          name="Lower Bound"
        />
        
        {/* Historical actual prices */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Historical"
          connectNulls
        />
        
        {/* Forecast */}
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Forecast"
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
