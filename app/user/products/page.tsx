import { getProductsPaginated } from "@/lib/api/product";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import ProductCard from "./_components/ProductCard";

interface ProductPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 10;

    let productsData;
    let errorMessage = null;

    try {
        productsData = await getProductsPaginated(page, limit);
    } catch (error: any) {
        errorMessage = error.message || "Failed to load products";
        productsData = { products: [], total: 0, page: 1, totalPages: 0 };
    }

    const { products, total, totalPages } = productsData;

    return (
        <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2">All Products</h1>
            <p className="text-gray-500 text-sm mb-6">Browse our collection of gaming products</p>

            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
            )}

            {!errorMessage && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Package className="h-16 w-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                    <p className="text-gray-500 text-sm">Check back later for new products</p>
                </div>
            )}

            {products.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Link
                                href={`/user/products?page=${page - 1}`}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    page <= 1
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                                prefetch={false}
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Link>

                            <span className="text-gray-400 text-sm px-4">
                                Page {page} of {totalPages}
                            </span>

                            <Link
                                href={`/user/products?page=${page + 1}`}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    page >= totalPages
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                                prefetch={false}
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
