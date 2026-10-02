# KrishiGo — E-Commerce Module Overview

## Overview

The KrishiGo E-Commerce platform is a hyper-local farm-to-consumer grocery marketplace engineered for maximum conversion, speed, and real-time inventory synchronization.

---

## Core User Journeys

```mermaid
graph LR
    A[Browse Marketplace] --> B[Search & Filter Products]
    B --> C[Add to Cart]
    C --> D[Open Cart Drawer]
    D --> E[Select Delivery Address]
    E --> F[Choose Payment Method]
    F --> G[Place Order]
    G --> H[Track Order in Orders Dashboard]
```

---

## Key Components & File Locations

| Feature | Component | File Path |
|---------|-----------|-----------|
| **Navigation & Search** | Header | `frontend/src/components/krishigo/Header.tsx` |
| **Category Sidebar** | Sidebar | `frontend/src/components/krishigo/Sidebar.tsx` |
| **Promotional Carousel** | HeroBanner | `frontend/src/components/krishigo/HeroBanner.tsx` |
| **Special Deals** | PromoCardsRow | `frontend/src/components/krishigo/PromoCardsRow.tsx` |
| **Category Pills** | CategoryRibbon | `frontend/src/components/krishigo/CategoryRibbon.tsx` |
| **Featured Produce** | FreshVegetablesSection | `frontend/src/components/krishigo/FreshVegetablesSection.tsx` |
| **Categorized Grids** | BottomProductGrids | `frontend/src/components/krishigo/BottomProductGrids.tsx` |
| **Quick Shopping Cart** | CartDrawer | `frontend/src/components/krishigo/CartDrawer.tsx` |
| **Customer Orders** | OrdersPage | `frontend/src/pages/krishigo/OrdersPage.tsx` |
| **Category Browse** | CategoryPage | `frontend/src/pages/krishigo/CategoryPage.tsx` |
| **In-App Balance** | WalletModal | `frontend/src/components/krishigo/WalletModal.tsx` |

---

## Data Integration

All E-Commerce components communicate directly with the backend API via `frontend/src/services/api.ts` and `frontend/src/services/ecommerce/ecommerceService.ts`. No hardcoded mock product catalogs remain in the user-facing codebase; all products, prices, stock statuses, and categories are dynamically served from SQLite/PostgreSQL.
