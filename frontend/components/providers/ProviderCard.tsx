"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Star, MapPin, Briefcase, Clock, User, ArrowRight } from "lucide-react";
import { Provider } from "@/types";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 md:p-6 flex flex-col gap-4 transition-all hover:shadow-md border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-surface-container">
            <Image
              src={provider.avatar}
              alt={provider.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed p-0.5 rounded-full flex items-center justify-center shadow-xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        </div>

        {/* Master Info */}
        <div className="flex flex-col grow min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-1">
            <div>
              <h3 className="text-lg font-bold text-on-surface tracking-tight">
                {provider.name}
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant line-clamp-1">
                {provider.title}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="block text-base md:text-lg font-bold text-primary tnum">
                {provider.priceRange.formatted}
              </span>
              <span className="text-xs text-on-surface-variant">o‘rtacha narx</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-bold text-on-surface">
              <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
              <span>{provider.rating.toFixed(2)}</span>
              <span className="text-xs text-on-surface-variant font-normal">
                ({provider.reviewsCount} sharh)
              </span>
            </span>
            <span className="inline-flex items-center gap-1 bg-tertiary-fixed/40 text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-xs font-semibold">
              <Check className="w-3 h-3 text-tertiary-container" />
              <span>Tasdiqlangan</span>
            </span>
            {provider.tags.length > 0 && (
              <span className="hidden sm:inline-block bg-surface-container text-on-surface px-2 py-0.5 rounded text-xs">
                {provider.tags[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Condensed Metrics Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg">
        <span className="flex items-center gap-1 font-semibold text-on-surface">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          {provider.completedJobsCount} ta ish
        </span>
        <span>•</span>
        <span>{provider.experienceYears} yil tajriba</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-secondary" />
          {provider.distanceKm} km masofa
        </span>
        <span>•</span>
        <span className="text-tertiary-container font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {provider.availableTime}
        </span>
      </div>

      {/* Highlight Box if available */}
      {provider.matchReason && (
        <div className="flex items-center gap-2 text-on-surface-variant text-xs bg-surface-container/60 px-3 py-2 rounded-lg">
          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="line-clamp-1">{provider.matchReason}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        <Link
          href={`/ustalar/${provider.slug}`}
          className="px-4 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs md:text-sm font-semibold transition-colors flex items-center gap-1"
        >
          <User className="w-3.5 h-3.5" />
          <span>Profilni ko‘rish</span>
        </Link>
        <Link
          href={`/buyurtmalar/UT-8942`}
          className="px-5 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs md:text-sm font-semibold transition-colors shadow-sm flex items-center gap-1"
        >
          <span>Tanlash</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
