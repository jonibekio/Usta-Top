import React from "react";
import Link from "next/link";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Hech qanday ma’lumot topilmadi",
  description = "Qidiruv parametrlarini o‘zgartirib qayta urinib ko‘ring.",
  actionText,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary-container mb-4">
        {icon || <FolderSearch className="w-8 h-8 text-primary" />}
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">{description}</p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm flex items-center justify-center transition-all shadow-sm"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
