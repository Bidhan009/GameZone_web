import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Game title must be at least 3 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().min(10, "Description is too short"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type ProductData = z.infer<typeof productSchema>;