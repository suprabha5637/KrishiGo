export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  is_farmer: boolean;
  is_admin: boolean;
  wallet_balance: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order_index: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category_id?: number;
  unit: string;
  price: number;
  mrp: number;
  discount_percent: number;
  rating: number;
  review_count?: number;
  reviews_count?: number;
  freshness_score: number;
  is_organic: boolean;
  is_pesticide_safe?: boolean;
  is_farm_fresh?: boolean;
  farm_source_name?: string;
  description?: string;
  image_url?: string;
  images: string[];
  stock: number;
  sku?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  price: number;
  mrp: number;
  unit: string;
  quantity: number;
  image?: string;
  line_total: number;
}

export interface CartState {
  items: CartItem[];
  item_count: number;
  subtotal: number;
  delivery_fee: number;
  total: number;
  wallet_balance: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  estimated_eta_mins: number;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export interface GoogleWeatherCurrent {
  temp: number;
  condition: string;
  feels_like: number;
  humidity: number;
  rain_chance: number;
  wind: string;
  uv_index: number;
  visibility: string;
  sunrise: string;
  sunset: string;
  high: number;
  low: number;
  location: string;
}

export interface GoogleWeatherForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  rainChance: number;
  rainMm: number;
  status: string;
  statusType: string;
  icon: string;
  condition: string;
}

export interface GoogleWeatherAlert {
  title: string;
  timing: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  desc?: string;
}

export interface GoogleWeatherResponse {
  status: string;
  provider: string;
  attribution: string;
  solution_id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: string;
  updated_at: string;
  current: GoogleWeatherCurrent;
  ai_insight: {
    title: string;
    text: string;
  };
  alerts: GoogleWeatherAlert[];
  forecast_15_days: GoogleWeatherForecastDay[];
  do_today: string[];
  avoid_today: string[] | Array<{ title: string; desc: string }>;
  prepare_for: Array<{ heading: string; detail: string }>;
  crop_impact: Array<{ crop: string; status: string; detail: string }>;
}

