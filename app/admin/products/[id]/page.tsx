import { fetchProductById } from "@/lib/actions/admin/product-action";
import { ArrowLeft, Edit, Calendar, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import DeleteProductButton from "@/app/admin/products/_components/DeleteProductButton";

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await fetchProductById(id);
    
    if (!result.success || !result.data) {
        return (
            <div className="p-6">
                <Link href="/admin/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Products
                </Link>
                <div className="text-center py-12">
                    <p className="text-destructive">Product not found</p>
                </div>
            </div>
        );
    }

    const product = result.data;
    const createdDate = product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A';

    return (
        <div className="p-6">
            <Link href="/admin/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </Link>
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <h1 className="text-2xl font-bold">Product Details</h1>
                        <div className="flex gap-2">
                            <Link 
                                href={`/admin/products/${id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <DeleteProductButton productId={id} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        {product.imageUrl ? (
                            <img 
                                src={product.imageUrl} 
                                alt={product.name || 'Product'} 
                                className="h-48 w-48 rounded-lg object-cover shadow-lg"
                            />
                        ) : (
                            <div className="h-48 w-48 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                        <h2 className="mt-4 text-xl font-semibold">{product.name || 'N/A'}</h2>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full mt-2">
                            {product.category || 'N/A'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="text-lg font-bold">${product.price?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Package className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Stock</p>
                                <p className="text-lg font-bold">{product.stock ?? '0'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Created Date</p>
                            <p className="text-sm font-medium">{createdDate}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Description</label>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm">{product.description || 'No description available'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
