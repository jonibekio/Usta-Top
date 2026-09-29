"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Star,
  CheckCircle2,
  X,
  User,
  Car,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { getBookingById, cancelBooking } from "@/lib/api/bookings";
import { getServiceRequestById } from "@/lib/api/requests";
import { getQuotesForRequest, acceptQuote } from "@/lib/api/quotes";
import { startConversation } from "@/lib/api/conversations";
import { createBookingReview } from "@/lib/api/reviews";
import { Booking, ServiceRequest, Quote } from "@/types";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || "";
  const id = decodeURIComponent(rawId);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [requestObj, setRequestObj] = useState<ServiceRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const bData = await getBookingById(id);
      if (bData) {
        setBooking(bData);
        if (bData.requestId) {
          const qList = await getQuotesForRequest(bData.requestId);
          setQuotes(qList);
        }
      } else {
        const rData = await getServiceRequestById(id);
        if (rData) {
          setRequestObj(rData);
          const qList = await getQuotesForRequest(rData.id);
          setQuotes(qList);
        }
      }
    } catch (err) {
      console.error("Order detail load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleAcceptQuote = async (quoteId: string) => {
    setActionLoading(true);
    setNotice(null);
    try {
      await acceptQuote(quoteId);
      setNotice("Smeta taklifi qabul qilindi va buyurtma tasdiqlandi!");
      await loadData();
    } catch (err: any) {
      console.error("Accept quote error:", err);
      setNotice(err?.message || "Taklifni qabul qilishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Buyurtmani bekor qilishga ishonchingiz komilmi?")) return;
    setActionLoading(true);
    try {
      if (booking) {
        await cancelBooking(booking.id);
      }
      setNotice("Buyurtma bekor qilindi.");
      await loadData();
    } catch (err: any) {
      setNotice("Bekor qilishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessageProvider = async (providerId: string) => {
    setActionLoading(true);
    try {
      await startConversation(providerId, "Assalomu alaykum!");
      router.push("/xabarlar");
    } catch (err) {
      console.error("Message error:", err);
      router.push("/xabarlar");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!reviewComment.trim()) {
      alert("Iltimos, sharh matnini kiriting.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await createBookingReview(booking.id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSubmitted(true);
      setIsReviewOpen(false);
      setNotice("Sharhingiz va bahoyingiz muvaffaqiyatli saqlandi. Rahmat!");
    } catch (err: any) {
      console.error("Review submit error:", err);
      alert(err?.message || "Sharh yuborishda xatolik yuz berdi.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-on-surface-variant font-medium">Buyurtma yuklanmoqda...</p>
      </div>
    );
  }

  if (!booking && !requestObj) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <XCircle className="w-12 h-12 text-error/50" />
        <h1 className="text-xl font-bold text-on-surface">Buyurtma topilmadi</h1>
        <p className="text-xs text-on-surface-variant max-w-sm">
          Ko‘rsatilgan identifikator bo‘yicha buyurtma ma’lumotlari topilmadi.
        </p>
        <Link
          href="/buyurtmalar"
          className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg"
        >
          Buyurtmalar ro‘yxatiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/buyurtmalar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Buyurtmalar ro‘yxatiga qaytish</span>
        </Link>

        {notice && (
          <div className="p-4 rounded-xl bg-primary-fixed/20 border border-primary/20 text-on-surface text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Confirmed / Active / Completed Booking */}
        {booking && (
          <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">#{booking.orderNumber}</span>
                  <StatusBadge status={booking.status} text={booking.statusText} />
                </div>
                <h1 className="text-xl font-extrabold text-on-surface mt-1">
                  {booking.serviceName}
                </h1>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Vaqt: <strong className="text-on-surface">{booking.scheduledTime || "Bugun"}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-on-surface-variant block">To‘lov summasi</span>
                <span className="text-xl font-black text-on-surface tnum">
                  {booking.totalPrice.toLocaleString()} so‘m
                </span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  {booking.isPaid ? "To‘langan" : "Xizmat yakunida to‘lanadi"}
                </span>
              </div>
            </div>

            {/* If completed and review not submitted, show rating CTA */}
            {booking.status === "COMPLETED" && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-secondary/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                    <Star className="w-6 h-6 fill-secondary-container text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">
                      {reviewSubmitted ? "Baholash uchun rahmat!" : "Xizmat sifatini baholang"}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {reviewSubmitted
                        ? "Sizning fikringiz usta reytingini yangilashda hisobga olindi."
                        : "Sizning sharhingiz boshqa mijozlarga to‘g‘ri tanlov qilishda yordam beradi."}
                    </p>
                  </div>
                </div>

                {!reviewSubmitted && (
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(true)}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    Baho va sharh qoldirish
                  </button>
                )}
              </div>
            )}

            {/* Provider and destination cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provider Info */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                    Biriktirilgan mutaxassis
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                      {booking.provider?.avatar ? (
                        <Image
                          src={booking.provider.avatar}
                          alt={booking.provider.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        booking.provider?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{booking.provider?.name}</h3>
                      <p className="text-xs text-on-surface-variant">{booking.provider?.title}</p>
                      {booking.vehicleModel && (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                          <Car className="w-3.5 h-3.5 text-primary" />
                          <span>{booking.vehicleModel} {booking.vehiclePlate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMessageProvider(booking.provider?.id || "")}
                    disabled={actionLoading}
                    className="flex-1 h-10 px-4 bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Xabar yozish</span>
                  </button>
                  {booking.provider?.phone && (
                    <a
                      href={`tel:${booking.provider.phone}`}
                      className="h-10 px-4 border border-outline-variant/50 hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      <span>Qo‘ng‘iroq</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Destination Address */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                    Xizmat ko‘rsatish manzili
                  </span>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{booking.destinationAddress}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Mijoz: {booking.customerName} {booking.customerPhone ? `(${booking.customerPhone})` : ""}
                      </p>
                      {booking.problemDescription && (
                        <p className="text-xs text-on-surface-variant mt-2 italic bg-surface-container-low p-2 rounded-lg">
                          &ldquo;{booking.problemDescription}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                  <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Rejalashtirilgan ish</span>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="text-xs font-semibold text-error hover:underline cursor-pointer"
                    >
                      Buyurtmani bekor qilish
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Steps */}
            {booking.timeline && booking.timeline.length > 0 && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-sm font-bold text-on-surface mb-4">Buyurtma bosqichlari</h3>
                <div className="flex flex-col gap-4">
                  {booking.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          step.completed
                            ? "bg-tertiary-container text-on-tertiary"
                            : step.current
                            ? "bg-primary text-on-primary ring-4 ring-primary-fixed"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {step.completed ? "✓" : idx + 1}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-on-surface leading-tight">
                          {step.title}
                        </p>
                        {step.subtitle && (
                          <p className="text-xs text-on-surface-variant mt-0.5">{step.subtitle}</p>
                        )}
                        {step.timestamp && (
                          <span className="text-[10px] text-on-surface-variant/60">{step.timestamp}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Open Request awaiting quotes */}
        {requestObj && !booking && (
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-primary">#{requestObj.code}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                  {requestObj.status === "OPEN" ? "Takliflar kutilmoqda" : requestObj.status}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-on-surface mt-2">
                {requestObj.categoryName}
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                {requestObj.problemDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-4 pt-3 border-t border-outline-variant/20">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{requestObj.location?.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span>{requestObj.urgencyText || "Bugun"}</span>
                </div>
              </div>
            </div>

            {/* Quotes list */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                Ustalardan kelgan takliflar ({quotes.length})
              </h2>

              {quotes.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-2">
                  <Clock className="w-8 h-8 text-on-surface-variant/40" />
                  <p className="text-sm font-bold text-on-surface">Hozircha narx takliflari kelmadi</p>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    Sizning so‘rovingiz mutaxassislarga yuborildi. Ular tez orada smeta takliflarini kiritishadi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                          {q.provider?.avatar ? (
                            <Image
                              src={q.provider.avatar}
                              alt={q.provider.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            q.provider?.name?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{q.provider?.name}</h4>
                          <p className="text-xs text-on-surface-variant">{q.arrivalTime} • {q.warranty}</p>
                          {q.notes && (
                            <p className="text-xs text-on-surface-variant mt-1 italic">&ldquo;{q.notes}&rdquo;</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-sm font-black text-on-surface tnum">
                            {q.totalPrice.toLocaleString()} so‘m
                          </span>
                        </div>

                        {q.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(q.id)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            Qabul qilish
                          </button>
                        )}
                        {q.status === "ACCEPTED" && (
                          <span className="text-xs font-bold text-tertiary-container">Qabul qilindi</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
              <h3 className="text-base font-bold text-on-surface">Xizmatni baholash</h3>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 text-center">
                  Bahoingizni tanlang
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1.5 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? "fill-secondary-container text-secondary-container"
                            : "text-outline-variant"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs font-bold text-on-surface mt-1">
                  {reviewRating === 5
                    ? "A’lo darajada"
                    : reviewRating === 4
                    ? "Yaxshi"
                    : reviewRating === 3
                    ? "Qoniqarli"
                    : reviewRating === 2
                    ? "Yomon"
                    : "Juda yomon"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                  Sharh matni <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Usta bajargan ish, sifat va muomala haqida fikringizni yozing..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Sharhni saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
