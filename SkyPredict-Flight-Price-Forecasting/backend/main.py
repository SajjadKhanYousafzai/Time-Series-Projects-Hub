"""
FastAPI backend for flight price prediction.

Endpoints:
  GET  /           -> Health check
  GET  /metadata   -> Dropdown options for the frontend
  POST /predict    -> Predict flight price

Usage:
  cd backend
  uvicorn main:app --reload --port 8000
"""

import json
import os

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------- Paths ----------
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BACKEND_DIR)
MODEL_DIR = os.path.join(PROJECT_DIR, "model")

# ---------- Load artifacts ----------
model = joblib.load(os.path.join(MODEL_DIR, "model.joblib"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.joblib"))
with open(os.path.join(MODEL_DIR, "metadata.json")) as f:
    metadata = json.load(f)

FEATURE_NAMES = metadata["feature_names"]
SCALE_COLS = metadata["scale_cols"]
STOPS_MAP = metadata["stops_map"]

# ---------- App ----------
app = FastAPI(
    title="Flight Price Predictor API",
    description="Predict airline flight ticket prices using a Random Forest model (R² = 0.98)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Schemas ----------
class PredictionRequest(BaseModel):
    airline: str = Field(..., example="Vistara")
    source_city: str = Field(..., example="Delhi")
    destination_city: str = Field(..., example="Mumbai")
    departure_time: str = Field(..., example="Morning")
    arrival_time: str = Field(..., example="Night")
    stops: str = Field(..., example="one")
    class_type: str = Field(..., example="Business")
    duration: float = Field(..., ge=0.5, le=50, example=5.5)
    days_left: int = Field(..., ge=1, le=49, example=15)


class PredictionResponse(BaseModel):
    predicted_price: int
    currency: str = "INR"
    model: str
    r2_score: float


# ---------- Routes ----------
@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "model": metadata["model_name"],
        "r2_score": metadata["r2_score"],
    }


@app.get("/metadata")
def get_metadata():
    """Return dropdown options and value ranges for the frontend."""
    return {
        "categories": metadata["categories"],
        "duration_range": metadata["duration_range"],
        "days_left_range": metadata["days_left_range"],
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    """Predict the price of a flight ticket."""
    try:
        # Build a single-row DataFrame with the same columns as training
        stops_numeric = STOPS_MAP.get(req.stops, 1)
        is_direct = 1 if req.stops == "zero" else 0
        class_val = 1 if req.class_type == "Business" else 0

        # Start with numeric features
        row = {
            "duration": req.duration,
            "days_left": req.days_left,
            "is_direct": is_direct,
            "stops_numeric": stops_numeric,
            "class": class_val,
        }

        # One-hot encode categoricals (drop_first=True matches training)
        onehot_config = {
            "airline": metadata["categories"]["airline"],
            "source_city": metadata["categories"]["source_city"],
            "destination_city": metadata["categories"]["destination_city"],
            "departure_time": metadata["categories"]["departure_time"],
            "arrival_time": metadata["categories"]["arrival_time"],
        }

        for feature, all_values in onehot_config.items():
            # drop_first=True means we skip the first alphabetically-sorted value
            sorted_vals = sorted(all_values)
            for val in sorted_vals[1:]:  # skip first
                col_name = f"{feature}_{val}"
                actual_val = getattr(req, feature)
                row[col_name] = 1 if actual_val == val else 0

        # Create DataFrame and align columns with training order
        df_input = pd.DataFrame([row])

        # Ensure all expected columns are present
        for col in FEATURE_NAMES:
            if col not in df_input.columns:
                df_input[col] = 0

        df_input = df_input[FEATURE_NAMES]

        # Scale numeric columns
        df_input[SCALE_COLS] = scaler.transform(df_input[SCALE_COLS])

        # Predict
        prediction = model.predict(df_input)[0]
        predicted_price = max(int(round(prediction)), 0)

        return PredictionResponse(
            predicted_price=predicted_price,
            currency="INR",
            model=metadata["model_name"],
            r2_score=metadata["r2_score"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
