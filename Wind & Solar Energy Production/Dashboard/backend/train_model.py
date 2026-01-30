import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import os
import json

def train_model():
    print("Loading data...")
    csv_path = r"../../Dataset/Energy Production Dataset.csv"
    
    if not os.path.exists(csv_path):
        csv_path = r"d:\LLM and AIOps Projects\Time-Series-Projects-Hub\Wind & Solar Energy Production\Dataset\Energy Production Dataset.csv"

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Could not find dataset at {csv_path}")

    df = pd.read_csv(csv_path)
    
    # Preprocessing
    print("Preprocessing...")
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Feature Engineering
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    df['Day'] = df['Date'].dt.day
    df['DayOfWeek'] = df['Date'].dt.dayofweek
    df['Hour'] = df['Start_Hour']
    
    # Encode Categoricals
    le_source = LabelEncoder()
    df['Source_Encoded'] = le_source.fit_transform(df['Source'])
    
    # Drop rows with NaN if any (dataset says 0 missing, but good practice)
    df = df.dropna()

    features = ['Year', 'Month', 'Day', 'DayOfWeek', 'Hour', 'Source_Encoded']
    target = 'Production'
    
    X = df[features]
    y = df[target]
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=False) # Time series split better but RF handles random ok for general dashboards if not strict forecasting
    
    # Train Model
    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, n_jobs=-1, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    
    print(f"Model Trained. MAE: {mae:.2f}, RMSE: {rmse:.2f}")
    
    # Save Artifacts
    print("Saving artifacts...")
    os.makedirs('artifacts', exist_ok=True)
    joblib.dump(model, 'artifacts/rf_model.pkl')
    joblib.dump(le_source, 'artifacts/le_source.pkl')
    
    # Save metrics
    metrics = {"mae": mae, "rmse": rmse}
    with open('artifacts/metrics.json', 'w') as f:
        json.dump(metrics, f)
        
    # Generate some forecast/plot data for the frontend (Last 100 hours actual vs predicted)
    results_df = X_test.copy()
    results_df['Actual'] = y_test
    results_df['Predicted'] = predictions
    results_df['Date'] = pd.to_datetime(results_df[['Year', 'Month', 'Day']]) + pd.to_timedelta(results_df['Hour'], unit='h')
    
    # Save sample for dashboard
    sample_data = results_df[['Date', 'Actual', 'Predicted']].tail(200)
    sample_data['Date'] = sample_data['Date'].astype(str)
    sample_data.to_json('artifacts/forecast_sample.json', orient='records')

    print("Success. Artifacts saved to Dashboard/backend/artifacts/")

if __name__ == "__main__":
    train_model()
