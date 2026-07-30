"use client";

import zxcvbn from "zxcvbn";

const SCORE_COLORS = [
  "bg-red-600",
  "bg-red-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
];

const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score;
  const { warning, suggestions } = result.feedback;

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score ? SCORE_COLORS[score] : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {SCORE_LABELS[score]}
        {warning ? ` — ${warning}` : ""}
        {suggestions.length > 0 ? ` ${suggestions.join(" ")}` : ""}
      </p>
    </div>
  );
}
