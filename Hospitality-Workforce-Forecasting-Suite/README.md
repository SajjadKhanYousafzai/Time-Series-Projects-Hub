<div align="center">

# 🏨 Hospitality Workforce Forecasting Suite

### *End-to-End Time Series Forecasting for California's Hospitality Industry*

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io)
[![statsmodels](https://img.shields.io/badge/statsmodels-0.14-4B8BBE?style=for-the-badge)](https://statsmodels.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br/>

> **Seasonal Patterns · Economic Cycles · Multi-Model Forecasting · Workforce Planning**
>
> Comprehensive analysis of monthly employment data across **28 years** of California hospitality industry data
>
> 📅 **January 1990 → December 2018** &nbsp;·&nbsp; 📊 **348 monthly observations** &nbsp;·&nbsp; 🤖 **3 Forecasting Models**

</div>

---

## 📋 Table of Contents

- [✨ Live Services](#-live-services)
- [📦 Architecture](#-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [📑 Dataset](#-dataset)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📓 Notebook Walkthrough](#-notebook-walkthrough)
- [🤖 Forecasting Models](#-forecasting-models)
- [💡 Key Findings](#-key-findings)
- [📂 API Reference](#-api-reference)
- [🐳 Docker Deployment](#-docker-deployment)
- [⚠️ Disclaimer](#️-disclaimer)

---

## ✨ Live Services

| Service | URL | Description |
|---------|-----|-------------|
| 📊 **Streamlit Dashboard** | [localhost:8501](http://localhost:8501) | Interactive analytics — amber/gold dark theme |
| ⚡ **FastAPI Backend** | [localhost:8000/docs](http://localhost:8000/docs) | Swagger UI with all endpoints |
| 🔴 **Redis Cache** | localhost:6379 | Response caching layer |

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│          ┌───────────────────────────────────────┐              │
│          │        Streamlit Dashboard             │              │
│          │  Home · Overview · Decompose · Forecast│              │
│          └──────────────┬────────────────────────┘              │
└─────────────────────────┼───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                       API LAYER                                 │
│          FastAPI + Uvicorn  (Port 8000)                         │
│   /health · /history · /decompose · /stationarity · /predict   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                   DATA & MODEL LAYER                            │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ src/data │  │ src/features │  │       src/models         │  │
│  │ load·    │  │ decomposition│  │ SARIMA · Holt-Winters ·  │  │
│  │ clean·   │  │ stationarity │  │ Seasonal Naive · evaluate│  │
│  │ store    │  └──────────────┘  └──────────────────────────┘  │
│  └──────────┘                                                   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    STORAGE LAYER                                │
│   data/raw/HospitalityEmployees.csv → data/processed/*.parquet  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
Hospitality-Workforce-Forecasting-Suite/
│
├── 📁 .github/workflows/
│   ├── ci.yml                    # Lint → Test → Coverage → Docker build
│   └── deploy-vercel.yml         # Auto-deploy frontend on push to main
│
├── 📁 config/
│   ├── settings.py               # Pydantic BaseSettings (all env vars)
│   ├── logging.yaml              # Structured YAML logging config
│   └── model_params.yaml         # SARIMA, Holt-Winters hyperparameters
│
├── 📁 data/
│   ├── raw/HospitalityEmployees.csv   # Source data (348 monthly records)
│   ├── processed/                     # hospitality.parquet (pipeline output)
│   └── interim/                       # Mid-pipeline files
│
├── 📁 deployment/
│   ├── docker/Dockerfile.api          # Multi-stage FastAPI image
│   └── docker/Dockerfile.dashboard   # Streamlit image
│
├── 📁 docs/
│   ├── architecture.md
│   ├── api_reference.md
│   └── deployment.md
│
├── 📁 images/screenshots/        # App UI screenshots
│
├── 📁 notebooks/
│   ├── exploratory/Hospitality.ipynb   # Full analysis notebook
│   ├── experiments/                    # Model experiment outputs
│   └── reports/                        # 📄 PDF report
│
├── 📁 scripts/
│   ├── run_all.py                # Full pipeline: load → clean → store
│   └── generate_report.py        # PDF report generator
│
├── 📁 src/
│   ├── data/                     # load.py · clean.py · store.py
│   ├── features/                 # decomposition.py · stationarity.py
│   ├── models/                   # sarima · holtwinters · naive · evaluate
│   ├── api/                      # FastAPI main · schemas · routers
│   ├── dashboard/                # Streamlit 4-page app
│   ├── visualization/            # Plotly amber-theme charts
│   └── utils/                    # logger.py · helpers.py
│
├── 📁 tests/
│   ├── fixtures/conftest.py      # Synthetic monthly series fixtures
│   ├── unit/                     # test_load · test_models
│   └── integration/              # test_pipeline.py
│
├── docker-compose.yml            # pipeline + api + dashboard + redis
├── Makefile                      # 15+ dev targets
├── pyproject.toml                # Project metadata + tool config
├── requirements.txt              # Production dependencies
├── requirements-dev.txt          # Dev/test dependencies
├── .env.example                  # Environment variable template
└── .gitignore                    # Excludes secrets, Parquet, __pycache__
```

---

## 📑 Dataset

**Source:** California Employment Development Department via [Kaggle](https://www.kaggle.com/)

| Field | Value |
|-------|-------|
| **Region** | California, United States |
| **Industry** | Hospitality & Tourism |
| **Metric** | Monthly employment (thousands of workers) |
| **Frequency** | Monthly averages |
| **Period** | January 1990 – December 2018 |
| **Records** | 348 data points |
| **Missing values** | None |

### Engineered Features

| Feature | Description |
|---------|-------------|
| `log_return` | `ln(emp_t / emp_{t-1})` — stationary modelling target |
| `rolling_mean_12` | 12-month rolling mean (trend proxy) |
| `rolling_std_12` | 12-month rolling std (volatility) |
| `yoy_change` | Year-over-year % change |
| `seasonal_index` | Monthly avg / overall mean (seasonality strength) |
| `drawdown` | Distance from rolling maximum (recession depth) |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Data** | Python · PyArrow | Ingest, clean, store as Parquet |
| **Features** | Pandas · NumPy · statsmodels | Decomposition & stationarity engineering |
| **Models** | statsmodels · scikit-learn | SARIMA, Holt-Winters, Seasonal Naive |
| **API** | FastAPI · Uvicorn · Pydantic v2 | REST endpoints with Swagger UI |
| **Dashboard** | Streamlit · Plotly | Amber-themed interactive analytics |
| **Testing** | pytest · pytest-cov | Unit + integration tests |
| **CI/CD** | GitHub Actions | Lint → test → build → deploy |
| **Containers** | Docker · Docker Compose | Reproducible multi-service stack |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Git

### 1 — Clone the Repository

```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd Time-Series-Projects-Hub/Hospitality-Workforce-Forecasting-Suite
```

### 2 — Install Dependencies

```bash
pip install -r requirements.txt
# Dev/test tools (optional)
pip install -r requirements-dev.txt
```

### 3 — Run the Data Pipeline

```bash
python scripts/run_all.py
# Loads CSV → cleans → saves data/processed/hospitality.parquet
```

### 4 — Start Services

```bash
# FastAPI Backend (http://localhost:8000/docs)
python -m uvicorn src.api.main:app --reload

# Streamlit Dashboard (http://localhost:8501)
python -m streamlit run src/dashboard/app.py
```

### 5 — Or Use Makefile

```bash
make install       # Install deps
make pipeline      # Run data pipeline
make api           # Start FastAPI :8000
make dashboard     # Start Streamlit :8501
make test          # Run all tests
make docker-up     # Full Docker stack
```

### 6 — Run Tests

```bash
pytest tests/ -v --cov=src --cov-report=term-missing
```

---

## 📓 Notebook Walkthrough

The original research notebook lives at [`notebooks/exploratory/Hospitality.ipynb`](notebooks/exploratory/Hospitality.ipynb) and covers **11 detailed sections**:

### Part 0 — Setup & Data Loading

| Section | Content |
|---------|---------|
| **1 — Setup** | Library installs, plot styles, random seeds |
| **2 — Data Loading** | Load & parse the alternating-line CSV format |
| **3 — Data Quality** | Missing values, anomaly detection, date coverage |

### Part 1 — Exploratory Data Analysis

| # | Sub-section | Key Visualisations |
|---|-------------|-------------------|
| 4 | **EDA Overview** | 28-year trend, summary statistics |
| 5 | **Seasonality** | Month-of-year bar charts, seasonal indices |
| 6 | **Economic Cycles** | Recession markers (2001, 2008–09), YoY change |
| 7 | **Stationarity** | ADF + KPSS tests, rolling mean & std |

### Part 2 — Time Series Analysis

| Section | Content |
|---------|---------|
| **8 — Decomposition** | Additive classical decomposition: trend + seasonal + residual |
| **9 — ACF / PACF** | Autocorrelation analysis · SARIMA parameter selection |

### Part 3 — Forecasting Models

| Section | Model | Key Outputs |
|---------|-------|-------------|
| **10** | SARIMA(1,1,1)(1,1,1,12) | AIC-optimal · residual diagnostics · 4 statistical tests |
| **11** | Holt-Winters | Triple exponential smoothing · additive seasonality |
| **12** | Seasonal Naive | Baseline benchmark · same month last year |

### Part 4 — Evaluation & Insights

| Section | Content |
|---------|---------|
| **13 — Model Comparison** | MAE / RMSE / MAPE bar charts · model ranking table |
| **14 — Cross-Validation** | 5-fold rolling window CV · mean ± std metrics |
| **15 — Future Forecasts** | 24-month forecasts with 95% CI shaded bands |
| **16 — Executive Summary** | Business-focused insights, deployment guidance |

---

## 🤖 Forecasting Models

| Model | Type | Parameters | Best For |
|-------|------|-----------|---------|
| **SARIMA** | Classical statistical | (1,1,1)(1,1,1,12) | Captures both trend and seasonal patterns; MAPE < 3% |
| **Holt-Winters** | Exponential smoothing | Additive trend + seasonality | Simpler alternative, competitive accuracy |
| **Seasonal Naive** | Baseline benchmark | s = 12 | Lower bound for comparison |

**Evaluation Metrics:** `MAE` · `RMSE` · `MAPE`

**Validation:** 80/20 chronological train/test split + 5-fold rolling window cross-validation

---

## 💡 Key Findings

> *From 28 years of monthly California hospitality employment data:*

1. 📈 **Long-term Growth** — Employment grew **88%** from 1,065K (1990) to 2,000K (2018), driven by California's booming tourism sector.

2. ☀️ **Strong Seasonality** — Consistent **summer peaks** (July–August) and **winter troughs** (January) every single year for 28 consecutive years. Seasonal amplitude ≈ ±120K workers.

3. 💥 **Recession Impacts** — The 2008–09 financial crisis caused the steepest decline: **−7.2% YoY** (1,611K → 1,526K). The 2001 dot-com recession caused a smaller dip of ~2.5%.

4. 🔬 **Non-Stationarity** — Raw employment levels have a unit root (ADF fails). First-differenced log returns are weakly stationary — the correct modelling target.

5. 🏆 **Best Model** — **SARIMA(1,1,1)(1,1,1,12)** achieves MAPE ≈ **2.8%** (typical error ±13K workers). Outperforms Holt-Winters (MAPE ≈ 3.1%) and Seasonal Naive (MAPE ≈ 4.5%).

6. ✅ **Residual Diagnostics** — SARIMA residuals pass all 4 statistical tests: Shapiro-Wilk (normality), Ljung-Box (no autocorrelation), Durbin-Watson, and Jarque-Bera.

7. 🔁 **Robust Cross-Validation** — 5-fold rolling CV confirms stable SARIMA performance across 1990s, 2000s, and 2010s economic regimes.

8. 📅 **Seasonal Planning Value** — Forecasts are most reliable for 1–12 month horizons. Useful for summer hiring cycles (March for July peaks) and winter staffing reduction planning.

9. 📊 **Holt-Winters as Alternative** — When interpretability and speed matter more than maximum accuracy, Holt-Winters is the preferred simpler alternative.

10. 🎯 **Business Impact** — Accurate 24-month forecasts enable proactive workforce planning: anticipate +15–20% summer demand, prepare for post-recession recovery curves.

---

## 📂 API Reference

FastAPI backend at `http://localhost:8000`. Full interactive docs at `/docs`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check + record count |
| `GET` | `/api/v1/history` | Full employment history (filterable by date) |
| `GET` | `/api/v1/decompose` | Seasonal decomposition components |
| `GET` | `/api/v1/stationarity` | ADF + KPSS test results |
| `POST` | `/api/v1/predict` | Run SARIMA / Holt-Winters / Naive forecast |

### Example — Run a SARIMA Forecast

```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"model": "sarima", "horizon": 24, "confidence": 0.95}'
```

---

## 🐳 Docker Deployment

```bash
# 1. Copy environment template (REQUIRED)
cp .env.example .env

# 2. Start full stack — pipeline runs first automatically
docker compose up --build
```

**What happens automatically:**
1. 🔄 **`pipeline`** service loads CSV → cleans → generates `data/processed/hospitality.parquet`
2. ⚡ **`api`** service starts once pipeline succeeds → `http://localhost:8000`
3. 📊 **`dashboard`** service starts once API is healthy → `http://localhost:8501`
4. 🔴 **`redis`** service starts in parallel → cache at `localhost:6379`

```bash
docker compose down      # Stop all services
docker compose down -v   # Also remove volumes
```

---

## 📜 Data Source & License

- **Source:** California Employment Development Department · Yahoo Finance historical series
- **Dataset:** Monthly hospitality employment (thousands), California, 1990–2018
- **License:** MIT — Educational and research use
- **References:**
  - Hyndman & Athanasopoulos (2021). *Forecasting: Principles and Practice*
  - Box, Jenkins & Reinsel (2015). *Time Series Analysis: Forecasting and Control*

---

## ⚠️ Disclaimer

All forecasts and analysis are **for educational and research purposes only**. Economic conditions change — past seasonal patterns and trends do not guarantee future employment levels. Nothing here constitutes financial, labour, or business advice.

---

<div align="center">

**Built with ❤️ by [Sajjad Khan Yousafzai](https://github.com/SajjadKhanYousafzai)**

*Hospitality Workforce Forecasting Suite · Data: CA Employment Development Dept · 1990–2018*

[![Star this repo](https://img.shields.io/github/stars/SajjadKhanYousafzai/Time-Series-Projects-Hub?style=social)](https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub)

</div>
