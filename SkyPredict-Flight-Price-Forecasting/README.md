# ✈️ SkyPredict — Premium Flight Price Forecasting

> **Predict Indian domestic flight prices in real-time using machine learning.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-SkyPredict-blue?style=for-the-badge)](https://skypredict-fawn.vercel.app/)
[![API](https://img.shields.io/badge/⚡_API-HuggingFace_Spaces-yellow?style=for-the-badge)](https://sajjad-ali-shah-skypredict-api.hf.space/)
[![Model](https://img.shields.io/badge/🤗_Model-HuggingFace_Hub-orange?style=for-the-badge)](https://huggingface.co/Sajjad-Ali-Shah/skypredict-flight-price)

---

## 🌐 Live Demo

🔗 **Dashboard:** [skypredict-fawn.vercel.app](https://skypredict-fawn.vercel.app/)  
🔗 **API Endpoint:** [sajjad-ali-shah-skypredict-api.hf.space](https://sajjad-ali-shah-skypredict-api.hf.space/)  
🔗 **Model on HuggingFace:** [Sajjad-Ali-Shah/skypredict-flight-price](https://huggingface.co/Sajjad-Ali-Shah/skypredict-flight-price)

---

## 📊 Project Overview

A full-stack machine learning project that predicts Indian domestic flight prices. Users select flight details (airline, route, class, timing) and get an instant price prediction powered by a Random Forest model trained on 300K+ flight records.

### Model Performance

| Metric            | Score                   |
| ----------------- | ----------------------- |
| **R² Score**      | 0.9765                  |
| **Algorithm**     | Random Forest Regressor |
| **Features**      | 30 engineered features  |
| **Training Data** | 300,000+ flight records |

---

## 🏗️ Architecture

```
┌─────────────────┐     API Call     ┌─────────────────────┐     Downloads     ┌─────────────────┐
│    Frontend      │ ──────────────> │    Backend (API)     │ <──────────────── │    Model Hub     │
│   (Vercel)       │ <────────────── │ (HuggingFace Spaces) │                   │ (HuggingFace)    │
│                  │    Response     │                      │                   │                  │
│  Next.js 16      │                │  FastAPI + Uvicorn    │                   │  model.joblib    │
│  TypeScript      │                │  Docker Container     │                   │  scaler.joblib   │
│  Tailwind CSS    │                │  Port 7860            │                   │  metadata.json   │
└─────────────────┘                 └──────────────────────┘                   └─────────────────┘
```

---

## ✨ Features

- 🎯 **Real-time Predictions** — Get instant flight price estimates
- 🛫 **6 Airlines** — AirAsia, Air India, Go First, IndiGo, SpiceJet, Vistara
- 🏙️ **6 Cities** — Delhi, Mumbai, Bangalore, Kolkata, Hyderabad, Chennai
- 💺 **Economy & Business** — Predictions for both travel classes
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🌙 **Dark Theme** — Premium glassmorphism UI with gradient accents
- ⚡ **Fast API** — Sub-second prediction response time

---

## 🎯 Research Questions Addressed

1. What are the airlines in the dataset and their frequencies?
2. How do departure and arrival times affect pricing?
3. How do source and destination cities influence price?
4. Does price vary significantly across airlines?
5. How does booking timing (days before departure) affect price?
6. What is the price difference between Economy and Business class?
7. What are the key factors driving flight prices?

---

## 📋 Dataset Features

### Categorical Features

| Feature              | Description       | Values            |
| -------------------- | ----------------- | ----------------- |
| **Airline**          | Airline company   | 6 airlines        |
| **Source City**      | Departure city    | 6 cities          |
| **Destination City** | Arrival city      | 6 cities          |
| **Departure Time**   | Time of departure | 6 time bins       |
| **Arrival Time**     | Time of arrival   | 6 time bins       |
| **Stops**            | Number of stops   | Non-Stop, 1, 2+   |
| **Class**            | Seat class        | Economy, Business |

### Continuous Features

| Feature       | Description                        |
| ------------- | ---------------------------------- |
| **Duration**  | Travel time in hours               |
| **Days Left** | Days between booking and departure |
| **Price**     | Ticket price (**Target Variable**) |

---

## 📂 Project Structure

```
SkyPredict-Flight-Price-Forecasting/
│
├── 📓 airlines_flight.ipynb       # EDA & analysis notebook
├── 📊 Data/
│   └── airlines_flights_data.csv  # Raw dataset
│
├── 🤖 model/
│   ├── train_model.py             # Model training script
│   ├── model.joblib               # Trained Random Forest model
│   ├── scaler.joblib              # Feature scaler
│   └── metadata.json              # Model metadata & categories
│
├── ⚡ backend/
│   └── main.py                    # FastAPI backend (local dev)
│
├── 🐳 huggingface/
│   ├── app.py                     # FastAPI app for HF Spaces
│   ├── Dockerfile                 # Docker build configuration
│   ├── requirements.txt           # Python dependencies
│   └── README.md                  # HF Spaces metadata
│
├── 🎨 dashboard/
│   ├── app/
│   │   ├── page.tsx               # Main dashboard page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Design system & styles
│   ├── package.json               # Node.js dependencies
│   └── tsconfig.json              # TypeScript config
│
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Run Locally

**1. Clone the repository:**

```bash
git clone https://github.com/SajjadKhanYousafzai/Time-Series-Projects-Hub.git
cd Time-Series-Projects-Hub/SkyPredict-Flight-Price-Forecasting
```

**2. Start the backend:**

```bash
pip install -r requirements.txt
cd backend
uvicorn main:app --reload --port 8000
```

**3. Start the dashboard:**

```bash
cd dashboard
npm install
npm run dev
```

**4. Open:** [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Layer                | Technology                                      |
| -------------------- | ----------------------------------------------- |
| **Frontend**         | Next.js 16, TypeScript, Tailwind CSS            |
| **Backend**          | FastAPI, Uvicorn, Python                        |
| **ML Model**         | Scikit-learn (Random Forest)                    |
| **Deployment**       | Vercel (frontend), HuggingFace Spaces (backend) |
| **Model Hosting**    | HuggingFace Hub                                 |
| **CI/CD**            | GitHub Actions                                  |
| **Containerization** | Docker                                          |

---

## 📡 API Endpoints

| Method | Endpoint    | Description                 |
| ------ | ----------- | --------------------------- |
| `GET`  | `/`         | Health check                |
| `GET`  | `/metadata` | Model metadata & categories |
| `POST` | `/predict`  | Predict flight price        |

### Example Prediction Request

```bash
curl -X POST "https://sajjad-ali-shah-skypredict-api.hf.space/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "airline": "Vistara",
    "source_city": "Delhi",
    "destination_city": "Mumbai",
    "departure_time": "Morning",
    "arrival_time": "Night",
    "stops": "one",
    "class_type": "Business",
    "duration": 5.5,
    "days_left": 15
  }'
```

---

## 📚 Dataset Source

**Dataset:** [Airlines Flights Dataset on Kaggle](https://www.kaggle.com/datasets/rohitgrewal/airlines-flights-data/data)

---

## 👨‍💻 Author

**Sajjad Ali Shah**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sajjad-ali-shah47/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SajjadKhanYousafzai)

---

## 📄 License

This project is open source and available for educational and research purposes.

---

**⭐ If you found this project useful, give it a star!**
