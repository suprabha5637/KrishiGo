/**
 * KrishiGo — Location & Maps Integration Service
 *
 * Provider-abstracted location services. The UI never knows which provider
 * supplied the data.
 *
 * Priority:
 *   Explicit user selection
 *   → Saved address
 *   → Browser GPS
 *   → Fallback (Geolocation API / IP)
 *
 * Backend routes: /api/v1/location/...
 */

import { get, post } from '../../lib/apiClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ResolvedLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  timezone: string;
  source: 'gps' | 'saved' | 'places' | 'geocoding' | 'ip_fallback';
  confidence: number;
  fetchedAt: string;
  expiresAt: string;
}

export interface AddressAutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

// ── Geocoding ─────────────────────────────────────────────────────────────────

export const geocodingService = {
  /** Convert address string → lat/lng */
  forward: (address: string) =>
    get<ResolvedLocation>(`/location/geocode?address=${encodeURIComponent(address)}`),

  /** Convert lat/lng → address */
  reverse: (lat: number, lng: number) =>
    get<ResolvedLocation>(`/location/reverse-geocode?lat=${lat}&lng=${lng}`),
};

// ── Places Autocomplete ───────────────────────────────────────────────────────

export const placesService = {
  autocomplete: (query: string, sessionToken?: string) => {
    const params = new URLSearchParams({ q: query });
    if (sessionToken) params.append('session', sessionToken);
    return get<AddressAutocompleteResult[]>(`/location/autocomplete?${params}`);
  },

  getDetails: (placeId: string) =>
    get<ResolvedLocation>(`/location/place/${placeId}`),
};

// ── Address Validation ────────────────────────────────────────────────────────

export const addressValidationService = {
  validate: (address: string) =>
    post<{ isValid: boolean; corrected?: string; components: Record<string, string> }>(
      '/location/validate-address',
      { address }
    ),
};

// ── Browser GPS (client-side) ──────────────────────────────────────────────────

export async function getBrowserLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  });
}
