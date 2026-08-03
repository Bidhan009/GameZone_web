"use client";
import { Trash2 } from "lucide-react";
import { handleDeleteProduct } from "@/lib/actions/admin/product-action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
    productId: string;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await handleDeleteProduct(productId);
            if (response.success) {
                toast.success("Product deleted successfully");
                router.push('/admin/products');
            } else {
                toast.error(response.message || "Failed to delete product");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm hover:opacity-90"
        >
            <Trash2 className="h-4 w-4" /> Delete
        </button>
    );
}
