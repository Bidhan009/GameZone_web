import { fetchProductById } from "@/lib/actions/admin/product-action";
import EditProductForm from "@/app/admin/products/_components/EditProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({
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

    return (
        <div className="p-6">
            <Link href={`/admin/products/${id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Product Details
            </Link>
            
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                <EditProductForm product={result.data} />
            </div>
        </div>
    );
}
