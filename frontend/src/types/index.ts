export type UserRole = 'customer' | 'farmer' | 'warehouse' | 'delivery' | 'procurement' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type QualityGrade = 'Premium' | 'Standard' | 'Value';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
}

export interface ProductVariant {
  id: string;
  quality: QualityGrade;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: Category;
  unit: string;
  images: string[];
  variants: ProductVariant[];
  isOrganic: boolean;
  isQuickDelivery: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'picking' | 'packed' | 'delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface OrderEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  timeline: OrderEvent[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: string;
  userId: string;
  user?: User;
  farmName: string;
  location: string;
  totalAcres: number;
  verified: boolean;
  rating: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
