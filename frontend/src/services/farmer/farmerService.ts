/**
 * KrishiGo — Farmer Domain Service
 *
 * Centralizes all Farmer Platform API calls.
 * Farmer page components import from here — never call the backend directly.
 *
 * Backend routes: /api/v1/farmer/...
 */

import { get, post } from '../../lib/apiClient';

// ── Location helpers ──────────────────────────────────────────────────────────

type LocationParams =
  | string
  | { location?: string; lat?: number; lng?: number };

function buildLocationQuery(params?: LocationParams): string {
  if (!params) return '';
  if (typeof params === 'string') return `?location=${encodeURIComponent(params)}`;
  const sp = new URLSearchParams();
  if (params.location) sp.append('location', params.location);
  if (params.lat !== undefined) sp.append('lat', String(params.lat));
  if (params.lng !== undefined) sp.append('lng', String(params.lng));
  const q = sp.toString();
  return q ? `?${q}` : '';
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const farmerDashboardService = {
  get: (params?: LocationParams) =>
    get(`/farmer/dashboard${buildLocationQuery(params)}`),
};

// ── Weather ───────────────────────────────────────────────────────────────────

export const farmerWeatherService = {
  get: (params?: LocationParams) =>
    get(`/farmer/weather${buildLocationQuery(params)}`),
};

// ── Crop Planner ──────────────────────────────────────────────────────────────

export const cropPlannerService = {
  get: (params?: LocationParams) =>
    get(`/farmer/crop-planner${buildLocationQuery(params)}`),
};

// ── Crop Health ───────────────────────────────────────────────────────────────

export const cropHealthService = {
  get: (params?: LocationParams) =>
    get(`/farmer/crop-health${buildLocationQuery(params)}`),

  analyzeImage: (imageBase64: string) =>
    post('/farmer/crop-health/analyze', { image: imageBase64 }),
};

// ── Soil & Field ──────────────────────────────────────────────────────────────

export const soilFieldService = {
  get: (params?: LocationParams) =>
    get(`/farmer/soil-field${buildLocationQuery(params)}`),
};

// ── Irrigation ────────────────────────────────────────────────────────────────

export const irrigationService = {
  get: (params?: LocationParams) =>
    get(`/farmer/irrigation${buildLocationQuery(params)}`),
};

// ── Farm Management ───────────────────────────────────────────────────────────

export const farmManagementService = {
  get: (params?: LocationParams) =>
    get(`/farmer/farm-management${buildLocationQuery(params)}`),
};

// ── Market & Profit ───────────────────────────────────────────────────────────

export const marketProfitService = {
  get: (params?: LocationParams) =>
    get(`/farmer/market-profit${buildLocationQuery(params)}`),
};

// ── Farm Monitoring ───────────────────────────────────────────────────────────

export const farmMonitoringService = {
  get: (params?: LocationParams) =>
    get(`/farmer/farm-monitoring${buildLocationQuery(params)}`),
};

// ── Farm Services ─────────────────────────────────────────────────────────────

export const farmServicesService = {
  get: (params?: LocationParams) =>
    get(`/farmer/services${buildLocationQuery(params)}`),
};

// ── AI Copilot ────────────────────────────────────────────────────────────────

export const aiCopilotService = {
  chat: (message: string, context?: Record<string, unknown>) =>
    post('/ai/farm-copilot', { message, context }),
};
