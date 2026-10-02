/**
 * KrishiGo — Centralized Application Configuration
 *
 * All feature flags and application-wide constants live here.
 * Modify this file to enable/disable features without hunting through components.
 */

// ── Feature Flags ─────────────────────────────────────────────────────────────
export const FEATURES = {
  /** Enable the in-app wallet system */
  ENABLE_WALLET: true,

  /** Enable Cash on Delivery payment option */
  ENABLE_COD: true,

  /** Enable Gemini-powered AI search */
  ENABLE_AI_SEARCH: true,

  /** Enable AI product recommendations */
  ENABLE_RECOMMENDATIONS: true,

  /** Enable the "Switch to Farmer" button for all users */
  ENABLE_FARMER_SWITCH: true,

  /** Enable live delivery tracking on orders page */
  ENABLE_DELIVERY_TRACKING: true,

  /** Enable weather widget in E-Commerce header */
  ENABLE_ECOMMERCE_WEATHER: false,

  /** Enable Google Maps on location picker */
  ENABLE_MAPS: true,

  /** Enable Pollen API data (requires Google Maps API key) */
  ENABLE_POLLEN: true,

  /** Enable Air Quality API data (requires Google Maps API key) */
  ENABLE_AIR_QUALITY: true,
} as const;

// ── Application Identity ───────────────────────────────────────────────────────
export const APP_CONFIG = {
  name: 'KrishiGo',
  tagline: 'Fresh from Farms. Faster to You.',
  currency: 'INR',
  currencySymbol: '₹',
  country: 'IN',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'hi', 'bn'],
  contactEmail: 'support@krishigo.com',
  contactPhone: '+91-XXXXXXXXXX',
} as const;

// ── Pagination Defaults ────────────────────────────────────────────────────────
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

// ── Cache TTLs (milliseconds) ──────────────────────────────────────────────────
export const CACHE_TTL = {
  products: 5 * 60 * 1000,      // 5 minutes
  categories: 60 * 60 * 1000,   // 1 hour
  weather: 10 * 60 * 1000,      // 10 minutes
  location: 30 * 60 * 1000,     // 30 minutes
  recommendations: 15 * 60 * 1000, // 15 minutes
  marketPrices: 6 * 60 * 60 * 1000, // 6 hours
} as const;

// ── Map Config ────────────────────────────────────────────────────────────────
export const MAP_CONFIG = {
  defaultCenter: { lat: 20.5937, lng: 78.9629 }, // Centre of India
  defaultZoom: 5,
  locationZoom: 13,
} as const;
