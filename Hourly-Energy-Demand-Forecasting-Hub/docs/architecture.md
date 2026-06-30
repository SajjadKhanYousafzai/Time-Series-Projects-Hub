# Architecture — Hourly Energy Demand Forecasting Hub

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Data Sources (PJM / Kaggle)                       │
│  AEP · COMED · DAYTON · DEOK · DOM · DUQ · EKPC · FE · NI         │
│  PJME · PJMW · PJM_LOAD · PJM_EST                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ CSV / Parquet
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Data Layer  (src/data/)                          │
│  load.py → clean.py → store.py                                      │
│  load_region() → basic_clean() → save_parquet()                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ data/processed/{REGION}.parquet
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Feature Engineering  (src/features/)                │
│  time_features.py  — 31+ features: lag, rolling, cyclical, flags   │
│  stationarity.py   — ADF · KPSS · differencing                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ feature matrix
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Modelling  (src/models/)                         │
│  arima_model.py   — ARIMA(p,d,q) / SARIMA statistical model        │
│  xgboost_model.py — Gradient-boosted tree with time features        │
│  lstm_model.py    — Pre-trained Keras LSTM (AEP, 168h lookback)    │
│  evaluate.py      — MAE · RMSE · MAPE · rolling CV                 │
└────────────┬────────────────────────────────────────────────────────┘
             │                          │
             ▼                          ▼
┌────────────────────────┐   ┌──────────────────────────┐
│   FastAPI REST API     │   │  Streamlit Dashboard     │
│   src/api/             │   │  src/dashboard/app.py    │
│   :8000/docs           │   │  :8501                   │
└────────────────────────┘   └──────────────────────────┘
```

## Component Design

### src/data/
- `load.py` — `load_region(region, raw_dir, freq)` → DataFrame
- `clean.py` — `basic_clean()` orchestrates 4 cleaning steps
- `store.py` — `save_parquet()` / `load_parquet()` using PyArrow + Snappy

### src/features/
- `time_features.py` — `add_time_features(df)` adds 31+ columns in one pass
- `stationarity.py` — returns `StationarityResult` dataclass with interpretation

### src/models/
- All forecasters implement `.fit(train)` → self and `.forecast(steps)` → Result
- `evaluate.py` provides `rolling_cross_validate(series, model_factory, n_folds)`

### src/api/
- FastAPI + Pydantic v2 schemas
- Routers: `health.py` · `history.py` · `predict.py`
- CORS enabled for dashboard ↔ API communication

### src/dashboard/
- 4 pages in a single `app.py` using `st.radio()` navigation
- Cached data loading with `@st.cache_data(ttl=3600)`
- Dark amber theme via custom CSS

## Configuration

All tuneable values live in:
- `config/settings.py` — Pydantic BaseSettings (env var override)
- `config/model_params.yaml` — hyperparameters
- `config/logging.yaml` — rotating file handler + console

## Data Flow Diagram

```
Data/raw/AEP_hourly.csv
        │
        ├── load_region("AEP")
        │         ↓
        │   parse_dates, set freq='h', rename MW
        │         ↓
        ├── basic_clean(df)
        │         ↓
        │   validate → deduplicate → fill_gaps → outlier_detection
        │         ↓
        ├── save_parquet(df, "AEP")
        │         ↓
        │   data/processed/AEP.parquet
        │         ↓
        ├── add_time_features(df)
        │         ↓
        │   31 feature columns appended
        │         ↓
        └── ARIMAForecaster().fit(train).forecast(24)
                  ↓
            ARIMAResult(forecast, ci_lower, ci_upper, residuals)
```
