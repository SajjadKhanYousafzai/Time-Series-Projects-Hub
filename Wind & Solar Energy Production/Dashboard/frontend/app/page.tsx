'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wind, Sun, Activity, Zap } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    year: 2025,
    month: 12,
    day: 1,
    hour: 12,
    source: 'Wind'
  });

  useEffect(() => {
    // Fetch Metrics
    fetch('http://localhost:8000/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Error fetching metrics:", err));

    // Fetch Forecast Sample
    fetch('http://localhost:8000/forecast-sample')
      .then(res => res.json())
      .then(data => {
        // Format date for chart
        const formatted = data.map((d: any) => ({
          ...d,
          time: new Date(d.Date).toLocaleString('en-US', { day: 'numeric', hour: 'numeric' })
        }));
        setForecastData(formatted);
      })
      .catch(err => console.error("Error fetching forecast:", err));
  }, []);

  const handlePredict = async () => {
    const date = new Date(formData.year, formData.month - 1, formData.day);
    const day_of_week = date.getDay(); // 0-6

    const payload = {
      year: Number(formData.year),
      month: Number(formData.month),
      day: Number(formData.day),
      day_of_week: day_of_week,
      hour: Number(formData.hour),
      source: formData.source
    };

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Energy Production Dashboard
        </h1>
        <p className="text-slate-500 mt-2">Real-time analysis and forecasting of Wind & Solar energy production.</p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Model Accuracy (MAE)</p>
              <h3 className="text-2xl font-bold mt-1">{metrics ? metrics.mae.toFixed(2) : '...'} <span className="text-sm font-normal text-slate-400">MWh</span></h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Root Mean Sq Error</p>
              <h3 className="text-2xl font-bold mt-1">{metrics ? metrics.rmse.toFixed(2) : '...'}</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Activity className="h-5 w-5 text-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Data Source</p>
              <h3 className="text-2xl font-bold mt-1">Wind & Solar</h3>
            </div>
            <div className="flex gap-1">
              <div className="p-2 bg-sky-50 rounded-lg"><Wind className="h-5 w-5 text-sky-500" /></div>
              <div className="p-2 bg-orange-50 rounded-lg"><Sun className="h-5 w-5 text-orange-500" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">Recent Forecast vs Actual</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 12}} minTickGap={30} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Legend />
                <Line type="monotone" dataKey="Actual" stroke="#64748b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Predicted" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-lg font-semibold mb-6">Live Prediction</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <input 
                  type="number" 
                  className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                <input 
                  type="number" 
                  min="1" max="12"
                  className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
                <input 
                  type="number" min="1" max="31"
                  className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hour (0-23)</label>
                <input 
                  type="number" min="0" max="23"
                  className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.hour}
                  onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Energy Source</label>
              <select 
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              >
                <option value="Wind">Wind</option>
                <option value="Solar">Solar</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <button 
              onClick={handlePredict}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
            >
              Predict Production
            </button>
          </div>

          {prediction !== null && (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg text-center">
              <p className="text-sm text-green-600 font-medium">Predicted Production</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{prediction.toFixed(0)} <span className="text-sm">MWh</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
