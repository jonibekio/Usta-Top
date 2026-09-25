"use client";

import React, { useState } from "react";
import { MapPin, Send, Check } from "lucide-react";
import { MOCK_REQUESTS } from "@/lib/mock-data/requests";
import { ServiceRequest } from "@/types";

export default function ProviderRequestsPage() {
  const [requests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [activeRequestForQuote, setActiveRequestForQuote] = useState<ServiceRequest | null>(null);

  // Quote form state
  const [serviceFee, setServiceFee] = useState("150000");
  const [partsFee, setPartsFee] = useState("80000");
  const [arrivalTime, setArrivalTime] = useState("Bugun 18:00");
  const [warranty, setWarranty] = useState("6 oy kafolat");
  const [submittedCodes, setSubmittedCodes] = useState<string[]>([]);
  const [quoteNotice, setQuoteNotice] = useState<string | null>(null);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRequestForQuote) {
      setSubmittedCodes((prev) => [...prev, activeRequestForQuote.code]);
      setQuoteNotice(`Mijozga taklifingiz muvaffaqiyatli yuborildi! Jami summa: ${(Number(serviceFee) + Number(partsFee)).toLocaleString()} so‘m`);
      setActiveRequestForQuote(null);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Yangi arizalar bozori
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Kelib tushgan mijoz so‘rovlari
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Hududingizdagi mijozlar arizalarini ko‘rib chiqing va narx taklifi yuboring.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-4">
        {requests.map((req) => {
          const isSent = submittedCodes.includes(req.code);
          return (
            <div
              key={req.id}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">#{req.code}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-bold">
                    {req.urgencyText}
                  </span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {req.location.address}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-on-surface">{req.problemDescription}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant">Qachondan:</span>{" "}
                    <strong>{req.answers.timeframe}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant">Holat:</span>{" "}
                    <strong>{req.answers.condition}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant">Brend:</span>{" "}
                    <strong>{req.answers.brand}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-tertiary-container font-semibold">
                  Tavsiya etilgan o‘rtacha narx: 80 000 – 250 000 so‘m
                </span>

                {isSent ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-on-tertiary-container bg-tertiary-container/10 px-4 py-2 rounded-xl">
                    <Check className="w-4 h-4 stroke-[3]" /> Taklif yuborildi
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveRequestForQuote(req)}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Taklif yuborish</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Proposal Modal */}
      {activeRequestForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
            <h3 className="text-lg font-bold text-on-surface">
              Narx taklifi: #{activeRequestForQuote.code}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {activeRequestForQuote.problemDescription} ({activeRequestForQuote.location.address})
            </p>

            <form onSubmit={handleSendQuote} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Usta xizmat haqi (so‘m):
                </label>
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container rounded-xl text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary tnum"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Ehtiyot qismlar / Freon (so‘m):
                </label>
                <input
                  type="number"
                  value={partsFee}
                  onChange={(e) => setPartsFee(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container rounded-xl text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary tnum"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Kelish vaqti:
                </label>
                <input
                  type="text"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Kafolat muddati:
                </label>
                <select
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="1 oy kafolat">1 oy kafolat</option>
                  <option value="3 oy kafolat">3 oy kafolat</option>
                  <option value="6 oy kafolat">6 oy kafolat</option>
                  <option value="12 oy kafolat">12 oy kafolat</option>
                </select>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-sm font-bold mt-1">
                <span>Jami taklif:</span>
                <span className="text-primary font-black tnum">
                  {(Number(serviceFee) + Number(partsFee)).toLocaleString()} so‘m
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRequestForQuote(null)}
                  className="px-4 h-10 rounded-xl bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm cursor-pointer"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {quoteNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[3]" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {quoteNotice}
          </div>
          <button
            type="button"
            onClick={() => setQuoteNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <span className="text-base font-bold">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
