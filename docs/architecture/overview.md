# KrishiGo — System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS                                     │
│         E-Commerce Consumer    Farmer                        │
└────────────────┬───────────────────┬────────────────────────┘
                 │                   │
                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND  (React + Vite + TypeScript)           │
│                                                              │
│  ┌──────────────────────┐   ┌──────────────────────────┐   │
│  │   E-Commerce UI       │   │   Farmer UI               │   │
│  │  /src/components/    │   │  /src/components/farmer/  │   │
│  │  ecommerce/          │   │  /src/pages/farmer/       │   │
│  │  /src/pages/krishigo/│   │                           │   │
│  └──────────┬───────────┘   └──────────┬────────────────┘   │
│             │                          │                      │
│  ┌──────────▼──────────────────────────▼────────────────┐   │
│  │              Service Layer  /src/services/             │   │
│  │   ecommerceService  │  farmerService  │  authService  │   │
│  │   locationService   │  (no raw fetch in UI)           │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────────────┐  │
│  │           Core API Client  /src/lib/apiClient.ts        │  │
│  └───────────────────────┬───────────────────────────────┘  │
└──────────────────────────┼─────────────────────────────────┘
                           │  HTTP /api/v1/*
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND  (FastAPI + Python)                      │
│                                                              │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  /api/v1/auth  │  │/api/v1/      │  │/api/v1/        │  │
│  │                │  │ commerce     │  │ farmer         │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Service Layer  /app/services/               │ │
│  │   ecommerce/  │  farmer/  │  integrations/  │  ai/      │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │   Integration Adapters  /app/services/integrations/     │  │
│  │  GoogleMapsAdapter │ GeminiAdapter │ WeatherAdapter      │  │
│  └────────────────────────┬───────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │
              ┌─────────────┼──────────────────┐
              ▼             ▼                  ▼
    ┌──────────────┐ ┌────────────┐  ┌──────────────────┐
    │ Google Maps  │ │  Gemini AI │  │  Firebase Auth   │
    │ Platform     │ │  API       │  │                  │
    │ Places       │ │            │  └──────────────────┘
    │ Geocoding    │ └────────────┘
    │ Routes       │
    │ Weather      │
    │ Air Quality  │
    │ Pollen       │
    └──────────────┘
```

## Data Flow Principle

> External API credentials **never** reach the frontend.
>
> UI → Service Layer → apiClient → Backend → Provider Adapters → External API

## Key Principles

1. **Provider Abstraction** — UI doesn't know which provider supplies weather, maps, or AI
2. **Centralized API Client** — Single `apiClient.ts` handles auth tokens, errors, retries
3. **Domain Services** — `ecommerceService`, `farmerService` own their API calls
4. **Feature Flags** — `config/app.config.ts` controls features without code changes
5. **Farmer Isolation** — Farmer and E-Commerce are separated concerns at every layer

## Frontend Layers

| Layer | Location | Responsibility |
|-------|----------|---------------|
| Pages | `src/pages/` | Route-level composition |
| Components | `src/components/` | Reusable UI elements |
| Context | `src/context/` | Global state (auth, location, language, weather) |
| Services | `src/services/` | API calls, domain logic |
| Lib | `src/lib/` | Core utilities (apiClient) |
| Config | `src/config/` | Feature flags, constants |
| Types | `src/types/` | TypeScript interfaces |

## Backend Layers

| Layer | Location | Responsibility |
|-------|----------|---------------|
| Routes | `app/api/v1/` | HTTP endpoint definitions |
| Services | `app/services/` | Business logic |
| Models | `app/models/` | Database ORM models |
| Schemas | `app/schemas/` | Pydantic request/response |
| Core | `app/core/` | Config, security, database |
| Jobs | `app/jobs/` | Background synchronization |
