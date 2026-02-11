"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

interface Metadata {
  categories: {
    airline: string[];
    source_city: string[];
    destination_city: string[];
    departure_time: string[];
    arrival_time: string[];
    stops: string[];
    class_type: string[];
  };
  duration_range: { min: number; max: number };
  days_left_range: { min: number; max: number };
}

interface PredictionResult {
  predicted_price: number;
  currency: string;
  model: string;
  r2_score: number;
}

const STOP_LABELS: Record<string, string> = {
  zero: "Non-Stop",
  one: "1 Stop",
  two_or_more: "2+ Stops",
};

const TIME_LABELS: Record<string, string> = {
  Early_Morning: "Early Morning",
  Morning: "Morning",
  Afternoon: "Afternoon",
  Evening: "Evening",
  Night: "Night",
  Late_Night: "Late Night",
};

export default function Home() {
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [airline, setAirline] = useState("");
  const [sourceCity, setSourceCity] = useState("");
  const [destCity, setDestCity] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [stops, setStops] = useState("");
  const [classType, setClassType] = useState("");
  const [duration, setDuration] = useState(10);
  const [daysLeft, setDaysLeft] = useState(15);

  useEffect(() => {
    fetch(`${API_BASE}/metadata`)
      .then((r) => r.json())
      .then((data: Metadata) => {
        setMeta(data);
        // Set defaults
        setAirline(data.categories.airline[0]);
        setSourceCity(data.categories.source_city[0]);
        setDestCity(data.categories.destination_city[1] || data.categories.destination_city[0]);
        setDepartureTime(data.categories.departure_time[1]);
        setArrivalTime(data.categories.arrival_time[4]);
        setStops(data.categories.stops[1]);
        setClassType(data.categories.class_type[0]);
      })
      .catch(() => setError("Cannot connect to API. Is the backend running on port 8000?"));
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline,
          source_city: sourceCity,
          destination_city: destCity,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          stops,
          class_type: classType,
          duration,
          days_left: daysLeft,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Prediction failed");
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = airline && sourceCity && destCity && departureTime && arrivalTime && stops && classType;

  return (
    <>
      <div className="bg-mesh" />
      <main className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                <path
                  d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SkyPredict
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              AI-Powered Flight Price Prediction for Indian Airlines
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="badge badge-success">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2" />
                Random Forest &middot; R&sup2; = 0.98
              </span>
            </div>
          </header>

          {error && !meta && (
            <div className="glass-card p-6 text-center mb-6">
              <p className="text-red-400 font-medium">{error}</p>
              <p className="text-slate-500 text-sm mt-2">
                Start the backend: <code className="text-cyan-400">cd backend &amp;&amp; uvicorn main:app --port 8000</code>
              </p>
            </div>
          )}

          {meta && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Card */}
              <div className="lg:col-span-2 glass-card p-8">
                <h2 className="text-xl font-semibold mb-6 text-slate-200">
                  Flight Details
                </h2>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Airline */}
                  <div>
                    <label className="form-label">Airline</label>
                    <select className="form-select" value={airline} onChange={(e) => setAirline(e.target.value)}>
                      {meta.categories.airline.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class */}
                  <div>
                    <label className="form-label">Class</label>
                    <select className="form-select" value={classType} onChange={(e) => setClassType(e.target.value)}>
                      {meta.categories.class_type.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Source City */}
                  <div>
                    <label className="form-label">From</label>
                    <select className="form-select" value={sourceCity} onChange={(e) => setSourceCity(e.target.value)}>
                      {meta.categories.source_city.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Destination City */}
                  <div>
                    <label className="form-label">To</label>
                    <select className="form-select" value={destCity} onChange={(e) => setDestCity(e.target.value)}>
                      {meta.categories.destination_city.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="form-label">Departure Time</label>
                    <select className="form-select" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}>
                      {meta.categories.departure_time.map((t) => (
                        <option key={t} value={t}>{TIME_LABELS[t] || t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label className="form-label">Arrival Time</label>
                    <select className="form-select" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}>
                      {meta.categories.arrival_time.map((t) => (
                        <option key={t} value={t}>{TIME_LABELS[t] || t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stops */}
                  <div className="sm:col-span-2">
                    <label className="form-label">Stops</label>
                    <div className="grid grid-cols-3 gap-3">
                      {meta.categories.stops.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStops(s)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                            stops === s
                              ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                              : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          {STOP_LABELS[s] || s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <label className="form-label">
                      Duration &mdash;{" "}
                      <span className="text-blue-400 font-bold">{duration} hrs</span>
                    </label>
                    <input
                      type="range"
                      min={Math.ceil(meta.duration_range.min)}
                      max={Math.floor(meta.duration_range.max)}
                      step={0.5}
                      value={duration}
                      onChange={(e) => setDuration(parseFloat(e.target.value))}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{Math.ceil(meta.duration_range.min)}h</span>
                      <span>{Math.floor(meta.duration_range.max)}h</span>
                    </div>
                  </div>

                  {/* Days Left Slider */}
                  <div>
                    <label className="form-label">
                      Days Before Departure &mdash;{" "}
                      <span className="text-blue-400 font-bold">{daysLeft} days</span>
                    </label>
                    <input
                      type="range"
                      min={meta.days_left_range.min}
                      max={meta.days_left_range.max}
                      step={1}
                      value={daysLeft}
                      onChange={(e) => setDaysLeft(parseInt(e.target.value))}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{meta.days_left_range.min} day</span>
                      <span>{meta.days_left_range.max} days</span>
                    </div>
                  </div>
                </div>

                {/* Predict Button */}
                <button
                  className="btn-predict mt-8"
                  onClick={handlePredict}
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Predicting...
                    </span>
                  ) : (
                    "Predict Price"
                  )}
                </button>

                {error && meta && (
                  <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                )}
              </div>

              {/* Result Panel */}
              <div className="lg:col-span-1 space-y-6">
                {/* Price Result */}
                <div className="glass-card p-8 text-center">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Predicted Price
                  </h3>
                  {result ? (
                    <div className="price-result">
                      <div className="text-5xl font-extrabold price-glow text-white mb-2">
                        &#8377;{result.predicted_price.toLocaleString("en-IN")}
                      </div>
                      <p className="text-slate-400 text-sm">
                        Indian Rupees
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500">
                          Model: {result.model} &middot; R&sup2; = {result.r2_score}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="text-6xl mb-4 opacity-20">&#9992;</div>
                      <p className="text-slate-500 text-sm">
                        Fill in flight details and click<br />&ldquo;Predict Price&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Flight Summary */}
                {result && (
                  <div className="glass-card p-6 price-result">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                      Flight Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <SummaryRow label="Airline" value={airline} />
                      <SummaryRow label="Route" value={`${sourceCity} → ${destCity}`} />
                      <SummaryRow label="Class" value={classType} />
                      <SummaryRow label="Stops" value={STOP_LABELS[stops] || stops} />
                      <SummaryRow label="Departure" value={TIME_LABELS[departureTime] || departureTime} />
                      <SummaryRow label="Duration" value={`${duration} hours`} />
                      <SummaryRow label="Booking" value={`${daysLeft} days ahead`} />
                    </div>
                  </div>
                )}

                {/* Info Card */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    About This Model
                  </h3>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">&#9679;</span>
                      Trained on 300K+ flight records
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">&#9679;</span>
                      Random Forest with 30 features
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">&#9679;</span>
                      98% accuracy (R&sup2; = 0.9765)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">&#9679;</span>
                      6 Indian cities, 6 airlines
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  );
}
