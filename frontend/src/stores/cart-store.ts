import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; deliveryFee: number; total: number; itemCount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.productId === product.id && item.variantId === variant.id
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                id: `${product.id}-${variant.id}-${Date.now()}`,
                productId: product.id,
                variantId: variant.id,
                product,
                variant,
                quantity,
              },
            ],
          });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },
      updateQuantity: (itemId, quantity) => {
        set({
          items: get().items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery over ₹500
        const total = subtotal + deliveryFee;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return { subtotal, deliveryFee, total, itemCount };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
