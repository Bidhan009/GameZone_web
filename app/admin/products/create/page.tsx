"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { productSchema, ProductData } from "../schema"; // Importing from your colocated file
import { handleCreateProduct } from "@/lib/actions/admin/product-action"; // You'll create this next

export default function CreateProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (values: ProductData) => {
    startTransition(async () => {
      const result = await handleCreateProduct(values);
      if (result.success) {
        toast.success("Game added to inventory! 🎮");
        router.push("/admin/products");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-2xl border border-border shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Add New Game</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="text-sm font-medium">Game Title</label>
          <input 
            {...register("name")} 
            className="w-full mt-1 p-2 rounded-md border bg-background" 
            placeholder="e.g. Elden Ring"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input 
              type="number" step="0.01" 
              {...register("price")} 
              className="w-full mt-1 p-2 rounded-md border bg-background" 
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="text-sm font-medium">Stock Quantity</label>
            <input 
              type="number" 
              {...register("stock")} 
              className="w-full mt-1 p-2 rounded-md border bg-background" 
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <select {...register("category")} className="w-full mt-1 p-2 rounded-md border bg-background">
            <option value="">Select Category</option>
            <option value="Action">Action</option>
            <option value="RPG">RPG</option>
            <option value="Indie">Indie</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Adding to Inventory..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}