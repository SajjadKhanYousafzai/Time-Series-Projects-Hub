# 📦 Installation Guide - Complete Setup

## ✅ **All Dependencies for the Complete Forecasting System**

---

## 🎯 Quick Install (All-in-One)

### **Option 1: Install Everything**

```bash
# Main ML dependencies
pip install -r requirements.txt

# API dependencies
pip install -r api_requirements.txt

# Frontend dependencies (in dashboard folder)
cd dashboard
npm install
cd ..
```

---

## 📚 Detailed Installation by Component

### **1. Core Data Science (Required)**

```bash
# Basic analysis
pip install pandas numpy matplotlib seaborn plotly

# Time series
pip install statsmodels pmdarima

# Machine learning
pip install scikit-learn

# Jupyter notebook
pip install jupyter ipykernel ipywidgets
```

**Use for:** Steps 1-13 (Data prep, EDA, feature engineering, baseline models)

---

### **2. Advanced Statistical Models (Steps 15)**

```bash
# Facebook Prophet
pip install prophet

# Note: Prophet may require additional dependencies on Windows:
# - Microsoft C++ Build Tools
# - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

**Use for:** SARIMA and Prophet models

---

### **3. Machine Learning Models (Step 16)**

```bash
# Gradient boosting
pip install xgboost lightgbm

# Model serialization
pip install joblib
```

**Use for:** XGBoost and LightGBM models

---

### **4. Deep Learning Models (Step 17 - Optional)**

```bash
# TensorFlow and Keras
pip install tensorflow>=2.15.0

# Or for CPU-only (smaller download):
pip install tensorflow-cpu>=2.15.0

# Alternative: PyTorch
pip install torch torchvision torchaudio
```

**Use for:** LSTM and neural network models

⚠️ **Note:** TensorFlow is ~500MB. Skip if you don't need LSTM.

---

### **5. API Backend (FastAPI)**

```bash
# FastAPI and server
pip install fastapi uvicorn[standard]

# Data validation
pip install pydantic

# HTTP utilities
pip install python-multipart
```

**Use for:** REST API server (api.py)

---

### **6. Frontend Dashboard (TypeScript)**

```bash
# Navigate to dashboard folder
cd dashboard

# Install all Node.js dependencies
npm install

# This installs:
# - Next.js 14
# - React 18
# - TypeScript 5.3
# - Tailwind CSS 3.4
# - Recharts 2.10
# - Axios
# - Lucide React icons
```

**Use for:** Interactive web dashboard

---

## 🔧 Installation by Platform

### **Windows**

```powershell
# Install Python packages
pip install -r requirements.txt -r api_requirements.txt

# Install Node.js packages
cd dashboard
npm install
```

**Common Issues:**
- Prophet: Install Visual C++ Build Tools
- TensorFlow: Use CPU version if no GPU

---

### **macOS**

```bash
# Install Python packages
pip3 install -r requirements.txt -r api_requirements.txt

# Install Node.js packages
cd dashboard
npm install
```

**Common Issues:**
- Use `pip3` instead of `pip`
- Use `python3` instead of `python`

---

### **Linux (Ubuntu/Debian)**

```bash
# Update system
sudo apt update

# Install Python dependencies
sudo apt install python3-pip python3-dev

# Install packages
pip3 install -r requirements.txt -r api_requirements.txt

# Install Node.js packages
cd dashboard
npm install
```

---

## 📋 Verify Installation

### **Check Python Packages:**

```python
# Run this in Python/Jupyter
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from prophet import Prophet
import xgboost as xgb
import lightgbm as lgb

print("✅ All core packages installed successfully!")

# Optional: Check TensorFlow
try:
    import tensorflow as tf
    print(f"✅ TensorFlow {tf.__version__} installed")
except ImportError:
    print("⚠️ TensorFlow not installed (optional for LSTM)")
```

### **Check API Dependencies:**

```bash
# Check FastAPI
python -c "import fastapi; print('✅ FastAPI installed')"

# Check Uvicorn
python -c "import uvicorn; print('✅ Uvicorn installed')"
```

### **Check Frontend Dependencies:**

```bash
cd dashboard

# List installed packages
npm list --depth=0

# Should show:
# ✅ next@14.x.x
# ✅ react@18.x.x
# ✅ typescript@5.x.x
# ✅ tailwindcss@3.x.x
# ✅ recharts@2.x.x
```

---

## 🐍 Virtual Environment (Recommended)

### **Create Virtual Environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt -r api_requirements.txt
```

### **Conda Environment:**

```bash
# Create environment
conda create -n kalimati python=3.11

# Activate
conda activate kalimati

# Install packages
pip install -r requirements.txt -r api_requirements.txt
```

---

## 🎯 Minimal Installation (Skip Optional)

If you want to skip deep learning (LSTM) and just run statistical + ML models:

```bash
# Install everything EXCEPT TensorFlow
pip install pandas numpy matplotlib seaborn plotly
pip install statsmodels pmdarima prophet
pip install scikit-learn xgboost lightgbm joblib
pip install jupyter ipykernel

# API
pip install fastapi uvicorn pydantic

# Frontend
cd dashboard && npm install
```

**This skips:** TensorFlow (~500MB), which is only needed for LSTM (Step 17)

---

## 🚀 Test Full Installation

### **1. Test Jupyter Notebook:**

```bash
jupyter notebook Tarkari.ipynb
# Run cells 1-14 (baseline models)
```

### **2. Test API:**

```bash
python api.py
# Visit: http://localhost:8000/docs
```

### **3. Test Dashboard:**

```bash
cd dashboard
npm run dev
# Visit: http://localhost:3000
```

---

## ⚠️ Troubleshooting

### **Prophet Installation Issues:**

```bash
# Windows: Install Visual C++ Build Tools first
# Then:
pip install pystan==2.19.1.1
pip install prophet

# Or use conda:
conda install -c conda-forge prophet
```

### **TensorFlow Installation Issues:**

```bash
# Use CPU version (no GPU required):
pip install tensorflow-cpu

# Or use specific version:
pip install tensorflow==2.15.0
```

### **XGBoost/LightGBM Issues:**

```bash
# Windows: May need Visual C++
pip install --upgrade xgboost lightgbm

# Or use conda:
conda install -c conda-forge xgboost lightgbm
```

### **Node.js Issues:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Disk Space Requirements

| Component | Size | Required |
|-----------|------|----------|
| Python packages (core) | ~500 MB | ✅ Yes |
| TensorFlow | ~500 MB | ⚠️ Optional |
| Node modules | ~300 MB | ✅ Yes (for dashboard) |
| Dataset | ~50 MB | ✅ Yes |
| **Total** | **~1.3 GB** | |

---

## ✅ Installation Complete!

Once all dependencies are installed, you can:

1. ✅ Run the Jupyter notebook (Steps 1-19)
2. ✅ Train all models (baseline, ML, LSTM, ensemble)
3. ✅ Start the API server
4. ✅ Launch the dashboard
5. ✅ Deploy to production

---

**Next Step:** See [QUICKSTART.md](QUICKSTART.md) for running the system!

**Questions?** Check [README.md](README.md) for more details.
