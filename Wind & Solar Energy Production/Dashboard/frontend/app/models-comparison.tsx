'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Activity, Award, Brain, Trees, Zap } from 'lucide-react';

interface ModelMetrics {
  MAE: number;
  RMSE: number;
  MAPE: number;
  R2: number;
}

interface ModelComparison {
  models: string[];
  test_metrics: {
    [key: string]: ModelMetrics;
  };
  best_model: {
    by_MAE: string;
    by_RMSE: string;
    by_MAPE: string;
    by_R2: string;
  };
}

interface PredictionData {
  Date: string;
  Start_Hour: number;
  Production: number;
  RF_Prediction: number;
  XGB_Prediction: number;
  LSTM_Prediction: number;
}

export default function ModelsComparison() {
  const [comparison, setComparison] = useState<ModelComparison | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sampleSize, setSampleSize] = useState(100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load model comparison
      const compRes = await fetch('/data/model_comparison.json');
      const compData = await compRes.json();
      setComparison(compData);

      // Load predictions
      const predRes = await fetch('/data/predictions.csv');
      const predText = await predRes.text();
      const parsed = parseCSV(predText);
      setPredictions(parsed);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const parseCSV = (text: string): PredictionData[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        Date: values[0],
        Start_Hour: parseFloat(values[1]),
        Production: parseFloat(values[8]),
        RF_Prediction: parseFloat(values[9]),
        XGB_Prediction: parseFloat(values[10]),
        LSTM_Prediction: parseFloat(values[11])
      };
    }).filter(d => !isNaN(d.Production) && !isNaN(d.RF_Prediction));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading model data...</p>
        </div>
      </div>
    );
  }

  // Sample predictions for visualization
  const sampledPredictions = predictions.filter((_, i) => i % Math.floor(predictions.length / sampleSize) === 0);

  // Prepare chart data
  const chartData = sampledPredictions.map((d, i) => ({
    index: i,
    Actual: d.Production,
    'Random Forest': d.RF_Prediction,
    'XGBoost': d.XGB_Prediction,
    'LSTM': isNaN(d.LSTM_Prediction) ? null : d.LSTM_Prediction
  }));

  // Metrics comparison data
  const metricsData = comparison?.models.map(model => ({
    name: model,
    MAE: comparison.test_metrics[model].MAE,
    RMSE: comparison.test_metrics[model].RMSE,
    MAPE: comparison.test_metrics[model].MAPE,
    R2: comparison.test_metrics[model].R2
  })) || [];

  const getModelIcon = (model: string) => {
    if (model.includes('Random Forest')) return <Trees className="h-5 w-5" />;
    if (model.includes('XGBoost')) return <Zap className="h-5 w-5" />;
    if (model.includes('LSTM')) return <Brain className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
  };

  const getModelColor = (model: string) => {
    if (model.includes('Random Forest')) return 'from-green-500 to-emerald-600';
    if (model.includes('XGBoost')) return 'from-purple-500 to-indigo-600';
    if (model.includes('LSTM')) return 'from-blue-500 to-cyan-600';
    return 'from-gray-500 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
          <Activity className="h-10 w-10 text-blue-600" />
          ML Models Comparison Dashboard
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Comprehensive analysis of Random Forest, XGBoost, and LSTM models for energy production forecasting
        </p>
      </header>

      {/* Best Models Cards */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(comparison.best_model).map(([metric, model]) => (
            <div key={metric} className={`bg-gradient-to-r ${getModelColor(model)} p-6 rounded-xl shadow-lg text-white`}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium uppercase opacity-90">Best {metric.replace('by_', '')}</span>
              </div>
              <h3 className="text-2xl font-bold">{model}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {comparison?.models.map(model => {
          const metrics = comparison.test_metrics[model];
          return (
            <div key={model} className="bg-white rounded-xl shadow-md p-6 border-2 border-slate-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 bg-gradient-to-r ${getModelColor(model)} rounded-lg text-white`}>
                  {getModelIcon(model)}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{model}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">MAE</span>
                  <span className="font-semibold text-slate-800">{metrics.MAE.toFixed(2)} MWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">RMSE</span>
                  <span className="font-semibold text-slate-800">{metrics.RMSE.toFixed(2)} MWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">MAPE</span>
                  <span className="font-semibold text-slate-800">{metrics.MAPE.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">R² Score</span>
                  <span className="font-semibold text-slate-800">{metrics.R2.toFixed(4)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Comparison Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">MAE & RMSE Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="MAE" fill="#10b981" />
              <Bar dataKey="RMSE" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">MAPE & R² Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="MAPE" fill="#f59e0b" />
              <Bar yAxisId="right" dataKey="R2" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictions Comparison */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Test Set Predictions Comparison</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Sample Size:</label>
            <select 
              value={sampleSize} 
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="border border-slate-300 rounded px-3 py-1 text-sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" label={{ value: 'Sample Index', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Energy Production (MWh)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Actual" stroke="#000000" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Random Forest" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="XGBoost" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="LSTM" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">📊 Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-lg">✅ Data Split</h4>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Training: 70% of data</li>
              <li>• Validation: 20% of data</li>
              <li>• Test: 10% of data</li>
              <li>• Temporal ordering preserved</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-lg">🤖 Models Trained</h4>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Random Forest (100 trees)</li>
              <li>• XGBoost (gradient boosting)</li>
              <li>• LSTM (deep learning, 24-hour window)</li>
              <li>• Comprehensive feature engineering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
