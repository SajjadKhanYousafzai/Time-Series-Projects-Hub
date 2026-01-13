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
- Visual inspection through rolling statistics
- Interpretation of test statistics and p-values

### 3. Time Series Decomposition
- **Additive Model**: Separating trend, seasonal, and residual components
- Visualization of individual components
- Understanding underlying patterns in the data

### 4. ACF/PACF Analysis
- **Autocorrelation Function (ACF)**: Identifies correlation patterns at different lags
- **Partial Autocorrelation Function (PACF)**: Helps determine optimal AR and MA orders
- Scientific justification for SARIMA parameters (p,d,q)(P,D,Q,s)
- Visual interpretation guide for non-technical stakeholders

### 5. Forecasting Models

#### SARIMA (Seasonal ARIMA)
- **Parameters**: (1,1,1)(1,1,1,12) - scientifically justified using ACF/PACF
- Captures both trend and seasonal patterns
- Comprehensive residual diagnostics with 4 statistical tests
- Short to medium-term forecasting with confidence intervals

#### Exponential Smoothing
- **Holt-Winters Method**: Triple exponential smoothing
- Additive seasonality for stable seasonal patterns
- Alternative approach with simpler interpretation

#### Seasonal Naive Baseline
- Simple benchmark model for comparison
- Uses last year's value as prediction
- Helps quantify improvement from sophisticated models

### 6. Model Comparison Framework
- **Performance Metrics**: MAE, RMSE, MAPE
- Visual comparison with bar charts and rankings
- Clear recommendations for production deployment
- Business-focused interpretation of results

### 7. Advanced Validation

#### Residual Diagnostics
- **Q-Q Plot**: Tests normality assumption
- **Histogram**: Distribution of residuals
- **ACF Plot**: Checks for remaining autocorrelation
- **Time Series Plot**: Visual inspection of residuals
- **Shapiro-Wilk Test**: Statistical normality test
- **Ljung-Box Test**: Checks for white noise
- **Durbin-Watson Statistic**: Tests autocorrelation
- **Jarque-Bera Test**: Alternative normality test

#### Time Series Cross-Validation
- **5-Fold Rolling Window**: Tests on multiple time periods
- **Expanding Training Set**: Mimics real-world forecasting
- Robust performance metrics across different periods
- Mean and standard deviation of cross-validation scores

### 8. Executive Summary & Business Insights
- **Model Performance**: Professional summary with confidence levels
- **Forecasting Accuracy**: Practical interpretation of metrics
- **Business Recommendations**: Actionable insights for decision-makers
- **Risk Assessment**: Understanding prediction uncertainties
- **Implementation Guidance**: Deployment considerations
- **Monitoring Strategy**: Ongoing model performance tracking
- **Future Improvements**: Recommendations for enhancement

## 📈 Key Insights

1. **Seasonal Trends**: Employment peaks during summer months (May-August) due to increased tourism
2. **Long-term Growth**: Steady upward trend in hospitality employment from 1990-2018
3. **Economic Cycles**: Visible impact of recessions (2001, 2008-2009) on employment levels
4. **Model Performance**: 
   - SARIMA achieves <3% MAPE (Mean Absolute Percentage Error)
   - Typical prediction error: ±13K employees
   - Cross-validation confirms robust performance across multiple time periods
5. **Residual Analysis**: Model residuals pass normality and white noise tests, confirming good fit
6. **Business Value**: Forecasts enable proactive workforce planning with quantified uncertainty

## 🛠️ Technologies Used

- **Python 3.x**
- **Libraries**:
  - `pandas` - Data manipulation and analysis
  - `numpy` - Numerical computing
  - `matplotlib` & `seaborn` - Data visualization
  - `statsmodels` - Statistical modeling, SARIMA, decomposition, ACF/PACF, statistical tests
  - `scikit-learn` - Model evaluation metrics (MAE, RMSE, MAPE)
  - `scipy` - Statistical tests (Shapiro-Wilk, Jarque-Bera)
  - `warnings` - Managing warning messages
- **Professional Styling**:
  - HTML5/CSS3 - Modern, responsive section headers
  - Gradient designs and animations for enhanced readability

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
pip install pandas numpy matplotlib seaborn statsmodels scikit-learn scipy
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

The notebook includes comprehensive model evaluation:

### Performance Metrics
- **Mean Absolute Error (MAE)**: Average prediction error in thousands of employees
- **Root Mean Squared Error (RMSE)**: Penalizes larger errors more heavily
- **Mean Absolute Percentage Error (MAPE)**: Error as percentage of actual values

### Validation Methods
- **Train-Test Split**: 80/20 temporal split preserving time order
- **Cross-Validation**: 5-fold rolling window with expanding training set
- **Visual Comparison**: Predicted vs actual values with confidence intervals
- **Residual Diagnostics**: 4 plots and 4 statistical tests

### Model Rankings
1. **SARIMA(1,1,1)(1,1,1,12)**: Best overall performance (~2.8% MAPE)
2. **Exponential Smoothing**: Good alternative, simpler to implement
3. **Seasonal Naive**: Baseline for comparison

### Professional Reporting
- Executive summary with business-focused language
- Confidence levels for predictions (95% intervals)
- Risk assessment and uncertainty quantification
- Clear recommendations for production deployment

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
3. **Stationarity Check**: Apply Augmented Dickey-Fuller test
4. **Decomposition**: Separate trend, seasonal, and residual components
5. **ACF/PACF Analysis**: Scientific parameter selection for SARIMA
6. **Model Building**: Train SARIMA, Exponential Smoothing, and Baseline models
7. **Residual Diagnostics**: Validate model assumptions with statistical tests
8. **Model Comparison**: Evaluate performance across multiple metrics
9. **Cross-Validation**: Test robustness on multiple time periods
10. **Forecasting**: Generate future predictions with confidence intervals
11. **Business Insights**: Translate results into actionable recommendations

## 🎨 Professional Features

This notebook includes **production-ready presentation elements**:

- ✅ **Modern Styling**: Beautiful gradient section headers with animations
- ✅ **Non-Technical Explanations**: Every concept explained for business stakeholders
- ✅ **Visual Excellence**: Professional charts with clear labels and legends
- ✅ **Scientific Rigor**: Statistical tests and mathematical justifications
- ✅ **Business Focus**: Executive summaries and actionable recommendations
- ✅ **Comprehensive Documentation**: Step-by-step explanations for reproducibility

## 🔍 Key Findings

- The hospitality industry shows **strong seasonality** with 12-month cycles
- **SARIMA(1,1,1)(1,1,1,12)** outperforms other models with <3% MAPE
- ACF/PACF analysis provides **scientific justification** for model parameters
- **Residual diagnostics** confirm model assumptions (normality, no autocorrelation)
- **Cross-validation** demonstrates robust performance across different time periods
- Employment trends align with **major economic events** (recessions, recoveries)
- **Exponential Smoothing** provides simpler alternative with competitive performance
- Forecasts enable **proactive workforce planning** with quantified uncertainty (±13K employees)

## 📚 References

- Hyndman, R.J., & Athanasopoulos, G. (2021). *Forecasting: Principles and Practice*
- Box, G.E.P., Jenkins, G.M., & Reinsel, G.C. (2015). *Time Series Analysis: Forecasting and Control*
- Brockwell, P.J., & Davis, R.A. (2016). *Introduction to Time Series and Forecasting*
- Montgomery, D.C., Jennings, C.L., & Kulahci, M. (2015). *Introduction to Time Series Analysis and Forecasting*

## ✨ What Makes This Project Stand Out

1. **Professional Presentation**: Modern, visually appealing design suitable for stakeholder presentations
2. **Scientific Rigor**: Statistical tests, ACF/PACF analysis, and comprehensive diagnostics
3. **Business Focus**: Non-technical explanations and actionable recommendations
4. **Model Comparison**: Multiple approaches tested and compared objectively
5. **Robust Validation**: Cross-validation ensures reliable performance estimates
6. **Complete Documentation**: Every step explained for reproducibility and learning
7. **Production Ready**: Includes deployment guidance and monitoring strategies

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
