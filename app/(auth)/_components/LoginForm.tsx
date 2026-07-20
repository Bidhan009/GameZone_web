"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { handleLogin, handleVerifyMfaLogin } from "@/lib/actions/auth-action";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  // MFA state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaPendingToken, setMfaPendingToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const redirectByRole = (role: string | undefined) => {
    const r = role?.toLowerCase();
    if (r === "admin") router.push("/admin");
    else if (r === "user") router.push("/user/dashboard");
    else router.push("/");
    router.refresh();
  };

  const onSubmit = async (values: LoginData) => {
    setServerError(null);

    if (!captchaValue) {
      setServerError("Please complete the CAPTCHA verification.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await handleLogin({ ...values, captchaToken: captchaValue } as any);

        if (!response.success) {
          setServerError(response.message || "Invalid credentials.");
          return;
        }

        // NEW: handle MFA-required response
        if (response.mfaRequired) {
          setMfaRequired(true);
          setMfaPendingToken(response.mfaPendingToken || null);
          return;
        }

        const user = response.data;
        if (!user) {
          setServerError("Login succeeded but user data is missing.");
          return;
        }

        redirectByRole(user.role);
      } catch (error: any) {
        setServerError("Connection failed. Check your uplink.");
      }
    });
  };

  const onMfaSubmit = async () => {
    setServerError(null);
    if (!mfaPendingToken || mfaCode.length !== 6) {
      setServerError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await handleVerifyMfaLogin(mfaPendingToken, mfaCode);

        if (!response.success) {
          setServerError(response.message || "Invalid MFA code.");
          return;
        }

        const user = response.data;
        redirectByRole(user?.role);
      } catch (error: any) {
        setServerError("MFA verification failed.");
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  // MFA code entry screen — shown after password is verified
  if (mfaRequired) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-[#1a1f29] border border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <ShieldCheck className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white uppercase tracking-tighter italic">
            Two-Factor <span className="text-purple-500">Verification</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-500 text-xs mb-4">
            <AlertCircle className="w-4 h-4" />
            {serverError}
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="w-full bg-[#0f1218] border border-gray-700 rounded-lg py-3 px-4 text-white text-center text-2xl tracking-[0.5em] placeholder:text-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />

        <button
          onClick={onMfaSubmit}
          disabled={isLoading || mfaCode.length !== 6}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify"}
        </button>

        <button
          onClick={() => { setMfaRequired(false); setMfaCode(""); setServerError(null); }}
          className="w-full mt-3 text-gray-400 text-sm hover:text-gray-300"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-[#1a1f29] border border-gray-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic">
          Welcome <span className="text-purple-500">Back</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">Sign in to access your library and gear.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <Link href="/forget-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
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