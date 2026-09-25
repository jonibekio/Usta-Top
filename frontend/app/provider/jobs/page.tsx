"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Check } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { MOCK_BOOKINGS } from "@/lib/mock-data/bookings";
import { BookingStatus } from "@/types";
import { updateBookingStatus } from "@/lib/api/bookings";

export default function ProviderJobsPage() {
  const [jobs, setJobs] = useState(MOCK_BOOKINGS);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleAdvanceStatus = (jobId: string, currentStatus: BookingStatus) => {
    let nextStatus: BookingStatus = "IN_PROGRESS";
    let nextText = "Ish boshlandi";
    if (currentStatus === "IN_TRANSIT") {
      nextStatus = "IN_PROGRESS";
      nextText = "Ish boshlandi";
    } else if (currentStatus === "IN_PROGRESS") {
      nextStatus = "COMPLETED";
      nextText = "Yakunlandi";
    }

    updateBookingStatus(jobId, nextStatus).catch(console.warn);

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus, statusText: nextText } : j))
    );
    setStatusNotice(`Holat muvaffaqiyatli o‘zgartirildi: ${nextText}`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-secondary font-bold">
            Ish jarayoni
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Mening buyurtmalarim va ishlarim
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">#{job.orderNumber}</span>
                <StatusBadge status={job.status} text={job.statusText} />
                <span className="text-xs text-on-surface-variant font-medium">
                  {job.scheduledTime}
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">{job.serviceName}</h3>
              <p className="text-xs text-on-surface-variant">
                Mijoz: <strong className="text-on-surface">{job.customerName}</strong> • {job.destinationAddress}
              </p>
              <div className="flex items-center gap-3 text-xs text-primary font-bold mt-1">
                <span>Kelishilgan summa: {job.totalPrice.toLocaleString()} so‘m</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              {job.status === "IN_TRANSIT" && (
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus(job.id, "IN_TRANSIT")}
                  className="w-full sm:w-auto h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm cursor-pointer"
                >
                  Manzilga yetib bordim
                </button>
              )}
              {job.status === "IN_PROGRESS" && (
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus(job.id, "IN_PROGRESS")}
                  className="w-full sm:w-auto h-10 px-5 rounded-xl bg-tertiary-container hover:bg-tertiary text-on-tertiary text-xs font-bold shadow-sm cursor-pointer"
                >
                  Ishni yakunlash & To‘lov olish
                </button>
              )}
              {job.status === "COMPLETED" && (
                <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[3]" /> Xizmat ko‘rsatildi
                </span>
              )}

              <Link
                href="/xabarlar"
                className="w-full sm:w-auto h-10 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Chat</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {statusNotice && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-surface-container-lowest border border-outline-variant/40 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[3]" />
          <div className="flex-1 text-xs text-on-surface font-medium leading-relaxed">
            {statusNotice}
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
          >
            <span className="text-base font-bold">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
