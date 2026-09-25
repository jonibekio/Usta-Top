"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Snowflake,
  Tv,
  Paintbrush,
  Sparkles,
  Armchair,
  Truck,
  Search,
  ArrowRight,
} from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { ServiceCategory } from "@/types";
import { MOCK_CATEGORIES } from "@/lib/mock-data/categories";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    getCategories()
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    santexnika: <Wrench className="w-7 h-7" />,
    elektrik: <Zap className="w-7 h-7" />,
    konditsioner: <Snowflake className="w-7 h-7" />,
    "maishiy-texnika": <Tv className="w-7 h-7" />,
    remont: <Paintbrush className="w-7 h-7" />,
    tozalash: <Sparkles className="w-7 h-7" />,
    mebel: <Armchair className="w-7 h-7" />,
    kochirish: <Truck className="w-7 h-7" />,
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-10 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Barcha yo‘nalishlar
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mt-1">
              Xizmat toifalari
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              Har qanday maishiy va ta&apos;mirlash muammosi uchun tekshirilgan ustalarni tanlang.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Toifani qidirish..."
              className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-surface-container-low animate-pulse border border-outline-variant/30"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/qidiruv?category=${cat.slug}`}
                className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-56 border border-outline-variant/30 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {categoryIcons[cat.slug] || <Wrench className="w-7 h-7" />}
                  </div>
                  <span className="text-xs text-tertiary-container bg-tertiary-fixed/30 px-3 py-1 rounded-full font-semibold">
                    {cat.mastersCount}+ usta
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
