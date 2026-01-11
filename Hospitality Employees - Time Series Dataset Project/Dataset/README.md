# 🏨 Hospitality Employees Time Series Dataset

## Overview

This project analyzes employment trends in the California hospitality industry using time series forecasting techniques. The dataset contains monthly employment figures spanning 28 years (1990-2018), providing valuable insights into seasonal patterns, economic cycles, and long-term employment trends in the hospitality sector.

## 📊 Dataset Information

### Source & Specifications
- **Region**: California, United States
- **Industry**: Hospitality & Tourism
- **Metric**: Number of employees (in thousands)
- **Frequency**: Monthly averages
- **Time Period**: January 1990 – December 2018
- **Total Observations**: 348 data points
- **File**: `HospitalityEmployees.csv`

### Key Features
- ✅ Strong seasonal patterns (summer peaks, winter lows)
- ✅ Long-term trend reflecting economic growth
- ✅ Clean, consistently formatted monthly data
- ✅ No missing values
- ✅ Ideal for demonstrating time series forecasting methodologies

## 🔬 Analysis Components

### 1. Exploratory Data Analysis (EDA)
- Time series visualization with trend analysis
- Seasonal decomposition (trend, seasonal, residual components)
- Statistical summary and data distribution analysis
- Seasonality strength assessment

### 2. Stationarity Testing
- **Augmented Dickey-Fuller (ADF) Test**: Tests for unit root and stationarity
- **KPSS Test**: Confirms stationarity around a deterministic trend
- Visual inspection through rolling statistics

### 3. Time Series Decomposition
- **Additive Model**: Separating trend, seasonal, and residual components
- Visualization of individual components
- Understanding underlying patterns in the data

### 4. Forecasting Models

#### ARIMA (AutoRegressive Integrated Moving Average)
- Automatic parameter selection using `auto_arima`
- Model diagnostics and residual analysis
- Short to medium-term forecasting

#### SARIMA (Seasonal ARIMA)
- Captures both trend and seasonal patterns
- Parameter optimization: (p,d,q) × (P,D,Q,s)
- Improved accuracy for seasonal data

#### Prophet (Facebook's Forecasting Tool)
- Robust to missing data and outliers
- Automatic detection of seasonality and holidays
- User-friendly interface with intuitive visualizations
- Uncertainty intervals for predictions

## 📈 Key Insights

1. **Seasonal Trends**: Employment peaks during summer months (May-August) due to increased tourism
2. **Long-term Growth**: Steady upward trend in hospitality employment from 1990-2018
3. **Economic Cycles**: Visible impact of recessions (2001, 2008-2009) on employment levels
4. **Forecast Accuracy**: SARIMA and Prophet models show strong predictive performance

## 🛠️ Technologies Used

- **Python 3.x**
- **Libraries**:
  - `pandas` - Data manipulation and analysis
  - `numpy` - Numerical computing
  - `matplotlib` & `seaborn` - Data visualization
  - `statsmodels` - Statistical modeling and testing
  - `pmdarima` - Auto ARIMA model selection
  - `prophet` - Facebook's forecasting library
  - `scikit-learn` - Model evaluation metrics

## 📁 Project Structure

```
Dataset/
│
├── HospitalityEmployees.csv    # Raw time series data
├── Hospitality.ipynb            # Jupyter notebook with complete analysis
├── README.md                    # Project documentation (this file)
└── requirements.txt             # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
```bash
pip install pandas numpy matplotlib seaborn statsmodels pmdarima prophet scikit-learn
```

Or install from requirements file:
```bash
pip install -r requirements.txt
```

### Running the Analysis

1. **Clone or download** this project directory
2. **Open** `Hospitality.ipynb` in Jupyter Notebook or JupyterLab
3. **Run cells sequentially** to reproduce the analysis
4. **Modify parameters** as needed for experimentation

## 📊 Model Performance

The notebook includes detailed model evaluation using:
- **Mean Absolute Error (MAE)**
- **Root Mean Squared Error (RMSE)**
- **Mean Absolute Percentage Error (MAPE)**
- Visual comparison of predicted vs actual values
- Residual diagnostics

## 🎯 Use Cases

This analysis is valuable for:
- **Workforce Planning**: Anticipating seasonal hiring needs
- **Resource Allocation**: Optimizing staffing during peak periods
- **Economic Research**: Understanding hospitality industry dynamics
- **Policy Making**: Informing labor market policies
- **Educational Purposes**: Learning time series forecasting techniques

## 📝 Methodology

1. **Data Loading & Cleaning**: Import and prepare time series data
2. **Visualization**: Explore temporal patterns and trends
3. **Stationarity Check**: Apply statistical tests (ADF, KPSS)
4. **Decomposition**: Separate trend, seasonal, and residual components
5. **Model Building**: Train ARIMA, SARIMA, and Prophet models
6. **Evaluation**: Compare model performance using error metrics
7. **Forecasting**: Generate future predictions with confidence intervals

## 🔍 Key Findings

- The hospitality industry shows **strong seasonality** with approximately 12-month cycles
- **SARIMA models** outperform simple ARIMA by incorporating seasonal components
- **Prophet** provides intuitive visualizations and handles missing data effectively
- Employment trends align with **major economic events** (recessions, recoveries)

## 📚 References

- Hyndman, R.J., & Athanasopoulos, G. (2021). *Forecasting: Principles and Practice*
- Taylor, S.J., & Letham, B. (2018). *Forecasting at Scale* (Prophet)
- Box, G.E.P., Jenkins, G.M., & Reinsel, G.C. (2015). *Time Series Analysis*

## 👤 Author

Part of the **Time-Series-Projects-Hub** repository

## 📄 License

This project is available for educational and research purposes.

## 🤝 Contributing

Feedback and contributions are welcome! Feel free to:
- Report issues or bugs
- Suggest improvements or new features
- Share insights from your own analysis

---

**Last Updated**: January 2026
