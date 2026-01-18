# 🏪 Store Sales Time Series Forecasting

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sajjad-ali-shah47/)
[![Kaggle](https://img.shields.io/badge/Kaggle-Dataset-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/competitions/store-sales-time-series-forecasting/data)

## 📊 Project Overview

This project focuses on predicting sales for thousands of product families sold at **Favorita stores** located in Ecuador. Using comprehensive time series analysis and machine learning techniques, we analyze historical sales data along with external factors like oil prices, holidays, and promotional events to build accurate forecasting models.

## 🎯 Objectives

- Perform comprehensive Exploratory Data Analysis (EDA) on retail sales data
- Identify sales patterns, trends, and seasonality
- Analyze the impact of promotions, holidays, and economic factors on sales
- Build time series forecasting models for future sales prediction
- Generate actionable insights for business decision-making

## 📁 Dataset Description

The project uses multiple datasets from the Kaggle Store Sales competition:

### Main Datasets

1. **train.csv** - Training data with historical sales information
   - `store_nbr`: Store identifier
   - `family`: Product family/category
   - `sales`: Total sales (target variable)
   - `onpromotion`: Number of items on promotion
   - `date`: Transaction date

2. **test.csv** - Test data for predictions (15 days after training period)

3. **stores.csv** - Store metadata
   - Store type, city, state, and cluster information

4. **oil.csv** - Daily oil prices
   - Ecuador's economy is oil-dependent, making this a crucial feature

5. **holidays_events.csv** - Holiday and event information
   - Includes transferred holidays, bridges, and special events

6. **transactions.csv** - Daily transaction counts per store

## 🔍 Exploratory Data Analysis

Our comprehensive EDA includes:

### 1. **Sales Analysis**
   - Distribution of sales across stores and product families
   - Temporal trends and patterns
   - Impact of promotions on sales performance

### 2. **Store Characteristics**
   - Geographic distribution (cities and states)
   - Store type and cluster analysis
   - Performance comparison across different store segments

### 3. **Economic Factors**
   - Oil price trends and volatility analysis
   - Correlation between oil prices and sales

### 4. **Holiday & Events Impact**
   - Analysis of different holiday types (national, regional, local)
   - Transferred holidays and their effects
   - Event frequency and timing

### 5. **Transaction Patterns**
   - Customer activity trends over time
   - Store-wise transaction analysis
   - Monthly and seasonal variations

### 6. **Deep Pattern Analysis**
   - Day of week effects
   - Monthly seasonality
   - Quarterly trends
   - Weekend vs. weekday comparisons

## 📈 Key Insights

- **Promotion Impact**: Quantified lift in sales due to promotional activities
- **Temporal Patterns**: Identified best-performing days and months
- **Store Performance**: Ranked top-performing stores and product families
- **Economic Indicators**: Analyzed oil price volatility effects
- **Seasonal Trends**: Discovered quarterly and monthly sales patterns

## 🛠️ Technologies Used

- **Python 3.x**
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computations
- **Matplotlib & Seaborn** - Data visualization
- **Statsmodels** - Time series analysis
- **Scikit-learn** - Machine learning utilities

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd "Time-Series-Projects-Hub/StoreSales Time Series Forecasting"
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Launch Jupyter Notebook:
```bash
jupyter notebook Sales.ipynb
```

## 📂 Project Structure

```
StoreSales Time Series Forecasting/
│
├── Sales.ipynb              # Main analysis notebook
├── requirements.txt         # Python dependencies
├── README.md               # Project documentation
│
└── Dataset/
    ├── train.csv           # Training data
    ├── test.csv            # Test data
    ├── stores.csv          # Store metadata
    ├── oil.csv             # Oil price data
    ├── holidays_events.csv # Holiday information
    ├── transactions.csv    # Transaction data
    └── sample_submission.csv
```

## 🚀 Usage

1. **Data Loading**: All datasets are automatically loaded in the notebook
2. **EDA**: Run cells sequentially to see comprehensive visualizations
3. **Analysis**: Each section provides detailed insights with professional plots
4. **Summary**: Final cell provides a comprehensive summary of all findings

## 📊 Visualizations

The notebook includes 20+ professional visualizations covering:
- Sales distribution and trends
- Store performance metrics
- Oil price analysis
- Holiday impact assessment
- Transaction patterns
- Temporal analysis (daily, monthly, quarterly, yearly)

## 🔮 Future Work

- Feature engineering for advanced models
- Time series forecasting models (ARIMA, SARIMA, Prophet)
- Machine learning models (XGBoost, LightGBM, Random Forest)
- Deep learning approaches (LSTM, GRU)
- Model evaluation and comparison
- Hyperparameter tuning
- Final predictions on test set

## 👨‍💻 Author

**Sajjad Ali Shah**
- LinkedIn: [Sajjad Ali Shah](https://www.linkedin.com/in/sajjad-ali-shah47/)
- GitHub: [SajjadKhanYousafzai](https://github.com/SajjadKhanYousafzai)

## 📄 License

This project is part of a learning portfolio for time series analysis and forecasting.

## 🙏 Acknowledgments

- Dataset provided by Kaggle Store Sales Time Series Forecasting Competition
- Favorita stores for the original data
- Data science community for inspiration and best practices

---

⭐ If you find this project helpful, please consider giving it a star!
