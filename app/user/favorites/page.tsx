"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Gamepad2, Star, Package } from "lucide-react";
import { toast } from "react-toastify";

// Hooks for your Clean Architecture Layers
import { useFavorites } from "@/app/context/FavoritesContext"; 
// import { useCart } from "@/context/CartContext";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites, loading } = useFavorites();
//   const { addToCart } = useCart();

//   const handleAddToCart = async (product: any) => {
//     try {
//       // Clean Architecture: Interaction with the Cart Use Case/Repository
//       await addToCart(product._id, 1);
//       toast.success(`${product.title} added to your library!`);
//     } catch (error) {
//       toast.error("Failed to add to cart");
//     }
//   };

  if (loading) {
    return (
      <div className="bg-[#0f1115] min-h-screen">
      </div>
    );
  }

  return (
    <div className="bg-[#0f1115] min-h-screen text-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Your <span className="text-indigo-500">Wishlist</span>
            </h1>
            <p className="text-gray-400 font-medium mt-2">
              {favorites.length} {favorites.length === 1 ? 'game' : 'games'} waiting for action
            </p>
          </div>
          
          {favorites.length > 0 && (
            <button 
              onClick={clearFavorites}
              className="text-gray-400 font-semibold hover:text-red-500 transition-colors flex items-center gap-2 group"
            >
              <Trash2 size={18} className="group-hover:animate-bounce" /> Clear All
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-[#1c212a] rounded-[2rem] border border-gray-800 shadow-2xl">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
              <Gamepad2 className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Wishlist is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">No games saved. Explore the store and heart your next adventure!</p>
            <Link 
              href="/user/products" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              <ArrowLeft size={18} /> Browse Games
            </Link>
          </div>
        ) : (
          /* Games Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product: {
              _id: string;
              title?: string;
              name?: string;
              price: number;
              genre?: string;
              category?: string;
              rating?: string;
              imageUrl?: string | null;
            }) => (
              <div 
                key={product._id} 
                className="group bg-[#1c212a] rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg"
              >
                {/* product Poster */}
                <div className="relative h-48 w-full bg-gray-900 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={
                        product.imageUrl.startsWith("http")
                          ? product.imageUrl
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrl}`
                      }
                      alt={(product.title || product.name) ?? "Game poster"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-gray-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c212a] to-transparent opacity-60" />
                  
                  <button 
                    onClick={() => removeFromFavorites(product._id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{product.rating || "4.8"}</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white truncate mb-1 group-hover:text-indigo-400 transition-colors">
                    {product.title || product.name}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                    {product.genre || "Action / RPG"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 block leading-none">Price</span>
                      <span className="text-xl font-black text-white">
                        ${product.price}
                      </span>
                    </div>
                    {/* <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] active:scale-95"
                    >
                      <ShoppingCart size={20} />
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}