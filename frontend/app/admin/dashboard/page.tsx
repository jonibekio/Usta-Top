"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Receipt,
  FileCheck,
  TrendingUp,
  Check,
  X,
  MapPin,
  Star,
  Clock,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAdminStats } from "@/lib/api/analytics";
import {
  getVerifications,
  approveVerification,
  rejectVerification,
  VerificationRequest,
} from "@/lib/api/verification";
import { getBookings } from "@/lib/api/bookings";
import { getProviders } from "@/lib/api/providers";
import { AdminStats, Booking, Provider } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [activeTab, setActiveTab] = useState<"verifications" | "bookings" | "providers">("verifications");

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated || user?.role !== "ADMIN") {
        router.replace("/admin/login");
      }
    }
  }, [isAuthenticated, user, isAuthLoading, router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sData, vList, bList, pList] = await Promise.all([
        getAdminStats().catch(() => null),
        getVerifications().catch(() => []),
        getBookings().catch(() => []),
        getProviders().catch(() => []),
      ]);
      setStats(sData);
      setVerifications(vList || []);
      setAllBookings(bList || []);
      setAllProviders(pList || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      loadData();
    }
  }, [isAuthenticated, user]);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await approveVerification(id);
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "APPROVED" } : v))
      );
      setAdminNotice("Usta arizasi tasdiqlandi va profiliga 'Tasdiqlangan Usta' maqomi berildi.");
    } catch (err) {
      console.error("Failed to approve verification:", err);
      setAdminNotice("Tasdiqlashda xatolik yuz berdi");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await rejectVerification(id);
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "REJECTED" } : v))
      );
      setAdminNotice("Usta arizasi rad etildi.");
    } catch (err) {
      console.error("Failed to reject verification:", err);
      setAdminNotice("Rad etishda xatolik yuz berdi");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isAuthLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-on-surface-variant font-medium">Administrator huquqlari tekshirilmoqda...</p>
      </div>
    );
  }

  const pendingVerifications = verifications.filter((v) => v.status === "PENDING");

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Header */}
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Boshqaruv Markazi
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Admin Boshqaruv Paneli
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              ● Platforma faol holatda
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="px-3 py-1.5 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Jami foydalanuvchilar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {isLoading ? "..." : (stats?.totalUsers ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Ro‘yxatdagi ustalar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {isLoading ? "..." : (stats?.totalProviders ?? allProviders.length).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Jami buyurtmalar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {isLoading ? "..." : (stats?.totalOrders ?? allBookings.length).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Yakunlangan buyurtmalar</span>
              <p className="text-xl md:text-2xl font-black text-on-surface tnum">
                {isLoading ? "..." : (stats?.completedOrders ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("verifications")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "verifications"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Verifikatsiya arizalari</span>
            {pendingVerifications.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold">
                {pendingVerifications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "bookings"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Barcha buyurtmalar ({allBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("providers")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "providers"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ustalar katalogi ({allProviders.length})</span>
          </button>
        </div>

        {/* Tab 1: Verification Queue */}
        {activeTab === "verifications" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <h2 className="text-base font-bold text-on-surface">
              Ustalarni tasdiqlash arizalari ({pendingVerifications.length} ta kutilmoqda)
            </h2>

            {isLoading ? (
              <div className="h-32 bg-surface-container-low rounded-xl animate-pulse" />
            ) : verifications.length === 0 ? (
              <div className="py-10 text-center text-on-surface-variant text-xs">
                Hozircha verifikatsiya uchun yangi arizalar mavjud emas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-on-surface-variant bg-surface-container-low">
                      <th className="p-3 font-bold">Mutaxassis</th>
                      <th className="p-3 font-bold">Xizmat toifasi</th>
                      <th className="p-3 font-bold">Hujjat ma’lumoti</th>
                      <th className="p-3 font-bold">Sana</th>
                      <th className="p-3 font-bold">Holat</th>
                      <th className="p-3 font-bold text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr
                        key={v.id}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                      >
                        <td className="p-3 font-bold text-on-surface">{v.providerName}</td>
                        <td className="p-3">{v.categoryName}</td>
                        <td className="p-3 font-mono">{v.passportSerial || "Yuklangan"}</td>
                        <td className="p-3 text-on-surface-variant">
                          {v.submittedAt ? new Date(v.submittedAt).toLocaleDateString() : "Bugun"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.status === "APPROVED"
                                ? "bg-primary/10 text-primary"
                                : v.status === "REJECTED"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {v.status === "APPROVED"
                              ? "Tasdiqlangan"
                              : v.status === "REJECTED"
                              ? "Rad etilgan"
                              : "Kutilmoqda"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {v.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                disabled={actionLoadingId === v.id}
                                onClick={() => handleApprove(v.id)}
                                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Tasdiqlash
                              </button>
                              <button
                                type="button"
                                disabled={actionLoadingId === v.id}
                                onClick={() => handleReject(v.id)}
                                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
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
            )}
          </div>
        )}

        {/* Tab 2: All Bookings Monitor */}
        {activeTab === "bookings" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <h2 className="text-base font-bold text-on-surface">Barcha buyurtmalar monitoringi</h2>

            {allBookings.length === 0 ? (
              <div className="py-10 text-center text-on-surface-variant text-xs">
                Tizimda buyurtmalar mavjud emas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-on-surface-variant bg-surface-container-low">
                      <th className="p-3 font-bold">Raqami</th>
                      <th className="p-3 font-bold">Xizmat</th>
                      <th className="p-3 font-bold">Mijoz</th>
                      <th className="p-3 font-bold">Usta</th>
                      <th className="p-3 font-bold">Summa</th>
                      <th className="p-3 font-bold">Holati</th>
                      <th className="p-3 font-bold text-right">Batafsil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                      >
                        <td className="p-3 font-bold text-primary">#{b.orderNumber}</td>
                        <td className="p-3 font-semibold text-on-surface">{b.serviceName}</td>
                        <td className="p-3">{b.customerName}</td>
                        <td className="p-3">{b.provider?.name || "Biriktirilgan"}</td>
                        <td className="p-3 font-bold tnum">
                          {Number(b.totalPrice || 0).toLocaleString()} so‘m
                        </td>
                        <td className="p-3">
                          <StatusBadge status={b.status} text={b.statusText} />
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/buyurtmalar/${b.orderNumber || b.id}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                          >
                            <span>Ko‘rish</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Providers Monitor */}
        {activeTab === "providers" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <h2 className="text-base font-bold text-on-surface">Ro‘yxatdan o‘tgan ustalar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProviders.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-on-surface">{p.name}</h4>
                      {p.verified && (
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                          Tasdiqlangan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{p.title}</p>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-2">
                      <div className="flex items-center gap-1 font-bold text-secondary">
                        <Star className="w-3.5 h-3.5 fill-secondary-container" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <span>{p.district || p.city || "Toshkent"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-on-surface-variant">
                      {p.completedJobsCount} ta ish
                    </span>
                    <Link
                      href={`/ustalar/${p.slug || p.id}`}
                      className="text-primary font-bold hover:underline"
                    >
                      Profilni ochish →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {adminNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {adminNotice}
          </div>
          <button
            type="button"
            onClick={() => setAdminNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
