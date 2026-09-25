import React from "react";

export function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-surface-container-high" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 bg-surface-container-high rounded w-1/2" />
          <div className="h-4 bg-surface-container rounded w-3/4" />
        </div>
      </div>
      <div className="h-4 bg-surface-container rounded w-full" />
      <div className="h-4 bg-surface-container rounded w-2/3" />
      <div className="h-10 bg-surface-container-high rounded-lg w-full mt-2" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
