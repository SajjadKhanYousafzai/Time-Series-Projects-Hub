# 🌱 Kalimati Tarkari Forecasting Dashboard

**Professional TypeScript/React dashboard for real-time vegetable price forecasting**

Built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

---

## 🚀 Features

✅ **Interactive Forecasting** - Select commodities and view 30-day price predictions  
✅ **Model Comparison** - Compare XGBoost, Prophet, SARIMA, LSTM, and more  
✅ **Real-time Metrics** - Live MAE, RMSE, MAPE, MASE, R² scores  
✅ **Confidence Intervals** - Visual uncertainty bounds for forecasts  
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile  
✅ **TypeScript** - Fully typed for better development experience

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The dashboard will be available at `http://localhost:3000`

---

## 🔗 Backend API Integration

The dashboard expects a REST API at `http://localhost:8000/api` with the following endpoints:

### GET `/api/forecast`
Query params: `commodity` (string), `model` (string)

Response:
```json
{
  "commodity": "Potato",
  "currentPrice": 45.50,
  "forecastPrice": 48.20,
  "priceChange": 5.93,
  "confidence": 92.3,
  "historical": [{"date": "2024-01-01", "value": 44.2}, ...],
  "forecast": [{"date": "2024-02-01", "value": 46.5}, ...],
  "confidenceInterval": {
    "lower": [...],
    "upper": [...]
  }
}
```

### GET `/api/metrics`
Query params: `commodity` (string)

Response:
```json
[
  {"model": "XGBoost", "mae": 4.23, "rmse": 6.15, "mape": 8.4, "mase": 0.85, "r2": 0.94},
  ...
]
```

**Note:** The dashboard includes mock data for development. To connect to a real backend, create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://your-api-url.com/api
```

---

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dashboard page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ForecastChart.tsx
│   │   ├── ModelComparison.tsx
│   │   └── CommoditySelector.tsx
│   ├── lib/                  # Utilities
│   │   └── api.ts            # API client functions
│   └── types/                # TypeScript types
│       └── index.ts
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🎨 Customization

### Update Commodities
Edit `POPULAR_COMMODITIES` in `src/components/CommoditySelector.tsx`

### Change Theme Colors
Modify `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#22c55e',  // Change to your color
  }
}
```

### Add New Models
Update model list in `src/app/page.tsx`:
```typescript
['XGBoost', 'Prophet', 'SARIMA', 'LSTM', 'YourModel']
```

---

## 📊 Creating Python Backend API

To connect this dashboard to your Jupyter notebook models, create a FastAPI backend:

```python
# api.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained models
xgb_model = joblib.load('models/xgb_price_forecast.pkl')

@app.get("/api/forecast")
def get_forecast(commodity: str, model: str = "XGBoost"):
    # Your forecasting logic here
    # ...
    return {
        "commodity": commodity,
        "currentPrice": 45.50,
        "forecastPrice": 48.20,
        # ... rest of the data
    }

@app.get("/api/metrics")
def get_metrics(commodity: str):
    # Return model performance metrics
    return [
        {"model": "XGBoost", "mae": 4.23, ...},
        # ... rest of models
    ]

# Run with: uvicorn api:app --reload --port 8000
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Docker
```bash
docker build -t kalimati-dashboard .
docker run -p 3000:3000 kalimati-dashboard
```

### Static Export
```bash
# Update next.config.js:
# output: 'export'
npm run build
# Deploy the 'out' folder to any static host
```

---

## 📝 License

MIT License - Use freely for commercial and personal projects

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for Nepal's agricultural market forecasting**
