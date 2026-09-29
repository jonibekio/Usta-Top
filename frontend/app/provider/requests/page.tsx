"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getServiceRequests } from "@/lib/api/requests";
import { createQuote } from "@/lib/api/quotes";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceRequest } from "@/types";

export default function ProviderRequestsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestForQuote, setActiveRequestForQuote] = useState<ServiceRequest | null>(null);

  // Quote form state
  const [serviceFee, setServiceFee] = useState("150000");
  const [partsFee, setPartsFee] = useState("0");
  const [arrivalTime, setArrivalTime] = useState("Bugun 18:00");
  const [warranty, setWarranty] = useState("6 oy kafolat");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteNotice, setQuoteNotice] = useState<string | null>(null);
  const [submittedRequestIds, setSubmittedRequestIds] = useState<string[]>([]);

  useEffect(() => {
    getServiceRequests()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Requests fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestForQuote) return;

    setIsSubmitting(true);
    setQuoteNotice(null);

    try {
      await createQuote(activeRequestForQuote.id, {
        serviceFee: Number(serviceFee) || 0,
        partsFee: Number(partsFee) || 0,
        arrivalTime,
        warranty,
        notes,
      });

      setSubmittedRequestIds((prev) => [...prev, activeRequestForQuote.id]);
      setQuoteNotice(
        `#${activeRequestForQuote.code} buyurtmasiga smeta taklifi yuborildi. Umumiy narx: ${(
          Number(serviceFee) + Number(partsFee)
        ).toLocaleString()} so‘m`
      );
      setActiveRequestForQuote(null);
    } catch (err: any) {
      console.error("Quote submit error:", err);
      setQuoteNotice(err?.message || "Taklif yuborishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Yangi mijoz arizalari
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Mijozlar buyurtmalarini ko‘rib chiqing va narx taklifingizni yuboring
          </p>
        </div>

        {quoteNotice && (
          <div className="p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-between text-xs font-semibold">
            <span>{quoteNotice}</span>
            <button onClick={() => setQuoteNotice(null)} className="font-bold">✕</button>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/30 text-center text-xs text-on-surface-variant">
            Hozircha ochiq buyurtmalar yo‘q. Yangi arizalar paydo bo‘lganda bu yerda ko‘rinadi.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => {
              const isSent = submittedRequestIds.includes(req.id);
              return (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">#{req.code}</span>
                      <h3 className="text-base font-bold text-on-surface">{req.categoryName}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-bold">
                        {req.urgencyText || "Bugun"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{req.location?.address}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {req.problemDescription}
                  </p>

                  <div className="flex items-center justify-end pt-2">
                    {isSent ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                        <CheckCircle className="w-4 h-4 text-tertiary-container" />
                        Taklif yuborilgan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveRequestForQuote(req)}
                        className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Smeta taklif qilish</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Submitting Quote */}
        {activeRequestForQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full shadow-xl border border-outline-variant/30 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    #{activeRequestForQuote.code} ga smeta yuborish
                  </h3>
                  <p className="text-xs text-on-surface-variant">{activeRequestForQuote.categoryName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRequestForQuote(null)}
                  className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Yopish
                </button>
              </div>

              <form onSubmit={handleSendQuote} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">
                      Xizmat haqi (so‘m)
                    </label>
                    <input
                      type="number"
                      required
                      value={serviceFee}
                      onChange={(e) => setServiceFee(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">
                      Ehtiyot qismlar (so‘m)
                    </label>
                    <input
                      type="number"
                      value={partsFee}
                      onChange={(e) => setPartsFee(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">
                      Yetib kelish vaqti
                    </label>
                    <input
                      type="text"
                      required
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      placeholder="Bugun 18:00"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">
                      Kafolat muddati
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="6 oy kafolat"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Qo‘shimcha izoh
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Xizmat shartlari yoki ehtiyot qismlar bo‘yicha izoh..."
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface">
                  <span>Jami hisoblangan summa:</span>
                  <span className="text-sm font-black text-primary tnum">
                    {(Number(serviceFee) + Number(partsFee)).toLocaleString()} so‘m
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveRequestForQuote(null)}
                    className="px-4 py-2 border border-outline-variant/40 text-on-surface font-semibold text-xs rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Taklifni yuborish</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
