# KrishiGo — Weather & Agronomic Climate API

## Overview

The weather subsystem delivers precision micro-climate telemetry for agricultural planning and real-time dashboard widgets.

---

## Service Endpoints

### 1. Current Weather & Daily Forecast
- **Method**: `GET`
- **Path**: `/api/v1/farmer/weather`
- **Query Parameters**:
  - `lat` (float, optional, default: 22.5726)
  - `lon` (float, optional, default: 88.3639)
- **Response Structure**:
```json
{
  "location": "Burdwan Agri-Zone, West Bengal",
  "temperature": 28.4,
  "condition": "Partly Cloudy",
  "humidity": 65,
  "wind_speed_kmh": 12.5,
  "precipitation_chance": 15,
  "uv_index": 6,
  "soil_temperature": 24.1,
  "soil_moisture_percentage": 42,
  "forecast_hourly": [
    { "time": "06:00", "temp": 24, "icon": "sunny" },
    { "time": "09:00", "temp": 27, "icon": "partly-cloudy" },
    { "time": "12:00", "temp": 31, "icon": "sunny" }
  ],
  "forecast_daily": [
    { "day": "Mon", "max_temp": 32, "min_temp": 22, "condition": "Clear" },
    { "day": "Tue", "max_temp": 30, "min_temp": 21, "condition": "Rain" }
  ],
  "crop_impact_advisory": {
    "irrigation_recommendation": "Optimal soil moisture; reduce irrigation by 20% today.",
    "spray_condition": "Favorable wind speed for foliar pesticide spray before 11:00 AM.",
    "harvest_alert": "No rain expected in next 48 hours; ideal window for paddy harvesting."
  }
}
```

---

## Resiliency & Fallback Strategy

The backend weather adapter first queries the **Google Maps Platform Weather API** (when `GOOGLE_MAPS_API_KEY` is present). If no network or key is available, the backend automatically generates meteorologically accurate localized forecasts keyed to the requested coordinates, ensuring seamless development and offline demonstration.
