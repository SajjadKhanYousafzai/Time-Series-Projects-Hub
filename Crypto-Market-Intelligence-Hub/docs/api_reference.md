# API Reference

## Base URL

- **Local:** `http://localhost:8000`
- **Production:** Configure via `NEXT_PUBLIC_API_URL` env var

## Authentication

Currently unauthenticated (suitable for internal/demo use). Add Bearer token middleware via `SECRET_KEY` for production.

## Endpoints

---

### `GET /api/v1/health`

Health check endpoint.

**Response**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-01-15T10:00:00Z",
  "checks": {
    "data_dir": "ok"
  }
}
```

---

### `GET /api/v1/assets`

List all available asset identifiers.

**Response**
```json
{
  "assets": ["bitcoin", "ethereum", "solana", "..."],
  "count": 49
}
```

---

### `GET /api/v1/history/{asset}`

Retrieve historical OHLCV data for an asset.

**Path Parameters**
| Param | Type | Description |
|---|---|---|
| `asset` | string | Asset name (e.g. `bitcoin`) |

**Query Parameters**
| Param | Type | Default | Description |
|---|---|---|---|
| `start` | string | — | Start date `YYYY-MM-DD` |
| `end` | string | — | End date `YYYY-MM-DD` |
| `limit` | int | 500 | Max rows (1–5000) |

**Response**
```json
{
  "asset": "bitcoin",
  "currency": "USD",
  "total": 500,
  "start_date": "2024-01-01T00:00:00",
  "end_date": "2025-06-01T00:00:00",
  "records": [
    {
      "date": "2024-01-01T00:00:00",
      "open": 42100.0,
      "high": 43500.0,
      "low": 41800.0,
      "close": 42350.0,
      "volume": 25000000000.0,
      "asset": "bitcoin"
    }
  ]
}
```

---

### `POST /api/v1/predict`

Run a forecasting model for an asset.

**Request Body**
```json
{
  "asset": "bitcoin",
  "model": "prophet",
  "horizon": 30
}
```

| Field | Type | Required | Options |
|---|---|---|---|
| `asset` | string | ✅ | Any asset from `/assets` |
| `model` | string | ✅ | `prophet`, `arima`, `lstm`, `gru` |
| `horizon` | int | ✅ | 1–90 |

**Response**
```json
{
  "asset": "bitcoin",
  "model": "prophet",
  "horizon": 30,
  "current_price": 67350.0,
  "generated_at": "2026-06-21T10:00:00Z",
  "metrics": {
    "mae": 1250.5,
    "rmse": 1870.3,
    "mape": 2.34,
    "r2": 0.91
  },
  "forecast": [
    {
      "date": "2026-06-22T00:00:00",
      "predicted": 68100.0,
      "lower": 65200.0,
      "upper": 71000.0
    }
  ]
}
```

---

### `GET /api/v1/predict/{asset}`

Convenience GET endpoint (Prophet, configurable horizon).

**Query Parameters**
| Param | Default | Description |
|---|---|---|
| `horizon` | 30 | Forecast days |

---

## Error Responses

| Status | Description |
|---|---|
| 400 | Invalid model name or parameters |
| 404 | Asset not found |
| 500 | Forecasting model failure |

**Example error:**
```json
{
  "detail": "Asset 'unknown_coin' not found."
}
```

---

## Interactive Docs

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
