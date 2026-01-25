# ⚡ Quick Start Guide - 5 Minutes to Running Dashboard

## 🎯 **Get the full forecasting system running in 5 minutes!**

---

## Prerequisites

- ✅ **Python 3.11+** installed
- ✅ **Node.js 18+** installed
- ✅ **Git** installed (optional)

---

## 🚀 Option 1: Run Full Stack (Recommended)

### **Step 1: Setup Python Environment (2 minutes)**

```bash
# Navigate to project directory
cd "Kalimati Tarkari Dataset Fruits, Vegetables Price"

# Install Python dependencies
pip install pandas numpy matplotlib seaborn plotly scikit-learn statsmodels prophet xgboost lightgbm
pip install fastapi uvicorn pydantic python-multipart

# Or use requirements files
pip install -r requirements.txt
pip install -r api_requirements.txt
```

### **Step 2: Start API Server (30 seconds)**

```bash
# Start FastAPI backend
python api.py
```

✅ **API running at:** http://localhost:8000  
✅ **API docs at:** http://localhost:8000/docs

**Keep this terminal open!**

---

### **Step 3: Setup Dashboard (1 minute)**

Open a **NEW terminal** and run:

```bash
# Navigate to dashboard
cd dashboard

# Install Node.js dependencies
npm install
```

### **Step 4: Start Dashboard (30 seconds)**

```bash
# Start Next.js development server
npm run dev
```

✅ **Dashboard running at:** http://localhost:3000

**Keep this terminal open!**

---

### **Step 5: Open in Browser**

Open your browser and visit:

🌐 **http://localhost:3000**

**You should see:**
- ✅ Interactive dashboard with forecast charts
- ✅ Commodity selector with search
- ✅ Model comparison metrics
- ✅ Real-time price predictions

---

## 🎓 Option 2: Jupyter Notebook Only (Simplest)

### **Just want to run the analysis?**

```bash
# Install dependencies
pip install -r requirements.txt

# Start Jupyter
jupyter notebook Tarkari.ipynb
```

✅ **Notebook opens in browser**

**Run cells sequentially (Shift+Enter)**

---

## 🐳 Option 3: Docker (Advanced)

### **Coming Soon!**

Create `docker-compose.yml` and run:

```bash
docker-compose up
```

---

## 🎨 Dashboard Features

Once running, try these features:

### **1. Select Commodity**
- Click on any vegetable (Potato, Tomato, Onion, etc.)
- Use search bar to find specific items

### **2. Switch Models**
- Click model buttons: XGBoost, Prophet, SARIMA, LSTM
- See how predictions differ

### **3. View Metrics**
- Scroll down to see model comparison table
- Check MAE, RMSE, MAPE, R² scores

### **4. Analyze Forecast**
- Blue line = Historical prices
- Orange dashed line = Forecast
- Shaded area = Confidence interval

---

## 🔧 Troubleshooting

### **Problem: API won't start**

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
pip install fastapi uvicorn
```

---

### **Problem: Dashboard shows blank page**

**Error:** `Cannot connect to API`

**Solution:**
1. Check if API is running (Terminal 1)
2. Visit http://localhost:8000 to confirm
3. Check CORS settings in `api.py`

---

### **Problem: npm install fails**

**Error:** `npm ERR! code ENOENT`

**Solution:**
```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force

# Try again
npm install
```

---

### **Problem: Port already in use**

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Option 1: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
npm run dev -- -p 3001
```

---

## 📊 What to Expect

### **API Response Time**
- First request: ~2-3 seconds (model loading)
- Subsequent requests: <500ms

### **Dashboard Load Time**
- Initial load: ~3-5 seconds
- Navigation: <1 second

### **Mock Data Mode**
The system uses **mock data by default** for testing.  
To use real models:
1. Train models in Jupyter notebook
2. Export with `joblib.dump(model, 'models/xgb_model.pkl')`
3. Restart API server

---

## 🎯 Test the System

### **1. Test API Directly**

```bash
# Health check
curl http://localhost:8000

# Get forecast
curl "http://localhost:8000/api/forecast?commodity=Potato&model=XGBoost"

# Get metrics
curl "http://localhost:8000/api/metrics?commodity=Potato"
```

### **2. Test Dashboard**

1. ✅ Open http://localhost:3000
2. ✅ Select "Potato" commodity
3. ✅ Click "XGBoost" model
4. ✅ See forecast chart appear
5. ✅ Scroll to model comparison
6. ✅ Check metrics table

---

## 📚 Next Steps

### **For Developers:**
1. Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment
2. Explore API docs at http://localhost:8000/docs
3. Customize dashboard in `dashboard/src/components/`
4. Add new models in `api.py`

### **For Data Scientists:**
1. Open `Tarkari.ipynb` in Jupyter
2. Run all cells to train models
3. Export models with joblib
4. See predictions in dashboard

### **For Production:**
1. Train models on full dataset
2. Export all model artifacts
3. Update API to load real models
4. Deploy to cloud (see DEPLOYMENT_GUIDE.md)

---

## 🎉 Success Checklist

After following this guide, you should have:

- ✅ API running on port 8000
- ✅ Dashboard running on port 3000
- ✅ Interactive forecast charts
- ✅ Commodity selector working
- ✅ Model comparison displaying
- ✅ No console errors

---

## 📞 Need Help?

### **Check these first:**
1. Are both terminals still running?
2. Did you install all dependencies?
3. Are ports 3000 and 8000 free?
4. Is your firewall blocking the ports?

### **Common Issues:**
- Python version too old → Upgrade to 3.11+
- Node version too old → Upgrade to 18+
- Port conflicts → Change ports in config
- CORS errors → Check `api.py` CORS settings

---

## 🚀 **That's it! You're ready to forecast vegetable prices!**

**Total setup time: ~5 minutes**  
**Files modified: 0**  
**Just run and enjoy! 🎊**

---

**Built with ❤️ for easy deployment**

**Questions?** Check:
- [README.md](README.md) - Project overview
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical details
- [dashboard/README.md](dashboard/README.md) - Dashboard docs
