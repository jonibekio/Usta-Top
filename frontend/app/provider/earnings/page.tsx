"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownLeft, Check, X, Wallet, AlertCircle } from "lucide-react";
import { getBookings } from "@/lib/api/bookings";
import { getProviderDashboardStats } from "@/lib/api/providers";
import { Booking } from "@/types";

export default function ProviderEarningsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getBookings(), getProviderDashboardStats()])
      .then(([bList, sData]) => {
        setBookings(bList || []);
        setStats(sData);
      })
      .catch((err) => {
        console.error("Failed to load earnings:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completedJobs = bookings.filter((b) => b.status === "COMPLETED");
  const inProgressJobs = bookings.filter(
    (b) => b.status === "IN_PROGRESS" || b.status === "IN_TRANSIT" || b.status === "CONFIRMED"
  );

  const totalEarned = completedJobs.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const pendingEscrow = inProgressJobs.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const handleRequestPayout = () => {
    if (totalEarned <= 0) {
      setPayoutNotice("Hozircha yechib olish uchun hisobda mablag‘ mavjud emas.");
      return;
    }
    setPayoutNotice("Mablag‘ni yechib olish so‘rovi yuborildi. U 15 daqiqa ichida kartangizga o‘tkaziladi.");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-secondary font-bold">
            Moliya va hisob-kitob
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Daromadlar va kassa
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {/* Balance Card */}
        <div className="bg-primary text-on-primary p-6 md:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-xs text-primary-fixed uppercase tracking-wider font-semibold">
              Umumiy daromad
            </span>
            <div className="text-3xl md:text-4xl font-black tracking-tight tnum">
              {isLoading ? "..." : `${totalEarned.toLocaleString()} so‘m`}
            </div>
            {pendingEscrow > 0 && (
              <span className="text-xs text-primary-fixed-dim mt-1">
                +{pendingEscrow.toLocaleString()} so‘m faol buyurtmalar jarayonida
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleRequestPayout}
              className="h-11 px-6 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Kartaga yechib olish
            </button>
          </div>
        </div>

        {/* Transactions / Earnings Table */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">Buyurtmalar bo‘yicha to‘lovlar</h3>
            <span className="text-xs text-on-surface-variant font-medium">
              Bajarilgan ishlar: {completedJobs.length} ta
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-surface-container-low animate-pulse border border-outline-variant/20"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-on-surface">Hozircha to‘lovlar tarixi mavjud emas</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Buyurtmalarni bajarganingiz sari daromadlar bu yerda hisoblanib boradi.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.map((b) => {
                const isCompleted = b.status === "COMPLETED";
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4 border border-outline-variant/20"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-tertiary-fixed text-tertiary-container"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-on-surface">
                          {b.serviceName || "Xizmat"} (#{b.orderNumber})
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          Mijoz: {b.customerName} {b.scheduledTime ? `• ${b.scheduledTime}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`block text-sm md:text-base font-extrabold tnum ${
                          isCompleted ? "text-primary font-bold" : "text-on-surface-variant"
                        }`}
                      >
                        +{Number(b.totalPrice || 0).toLocaleString()} so‘m
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {isCompleted ? "To‘langan" : b.statusText || "Jarayonda"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
