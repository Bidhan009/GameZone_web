"use client";

import { useState } from "react";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

interface AddToCartButtonProps {
  productId: string;
  isInStock: boolean;
  quantity: number;
}

export default function AddToCartButton({ productId, isInStock, quantity }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!isInStock) return;
    
    setIsLoading(true);
    try {
      await addToCart(productId,quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!isInStock || isLoading || isAdded}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
        isInStock && !isLoading && !isAdded
          ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          : isAdded
          ? "bg-green-600 text-white"
          : "bg-gray-800 text-gray-500 cursor-not-allowed"
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isAdded ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </>
        )}
      </span>
    </button>
  );
}
