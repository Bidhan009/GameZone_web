"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";
import { z } from "zod";

const EditUserFormSchema = z.object({
    fullName: z.string().min(2, { message: "Full name is required" }).optional(),
    email: z.string().email({ message: "Enter a valid email" }).optional(),
    phone: z.string().min(10, { message: "Enter a valid phone number" }).optional(),
    profileImage: z
        .instanceof(File)
        .optional()
        .nullable(),
});

type EditUserFormData = z.infer<typeof EditUserFormSchema>;

interface EditUserFormProps {
    user: {
        _id: string;
        fullName?: string;
        email?: string;
        phone?: string;
        role?: string;
        profileImage?: string | null;
    };
}

export default function EditUserForm({ user }: EditUserFormProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string | null>(user.profileImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EditUserFormData>({
        resolver: zodResolver(EditUserFormSchema),
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
        }
    });

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: EditUserFormData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                
                if (data.fullName) formData.append("fullName", data.fullName);
                if (data.email) formData.append("email", data.email);
                if (data.phone) formData.append("phone", data.phone);

                if (data.profileImage) {
                    formData.append("profileImage", data.profileImage);
                }

                const response = await handleUpdateUser(formData, user._id);

                if (!response.success) {
                    throw new Error(response.message || "Update failed");
                }
                
                toast.success("User updated successfully");
                router.push(`/admin/users/${user._id}`);
            } catch (err: any) {
                const message = err.message || "Update failed";
                toast.error(message);
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
        >
            <div className="flex flex-col items-center gap-3">
                {previewImage ? (
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="h-28 w-28 rounded-full object-cover ring-2 ring-border"
                        />
                        <Controller
                            name="profileImage"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs shadow hover:scale-105 transition"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        No Image
                    </div>
                )}

                <Controller
                    name="profileImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <label className="cursor-pointer text-sm font-medium text-primary hover:underline">
                            Upload profile photo
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            />
                        </label>
                    )}
                />
                {errors.profileImage && (
                    <p className="text-xs text-destructive">{errors.profileImage.message as string}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                    {...register("fullName")}
                    placeholder="John Doe"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {errors.fullName?.message && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {errors.email?.message && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                        {...register("phone")}
                        type="text"
                        placeholder="+1 234 567 890"
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {errors.phone?.message && (
                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={pending}
                    className="h-11 flex-1 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:opacity-90 disabled:opacity-60 transition"
                >
                    {pending ? "Updating..." : "Update User"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/admin/users/${user._id}`)}
                    className="h-11 px-6 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
