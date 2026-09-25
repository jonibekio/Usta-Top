"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight, PackageX, PlusCircle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { getBookings } from "@/lib/api/bookings";
import { Booking } from "@/types";

export default function OrdersListPage() {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch bookings", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = bookings.filter(
    (b) => b.status === "IN_TRANSIT" || b.status === "IN_PROGRESS" || b.status === "CREATED"
  ).length;

  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ACTIVE") return b.status === "IN_TRANSIT" || b.status === "IN_PROGRESS" || b.status === "CREATED";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Mening buyurtmalarim
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Buyurtmalar tarixi va holati
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "ALL" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Barchasi ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("ACTIVE")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "ACTIVE" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Jarayonda ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("COMPLETED")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "COMPLETED" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Yakunlangan ({completedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-28 bg-surface-container-low animate-pulse rounded-2xl border border-outline-variant/30"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl text-center border border-outline-variant/30 flex flex-col items-center justify-center gap-4 my-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">Buyurtmalar topilmadi</h3>
            <p className="text-sm text-on-surface-variant max-w-md">
              Ushbu bo‘limda hozircha buyurtmalar yo‘q. Yangi usta chaqirish orqali buyurtma yarating.
            </p>
            <Link
              href="/ustalar"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl shadow hover:bg-primary-hover transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Usta topish</span>
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const avatarSrc =
              booking.provider?.avatar &&
              (booking.provider.avatar.startsWith("http") || booking.provider.avatar.startsWith("/"))
                ? booking.provider.avatar
                : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150";

            return (
              <Link
                key={booking.id}
                href={`/buyurtmalar/${booking.orderNumber || booking.id}`}
                className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-surface-container shrink-0">
                    <Image
                      src={avatarSrc}
                      alt={booking.provider?.name || "Usta"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase">
                        #{booking.orderNumber}
                      </span>
                      <StatusBadge status={booking.status} text={booking.statusText} />
                    </div>
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {booking.serviceName}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Usta: <strong className="text-on-surface">{booking.provider?.name || "Tayinlanmoqda"}</strong> • {booking.destinationAddress}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {booking.scheduledTime}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-primary tnum">
                        {Number(booking.totalPrice).toLocaleString()} so‘m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 self-end md:self-center">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Kuzatish / Ko‘rish
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
