/**
 * KrishiGo — Core API Client
 *
 * All HTTP communication with the KrishiGo backend goes through this module.
 * Components should NEVER call fetch() directly — use the domain service modules instead.
 *
 * Architecture:
 *   UI Component
 *     → Domain Service (services/ecommerce/, services/farmer/)
 *       → apiClient (this file)
 *         → KrishiGo Backend (/api/v1/...)
 *           → External APIs (Google, Gemini, Firebase, etc.)
 */

const API_BASE = '/api/v1';

// ── Generic HTTP client ────────────────────────────────────────────────────────

export interface ApiRequestOptions extends RequestInit {
  /** Optional auth override — defaults to localStorage token */
  token?: string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token: overrideToken, ...fetchOptions } = options;
  const token = overrideToken ?? localStorage.getItem('krishigo_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'API request failed' }));
    throw new ApiError(
      errorBody.detail ?? `Request failed with status ${response.status}`,
      response.status,
      endpoint
    );
  }

  return response.json() as Promise<T>;
}

// ── Structured API Error ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized() { return this.statusCode === 401; }
  get isForbidden()    { return this.statusCode === 403; }
  get isNotFound()     { return this.statusCode === 404; }
  get isServerError()  { return this.statusCode >= 500; }
}

// ── Convenience helpers ───────────────────────────────────────────────────────

export const get  = <T>(ep: string, opts?: ApiRequestOptions) =>
  apiRequest<T>(ep, { method: 'GET', ...opts });

export const post = <T>(ep: string, body: unknown, opts?: ApiRequestOptions) =>
  apiRequest<T>(ep, { method: 'POST', body: JSON.stringify(body), ...opts });

export const put  = <T>(ep: string, body: unknown, opts?: ApiRequestOptions) =>
  apiRequest<T>(ep, { method: 'PUT',  body: JSON.stringify(body), ...opts });

export const del  = <T>(ep: string, opts?: ApiRequestOptions) =>
  apiRequest<T>(ep, { method: 'DELETE', ...opts });
