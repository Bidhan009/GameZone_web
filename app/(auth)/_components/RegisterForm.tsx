"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { Mail, Lock, User, Loader2, AlertCircle, ShieldCheck, Phone } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = async (values: RegisterData) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔑 allow sending cookies
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Registration failed:", data.message);
      alert(data.message || "Registration failed");
      return;
    }

    console.log("User created in MongoDB:", data);
    router.push("/login");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Server error. Check backend console.");
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

        {/* Phone Number (NEW) */}
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