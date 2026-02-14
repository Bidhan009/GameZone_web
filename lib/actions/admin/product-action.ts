"use server";

import { ProductData } from "@/app/admin/products/schema";

export async function handleCreateProduct(data: ProductData) {
  // 1. Validate data again on server (Security)
  // 2. Save to your DB (MongoDB/Postgres/etc.)
  console.log("Server received:", data);
  
  // Fake delay for effect
  await new Promise(r => setTimeout(r, 1000));
  
  return { success: true };
}