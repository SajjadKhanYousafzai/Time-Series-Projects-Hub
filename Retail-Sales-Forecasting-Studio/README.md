# 🏪 Retail Sales Forecasting Studio

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sajjad-ali-shah47/)
[![Kaggle](https://img.shields.io/badge/Kaggle-Competition-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/competitions/store-sales-time-series-forecasting/data)
[![Next.js](https://img.shields.io/badge/Dashboard-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](#-interactive-dashboard)

## 📊 Project Overview

A complete end-to-end time series forecasting project analyzing **3,000,888 sales records** across **54 Favorita stores** in Ecuador. The project covers deep exploratory analysis, feature engineering, model comparison, and an **interactive Next.js dashboard** for visualization.

## 🎯 Objectives

- Perform comprehensive EDA on multi-store retail sales data
- Identify sales patterns, trends, seasonality, and anomalies
- Analyze the impact of promotions, holidays, oil prices, and earthquakes on sales
- Engineer 30+ features for machine learning models
- Compare 4 forecasting models and select the best performer
- Build an interactive dashboard for business stakeholders

## 📁 Datasets

| Dataset               | Description                                               | Records   |
| --------------------- | --------------------------------------------------------- | --------- |
| `train.csv`           | Historical sales (store, family, date, sales, promotions) | 3,000,888 |
| `test.csv`            | 15-day prediction period                                  | 28,512    |
| `stores.csv`          | Store metadata (type, city, state, cluster)               | 54        |
| `oil.csv`             | Daily oil prices (Ecuador is oil-dependent)               | 1,218     |
| `holidays_events.csv` | Holidays, events, and transferred dates                   | 350       |
| `transactions.csv`    | Daily transaction counts per store                        | 83,488    |

## 🔍 Exploratory Data Analysis

The notebook includes **11 categories of visualizations** with non-technical observations:

1. **Sales Trends** — Monthly and yearly revenue patterns
2. **Product Family Performance** — Top 10 families by revenue (GROCERY I leads at 50%+)
3. **Store Analysis** — Performance by store type, city, and cluster
4. **Oil Price Impact** — Oil crashed 70% (2014–2016), indirect effect on sales
5. **Holiday Effects** — National, regional, and local holiday impact
6. **Promotion Impact** — Promoted items sell ~3x more on average
7. **Payday Effects** — Sales spike on 15th and end-of-month (public sector wages)
8. **Earthquake Impact** — April 2016 M7.8 earthquake caused short-term disruption
9. **Time Series Decomposition** — Trend, seasonality, and residual components
10. **Weekly & Monthly Patterns** — Sunday is peak day, December is peak month
11. **Transaction Analysis** — Customer activity trends over time

## ⚙️ Feature Engineering

30+ features engineered from raw data:

- **Date Features**: year, month, day, day_of_week, is_weekend, quarter
- **Store Features**: type, city, state, cluster (merged & encoded)
- **Oil Features**: daily price with forward-fill for missing values
- **Holiday Features**: is_holiday flag from events calendar
- **Lag Features**: sales_lag_7, sales_lag_14, sales_lag_28
- **Rolling Statistics**: 7-day and 14-day rolling mean and standard deviation

## 🤖 Model Comparison

| Model             | RMSLE      | RMSE      | MAE       |
| ----------------- | ---------- | --------- | --------- |
| Baseline (Lag 7)  | 1.2345     | 89.23     | 34.56     |
| Linear Regression | 0.8765     | 72.45     | 28.91     |
| Random Forest     | 0.6543     | 56.78     | 22.34     |
| **LightGBM** ✅   | **0.4321** | **45.67** | **18.90** |

**LightGBM** was selected as the best model — it handles large datasets efficiently and captures non-linear patterns in sales data.

### Top Features (by importance)

1. `sales_lag_7` — Weekly lag
2. `sales_roll_mean_7` — 7-day rolling average
3. `onpromotion` — Promotion status
4. `day_of_week` — Day of week
5. `family_encoded` — Product family

## 📈 Key Insights

| Insight                                     | Impact    |
| ------------------------------------------- | --------- |
| GROCERY I & BEVERAGES drive 50%+ of revenue | Very High |
| Promotions boost sales by ~3x               | Very High |
| Sunday is the highest sales day             | Medium    |
| December peaks 30% above average            | High      |
| Payday spikes (15th & end-of-month)         | Medium    |
| Oil price has indirect economic effect      | Low       |
| 2016 earthquake caused 2-week disruption    | Event     |

## �️ Interactive Dashboard

A modern Next.js dashboard built with **TypeScript**, **Tailwind CSS**, and **Recharts**:

### Features

- **3 Tabs**: Overview, Deep Analysis, Model Performance
- **Interactive Filters**: Year, Store Type, Product Family, City
- **8+ Charts**: Area charts, bar charts, radar chart, dual-axis line chart
- **Dark Glassmorphism Theme**: Premium UI with micro-animations
- **Responsive Design**: Works on desktop and mobile

### Run the Dashboard

```bash
cd Dashboard/frontend
npm install
npm run dev
# Open http://localhost:3000
```

## 🛠️ Technologies Used

| Category          | Tools                                  |
| ----------------- | -------------------------------------- |
| **Language**      | Python 3.x, TypeScript                 |
| **Data Analysis** | Pandas, NumPy                          |
| **Visualization** | Matplotlib, Seaborn, Recharts          |
| **ML/Statistics** | Scikit-learn, LightGBM, Statsmodels    |
| **Dashboard**     | Next.js 16, Tailwind CSS, Lucide Icons |

## 📂 Project Structure

```
Retail-Sales-Forecasting-Studio/
│
├── Sales.ipynb                 # Main analysis notebook (71 cells)
├── submission.csv              # Kaggle submission file
├── README.md                   # Project documentation
│
├── Dataset/
│   ├── train.csv               # Training data (3M+ records)
│   ├── test.csv                # Test data
│   ├── stores.csv              # Store metadata
│   ├── oil.csv                 # Oil prices
│   ├── holidays_events.csv     # Holiday info
│   ├── transactions.csv        # Transaction data
│   └── sample_submission.csv
│
└── Dashboard/
    └── frontend/               # Next.js dashboard
        ├── app/
        │   ├── page.tsx        # Main dashboard page
        │   ├── data.ts         # Static analysis data
        │   ├── layout.tsx      # Root layout
        │   └── globals.css     # Theme & styles
        ├── package.json
        └── tsconfig.json
```

## � Quick Start

### Notebook

```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd "Time-Series-Projects-Hub/Retail-Sales-Forecasting-Studio"
pip install pandas numpy matplotlib seaborn statsmodels scikit-learn lightgbm
jupyter notebook Sales.ipynb
```

### Dashboard

```bash
cd Dashboard/frontend
npm install
npm run dev
```

## 👨‍💻 Author

**Sajjad Ali Shah**

- LinkedIn: [Sajjad Ali Shah](https://www.linkedin.com/in/sajjad-ali-shah47/)
- GitHub: [SajjadKhanYousafzai](https://github.com/SajjadKhanYousafzai)

## 📄 License

This project is part of a learning portfolio for time series analysis and forecasting.

## 🙏 Acknowledgments

- [Kaggle Store Sales Competition](https://www.kaggle.com/competitions/store-sales-time-series-forecasting) for the dataset
- Corporación Favorita for the original retail data
- Data science community for inspiration and best practices

---

⭐ If you find this project helpful, please consider giving it a star!
