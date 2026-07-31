"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleSetupMfa, handleConfirmMfa } from "@/lib/actions/auth-action";
import { useAuth } from "@/app/context/AuthContext";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";

export default function MfaSettings({ user }: { user: any }) {
    const { setUser } = useAuth();
    const [step, setStep] = useState<"idle" | "setup" | "confirm">("idle");
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [manualEntryKey, setManualEntryKey] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mfaEnabled = user?.mfaEnabled === true;

    const startSetup = async () => {
        setError(null);
        setLoading(true);
        try {
            const result = await handleSetupMfa();
            if (!result.success || !result.data) {
                setError(result.message || "Failed to start MFA setup");
                return;
            }
            setQrCodeDataUrl(result.data.qrCodeDataUrl);
            setManualEntryKey(result.data.manualEntryKey);
            setStep("confirm");
        } catch (err: any) {
            setError(err.message || "Failed to start MFA setup");
        } finally {
            setLoading(false);
        }
    };

    const confirmSetup = async () => {
        setError(null);
        if (code.length !== 6) {
            setError("Enter the 6-digit code from your authenticator app.");
            return;
        }
        setLoading(true);
        try {
            const result = await handleConfirmMfa(code);
            if (!result.success) {
                setError(result.message || "Invalid code. Please try again.");
                return;
            }
            toast.success("Two-factor authentication enabled!");
            setUser({ ...user, mfaEnabled: true });
            setStep("idle");
            setCode("");
            setQrCodeDataUrl(null);
            setManualEntryKey(null);
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {mfaEnabled ? (
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                        ) : (
                            <ShieldOff className="w-5 h-5 text-gray-400" />
                        )}
                        Two-Factor Authentication
                        {mfaEnabled && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-600/20 text-green-500 border border-green-600/40">
                                MFA enabled
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {mfaEnabled
                            ? "Your account is protected with an authenticator app."
                            : "Add an extra layer of security to your account."}
                    </p>
                </div>

                {!mfaEnabled && step === "idle" && (
                    <button
                        onClick={startSetup}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enable 2FA"}
                    </button>
                )}
            </div>

            {step === "confirm" && qrCodeDataUrl && (
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium mb-2">
                        1. Scan this QR code with Google Authenticator (or any authenticator app):
                    </p>
                    <img src={qrCodeDataUrl} alt="MFA QR Code" className="w-40 h-40 border rounded" />

                    <p className="text-sm text-gray-500 mt-2">
                        Or enter this key manually: <code className="bg-gray-100 px-2 py-0.5 rounded">{manualEntryKey}</code>
                    </p>

                    <p className="text-sm font-medium mt-4 mb-2">
                        2. Enter the 6-digit code shown in your app:
                    </p>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="border border-gray-300 rounded px-3 py-2 w-40 text-center text-lg tracking-widest"
                    />

                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={confirmSetup}
                            disabled={loading || code.length !== 6}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Confirm & Enable"}
                        </button>
                        <button
                            onClick={() => { setStep("idle"); setCode(""); setError(null); }}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {error && step !== "confirm" && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
    );
}