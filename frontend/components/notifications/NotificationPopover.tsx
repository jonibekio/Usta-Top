"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, Clock, ExternalLink } from "lucide-react";
import {
  NotificationItem,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/api/notifications";

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnread = async () => {
    const count = await getUnreadNotificationCount();
    setUnreadCount(count);
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkItemRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        title="Bildirishnomalar"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-on-primary text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">Bildirishnomalar</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  {unreadCount} yangi
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                Hammasini o‘qilgan qilish
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-on-surface-variant">Yuklanmoqda...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-on-surface-variant">
                Yangi bildirishnomalar yo‘q
              </div>
            ) : (
              notifications.map((n) => {
                const bookingId = n.data?.booking_id || n.data?.order_number;
                const linkHref = bookingId ? `/buyurtmalar` : "/xabarlar";

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 flex flex-col gap-1 transition-colors ${
                      !n.isRead ? "bg-primary/5" : "hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface leading-tight">
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkItemRead(n.id)}
                          className="text-[10px] text-primary hover:underline shrink-0 flex items-center gap-0.5"
                          title="O‘qildi deb belgilash"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.body}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-outline">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Link
                        href={linkHref}
                        onClick={() => {
                          handleMarkItemRead(n.id);
                          setIsOpen(false);
                        }}
                        className="text-primary font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <span>Ko‘rish</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
