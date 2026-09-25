import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export default function RatingStars({
  rating,
  count,
  size = "md",
  showCount = true,
  className = "",
}: RatingStarsProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className={`inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md text-on-surface ${className}`}>
      <Star className={`${iconSize} text-secondary-container fill-secondary-container`} />
      <span className="text-xs md:text-sm font-bold tnum">{rating.toFixed(2)}</span>
      {showCount && count !== undefined && (
        <span className="text-xs text-on-surface-variant font-normal">
          ({count} ta sharh)
        </span>
      )}
    </div>
  );
}
