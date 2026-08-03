import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
  fullName: z.string().min(2, { message: "Minimum 2 characters" }),
  email: z.string().email({ message: "Enter a valid email" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});
export type UpdateUserData = z.infer<typeof updateUserSchema>;
