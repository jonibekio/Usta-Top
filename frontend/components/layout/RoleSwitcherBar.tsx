"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import { UserCheck, ShieldCheck, Briefcase, ChevronUp, ChevronDown } from "lucide-react";

export default function RoleSwitcherBar() {
  const { role, switchRole, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Demo role switcher"
      className="fixed bottom-3 right-3 z-50 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-2xl border border-outline-variant/30 text-xs transition-all duration-200"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-outline/30 bg-surface-container-high/10 rounded-t-xl gap-2">
        <span className="font-bold tracking-wider text-[11px] text-on-primary-container uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
          Rollarni almashtirish (Demo)
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-inverse-on-surface/70 hover:text-inverse-on-surface cursor-pointer p-0.5"
          title={collapsed ? "Kengaytirish" : "Yashirish"}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Rollarni almashtirish panelini ochish" : "Rollarni almashtirish panelini yashirish"}
        >
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-2.5 flex flex-col gap-2">
          <div className="text-[11px] text-inverse-on-surface/70">
            Faol foydalanuvchi: <span className="font-bold text-inverse-on-surface">{user?.name}</span> ({role})
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => switchRole("CUSTOMER")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                role === "CUSTOMER"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-high/20 hover:bg-surface-container-high/40 text-inverse-on-surface"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Mijoz
            </button>

            <button
              onClick={() => switchRole("PROVIDER")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                role === "PROVIDER"
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "bg-surface-container-high/20 hover:bg-surface-container-high/40 text-inverse-on-surface"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Usta
            </button>

            <button
              onClick={() => switchRole("ADMIN")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                role === "ADMIN"
                  ? "bg-tertiary-container text-on-tertiary shadow-sm"
                  : "bg-surface-container-high/20 hover:bg-surface-container-high/40 text-inverse-on-surface"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>

          <div className="pt-1.5 border-t border-outline/20 flex items-center justify-between text-[11px]">
            {role === "CUSTOMER" && (
              <Link href="/" className="text-primary-fixed-dim hover:underline font-medium">
                → Mijoz bosh sahifasi
              </Link>
            )}
            {role === "PROVIDER" && (
              <Link href="/provider/dashboard" className="text-secondary-fixed hover:underline font-medium">
                → Usta kabinetiga o‘tish
              </Link>
            )}
            {role === "ADMIN" && (
              <Link href="/admin/dashboard" className="text-tertiary-fixed hover:underline font-medium">
                → Admin paneliga o‘tish
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
