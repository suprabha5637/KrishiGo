/**
 * KrishiGo — Auth Domain Service
 *
 * Centralizes all authentication API calls.
 * Components use this — never call the backend directly.
 *
 * Backend routes: /api/v1/auth/...
 */

import { get, post } from '../../lib/apiClient';
import type { User } from '../../types';

export interface LoginPayload {
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  register_as_farmer: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  getMe: () =>
    get<User>('/auth/me'),

  login: (payload: LoginPayload) =>
    post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    post<AuthResponse>('/auth/register', payload),

  sendOtp: (phone: string) =>
    post<{ message: string }>('/auth/phone-otp', { phone }),

  verifyOtp: (phone: string, otp: string, register_as_farmer: boolean) =>
    post<AuthResponse>('/auth/verify-otp', { phone, otp, register_as_farmer }),

  firebaseAuth: (id_token: string, register_as_farmer: boolean) =>
    post<AuthResponse>('/auth/firebase', { id_token, register_as_farmer }),

  becomeFarmer: () =>
    post<{ success: boolean }>('/auth/become-farmer', {}),
};
