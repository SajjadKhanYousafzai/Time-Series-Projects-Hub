# 🚀 Crypto Market Intelligence — End-to-End Forecasting & Analysis

> **Volatility · Correlations · Regime Behavior · Multi-Model Price Forecasting**  
> Comprehensive analysis of daily OHLCV data across 49 leading digital assets  
> Data range: **September 2014 → January 2026** · **112,000+ trading records**

---

## 📋 Project Overview

This project delivers a complete end-to-end pipeline — from raw CSV loading through deep-learning forecasts — covering every dimension of crypto market structure. It is built as a single self-contained Jupyter notebook (`Top_50_crypto.ipynb`) that auto-detects Kaggle vs local environments.

---

## 🗂️ Project Structure

```
Crypto-Market-Intelligence-Hub/
├── Top_50_crypto.ipynb        # Main analysis notebook (23 cells)
├── README.md                  # This file
└── Dataset/
    ├── bitcoin.csv
    ├── ethereum.csv
    ├── solana.csv
    ├── dogecoin.csv
    ├── binance_coin.csv
    ├── cardano.csv
    └── ... (49 CSV files total)
```

---

## 📑 Dataset Schema

Each CSV contains daily OHLCV data from Yahoo Finance (`yfinance`):

| Column | Description |
|--------|-------------|
| **Date** | Trading date (UTC) |
| **Open** | Opening price (USD) |
| **High** | Intraday high price (USD) |
| **Low** | Intraday low price (USD) |
| **Close** | Closing price (USD) |
| **Volume** | Daily trading volume |

> All prices are denominated in USD. Some early-period records may contain zero or missing values.

---

## 📓 Notebook Walkthrough

The notebook is organised into **12 numbered sections** across **23 cells**:

### 🔧 Section 1 — Setup
- Auto-installs missing libraries (`pandas`, `numpy`, `statsmodels`, `prophet`, `tensorflow`)
- Configures plotting styles, random seeds, and display options

### 📦 Section 2 — Data Loading
- Loads all 49 CSVs into a unified long-format DataFrame
- Cleans invalid rows (zero/negative prices), standardises column names
- Engineers features: daily returns, log returns, price range, 30-day rolling volatility

### 🔍 Section 3 — Data Quality & Coverage
- Coverage bar chart per asset (trading days available)
- Missing value percentages per column
- Identifies assets with data gaps or anomalies

---

### 📊 Part 1 — Exploratory Data Analysis (8 sub-sections)

| # | Sub-section | Visualisations |
|---|-------------|----------------|
| 4 | **Market Overview** | Price tier pie chart, top-20 price bar, log-price histogram |
| 5 | **Price Trends** | Historical close + ATH markers for 8 assets (fill-between) |
| 6 | **Returns Analysis** | Log-return distribution, box plots, cumulative return (BTC vs ETH), kurtosis ranking, monthly heatmap, day-of-week bar |
| 7 | **Volatility Regimes** | Market-wide rolling vol timeline, asset vol ranking, per-asset rolling vol, ARCH ACF |
| 8 | **Correlation Analysis** | Hierarchically clustered heatmap, 90-day rolling BTC correlation |
| 9 | **Volume Analysis** | Top volume assets, price-volume dual axis, monthly seasonal volume, price-volume correlation |
| 10 | **Performance Metrics** | Total return, max drawdown, risk-return scatter (Sharpe-coloured), Sharpe ratio bar |
| 11 | **Seasonality** | BTC drawdown timeline, monthly pooled returns, YoY BTC returns, normalised base-100 comparison |

---

### 📉 Part 2 — Time Series Analysis

**Section 12 — Stationarity Tests**
- ADF + KPSS tests on price levels vs log returns for 5 major assets
- Multiplicative seasonal decomposition of Bitcoin (last 3 years): trend, seasonal, residual

**Section 13 — ACF / PACF & Forecasting Setup**
- ACF/PACF of BTC log returns and squared returns (volatility clustering evidence)
- Defines evaluation functions (`MAE`, `RMSE`, `MAPE`) and train/test split parameters

---

### 🤖 Part 3 — Forecasting Models

**Section 14 — ARIMA**
- AIC-optimal grid search over `(p, 1, q)` orders (p, q ∈ [0, 3])
- Fits and evaluates on Bitcoin, Ethereum, Solana
- Forecast plots with train/test split marker

**Section 15 — Prophet**
- Multiplicative seasonality with weekly + yearly components
- 80% confidence interval bands on all forecasts
- Components decomposition plot (trend, weekly, yearly) for Bitcoin

**Section 16 — LSTM**
- Stacked 2-layer LSTM with `BatchNormalization` and `Dropout`
- `EarlyStopping` + `ReduceLROnPlateau` callbacks
- Training loss curves (train vs validation)

**Section 17 — GRU**
- Identical architecture to LSTM using GRU cells
- ~30% fewer parameters; comparable accuracy with faster training

---

### 📈 Part 4 — Evaluation & Predictions

**Section 18 — Model Comparison**
- Grouped bar charts: MAE / RMSE / MAPE across all 4 models × 2 assets
- Best model per asset table (ranked by RMSE)
- Average metrics summary table

**Section 19 — Future 30-Day Predictions**
- Refits Prophet on full dataset (no hold-out) for Bitcoin, Ethereum, Solana
- Plots last 90 days of history + 30-day forecast + 80% CI shaded band
- Prints current price, predicted price, and percentage change

**Section 20 — Final Summary & Key Observations**
- Full dataset statistics
- Model performance averages
- Future prediction table
- 10 numbered key observations (see below)

---

## 💡 Key Observations

1. **High-Correlation Universe** — Average cross-asset correlation ≈ 0.7. Most assets rise and fall together; diversification within crypto is structurally limited.
2. **Volatility Clustering (ARCH Effects)** — Strong ACF in squared returns confirms volatility clusters. Bitcoin is the *least volatile* major asset, acting as the market's vol anchor.
3. **Fat-Tailed Returns** — Pooled kurtosis >> 3. Daily moves of ±15% are far more frequent than Gaussian models predict; standard risk frameworks underestimate tail risk.
4. **Seasonal Patterns** — Q4 (Oct–Dec) is historically Bitcoin's strongest quarter (*Uptober*). June–September is consistently the weakest period.
5. **Boom-Bust Cycles** — Despite 100x+ all-time returns, BTC suffered >80% drawdowns in each market cycle. Timing and risk management are critical.
6. **Non-Stationarity** — Raw price series have unit roots (ADF fails). Log returns are weakly stationary and the correct modelling target.
7. **ARIMA** — Best for 1–10 day horizons on lower-cap, lower-price assets. Fast, interpretable, but limited by linear assumptions.
8. **Prophet** — Superior changepoint detection and well-calibrated CIs. Higher MAPE than deep learning but excellent for trend/seasonality decomposition.
9. **LSTM vs GRU** — Both achieve best RMSE for BTC and ETH. GRU is ~30% faster with similar accuracy; both capture nonlinear momentum that ARIMA cannot.
10. **No Universal Winner** — Asset, horizon, and data length all affect model choice. An ensemble of ARIMA + Prophet + LSTM typically outperforms any single model.

---

## 🛠️ Requirements

```
pandas>=2.0
numpy>=1.24
matplotlib>=3.7
seaborn>=0.12
scikit-learn>=1.3
statsmodels>=0.14
prophet>=1.1
tensorflow>=2.12
scipy>=1.10
```

Install all at once:
```bash
pip install pandas numpy matplotlib seaborn scikit-learn statsmodels prophet tensorflow scipy
```

> The notebook also auto-installs any missing package at runtime.

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>

# 2. Navigate to the project folder
cd "Crypto-Market-Intelligence-Hub"

# 3. Open the notebook
jupyter notebook Top_50_crypto.ipynb
# or in VS Code
code Top_50_crypto.ipynb
```

**Kaggle:** Add the [Top 50 Cryptocurrency Dataset](https://www.kaggle.com/datasets/dhrubangtalukdar/top-50-cryptocurrency-dataset) to your notebook — paths are detected automatically.

---

## 🪙 Assets Covered (49 total)

| Category | Examples |
|----------|---------|
| Store of Value | Bitcoin, Litecoin |
| Smart Contract Platforms | Ethereum, Solana, Cardano, Avalanche, Polkadot, Near, Cosmos |
| Exchange Tokens | Binance Coin |
| DeFi | Uniswap, Aave, Maker, Chainlink, Compound |
| Layer 2 | Polygon, Arbitrum, Optimism |
| Meme Coins | Dogecoin, Shiba Inu, Pepe |
| Stablecoins | Tether (USDT), USD Coin (USDC) |
| Other | XRP, Tron, Stellar, Toncoin, Kaspa, Sui, Aptos, and more |

---

## 📜 Data Source & License

- **Source:** Yahoo Finance via `yfinance`
- **License:** Educational and research use
- **Dataset Link:** [Kaggle — Top 50 Cryptocurrency Dataset](https://www.kaggle.com/datasets/dhrubangtalukdar/top-50-cryptocurrency-dataset)

---

## ⚠️ Disclaimer

All forecasts and analysis in this project are **for educational and research purposes only**. Cryptocurrency markets are highly volatile. Nothing here constitutes financial advice. Past performance does not guarantee future results.

---

**Happy Analyzing! 📊💹**
