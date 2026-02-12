---
title: SkyPredict Flight Price API
emoji: ✈️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# SkyPredict — Flight Price Prediction API

FastAPI backend that predicts Indian airline flight ticket prices using a Random Forest model (R² = 0.98).

## Endpoints

| Method | Path        | Description                       |
| ------ | ----------- | --------------------------------- |
| `GET`  | `/`         | Health check                      |
| `GET`  | `/metadata` | Dropdown options for the frontend |
| `POST` | `/predict`  | Predict flight price              |
| `GET`  | `/docs`     | Interactive API documentation     |
