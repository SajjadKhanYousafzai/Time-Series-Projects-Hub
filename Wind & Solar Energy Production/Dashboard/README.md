# Wind & Solar Energy Dashboard

This dashboard visualizes the best performing model for Energy Production forecasting and provides an interface for real-time predictions.

## Structure

- **backend**: FastAPI application serving the trained Random Forest model.
- **frontend**: Next.js (TypeScript) application for visualization.

## Setup Instructions

### 1. Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
uvicorn main:app --reload
```

The API will run at `http://localhost:8000`.

### 2. Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies (including UI libraries):

```bash
npm install recharts lucide-react
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Model Details

- **Algorithm**: Random Forest Regressor
- **Features**: Year, Month, Day, DayOfWeek, Hour, Source
- **Target**: Energy Production (MWh)
