"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Receipt,
  AlertTriangle,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { MOCK_ADMIN_STATS, MOCK_VERIFICATION_REQUESTS } from "@/lib/mock-data/admin";

export default function AdminDashboardPage() {
  const [verifications, setVerifications] = useState(MOCK_VERIFICATION_REQUESTS);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "APPROVED" } : v))
    );
    setAdminNotice("Usta arizasi tasdiqlandi va 'Tasdiqlangan Usta' nishoni yoqildi!");
  };

  const handleReject = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "REJECTED" } : v))
    );
    setAdminNotice("Usta arizasi rad etildi.");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Usta Top Boshqaruv Markazi
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Admin Boshqaruv Paneli
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
              ● Tizim barqaror ishlamoqda
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Jami mijozlar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {MOCK_ADMIN_STATS.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Faol ustalar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {MOCK_ADMIN_STATS.totalProviders.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Jami buyurtmalar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {MOCK_ADMIN_STATS.totalOrders.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center text-primary-container shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Platforma aylanmasi (GMV)</span>
              <p className="text-lg md:text-xl font-black text-primary tnum">
                {(MOCK_ADMIN_STATS.grossRevenue / 1000000000).toFixed(2)} mlrd so‘m
              </p>
            </div>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              Ustalarni verifikatsiya qilish navbati ({verifications.filter((v) => v.status === "PENDING").length} kutilmoqda)
            </h2>
            <span className="text-xs text-on-surface-variant">Pasport va Face-ID tekshiruvi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 text-on-surface-variant bg-surface-container-low">
                  <th className="p-3 font-bold">Usta Ismi</th>
                  <th className="p-3 font-bold">Yo‘nalish</th>
                  <th className="p-3 font-bold">Telefon</th>
                  <th className="p-3 font-bold">Pasport seriyasi</th>
                  <th className="p-3 font-bold">Sana</th>
                  <th className="p-3 font-bold">Holat</th>
                  <th className="p-3 font-bold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                    <td className="p-3 font-bold text-on-surface">{v.providerName}</td>
                    <td className="p-3">{v.category}</td>
                    <td className="p-3 font-mono">{v.phone}</td>
                    <td className="p-3 font-mono">{v.passportSerial}</td>
                    <td className="p-3 text-on-surface-variant">{v.appliedDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          v.status === "APPROVED"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : v.status === "REJECTED"
                            ? "bg-error-container text-error"
                            : "bg-secondary-container/20 text-secondary"
                        }`}
                      >
                        {v.status === "APPROVED" ? "Tasdiqlangan" : v.status === "REJECTED" ? "Rad etilgan" : "Kutilmoqda"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {v.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(v.id)}
                            className="px-3 py-1.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            Tasdiqlash
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(v.id)}
                            className="px-3 py-1.5 rounded-lg bg-error-container hover:bg-error-container/80 text-error font-bold text-xs transition-colors cursor-pointer"
                          >
                            Rad etish
                          </button>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant text-xs">Ko‘rib chiqilgan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispute & Safety Alert */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2 text-secondary">
              <AlertTriangle className="w-5 h-5 text-secondary" />
              Nizoli holatlar va Kafolat da’volari (3 ta faol murojaat)
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20 text-xs">
              <div>
                <span className="font-bold text-on-surface">Murojaat #DSP-104: Usta vaqtida kelmadi</span>
                <p className="text-on-surface-variant mt-0.5">Mijoz: Bekzod Y. • Usta: Davron T. • Summa: 210 000 so‘m</p>
              </div>
              <button
                type="button"
                onClick={() => setAdminNotice("Mablag‘ mijoz hisobiga to‘liq qaytarildi (Eskrou tranzaksiyasi tasdiqlandi).")}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-dim font-bold text-on-surface cursor-pointer self-start sm:self-auto"
              >
                Mablag‘ni qaytarish (Eskrou)
              </button>
            </div>
          </div>
        </div>
      </div>

      {adminNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {adminNotice}
          </div>
          <button
            type="button"
            onClick={() => setAdminNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <span className="text-base font-bold">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
