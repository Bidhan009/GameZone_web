import { getProducts } from "@/lib/api/product";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const products = await getProducts() || [];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link
                    href="/admin/products/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(products) && products.map((product: any) => (
                    <div key={product._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                        {product.image && (
                            <div className="h-48 overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 my-2">{product.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="font-bold text-primary">${product.price}</span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">{product.category}</span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">Stock: {product.stock}</div>
                        </div>
                    </div>
                ))}
                {(!products || products.length === 0) && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No products found. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
