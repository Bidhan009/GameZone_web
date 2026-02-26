import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  currentUser?: {
    _id: string;
    fullName: string;
    email: string;
  };
}

export const getCart = async (): Promise<Cart | null> => {
  try {
    const response = await axiosInstance.get(API.CART.GET);

    if (!response.data || !(response.data as any).success) {
      console.error('Invalid response structure:', response.data);
      return null;
    }

    return (response.data as any).data || null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn('User not authenticated, cart treated as empty.');
      return null;
    }

    console.error('Failed to fetch cart:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<Cart> => {
  const response = await axiosInstance.post(API.CART.ADD, { productId, quantity });
  return (response.data as any).data;
};

export const updateCartItem = async (productId: string, quantity: number): Promise<Cart> => {
  const response = await axiosInstance.patch(API.CART.UPDATE, { productId, quantity });
  return (response.data as any).data;
};

export const removeFromCart = async (productId: string): Promise<Cart> => {
  const response = await axiosInstance.delete(API.CART.REMOVE(productId));
  return (response.data as any).data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await axiosInstance.delete(API.CART.CLEAR);
  return (response.data as any).data;
};
