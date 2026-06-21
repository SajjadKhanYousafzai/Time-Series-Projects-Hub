# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Crypto Market Intelligence Hub                   │
└─────────────────────────────────────────────────────────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
 ┌──────────────┐        ┌──────────────┐        ┌──────────────────┐
 │  Next.js 14  │        │   FastAPI    │        │    Streamlit     │
 │  Frontend    │◄──────►│   Backend    │        │   Dashboard      │
 │  (Vercel)    │  REST  │  Port 8000  │        │   Port 8501      │
 └──────────────┘        └──────┬───────┘        └────────┬─────────┘
                                │                          │
              ┌─────────────────┼──────────────────────────┘
              │                 │
              ▼                 ▼
   ┌──────────────┐    ┌──────────────┐
   │  src/models  │    │  data/raw    │
   │  ARIMA       │    │  49 CSVs     │
   │  Prophet     │    │  Parquet     │
   │  LSTM        │    │  data/       │
   │  GRU         │    │  processed/  │
   └──────────────┘    └──────────────┘
```

## Components

### 1. Data Layer (`src/data/`)
- **`load.py`** — Batch CSV loader for all 49 assets
- **`clean.py`** — OHLCV validation and normalisation
- **`fetch.py`** — Live data from yfinance / CoinGecko
- **`store.py`** — Parquet persistence (per-asset and combined)

### 2. Feature Engineering (`src/features/`)
- **`returns.py`** — Daily/log returns, rolling volatility, drawdown
- **`technical.py`** — RSI, MACD, Bollinger Bands, ATR, OBV
- **`pipeline.py`** — sklearn-compatible transformer + sequence builder

### 3. Model Layer (`src/models/`)
- **`arima_model.py`** — AIC/BIC grid search + statsmodels ARIMA
- **`prophet_model.py`** — Meta Prophet with multiplicative seasonality
- **`lstm_model.py`** — Stacked LSTM (BatchNorm + Dropout + EarlyStopping)
- **`gru_model.py`** — Stacked GRU (same architecture, fewer params)
- **`evaluate.py`** — MAE, RMSE, MAPE, R², Sharpe Ratio
- **`registry.py`** — Model save/load (joblib + TF SavedModel)

### 4. FastAPI Backend (`src/api/`)
- **`/api/v1/health`** — Health check
- **`/api/v1/assets`** — List available assets
- **`/api/v1/history/{asset}`** — Historical OHLCV with date filtering
- **`/api/v1/predict`** — POST to run a model forecast
- **`/api/v1/predict/{asset}`** — GET shorthand (Prophet, 30 days)

### 5. Streamlit Dashboard (`src/dashboard/`)
- **`01_Market_Overview`** — Coverage, correlation heatmap, rolling vol
- **`02_Technical_Analysis`** — Candlestick, RSI, MACD, Bollinger Bands
- **`03_Predictions`** — Interactive model runner with forecast chart

### 6. Next.js Frontend (`frontend/`)
- Dark fintech theme deployed to Vercel
- Connects to FastAPI backend via `NEXT_PUBLIC_API_URL`
- Real-time market data, prediction viewer

## Data Flow

```
Dataset CSVs (data/raw/)
        │
        ▼ load_all()
  Raw DataFrame (long-format)
        │
        ▼ basic_clean()
  Cleaned DataFrame
        │
        ▼ add_return_features() + add_technical_indicators()
  Feature-Engineered DataFrame
        │
        ├──► save_parquet() → data/processed/
        │
        ├──► FastAPI /predict → Model pipeline → ForecastPoint[]
        │
        └──► Streamlit pages → Plotly charts
```

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Python 3.11+ / TypeScript |
| Data | pandas, numpy, pyarrow (Parquet) |
| ML Models | statsmodels, prophet, tensorflow/keras |
| API | FastAPI + uvicorn + pydantic-settings |
| Dashboard | Streamlit + Plotly |
| Frontend | Next.js 14 + Tailwind CSS + shadcn/ui |
| CI/CD | GitHub Actions |
| Deployment | Docker + Docker Compose + Vercel |
| Code Quality | ruff + pre-commit + pytest |
