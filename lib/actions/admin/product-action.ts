"use server";

import { ProductData } from "@/app/admin/products/schema";
import { createProduct } from "@/lib/api/product";

export async function handleCreateProduct(formData: FormData): Promise<{ success: boolean; message?: string }> {
  // 1. Validate data again on server (Security)
  // 2. Save to your DB (MongoDB/Postgres/etc.)
  
  try {
    // Extract data from FormData for logging
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;
    const productImage = formData.get('productImage') as File;
    
    console.log("Server received:", { name, price, category, stock, description, productImage });
    
    // Call the actual API to create product
    const response = await createProduct(formData);
    
    return response as { success: boolean; message?: string };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Create product failed'
    };
  }
}