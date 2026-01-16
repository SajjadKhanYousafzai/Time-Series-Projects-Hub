# ⚡ Wind & Solar Energy Production Analysis

<div align="center">

![Energy](https://img.shields.io/badge/Energy-Renewable-green?style=for-the-badge)
![Time Series](https://img.shields.io/badge/Type-Time%20Series-blue?style=for-the-badge)
![Records](https://img.shields.io/badge/Records-51,864-orange?style=for-the-badge)
![Period](https://img.shields.io/badge/Period-2020--2025-purple?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?style=for-the-badge&logo=python)

</div>

---

## 📖 Project Overview

A comprehensive time series analysis of renewable energy production data from France, featuring hourly wind and solar generation measurements spanning **January 2020 to November 2025**. This project demonstrates professional data analysis, visualization, and insight generation for energy forecasting and grid management applications.

### 🎯 Key Objectives

- 🔍 Perform in-depth exploratory data analysis (EDA)
- 📊 Identify temporal patterns (hourly, daily, monthly, seasonal, yearly)
- 💨 Analyze wind vs solar energy production characteristics
- 📈 Assess production variability and forecasting challenges
- 🎨 Create publication-quality visualizations
- 💡 Provide actionable recommendations for energy management

---

## 📊 Dataset Information

| Property | Details |
|----------|---------|
| **Source** | Open Data Réseaux Énergies (ODRÉ) - France |
| **Period** | January 1, 2020 - November 30, 2025 |
| **Duration** | 5 years, 11 months (2,161 days) |
| **Granularity** | Hourly measurements |
| **Total Records** | 51,864 samples |
| **Features** | 9 engineered features |
| **Data Quality** | 100% complete (0 missing values) |
| **File Format** | CSV (UTF-8) |
| **File Size** | ~2.57 MB |

### 📋 Features Description

| Feature | Type | Range/Values | Description |
|---------|------|-------------|-------------|
| `Date` | DateTime | 2020-01-01 to 2025-11-30 | Measurement date |
| `Start_Hour` | Integer | 0-23 | Starting hour of measurement period |
| `End_Hour` | Integer | 0-23 | Ending hour of measurement period |
| `Source` | Categorical | Wind, Solar | Primary energy source |
| `Day_of_Year` | Integer | 1-366 | Day number within the year |
| `Day_Name` | Categorical | Mon-Sun | Day of week |
| `Month_Name` | Categorical | Jan-Dec | Calendar month |
| `Season` | Categorical | Winter, Spring, Summer, Fall | Meteorological season |
| `Production` | Integer | 58-23,446 MWh | Total renewable energy production |

### 📥 Dataset Access

[![Kaggle](https://img.shields.io/badge/Kaggle-Dataset-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/ahmeduzaki/wind-and-solar-energy-production-dataset)

---

## 🔬 Analysis Highlights

### 1️⃣ Data Quality Assessment
- ✅ **Zero missing values** (100% completeness)
- ✅ **No duplicate records**
- ✅ **51,862 clean records** after preprocessing
- ✅ **Consistent temporal coverage** with hourly granularity

### 2️⃣ Key Findings

#### 💨 **Wind Energy Dominance**
- **81.9%** of all production records
- **24-hour availability** (unlike solar)
- Higher variability but greater production capacity
- Critical for baseline and overnight energy supply

#### ☀️ **Solar Energy Characteristics**
- **18.1%** of production records
- Strong mid-day peak (10:00-16:00)
- Near-zero production during night hours
- More predictable patterns than wind

#### 📅 **Temporal Patterns**
- **Monthly:** Peak in February, lowest in June (~31% variation)
- **Seasonal:** Winter-spring dominance, summer trough
- **Hourly:** Solar shows strong diurnal cycle, wind more consistent
- **Weekly:** No significant day-of-week effects

#### 📊 **Production Statistics**
- **Mean:** 6,215 MWh
- **Median:** 5,372 MWh
- **Std Dev:** 3,978 MWh (high variability)
- **Range:** 58 - 23,446 MWh
- **Total Production:** 322+ Million MWh (2020-2025)

#### 📈 **Growth Trajectory**
- Notable production increase between 2022-2023
- Sustained cumulative growth over 6-year period
- Demonstrates France's renewable energy expansion

---

## 📊 Visualizations

The analysis includes 15+ professional visualizations:

- 📈 **Distribution Analysis:** Histograms, KDE plots, box plots
- 📊 **Categorical Analysis:** Count plots, pie charts, bar charts
- 📅 **Temporal Analysis:** Line plots, seasonal trends, yearly patterns
- ⏰ **Hourly Patterns:** 24-hour production cycles with confidence intervals
- 🗺️ **Heatmaps:** Hour vs Month production intensity
- 📉 **Variability Analysis:** Coefficient of variation, standard deviation
- 📈 **Cumulative Analysis:** Long-term production growth
- 💨☀️ **Source Comparison:** Wind vs Solar hourly patterns

---

## 🛠️ Technologies & Libraries

```python
import pandas as pd           # Data manipulation
import numpy as np            # Numerical operations
import matplotlib.pyplot as plt  # Visualization
import seaborn as sns         # Statistical visualization
```

### 📦 Requirements

```
pandas>=1.3.0
numpy>=1.21.0
matplotlib>=3.4.0
seaborn>=0.11.0
```

---

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd "Time-Series-Projects-Hub/Wind & Solar Energy Production"
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Download the dataset:**
   - Visit [Kaggle Dataset](https://www.kaggle.com/datasets/ahmeduzaki/wind-and-solar-energy-production-dataset)
   - Download `Energy Production Dataset.csv`
   - Place in the `Dataset/` directory

### Running the Analysis

```bash
jupyter notebook wind_solar_energy.ipynb
```

Or open directly in VS Code with Jupyter extension.

---

## 📈 Project Structure

```
Wind & Solar Energy Production/
│
├── Dataset/
│   └── Energy Production Dataset.csv
│
├── wind_solar_energy.ipynb      # Main analysis notebook
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

---

## 💡 Key Insights & Recommendations

### 🔋 For Energy Grid Management

1. **Predictive Modeling:** Implement ARIMA, SARIMA, Prophet, or LSTM models
2. **Energy Storage:** High variability (CV ~64%) demands robust storage solutions
3. **Grid Balancing:** Leverage wind-solar complementarity for 24-hour supply
4. **Seasonal Planning:** Prepare for February peak and June trough

### 🔬 For Data Scientists

1. **Forecasting Models:** SARIMA, Prophet, LSTM/GRU, XGBoost
2. **Feature Engineering:** Lag features, rolling statistics, cyclical encoding
3. **Classification:** Predict energy source from temporal patterns
4. **Anomaly Detection:** Identify unusual production drops
5. **External Data:** Integrate weather data (wind speed, solar irradiance)

### 📊 Advanced Analytics Opportunities

- 🔍 Seasonal decomposition (STL)
- 📊 Autocorrelation analysis (ACF/PACF)
- 🎯 Clustering production profiles
- 🌡️ Weather correlation studies
- 🔮 Long-term trend forecasting

---

## 🎓 Learning Outcomes

By working with this project, you will learn:

- ✅ Professional time series analysis techniques
- ✅ Exploratory data analysis (EDA) best practices
- ✅ Advanced visualization with Matplotlib & Seaborn
- ✅ Statistical analysis and interpretation
- ✅ Feature engineering for temporal data
- ✅ Energy domain knowledge and forecasting challenges

---

## 📚 Research Questions

This dataset enables investigation of:

1. ❓ What meteorological factors most influence production variability?
2. ❓ Can we predict production drops 24-48 hours in advance?
3. ❓ How does production efficiency vary by geographic region?
4. ❓ What is the optimal wind-solar energy mix for grid stability?
5. ❓ How will climate change impact future production patterns?
6. ❓ Can we detect equipment degradation from production data?
7. ❓ What role can energy storage play in smoothing variability?
8. ❓ How accurate are different forecasting models for different time horizons?

---

## 📊 Results Summary

### Statistical Summary
- **Total Energy Produced:** 322+ Million MWh
- **Average Daily Production:** ~149,000 MWh
- **Production Variability:** High (Std Dev: 3,978 MWh)
- **Wind Contribution:** 264+ Million MWh (81.9%)
- **Solar Contribution:** 58+ Million MWh (18.1%)

### Visualization Count
- **15+ Professional Charts:** Distribution plots, temporal analysis, heatmaps, variability studies

### Code Quality
- **Well-documented:** Clear comments and markdown explanations
- **Reproducible:** Complete environment specification
- **Professional:** Publication-ready visualizations

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs or issues
- 💡 Suggest new analyses or visualizations
- 🔧 Improve code efficiency
- 📚 Enhance documentation
- 🎨 Add new visualization techniques

---

## 📝 License

This project uses data from **Open Data Réseaux Énergies (ODRÉ)** under the **Open Licence 2.0**, allowing free use, reproduction, and distribution with proper attribution.

**Dataset Citation:**
```
Source: Courbes de production mensuelles Éolien & Solaire
Provider: Open Data Réseaux Énergies (ODRÉ)
License: Licence Ouverte v2.0 / Open Licence 2.0
URL: https://odre.opendatasoft.com/
```

---

## 👤 Author

**Sajjad Ali Shah**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sajjad-ali-shah47/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SajjadKhanYousafzai)

Connect with me on [LinkedIn](https://www.linkedin.com/in/sajjad-ali-shah47/) for collaboration and networking!

---

## 🌟 Acknowledgments

- **ODRÉ (Open Data Réseaux Énergies)** for providing high-quality open energy data
- **Kaggle Community** for hosting and sharing the dataset
- **Python Community** for excellent data science libraries

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- 📧 Email: [Contact via LinkedIn](https://www.linkedin.com/in/sajjad-ali-shah47/)
- 💼 LinkedIn: [Sajjad Ali Shah](https://www.linkedin.com/in/sajjad-ali-shah47/)
- 🐙 GitHub: [SajjadKhanYousafzai](https://github.com/SajjadKhanYousafzai)

---

<div align="center">

### ⭐ If you find this project useful, please star the repository!

**Happy Analyzing! 🎉**

---

Made with ❤️ for the Data Science Community

</div>
