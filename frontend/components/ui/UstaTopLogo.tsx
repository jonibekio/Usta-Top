import React from "react";

interface UstaTopLogoProps {
  className?: string;
  showText?: boolean;
}

export default function UstaTopLogo({ className = "h-8 w-auto", showText = true }: UstaTopLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" x="2" y="2" rx="10" fill="#2563EB" />
        <path
          d="M16 15V22C16 26.4183 19.5817 30 24 30C28.4183 30 32 26.4183 32 22V15"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="29" cy="16" r="3" fill="#F59E0B" />
        <path
          d="M20 22L23 25L30 17"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-on-surface">
          Usta<span className="text-primary-container">Top</span>
        </span>
      )}
    </div>
  );
}
