import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { setToken, removeToken, removeUser, setUser } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, token) => {
        setToken(token);
        setUser(user);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        removeToken();
        removeUser();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
