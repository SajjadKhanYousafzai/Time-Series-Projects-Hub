# ✈️ Airlines Flights Time Series Analysis

Flight Booking Data Analysis for Various Cities in India

---

## 📊 Project Overview

This project analyzes the **Flights Booking Dataset** which contains scraped data from a famous travel website. The dataset provides comprehensive insights into flight travel details between cities in India, including pricing patterns, airline operations, and travel trends. This analysis is ideal for professionals working in the **Airlines and Travel domain**.

**Data Format:** CSV  
**Analysis Tool:** Pandas, NumPy, Matplotlib, Statsmodels  
**Domain:** Airlines & Travel Industry

---

## 🎯 Research Questions

This project addresses the following analytical questions:

1. What are the airlines in the dataset, accompanied by their frequencies?
2. Show Bar Graphs representing the Departure Time & Arrival Time
3. Show Bar Graphs representing the Source City & Destination City
4. Does price vary with airlines?
5. Does ticket price change based on the departure time and arrival time?
6. How does the price change with change in Source and Destination?
7. How is the price affected when tickets are bought in just 1 or 2 days before departure?
8. How does the ticket price vary between Economy and Business class?
9. What will be the Average Price of Vistara airline for a flight from Delhi to Hyderabad in Business Class?

---

## 📋 Dataset Features

### Categorical Features

| Feature | Description | Unique Values |
|---------|-------------|---------------|
| **Airline** | Name of the airline company | 6 different airlines |
| **Flight** | Plane's flight code | Multiple unique codes |
| **Source City** | City from which the flight takes off | 6 unique cities |
| **Departure Time** | Time periods grouped into bins | 6 unique time labels |
| **Stops** | Number of stops between source and destination | 3 distinct values |
| **Arrival Time** | Time intervals grouped into bins | 6 distinct time labels |
| **Destination City** | City where the flight will land | 6 unique cities |
| **Class** | Seat class information | 2 values (Business & Economy) |

### Continuous Features

| Feature | Description | Type |
|---------|-------------|------|
| **Duration** | Total travel time between cities (in hours) | Continuous |
| **Days Left** | Trip date - Booking date | Continuous |
| **Price** | Ticket price | **Target Variable** |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Jupyter Notebook or JupyterLab

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd "Airlines Flights Time Series"
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

### Required Packages

- `numpy` - Numerical computing
- `pandas` - Data manipulation and analysis
- `matplotlib` - Data visualization
- `statsmodels` - Time series analysis
- `jupyter` - Interactive notebook environment

---

## 📂 Project Structure

```
Airlines Flights Time Series/
│
├── airlines_flight.ipynb     # Main analysis notebook
├── requirements.txt           # Python dependencies
├── README.md                  # Project documentation
└── Data/
    └── airlines_flights_data.csv  # Dataset file
```

---

## 💻 Usage

1. Launch Jupyter Notebook:
```bash
jupyter notebook
```

2. Open `airlines_flight.ipynb` in your browser

3. Run the cells sequentially to:
   - Load and explore the dataset
   - Visualize flight patterns and distributions
   - Analyze pricing factors
   - Answer the research questions
   - Generate insights for the travel industry

---

## 📊 Key Analyses

The notebook includes:

- **Exploratory Data Analysis (EDA)** - Understanding dataset structure and distributions
- **Visualization** - Bar plots, time series plots, and distribution charts for all features
- **Price Analysis** - Investigating factors affecting ticket prices
- **Comparative Analysis** - Airlines, routes, timing, and class comparisons
- **Time Series Analysis** - Temporal patterns in flight bookings

---

## 📈 Key Insights

The analysis reveals patterns in:
- Airline pricing strategies
- Peak travel times and routes
- Impact of booking timing on prices
- Business vs Economy class pricing
- Route-specific pricing patterns

---

## 📚 Dataset Source

**Dataset:** [Airlines Flights Dataset on Kaggle](https://www.kaggle.com/datasets/rohitgrewal/airlines-flights-data/data)

---

## 👨‍💻 Author

**Sajjad Ali Shah**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/sajjad-ali-shah47/)

---

## 📄 License

This project is open source and available for educational and research purposes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📞 Contact

For questions or feedback, please reach out via [LinkedIn](https://www.linkedin.com/in/sajjad-ali-shah47/).

---

**Note:** This project is part of the Time-Series-Projects-Hub repository, showcasing various time series analysis techniques applied to real-world datasets.
