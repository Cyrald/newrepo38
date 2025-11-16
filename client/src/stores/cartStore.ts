import { create } from "zustand";
import type { CartItemWithProduct } from "@shared/schema";

interface CartState {
  items: CartItemWithProduct[];
  itemCount: number;
  total: number;
  
  // Actions
  setItems: (items: CartItemWithProduct[]) => void;
  addItem: (item: CartItemWithProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,
  total: 0,

  setItems: (items: CartItemWithProduct[]) => {
    set({ items });
    get().calculateTotals();
  },

  addItem: (item: CartItemWithProduct) => {
    const existingItem = get().items.find((i) => i.productId === item.productId);
    
    if (existingItem) {
      get().updateQuantity(item.productId, existingItem.quantity + item.quantity);
    } else {
      set({ items: [...get().items, item] });
      get().calculateTotals();
    }
  },

  removeItem: (productId: string) => {
    set({
      items: get().items.filter((item) => item.productId !== productId),
    });
    get().calculateTotals();
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    });
    get().calculateTotals();
  },

  clear: () => {
    set({
      items: [],
      itemCount: 0,
      total: 0,
    });
  },

  calculateTotals: () => {
    const items = get().items;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => {
      // Skip items without product or price
      if (!item.product?.price) return sum;
      
      // Parse decimal string to number
      const price = typeof item.product.price === 'string' 
        ? parseFloat(item.product.price) 
        : Number(item.product.price);
      
      // Skip invalid prices
      if (isNaN(price) || price < 0) return sum;
      
      return sum + (price * item.quantity);
    }, 0);

    set({ itemCount, total });
  },
}));
