"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Check,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { Booking, BookingStatus } from "@/types";
import { getBookings, updateBookingStatus, cancelBooking } from "@/lib/api/bookings";
import { startConversation } from "@/lib/api/conversations";
import { useRouter } from "next/navigation";

export default function ProviderJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "ACTIVE" | "COMPLETED">("ALL");

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getBookings();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load provider jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleAdvanceStatus = async (jobId: string, currentStatus: BookingStatus) => {
    let nextStatus: BookingStatus = "CONFIRMED";
    let nextText = "Tasdiqlandi";

    if (currentStatus === "CREATED") {
      nextStatus = "CONFIRMED";
      nextText = "Buyurtma tasdiqlandi";
    } else if (currentStatus === "CONFIRMED") {
      nextStatus = "IN_TRANSIT";
      nextText = "Yo‘lga chiqildi";
    } else if (currentStatus === "IN_TRANSIT") {
      nextStatus = "IN_PROGRESS";
      nextText = "Ish boshlandi";
    } else if (currentStatus === "IN_PROGRESS") {
      nextStatus = "COMPLETED";
      nextText = "Yakunlandi";
    }

    try {
      setUpdatingId(jobId);
      await updateBookingStatus(jobId, nextStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus, statusText: nextText } : j))
      );
      setStatusNotice(`Holat muvaffaqiyatli yangilandi: ${nextText}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      setStatusNotice("Holatni yangilashda xatolik yuz berdi");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeclineBooking = async (jobId: string) => {
    if (!window.confirm("Ushbu buyurtmani rad etishga ishonchingiz komilmi?")) return;

    try {
      setUpdatingId(jobId);
      await cancelBooking(jobId, "Usta tomonidan rad etildi");
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "CANCELLED", statusText: "Bekor qilindi" } : j
        )
      );
      setStatusNotice("Buyurtma bekor qilindi.");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setStatusNotice("Bekor qilishda xatolik yuz berdi");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenChat = async (customerId?: string) => {
    router.push("/xabarlar");
  };

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === "NEW") return j.status === "CREATED";
    if (activeTab === "ACTIVE")
      return j.status === "CONFIRMED" || j.status === "IN_TRANSIT" || j.status === "IN_PROGRESS";
    if (activeTab === "COMPLETED") return j.status === "COMPLETED";
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Usta ish stoli
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Buyurtmalar va ishlarim
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/provider/dashboard"
              className="text-xs font-bold text-on-surface bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-xl transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/provider/requests"
              className="text-xs font-bold text-primary bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-xl transition-colors"
            >
              Ochiq arizalar →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {statusNotice && (
          <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary flex items-center justify-between">
            <span>{statusNotice}</span>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              className="text-on-surface-variant hover:text-on-surface cursor-pointer text-base"
            >
              ×
            </button>
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "ALL"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Barchasi ({jobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("NEW")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "NEW"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>Yangi buyurtmalar</span>
            {jobs.filter((j) => j.status === "CREATED").length > 0 && (
              <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold">
                {jobs.filter((j) => j.status === "CREATED").length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "ACTIVE"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Faol jarayonda
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "COMPLETED"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Yakunlangan
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-surface-container-low animate-pulse border border-outline-variant/30"
              />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title="Ushbu toifada buyurtmalar mavjud emas"
            description="Mijozlar buyurtmalari bilan ishlash uchun 'Ochiq arizalar' bo‘limidan ham taklif yuborishingiz mumkin."
            actionLabel="Ochiq arizalarni ko‘rish"
            actionHref="/provider/requests"
          />
        ) : (
          filteredJobs.map((job) => {
            const isUpdating = updatingId === job.id;

            return (
              <div
                key={job.id}
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-primary">#{job.orderNumber}</span>
                    <StatusBadge status={job.status} text={job.statusText} />
                    <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span>{job.scheduledTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface">{job.serviceName}</h3>

                  <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                    <p>
                      Mijoz: <strong className="text-on-surface">{job.customerName}</strong>
                      {job.customerPhone ? ` (${job.customerPhone})` : ""}
                    </p>
                    {job.destinationAddress && (
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{job.destinationAddress}</span>
                      </p>
                    )}
                    {job.problemDescription && (
                      <p className="italic bg-surface-container-low p-2 rounded-lg text-on-surface mt-1">
                        &ldquo;{job.problemDescription}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-primary font-bold mt-1">
                    To‘lov: {Number(job.totalPrice || 0).toLocaleString()} so‘m
                  </div>
                </div>

                {/* Status Advancement & Action buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 shrink-0">
                  {/* For CREATED direct bookings: Accept / Decline */}
                  {job.status === "CREATED" && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleAdvanceStatus(job.id, "CREATED")}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? "Yuklanmoqda..." : "Qabul qilish"}
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleDeclineBooking(job.id)}
                        className="px-3 py-2 border border-error/40 text-error hover:bg-error/10 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Rad etish
                      </button>
                    </div>
                  )}

                  {/* For CONFIRMED -> Advance to IN_TRANSIT */}
                  {job.status === "CONFIRMED" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleAdvanceStatus(job.id, "CONFIRMED")}
                      className="w-full px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUpdating ? "Yuklanmoqda..." : "Yo‘lga chiqish →"}
                    </button>
                  )}

                  {/* For IN_TRANSIT -> Advance to IN_PROGRESS */}
                  {job.status === "IN_TRANSIT" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleAdvanceStatus(job.id, "IN_TRANSIT")}
                      className="w-full px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUpdating ? "Yuklanmoqda..." : "Ishni boshlash"}
                    </button>
                  )}

                  {/* For IN_PROGRESS -> Advance to COMPLETED */}
                  {job.status === "IN_PROGRESS" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleAdvanceStatus(job.id, "IN_PROGRESS")}
                      className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUpdating ? "Yuklanmoqda..." : "Ishni yakunlash ✓"}
                    </button>
                  )}

                  {/* Common Chat button */}
                  <button
                    type="button"
                    onClick={() => handleOpenChat(job.customerId)}
                    className="w-full px-4 py-2 border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>Mijoz bilan chat</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
