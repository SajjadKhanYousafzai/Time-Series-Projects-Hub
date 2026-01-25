"""
FastAPI Backend for Kalimati Tarkari Forecasting Dashboard
Serves predictions from trained models to the TypeScript frontend
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
from pathlib import Path

app = FastAPI(
    title="Kalimati Tarkari Forecast API",
    description="Time Series Forecasting API for Vegetable Prices",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class DataPoint(BaseModel):
    date: str
    value: float

class ConfidenceInterval(BaseModel):
    lower: List[DataPoint]
    upper: List[DataPoint]

class ForecastResponse(BaseModel):
    commodity: str
    currentPrice: float
    forecastPrice: float
    priceChange: float
    confidence: float
    historical: List[DataPoint]
    forecast: List[DataPoint]
    confidenceInterval: Optional[ConfidenceInterval] = None

class ModelMetrics(BaseModel):
    model: str
    mae: float
    rmse: float
    mape: float
    mase: float
    r2: float

# Global variables for models and data
models = {}
data_cache = {}
DATA_PATH = Path("../Dataset/Kalimati_Tarkari_Dataset.csv")
MODELS_PATH = Path("models/")

# Load models on startup
@app.on_event("startup")
async def load_models():
    """Load trained models from disk"""
    try:
        if MODELS_PATH.exists():
            for model_file in MODELS_PATH.glob("*.pkl"):
                model_name = model_file.stem
                models[model_name] = joblib.load(model_file)
                print(f"✅ Loaded model: {model_name}")
        else:
            print("⚠️ Models directory not found. Using mock data.")
    except Exception as e:
        print(f"⚠️ Error loading models: {e}. Using mock data.")

@app.get("/")
def root():
    """API health check"""
    return {
        "status": "healthy",
        "message": "Kalimati Tarkari Forecast API",
        "models_loaded": len(models),
        "version": "1.0.0"
    }

@app.get("/api/forecast", response_model=ForecastResponse)
def get_forecast(
    commodity: str = Query(..., description="Commodity name (e.g., Potato)"),
    model: str = Query("XGBoost", description="Model to use for prediction")
):
    """
    Get price forecast for a specific commodity using specified model
    
    - **commodity**: Name of the vegetable
    - **model**: Model name (XGBoost, Prophet, SARIMA, etc.)
    """
    try:
        # Load data
        df = load_commodity_data(commodity)
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {commodity}")
        
        # Generate forecast
        historical = df.tail(60).to_dict('records')
        historical_data = [
            DataPoint(date=str(row['Date'].date()), value=float(row['Average']))
            for _, row in df.tail(60).iterrows()
        ]
        
        # Mock forecast (replace with actual model prediction)
        forecast_data = generate_mock_forecast(df, days=30)
        
        current_price = float(df['Average'].iloc[-1])
        forecast_price = forecast_data[-1].value
        price_change = ((forecast_price - current_price) / current_price) * 100
        
        # Generate confidence intervals
        lower_bound = [DataPoint(date=p.date, value=p.value * 0.9) for p in forecast_data]
        upper_bound = [DataPoint(date=p.date, value=p.value * 1.1) for p in forecast_data]
        
        return ForecastResponse(
            commodity=commodity,
            currentPrice=round(current_price, 2),
            forecastPrice=round(forecast_price, 2),
            priceChange=round(price_change, 2),
            confidence=round(np.random.uniform(85, 95), 1),
            historical=historical_data,
            forecast=forecast_data,
            confidenceInterval=ConfidenceInterval(
                lower=lower_bound,
                upper=upper_bound
            )
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")

@app.get("/api/metrics", response_model=List[ModelMetrics])
def get_metrics(
    commodity: str = Query(..., description="Commodity name")
):
    """
    Get performance metrics for all models on a specific commodity
    
    - **commodity**: Name of the vegetable
    """
    try:
        # Mock metrics (replace with actual model evaluation results)
        metrics = [
            ModelMetrics(model="XGBoost", mae=4.23, rmse=6.15, mape=8.4, mase=0.85, r2=0.94),
            ModelMetrics(model="LightGBM", mae=4.45, rmse=6.32, mape=8.8, mase=0.89, r2=0.93),
            ModelMetrics(model="Prophet", mae=5.12, rmse=7.21, mape=10.2, mase=1.02, r2=0.91),
            ModelMetrics(model="SARIMA", mae=5.67, rmse=7.89, mape=11.3, mase=1.13, r2=0.89),
            ModelMetrics(model="LSTM", mae=6.21, rmse=8.45, mape=12.4, mase=1.24, r2=0.87),
        ]
        return metrics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching metrics: {str(e)}")

@app.get("/api/commodities")
def get_commodities():
    """Get list of available commodities"""
    try:
        df = pd.read_csv(DATA_PATH)
        commodities = df['Commodity'].unique().tolist()
        return {"commodities": commodities, "count": len(commodities)}
    except Exception as e:
        return {
            "commodities": [
                "Potato", "Tomato", "Onion", "Cauliflower", "Cabbage",
                "Carrot", "Radish", "Cucumber", "Pumpkin", "Spinach"
            ],
            "count": 10
        }

# Helper Functions
def load_commodity_data(commodity: str) -> pd.DataFrame:
    """Load and filter data for specific commodity"""
    try:
        df = pd.read_csv(DATA_PATH)
        df['Date'] = pd.to_datetime(df['Date'])
        df['Average'] = pd.to_numeric(df['Average'], errors='coerce')
        
        # Filter by commodity
        df_commodity = df[df['Commodity'].str.lower() == commodity.lower()].copy()
        df_commodity = df_commodity.sort_values('Date')
        df_commodity = df_commodity.dropna(subset=['Average'])
        
        return df_commodity
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()

def generate_mock_forecast(df: pd.DataFrame, days: int = 30) -> List[DataPoint]:
    """Generate mock forecast data (replace with actual model predictions)"""
    last_date = df['Date'].max()
    last_value = df['Average'].iloc[-1]
    
    # Simple trend-based forecast
    trend = df['Average'].tail(30).mean() - df['Average'].tail(60).mean()
    
    forecast = []
    for i in range(1, days + 1):
        date = last_date + timedelta(days=i)
        noise = np.random.normal(0, last_value * 0.05)
        value = last_value + (trend * i / 30) + noise
        forecast.append(DataPoint(
            date=str(date.date()),
            value=round(max(value, 0), 2)
        ))
    
    return forecast

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Kalimati Tarkari Forecast API...")
    print("📊 API docs: http://localhost:8000/docs")
    print("🌐 Frontend: http://localhost:3000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
