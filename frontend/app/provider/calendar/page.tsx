"use client";

import React, { useState } from "react";
import { Clock, Check, X } from "lucide-react";

export default function ProviderCalendarPage() {
  const [calNotice, setCalNotice] = useState<string | null>(null);

  const days = [
    { day: "Dush", date: "14", active: true, orders: 2 },
    { day: "Sesh", date: "15", active: false, orders: 3 },
    { day: "Chor", date: "16", active: false, orders: 1 },
    { day: "Pay", date: "17", active: false, orders: 4 },
    { day: "Jum", date: "18", active: false, orders: 2 },
    { day: "Shan", date: "19", active: false, orders: 5 },
    { day: "Yak", date: "20", active: false, orders: 0 },
  ];

  const slots = [
    { time: "09:00 - 11:00", customer: "Jamshid aka (Chilonzor-9)", service: "Konditsioner yuvish", status: "Bajarildi" },
    { time: "14:00 - 16:00", customer: "Otabek (Yunusobod-4)", service: "Freon to'ldirish", status: "Bajarildi" },
    { time: "17:30 - 19:30", customer: "Sardor A. (Chilonzor-9, 14-uy)", service: "Konditsioner ta'miri", status: "Jarayonda" },
    { time: "20:00 - 21:00", customer: "Bo'sh vaqt", service: "Yangi buyurtma qabul qilinadi", status: "Bo'sh" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Ish jadvali
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Taqvim va bo‘sh vaqtlar
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setCalNotice("Yangi bo‘sh vaqt oralig‘i (21:00 - 22:30) taqvimga muvaffaqiyatli qo‘shildi.")}
            className="px-5 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer"
          >
            + Bo‘sh vaqt qo‘shish
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {/* Days Ribbon */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d.day}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center border cursor-pointer transition-all ${
                d.active
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-low"
              }`}
            >
              <span className="text-xs">{d.day}</span>
              <span className="text-lg font-black">{d.date}</span>
              <span className="text-[10px] opacity-80 mt-1">{d.orders} ta buyurtma</span>
            </div>
          ))}
        </div>

        {/* Hourly slots */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-on-surface mb-2">Bugungi qabul jadvali</h3>
          {slots.map((slot) => (
            <div
              key={slot.time}
              className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">{slot.time}</span>
                  <span className="text-xs text-on-surface-variant">
                    {slot.customer} • {slot.service}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  slot.status === "Jarayonda"
                    ? "bg-secondary-container/20 text-secondary"
                    : slot.status === "Bajarildi"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-surface-container text-on-surface"
                }`}
              >
                {slot.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {calNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[3]" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {calNotice}
          </div>
          <button
            type="button"
            onClick={() => setCalNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
