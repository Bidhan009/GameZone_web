"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    try {
      setLoading(true);

      // TODO: Replace with your real API call
      await fetch(`/api/wishlist/${productId}`, {
        method: isSaved ? "DELETE" : "POST",
      });

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-3 rounded-full border transition-all ${
        isSaved
          ? "bg-red-600 border-red-600"
          : "bg-gray-800 border-gray-700 hover:border-red-500"
      }`}
    >
      <Heart
        className={`h-5 w-5 ${
          isSaved ? "text-white fill-white" : "text-gray-400"
        }`}
      />
    </button>
  );
}