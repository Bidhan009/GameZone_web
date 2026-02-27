"use client";
import { useState, useEffect } from "react";
import { getOrders } from "@/lib/api/order";
import { Order } from "@/lib/api/order";

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
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-indigo-500 transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                
                {/* Order Info */}
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-mono text-sm break-all">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-lg font-semibold text-indigo-400">
                    ${order.totalPrice}
                  </p>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}