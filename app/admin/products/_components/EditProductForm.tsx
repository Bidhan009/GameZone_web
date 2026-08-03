"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdateProduct } from "@/lib/actions/admin/product-action";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Gamepad2, Package, DollarSign, Layers, X, UploadCloud } from "lucide-react";

const EditProductFormSchema = z.object({
    name: z.string().min(3, "Game title must be at least 3 characters"),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    category: z.string().min(1, "Please select a category"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    description: z.string().min(10, "Description is too short"),
    productImage: z.instanceof(File).optional().nullable(),
});

type EditProductFormData = z.infer<typeof EditProductFormSchema>;

interface EditProductFormProps {
    product: {
        _id: string;
        name?: string;
        price?: number;
        category?: string;
        stock?: number;
        description?: string;
        imageUrl?: string | null;
    };
}

export default function EditProductForm({ product }: EditProductFormProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string | null>(product.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EditProductFormData>({
        resolver: zodResolver(EditProductFormSchema) as any,
        defaultValues: {
            name: product.name || '',
            price: product.price || 0,
            category: product.category || '',
            stock: product.stock || 0,
            description: product.description || '',
        }
    });

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (data: EditProductFormData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("price", data.price.toString());
                formData.append("category", data.category);
                formData.append("stock", data.stock.toString());
                formData.append("description", data.description);

                if (data.productImage) {
                    formData.append("productImage", data.productImage);
                }

                const response = await handleUpdateProduct(formData, product._id);

                if (!response.success) throw new Error(response.message);
                
                toast.success("Product updated successfully!");
                router.push(`/admin/products/${product._id}`);
            } catch (err: any) {
                toast.error(err.message || "Failed to update product");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 transition-colors hover:border-primary/50">
                {previewImage ? (
                    <div className="relative group">
                        <img src={previewImage} alt="Preview" className="h-40 w-40 rounded-lg object-cover shadow-md" />
                        <Controller
                            name="productImage"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Product Photo</p>
                    </div>
                )}

                <Controller
                    name="productImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <label className="mt-4 cursor-pointer rounded-lg bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition">
                            Select File
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            />
                        </label>
                    )}
                />
                {errors.productImage && <p className="mt-2 text-xs text-destructive">{errors.productImage.message as string}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Product Title</label>
                <input {...register("name")} placeholder="e.g. God of War Ragnarok" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Price</label>
                    <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> Stock</label>
                    <input type="number" {...register("stock", { valueAsNumber: true })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> Category</label>
                <select {...register("category")} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="">Select Category</option>
                    <option value="Game">Game</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Console">Console</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea {...register("description")} rows={4} className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Describe the game..." />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={pending}
                    className="h-12 flex-1 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest"
                >
                    {pending ? "Updating..." : "Update Product"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/admin/products/${product._id}`)}
                    className="h-12 px-6 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
