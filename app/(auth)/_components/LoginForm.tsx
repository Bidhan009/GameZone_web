"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react"; 
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", 
  });

  const onSubmit = async (values: LoginData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const response = await handleLogin(values);

        // FIX #1: STOP REDIRECTION IF LOGIN FAILED
        if (!response.success) {
          setServerError(response.message || "Invalid credentials.");
          return; // This 'return' is crucial. It stops the code from reaching the router.push below.
        }

        // FIX #2: DATA SAFETY CHECK
        const user = response.data;
        if (!user) {
          setServerError("Login succeeded but user data is missing.");
          return;
        }

        // FIX #3: ROLE REDIRECTION (Checking exact role strings)
        // It's safer to use .toLowerCase() in case your DB returns "Admin" or "ADMIN"
        const role = user.role?.toLowerCase();

        if (role === "admin") {
          router.push("/admin");
        } else if (role === "user") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }

        
        router.refresh(); 
      } catch (error: any) {
        setServerError("Connection failed. Check your uplink.");
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-[#1a1f29] border border-gray-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic">
          Welcome <span className="text-purple-500">Back</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">Sign in to access your library and gear.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Displays the error from the database (e.g., "User not found") */}
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-500 text-xs animate-in fade-in zoom-in duration-200">
            <AlertCircle className="w-4 h-4" />
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="commander@gamezone.com"
              className={`w-full bg-[#0f1218] border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1 ml-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full bg-[#0f1218] border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all`}
            />
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1 ml-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden group bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(147,51,234,0.3)]"
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Enter Zone</span>
            )}
          </div>
        </button>

        <p className="text-center text-gray-400 text-sm mt-6">
          New to the squad?{" "}
          <Link href="/register" className="text-purple-400 font-bold hover:text-purple-300 hover:underline decoration-2 underline-offset-4">
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
}