"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getProducts } from "@/lib/api/product";
import { 
  ShoppingCart, 
  Package, 
  Heart, 
  TrendingUp, 
  Gamepad2, 
  Monitor, 
  Headphones, 
  Shield,
  Clock,
  Star,
  ChevronRight,
  LogOut,
  User,
  Settings,
  CreditCard
} from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  products: Product[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products (for recommendations)
        const productsData = await getProducts();
        setProducts(productsData.slice(0, 6)); // Show first 6 products
        
        // Mock recent orders data (replace with actual API call)
        setRecentOrders([
          {
            _id: "1",
            products: [
              { _id: "1", name: "Gaming Headset Pro", price: 89.99, category: "Accessories", stock: 10, description: "", createdAt: "" }
            ],
            total: 89.99,
            status: "delivered",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: "2", 
            products: [
              { _id: "2", name: "RGB Gaming Mouse", price: 45.99, category: "Accessories", stock: 15, description: "", createdAt: "" }
            ],
            total: 45.99,
            status: "shipped",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Game": return <Gamepad2 className="w-5 h-5" />;
      case "Accessories": return <Headphones className="w-5 h-5" />;
      case "Consoles": return <Monitor className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Welcome back, {user?.fullName || 'Gamer'}!</h2>
                <p className="text-purple-100">Your gaming adventure continues</p>
              </div>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* User Info Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Gamer'}</h1>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Level {Math.floor(Math.random() * 20) + 1} Gamer
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    ⭐ {Math.floor(Math.random() * 500) + 100} Points
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={logout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">24</h3>
            <p className="text-gray-500 text-sm">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">18</h3>
            <p className="text-gray-500 text-sm">Wishlist</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+25%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$1,247</h3>
            <p className="text-gray-500 text-sm">Total Spent</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Gold</h3>
            <p className="text-gray-500 text-sm">Member Status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/orders" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.products.length} {order.products.length === 1 ? 'Item' : 'Items'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.products.map((product, index) => (
                        <span key={index} className="text-sm text-gray-600">
                          {product.name}
                          {index < order.products.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended</h2>
                <Link href="/shop" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  See More
                </Link>
              </div>
              
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product._id} className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                    <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(product.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-600 font-bold">${product.price.toFixed(2)}</span>
                        <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/shop" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <ShoppingCart className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Browse Shop</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <Heart className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-900">Wishlist</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">My Orders</span>
            </Link>
            <Link href="/account" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <CreditCard className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Payment</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}