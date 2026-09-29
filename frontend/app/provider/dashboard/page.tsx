"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  MessageSquare,
  Briefcase,
  Calendar,
  Wrench,
  CheckCircle,
  Loader2,
  ChevronRight,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import {
  getProviderMe,
  getProviderDashboardStats,
  toggleProviderOnline,
} from "@/lib/api/providers";
import { getBookings } from "@/lib/api/bookings";
import { getServiceRequests } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/AuthContext";
import { Provider, Booking, ServiceRequest } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      router.push("/auth/login?redirect=/provider/dashboard");
      return;
    }

    if (user && user.role !== "PROVIDER" && user.role !== "ADMIN") {
      router.push("/profil");
      return;
    }

    Promise.all([
      getProviderMe(),
      getProviderDashboardStats(),
      getBookings(),
      getServiceRequests(),
    ])
      .then(([p, st, bList, rList]) => {
        if (p) {
          setProvider(p);
          setIsOnline(p.isOnline ?? true);
        }
        if (st) {
          setStats(st);
          setIsOnline(st.isOnline ?? true);
        }
        setActiveBookings(
          (bList || []).filter(
            (b) => b.status === "IN_TRANSIT" || b.status === "IN_PROGRESS" || b.status === "CONFIRMED"
          )
        );
        setRecentRequests((rList || []).slice(0, 5));
      })
      .catch((err) => {
        console.error("Provider dashboard error:", err);
      })
      .finally(() => setIsLoading(false));
  }, [user, isAuthenticated, isAuthLoading, router]);

  const handleToggleOnline = async () => {
    try {
      const nextStatus = await toggleProviderOnline();
      setIsOnline(nextStatus);
      setNotice(`Holatingiz ${nextStatus ? "onlayn" : "oflayn"} rejimiga o‘tkazildi.`);
    } catch {
      setNotice("Holatni o‘zgartirishda xatolik yuz berdi.");
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = provider?.name || user?.name || "Mutaxassis";

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {notice && (
          <div className="p-3.5 rounded-xl bg-primary-fixed/20 border border-primary/20 text-on-surface text-xs font-semibold flex items-center justify-between">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-primary font-bold">✕</button>
          </div>
        )}

        {/* Top Profile Strip */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary text-xl shrink-0">
              {provider?.avatar || user?.avatar ? (
                <Image
                  src={provider?.avatar || user?.avatar || ""}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayName.charAt(0)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-on-surface">{displayName}</h1>
                {provider?.verified && (
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                    Tasdiqlangan
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {provider?.title || "Usta"} • {provider?.district || "Toshkent"}
              </p>
            </div>
          </div>

          {/* Online Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isOnline
                  ? "bg-tertiary-container text-on-tertiary shadow-sm"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-outline"}`} />
              <span>{isOnline ? "Onlayn (Buyurtmalarga tayyor)" : "Oflayn (Dam olishda)"}</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant block">Jami daromad</span>
            <p className="text-xl md:text-2xl font-black text-on-surface mt-1 tnum">
              {(stats?.weeklyEarnings || 0).toLocaleString()} so‘m
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant block">Bajarilgan ishlar</span>
            <p className="text-xl md:text-2xl font-black text-on-surface mt-1 tnum">
              {stats?.completedJobs || provider?.completedJobsCount || 0} ta
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant block">Faol buyurtmalar</span>
            <p className="text-xl md:text-2xl font-black text-on-surface mt-1 tnum">
              {stats?.activeJobsCount ?? activeBookings.length} ta
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant block">O‘rtacha reyting</span>
            <p className="text-xl md:text-2xl font-black text-on-surface mt-1 flex items-center gap-1.5">
              <Star className="w-5 h-5 text-secondary-container fill-secondary-container" />
              <span>{(stats?.rating || provider?.rating || 5.0).toFixed(1)}</span>
            </p>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/20 pb-2">
          <Link
            href="/provider/dashboard"
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm"
          >
            Umumiy holat
          </Link>
          <Link
            href="/provider/requests"
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold"
          >
            Yangi so‘rovlar ({recentRequests.length})
          </Link>
          <Link
            href="/provider/jobs"
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold"
          >
            Mening ishlarim ({activeBookings.length})
          </Link>
          <Link
            href="/provider/profile"
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold"
          >
            Profilni tahrirlash
          </Link>
        </div>

        {/* Active Jobs */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Jarayondagi ishlar</h2>
            <Link href="/provider/jobs" className="text-xs font-semibold text-primary hover:underline">
              Barchasini ko‘rish
            </Link>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 text-center text-xs text-on-surface-variant">
              Hozircha faol buyurtmalar yo‘q. Yangi so‘rovlarga narx taklifini yuboring.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{b.orderNumber}</span>
                      <h3 className="text-sm font-bold text-on-surface">{b.serviceName}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Mijoz: {b.customerName} ({b.customerPhone}) • {b.destinationAddress}
                    </p>
                  </div>

                  <Link
                    href={`/buyurtmalar/${b.orderNumber.replace("#", "") || b.id}`}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs rounded-xl shrink-0 text-center"
                  >
                    Batafsil
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Requests */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Kelib tushgan yangi arizalar</h2>
            <Link href="/provider/requests" className="text-xs font-semibold text-primary hover:underline">
              Barcha so‘rovlar ({recentRequests.length})
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 text-center text-xs text-on-surface-variant">
              Hozircha yangi so‘rovlar mavjud emas.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">#{req.code}</span>
                      <h3 className="text-sm font-bold text-on-surface">{req.categoryName}</h3>
                      <span className="text-xs text-secondary font-bold">{req.urgencyText}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                      {req.problemDescription}
                    </p>
                  </div>

                  <Link
                    href="/provider/requests"
                    className="px-4 py-2 border border-outline-variant/50 hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl shrink-0 text-center"
                  >
                    Smeta taklif qilish
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
