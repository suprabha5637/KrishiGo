# KrishiGo — External Integrations Architecture

## Overview

KrishiGo abstracts all third-party cloud services behind unified backend adapters, keeping API keys protected and providing resilient fallbacks.

---

## 1. Google Maps Platform

### Endpoints & APIs Used
1. **Maps JavaScript API** (Frontend):
   - Renders interactive satellite farm boundaries in `GoogleFarmMap.tsx`.
   - Visualizes soil health, crop vegetative indexes (NDVI), and irrigation zones.
2. **Places API & Geocoding API** (Backend):
   - Reverse-geocodes user coordinates to street addresses and postal pincodes (`/api/v1/location/reverse`).
   - Autocompletes customer delivery addresses.
3. **Routes API** (Backend):
   - Computes farm-to-consumer delivery dispatch times, ETA intervals, and optimal transit routes.

---

## 2. Google Gemini AI

### Capabilities
1. **KrishiGo Farm Copilot (`/api/v1/ai/chat`)**:
   - Specialized LLM prompt system for conversational agronomy assistance.
   - Answers soil treatment, pest outbreaks, seed selection, and fertilizer calculation queries.
2. **Crop Health & Disease Diagnostic Engine (`/api/v1/ai/diagnose`)**:
   - Accepts leaf and plant photos uploaded by farmers.
   - Multimodal image analysis identifies bacterial blights, fungi, nutrient deficiencies, and recommends treatments.

---

## 3. AGMARKNET (Government Mandi Price Integration)

- Location: `backend/app/services/market_service.py`
- Ingests daily market arrival quantities and minimum/maximum/modal commodity prices across regional mandis.
- Serves predictive price trends and optimal selling window suggestions in `MarketProfitPage.tsx`.

---

## 4. Firebase Authentication

- Manages phone OTP verification, email/password credentials, and Google OAuth.
- Issues JWT tokens validated by backend middleware in `backend/app/core/security.py`.
