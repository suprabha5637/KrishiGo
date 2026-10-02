# KrishiGo — Client Handover Guide

## Welcome

This guide explains how to configure, customize, and maintain the KrishiGo platform without needing the original development team for routine changes.

---

## 1. Where Do I Modify...?

| What | File / Location |
|------|----------------|
| E-Commerce homepage | `frontend/src/pages/krishigo/HomePage.tsx` |
| E-Commerce header | `frontend/src/components/krishigo/Header.tsx` |
| E-Commerce sidebar | `frontend/src/components/krishigo/Sidebar.tsx` |
| Hero banner | `frontend/src/components/krishigo/HeroBanner.tsx` |
| Promotional banners | `frontend/src/components/krishigo/PromoCardsRow.tsx` |
| Category ribbon icons | `frontend/src/components/krishigo/CategoryRibbon.tsx` |
| Fresh vegetables section | `frontend/src/components/krishigo/FreshVegetablesSection.tsx` |
| Bottom product grids | `frontend/src/components/krishigo/BottomProductGrids.tsx` |
| Cart drawer | `frontend/src/components/krishigo/CartDrawer.tsx` |
| Wallet modal | `frontend/src/components/krishigo/WalletModal.tsx` |
| Farmer dashboard | `frontend/src/pages/farmer/FarmerHomePage.tsx` |
| Farmer weather page | `frontend/src/pages/farmer/WeatherPage.tsx` |
| All farmer pages | `frontend/src/pages/farmer/` |
| API keys (backend) | `.env` (copy from `.env.example`) |
| API keys (frontend) | `frontend/.env` |
| Feature flags | `frontend/src/config/app.config.ts` |
| App name, currency | `frontend/src/config/app.config.ts` |
| Backend configuration | `backend/app/core/config.py` |
| Database URL | `.env` → `DATABASE_URL` |
| Product seed data | `database/seeds/seed.py` |

---

## 2. Environment Setup

### Copy environment templates:

```bash
# Root .env (backend)
cp .env.example .env

# Frontend .env
# Create frontend/.env with:
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 3. Google API Keys Required

| API | Variable | Purpose |
|-----|----------|---------|
| Maps JavaScript API | `VITE_GOOGLE_MAPS_API_KEY` | Interactive maps in frontend |
| Geocoding API | `GOOGLE_MAPS_API_KEY` (backend) | Address → coordinates |
| Places API | `GOOGLE_MAPS_API_KEY` (backend) | Address autocomplete |
| Routes API | `GOOGLE_MAPS_API_KEY` (backend) | Delivery routing |
| Weather API | `GOOGLE_MAPS_API_KEY` (backend) | Weather data |
| Gemini API | `GEMINI_API_KEY` (backend) | AI features |

All backend keys go in the root `.env` file.  
Frontend key (`VITE_GOOGLE_MAPS_API_KEY`) goes in `frontend/.env`.

---

## 4. Enabling/Disabling Features

Edit `frontend/src/config/app.config.ts`:

```typescript
export const FEATURES = {
  ENABLE_WALLET: true,           // In-app wallet
  ENABLE_COD: true,              // Cash on delivery
  ENABLE_AI_SEARCH: true,        // Gemini AI search
  ENABLE_RECOMMENDATIONS: true,  // AI recommendations
  ENABLE_FARMER_SWITCH: true,    // Farmer platform access
  ENABLE_DELIVERY_TRACKING: true, // Order tracking
  ENABLE_MAPS: true,             // Google Maps
};
```

---

## 5. Running Locally

```bash
# Terminal 1 — Frontend
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000

# Terminal 2 — Backend
cd backend
python -m backend.app.main
# API at http://localhost:8000
```

---

## 6. Production Deployment

See [docs/deployment/production.md](../deployment/production.md).

---

## 7. Adding Products

Products are seeded via `database/seeds/seed.py`.  
In production, use the admin API endpoints at `/api/v1/commerce/products` (POST) to add products.

---

## 8. Changing Branding

| What | Where |
|------|-------|
| Logo image | `frontend/public/assets/brands/krishigo-logo.jpeg` |
| Farmer button image | `frontend/public/assets/brands/farmer-button.jpeg` |
| App name | `frontend/src/config/app.config.ts` → `APP_CONFIG.name` |
| Favicon | `frontend/public/favicon.svg` |
| Brand colors | `frontend/src/index.css` (CSS variables) |

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank map | Check `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env` |
| Login fails | Verify Firebase config in `frontend/.env` |
| Weather unavailable | Check `GEMINI_API_KEY` in root `.env` |
| Products not loading | Verify backend is running on port 8000 |
| Build fails | Run `cd frontend && npm run build` and check TypeScript errors |
