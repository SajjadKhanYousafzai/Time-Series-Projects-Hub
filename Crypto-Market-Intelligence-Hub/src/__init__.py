"""src package — Crypto Market Intelligence Hub.

Subpackages
-----------
data        : loading, cleaning, fetching and storing market data
features    : feature engineering (returns, technical indicators, pipeline)
models      : forecasting models (ARIMA, Prophet, LSTM, GRU) + evaluation
visualization : Plotly chart builders
api         : FastAPI REST backend
dashboard   : Streamlit multi-page app
utils       : shared utilities (logging, helpers)
"""

__version__ = "1.0.0"

__all__ = [
    "data",
    "features",
    "models",
    "visualization",
    "api",
    "dashboard",
    "utils",
]
