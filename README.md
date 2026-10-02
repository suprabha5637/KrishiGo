# KrishiGo 🌿

> **Fresh from Farms. Faster to You.**

KrishiGo is a full-stack, AI-powered agri-commerce platform combining a consumer-facing e-commerce marketplace with a dedicated Farmer Intelligence Command Center — all backed by Google Cloud, Google Maps Platform, Gemini AI, and Firebase.

---

## Products

| Product | Description | Route |
|---------|-------------|-------|
| **KrishiGo E-Commerce** | Consumer grocery & agri-product marketplace | `/` |
| **KrishiGo Farmer** | AI-powered agricultural intelligence dashboard | `/farmer` |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, TailwindCSS 4 |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite (dev) / PostgreSQL (production) |
| Auth | Firebase Authentication + JWT |
| AI | Google Gemini API (via backend proxy) |
| Maps | Google Maps Platform (Maps JS, Places, Geocoding, Routes) |
| Hosting | Firebase Hosting / Cloud Run (configured) |

---

## Repository Structure

```
KrishiGo/
├── frontend/               # React + Vite frontend (E-Commerce + Farmer UI)
│   └── src/
│       ├── components/
│       │   ├── ecommerce/  # E-Commerce UI components
│       │   ├── farmer/     # Farmer UI components
│       │   ├── auth/       # Authentication modals
│       │   └── common/     # Shared UI components
│       ├── pages/
│       │   ├── krishigo/   # E-Commerce pages
│       │   └── farmer/     # Farmer pages
│       ├── services/
│       │   ├── ecommerce/  # E-Commerce API service
│       │   ├── farmer/     # Farmer API service
│       │   ├── auth/       # Auth service
│       │   └── integrations/ # Maps, location, weather services
│       ├── context/        # React context providers
│       ├── hooks/          # Custom React hooks
│       ├── types/          # TypeScript type definitions
│       ├── config/         # App configuration & feature flags
│       └── lib/            # Core utilities (API client, etc.)
│
├── backend/                # Python FastAPI backend
│   └── app/
│       ├── api/v1/         # HTTP route handlers
│       ├── services/       # Business logic services
│       ├── models/         # SQLAlchemy ORM models
│       ├── schemas/        # Pydantic request/response schemas
│       ├── core/           # App config, security, database setup
│       └── jobs/           # Background jobs (sync, cache, etc.)
│
├── database/               # Database assets
│   ├── seeds/              # Seed data scripts
│   ├── migrations/         # Alembic migrations
│   └── schema/             # Schema documentation
│
├── docs/                   # Documentation
│   ├── architecture/       # System architecture docs
│   ├── api/                # API integration docs
│   ├── deployment/         # Deployment guides
│   ├── client/             # Client handover docs
│   └── screenshots/        # Development reference screenshots
│
├── scripts/                # Utility scripts
├── .env.example            # Environment variable template
└── krishigo.db             # SQLite development database
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- A Google Cloud project with APIs enabled (see `.env.example`)

### 1. Environment Setup

```bash
cp .env.example .env
# Edit .env and fill in your API keys
```

```bash
cp frontend/.env.example frontend/.env
# Add VITE_GOOGLE_MAPS_API_KEY and Firebase config
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 3. Backend

```bash
cd backend
pip install -r requirements.txt   # (see docs/deployment/local-development.md)
python -m backend.app.main
# → http://localhost:8000
```

---

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | E-Commerce homepage |
| `/category/:slug` | Category product listing |
| `/orders` | Customer order history |
| `/farmer` | Farmer dashboard home |
| `/farmer/weather` | Weather intelligence |
| `/farmer/crop-planner` | Crop planning |
| `/farmer/crop-health` | AI crop disease detection |
| `/farmer/soil-field` | Soil & field management |
| `/farmer/irrigation` | Irrigation management |
| `/farmer/farm-management` | Farm management |
| `/farmer/market-profit` | Market prices & profit analysis |
| `/farmer/monitoring` | Farm monitoring |
| `/farmer/services` | Farm services |
| `/farmer/ai` | AI Copilot |
| `/farmer/settings` | Farmer settings |

---

## Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [API Integrations](docs/api/google.md)
- [Deployment Guide](docs/deployment/production.md)
- [Client Handover](docs/client/handover.md)
- [Environment Variables](docs/deployment/environment.md)

---

## License

Proprietary — KrishiGo © 2026. All rights reserved.
