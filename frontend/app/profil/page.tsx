"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function CustomerProfilePage() {
  const { user, logout } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "+998 90 987-65-43");
  const [name, setName] = useState(user?.name || "Sardor Alimov");
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-10 flex flex-col gap-8">
        {/* User Card */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary-fixed bg-surface-container">
              {user?.avatar && (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-tertiary-container ring-2 ring-surface" />
          </div>

          <div className="flex-1 text-center sm:text-left flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-on-surface">{user?.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase">
                Mijoz
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Toshkent sh., Chilonzor tumani</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <Link
                href="/buyurtmalar"
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
              >
                Buyurtmalarim (2)
              </Link>
              <Link
                href="/xabarlar"
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
              >
                Xabarlar (1)
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-on-surface">Shaxsiy ma‘lumotlar</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">To‘liq ism-familiya:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 px-4 rounded-xl bg-surface-container text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Telefon raqam:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 px-4 rounded-xl bg-surface-container text-sm font-medium outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Saqlangan asosiy manzil:</label>
            <input
              type="text"
              defaultValue="Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy, 28-xonadon"
              className="h-11 px-4 rounded-xl bg-surface-container text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => logout()}
              className="h-11 px-4 text-error hover:bg-error-container/20 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
            <button
              type="button"
              onClick={() => setProfileNotice("Profil ma'lumotlari muvaffaqiyatli yangilandi!")}
              className="h-11 px-6 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </div>

        {profileNotice && (
          <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm text-xs font-bold text-primary flex items-center justify-between">
            <span>{profileNotice}</span>
            <button
              type="button"
              onClick={() => setProfileNotice(null)}
              className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5 text-base"
            >
              ×
            </button>
          </div>
        )}

        {/* Trust & Guarantee status */}
        <div className="bg-tertiary-fixed/30 p-5 rounded-2xl border border-tertiary-fixed flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-tertiary-container shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-on-surface">Hisobingiz himoyalangan</h4>
              <p className="text-xs text-on-surface-variant">Telefon raqami SMS orqali tasdiqlangan.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary text-xs font-bold">
            Faol
          </span>
        </div>
      </div>
    </div>
  );
}
