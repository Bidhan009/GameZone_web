import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Game title is required"),
  price: z.coerce.number().min(0.01, "Price is required"),
  category: z.string().min(1, "Select a category"),
  stock: z.coerce.number().int().min(0),
  description: z.string().min(10, "Description is too short"),
  productImage: z.any().optional(), // For the file upload
});

export type ProductData = z.infer<typeof productSchema>;