"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  TrendingUp,
  Briefcase,
  Zap,
  ShieldCheck,
  X,
} from "lucide-react";
import { MOCK_PROVIDERS } from "@/lib/mock-data/providers";
import { MOCK_BOOKINGS } from "@/lib/mock-data/bookings";
import { MOCK_REQUESTS } from "@/lib/mock-data/requests";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const provider = MOCK_PROVIDERS[0]; // Ali Karimov
  const [isOnline, setIsOnline] = useState(true);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);
  const activeBooking = MOCK_BOOKINGS[0]; // UT-8942

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Banner */}
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-2 ring-primary bg-surface-container">
                <Image
                  src={provider.avatar}
                  alt={provider.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-tertiary-container ring-2 ring-surface" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-on-surface">{provider.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  Usta Kabineti
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {provider.title} • {provider.city}, {provider.district}
              </p>
            </div>
          </div>

          {/* Online status switch */}
          <div className="flex items-center gap-3 bg-surface-container-lowest p-2 rounded-2xl shadow-sm border border-outline-variant/30">
            <span className="text-xs font-bold text-on-surface pl-2">
              {isOnline ? "🟢 Buyurtmalarga tayyorman (Online)" : "⚪ Dam olish rejimida (Offline)"}
            </span>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isOnline ? "bg-tertiary-container" : "bg-outline-variant"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-surface absolute top-0.5 transition-transform ${
                  isOnline ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {/* KPI Bento Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Bu haftalik daromad</span>
              <p className="text-xl md:text-2xl font-black text-primary tnum">4 850 000 so‘m</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Muvaffaqiyatli ishlar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">127 ta</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary-container shrink-0">
              <Star className="w-6 h-6 fill-secondary-container" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">O‘rtacha reyting</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">4.92 / 5.0</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Qabul qilish darajasi</span>
              <p className="text-xl md:text-2xl font-black text-tertiary-container tnum">96%</p>
            </div>
          </div>
        </div>

        {/* Current Active Job Alert Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-primary flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary animate-ping" />
              <span className="text-xs uppercase tracking-wider font-bold text-secondary">
                Aktiv Buyurtma Ijrosi (#{activeBooking.orderNumber})
              </span>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">
              Holat: Usta yo‘lda
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-on-surface">{activeBooking.serviceName}</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Mijoz: <strong className="text-on-surface">{activeBooking.customerName}</strong> • {activeBooking.customerPhone}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>{activeBooking.destinationAddress}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Belgilangan vaqt:</span>
                <span className="font-bold text-on-surface">{activeBooking.scheduledTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Smeta summasi:</span>
                <span className="font-bold text-primary tnum">
                  {activeBooking.totalPrice.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Transport:</span>
                <span className="font-semibold text-on-surface">Cobalt oq (01 A 777 BA)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setProviderNotice("Yetib kelganingiz mijozga bildirildi. Ish holati yangilandi!")}
                className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Manzilga yetib keldim
              </button>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${activeBooking.customerPhone}`}
                  className="h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Qo‘ng‘iroq</span>
                </a>
                <Link
                  href="/xabarlar"
                  className="h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Customer Requests Section */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Yangi arizalar (Hududingizdagi mijozlar)
            </h2>
            <Link href="/provider/requests" className="text-xs font-bold text-primary hover:underline">
              Barchasini ko‘rish
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">#{req.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-semibold">
                      {req.urgencyText}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {req.location.city}, {req.location.district}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface">{req.problemDescription}</h4>
                  <p className="text-xs text-on-surface-variant">
                    {req.answers.timeframe} • {req.answers.condition} • {req.answers.brand}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/provider/requests?reqId=${req.id}`)}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Taklif yuborish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {providerNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {providerNotice}
          </div>
          <button
            type="button"
            onClick={() => setProviderNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
