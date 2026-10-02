const API_BASE = '/api/v1';

export async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('krishigo_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: 'API request failed' }));
    throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  getMe: () => fetchJson('/auth/me'),
  login: (data: { email?: string; phone?: string; password?: string }) =>
    fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: { name: string; email?: string; phone?: string; password?: string; register_as_farmer: boolean }) =>
    fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  sendOtp: (phone: string) =>
    fetchJson('/auth/phone-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string, register_as_farmer: boolean) =>
    fetchJson('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp, register_as_farmer }) }),
  firebaseAuth: (id_token: string, register_as_farmer: boolean) =>
    fetchJson('/auth/firebase', { method: 'POST', body: JSON.stringify({ id_token, register_as_farmer }) }),
  becomeFarmer: () => fetchJson('/auth/become-farmer', { method: 'POST' }),

  // Commerce
  getCategories: () => fetchJson('/commerce/categories'),
  getFeaturedProducts: () => fetchJson('/commerce/products/featured'),
  getProducts: (params: { category_slug?: string; search?: string; page?: number; limit?: number; sort?: string; is_organic?: boolean }) => {
    const sp = new URLSearchParams();
    if (params.category_slug) sp.append('category_slug', params.category_slug);
    if (params.search) sp.append('search', params.search);
    if (params.page) sp.append('page', params.page.toString());
    if (params.limit) sp.append('limit', params.limit.toString());
    if (params.sort) sp.append('sort', params.sort);
    if (params.is_organic !== undefined) sp.append('is_organic', params.is_organic.toString());
    return fetchJson(`/commerce/products?${sp.toString()}`);
  },
  getProductBySlug: (slug: string) => fetchJson(`/commerce/products/${slug}`),
  getCart: () => fetchJson('/commerce/cart'),
  addToCart: (productId: number, quantity = 1) =>
    fetchJson('/commerce/cart', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity }) }),
  updateCartItem: (itemId: number, quantity: number) =>
    fetchJson(`/commerce/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  deleteCartItem: (itemId: number) =>
    fetchJson(`/commerce/cart/${itemId}`, { method: 'DELETE' }),
  checkout: (data: { delivery_address: any; payment_method: string; use_wallet: boolean }) =>
    fetchJson('/commerce/checkout', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => fetchJson('/commerce/orders'),
  getWallet: () => fetchJson('/commerce/wallet'),

  // Farmer Intelligence
  getFarmerDashboard: (params?: { location?: string; lat?: number; lng?: number } | string) => {
    if (typeof params === 'string') {
      return fetchJson(`/farmer/dashboard?location=${encodeURIComponent(params)}`);
    }
    const sp = new URLSearchParams();
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    const q = sp.toString();
    return fetchJson(`/farmer/dashboard${q ? `?${q}` : ''}`);
  },
  getWeather: (params?: { location?: string; lat?: number; lng?: number } | string) => {
    if (typeof params === 'string') {
      return fetchJson(`/farmer/weather?location=${encodeURIComponent(params)}`);
    }
    const sp = new URLSearchParams();
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    const q = sp.toString();
    return fetchJson(`/farmer/weather${q ? `?${q}` : ''}`);
  },
  getCropPlanner: (params?: { location?: string; lat?: number; lng?: number; field?: string; soil_type?: string; season?: string; crop?: string } | string) => {
    if (typeof params === 'string') {
      return fetchJson(`/farmer/crop-planner?location=${encodeURIComponent(params)}`);
    }
    const sp = new URLSearchParams();
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    if (params?.field) sp.append('field', params.field);
    if (params?.soil_type) sp.append('soil_type', params.soil_type);
    if (params?.season) sp.append('season', params.season);
    if (params?.crop) sp.append('crop', params.crop);
    const q = sp.toString();
    return fetchJson(`/farmer/crop-planner${q ? `?${q}` : ''}`);
  },
  getAICropSuggestions: (data: { field?: string; soil_type?: string; season?: string; location?: string; lat?: number; lng?: number; crop?: string }) =>
    fetchJson('/farmer/crop-planner/ai-suggest', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  diagnoseCropHealth: (data: {
    crop_name?: string;
    example_id?: string;
    image_url?: string;
    image_base64?: string;
    condition_description?: string;
    symptoms?: string;
    location?: string;
    lat?: number;
    lng?: number;
  }) =>
    fetchJson('/farmer/crop-health/diagnose', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getCommonCropDiseases: (params?: { location?: string; lat?: number; lng?: number }) => {
    const sp = new URLSearchParams();
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJson(`/farmer/crop-health/common-diseases${qs}`);
  },
  askCropHealthQuestion: (data: { question: string; crop_name?: string; location?: string; lat?: number; lng?: number }) =>
    fetchJson('/farmer/crop-health/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSoilField: (params?: { crop?: string; location?: string; lat?: number; lng?: number } | string) => {
    if (typeof params === 'string') {
      return fetchJson(`/farmer/soil-field?crop=${encodeURIComponent(params)}`);
    }
    const sp = new URLSearchParams();
    if (params?.crop) sp.append('crop', params.crop);
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    const q = sp.toString();
    return fetchJson(`/farmer/soil-field${q ? `?${q}` : ''}`);
  },
  analyzeSoilReport: (data: { crop?: string; image_base64?: string; report_text?: string; location?: string; lat?: number; lng?: number }) =>
    fetchJson('/farmer/soil-field/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  askSoilQuestion: (data: { question: string; crop?: string; location?: string; lat?: number; lng?: number }) =>
    fetchJson('/farmer/soil-field/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getIrrigation: (params?: { field_id?: string; location?: string; lat?: number; lng?: number } | string) => {
    if (typeof params === 'string') {
      return fetchJson(`/farmer/irrigation?location=${encodeURIComponent(params)}`);
    }
    const sp = new URLSearchParams();
    if (params?.field_id) sp.append('field_id', params.field_id);
    if (params?.location) sp.append('location', params.location);
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    const q = sp.toString();
    return fetchJson(`/farmer/irrigation${q ? `?${q}` : ''}`);
  },
  askIrrigationQuestion: (data: { question: string; field_name?: string; crop?: string; location?: string; lat?: number; lng?: number }) =>
    fetchJson('/farmer/irrigation/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getFarmManagement: (params?: { location?: string; lat?: number; lng?: number }) => {
    const sp = new URLSearchParams();
    if (params?.location) sp.set('location', params.location);
    if (params?.lat !== undefined) sp.set('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.set('lng', params.lng.toString());
    const q = sp.toString();
    return fetchJson(`/farmer/management${q ? `?${q}` : ''}`);
  },
  askFarmManagementAi: (data: { query: string; location?: string; lat?: number; lng?: number; field_name?: string; image_base64?: string; mime_type?: string }) =>
    fetchJson('/farmer/management/ask', { method: 'POST', body: JSON.stringify(data) }),
  createTask: (data: any) => fetchJson('/farmer/management/tasks', { method: 'POST', body: JSON.stringify(data) }),
  toggleTask: (taskId: string | number) => fetchJson(`/farmer/management/tasks/${taskId}/toggle`, { method: 'PUT' }),
  addCrop: (data: any) => fetchJson('/farmer/management/crops', { method: 'POST', body: JSON.stringify(data) }),
  addField: (data: any) => fetchJson('/farmer/management/fields', { method: 'POST', body: JSON.stringify(data) }),
  addExpense: (data: any) => fetchJson('/farmer/management/finance/expense', { method: 'POST', body: JSON.stringify(data) }),
  addIncome: (data: any) => fetchJson('/farmer/management/finance/income', { method: 'POST', body: JSON.stringify(data) }),
  addWorker: (data: any) => fetchJson('/farmer/management/workers', { method: 'POST', body: JSON.stringify(data) }),
  getMarketProfit: (commodity?: string, location?: string, lat?: number, lng?: number) => {
    const params = new URLSearchParams();
    if (commodity) params.append('commodity', commodity);
    if (location) params.append('location', location);
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson(`/farmer/market-profit${qs}`);
  },
  simulateMarketProfit: (data: any) => fetchJson('/farmer/market-profit/simulate', { method: 'POST', body: JSON.stringify(data) }),
  askMarketCopilot: (data: any) => fetchJson('/farmer/market-profit/ask-copilot', { method: 'POST', body: JSON.stringify(data) }),
  getFarmMonitoring: (params?: { lat?: number; lng?: number; location?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.append('location', params.location);
    if (params?.lat) searchParams.append('lat', params.lat.toString());
    if (params?.lng) searchParams.append('lng', params.lng.toString());
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson(`/farmer/monitoring${qs}`);
  },
  connectCCTV: (data: any) => fetchJson('/farmer/monitoring/cctv/connect', { method: 'POST', body: JSON.stringify(data) }),
  addMonitoringField: (data: any) => fetchJson('/farmer/monitoring/fields', { method: 'POST', body: JSON.stringify(data) }),
  analyzeMonitoringField: (data: any) => fetchJson('/farmer/monitoring/ai-analysis', { method: 'POST', body: JSON.stringify(data) }),
  geocodeMonitoringLocation: (params: { query?: string; lat?: number; lng?: number }) => {
    const sp = new URLSearchParams();
    if (params.query) sp.append('query', params.query);
    if (params.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params.lng !== undefined) sp.append('lng', params.lng.toString());
    return fetchJson(`/farmer/monitoring/geocode?${sp.toString()}`);
  },
  getFarmServices: (params?: { lat?: number; lng?: number; location?: string; service_filter?: string; radius_km?: number; sort_by?: string }) => {
    const sp = new URLSearchParams();
    if (params?.lat !== undefined) sp.append('lat', params.lat.toString());
    if (params?.lng !== undefined) sp.append('lng', params.lng.toString());
    if (params?.location) sp.append('location', params.location);
    if (params?.service_filter) sp.append('service_filter', params.service_filter);
    if (params?.radius_km) sp.append('radius_km', params.radius_km.toString());
    if (params?.sort_by) sp.append('sort_by', params.sort_by);
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJson(`/farmer/services${qs}`);
  },
  bookService: (data: any) => fetchJson('/farmer/services/book', { method: 'POST', body: JSON.stringify(data) }),
  askServicesCopilot: (data: { query: string; category?: string; location?: string }) =>
    fetchJson('/farmer/services/ask-copilot', { method: 'POST', body: JSON.stringify(data) }),
  requestServiceQuote: (data: any) => fetchJson('/farmer/services/quote', { method: 'POST', body: JSON.stringify(data) }),

  // AI Copilot
  chatWithCopilot: (data: { prompt: string; mode?: string; image_url?: string; image_base64?: string; context?: any }) =>
    fetchJson('/ai/copilot', { method: 'POST', body: JSON.stringify(data) }),
  askAICopilot: (data: { message: string; farm_context?: any; image_url?: string; image_base64?: string; mode?: string }) =>
    fetchJson('/ai/copilot', {
      method: 'POST',
      body: JSON.stringify({
        prompt: data.message,
        context: data.farm_context,
        image_url: data.image_url,
        image_base64: data.image_base64,
        mode: data.mode || 'general',
      }),
    }),

  // Farmer Settings
  getFarmerSettings: () => fetchJson('/farmer/settings'),
  updateFarmerSettings: (data: any) => fetchJson('/farmer/settings', { method: 'PUT', body: JSON.stringify(data) }),
  exportFarmerData: () => fetchJson('/farmer/settings/export-data', { method: 'POST' }),
  submitFarmerSupport: (data: { category: string; message: string }) =>
    fetchJson('/farmer/settings/support', { method: 'POST', body: JSON.stringify(data) }),
};
