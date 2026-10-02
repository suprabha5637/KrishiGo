import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartState } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isFarmer: boolean;
  walletBalance: number;
  cart: CartState | null;
  cartCount: number;
  refreshUser: () => Promise<void>;
  refreshCart: () => Promise<void>;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  becomeFarmer: () => Promise<void>;
  addToCart: (productId: number, qty?: number) => Promise<void>;
  updateCartItem: (itemId: number, qty: number) => Promise<void>;
  deleteCartItem: (itemId: number) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  cartDrawerOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  walletModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'User',
    email: 'user@krishigo.com',
    phone: '+91 98765 43210',
    is_farmer: true,
    is_admin: true,
    wallet_balance: 848.0
  });
  const [cart, setCart] = useState<CartState | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
    } catch (err) {
      console.error('Failed to load user', err);
    }
  };

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  useEffect(() => {
    refreshUser();
    refreshCart();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    localStorage.setItem('krishigo_token', res.access_token);
    setUser(res.user);
    setAuthModalOpen(false);
    await refreshCart();
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    localStorage.setItem('krishigo_token', res.access_token);
    setUser(res.user);
    setAuthModalOpen(false);
    await refreshCart();
  };

  const logout = () => {
    localStorage.removeItem('krishigo_token');
    setUser(null);
  };

  const becomeFarmer = async () => {
    await api.becomeFarmer();
    await refreshUser();
  };

  const addToCart = async (productId: number, qty = 1) => {
    await api.addToCart(productId, qty);
    await refreshCart();
    setCartDrawerOpen(true);
  };

  const updateCartItem = async (itemId: number, qty: number) => {
    await api.updateCartItem(itemId, qty);
    await refreshCart();
  };

  const deleteCartItem = async (itemId: number) => {
    await api.deleteCartItem(itemId);
    await refreshCart();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isFarmer: !!user?.is_farmer,
        walletBalance: user?.wallet_balance || 848.0,
        cart,
        cartCount: cart?.item_count || 0,
        refreshUser,
        refreshCart,
        login,
        register,
        logout,
        becomeFarmer,
        addToCart,
        updateCartItem,
        deleteCartItem,
        openAuthModal: (mode = 'login') => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        },
        closeAuthModal: () => setAuthModalOpen(false),
        authModalOpen,
        authModalMode,
        openCartDrawer: () => setCartDrawerOpen(true),
        closeCartDrawer: () => setCartDrawerOpen(false),
        cartDrawerOpen,
        openWalletModal: () => setWalletModalOpen(true),
        closeWalletModal: () => setWalletModalOpen(false),
        walletModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
