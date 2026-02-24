"use server";

import { ProductData } from "@/app/admin/products/schema";
import { createProduct, getProductById, updateProduct, deleteProduct } from "@/lib/api/product";
import { revalidatePath } from "next/cache";

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
    
    // Create new FormData with properly parsed values
    const newFormData = new FormData();
    newFormData.append('name', name);
    newFormData.append('price', price.toString()); // Send as string but backend will parse as number
    newFormData.append('category', category);
    newFormData.append('stock', stock.toString()); // Send as string but backend will parse as number
    newFormData.append('description', description);
    
    if (productImage) {
      newFormData.append('productImage', productImage);
    }
    
    console.log("Sending to API:", { 
      name: newFormData.get('name'), 
      price: newFormData.get('price'), 
      stock: newFormData.get('stock'),
      priceType: typeof newFormData.get('price'),
      stockType: typeof newFormData.get('stock')
    });
    
    // Call the actual API to create product
    const response = await createProduct(newFormData);
    
    return response as { success: boolean; message?: string };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Create product failed'
    };
  }
}

export async function handleUpdateProduct(formData: FormData, id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;
    const productImage = formData.get('productImage') as File;
    
    const newFormData = new FormData();
    newFormData.append('name', name);
    newFormData.append('price', price.toString());
    newFormData.append('category', category);
    newFormData.append('stock', stock.toString());
    newFormData.append('description', description);
    
    if (productImage && productImage.size > 0) {
      newFormData.append('productImage', productImage);
    }
    
    const response = await updateProduct(id, newFormData);
    
    if (response.success) {
      revalidatePath('/admin/products');
      revalidatePath(`/admin/products/${id}`);
    }
    
    return response as { success: boolean; message?: string };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Update product failed'
    };
  }
}

export async function handleDeleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await deleteProduct(id);
    
    if (response.success) {
      revalidatePath('/admin/products');
    }
    
    return response as { success: boolean; message?: string };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Delete product failed'
    };
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await getProductById(id);
    return { success: true, data: product };
  } catch (error: Error | any) {
    return { success: false, message: error.message || 'Failed to fetch product' };
  }
}