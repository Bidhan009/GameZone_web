"use client";
import { useState, useEffect } from "react";
import { getOrders } from "@/lib/api/order";
import { Order } from "@/lib/api/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await getOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return 'https://via.placeholder.com/100?text=No+Image';
    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path, prepend the API base URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading your orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🎮 My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-900 p-10 rounded-2xl text-center shadow-lg">
          <p className="text-gray-400 text-lg">
            You havent placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 hover:border-indigo-500 transition duration-300 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order by</p>
                    <p className="text-xl font-semibold text-white">
                      {order.user.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize inline-block ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-4">Items</p>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b border-gray-800 last:border-b-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(item.product.imageUrl)}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg bg-gray-800"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <p className="text-white font-semibold text-lg mb-1">
                          {item.product.name}
                        </p>
                        <div className="text-gray-400 text-sm space-y-1">
                          <p>Quantity: <span className="text-indigo-400 font-medium">{item.quantity}</span></p>
                          <p>Price: <span className="text-indigo-400 font-medium">${item.price.toFixed(2)}</span></p>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-gray-400 text-sm mb-1">Subtotal</p>
                        <p className="text-lg font-semibold text-indigo-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-800/50 p-6 border-t border-gray-800 flex justify-end">
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-2">Order Total</p>
                  <p className="text-3xl font-bold text-indigo-400">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}