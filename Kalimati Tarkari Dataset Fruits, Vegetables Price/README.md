# 🥬 Kalimati Tarkari Dataset: Fruits & Vegetables Price Analysis

## 📊 About Dataset

### **Kalimati Tarkari Dataset**
This comprehensive dataset contains historical price data for fruits and vegetables from the **Kalimati Fruits and Vegetable Market Development Board**, Nepal's largest wholesale market for agricultural produce. The data has been meticulously scraped from the official website: [https://kalimatimarket.gov.np/](https://kalimatimarket.gov.np/)

The dataset captures daily minimum, maximum, and average prices for a wide variety of commodities, providing valuable insights into market trends, seasonal variations, and price dynamics in Nepal's agricultural sector.

📦 **Dataset Source**: [Kaggle - Kalimati Tarkari Dataset](https://www.kaggle.com/datasets/nischallal/kalimati-tarkari-dataset)

---

## 🌟 Context

The Kalimati Market serves as the primary wholesale hub for fruits and vegetables in Nepal, directly influencing retail prices across the country. Understanding price patterns in this market is crucial for:

- **Farmers** seeking optimal selling times for their produce
- **Retailers** planning inventory and pricing strategies  
- **Policymakers** monitoring food security and inflation
- **Consumers** understanding seasonal price fluctuations
- **Researchers** analyzing agricultural economics and supply chain dynamics

This dataset represents years of daily price records, capturing the pulse of Nepal's agricultural market and offering a window into the economic realities of food distribution in South Asia.

---

## 📦 Content

The dataset includes:

- **280,000+ records** spanning multiple years of daily price data
- **Multiple commodity categories**: Vegetables (tomatoes, potatoes, leafy greens, etc.), Fruits (bananas, mangoes, apples, etc.), and specialty items
- **Price metrics**: Minimum, Maximum, and Average prices per unit (Kg/Dozen/Piece)
- **Temporal data**: Date-wise records enabling time series analysis
- **Unit specifications**: Clear measurement units for each commodity

### Key Features:
- Daily price updates for 70+ different commodities
- Seasonal variation patterns across different produce types
- Price volatility indicators through min-max spreads
- Historical trends for forecasting and predictive modeling

---

## 📁 Project Structure

```
Kalimati Tarkari Dataset Fruits, Vegetables Price/
│
├── Dataset/
│   ├── Kalimati_Tarkari_Dataset.csv    # Main dataset file
│   └── README.md                         # Dataset documentation
│
├── Tarkari.ipynb                        # Jupyter notebook with analysis
└── README.md                            # This file
```

---

## 🚀 Getting Started

### Prerequisites
```bash
pip install pandas numpy matplotlib seaborn plotly
```

### Usage

1. **Clone the repository**
```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd "Time-Series-Projects-Hub/Kalimati Tarkari Dataset Fruits, Vegetables Price"
```

2. **Open the Jupyter Notebook**
```bash
jupyter notebook Tarkari.ipynb
```

3. **Load the dataset**
```python
import pandas as pd
df = pd.read_csv('Dataset/Kalimati_Tarkari_Dataset.csv')
```

---

## 🙏 Acknowledgements

We extend our sincere gratitude to:

- **Kalimati Fruits and Vegetable Market Development Board** for maintaining transparent and accessible price records
- The **Government of Nepal** for supporting agricultural market information systems
- **Open data initiatives** that make agricultural market data publicly available for research and analysis

This dataset would not be possible without the continuous efforts of market officials who diligently record and publish daily price information, contributing to market transparency and informed decision-making.

---

## 💡 Inspiration & Research Questions

This dataset opens doors to numerous analytical opportunities:

### 📈 Time Series Analysis:
- Can we predict future prices based on historical trends?
- What are the seasonal patterns for different commodities?
- How do prices fluctuate during festivals and special occasions?

### 🔍 Market Insights:
- Which commodities show the highest price volatility?
- How do local vs. imported produce prices compare?
- What is the relationship between minimum and maximum prices?

### 🌾 Economic Analysis:
- How do weather patterns affect vegetable prices?
- What is the impact of supply chain disruptions on prices?
- Can we identify inflationary trends in food prices?

### 🤖 Machine Learning Applications:
- Price forecasting models for different commodities
- Anomaly detection in price patterns
- Clustering analysis of similar price behaviors

---

## 👤 Author

**Sajjad Ali Shah**  
Data Scientist | Machine Learning Engineer  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/sajjad-ali-shah47/)

*Feel free to connect for collaborations, discussions, or questions about this analysis!*

---

## 📄 License

This project is open source and available for educational and research purposes.

---

**Let's explore the data and uncover the stories hidden in Nepal's agricultural market!** 🚀