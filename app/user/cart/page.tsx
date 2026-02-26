"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Package,
  ArrowLeft,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api/axios";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you havent added any items to your cart yet.</p>
        <Link
          href="/user/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wide">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">
            {cart.user.fullName} ({cart.user.email})
          </p>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={`${item.product._id}`}
              className="flex gap-4 p-4 bg-[#1c212a] rounded-2xl border border-gray-800"
            >
              <div className="w-24 h-24 rounded-xl bg-[#0f1115] flex items-center justify-center overflow-hidden">
                {item.product.imageUrl ? (
                  <img
                    src={
                      item.product.imageUrl.startsWith("http")
                        ? item.product.imageUrl
                        : `${API_BASE_URL}${item.product.imageUrl}`
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-600" />
                )}
              </div>

                <div className="flex-1">
                <Link
                  href={`/user/products/${item.product._id}`}
                  className="font-bold text-white hover:text-indigo-400 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-black text-white">${((item.product.price || 0) * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-500 text-xs mb-1">Qty</span>
                <span className="font-bold text-white">{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#1c212a] rounded-2xl border border-gray-800 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 border-b border-gray-800 pb-4 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Items ({cart.totalItems || 0})</span>
                <span>${(cart.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-white font-bold text-xl mb-6">
              <span>Total</span>
              <span>${(cart.totalPrice || 0).toFixed(2)}</span>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
