"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Search,
  Camera,
  Mic,
  ArrowRight,
  Zap,
  Star,
  Shield,
  CreditCard,
  Phone,
  UserCheck,
  Briefcase,
  Check,
  MessageSquare,
  Wrench,
  Snowflake,
  Tv,
  Paintbrush,
  Sparkles,
  Armchair,
  Truck,
  X,
  UploadCloud,
} from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { getProviders } from "@/lib/api/providers";
import { ServiceCategory, Provider } from "@/types";
import { MOCK_CATEGORIES } from "@/lib/mock-data/categories";
import { MOCK_PROVIDERS } from "@/lib/mock-data/providers";

export default function HomePage() {
  const router = useRouter();
  const [problemQuery, setProblemQuery] = useState("");
  const [categories, setCategories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [mediaModal, setMediaModal] = useState<"photo" | "audio" | null>(null);

  React.useEffect(() => {
    getCategories().then((data) => {
      if (data && data.length > 0) setCategories(data);
    });
    getProviders().then((data) => {
      if (data && data.length > 0) setProviders(data);
    });
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (problemQuery.trim()) {
      router.push(`/qidiruv?q=${encodeURIComponent(problemQuery.trim())}`);
    } else {
      router.push(`/qidiruv`);
    }
  };

  const handlePopularClick = (text: string) => {
    setProblemQuery(text);
    router.push(`/qidiruv?q=${encodeURIComponent(text)}`);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    santexnika: <Wrench className="w-6 h-6" />,
    elektrik: <Zap className="w-6 h-6" />,
    konditsioner: <Snowflake className="w-6 h-6" />,
    "maishiy-texnika": <Tv className="w-6 h-6" />,
    remont: <Paintbrush className="w-6 h-6" />,
    tozalash: <Sparkles className="w-6 h-6" />,
    mebel: <Armchair className="w-6 h-6" />,
    kochirish: <Truck className="w-6 h-6" />,
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface pb-12 pt-8 lg:pt-14">
        {/* Layered Mesh Ambient Background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[480px] h-[480px] bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Trust Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface shadow-sm text-on-tertiary-fixed-variant mb-4 border border-outline-variant/30">
            <ShieldCheck className="w-4 h-4 text-tertiary-container" />
            <span className="text-xs md:text-sm font-semibold text-tertiary-container">
              10,000+ tekshirilgan va tajribali ustalar Toshkentda
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface max-w-4xl tracking-tight mb-3">
            Muammoingizni ayting, <span className="text-primary-container">mos ustani</span> topamiz.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
            Uy, ofis va kundalik xizmatlar uchun ishonchli ustalarni toping, solishtiring va xavfsiz buyurtma bering.
          </p>

          {/* Central Interactive Problem Input Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-xl p-3 md:p-5 flex flex-col gap-3 border border-outline-variant/30 text-left"
          >
            {/* Upper Row: Location Context & Live Response Time */}
            <div className="flex items-center justify-between px-1 text-on-surface-variant text-xs md:text-sm">
              <div className="flex items-center gap-1 text-primary font-semibold cursor-pointer hover:text-primary-container transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Joylashuv: Toshkent shahri</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                <span>O‘rtacha javob berish vaqti: ~7 daqiqa</span>
              </div>
            </div>

            {/* Input Area + Action Controls */}
            <div className="flex flex-col md:flex-row items-center gap-2 bg-surface-container-low rounded-xl p-2">
              <div className="relative flex-1 w-full flex items-center px-2">
                <Wrench className="w-5 h-5 text-outline mr-3 shrink-0" />
                <input
                  type="text"
                  value={problemQuery}
                  onChange={(e) => setProblemQuery(e.target.value)}
                  placeholder="Muammoingizni yozing... (masalan: Konditsionerim sovutmayapti yoki kran oqmoqda)"
                  className="w-full bg-transparent text-on-surface placeholder:text-outline text-sm md:text-base focus:outline-none py-1.5"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full md:w-auto justify-end pt-1 md:pt-0">
                <button
                  type="button"
                  onClick={() => setMediaModal("photo")}
                  title="Rasm yuklash"
                  className="h-11 w-11 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-container text-primary shadow-sm transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaModal("audio")}
                  title="Ovozli xabar"
                  className="h-11 w-11 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-container text-secondary-container shadow-sm transition-all cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 md:flex-none h-11 px-6 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Usta topish</span>
                </button>
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-on-surface-variant font-bold shrink-0">
                Ommabop so‘rovlar:
              </span>
              {[
                "Konditsioner tozalash",
                "Kran ta'mirlash",
                "Rozetka kuygan",
                "Muzlatgich tuzatish",
                "Mebel yig'ish",
                "Uyni tozalash",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePopularClick(item)}
                  className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>

          {/* Quick Metrics Ribbon (4 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-10 text-left">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-bold text-on-surface leading-tight">15 daqiqada</p>
                <p className="text-xs text-on-surface-variant truncate">Usta taklifi kelishi</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <Star className="w-5 h-5 fill-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-bold text-on-surface leading-tight">4.92 / 5.0</p>
                <p className="text-xs text-on-surface-variant truncate">Mijozlar mamnuniyati</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary-container shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-bold text-on-surface leading-tight">30 kunlik</p>
                <p className="text-xs text-on-surface-variant truncate">Ish uchun kafolat</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-primary-container shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-bold text-on-surface leading-tight">Xavfsiz hisob</p>
                <p className="text-xs text-on-surface-variant truncate">Ish bitgach to‘lov</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE CATEGORIES GRID */}
      <section className="w-full py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                Xizmat yo‘nalishlari
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                Qaysi sohada usta kerak?
              </h2>
            </div>
            <Link
              href="/xizmatlar"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Barcha 36+ toifani ko‘rish
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/qidiruv?category=${cat.slug}`}
                className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-48 relative overflow-hidden border border-outline-variant/30"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {categoryIcons[cat.slug] || <Wrench className="w-6 h-6" />}
                  </div>
                  <span className="text-xs text-tertiary-container bg-tertiary-fixed/30 px-2.5 py-0.5 rounded-full font-semibold">
                    {cat.mastersCount}+ usta
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (QANDAY ISHLAYDI) */}
      <section id="qanday-ishlaydi" className="w-full py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Oson va tushunarli jarayon
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1">
              Usta Top qanday ishlaydi?
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Baland narxlar va noaniq ustalardan qutuling. Bor-yo‘g‘i to‘rt qadamda muammoni hal qiling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-start bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary text-xl font-bold flex items-center justify-center mb-4 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Muammoingizni ayting</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Qisqa tavsiflang yoki rasm/ovoz yuboring. Hech qanday murakkab shakllarsiz bir necha soniyada.
              </p>
              <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold">
                <Camera className="w-3.5 h-3.5" />
                <span>Rasm yoki audio orqali ham</span>
              </div>
            </div>

            <div className="flex flex-col items-start bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary text-xl font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Mos ustalarni ko‘ring</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Aqlli algoritm joylashuvingiz bo‘yicha eng yaqin, reytingi baland va bo‘sh ustalarni tezkor taklif qiladi.
              </p>
              <div className="mt-4 flex items-center gap-1 text-tertiary-container text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>AI saralash tizimi</span>
              </div>
            </div>

            <div className="flex flex-col items-start bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary text-xl font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Ustani tanlang</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Narxlarni, mijozlar sharhlarini va avvalgi ishlarni solishtirib, o‘zingizga eng ma’qul mutaxassisni tanlang.
              </p>
              <div className="mt-4 flex items-center gap-1 text-secondary text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Shaffof narxlar</span>
              </div>
            </div>

            <div className="flex flex-col items-start bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary text-xl font-bold flex items-center justify-center mb-4 shadow-md">
                4
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Ish tugagach baholang</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Faqat ish sifatli va to‘liq bajarilgach to‘lov qiling hamda ustalarga haqqoniy sharhingizni qoldiring.
              </p>
              <div className="mt-4 flex items-center gap-1 text-tertiary text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% kafolatlangan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST & 5-STEP VERIFICATION */}
      <section id="kafolat" className="w-full py-12 bg-surface-container">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Explanatory Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <span className="text-xs uppercase tracking-wider text-tertiary font-bold bg-tertiary-fixed px-3 py-1 rounded-md">
                Xavfsizlik standarti
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-2 leading-tight">
                Ustalar qanday tekshiriladi?
              </h2>
              <p className="text-base text-on-surface-variant mt-3 mb-6 leading-relaxed">
                Sizning xonadoningiz xavfsizligi va ishingiz sifati bizning birinchi darajali vazifamiz. Platformadagi har bir mutaxassis 5 bosqichli sinovdan o‘tadi.
              </p>
              <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm flex items-center gap-4 w-full border border-outline-variant/30">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0">
                  <ShieldCheck className="w-6 h-6 text-tertiary-container" />
                </div>
                <div>
                  <p className="text-base font-bold text-on-surface">Usta Top Kafolati</p>
                  <p className="text-xs text-on-surface-variant">
                    Agar ish me’yorida bajarilmasa, bepul qayta ta&apos;mirlab beriladi.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Verified Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-start gap-3 border border-outline-variant/30">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Telefon tasdiqlangan</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    SMS va shaxsiy qo‘ng‘iroq orqali ustaning faol raqami to‘liq tekshiriladi.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-start gap-3 border border-outline-variant/30">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Shaxs tasdiqlangan</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Pasport ma&apos;lumotlari va Face-ID yuz verifikatsiyasi orqali tasdiq.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-start gap-3 border border-outline-variant/30">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Portfolio tekshirilgan</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    O‘g‘irlangan suratlar yo‘q. Faqat haqiqiy ob&apos;ektlardagi o‘z ishlari.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-start gap-3 border border-outline-variant/30">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary-container shrink-0">
                  <Star className="w-5 h-5 fill-secondary-container" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Haqiqiy mijoz sharhlari</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Faqat buyurtmani platformada yakunlagan mijozlargina fikr bildira oladi.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-primary-container text-on-primary p-4 rounded-xl shadow-md flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-primary-container flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-primary">Kafolatlangan buyurtma</h4>
                  <p className="text-xs text-primary-fixed mt-1">
                    Har bir rasmiy kelishuv Usta Top xizmat siyosati himoyasi ostida bo‘lib, kutilmagan zararlar qoplanishi kafolatlanadi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP USTALAR PREVIEW GRID */}
      <section className="w-full py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                Saralangan mutaxassislar
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                Haftaning eng yuqori baholangan ustalari
              </h2>
            </div>
            <Link
              href="/ustalar"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Barcha ustalarni ko‘rish
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.slice(0, 3).map((provider) => (
              <div
                key={provider.id}
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container">
                          <Image
                            src={provider.avatar}
                            alt={provider.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-on-surface leading-snug">
                          {provider.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          {provider.experienceYears} yillik tajriba
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-md text-on-surface">
                      <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                      <span className="text-xs font-bold tnum">{provider.rating.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {provider.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-surface-container text-xs text-on-surface-variant"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant pb-2 mb-3 bg-surface-container-low p-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-tertiary-container" />
                      <span>Javob: {provider.responseMinutes} daqiqa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{provider.district}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface-variant block">Xizmat narxi</span>
                    <span className="text-sm font-bold text-on-surface tnum">
                      {provider.priceRange.min.toLocaleString()} so‘mdan
                    </span>
                  </div>
                  <Link
                    href={`/ustalar/${provider.slug}`}
                    className="h-10 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Bog‘lanish</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="w-full py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Sharhlar
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1">
              Mijozlarimiz nima deydi?
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Haqiqiy buyurtmalar yakunlangach qoldirilgan tasdiqlangan sharhlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="flex items-center gap-1 text-secondary-container mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary-container" />
                  ))}
                </div>
                <p className="text-sm text-on-surface italic mb-4 leading-relaxed">
                  &ldquo;Konditsionerim eng issiq kunda to‘xtab qoldi. Usta Top orqali ariza qoldirdim, 15 daqiqada Jahongir usta javob berdi. 1 soatda yetib kelib, freon quyib sozlab berdi. Narxi ham juda insofli bo‘ldi!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                  DK
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Dilnoza Karimova</p>
                  <p className="text-xs text-on-surface-variant">Toshkent, Mirzo Ulug‘bek</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="flex items-center gap-1 text-secondary-container mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary-container" />
                  ))}
                </div>
                <p className="text-sm text-on-surface italic mb-4 leading-relaxed">
                  &ldquo;Yangi xonadonimizda elektr taqsimotini noldan qilish kerak edi. Rustam aka kelib, hisob-kitobni qildi va materiallarni o‘zi tanlab berdi. Ish sifatiga gap yo‘q, eng muhimi xavfsizlikka to‘liq kafolat berildi.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                  BY
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Bekzod Yusupov</p>
                  <p className="text-xs text-on-surface-variant">Toshkent, Shayxontohur</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="flex items-center gap-1 text-secondary-container mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary-container" />
                  ))}
                </div>
                <p className="text-sm text-on-surface italic mb-4 leading-relaxed">
                  &ldquo;Kran oqib, pastdagi qo‘shniga o‘tish xavfi bor edi. Shoshilinch chaqiruv orqali Akmal usta 20 daqiqada yetib keldi va 15 daqiqada nosozlikni bartaraf etdi. Juda minnatdorman!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                  MO
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Muyassar opa</p>
                  <p className="text-xs text-on-surface-variant">Toshkent, Chilonzor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CRAFTSMAN RECRUITMENT CALL TO ACTION BANNER */}
      <section className="w-full py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-6 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-primary-container rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary text-xs uppercase tracking-wider mb-3">
                Ustalar uchun hamkorlik
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-primary">
                Siz ham professional ustamisiz?
              </h2>
              <p className="text-sm md:text-base text-primary-fixed mt-2">
                Usta Top bilan daromadingizni oshiring. Kuniga yuzlab buyurtmalar, ishonchli to‘lovlar va qulay mobil ilova sizni kutmoqda.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 justify-center">
              <Link
                href="/auth/register?role=provider"
                className="h-12 px-6 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Usta sifatida ulanish</span>
              </Link>
              <Link
                href="/provider/dashboard"
                className="h-12 px-6 rounded-lg bg-primary-container hover:bg-primary-fixed hover:text-on-primary-fixed text-on-primary font-semibold text-sm flex items-center justify-center transition-all"
              >
                Batafsil shartlar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Photo & Audio Diagnostic Intake Modal */}
      {mediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                {mediaModal === "photo" ? (
                  <>
                    <Camera className="w-5 h-5 text-primary" />
                    <span>Nosozlik suratini yuklash</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-secondary-container" />
                    <span>Ovozli xabar orqali tushuntirish</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {mediaModal === "photo" ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-2xl p-8 text-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                <UploadCloud className="w-12 h-12 text-primary mb-3" />
                <p className="text-sm font-bold text-on-surface">Suratni shu yerga tashlang yoki tanlang</p>
                <p className="text-xs text-on-surface-variant mt-1">PNG, JPG, HEIC (maksimal 15 MB)</p>
                <button
                  type="button"
                  onClick={() => {
                    setMediaModal(null);
                    router.push("/qidiruv?hasPhoto=true");
                  }}
                  className="mt-4 px-5 py-2 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Suratni biriktirish va usta topish
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl p-8 text-center bg-surface-container-low">
                <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container mb-4 animate-pulse">
                  <Mic className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-on-surface">Muammoni ovoz orqali ayting</p>
                <p className="text-xs text-on-surface-variant mt-1">AI ovozingizni tahlil qilib, mos mutaxassisni saralaydi</p>
                <button
                  type="button"
                  onClick={() => {
                    setMediaModal(null);
                    router.push("/qidiruv?hasAudio=true");
                  }}
                  className="mt-4 px-5 py-2 bg-secondary-container hover:bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Yozib olishni boshlash
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
