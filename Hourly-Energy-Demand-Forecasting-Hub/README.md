# ⚡ Hourly Energy Demand Forecasting Analysis

<div align="center">
  <img src="image/12.jpg" alt="Energy Consumption Banner" width="800"/>
</div>

## 📊 Project Overview

This project provides a comprehensive **end-to-end data science pipeline** for analyzing and forecasting **hourly energy consumption** data from **PJM Interconnection LLC (PJM)**, one of the largest regional transmission organizations in the United States. The analysis includes data cleaning, exploratory data analysis (EDA), feature engineering, time series decomposition, visualization, and ARIMA forecasting.

## 🌍 About PJM Interconnection

**PJM Interconnection LLC (PJM)** is a **regional transmission organization (RTO)** operating as part of the **Eastern Interconnection grid** in the United States. It manages electric transmission systems serving multiple states and regions.

### Covered Regions

The dataset includes hourly power consumption data from the following states and districts:

- Delaware
- Illinois
- Indiana
- Kentucky
- Maryland
- Michigan
- New Jersey
- North Carolina
- Ohio
- Pennsylvania
- Tennessee
- Virginia
- West Virginia
- District of Columbia

## 📁 Dataset

- **Source:** [Kaggle - Hourly Energy Consumption](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption/data)
- **Format:** CSV files containing hourly power consumption data
- **Measurement Unit:** Megawatts (MW)
- **Time Period:** Varies by region (regions have changed over the years)

### Available Regional Data Files

- `AEP_hourly.csv` - American Electric Power
- `COMED_hourly.csv` - Commonwealth Edison
- `DAYTON_hourly.csv` - Dayton Power & Light
- `DEOK_hourly.csv` - Duke Energy Ohio/Kentucky
- `DOM_hourly.csv` - Dominion Energy
- `DUQ_hourly.csv` - Duquesne Light
- `EKPC_hourly.csv` - East Kentucky Power Cooperative
- `FE_hourly.csv` - FirstEnergy
- `NI_hourly.csv` - Northern Illinois Hub
- `PJME_hourly.csv` - PJM East
- `PJMW_hourly.csv` - PJM West
- `PJM_Load_hourly.csv` - PJM Load
- `pjm_hourly_est.csv` - PJM Estimated
- `est_hourly.parquet` - Additional estimated data

## 🎯 Project Objectives

1. **Data Loading & Preprocessing:** Load and clean multiple regional datasets
2. **Feature Engineering:** Create time-based features (hour, day, month, season, weekday/weekend)
3. **Exploratory Data Analysis (EDA):** Perform statistical analysis and visualization
4. **Correlation Analysis:** Identify relationships between different regional consumption patterns
5. **Peak Hour Analysis:** Determine peak consumption times across regions
6. **Time Series Decomposition:** Analyze trend, seasonality, and residuals
7. **Seasonal Trend Analysis:** Compare consumption patterns across different seasons
8. **ARIMA Forecasting:** Build predictive models for 24-hour energy consumption forecasts
9. **Model Evaluation:** Assess forecast accuracy using MAE and RMSE metrics

## 📓 Available Notebooks

### General Overview
- **`Time_series.ipynb`** - Comprehensive analysis comparing all regional datasets

### Individual Dataset Analysis (All_Notesbook/)
Each notebook provides a complete time series analysis for its respective dataset:

| Notebook | Dataset | Description |
|----------|---------|-------------|
| **AEP_time_series.ipynb** | AEP | American Electric Power |
| **COMED_time_series.ipynb** | COMED | Commonwealth Edison |
| **DAYTON_time_series.ipynb** | DAYTON | Dayton Power & Light |
| **DEOK_time_series.ipynb** | DEOK | Duke Energy Ohio/Kentucky |
| **DOM_time_series.ipynb** | DOM | Dominion Energy |
| **DUQ_time_series.ipynb** | DUQ | Duquesne Light |
| **EKPC_time_series.ipynb** | EKPC | East Kentucky Power Cooperative |
| **FE_time_series.ipynb** | FE | FirstEnergy |
| **NI_time_series.ipynb** | NI | Northern Indiana Public Service Company |
| **PJME_time_series.ipynb** | PJME | PJM East |
| **PJMW_time_series.ipynb** | PJMW | PJM West |

Each individual notebook includes:
- ✅ Data loading and preparation
- ✅ Time series visualization (full, yearly, weekly patterns)
- ✅ Feature engineering (31+ features)
- ✅ Temporal pattern analysis
- ✅ Stationarity testing (ADF & KPSS)
- ✅ Autocorrelation analysis (ACF & PACF)
- ✅ Time series decomposition (trend, seasonal, residual)

## 🛠️ Technologies & Libraries

- **Python 3.x**
- **Data Manipulation:** `pandas`, `numpy`
- **Visualization:** `matplotlib`, `seaborn`
- **Time Series Analysis:** `statsmodels`
- **Forecasting:** `ARIMA` (from statsmodels)
- **Model Evaluation:** `sklearn.metrics`

## 📋 Prerequisites

```bash
pip install pandas numpy matplotlib seaborn statsmodels scikit-learn scipy
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

## ⚡ Quick Start

### Option 1: Compare All Regions (Recommended for Overview)
Open `Time_series.ipynb` to see comparative analysis across all energy regions.

### Option 2: Analyze Individual Regions (Detailed Analysis)
Navigate to `All_Notesbook/` and open any region-specific notebook:
- **PJME_time_series.ipynb** - Analyze PJM East region
- **AEP_time_series.ipynb** - Analyze American Electric Power
- **COMED_time_series.ipynb** - Analyze Commonwealth Edison
- And more... (see full list above)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
   cd "Hourly-Energy-Demand-Forecasting-Hub"
   ```

2. **Ensure data files are in the Data folder:**
   ```
   Hourly-Energy-Demand-Forecasting-Hub/
   ├── All_Notesbook/
   │   ├── AEP_time_series.ipynb
   │   ├── COMED_time_series.ipynb
   │   ├── DAYTON_time_series.ipynb
   │   ├── DEOK_time_series.ipynb
   │   ├── DOM_time_series.ipynb
   │   ├── DUQ_time_series.ipynb
   │   ├── EKPC_time_series.ipynb
   │   ├── FE_time_series.ipynb
   │   ├── NI_time_series.ipynb
   │   ├── PJME_time_series.ipynb
   │   └── PJMW_time_series.ipynb
   ├── Data/
   │   ├── AEP_hourly.csv
   │   ├── COMED_hourly.csv
   │   ├── DAYTON_hourly.csv
   │   ├── DEOK_hourly.csv
   │   ├── DOM_hourly.csv
   │   ├── DUQ_hourly.csv
   │   ├── EKPC_hourly.csv
   │   ├── FE_hourly.csv
   │   ├── NI_hourly.csv
   │   ├── PJME_hourly.csv
   │   ├── PJMW_hourly.csv
   │   ├── PJM_Load_hourly.csv
   │   ├── pjm_hourly_est.csv
   │   └── est_hourly.parquet
   ├── image/
   │   └── 12.jpg
   ├── README.md
   ├── requirements.txt
   └── Time_series.ipynb
   ```

3. **Run the Jupyter Notebooks:**
   
   **General Overview:**
   ```bash
   jupyter notebook Time_series.ipynb
   ```
   
   **Individual Dataset Analysis (in All_Notesbook folder):**
   ```bash
   cd All_Notesbook
   jupyter notebook PJME_time_series.ipynb  # Or any other dataset
   ```

## 📈 Analysis Pipeline

### 1. Data Loading
Load all regional CSV files into a dictionary for easy access and processing.

### 2. Feature Engineering
Add time-based features to enhance analysis:
- Year, Month, Day, Hour
- Day of Week
- Weekend/Weekday indicator
- Quarter
- Season (Winter, Spring, Summer, Fall)

### 3. Descriptive Statistics
Generate comprehensive statistical summaries for each region using `describe()`.

### 4. Correlation Analysis
Analyze and visualize correlations between key regions (PJME, PJM_Load, AEP, DOM) using heatmaps.

### 5. Peak Hour Analysis
Identify peak consumption hours through hourly aggregation and visualization.

### 6. Time Series Decomposition
Decompose the PJME time series into:
- **Trend:** Long-term progression
- **Seasonality:** Regular periodic fluctuations
- **Residuals:** Random noise

### 7. Seasonal Trend Analysis
Compare hourly consumption patterns across different seasons to identify seasonal behavior.

### 8. ARIMA Forecasting
Build and evaluate ARIMA(1,1,1) models for 24-hour ahead forecasting:
- Split data into train/test sets
- Fit ARIMA model on training data
- Generate forecasts
- Evaluate using MAE and RMSE metrics

## 📊 Key Insights

The analysis reveals:
- **Peak consumption hours** typically occur during business hours (9 AM - 5 PM)
- **Seasonal patterns** show higher consumption in summer (cooling) and winter (heating)
- **Strong correlations** exist between geographically proximate regions
- **Weekend vs. Weekday** patterns show distinct consumption behaviors
- **ARIMA forecasting** provides reliable short-term predictions with acceptable error metrics

## 📝 Results & Visualizations

The notebooks include:
- ✅ Correlation heatmaps
- ✅ Hourly consumption bar charts
- ✅ Time series decomposition plots
- ✅ Seasonal trend line charts
- ✅ 24-hour forecast comparisons (Actual vs. Predicted)
- ✅ Model performance metrics (MAE, RMSE)
- ✅ Weekly and monthly pattern analysis
- ✅ Stationarity test results
- ✅ ACF/PACF autocorrelation plots

### Main Analysis Notebook
`Time_series.ipynb` provides comparative analysis across all regions.

### Individual Dataset Notebooks
Each notebook in the `All_Notesbook/` folder focuses on deep-dive analysis for a specific region, making it easy to:
- Analyze specific regional patterns in detail
- Build region-specific forecasting models
- Compare results across different energy providers
- Identify unique characteristics of each region

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Sajjad Ali Shah**
- LinkedIn: [Sajjad Ali Shah](https://www.linkedin.com/in/sajjad-ali-shah47/)
- GitHub: [SajjadKhanYousafzai](https://github.com/SajjadKhanYousafzai)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Dataset provided by [Kaggle - Hourly Energy Consumption](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption/data)
- PJM Interconnection LLC for maintaining and providing the data

---

<div align="center">
  <strong>⭐ If you find this project helpful, please consider giving it a star! ⭐</strong>
</div>
