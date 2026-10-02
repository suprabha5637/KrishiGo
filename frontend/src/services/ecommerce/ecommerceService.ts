/**
 * KrishiGo — E-Commerce Domain Service
 *
 * Centralizes all E-Commerce API calls.
 * UI components import from here — never call the backend directly.
 *
 * Backend routes: /api/v1/commerce/...
 */

import { get, post, put, del } from '../../lib/apiClient';
import type {
  Category,
  Product,
  CartState,
  CartItem,
  Order,
} from '../../types';

// ── Categories ────────────────────────────────────────────────────────────────

export const categoryService = {
  getAll: () => get<Category[]>('/commerce/categories'),
};

// ── Products ──────────────────────────────────────────────────────────────────

export interface ProductQueryParams {
  category_slug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  is_organic?: boolean;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

export const productService = {
  getFeatured: () =>
    get<Product[]>('/commerce/products/featured'),

  getList: (params: ProductQueryParams = {}) => {
    const sp = new URLSearchParams();
    if (params.category_slug) sp.append('category_slug', params.category_slug);
    if (params.search)        sp.append('search', params.search);
    if (params.page)          sp.append('page', String(params.page));
    if (params.limit)         sp.append('limit', String(params.limit));
    if (params.sort)          sp.append('sort', params.sort);
    if (params.is_organic !== undefined)
                              sp.append('is_organic', String(params.is_organic));
    return get<ProductListResponse>(`/commerce/products?${sp}`);
  },

  getBySlug: (slug: string) =>
    get<Product>(`/commerce/products/${slug}`),
};

// ── Cart ─────────────────────────────────────────────────────────────────────

export const cartService = {
  get: () =>
    get<CartState>('/commerce/cart'),

  addItem: (productId: number, quantity = 1) =>
    post<CartState>('/commerce/cart', { product_id: productId, quantity }),

  updateItem: (itemId: number, quantity: number) =>
    put<CartItem>(`/commerce/cart/${itemId}`, { quantity }),

  removeItem: (itemId: number) =>
    del<{ success: boolean }>(`/commerce/cart/${itemId}`),
};

// ── Checkout & Orders ─────────────────────────────────────────────────────────

export interface CheckoutPayload {
  delivery_address: Record<string, unknown>;
  payment_method: string;
  use_wallet: boolean;
}

export const orderService = {
  checkout: (payload: CheckoutPayload) =>
    post<Order>('/commerce/checkout', payload),

  getAll: () =>
    get<Order[]>('/commerce/orders'),
};

// ── Wallet ────────────────────────────────────────────────────────────────────

export interface WalletData {
  balance: number;
  transactions: Array<{
    id: number;
    amount: number;
    type: string;
    description: string;
    created_at: string;
  }>;
}

export const walletService = {
  get: () => get<WalletData>('/commerce/wallet'),
};
