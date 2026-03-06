"use client";

import { useFavorites } from "@/app/context/FavoritesContext";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  product: {
    _id: string;
    name?: string;
    title?: string;
    price: number;
    description: string;
    imageUrl: string;
    category?: string;
    genre?: string;
  };
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isWishlisted = isFavorite(product._id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-3 rounded-full border transition-all ${
        isWishlisted
          ? "bg-red-600 border-red-600"
          : "bg-gray-800 border-gray-700 hover:border-red-500"
      }`}
    >
      <Heart
        className={`h-5 w-5 ${
          isWishlisted ? "text-white fill-white" : "text-gray-400"
        }`}
      />
    </button>
  );
}