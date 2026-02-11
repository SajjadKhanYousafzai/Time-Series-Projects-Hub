"""
Train the Random Forest model for flight price prediction and save artifacts.

This script reproduces the preprocessing from the notebook and exports:
  - model/model.joblib      (trained RandomForestRegressor)
  - model/scaler.joblib      (fitted StandardScaler)
  - model/metadata.json      (feature names, category mappings, column order)

Usage:
    python model/train_model.py
"""

import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ---------- paths ----------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_PATH = os.path.join(PROJECT_DIR, "Data", "airlines_flights_data.csv")
MODEL_DIR = SCRIPT_DIR  # save artifacts next to this script

# ---------- 1. Load data ----------
print("=" * 60)
print("STEP 1: Loading data")
print("=" * 60)
df = pd.read_csv(DATA_PATH)
print(f"  Loaded {df.shape[0]:,} rows x {df.shape[1]} columns")

# Drop the index column if present
if "index" in df.columns:
    df = df.drop(columns=["index"])

# ---------- 2. Feature engineering ----------
print("\nSTEP 2: Feature engineering")
df_ml = df.copy()

# Stops as numeric
stops_map = {"zero": 0, "one": 1, "two_or_more": 2}
df_ml["stops_numeric"] = df_ml["stops"].map(stops_map).astype(int)

# Is direct flag
df_ml["is_direct"] = (df_ml["stops"] == "zero").astype(int)

# ---------- 3. Outlier capping ----------
print("\nSTEP 3: Outlier capping (IQR x 1.5)")
for col in ["price", "duration"]:
    Q1 = df_ml[col].quantile(0.25)
    Q3 = df_ml[col].quantile(0.75)
    IQR = Q3 - Q1
    lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
    n_capped = ((df_ml[col] < lower) | (df_ml[col] > upper)).sum()
    df_ml[col] = df_ml[col].clip(lower=lower, upper=upper)
    print(f"  {col}: capped {n_capped:,} outliers to [{lower:,.1f}, {upper:,.1f}]")

# ---------- 4. Encode features ----------
print("\nSTEP 4: Encoding features")
target = "price"

# Columns to drop
cols_to_drop = ["flight", "route", "stops"]
df_ml["route"] = df_ml["source_city"] + " -> " + df_ml["destination_city"]

# One-hot features
onehot_features = ["airline", "source_city", "destination_city",
                   "departure_time", "arrival_time"]

# Prepare
df_model = df_ml.drop(columns=cols_to_drop + [target], errors="ignore")
df_model["class"] = (df_model["class"] == "Business").astype(int)
df_model = pd.get_dummies(df_model, columns=onehot_features, drop_first=True, dtype=int)

y = df_ml[target].values
X = df_model.select_dtypes(include=[np.number])

feature_names = list(X.columns)
print(f"  Feature matrix: {X.shape[0]:,} x {X.shape[1]} features")

# ---------- 5. Train/test split & scale ----------
print("\nSTEP 5: Train/test split & scaling")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scale_cols = ["duration", "days_left", "stops_numeric"]
scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()
X_train_scaled[scale_cols] = scaler.fit_transform(X_train[scale_cols])
X_test_scaled[scale_cols] = scaler.transform(X_test[scale_cols])

print(f"  Train: {X_train.shape[0]:,}  |  Test: {X_test.shape[0]:,}")

# ---------- 6. Train Random Forest ----------
print("\nSTEP 6: Training Random Forest")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
print(f"  Test R2:   {r2:.4f}")
print(f"  Test RMSE: {rmse:,.0f}")
print(f"  Test MAE:  {mae:,.0f}")

# ---------- 7. Save artifacts ----------
print("\nSTEP 7: Saving artifacts")

# Collect unique values for dropdowns
metadata = {
    "model_name": "Random Forest",
    "r2_score": round(r2, 4),
    "rmse": round(float(rmse), 0),
    "mae": round(float(mae), 0),
    "feature_names": feature_names,
    "scale_cols": scale_cols,
    "stops_map": stops_map,
    "categories": {
        "airline": sorted(df["airline"].unique().tolist()),
        "source_city": sorted(df["source_city"].unique().tolist()),
        "destination_city": sorted(df["destination_city"].unique().tolist()),
        "departure_time": ["Early_Morning", "Morning", "Afternoon", "Evening", "Night", "Late_Night"],
        "arrival_time": ["Early_Morning", "Morning", "Afternoon", "Evening", "Night", "Late_Night"],
        "stops": ["zero", "one", "two_or_more"],
        "class_type": ["Economy", "Business"],
    },
    "duration_range": {"min": float(df["duration"].min()), "max": float(df["duration"].max())},
    "days_left_range": {"min": int(df["days_left"].min()), "max": int(df["days_left"].max())},
}

joblib.dump(model, os.path.join(MODEL_DIR, "model.joblib"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.joblib"))
with open(os.path.join(MODEL_DIR, "metadata.json"), "w") as f:
    json.dump(metadata, f, indent=2)

print(f"  model.joblib    -> {os.path.join(MODEL_DIR, 'model.joblib')}")
print(f"  scaler.joblib   -> {os.path.join(MODEL_DIR, 'scaler.joblib')}")
print(f"  metadata.json   -> {os.path.join(MODEL_DIR, 'metadata.json')}")

print("\n" + "=" * 60)
print("MODEL TRAINING COMPLETE")
print("=" * 60)
