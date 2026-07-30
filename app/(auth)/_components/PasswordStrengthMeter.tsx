"use client";

import { Check, X } from "lucide-react";

const CRITERIA = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const BAR_COLORS = [
  "bg-red-600",
  "bg-red-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
];

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const results = CRITERIA.map((c) => c.test(password));
  const metCount = results.filter(Boolean).length;
  const barColor = BAR_COLORS[Math.max(0, metCount - 1)];

  return (
    <div className="space-y-2 mt-1 p-3 bg-[#0f1218] border border-gray-700 rounded-xl">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < metCount ? barColor : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {CRITERIA.map((criterion, i) => (
          <li
            key={criterion.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              results[i] ? "text-purple-400" : "text-gray-500"
            }`}
          >
            {results[i] ? (
              <Check className="w-3.5 h-3.5 text-purple-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-600" />
            )}
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
