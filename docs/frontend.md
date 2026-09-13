# KrishiGo Frontend Guide

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v3
- shadcn/ui components
- Lucide React icons
- TanStack Query (server state)
- Zustand (client state)
- React Hook Form + Zod (forms)
- Recharts (charts)
- Framer Motion (subtle animations)

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #16a34a (green-600) | CTAs, active states |
| Primary Dark | #14532d (green-900) | Headers, emphasis |
| Primary Light | #f0fdf4 (green-50) | Backgrounds |
| Accent | #f59e0b (amber-500) | Highlights, alerts |
| Background | #ffffff | Page background |
| Muted | #f8fafc (slate-50) | Section backgrounds |
| Text | #0f172a (slate-900) | Body text |
| Muted Text | #64748b (slate-500) | Secondary text |

### Typography
- Font: Inter (Google Fonts)
- Headings: font-bold
- Body: font-normal

### Spacing
- 8px base system
- Components use multiples of 4/8px

## Component Architecture

### Layout Components
- `Header` — Main navigation with search, cart, user
- `Footer` — Links, branding
- `Sidebar` — Dashboard navigation
- `MobileNav` — Bottom navigation for mobile
- `DashboardLayout` — Sidebar + content wrapper

### Shared Components
- `ProductCard` — Product display in grids
- `CategoryCard` — Category with icon/image
- `QualitySelector` — Premium/Standard/Value selector
- `QuantitySelector` — +/- quantity control
- `PriceDisplay` — Formatted ₹ price
- `StatCard` — Dashboard metric card
- `OrderTimeline` — Visual order status
- `EmptyState` — Empty content placeholder
- `SearchBar` — Search with autocomplete

## State Management

### Server State (TanStack Query)
All API data fetched via TanStack Query with caching.

### Client State (Zustand)
- `auth-store` — User session, tokens
- `cart-store` — Cart items, totals
- `location-store` — Selected delivery location

## Routes
See docs/api.md for full route listing.
