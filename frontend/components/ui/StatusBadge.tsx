import React from "react";
import { BookingStatus } from "@/types";

interface StatusBadgeProps {
  status: BookingStatus;
  text?: string;
  className?: string;
}

export default function StatusBadge({ status, text, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "IN_TRANSIT":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-bold ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {text || "Usta yo‘lda"}
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          {text || "Ish jarayonda"}
        </span>
      );
    case "COMPLETED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-tertiary-container" />
          {text || "Yakunlandi"}
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-xs font-bold ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-error" />
          {text || "Bekor qilindi"}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-bold ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-primary-container" />
          {text || "Yangi"}
        </span>
      );
  }
}
