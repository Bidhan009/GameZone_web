"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { Mail, Lock, User, Loader2, AlertCircle, ShieldCheck, Phone, ImagePlus } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const passwordValue = useWatch({ control, name: "password" }) || "";

  const isLoading = isSubmitting || isPending;

  const onSubmit = async (values: RegisterData) => {
    setServerError(null);

    if (!captchaValue) {
      setServerError("Please complete the CAPTCHA verification.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      formData.append("captchaToken", captchaValue);
      if (profileImage) {
        // multer on backend expects the field name 'profileImage'
        formData.append("profileImage", profileImage);
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Registration failed:", data.message);
        setServerError(data.message || "Registration failed");
        return;
      }

      console.log("User created in MongoDB:", data);
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("Server error. Check backend console.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-[#1a1f29] border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Join the <span className="text-purple-500">Squad</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">Create your GameZone account today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-500 text-xs">
            <AlertCircle className="w-4 h-4" />
            {serverError}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="name">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="fullName"
              {...register("fullName")}
              placeholder="Master Chief"
              className={`w-full bg-[#0f1218] border ${errors.fullName ? "border-red-500" : "border-gray-700"} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="email">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="player@gamezone.com"
              className={`w-full bg-[#0f1218] border ${errors.email ? "border-red-500" : "border-gray-700"} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="phone">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="+1 234 567 890"
              className={`w-full bg-[#0f1218] border ${errors.phone ? "border-red-500" : "border-gray-700"} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.phone.message}</p>}
        </div>

        {/* Profile Image (optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="profileImage">Profile Image (optional)</label>
          <div className="relative group">
            <ImagePlus className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              className="w-full bg-[#0f1218] border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:text-xs file:font-bold hover:file:bg-purple-700 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="password">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full bg-[#0f1218] border ${errors.password ? "border-red-500" : "border-gray-700"} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1" htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="••••••••"
              className={`w-full bg-[#0f1218] border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all`}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}</p>}
        </div>

        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(value) => setCaptchaValue(value)}
            theme="dark"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 mt-4 shadow-lg shadow-purple-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </div>
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-500 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}