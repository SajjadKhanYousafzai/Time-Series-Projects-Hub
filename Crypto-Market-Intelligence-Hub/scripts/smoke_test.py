import sys
sys.path.insert(0, '.')

from src.data.load import load_all
from src.data.clean import basic_clean
from src.features.returns import add_return_features
from src.features.technical import compute_rsi, compute_macd, compute_bollinger_bands
from src.models.evaluate import compute_metrics, summary_by_asset
from src.utils.helpers import format_price, format_pct
import numpy as np, pandas as pd

errors = []

# metrics check
m = compute_metrics(np.array([1.0,2.0,3.0]), np.array([1.1,2.1,3.1]), 'test', 'btc')
assert 'mae' in m and 'rmse' in m and 'mape' in m and 'r2' in m
print("PASS: compute_metrics")

# RSI check
rsi = compute_rsi(pd.Series([float(i+1) for i in range(50)]), 14)
assert rsi.dropna().between(0, 100).all()
print("PASS: RSI")

# MACD check
close = pd.Series([float(i+1) for i in range(100)])
macd, sig, hist = compute_macd(close)
assert len(macd) == 100
print("PASS: MACD")

# Bollinger check — use oscillating series so std > 0; skip NaN (first row min_periods)
oscillating = pd.Series([float(100 + (i % 10) - 5) for i in range(100)])
upper, mid, lower = compute_bollinger_bands(oscillating)
valid = ~(upper.isna() | lower.isna())
assert (upper[valid] >= lower[valid] - 1e-10).all()
print("PASS: Bollinger Bands")

# Format check
price_str = format_price(42350.75)
assert "$" in price_str and "42,350" in price_str
print("PASS: format_price ->", price_str)

pct_str = format_pct(0.1523)
assert "%" in pct_str and "+" in pct_str
print("PASS: format_pct ->", pct_str)

# Return features
n = 100
dates = pd.date_range("2022-01-01", periods=n, freq="D")
df_test = pd.DataFrame({
    "date": dates,
    "open": np.abs(np.random.randn(n).cumsum()) + 100,
    "high": np.abs(np.random.randn(n).cumsum()) + 110,
    "low": np.abs(np.random.randn(n).cumsum()) + 90,
    "close": np.abs(np.random.randn(n).cumsum()) + 100,
    "volume": np.random.uniform(1e6, 1e8, n),
    "asset": "testcoin",
})
df_feat = add_return_features(df_test)
for col in ["return", "log_return", "rolling_vol_30", "cumulative_ret", "drawdown"]:
    assert col in df_feat.columns, f"Missing: {col}"
print("PASS: add_return_features")

print("\n=== ALL CORE MODULE TESTS PASSED ===")
