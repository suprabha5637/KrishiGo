# KrishiGo Architecture

## Overview

KrishiGo is built as a **modular monolith** designed for future microservice extraction.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENTS                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Customer │  │  Farmer  │  │  Admin   │              │
│  │  (Web)   │  │  (Web)   │  │  (Web)   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
└───────┼──────────────┼──────────────┼────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│            Next.js (App Router, SSR/CSR)                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  React + TypeScript + Tailwind CSS + shadcn/ui  │    │
│  │  TanStack Query | Zustand | React Hook Form     │    │
│  └──────────────────────┬──────────────────────────┘    │
└─────────────────────────┼────────────────────────────────┘
                          │ REST API (JSON)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                         │
│                 FastAPI (Python 3.11+)                   │
│  ┌──────────────┐ ┌──────────┐ ┌───────────────┐       │
│  │  API Routes  │ │Middleware│ │  Background   │       │
│  │  /api/v1/*   │ │(CORS,JWT)│ │   Workers     │       │
│  └──────┬───────┘ └──────────┘ └───────────────┘       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │   Services   │  (Business Logic)                     │
│  └──────┬───────┘                                       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │ Repositories │  (Data Access)                        │
│  └──────┬───────┘                                       │
└─────────┼────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │
│  │PostgreSQL │  │   Redis   │  │    AWS S3          │   │
│  │  (RDBMS)  │  │  (Cache)  │  │ (File Storage)    │   │
│  └───────────┘  └───────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    ML LAYER                               │
│  ┌──────────────┐ ┌───────────┐ ┌──────────────────┐   │
│  │   Demand     │ │  Harvest  │ │  Recommendation  │   │
│  │ Forecasting  │ │ Prediction│ │     Engine        │   │
│  └──────────────┘ └───────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Design Principles

1. **Modular Monolith** — Single deployable with clear module boundaries
2. **Service/Repository Pattern** — Business logic in services, data access in repositories
3. **API-First** — Backend exposes REST APIs, frontend consumes them
4. **Role-Based Access** — RBAC enforced at API level, not just UI
5. **Transaction Safety** — Inventory operations use database transactions with row-level locking
6. **Mock-First Development** — External integrations abstracted behind interfaces with mock implementations

## Module Structure

### Core Modules
- **Auth** — Authentication, authorization, JWT, RBAC
- **Users** — User management, profiles, addresses
- **Products** — Catalog, categories, variants, quality grades
- **Orders** — Order lifecycle, state machine, event sourcing
- **Cart** — Shopping cart with backend persistence
- **Payments** — Payment abstraction with mock provider
- **Search** — Product search with filters

### Domain Modules
- **Farmer** — Farmer portal, crops, earnings, farmer store
- **Procurement** — Supplier management, purchase orders
- **Warehouse** — Inventory, batches, picking, packing, dispatch
- **Delivery** — Partner management, assignments, tracking
- **Bulk Orders** — B2B ordering, matching, quotations

### Intelligence Modules
- **Demand Forecasting** — Sales prediction using ML
- **Harvest Prediction** — Crop maturity estimation (advisory only)
- **Recommendations** — Product recommendations
- **AI Assistant** — Conversational farming guidance

## Data Flow

### Quick Commerce Order
```
Customer browses → Adds to cart → Checkout
→ Payment (mock) → Order created
→ Inventory reserved (atomic, locked)
→ Warehouse picks → Packs → Dispatches
→ Delivery partner assigned → Delivers
→ OTP verification → Order complete
```

### Bulk Order
```
Customer submits bulk request
→ System matches farmers/suppliers
→ Generates quotation
→ Customer accepts → Scheduled fulfillment
→ Aggregated delivery
```

### Farmer Procurement
```
Farmer declares produce available
→ Procurement reviews → Accepts
→ Purchase order created → Pickup scheduled
→ Warehouse receives → Inspects → Grades
→ Batch created → Added to inventory
→ Farmer receives settlement
```
