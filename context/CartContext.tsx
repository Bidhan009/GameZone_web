"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Cart, CartItem, getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "@/lib/api/cart";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart(null);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const updatedCart = await apiAddToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = await apiRemoveFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCartItems = async () => {
    try {
      const updatedCart = await apiClearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, removeFromCart, clearCart: clearCartItems, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
