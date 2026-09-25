"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Check,
  Star,
  Shield,
  Clock,
  MapPin,
  Brain,
  ArrowRight,
  User,
} from "lucide-react";
import { Provider } from "@/types";

interface ProviderHeroCardProps {
  provider: Provider;
}

export default function ProviderHeroCard({ provider }: ProviderHeroCardProps) {
  return (
    <article className="relative bg-surface-container-lowest rounded-2xl shadow-md p-6 lg:p-8 flex flex-col gap-4 transition-all hover:shadow-xl border border-outline-variant/30">
      {/* Top Match Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
          <Trophy className="w-3.5 h-3.5" />
          <span>🏆 Eng mos usta</span>
        </div>
        <div className="flex items-center gap-1.5 text-tertiary-container text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
          <span>{provider.availableTime}</span>
        </div>
      </div>

      {/* Profile Primary Block */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-surface-container">
            <Image
              src={provider.avatar}
              alt={provider.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 bg-tertiary-fixed text-on-tertiary-fixed p-1 rounded-full flex items-center justify-center shadow">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>

        <div className="flex flex-col grow min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-1">
            <div>
              <h3 className="text-xl font-bold text-on-surface tracking-tight">
                {provider.name}
              </h3>
              <p className="text-sm text-on-surface-variant">{provider.title}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="block text-xl font-extrabold text-primary tnum">
                {provider.priceRange.formatted}
              </span>
              <span className="text-xs text-on-surface-variant">
                diagnostika va ta&apos;mirlash
              </span>
            </div>
          </div>

          {/* Trust Badges & Rating */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-bold text-on-surface">
              <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
              <span>{provider.rating.toFixed(2)}</span>
              <span className="text-xs text-on-surface-variant font-normal">
                ({provider.reviewsCount} ta sharh)
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-tertiary-fixed/40 text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-xs font-semibold">
              <Shield className="w-3 h-3 text-tertiary-container" />
              <span>Kafolat beradi ({provider.warrantyMonths} oy)</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-primary-fixed/40 text-on-primary-fixed-variant px-2 py-0.5 rounded text-xs font-semibold">
              <Check className="w-3 h-3 text-primary" />
              <span>Tasdiqlangan shaxs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
        <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col">
          <span className="text-xs text-on-surface-variant">Bajarilgan ish</span>
          <span className="text-sm font-bold text-on-surface">
            {provider.completedJobsCount} ta buyurtma
          </span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col">
          <span className="text-xs text-on-surface-variant">Ish tajribasi</span>
          <span className="text-sm font-bold text-on-surface">
            {provider.experienceYears} yil uzluksiz
          </span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col">
          <span className="text-xs text-on-surface-variant">Javob vaqti</span>
          <span className="text-sm font-bold text-primary flex items-center gap-0.5">
            <Clock className="w-3.5 h-3.5" /> ⚡ {provider.responseMinutes} daqiqa
          </span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col">
          <span className="text-xs text-on-surface-variant">Masofa</span>
          <span className="text-sm font-bold text-on-surface flex items-center gap-0.5">
            <MapPin className="w-3.5 h-3.5 text-secondary" /> {provider.distanceKm} km ({provider.district})
          </span>
        </div>
      </div>

      {/* AI / Smart Match Reason Box */}
      {provider.matchReason && (
        <div className="bg-surface-container p-3.5 rounded-xl flex items-start gap-2.5 border border-outline-variant/30">
          <Brain className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-on-surface leading-snug">
            <strong className="font-semibold text-on-surface">Nima uchun tavsiya etildi:</strong>{" "}
            {provider.matchReason}
          </p>
        </div>
      )}

      {/* Recent Work Portfolio Preview */}
      {provider.portfolio && provider.portfolio.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            Oxirgi bajargan ishlari fotosuratlari
          </span>
          <div className="grid grid-cols-3 gap-2">
            {provider.portfolio.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-lg aspect-video bg-surface-container"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={300}
                  height={170}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[11px] text-on-primary font-medium">
                    {item.title} · {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-outline-variant/20">
        <Link
          href={`/ustalar/${provider.slug}`}
          className="w-full sm:w-auto px-5 h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <User className="w-4 h-4" />
          <span>Profilni ko‘rish</span>
        </Link>
        <Link
          href={`/buyurtmalar/UT-8942`}
          className="w-full sm:w-auto px-6 h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <span>Ustani tanlash va narx olish</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
