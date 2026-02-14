"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail, ChevronLeft, Loader2 } from "lucide-react"; // Nice icons

import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgetPasswordData>({
    mode: "onBlur", // Validates when user leaves the field
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = (values: ForgetPasswordData) => {
    startTransition(async () => {
      try {
        const result = await handleRequestPasswordReset(values.email);
        
        if (result.success) {
          toast.success("🎮 Level Clear! Check your email for the reset link.");
          router.push('/login');
        } else {
          toast.error(result.message || "Game Error: Could not send link.");
        }
      } catch (err) {
        toast.error("Connection lost. Check your internet.");
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl border border-border shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">
          Lost your <span className="text-primary text-blue-500">Key?</span>
        </h1>
        <p className="text-muted-foreground mt-2">Enter your email to recover your GameZone account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider opacity-70" htmlFor="email">
            Recovery Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="player@gamezone.com"
              className={`flex h-11 w-full rounded-lg border bg-secondary/50 px-10 py-2 text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none
                ${errors.email ? "border-destructive ring-destructive/20" : "border-input"}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500 animate-pulse">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="relative flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "SEND RESET LINK"
          )}
        </button>

        <div className="flex flex-col gap-4 pt-2 text-center text-sm">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;