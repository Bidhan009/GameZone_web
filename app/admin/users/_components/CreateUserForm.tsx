"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function CreateUserForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = async (data: UserData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        
        // Updated to fullName
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);

        if (data.profileImage) {
          formData.append("profileImage", data.profileImage);
        }

        const response = await handleCreateUser(formData);

        if (!response.success) {
          throw new Error(response.message || "Create profile failed");
        }
        
        reset();
        handleDismissImage();
        toast.success("Profile Created successfully");
      } catch (err: any) {
        const message = err.message || "Create profile failed";
        toast.error(message);
        setError(message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
    >
      {/* Profile Image Section */}
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

      {/* Full Name */}
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

      {/* Email & Phone */}
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

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.password?.message && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:opacity-90 disabled:opacity-60 transition"
      >
        {isSubmitting || pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}