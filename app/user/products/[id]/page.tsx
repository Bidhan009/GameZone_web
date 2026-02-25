import { getProductById } from "@/lib/api/product";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, Package, Check, X } from "lucide-react";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    let product = null;
    let errorMessage = null;

    try {
        product = await getProductById(id);
    } catch (error: any) {
        errorMessage = error.message || "Failed to load product";
    }

    if (errorMessage || !product) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
                    <p className="text-gray-500 mb-6">{errorMessage || "The product you're looking for doesn't exist"}</p>
                    <Link
                        href="/user/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const isInStock = product.stock > 0;

    return (
        <div>
            <Link
                href="/user/products"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-[#1a1f29] p-6 border border-gray-800">
                    <div className="relative aspect-square rounded-xl bg-[#0f1115] overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <Package className="h-32 w-32 text-gray-600" />
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <span className="inline-block px-3 py-1 bg-indigo-600/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-500/20">
                        {product.category}
                    </span>

                    <h1 className="text-3xl font-black text-white">{product.name}</h1>

                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">${product.price?.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isInStock ? (
                            <>
                                <Check className="h-5 w-5 text-green-400" />
                                <span className="text-green-400 font-medium">In Stock ({product.stock} available)</span>
                            </>
                        ) : (
                            <>
                                <X className="h-5 w-5 text-red-400" />
                                <span className="text-red-400 font-medium">Out of Stock</span>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-800 pt-6">
                        <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {product.description || "No description available"}
                        </p>
                    </div>

                    <button
                        disabled={!isInStock}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                            isInStock
                                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            {isInStock ? "Add to Cart" : "Out of Stock"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
