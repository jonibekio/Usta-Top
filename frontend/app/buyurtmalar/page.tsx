"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  ChevronRight,
  PackageX,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Wrench,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { getBookings } from "@/lib/api/bookings";
import { getServiceRequests } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/AuthContext";
import { Booking, ServiceRequest } from "@/types";

function OrdersListPageContent() {
  const searchParams = useSearchParams();
  const createdNotice = searchParams.get("created");
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookings(), getServiceRequests()])
      .then(([bList, rList]) => {
        setBookings(Array.isArray(bList) ? bList : []);
        setRequests(Array.isArray(rList) ? rList : []);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeBookings = bookings.filter(
    (b) => b.status === "IN_TRANSIT" || b.status === "IN_PROGRESS" || b.status === "CREATED" || b.status === "CONFIRMED"
  );
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ACTIVE") {
      return b.status === "IN_TRANSIT" || b.status === "IN_PROGRESS" || b.status === "CREATED" || b.status === "CONFIRMED";
    }
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {createdNotice && (
          <div className="p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-between gap-3 text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-tertiary-container shrink-0" />
              <span>Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada ustalardan narx takliflari keladi.</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              Mening buyurtmalarim
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              Faol va yakunlangan xizmatlar ro‘yxati
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Barchasi ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("ACTIVE")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "ACTIVE"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Jarayonda ({activeBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("COMPLETED")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "COMPLETED"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Yakunlangan ({completedBookings.length})
            </button>
          </div>
        </div>

        {/* Open Requests section (waiting for quotes) */}
        {requests.length > 0 && filter !== "COMPLETED" && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Taklif kutilayotgan so‘rovlar ({requests.length})
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">#{req.code}</span>
                        <h3 className="text-sm font-bold text-on-surface">{req.categoryName}</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                        {req.problemDescription}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-on-surface-variant/70 mt-2">
                        <span>{req.location?.district} tumani</span>
                        <span>•</span>
                        <span>{req.urgencyText || "Bugun"}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/buyurtmalar/${req.code || req.id}`}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Takliflarni ko‘rish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {isLoading ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length === 0 && requests.length === 0 ? (
          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-3 my-4">
            <PackageX className="w-12 h-12 text-on-surface-variant/40" />
            <h3 className="text-base font-bold text-on-surface">Buyurtmalar yo‘q</h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Sizda hozircha hech qanday buyurtma mavjud emas. Kerakli xizmat bo‘yicha usta chaqirishingiz mumkin.
            </p>
            <Link
              href="/qidiruv"
              className="mt-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi buyurtma berish</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.length > 0 && (
              <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Tasdiqlangan buyurtmalar
              </h2>
            )}
            {filteredBookings.map((b) => (
              <Link
                key={b.id}
                href={`/buyurtmalar/${b.orderNumber.replace("#", "") || b.id}`}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-secondary">{b.orderNumber}</span>
                      <h3 className="text-sm font-bold text-on-surface">{b.serviceName}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Usta: <strong className="text-on-surface">{b.provider?.name}</strong> • {b.destinationAddress}
                    </p>
                    <p className="text-xs font-bold text-primary tnum mt-1">
                      {b.totalPrice.toLocaleString()} so‘m
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 self-end sm:self-center">
                  <span>Kuzatish</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersListPage() {
  return (
    <React.Suspense fallback={<div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4" />}>
      <OrdersListPageContent />
    </React.Suspense>
  );
}
