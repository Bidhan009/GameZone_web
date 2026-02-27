"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
// Import your Hive service or Repository here
// import { FavoritesRepository } from "@/lib/repositories/favorites_repository";

export interface Product {
  _id: string;
  // some components use `title` instead of `name`
  title?: string;
  name?: string;
  price: number;
  description: string;
  imageUrl: string;
  genre?: string; // e.g. "Action / RPG"
  category?: string;
  rating?: string;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Hive or localStorage on initialization
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        // Clean Architecture: Fetch from Repository which reads from Hive Box
        // const localData = await FavoritesRepository.getFavorites();

        if (typeof window !== "undefined") {
          const savedFavorites = localStorage.getItem("gamezone_wishlist");
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
          }
        }
      } catch (error) {
        console.error("Failed to load favorites from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Persist to storage whenever favorites change
  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem("gamezone_wishlist", JSON.stringify(favorites));
      // In full Hive implementation:
      // FavoritesRepository.saveFavorites(favorites);
    }
  }, [favorites, loading]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.find((item) => item._id === product._id)) {
        toast.info("Game is already in your wishlist");
        return prev;
      }
      toast.success(`${product.name} added to favorites!`);
      return [...prev, product];
    });
  };

  const removeFromFavorites = (gameId: string) => {
    setFavorites((prev) => prev.filter((game) => game._id !== gameId));
    toast.warn("Removed from wishlist");
  };

  const isFavorite = (gameId: string) => {
    return favorites.some((game) => game._id === gameId);
  };

  const clearFavorites = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to clear your wishlist?")) {
      setFavorites([]);
      toast.error("Wishlist cleared");
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
