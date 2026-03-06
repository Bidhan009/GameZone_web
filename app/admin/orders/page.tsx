"use client";
import { useState, useEffect } from "react";
import { getAllAdminOrders, getOrderStats,updateAdminOrderStatus } from "@/lib/api/admin/order";
import { AdminOrder, OrderStats } from "@/lib/api/admin/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedStatus, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        getAllAdminOrders(selectedStatus || undefined, sortBy),
        getOrderStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return 'https://via.placeholder.com/100?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "paid":
        return "bg-blue-500/20 text-blue-400";
      case "shipped":
        return "bg-purple-500/20 text-purple-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    setMessage(null);
    try {
      console.log(`Updating order ${orderId} to status ${newStatus}`);
      await updateAdminOrderStatus(orderId, newStatus);
      console.log('Update successful');
      setMessage({ type: 'success', text: 'Order status updated successfully!' });
      loadData();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update order status' });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">📦 Order Management</h1>
      
      {/* Message Notification */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-indigo-400">{stats.totalOrders}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Completed Orders</p>
            <p className="text-3xl font-bold text-blue-400">{stats.completedOrders}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="createdAt">Newest First</option>
              <option value="totalAmount">Highest Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-gray-900 p-10 rounded-lg text-center border border-gray-800">
          <p className="text-gray-400 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500 transition duration-300"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 border-b border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-xs break-all">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Customer</p>
                    <p className="text-sm font-semibold">{order.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total</p>
                    <p className="text-sm font-semibold text-indigo-400">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updatingOrderId === order._id}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer ${
                        updatingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        order.status === 'pending' ? 'border-yellow-500/50' :
                        order.status === 'paid' ? 'border-blue-500/50' :
                        order.status === 'shipped' ? 'border-purple-500/50' :
                        order.status === 'completed' ? 'border-green-500/50' :
                        order.status === 'cancelled' ? 'border-red-500/50' : ''
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingOrderId === order._id && <span className="text-xs text-gray-400 ml-2">Updating...</span>}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 border-b border-gray-800">
                <p className="text-xs text-gray-400 mb-3">Items ({order.items.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex gap-2 bg-gray-800/50 p-2 rounded">
                      <img
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 bg-gray-800/20 text-xs text-gray-400">
                <p>📧 {order.user.email}</p>
                {order.user.phone && <p>📱 {order.user.phone}</p>}
                <p className="mt-2">📍 {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zipCode}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
