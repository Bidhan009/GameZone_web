"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/api/product";
import { toast } from "react-toastify";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Layers, 
  Gamepad2, 
  Image as ImageIcon,
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter
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
  fullImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await getProducts();
                console.log("Products fetched:", productsData);
                setProducts(productsData);
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await deleteProduct(productId);
                if (response.success) {
                    toast.success("Product deleted successfully");
                    setProducts(products.filter(p => p._id !== productId));
                } else {
                    toast.error(response.message || "Failed to delete product");
                }
            } catch (error: any) {
                console.error("Delete Error:", error);
                toast.error(error.message || "Failed to delete product");
            }
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Game": return <Gamepad2 className="w-5 h-5" />;
            case "Accessories": return <Package className="w-5 h-5" />;
            case "Consoles": return <Layers className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const resolveMediaUrl = (path?: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        return `${base}${path}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <Link 
                        href="/admin/products/create" 
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" />
                        Create Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="Game">Games</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Consoles">Consoles</option>
                        </select>

                        <div className="text-sm text-gray-500">
                            {filteredProducts.length} of {products.length} products
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                {product.imageUrl ? (
                                                    <img 
                                                        src={resolveMediaUrl(product.imageUrl)} 
                                                        alt={product.name}
                                                        className="h-16 w-16 rounded-lg object-cover ring-2 ring-purple-200"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%239CAAF'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' font-size='12' fill='white'%3E${product.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                                            <ImageIcon className="h-8 w-8 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                product.category === 'Game' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : product.category === 'Accessories'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-purple-600 font-bold">${product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                product.stock > 10 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : product.stock > 5 
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={`/admin/products/${product._id}`}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Link>
                                                
                                                <Link 
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </Link>
                                                
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                                
                                                <div className="relative group">
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <Filter className="w-4 h-4" />
                                                    </button>
                                                    {/* Dropdown menu can be added here */}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">
                            {searchTerm || filterCategory !== "all" 
                                ? "Try adjusting your search or filters" 
                                : "No products have been created yet"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
