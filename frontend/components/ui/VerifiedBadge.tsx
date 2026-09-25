import React from "react";
import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  label?: string;
  className?: string;
}

export default function VerifiedBadge({
  label = "Tasdiqlangan Usta",
  className = "",
}: VerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-tertiary-fixed/40 text-on-tertiary-fixed-variant px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-tertiary-container" />
      <span>{label}</span>
    </span>
  );
}
