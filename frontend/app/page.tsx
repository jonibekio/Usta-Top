"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Star,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Wrench,
  Snowflake,
  Zap,
  Tv,
  Paintbrush,
  Sparkles,
  Armchair,
  Truck,
  MapPin,
  Clock,
  Phone,
  Briefcase,
} from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { getProviders } from "@/lib/api/providers";
import { ServiceCategory, Provider } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [problemQuery, setProblemQuery] = useState("");
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getProviders()])
      .then(([cats, provs]) => {
        setCategories(cats);
        setProviders(provs);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (problemQuery.trim()) {
      router.push(`/ustalar?search=${encodeURIComponent(problemQuery.trim())}`);
    } else {
      router.push("/ustalar");
    }
  };

  const handleQuickSearch = (text: string) => {
    setProblemQuery(text);
    router.push(`/ustalar?search=${encodeURIComponent(text)}`);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    santexnika: <Wrench className="w-5 h-5" />,
    elektrik: <Zap className="w-5 h-5" />,
    konditsioner: <Snowflake className="w-5 h-5" />,
    "maishiy-texnika": <Tv className="w-5 h-5" />,
    pardozlash: <Paintbrush className="w-5 h-5" />,
    tozalash: <Sparkles className="w-5 h-5" />,
    mebel: <Armchair className="w-5 h-5" />,
    kochirish: <Truck className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-surface-container-low to-surface py-12 md:py-18">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight max-w-3xl">
            Ishonchli va malakali ustalarni toping
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-3 mb-8">
            Santexnika, elektr montaj, maishiy texnika ta’miri va boshqa xizmatlar bo‘yicha tekshirilgan mutaxassislar.
          </p>

          {/* Central Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-md p-2.5 sm:p-3 border border-outline-variant/30 text-left"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center px-3 py-1">
                <Search className="w-5 h-5 text-outline-variant mr-3 shrink-0" />
                <input
                  type="text"
                  value={problemQuery}
                  onChange={(e) => setProblemQuery(e.target.value)}
                  placeholder="Qanday xizmat yoki mutaxassis kerak?"
                  className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 text-sm sm:text-base focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Qidirish
                </button>
              </div>
            </div>

            {/* Quick popular tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 px-1 border-t border-outline-variant/15 mt-2">
              <span className="text-xs text-on-surface-variant mr-1">Ommabop:</span>
              {[
                "Konditsioner",
                "Santexnika",
                "Elektr montaj",
                "Muzlatgich",
                "Kir yuvish mashinasi",
                "Mebel yig‘ish",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickSearch(tag)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mt-10 text-left">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">Tekshirilgan ustalar</p>
                <p className="text-[11px] text-on-surface-variant">Hujjat va tajriba tekshiruvi</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed/60 flex items-center justify-center text-secondary shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">Shaffof narxlar</p>
                <p className="text-[11px] text-on-surface-variant">Oldindan kelishilgan smeta</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/60 flex items-center justify-center text-tertiary-container shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">Xizmat kafolati</p>
                <p className="text-[11px] text-on-surface-variant">Bajarilgan ishga kafolat</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">Tezkor aloqa</p>
                <p className="text-[11px] text-on-surface-variant">To‘g‘ridan-to‘g‘ri muloqot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="w-full py-12 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">Xizmat toifalari</h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">Sohalar bo‘yicha kerakli mutaxassisni tanlang</p>
            </div>
            <Link
              href="/xizmatlar"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              Barcha toifalar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/ustalar?category=${cat.slug}`}
                className="group bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {categoryIcons[cat.slug] || <Wrench className="w-5 h-5" />}
                  </div>
                  {cat.mastersCount > 0 && (
                    <span className="text-[11px] font-semibold text-on-surface-variant">
                      {cat.mastersCount} mutaxassis
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="w-full py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-xl mx-auto text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">Qanday ishlaydi?</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Buyurtma berishdan ishni qabul qilishgacha bo‘lgan oddiy jarayon
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-on-surface">So‘rov qoldiring</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Kerakli xizmat turi, manzil va qulay vaqtni ko‘rsating.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container text-primary text-sm font-bold flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-on-surface">Smetalarni oling</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Ustalardan narx takliflari va yetib kelish muddatini qabul qiling.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container text-primary text-sm font-bold flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-on-surface">Ustani tanlang</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Reyting, sharhlar va narxlarni solishtirib ma’qulini tasdiqlang.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary text-sm font-bold flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-base font-bold text-on-surface">Ishni qabul qiling</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Ish to‘liq va sifatli bajarilgach to‘lov qiling va baho bering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROVIDERS */}
      {providers.length > 0 && (
        <section className="w-full py-12 bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-on-surface">Mutaxassislar</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">Faol va reytingi yuqori ustalar</p>
              </div>
              <Link
                href="/ustalar"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                Barcha ustalar
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.slice(0, 3).map((provider) => (
                <div
                  key={provider.id}
                  className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex items-center justify-center text-primary font-bold">
                          {provider.avatar ? (
                            <Image
                              src={provider.avatar}
                              alt={provider.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            provider.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface leading-tight">
                            {provider.name}
                          </h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">{provider.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-bold text-on-surface">
                        <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                        <span>{provider.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
                      {provider.district && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{provider.district}</span>
                        </div>
                      )}
                      {provider.experienceYears > 0 && (
                        <span>{provider.experienceYears} yil tajriba</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15">
                    <div>
                      <span className="text-[11px] text-on-surface-variant block">Xizmat narxi</span>
                      <span className="text-xs font-bold text-on-surface">
                        {provider.priceRange.formatted || `${provider.priceRange.min.toLocaleString()} so‘mdan`}
                      </span>
                    </div>
                    <Link
                      href={`/ustalar/${provider.slug || provider.id}`}
                      className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg transition-colors"
                    >
                      Profilni ko‘rish
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PROVIDER RECRUITMENT BANNER */}
      <section className="w-full py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="rounded-2xl bg-primary text-on-primary p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-on-primary">
                O‘z xizmatlaringizni taklif qilmoqchimisiz?
              </h2>
              <p className="text-xs sm:text-sm text-primary-fixed mt-2">
                Usta Top platformasiga ulaning, mijozlar buyurtmalarini qabul qiling va daromadingizni oshiring.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/auth/register?role=PROVIDER"
                className="h-11 px-5 bg-secondary-container hover:bg-secondary text-on-secondary font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Usta sifatida ro‘yxatdan o‘tish</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
