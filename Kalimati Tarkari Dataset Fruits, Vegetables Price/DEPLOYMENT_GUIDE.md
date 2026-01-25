# 🚀 Complete Production Deployment Guide

## 📦 Full Stack Architecture

```
┌─────────────────────────────────────────────────┐
│          TypeScript Dashboard (Frontend)         │
│    Next.js 14 + React + Tailwind + Recharts    │
│              Port: 3000                          │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST API
                   ▼
┌─────────────────────────────────────────────────┐
│          FastAPI Backend (API Server)           │
│      Python 3.11 + FastAPI + Pydantic          │
│              Port: 8000                          │
└──────────────────┬──────────────────────────────┘
                   │ Model Loading
                   ▼
┌─────────────────────────────────────────────────┐
│        Trained ML Models (Inference)            │
│   XGBoost, Prophet, SARIMA, LightGBM, LSTM     │
│           Saved as .pkl files                   │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Deployment

### **Step 1: Setup Python Backend API**

```bash
# Navigate to project directory
cd "Kalimati Tarkari Dataset Fruits, Vegetables Price"

# Install API dependencies
pip install -r api_requirements.txt

# Start API server
python api.py
```

API will be available at: `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs`

---

### **Step 2: Setup TypeScript Dashboard**

```bash
# Navigate to dashboard directory
cd dashboard

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

Dashboard will be available at: `http://localhost:3000`

---

### **Step 3: Export Models from Jupyter Notebook**

Add this cell to your notebook to save trained models:

```python
import joblib
from pathlib import Path

# Create models directory
models_dir = Path('models')
models_dir.mkdir(exist_ok=True)

# Save XGBoost model
if 'xgb_model' in locals():
    joblib.dump(xgb_model, 'models/xgb_model.pkl')
    print("✅ XGBoost model saved!")

# Save LightGBM model
if 'lgbm_model' in locals():
    joblib.dump(lgbm_model, 'models/lgbm_model.pkl')
    print("✅ LightGBM model saved!")

# Save feature engineered dataset
if 'feature_df_clean' in locals():
    feature_df_clean.to_csv('models/features.csv', index=False)
    print("✅ Features saved!")

print("\n🎉 All models exported successfully!")
```

---

### **Step 4: Connect Frontend to Backend**

Create `.env.local` in dashboard directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🌐 Production Deployment

### **Option 1: Docker Deployment (Recommended)**

Create `Dockerfile` for API:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY api.py requirements.txt ./
COPY Dataset/ ./Dataset/
COPY models/ ./models/

RUN pip install --no-cache-dir -r api_requirements.txt

EXPOSE 8000
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `Dockerfile` for Dashboard:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY dashboard/package*.json ./
RUN npm ci

COPY dashboard/ ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./models:/app/models
      - ./Dataset:/app/Dataset

  dashboard:
    build:
      context: .
      dockerfile: Dockerfile.dashboard
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000/api
    depends_on:
      - api
```

Deploy with:
```bash
docker-compose up -d
```

---

### **Option 2: Cloud Deployment**

#### **Backend on Railway/Render:**
1. Push code to GitHub
2. Connect Railway/Render to repository
3. Set build command: `pip install -r api_requirements.txt`
4. Set start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`

#### **Frontend on Vercel:**
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory: `dashboard`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-api-url>`
5. Deploy

---

## 🔧 Configuration

### **API Configuration (api.py)**

Update CORS origins for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.vercel.app"],
    ...
)
```

### **Dashboard Configuration**

Update API base URL for production in `dashboard/src/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api.railway.app/api'
```

---

## 📊 Testing the Stack

### **1. Test API:**
```bash
curl http://localhost:8000/api/forecast?commodity=Potato&model=XGBoost
```

### **2. Test Dashboard:**
Open browser: `http://localhost:3000`

### **3. Test Integration:**
Select a commodity in the dashboard and verify data loads from API.

---

## 🛠️ Maintenance

### **Update Models:**
1. Retrain models in Jupyter notebook
2. Export with `joblib.dump()`
3. Replace files in `models/` directory
4. Restart API server

### **Add New Commodity:**
1. Data exists in CSV automatically
2. Add to `POPULAR_COMMODITIES` in `CommoditySelector.tsx`
3. No backend changes needed

### **Monitor Performance:**
- API logs: Check FastAPI console output
- Dashboard logs: Check browser console
- Set up monitoring with Sentry/DataDog for production

---

## 📈 Scaling

### **Horizontal Scaling:**
- Use Redis for caching predictions
- Deploy multiple API instances behind load balancer
- Use CDN for dashboard static assets

### **Performance Optimization:**
- Cache model predictions for 1-6 hours
- Implement request rate limiting
- Pre-compute forecasts for popular commodities

---

## 🔒 Security

### **API Security:**
```python
from fastapi import Security, HTTPException
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

@app.get("/api/forecast")
async def get_forecast(api_key: str = Security(api_key_header)):
    if api_key != "your-secret-key":
        raise HTTPException(status_code=403)
    # ... rest of code
```

### **Dashboard Security:**
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting on API calls

---

## 📞 Troubleshooting

### **Issue: Frontend can't connect to API**
- Check CORS settings in `api.py`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check if API is running: `curl http://localhost:8000`

### **Issue: Models not loading**
- Verify `models/` directory exists
- Check model files exist (.pkl)
- Check file permissions

### **Issue: Dashboard build fails**
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

---

## 🎉 Success Checklist

✅ API running on port 8000  
✅ Dashboard running on port 3000  
✅ Models loaded successfully  
✅ Forecast data displays correctly  
✅ Model comparison shows metrics  
✅ Commodity selector works  
✅ Charts render properly  
✅ Production build successful  

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment Guide](https://docs.railway.app)

---

**🚀 You now have a complete production-ready forecasting system!**

**Stack: Python + FastAPI + Next.js + TypeScript + Tailwind + Recharts**

**Ready to deploy to production! 🎊**
