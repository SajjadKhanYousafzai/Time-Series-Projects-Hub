'use client'

import { useState } from 'react'
import { Search, Apple } from 'lucide-react'

interface CommoditySelectorProps {
  selected: string
  onSelect: (commodity: string) => void
}

const POPULAR_COMMODITIES = [
  'Potato', 'Tomato', 'Onion', 'Cauliflower', 'Cabbage',
  'Carrot', 'Radish', 'Cucumber', 'Pumpkin', 'Spinach',
]

export default function CommoditySelector({ selected, onSelect }: CommoditySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredCommodities = POPULAR_COMMODITIES.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Apple className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-800">Select Commodity</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vegetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Commodity Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {filteredCommodities.map(commodity => (
          <button
            key={commodity}
            onClick={() => onSelect(commodity)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selected === commodity
                ? 'bg-primary-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {commodity}
          </button>
        ))}
      </div>

      {filteredCommodities.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No commodities found matching "{searchTerm}"
        </p>
      )}
    </div>
  )
}
