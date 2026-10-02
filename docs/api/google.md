# KrishiGo — API Integrations Reference

## Google Maps Platform

All Google Maps API calls are made **server-side** through the backend.  
The API key is never exposed to the browser.

| API | Backend Env Var | Purpose | Backend Route |
|-----|----------------|---------|---------------|
| Maps JavaScript API | `VITE_GOOGLE_MAPS_API_KEY` (frontend-only, restricted) | Interactive map UI | N/A (client-side) |
| Geocoding API | `GOOGLE_MAPS_API_KEY` | Address ↔ lat/lng | `/api/v1/location/geocode` |
| Places API (New) | `GOOGLE_MAPS_API_KEY` | Address autocomplete | `/api/v1/location/autocomplete` |
| Address Validation | `GOOGLE_MAPS_API_KEY` | Validate delivery addresses | `/api/v1/location/validate-address` |
| Routes API | `GOOGLE_MAPS_API_KEY` | Delivery ETA & routing | `/api/v1/location/route` |
| Weather API | `GOOGLE_MAPS_API_KEY` | Farmer weather data | `/api/v1/farmer/weather` |
| Air Quality API | `GOOGLE_MAPS_API_KEY` | AQI for farmer | `/api/v1/farmer/weather` |
| Pollen API | `GOOGLE_MAPS_API_KEY` | Pollen data for farmer | `/api/v1/farmer/weather` |
| Time Zone API | `GOOGLE_MAPS_API_KEY` | Timezone detection | `/api/v1/location/geocode` |

---

## Gemini AI

| Use | Backend Env Var | Frontend Service | Backend Route |
|-----|----------------|------------------|---------------|
| Farm Copilot chat | `GEMINI_API_KEY` | `farmerService.aiCopilotService.chat()` | `/api/v1/ai/farm-copilot` |
| AI product search | `GEMINI_API_KEY` | `productService.getList()` | `/api/v1/commerce/products` |
| Crop disease analysis | `GEMINI_API_KEY` | `cropHealthService.analyzeImage()` | `/api/v1/farmer/crop-health/analyze` |
| Weather interpretation | `GEMINI_API_KEY` | `farmerWeatherService.get()` | `/api/v1/farmer/weather` |

> **Security**: The Gemini API key **never** goes in `VITE_*` variables. Backend only.

---

## Firebase

| Service | Env Vars | Purpose |
|---------|----------|---------|
| Firebase Auth | `VITE_FIREBASE_*` | Google sign-in, phone OTP |
| Firestore | Not used | (Reserved for future use) |

Firebase Auth token is validated server-side via `/api/v1/auth/firebase`.

---

## Weather Provider Fallback

```
Primary:   Google Weather API (via GOOGLE_MAPS_API_KEY)
Secondary: Open-Meteo (no key required — free fallback)
Fallback:  Cached last-known weather data
```

The frontend receives a normalized `WeatherSnapshot` object regardless of which provider responded.

---

## Rate Limiting & Cost Control

- Google Maps calls are cached per-location for 10 minutes (weather) / 60 min (geocoding)
- Gemini calls are rate-limited per user session
- Background jobs refresh data on schedules — not on every page load

---

## Adding a New Integration

1. Create adapter in `backend/app/services/integrations/`
2. Add backend route in `backend/app/api/v1/`
3. Add frontend service in `frontend/src/services/integrations/`
4. Add env var to `.env.example` and `backend/app/core/config.py`
5. Document here
