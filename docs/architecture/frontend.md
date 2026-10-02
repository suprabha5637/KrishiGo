# KrishiGo — Frontend Architecture

## Overview

The KrishiGo frontend is a high-performance single-page application built on **React 19**, **TypeScript**, and **Vite 8**, styled with custom design tokens and Tailwind CSS 4.

```
frontend/
├── public/                 # Static assets, SVG icons, reference media
│   └── assets/
│       ├── ecommerce/      # Product images, category banners, badges
│       └── farmer/         # Crop disease samples, weather graphics, map layers
├── src/
│   ├── components/         # Reusable presentation and layout components
│   │   ├── ecommerce/      # E-Commerce domain components (Header, Hero, ProductCards)
│   │   ├── farmer/         # Farmer domain components (FarmerLayout, GoogleFarmMap)
│   │   ├── auth/           # Authentication dialogs and modals
│   │   └── common/         # Domain-agnostic primitives (LocationPickerModal)
│   ├── pages/              # Routed page-level components
│   │   ├── krishigo/       # E-Commerce pages (HomePage, CategoryPage, OrdersPage)
│   │   └── farmer/         # Farmer pages (Weather, CropHealth, Market, Soil, etc.)
│   ├── services/           # Decoupled domain service clients
│   │   ├── ecommerce/      # E-Commerce API client methods
│   │   ├── farmer/         # Farmer intelligence API client methods
│   │   ├── auth/           # Firebase and JWT auth methods
│   │   └── integrations/   # Geolocation, maps, and weather helpers
│   ├── context/            # React context providers for global state
│   │   ├── AuthContext.tsx       # User profile, role, session
│   │   ├── LocationContext.tsx   # Pincode, coordinates, selected address
│   │   ├── WeatherContext.tsx    # Live weather, forecasts, agro-advisories
│   │   └── LanguageContext.tsx   # Multi-language translation state
│   ├── config/             # Environment, branding, and feature flags
│   │   └── app.config.ts         # Feature toggles and runtime constants
│   ├── lib/                # Core utilities
│   │   └── apiClient.ts          # Central fetch wrapper with auth header injection
│   └── types/              # Domain TypeScript interfaces and types
│       └── index.ts              # Data contracts shared across UI
```

---

## Key Design Patterns

### 1. Provider Abstraction
UI components never call `fetch` or invoke third-party SDKs directly. All external communication is routed through domain service files (`services/ecommerce/`, `services/farmer/`) and the central API client (`lib/apiClient.ts`).

### 2. Context-Driven Global State
- **AuthContext**: Persists user session, supports switching between Consumer and Farmer personas, and exposes `isFarmer` flags.
- **LocationContext**: Manages active delivery pincode, geocoded lat/lng coordinates, and reverse geocoding via backend endpoints.
- **WeatherContext**: Delivers real-time meteorological data and farming advisories across all views.
- **LanguageContext**: Manages multi-lingual localization without reload.

### 3. Path Alias System
Path aliases are configured natively in `tsconfig.app.json` and `vite.config.ts`:
- `@/*` → `./src/*`

### 4. Build Safety & Production Chunking
TypeScript compilation is verified with `tsc -b` and bundled via Vite for zero-error production artifacts.
