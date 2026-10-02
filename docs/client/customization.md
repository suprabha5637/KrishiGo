# KrishiGo — Client Customization Guide

## Customizing Brand & Configuration

All high-level branding, feature toggles, and commercial parameters are centralized in `frontend/src/config/app.config.ts`.

---

## 1. Changing Brand Name, Logo, & Contact Details

Open `frontend/src/config/app.config.ts`:

```typescript
export const APP_CONFIG = {
  name: 'KrishiGo',                      // Change store name
  tagline: 'Fresh from Farms. Faster to You.', // Change tagline
  currency: '₹',                         // Change currency symbol
  supportPhone: '+91 1800 123 4567',     // Change customer care number
  supportEmail: 'support@krishigo.com',  // Change support email
  deliveryPincodeDefault: '700001',      // Default location
};
```

---

## 2. Enabling or Disabling Platform Features

In the same file (`frontend/src/config/app.config.ts`), toggle features on or off without writing any code:

```typescript
export const FEATURES = {
  ENABLE_WALLET: true,           // Toggle in-app digital wallet
  ENABLE_COD: true,              // Enable/disable Cash on Delivery
  ENABLE_AI_SEARCH: true,        // Toggle Gemini AI smart search bar
  ENABLE_RECOMMENDATIONS: true,  // Toggle recommended products row
  ENABLE_FARMER_SWITCH: true,    // Toggle the "Farmer Mode" toggle button
  ENABLE_DELIVERY_TRACKING: true, // Toggle live map order tracking
  ENABLE_MAPS: true,             // Enable Google Maps visual field view
};
```

---

## 3. Adding or Modifying Products and Categories

### Via Database Seed File
To update the initial catalog of fruits, vegetables, grains, or dairy:
1. Open `database/seeds/seed.py`.
2. Locate the `SEED_PRODUCTS` or `SEED_CATEGORIES` list.
3. Edit names, prices, units, or images.
4. Run:
   ```bash
   python database/seeds/seed.py
   ```

### Via Interactive API Swagger UI
1. Navigate to `http://localhost:8000/docs`.
2. Expand `POST /api/v1/commerce/products`.
3. Click **Try it out**, fill in the JSON with your new product details, and click **Execute**.
