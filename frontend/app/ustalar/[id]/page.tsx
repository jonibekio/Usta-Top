"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Wrench,
  Check,
  Search,
  Sparkles,
  Cpu,
  Gauge,
  Calendar,
  Zap,
  HelpCircle,
  Award,
  AlertCircle,
  X,
} from "lucide-react";
import { getProviderById } from "@/lib/api/providers";
import { Provider } from "@/types";

export default function ProviderProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState("services");

  // Booking drawer state
  const [selectedService, setSelectedService] = useState("Freon quyish & Sovutmayapti");
  const [selectedTime, setSelectedTime] = useState("Bugun, 18:00");
  const [addressInput, setAddressInput] = useState("Chilonzor 9-mavze, 14-uy");

  React.useEffect(() => {
    if (!id) return;
    getProviderById(id)
      .then((data) => {
        setProvider(data);
      })
      .catch((err) => {
        console.error("Failed to load provider", err);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/buyurtmalar/UT-8942");
  };

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case "Gauge":
        return <Gauge className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-semibold">Usta ma’lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center shadow-sm">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Usta profili topilmadi</h1>
        <p className="text-sm text-on-surface-variant max-w-md">
          Siz qidirayotgan mutaxassis tizimda topilmadi yoki profili vaqtincha nofaol.
        </p>
        <Link
          href="/ustalar"
          className="mt-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl shadow hover:bg-primary-hover transition-colors"
        >
          Ustalar ro‘yxatiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface relative">
      {/* Non-blocking Notice Toast */}
      {noticeMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {noticeMessage}
          </div>
          <button
            type="button"
            onClick={() => setNoticeMessage(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* 1. TOP HERO SURFACE & COVER */}
      <section className="relative w-full bg-surface-container-low pb-6">
        {/* Cover Backdrop */}
        <div className="relative h-56 md:h-72 w-full overflow-hidden bg-surface-container-high">
          <Image
            src={provider.coverImage}
            alt="Usta ish maydoni"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 md:left-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-tertiary text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-tertiary-container" />
              100% Tasdiqlangan Hujjatlar
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold shadow-sm">
              <Zap className="w-4 h-4" />
              Top Reytingli Mutaxassis
            </span>
          </div>
        </div>

        {/* Provider Header Main Card */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-16 md:-mt-20 relative z-10">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-5 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-outline-variant/30">
            {/* Avatar + Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md bg-surface-container ring-4 ring-surface-container-lowest">
                  <Image
                    src={provider.avatar}
                    alt={provider.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className="absolute -bottom-1 -right-1 flex items-center justify-center p-1 bg-surface-container-lowest rounded-full shadow-sm"
                  title="Online holatda"
                >
                  <span className="w-4 h-4 rounded-full bg-tertiary-container animate-pulse" />
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                    {provider.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                    {provider.shortTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-secondary text-xs font-bold ml-1">
                    <Check className="w-3.5 h-3.5 text-secondary stroke-[3]" />
                    Tasdiqlangan Usta
                  </span>
                </div>
                <p className="text-sm md:text-base text-on-surface-variant font-medium">
                  {provider.title}
                </p>

                {/* Metrics Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2.5 text-xs md:text-sm text-on-surface-variant">
                  <div className="flex items-center gap-1 bg-secondary-fixed/40 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-bold text-on-secondary-fixed text-sm tnum">
                      {provider.rating.toFixed(2)}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      ({provider.reviewsCount} ta mijoz bahosi)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      {provider.addressFull}{" "}
                      <span className="text-on-surface-variant/70 text-xs">
                        (Xizmat hududi: Butun shahar)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-tertiary-container" />
                    <span className="text-tertiary-container font-semibold">
                      {provider.availableTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-72 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("booking-card");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Buyurtma berish / Narx so‘rash</span>
              </button>
              <Link
                href="/xabarlar"
                className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Xabar yozish</span>
              </Link>
              <div className="flex items-center justify-between px-3.5 py-2 bg-surface-container-low rounded-xl text-on-surface-variant text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary" />
                  <span className="font-mono font-bold">{provider.phone}</span>
                </div>
                <span className="text-[10px] text-outline font-semibold">Buyurtmadan so‘ng</span>
              </div>
            </div>
          </div>

          {/* Performance Bento Strip (4 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight">
                  {provider.completedJobsCount}+
                </div>
                <div className="text-xs text-on-surface-variant">Muvaffaqiyatli ishlar</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight">
                  {provider.experienceYears} yil
                </div>
                <div className="text-xs text-on-surface-variant">Professional tajriba</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center text-primary-container shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight">
                  98%
                </div>
                <div className="text-xs text-on-surface-variant">
                  Tezkor javob (~{provider.responseMinutes} daq)
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight">
                  100%
                </div>
                <div className="text-xs text-on-surface-variant">Pasport & Guvohnoma</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB-NAVIGATION TABS BAR */}
      <div className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {[
              { id: "services", label: "Xizmatlar va Narxlar" },
              { id: "portfolio", label: `Portfolio va Ishlar (${provider.portfolio.length})` },
              { id: "reviews", label: `Mijozlar sharhlari (${provider.reviewsCount})` },
              { id: "about", label: "Ish tajribasi & Kafolat" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CONTENT SPLIT GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (65% / 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            {/* Services & Pricing Section */}
            <section
              id="services"
              className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                    Narxnoma
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                    Xizmatlar va narxlar ko‘rsatkichi
                  </h2>
                </div>
                <span className="text-xs text-on-surface-variant hidden sm:inline">
                  Kelishilgan tartibda
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/20"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                        {getServiceIcon(service.iconName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm md:text-base font-bold text-on-surface truncate">
                          {service.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-3">
                      <span className="text-sm md:text-base font-bold text-on-surface block tnum">
                        {service.priceFormatted}
                      </span>
                      {service.badge && (
                        <span className="text-[10px] text-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded font-semibold">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Portfolio & Work Highlights */}
            <section
              id="portfolio"
              className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                    Galereya
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                    Bajarilgan ishlar fotosuratlari (Portfolio)
                  </h2>
                </div>
                <span className="text-xs font-semibold text-primary">
                  Barchasi ({provider.portfolio.length})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {provider.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden aspect-square bg-surface-container border border-outline-variant/30 shadow-sm"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-xs text-on-primary font-medium">
                        {item.title} · {item.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Real Customer Reviews & Ratings */}
            <section
              id="reviews"
              className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                    Sharhlar
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                    Haqiqiy mijoz sharhlari ({provider.reviewsCount})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNoticeMessage("Sharh qoldirish uchun xizmat yakunlangan va tizim orqali qabul qilingan bo‘lishi shart.")}
                  className="self-start sm:self-auto px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                >
                  Sharh qoldirish
                </button>
              </div>

              {/* Rating Breakdown Bento Box */}
              <div className="p-5 bg-surface-container-low rounded-2xl mb-6 flex flex-col md:flex-row items-center gap-6 border border-outline-variant/20">
                <div className="flex flex-col items-center justify-center text-center px-4 shrink-0">
                  <span className="text-4xl md:text-5xl font-extrabold text-on-surface tnum">
                    {provider.rating.toFixed(2)}
                  </span>
                  <div className="flex items-center text-secondary my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary" />
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {provider.completedJobsCount} tasdiqlangan buyurtma
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">Ish sifati va natijasi</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
                      </div>
                      <span className="font-bold text-on-surface w-6 text-right">5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">Aytilgan vaqtda kelishi</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "98%" }} />
                      </div>
                      <span className="font-bold text-on-surface w-6 text-right">4.9</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">Narxning adolatliligi</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "98%" }} />
                      </div>
                      <span className="font-bold text-on-surface w-6 text-right">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex flex-col gap-4">
                {provider.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{rev.userName}</h4>
                          <span className="text-xs text-on-surface-variant">
                            {rev.date} · {rev.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-secondary-fixed/50 px-2 py-0.5 rounded text-on-secondary-fixed font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-secondary" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface mt-1 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mt-1">
                      <Check className="w-3.5 h-3.5 text-tertiary-container stroke-[3]" />
                      <span>Tasdiqlangan xizmat: {rev.serviceTitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About & Guarantee Section */}
            <section
              id="about"
              className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-4"
            >
              <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                Ishonch kafolati
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                Usta haqida va kafolat majburiyati
              </h2>
              <p className="text-sm md:text-base text-on-surface leading-relaxed">
                {provider.aboutText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <ShieldCheck className="w-6 h-6 text-tertiary-container shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">
                      {provider.warrantyMonths} Oylik Rasmiy Kafolat
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Nosozlik qaytalansa, bepul kelib bartaraf etiladi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <Wrench className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Professional Uskunalar</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Bosimli yuvish g‘ilofi va raqamli bosim o‘lchagichlar bilan xizmat.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (35% / 4 cols): Sticky Booking Widget */}
          <aside className="lg:col-span-4 sticky top-36 flex flex-col gap-4">
            <div
              id="booking-card"
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/30 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Tezkor bron
                  </span>
                  <h3 className="text-lg font-bold text-on-surface">
                    {provider.shortTitle}ni chaqirish
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              {/* Price headline */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-baseline justify-between">
                <span className="text-xs text-on-surface-variant">Boshlang‘ich narx:</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary tnum">80 000 so‘m</span>
                  <span className="block text-[10px] text-on-surface-variant">dan boshlab</span>
                </div>
              </div>

              {/* Earliest arrival alert */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping" />
                <span>Eng yaqin bo‘sh vaqt: Bugun, 18:00</span>
              </div>

              {/* Interactive Booking Form */}
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Konditsioner rusumi va muammo turi:
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface focus:outline-none cursor-pointer border border-outline-variant/30"
                  >
                    <option value="Freon quyish & Sovutmayapti">
                      Freon quyish & Sovutmayapti
                    </option>
                    <option value="To‘liq yuvish & Dezinfeksiya">
                      To‘liq yuvish & Dezinfeksiya
                    </option>
                    <option value="Diagnostika (Umuman yoqilmayapti)">
                      Diagnostika (Umuman yoqilmayapti)
                    </option>
                    <option value="Suv oqmoqda / Drenaj tiqilgan">
                      Suv oqmoqda / Drenaj tiqilgan
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Usta kelish sanasi:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Bugun, 18:00", "Ertaga, 10:00", "Ertaga, 14:00"].map((t) => {
                      const isSelected = selectedTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-on-primary shadow-sm"
                              : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Manzil (Tuman, ko‘cha, xonadon):
                  </label>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface focus:outline-none border border-outline-variant/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 mt-1 bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buyurtma berishga o‘tish</span>
                </button>
              </form>

              {/* Trust Notes */}
              <div className="pt-3 border-t border-surface-container flex flex-col gap-2 text-xs text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-tertiary-container shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-on-surface">Xavfsiz to‘lov:</strong> Mablag‘ usta ishni
                    to‘liq topshirgach va siz tasdiqlaganingizdan keyin o‘tkaziladi.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-on-surface">Bepul bekor qilish:</strong> Usta yo‘lga
                    chiqishidan kamida 1 soat oldin bekor qilish bepul.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Area Map Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Xizmat ko‘rsatish xaritasi</span>
                <span className="text-xs text-primary font-semibold">Toshkent & viloyat</span>
              </div>
              <div className="w-full h-44 rounded-xl bg-surface-container-high relative overflow-hidden flex items-end p-3 border border-outline-variant/30 bg-gradient-to-tr from-surface-container to-surface-container-high">
                <div className="relative z-10 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur text-on-surface text-xs shadow-sm flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Radius: 25 km ichida bepul borish
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
