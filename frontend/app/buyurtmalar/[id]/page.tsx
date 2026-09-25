"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Check,
  Star,
  Clock,
  Car,
  MapPin,
  Phone,
  MessageSquare,
  XCircle,
  Handshake,
  Headphones,
  Navigation,
} from "lucide-react";
import { useParams } from "next/navigation";
import CancelModal from "@/components/bookings/CancelModal";
import LocationModal from "@/components/bookings/LocationModal";
import { getBookingById, updateBookingStatus } from "@/lib/api/bookings";
import { getQuotesForRequest, acceptQuote, rejectQuote } from "@/lib/api/quotes";
import { Booking, Quote } from "@/types";
import { MOCK_QUOTES } from "@/lib/mock-data/quotes";

export default function BookingDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Modals state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    getBookingById(id)
      .then((data) => {
        if (data) {
          setBooking(data);
          setCurrentAddress(data.destinationAddress);
          setBookingStatus(data.statusText || "Jarayonda");
          if (data.requestId) {
            getQuotesForRequest(data.requestId).then((qList) => {
              if (Array.isArray(qList) && qList.length > 0) setQuotes(qList);
              else setQuotes(MOCK_QUOTES);
            });
          } else {
            setQuotes(MOCK_QUOTES);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load booking", err);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancelConfirm = (reason: string) => {
    setIsCancelModalOpen(false);
    if (booking) {
      updateBookingStatus(booking.id, "CANCELLED").catch(console.warn);
      setBookingStatus("Bekor qilindi");
      setToastNotice(`Buyurtma bekor qilindi. Sabab: ${reason}`);
    }
  };

  const handleLocationSave = (notes: string) => {
    setIsLocationModalOpen(false);
    if (notes) {
      setCurrentAddress((prev) => `${prev} (${notes})`);
    }
    setToastNotice("Manzil tafsilotlari ustaga yetkazildi.");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-semibold">Buyurtma tafsilotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center shadow-sm">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Buyurtma topilmadi</h1>
        <p className="text-sm text-on-surface-variant max-w-md">
          Siz so‘ragan buyurtma kodi (#{id}) bo‘yicha hech qanday ma’lumot topilmadi.
        </p>
        <Link
          href="/buyurtmalar"
          className="mt-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl shadow hover:bg-primary-hover transition-colors"
        >
          Buyurtmalar ro‘yxatiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* 1. TOP HEADER BANNER */}
      <div className="relative w-full overflow-hidden bg-surface-container-low py-6 lg:py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider">
                Buyurtma #{booking.orderNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
                {bookingStatus}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              {booking.serviceName}
            </h1>
            <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              3 ta saralangan usta taklif yubordi. Eng ma’qul smeta va vaqtni tasdiqladingiz, buyurtma hozir ijro bosqichida.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-surface-container-highest/60 flex items-center gap-3 border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-on-surface-variant">Usta Top Himoyasi</span>
                <span className="text-xs md:text-sm font-bold text-on-surface">100% Xavfsiz Xizmat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {/* 2. THREE COMPETING QUOTES CARDS */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                Tanlov va baholash
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                Sizning buyurtmangizga kelgan narx takliflari
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full self-start sm:self-auto font-medium">
              {quotes.length} ta usta taklif yubordi • 1 tasi tasdiqlangan
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {quotes.map((quote, idx) => {
              const isAccepted = quote.status === "ACCEPTED" || idx === 0;
              const pAvatar =
                quote.provider?.avatar &&
                (quote.provider.avatar.startsWith("http") || quote.provider.avatar.startsWith("/"))
                  ? quote.provider.avatar
                  : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150";

              return (
                <div
                  key={quote.id || idx}
                  className={`relative flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-md transition-shadow border ${
                    isAccepted
                      ? "ring-2 ring-primary border-primary/20"
                      : "border-outline-variant/30 hover:shadow-lg"
                  }`}
                >
                  {isAccepted && (
                    <div className="absolute -top-3.5 right-6 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Qabul qilingan
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm bg-surface-container">
                          <Image
                            src={pAvatar}
                            alt={quote.provider?.name || "Usta"}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-tertiary-container ring-2 ring-surface-container-lowest" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-on-surface truncate">
                            {quote.provider?.name || "Usta"}
                          </h3>
                          <Check className="w-4 h-4 text-tertiary-container stroke-[3]" />
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                          <span className="text-xs font-bold text-on-surface tnum">
                            {(quote.provider?.rating || 4.9).toFixed(1)}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            ({quote.provider?.reviewsCount || 24} sharh)
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant mt-0.5">
                          {quote.provider?.title || "Sovutish tizimlari ustasi"}
                        </span>
                      </div>
                    </div>

                    {/* Itemized Price Breakdown */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
                      <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                        Narx taqsimoti
                      </span>
                      <div className="flex items-center justify-between text-xs text-on-surface">
                        <span>Usta xizmat haqi</span>
                        <span className="font-semibold tnum">
                          {Number(quote.serviceFee || quote.totalPrice).toLocaleString()} so‘m
                        </span>
                      </div>
                      {quote.partsFee ? (
                        <div className="flex items-center justify-between text-xs text-on-surface">
                          <span>Ehtiyot qismlar</span>
                          <span className="font-semibold tnum">
                            {Number(quote.partsFee).toLocaleString()} so‘m
                          </span>
                        </div>
                      ) : null}
                      <div className="mt-1 pt-2 border-t border-outline-variant/30 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-on-surface">Jami:</span>
                        <div className="text-right">
                          <span className="text-xl font-black text-primary tracking-tight tnum">
                            {Number(quote.totalPrice).toLocaleString()}
                          </span>{" "}
                          <span className="text-xs text-on-surface-variant font-medium">so‘m</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrival & Warranty Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase">
                            Kelish vaqti
                          </span>
                          <span className="font-bold text-on-surface">{quote.arrivalTime || "Bugun"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-tertiary-fixed/30 text-on-tertiary-fixed-variant">
                        <ShieldCheck className="w-4 h-4 text-tertiary-container shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase">Kafolat</span>
                          <span className="font-bold text-on-surface">{quote.warranty || "6 oy"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    {isAccepted ? (
                      <div className="flex items-center gap-1.5 text-on-tertiary-container bg-tertiary-container/10 px-4 py-2 rounded-xl w-full justify-center text-xs font-bold border border-tertiary-fixed">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Tasdiqlangan</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            rejectQuote(quote.id).catch(console.warn);
                            setToastNotice("Taklif rad etildi.");
                          }}
                          className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Rad etish
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            acceptQuote(quote.id).catch(console.warn);
                            setToastNotice(`${quote.provider?.name || "Usta"} taklifi tanlandi!`);
                          }}
                          className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors cursor-pointer"
                        >
                          Tanlash
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. LIVE ORDER EXECUTION TRACKING SECTION */}
        <section className="rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                </span>
                <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                  Jonli ijro monitoringi
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface flex items-center gap-2">
                Buyurtma holati: {bookingStatus}
                <span className="text-2xl">🚗</span>
              </h2>
              <p className="text-sm text-on-surface-variant">
                Usta siz ko‘rsatgan manzil tomon harakatlanmoqda. Uchrashuv joyida kutib olishga tayyor bo‘ling.
              </p>
            </div>

            <div className="bg-primary-fixed/40 p-4 rounded-2xl flex items-center gap-4 shrink-0 border border-primary-fixed">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-primary-fixed-variant uppercase font-semibold">
                  Taxminiy yetib kelish:
                </span>
                <span className="text-2xl font-black text-primary tnum">
                  {booking.estimatedArrival}{" "}
                  <span className="text-xs font-medium text-on-surface">
                    ({booking.estimatedMinutesLeft} daqiqa qoldi)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 5-Step Progress Timeline */}
          <div className="relative py-2">
            <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-surface-container-high z-0">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: "50%" }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {(Array.isArray(booking.timeline) && booking.timeline.length > 0
                ? booking.timeline
                : [
                    { title: "Buyurtma qabul qilindi", subtitle: "Operator tasdiqladi", completed: true, current: false },
                    { title: "Usta biriktirildi", subtitle: "Usta qabul qildi", completed: true, current: false },
                    { title: "Usta yo‘lda", subtitle: "Harakatlanmoqda", completed: false, current: true },
                    { title: "Yetib keldi", subtitle: "Manzilda", completed: false, current: false },
                    { title: "Tugallandi", subtitle: "To‘lov qabul qilindi", completed: false, current: false },
                  ]
              ).map((step, index) => (
                <div
                  key={step.title}
                  className={`flex md:flex-col items-center md:items-center text-left md:text-center gap-3 ${
                    index > 2 ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      step.completed
                        ? "bg-tertiary text-on-tertiary"
                        : step.current
                        ? "bg-primary text-on-primary ring-4 ring-primary-fixed animate-pulse"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : step.current ? (
                      <Car className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs md:text-sm font-bold ${
                        step.current ? "text-primary font-extrabold" : "text-on-surface"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{step.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Row: Assigned Master info (7 cols) + Route Map & Actions (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-4 border border-outline-variant/20">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  Tayinlangan usta va transport ma’lumotlari
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm ring-2 ring-surface-container-lowest bg-surface-container shrink-0">
                      <Image
                        src={
                          booking.provider?.avatar &&
                          (booking.provider.avatar.startsWith("http") || booking.provider.avatar.startsWith("/"))
                            ? booking.provider.avatar
                            : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150"
                        }
                        alt={booking.provider?.name || "Usta"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-on-surface">
                          {booking.provider?.name || "Usta"}
                        </span>
                        <Check className="w-4 h-4 text-tertiary-container stroke-[3]" />
                      </div>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {booking.provider?.phone || "+998 90 123 45 67"}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-xs text-on-surface font-medium">
                          582 ta muvaffaqiyatli buyurtma
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3 w-full sm:w-auto border border-outline-variant/20">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant uppercase">Avtomobil</span>
                      <span className="text-xs font-bold text-on-surface">
                        {booking.vehicle?.model || "Cobalt"} {booking.vehicle?.color || "Oq"}
                      </span>
                      <span className="text-xs text-primary font-mono tracking-wider font-extrabold">
                        {booking.vehicle?.plateNumber || "01 A 777 BA"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <MapPin className="w-4 h-4 text-secondary shrink-0" />
                    <span className="line-clamp-1">Manzil: {currentAddress}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="text-xs text-primary font-bold hover:underline shrink-0 cursor-pointer"
                  >
                    Manzilni aniqlashtirish
                  </button>
                </div>
              </div>

              {/* Final agreed sum card */}
              <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold">
                    Kelishilgan yakuniy summa
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-primary tnum">
                      {Number(booking.totalPrice).toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-on-surface">so‘m</span>
                  </div>
                  <span className="text-xs text-on-surface-variant mt-0.5">
                    To‘lov xizmat tugagach naqd, Click yoki Payme orqali amalga oshiriladi.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold bg-tertiary-fixed/30 px-3 py-1.5 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4 text-tertiary-container" />
                  <span>Kafolatlangan smeta</span>
                </div>
              </div>
            </div>

            {/* Right column: Route Map & Call / Chat Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner bg-surface-container border border-outline-variant/30 bg-gradient-to-tr from-surface-container to-surface-container-high flex items-end p-3">
                <div className="relative z-10 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
                  <Navigation className="w-4 h-4 text-primary" />
                  <span>{booking.provider?.name || "Usta"} tirbandliksiz kelmoqda ({booking.distanceKm} km)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`tel:${(booking.provider?.phone || "+998712000000").replace(/[^0-9+]/g, "")}`}
                  className="h-12 w-full rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ustaga qo‘ng‘iroq qilish</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/xabarlar"
                    className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Chatda yozish</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="h-11 rounded-xl bg-error-container/40 hover:bg-error-container text-error text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Bekor qilish</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THREE ASSURANCE BADGES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-4 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-secondary flex items-center justify-center shrink-0 shadow-xs">
              <Handshake className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-on-surface">To‘g‘ridan-to‘g‘ri hisob-kitob</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Xizmat ko‘rsatilgunga qadar usta qo‘shimcha to‘lov talab qilishga haqli emas.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-4 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-on-surface">6 oylik rasmiy kafolat</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Ish yakunlangach, buyurtma kodi asosida bepul qayta tuzatish kafolati yoqiladi.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-4 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-tertiary flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-5 h-5 text-tertiary-container" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-on-surface">24/7 Qo‘llab-quvvatlash</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Har qanday tushunmovchilik yuz berganda qo‘llab-quvvatlash operatoriga murojaat qiling.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Notification Toast */}
      {toastNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {toastNotice}
          </div>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <span className="text-base font-bold">×</span>
          </button>
        </div>
      )}

      {/* Interactive Dialogs */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        providerName={booking.provider?.name || "Usta"}
        minutesLeft={booking.estimatedMinutesLeft || 15}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationSave}
        currentAddress={currentAddress}
      />
    </div>
  );
}
