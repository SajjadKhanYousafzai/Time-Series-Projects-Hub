"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

const AIRLINE_LABELS: Record<string, string> = {
  AirAsia: "AirAsia",
  Air_India: "Air India",
  GO_FIRST: "Go First",
  Indigo: "IndiGo",
  SpiceJet: "SpiceJet",
  Vistara: "Vistara",
};

export default function Home() {
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setAirline(data.categories.airline[0]);
        setSourceCity(data.categories.source_city[0]);
        setDestCity(data.categories.destination_city[1] || data.categories.destination_city[0]);
        setDepartureTime(data.categories.departure_time[1]);
        setArrivalTime(data.categories.arrival_time[4]);
        setStops(data.categories.stops[1]);
        setClassType(data.categories.class_type[0]);
      })
      .catch(() => setError("Cannot connect to API. Is the backend running?"));
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

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: "2rem 1rem",
        }}
      >
        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "2rem", width: "100%", maxWidth: "900px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "var(--accent-1)" }}>
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
            </svg>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
              <span style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                SkyPredict
              </span>
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            AI-Powered Flight Price Prediction for Indian Airlines
          </p>
          <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-4)", marginRight: 6, display: "inline-block" }} />
              Random Forest · R² = 0.98
            </span>
          </div>
        </header>

        {/* ── ERROR ── */}
        {error && !meta && (
          <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", maxWidth: "500px", width: "100%", marginBottom: "1.5rem" }}>
            <p style={{ color: "#f87171", fontWeight: 600, fontSize: "0.85rem" }}>{error}</p>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        {meta && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              width: "100%",
              maxWidth: "1100px",
            }}
            className="main-layout"
          >
            {/* -- Row: Form + Results -- */}
            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {/* ══ FORM CARD ══ */}
              <div
                className="glass-card"
                style={{
                  flex: "1 1 580px",
                  minWidth: 0,
                  padding: "clamp(1.25rem, 3vw, 2rem)",
                }}
              >
                <h2 className="section-title">
                  <span>✈️</span> Flight Details
                </h2>

                {/* Form Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Airline */}
                  <div>
                    <label className="form-label">🏢 Airline</label>
                    <select className="form-select" value={airline} onChange={(e) => setAirline(e.target.value)}>
                      {meta.categories.airline.map((a) => (
                        <option key={a} value={a}>{AIRLINE_LABELS[a] || a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class */}
                  <div>
                    <label className="form-label">💺 Class</label>
                    <select className="form-select" value={classType} onChange={(e) => setClassType(e.target.value)}>
                      {meta.categories.class_type.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* From */}
                  <div>
                    <label className="form-label">🛫 From</label>
                    <select className="form-select" value={sourceCity} onChange={(e) => setSourceCity(e.target.value)}>
                      {meta.categories.source_city.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* To */}
                  <div>
                    <label className="form-label">🛬 To</label>
                    <select className="form-select" value={destCity} onChange={(e) => setDestCity(e.target.value)}>
                      {meta.categories.destination_city.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Departure */}
                  <div>
                    <label className="form-label">🌅 Departure</label>
                    <select className="form-select" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}>
                      {meta.categories.departure_time.map((t) => (
                        <option key={t} value={t}>{TIME_LABELS[t] || t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Arrival */}
                  <div>
                    <label className="form-label">🌙 Arrival</label>
                    <select className="form-select" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}>
                      {meta.categories.arrival_time.map((t) => (
                        <option key={t} value={t}>{TIME_LABELS[t] || t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stops — full width */}
                <div style={{ marginTop: "1rem" }}>
                  <label className="form-label">🔄 Stops</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
                    {meta.categories.stops.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStops(s)}
                        className={`stop-btn ${stops === s ? "active" : ""}`}
                      >
                        {STOP_LABELS[s] || s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  {/* Duration */}
                  <div>
                    <label className="form-label">
                      ⏱️ Duration — <span style={{ color: "var(--accent-3)", fontWeight: 700 }}>{duration} hrs</span>
                    </label>
                    <input
                      type="range"
                      min={Math.ceil(meta.duration_range.min)}
                      max={Math.floor(meta.duration_range.max)}
                      step={0.5}
                      value={duration}
                      onChange={(e) => setDuration(parseFloat(e.target.value))}
                      style={{ marginTop: "0.4rem" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4 }}>
                      <span>{Math.ceil(meta.duration_range.min)}h</span>
                      <span>{Math.floor(meta.duration_range.max)}h</span>
                    </div>
                  </div>

                  {/* Days Left */}
                  <div>
                    <label className="form-label">
                      📅 Booking — <span style={{ color: "var(--accent-3)", fontWeight: 700 }}>{daysLeft} days</span>
                    </label>
                    <input
                      type="range"
                      min={meta.days_left_range.min}
                      max={meta.days_left_range.max}
                      step={1}
                      value={daysLeft}
                      onChange={(e) => setDaysLeft(parseInt(e.target.value))}
                      style={{ marginTop: "0.4rem" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4 }}>
                      <span>{meta.days_left_range.min} day</span>
                      <span>{meta.days_left_range.max} days</span>
                    </div>
                  </div>
                </div>

                {/* Predict Button */}
                <button className="btn-predict" onClick={handlePredict} disabled={loading || !isFormValid} style={{ marginTop: "1.5rem" }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "✈ Predict Price"
                  )}
                </button>

                {error && meta && (
                  <p style={{ color: "#f87171", fontSize: "0.85rem", textAlign: "center", marginTop: "0.75rem" }}>{error}</p>
                )}
              </div>

              {/* ══ RESULTS COLUMN ══ */}
              <div
                style={{
                  flex: "1 1 340px",
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Price Card */}
                <div
                  className="glass-card result-card"
                  style={{ padding: "clamp(1.25rem, 3vw, 2rem)", textAlign: "center" }}
                >
                  <h3 className="section-title" style={{ justifyContent: "center" }}>
                    Predicted Price
                  </h3>

                  {result ? (
                    <div className="price-result">
                      <div className="price-glow" style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                        &#8377;{result.predicted_price.toLocaleString("en-IN")}
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                        Indian Rupees
                      </p>
                      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                        <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                          Model: {result.model} · R² = {result.r2_score}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "2.5rem 0" }}>
                      <div className="plane-float" style={{ fontSize: "4rem", color: "var(--text-muted)", opacity: 0.2 }}>✈</div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.75rem", lineHeight: 1.6 }}>
                        Fill in the flight details and click<br />
                        <span style={{ color: "var(--accent-1)", fontWeight: 600 }}>Predict Price</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Flight Summary */}
                {result && (
                  <div className="glass-card price-result" style={{ padding: "1.25rem" }}>
                    <h3 className="section-title">Flight Summary</h3>
                    <SummaryRow label="Airline" value={AIRLINE_LABELS[airline] || airline} />
                    <SummaryRow label="Route" value={`${sourceCity} → ${destCity}`} />
                    <SummaryRow label="Class" value={classType} />
                    <SummaryRow label="Stops" value={STOP_LABELS[stops] || stops} />
                    <SummaryRow label="Departure" value={TIME_LABELS[departureTime] || departureTime} />
                    <SummaryRow label="Duration" value={`${duration} hours`} />
                    <SummaryRow label="Booking" value={`${daysLeft} days ahead`} />
                  </div>
                )}

                {/* About */}
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <h3 className="section-title">About This Model</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <Fact color="var(--accent-1)" text="Trained on 300K+ flight records" />
                    <Fact color="var(--accent-2)" text="Random Forest with 30 features" />
                    <Fact color="var(--accent-3)" text="98% accuracy (R² = 0.9765)" />
                    <Fact color="var(--accent-4)" text="6 Indian cities, 6 airlines" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: "2.5rem", textAlign: "center", paddingBottom: "1rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Built with FastAPI · Next.js · Random Forest
          </p>
        </footer>
      </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Fact({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{text}</span>
    </div>
  );
}
