# 🌿 KrishiGo

**Fresh from Farms. Faster to You.**

KrishiGo is a production-oriented agricultural commerce platform combining hyperlocal quick commerce, B2B bulk marketplace, farmer procurement, warehouse management, delivery management, and AI-powered agricultural intelligence.

---

## 🌟 Features

### For Customers
- **Quick Commerce** — Fast delivery of fresh agricultural products
- **Product Catalog** — Browse 50+ categories of farm-fresh produce
- **Quality Selection** — Choose Premium, Standard, or Value grades
- **Bulk Orders** — B2B ordering for weddings, restaurants, businesses
- **Order Tracking** — Real-time order status with delivery timeline
- **Smart Search** — Autocomplete, filters, and recommendations

### For Farmers
- **Farmer Portal** — Manage crops, sell produce, track earnings
- **Crop Management** — Track planting to harvest lifecycle
- **AI Farming Assistant** — Get agricultural guidance and advice
- **Harvest Intelligence** — Smart maturity and harvest predictions
- **Demand Intelligence** — See what customers need
- **Farmer Store** — Purchase seeds, tools, fertilizers, and more

### For Operations
- **Warehouse Management** — Receiving, inspection, inventory, picking, packing, dispatch
- **Procurement System** — Farmer/supplier matching, purchase orders, quality grading
- **Delivery Management** — Partner management, route optimization, OTP delivery
- **Batch Traceability** — Track every product from farm to customer
- **Food Waste Reduction** — Aging inventory detection, promotions, analytics

### For Admins
- **Business Analytics** — Revenue, orders, growth, performance dashboards
- **Unit Economics** — Contribution profit, margins, cost breakdown
- **User Management** — Customers, farmers, suppliers, staff
- **Audit Logging** — Complete operational event trail

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Python, FastAPI, Pydantic, SQLAlchemy |
| **Database** | PostgreSQL 16, Redis 7 |
| **ML/AI** | scikit-learn, XGBoost, LightGBM, PyTorch |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Cloud** | AWS (S3, ECS, CloudWatch) |

---

## 📁 Project Structure

```
krishigo/
├── frontend/          # Next.js + TypeScript + Tailwind + shadcn/ui
├── backend/           # FastAPI + SQLAlchemy + Alembic
├── ml/                # ML pipelines (demand, harvest, recommendations)
├── docs/              # Documentation
├── docker/            # Docker configs
├── scripts/           # Utility scripts
├── tests/             # Integration/E2E tests
├── .github/workflows/ # CI/CD
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/krishigo.git
cd krishigo

# Copy environment variables
cp .env.example .env

# Start all services
docker compose up

# Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp ../.env.example .env

# Run database migrations
alembic upgrade head

# Seed demo data
python -m scripts.seed

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp ../.env.example .env.local

# Start the development server
npm run dev
```

---

## 🔐 Authentication

KrishiGo uses JWT-based authentication with role-based access control (RBAC).

### User Roles

| Role | Access |
|------|--------|
| `CUSTOMER` | Shopping, orders, bulk orders |
| `FARMER` | Farmer portal, crop management, sell produce |
| `DELIVERY_PARTNER` | Delivery dashboard, assignments |
| `WAREHOUSE_STAFF` | Warehouse operations, inventory |
| `PROCUREMENT_MANAGER` | Procurement, supplier management |
| `ADMIN` | Business management, analytics |
| `SUPER_ADMIN` | Full system access |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@krishigo.com | demo1234 |
| Farmer | farmer@krishigo.com | demo1234 |
| Admin | admin@krishigo.com | demo1234 |

---

## 📡 API Overview

Base URL: `http://localhost:8000/api/v1`

| Endpoint | Description |
|----------|------------|
| `/auth/*` | Authentication (register, login, refresh) |
| `/products/*` | Product catalog |
| `/categories/*` | Product categories |
| `/cart/*` | Shopping cart |
| `/orders/*` | Order management |
| `/wishlist/*` | Wishlist |
| `/bulk-orders/*` | Bulk/B2B orders |
| `/farmers/*` | Farmer portal |
| `/procurement/*` | Procurement management |
| `/warehouses/*` | Warehouse operations |
| `/inventory/*` | Inventory management |
| `/delivery/*` | Delivery management |
| `/farmer-store/*` | Farmer store |
| `/admin/*` | Admin management |
| `/analytics/*` | Business analytics |
| `/search` | Product search |
| `/health` | Health check |

Full API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
cd tests
pytest test_e2e.py
```

---

## 📊 Business Rules

### Quality Grades
- **Premium** — Best quality, best appearance, highest price
- **Standard** — Good quality, normal price
- **Value** — Economical, safe for consumption, may have cosmetic imperfections

> ⚠️ "Value" never means unsafe, spoiled, or expired. Unsafe food is never sold.

### Quick Delivery
- Available only for eligible products and service areas
- Dynamic delivery time estimates — not hardcoded 15 minutes
- Requires warehouse inventory + delivery partner availability

### Harvest Guidance
- Advisory and scientific only
- Customer orders do NOT force farmer harvesting
- Farmers receive estimated maturity dates and demand signals

---

## 🏗 Architecture

```
Browser → Next.js → FastAPI → PostgreSQL
                              ↕
                            Redis
                              ↕
                          ML Services
```

---

## 📄 Documentation

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [API Reference](docs/api.md)
- [Authentication](docs/authentication.md)
- [Frontend Guide](docs/frontend.md)
- [Deployment](docs/deployment.md)
- [AI/ML](docs/ai.md)
- [Business Logic](docs/business-logic.md)
- [Testing](docs/testing.md)

---

## 💚 Currency & Units

- **Currency**: INR (₹)
- **Units**: kg, g, L, ml, piece, bunch, box, quintal

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

**Good for you. Great for farmers.** 🌾
