"use client";

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, X } from "lucide-react";

export default function ProviderEarningsPage() {
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  const transactions = [
    { id: "tx-1", title: "Konditsioner ta'miri (#UT-8942)", date: "Bugun, 15:35", amount: "+230 000 so‘m", status: "Kutilmoqda (Xavfsiz hisob)", type: "in" },
    { id: "tx-2", title: "Santexnika xizmati (#UT-8920)", date: "Kecha, 18:20", amount: "+180 000 so‘m", status: "Hisobga tushdi", type: "in" },
    { id: "tx-3", title: "Kartaga yechib olish (Humo ••4589)", date: "11-sentyabr", amount: "-1 500 000 so‘m", status: "Bajarildi", type: "out" },
    { id: "tx-4", title: "Elektr nosozlik tuzatish (#UT-8902)", date: "10-sentyabr", amount: "+350 000 so‘m", status: "Hisobga tushdi", type: "in" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-secondary font-bold">
            Moliya va hisob-kitob
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Usta daromadlari va kassa
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {/* Balance Card */}
        <div className="bg-primary text-on-primary p-6 md:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-xs text-primary-fixed uppercase tracking-wider font-semibold">
              Mavjud balans:
            </span>
            <div className="text-3xl md:text-4xl font-black tracking-tight tnum">
              3 350 000 so‘m
            </div>
            <span className="text-xs text-primary-fixed-dim mt-1">
              +230 000 so‘m faol buyurtma kafolat hisobida muzlatilgan
            </span>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setPayoutNotice("Pul mablag‘larini kartaga o‘tkazish so‘rovi yuborildi! Mablag‘ 15 daqiqa ichida hisobingizga o‘tadi.")}
              className="h-11 px-6 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Kartaga yechib olish
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface">Amallar tarixi</h3>
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4 border border-outline-variant/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "in"
                        ? "bg-tertiary-fixed text-tertiary-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {tx.type === "in" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold text-on-surface">{tx.title}</span>
                    <span className="text-[11px] text-on-surface-variant">{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`block text-sm md:text-base font-extrabold tnum ${
                      tx.type === "in" ? "text-tertiary-container" : "text-on-surface"
                    }`}
                  >
                    {tx.amount}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {payoutNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[3]" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {payoutNotice}
          </div>
          <button
            type="button"
            onClick={() => setPayoutNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
