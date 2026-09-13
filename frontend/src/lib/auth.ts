import Cookies from 'js-cookie';
import { User } from '@/types';

const TOKEN_KEY = 'krishigo_access_token';
const USER_KEY = 'krishigo_user';

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
