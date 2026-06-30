# ⚡ Hourly Energy Demand Forecasting Hub

<div align="center">

![Energy Banner](images/screenshots/banner.jpg)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28-red?logo=streamlit)](https://streamlit.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/SajjadKhanYousafzai/Time-Series-Projects-Hub/ci.yml?label=CI)](https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub/actions)

**Production-grade hourly energy demand forecasting for 11 PJM regional grids.**  
End-to-end ML pipeline: data ingestion → cleaning → feature engineering → ARIMA · XGBoost · LSTM → REST API → Streamlit dashboard.

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Dataset](#-dataset)
- [Quick Start](#-quick-start)
- [Pipeline](#-pipeline)
- [Models](#-models)
- [API Reference](#-api-reference)
- [Dashboard](#-dashboard)
- [Testing](#-testing)
- [Docker](#-docker)
- [Results](#-results)
- [Author](#-author)

---

## 🌍 Overview

**PJM Interconnection LLC** is one of the world's largest grid operators, coordinating the movement of wholesale electricity across 13 US states and the District of Columbia.

This project provides a **complete, production-ready time series forecasting system** for PJM's hourly energy consumption data. It extends traditional notebook-based analysis into a fully modular, testable, and deployable system.

### Key Features

| Feature | Details |
|---------|---------|
| **Regions** | 11 PJM regions — AEP, COMED, DAYTON, DEOK, DOM, DUQ, EKPC, FE, NI, PJME, PJMW |
| **Data** | ~1M+ hourly records spanning multiple decades |
| **Models** | ARIMA · XGBoost · LSTM (AEP pre-trained) |
| **Validation** | 5-fold rolling cross-validation |
| **API** | FastAPI REST with Swagger docs |
| **Dashboard** | Streamlit 4-page interactive app |
| **CI/CD** | GitHub Actions (lint → test → docker build) |

---

## 📁 Project Structure

```
Hourly-Energy-Demand-Forecasting-Hub/
│
├── 📁 .github/workflows/
│   └── ci.yml                    # Lint → Test → Coverage → Docker Build
│
├── 📁 config/
│   ├── settings.py               # Pydantic BaseSettings
│   ├── model_params.yaml         # ARIMA / XGBoost / LSTM hyperparameters
│   └── logging.yaml              # Rotating file + console logging
│
├── 📁 datasets/
│   ├── raw/                      # 14 original CSV/Parquet files
│   ├── processed/                # Cleaned region parquets
│   └── interim/                  # Mid-pipeline snapshots
│
├── 📁 deployment/docker/
│   ├── Dockerfile.api            # FastAPI image
│   └── Dockerfile.dashboard      # Streamlit image
│
├── 📁 docs/
│   ├── architecture.md
│   ├── api_reference.md
│   └── deployment.md
│
├── 📁 images/screenshots/
│   └── banner.jpg
│
├── 📁 models/
│   └── AEP/
│       ├── lstm_model/           # SavedModel (Keras/TF)
│       ├── feature_cols.json
│       ├── model_metrics.json
│       └── test_predictions.csv
│
├── 📁 notebooks/
│   ├── exploratory/              # 11 region-specific EDA notebooks
│   ├── experiments/              # Model experiment outputs
│   └── reports/                  # PDF reports
│
├── 📁 src/
│   ├── data/
│   │   ├── load.py               # load_region(), list_regions()
│   │   ├── clean.py              # basic_clean(), detect_outliers()
│   │   └── store.py              # save_parquet(), load_parquet()
│   ├── features/
│   │   ├── time_features.py      # 31+ features: lag, rolling, cyclical
│   │   └── stationarity.py       # ADF / KPSS / make_stationary()
│   ├── models/
│   │   ├── arima_model.py        # ARIMAForecaster class
│   │   ├── lstm_model.py         # LSTMForecaster (Keras wrapper)
│   │   ├── xgboost_model.py      # XGBoostForecaster class
│   │   └── evaluate.py           # MAE / RMSE / MAPE / rolling CV
│   ├── visualization/
│   │   └── charts.py             # Plotly dark-amber chart library
│   ├── api/
│   │   ├── main.py               # FastAPI app
│   │   ├── schemas.py            # Pydantic v2 schemas
│   │   └── routers/
│   │       ├── health.py         # GET /api/v1/health
│   │       ├── history.py        # GET /api/v1/history
│   │       └── predict.py        # POST /api/v1/predict
│   └── dashboard/
│       └── app.py                # Streamlit 4-page dashboard
│
├── 📁 scripts/
│   └── run_pipeline.py           # Load → clean → store all regions
│
├── 📁 tests/
│   ├── fixtures/conftest.py      # Synthetic hourly series fixtures
│   ├── unit/                     # test_load · test_clean · test_models
│   └── integration/              # test_pipeline (requires real data)
│
├── docker-compose.yml            # api + dashboard + redis
├── Makefile                      # 15+ task automation targets
├── pyproject.toml                # Build config + ruff + pytest
├── requirements.txt              # Production dependencies
├── requirements-dev.txt          # Test + lint + API + dashboard tools
├── .env.example                  # Environment variable template
├── .gitignore
└── README.md
```

---

## 📊 Dataset

| Field | Value |
|-------|-------|
| **Source** | [Kaggle — Hourly Energy Consumption](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption) |
| **Unit** | Megawatts (MW) |
| **Frequency** | Hourly |
| **Format** | CSV + Parquet |

### Regions

| Key | Provider | States |
|-----|---------|--------|
| `AEP` | American Electric Power | OH, WV, VA, MI, IN, KY, TN |
| `COMED` | Commonwealth Edison | IL |
| `DAYTON` | Dayton Power & Light | OH |
| `DEOK` | Duke Energy Ohio/Kentucky | OH, KY |
| `DOM` | Dominion Energy | VA, NC |
| `DUQ` | Duquesne Light | PA |
| `EKPC` | East Kentucky Power | KY |
| `FE` | FirstEnergy | OH, PA, NJ, WV, MD |
| `NI` | Northern Illinois | IL |
| `PJME` | PJM East | DE, MD, NJ, PA, VA, DC |
| `PJMW` | PJM West | OH, IN, IL, MI, WI, MO |

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd Hourly-Energy-Demand-Forecasting-Hub

pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 2. Run the Data Pipeline

```bash
# Process all regions
python scripts/run_pipeline.py

# Process a single region
python scripts/run_pipeline.py --region AEP

# Or via Makefile
make pipeline
make pipeline-one REGION=PJME
```

### 3. Start the API

```bash
make api
# → http://localhost:8000/docs
```

### 4. Start the Dashboard

```bash
make dashboard
# → http://localhost:8501
```

---

## 🔄 Pipeline

```
Raw CSV  →  load_region()  →  basic_clean()  →  save_parquet()
                ↓                   ↓
         DatetimeIndex       remove_duplicates()
         freq='h'            fill_gaps()
         'MW' column         detect_outliers(z>5σ)
```

### Feature Engineering (31+ features)

| Category | Features |
|----------|---------|
| **Calendar** | hour · day_of_week · day_of_month · day_of_year · week · month · quarter · year |
| **Derived** | season · season_num · is_weekend · is_weekday · is_holiday · is_business_hour · is_peak_hour · is_night |
| **Cyclical** | hour_sin · hour_cos · month_sin · month_cos · dow_sin · dow_cos |
| **Lag** | lag_1 · lag_24 · lag_48 · lag_168 · lag_8760 |
| **Rolling** | rolling_mean_24 · rolling_std_24 · rolling_mean_168 · rolling_std_168 · rolling_min_24 · rolling_max_24 |
| **Derived** | log_MW · diff_1 · diff_24 · pct_change_24 |

---

## 🤖 Models

### ARIMA
- **Class**: `ARIMAForecaster(order=(1,1,1))`
- **Seasonal variant**: Set `seasonal_order=(P,D,Q,24)` for daily seasonality
- **Strengths**: Interpretable, fast, good for short horizons (≤24h)

### XGBoost
- **Class**: `XGBoostForecaster(n_estimators=1000, max_depth=6)`
- **Uses**: All 31+ time features as inputs
- **Strengths**: Handles non-linearity, feature importance, longer horizons

### LSTM (AEP Pre-trained)
- **Class**: `LSTMForecaster(region="AEP")`
- **Lookback**: 168 hours (1 week), Horizon: 24 hours
- **Location**: `models/AEP/lstm_model/` (Keras SavedModel format)
- **Requires**: `pip install tensorflow`

### Evaluation

```python
from src.models.evaluate import compute_metrics, rolling_cross_validate
metrics = compute_metrics(y_true, y_pred, model_name="ARIMA")
# → MetricsResult(mae=..., rmse=..., mape=...)
```

| Model | MAE | RMSE | MAPE |
|-------|-----|------|------|
| ARIMA(1,1,1) | ~200 MW | ~280 MW | ~1.8% |
| XGBoost | ~120 MW | ~165 MW | ~1.1% |
| LSTM (AEP) | ~95 MW | ~130 MW | ~0.8% |

---

## 🌐 API Reference

```bash
# Health check
GET  /api/v1/health

# List regions
GET  /api/v1/regions

# Historical data
GET  /api/v1/history?region=AEP&limit=168

# Forecast
POST /api/v1/predict
{
  "region":     "AEP",
  "model":      "arima",
  "horizon":    24,
  "confidence": 0.95
}
```

📖 Full docs at `http://localhost:8000/docs` (Swagger UI)

---

## 📐 Dashboard Pages

| Page | Content |
|------|---------|
| **🏠 Home** | Project overview · dataset summary · pipeline diagram |
| **📊 Data Explorer** | Time series · hourly profile · seasonal heatmap |
| **🤖 Forecast** | Run ARIMA / Seasonal Naive forecasts · metrics |
| **📐 Analysis** | Decomposition · ADF/KPSS tests · ACF/PACF |

---

## 🧪 Testing

```bash
# All tests with coverage
make test

# Unit tests only (fast, no data required)
make test-unit

# Integration tests (requires data/raw/ populated)
make test-int
```

Test structure:

```
tests/
├── fixtures/conftest.py   # Synthetic 8760-hour series
├── unit/
│   ├── test_load.py       # Region loader tests
│   ├── test_clean.py      # Cleaning pipeline tests
│   └── test_models.py     # ARIMA · evaluate · features tests
└── integration/
    └── test_pipeline.py   # End-to-end: load → clean → store → reload
```

---

## 🐳 Docker

```bash
# Build all images
make docker-build

# Start all services (API + Dashboard + Redis)
make docker-up

# View logs
make docker-logs

# Stop
make docker-down
```

**Services:**

| Service | Port | Description |
|---------|------|-------------|
| `api` | 8000 | FastAPI REST server |
| `dashboard` | 8501 | Streamlit dashboard |
| `redis` | 6379 | API response cache |

---

## 📈 Key Findings

- **Peak hours**: 3–7 PM (summer cooling load) and 6–9 AM (winter heating)
- **Seasonal patterns**: Summer > Winter > Spring/Fall by ~15%
- **Weekend effect**: -12% demand vs weekdays (strongest in commercial regions)
- **PJME correlates strongly** with COMED (r=0.91) and AEP (r=0.89)
- **XGBoost outperforms ARIMA** by ~40% on RMSE for horizons > 6h
- **LSTM (AEP)** achieves sub-1% MAPE on the test set

---

## 👨‍💻 Author

**Sajjad Ali Shah**

- 🔗 LinkedIn: [Sajjad Ali Shah](https://www.linkedin.com/in/sajjad-ali-shah47/)
- 🐙 GitHub: [SajjadKhanYousafzai](https://github.com/SajjadKhanYousafzai)

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- Dataset: [Kaggle — Rob Mulla](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption)
- PJM Interconnection LLC for maintaining and providing the data

---

<div align="center">
  <strong>⭐ If you find this project helpful, please give it a star! ⭐</strong>
</div>
