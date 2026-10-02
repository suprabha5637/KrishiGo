# KrishiGo — Backend Architecture

## Overview

The KrishiGo backend is built on **FastAPI** (Python 3.12), leveraging asynchronous request processing (`async`/`await`), **SQLAlchemy 2.0 Async ORM**, and **Pydantic v2** for validation.

```
backend/
├── app/
│   ├── api/
│   │   └── v1/             # Versioned REST API endpoints
│   │       ├── auth.py         # Login, signup, farmer profile onboarding
│   │       ├── commerce.py     # Categories, products, orders, cart, wallet
│   │       ├── farmer.py       # Weather, crop plans, soil, market rates, irrigation
│   │       ├── ai.py           # Gemini AI Copilot & disease diagnostics proxy
│   │       ├── location.py     # Reverse geocoding & Pincode resolution
│   │       └── translate.py    # Multi-language translation endpoint
│   ├── core/               # Central configuration & database connection
│   │   ├── config.py           # Settings loaded from environment variables
│   │   ├── database.py         # Async SQLite/PostgreSQL engine and sessionmaker
│   │   └── security.py         # JWT tokens, password hashing, Firebase admin verify
│   ├── models/             # SQLAlchemy ORM database models
│   │   └── all_models.py       # Category, Product, Order, User, Farm, etc.
│   ├── schemas/            # Pydantic data validation schemas
│   │   └── all_schemas.py      # Request and response models
│   ├── services/           # Domain business logic & external API adapters
│   │   ├── google_crop_health.py # Crop disease detection adapter
│   │   ├── weather_service.py    # Meteorological forecast integration
│   │   └── market_service.py     # AGMARKNET commodity price scrapers/APIs
│   └── main.py             # FastAPI application initialization & CORS
└── service-account.json    # Firebase / GCP service account credentials
```

---

## Architecture Principles

### 1. Zero External API Keys on Frontend
All sensitive credentials (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, Firebase private keys) reside securely on the backend in `.env`. The frontend accesses external services exclusively through proxied backend endpoints (`/api/v1/ai/*`, `/api/v1/farmer/weather`, etc.).

### 2. Async Database Operations
Every database interaction utilizes `AsyncSession` with SQLAlchemy 2.0:
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### 3. Graceful Fallback Architecture
For mission-critical farmer features (weather forecasts, crop diagnosis, mandi rates), the backend implements a resilient two-tier design:
- **Tier 1 (Live Cloud API)**: Directly queries Google Maps Platform, Google Gemini, or AGMARKNET.
- **Tier 2 (Synthetic Seed / Cache)**: If offline, rate-limited, or running without cloud credentials, endpoints automatically serve rich, realistic agricultural fallbacks ensuring 100% uptime for presentations and field testing.
