from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
MODEL_PATH = "artifacts/rf_model.pkl"
LE_PATH = "artifacts/le_source.pkl"
METRICS_PATH = "artifacts/metrics.json"
SAMPLE_PATH = "artifacts/forecast_sample.json"

class PredictionRequest(BaseModel):
    year: int
    month: int
    day: int
    day_of_week: int
    hour: int
    source: str

@app.get("/")
def home():
    return {"message": "Wind & Solar Energy Prediction API"}

@app.get("/metrics")
def get_metrics():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, 'r') as f:
            return json.load(f)
    return {"error": "Metrics not found"}

@app.get("/forecast-sample")
def get_forecast_sample():
    if os.path.exists(SAMPLE_PATH):
        with open(SAMPLE_PATH, 'r') as f:
            return json.load(f)
    return {"error": "Sample data not found"}

@app.post("/predict")
def predict(request: PredictionRequest):
    if not os.path.exists(MODEL_PATH) or not os.path.exists(LE_PATH):
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    model = joblib.load(MODEL_PATH)
    le = joblib.load(LE_PATH)
    
    try:
        source_encoded = le.transform([request.source])[0]
    except:
        # fallback to most common or error
        source_encoded = 0 
        
    features = pd.DataFrame([{
        'Year': request.year,
        'Month': request.month,
        'Day': request.day,
        'DayOfWeek': request.day_of_week,
        'Hour': request.hour,
        'Source_Encoded': source_encoded
    }])
    
    prediction = model.predict(features)[0]
    return {"prediction": prediction}
