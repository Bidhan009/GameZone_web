"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Package } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isWishlisted = isFavorite(product._id);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-400" };
    if (stock < 10) return { label: `Only ${stock} left`, color: "text-orange-400" };
    return { label: "In Stock", color: "text-green-400" };
  };

  const stockStatus = getStockStatus(product.stock);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-gray-800 bg-[#1c212a] p-4 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-gray-700/50 transition-all hover:bg-black/60 group-hover:border-red-500/50"
      >
        <Heart
          size={18}
          className={`transition-all ${
            isWishlisted
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      <Link href={`/user/products/${product._id}`}>
        <div className="relative mb-4 flex h-48 items-center justify-center rounded-xl bg-[#0f1115] overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <Package className="h-16 w-16 text-gray-600" />
          )}
        </div>
      </Link>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {product.category}
        </p>
        <Link href={`/user/products/${product._id}`}>
          <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h4>
        </Link>
        <p className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</p>
        <div className="flex items-center justify-between pt-3">
          <span className="text-lg font-black text-white">${product.price?.toFixed(2)}</span>
          <Link href={`/user/products/${product._id}`}>
            <button className="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
              <ShoppingCart size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
