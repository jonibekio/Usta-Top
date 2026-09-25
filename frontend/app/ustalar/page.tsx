"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Check,
  ChevronDown,
  SlidersHorizontal,
  ShieldCheck,
  Headphones,
  Calendar,
  Sparkles,
  CreditCard,
  Building,
} from "lucide-react";
import ProviderHeroCard from "@/components/providers/ProviderHeroCard";
import ProviderCard from "@/components/providers/ProviderCard";
import { getProviders } from "@/lib/api/providers";
import { Provider } from "@/types";

export default function MatchResultsPage() {
  // Filters state
  const [maxPrice, setMaxPrice] = useState(250000);
  const [distanceRadius, setDistanceRadius] = useState<number>(5);
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [activeQuickChip, setActiveQuickChip] = useState("available-today");

  // Providers list
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    getProviders({
      maxPrice,
      verifiedOnly: activeQuickChip === "verified",
    })
      .then((data) => {
        if (data) setProviders(data);
      })
      .finally(() => setIsLoading(false));
  }, [maxPrice, activeQuickChip]);

  const heroProvider = providers[0] || null;
  const otherProviders = providers.slice(1);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* 1. QUERY SUMMARY BANNER */}
      <section className="w-full bg-surface-container-low py-3.5 shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Context Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Konditsioner ta&apos;mirlash</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1.5 bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Toshkent, Chilonzor</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1.5 bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Shoshilinch / Bugun</span>
            </div>
            <Link
              href="/qidiruv"
              className="text-primary hover:text-primary-container text-xs font-semibold underline ml-1 cursor-pointer"
            >
              O‘zgartirish
            </Link>
          </div>

          {/* Live masters online indicator */}
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="inline-flex relative items-center justify-center w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container" />
            </span>
            <span>
              Ayni damda hududda <strong className="text-on-surface font-semibold">24 nafar</strong> usta onlayn
            </span>
          </div>
        </div>
      </section>

      {/* 2. TITLE & INSTANT FILTERS BAR */}
      <section className="w-full bg-surface py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold tracking-wider uppercase mb-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Algoritm tekshiruvidan o‘tdi</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                Sizning muammoingizga mos <span className="text-primary">{providers.length} ta ishonchli usta</span> topildi
              </h1>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <label htmlFor="sort-select" className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                Saralash:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-surface-container-low text-on-surface text-xs md:text-sm font-semibold pl-3 pr-8 py-2 rounded-xl cursor-pointer hover:bg-surface-container focus:outline-none shadow-sm border border-outline-variant/30"
                >
                  <option value="recommended">Tavsiya etilgan bo‘yicha</option>
                  <option value="rating">Reytingi yuqorilar (5.0 - 4.8)</option>
                  <option value="price_asc">Avval arzon narxlilar</option>
                  <option value="distance">Eng yaqin masofadagilar</option>
                  <option value="jobs">Eng ko‘p ish bajarganlar</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Chips Scroll Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "available-today", label: "Bugun bo‘sh (12)", icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: "high-rating", label: "⭐ 4.8 va undan yuqori (15)", icon: null },
              { id: "verified-all", label: "Tasdiqlangan (Hamma)", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              { id: "cheapest", label: "Eng arzon", icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: "near", label: "Yaqin masofa (< 5 km)", icon: <MapPin className="w-3.5 h-3.5" /> },
            ].map((chip) => {
              const active = activeQuickChip === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveQuickChip(chip.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
                  }`}
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN SPLIT LAYOUT (25% FILTERS / 75% MASTER CARDS) */}
      <main className="w-full pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Filter Sidebar */}
            <aside className="w-full lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span>Filtrlar</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setMaxPrice(400000);
                      setDistanceRadius(10);
                    }}
                    className="text-xs text-secondary hover:text-on-secondary-container font-semibold cursor-pointer"
                  >
                    Tozalash
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Xizmat narxi (so‘m)</span>
                    <span className="text-xs text-primary font-bold tnum">
                      50 000 – {maxPrice.toLocaleString()} so‘m
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="400000"
                    step="25000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>50 000</span>
                    <span>400 000+ so‘m</span>
                  </div>
                </div>

                <div className="h-px bg-surface-container-high w-full" />

                {/* Distance Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface">Uzoqlik radiusi</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 3, 5, 10].map((km) => {
                      const isSelected = distanceRadius === km;
                      return (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setDistanceRadius(km)}
                          className={`py-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-on-primary shadow-sm"
                              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          {km} km
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-surface-container-high w-full" />

                {/* Experience Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface">Usta tajribasi</span>
                  <div className="flex flex-col gap-1.5 text-xs text-on-surface">
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>3+ yil tajriba (18)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>5+ yil tajriba (14)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>10+ yil tajriba (6)</span>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-surface-container-high w-full" />

                {/* Additional Options */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface">Qo‘shimcha imkoniyatlar</span>
                  <div className="flex flex-col gap-1.5 text-xs text-on-surface">
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>Ehtiyot qismlar bilan</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>Kafolat beradi (kamida 3 oy)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span>Humo / Uzcard orqali to‘lov</span>
                    </label>
                  </div>
                </div>

                {/* Safe guarantee callout */}
                <div className="bg-tertiary-fixed/20 p-3.5 rounded-xl flex items-start gap-2.5 border border-tertiary-fixed">
                  <ShieldCheck className="w-5 h-5 text-tertiary-container shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-tertiary-fixed-variant">
                      100% Xavfsiz Bitim
                    </span>
                    <span className="text-[11px] text-on-tertiary-fixed-variant mt-0.5 leading-snug">
                      Ish qabul qilingandan keyingina ustaga to‘lov o‘tkaziladi.
                    </span>
                  </div>
                </div>
              </div>

              {/* District Map Widget */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Ustalar xaritada</span>
                  <span className="text-xs text-primary cursor-pointer hover:underline">
                    Kattalashtirish
                  </span>
                </div>
                <div className="w-full h-44 rounded-xl bg-surface-container-high relative overflow-hidden flex items-end p-3 bg-gradient-to-tr from-surface-container to-surface-container-high border border-outline-variant/30">
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Building className="w-24 h-24 text-primary" />
                  </div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg text-on-surface text-xs font-semibold shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span>Chilonzor tumani bo‘yicha 8 ta usta</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Master Stream */}
            <div className="w-full lg:col-span-8 flex flex-col gap-6">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-48 bg-surface-container-low animate-pulse rounded-2xl border border-outline-variant/30"
                    />
                  ))}
                </div>
              ) : providers.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl text-center border border-outline-variant/30 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Tanlangan parametrlar bo‘yicha usta topilmadi</h3>
                  <p className="text-sm text-on-surface-variant max-w-md">
                    Filtr mezonlarini kengaytiring yoki boshqa toifani tanlang.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMaxPrice(400000);
                      setDistanceRadius(10);
                      setActiveQuickChip("available-today");
                    }}
                    className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Filtrlarni tozalash
                  </button>
                </div>
              ) : (
                <>
                  {/* Card 1: Top Recommended Hero Master */}
                  {heroProvider && <ProviderHeroCard provider={heroProvider} />}

                  {/* Other verified masters */}
                  {otherProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}

                  {/* Summary Footer */}
                  {providers.length > 1 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <p className="text-xs text-on-surface-variant text-center">
                        Jami {providers.length} ta mutaxassis ko‘rsatilmoqda.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Customer Support Assurance Box */}
              <div className="bg-gradient-to-r from-primary-fixed/50 via-surface-container-high to-surface-container p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary-fixed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-on-surface">
                      Mos ustani tanlashda qiynalyapsizmi?
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Operatorimiz sizga 5 daqiqa ichida eng yaxshi 2 ta mutaxassisni bepul tavsiya qiladi.
                    </p>
                  </div>
                </div>
                <a
                  href="tel:+998712000000"
                  className="shrink-0 px-6 py-2.5 bg-surface-container-lowest hover:bg-surface-bright text-primary text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Yordam olish
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
