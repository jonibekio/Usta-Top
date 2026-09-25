"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Receipt, MessageSquare, User, LayoutDashboard, Briefcase, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  // If in provider mode, show provider navigation
  if (role === "PROVIDER") {
    const providerTabs = [
      { href: "/provider/dashboard", label: "Boshqaruv", icon: LayoutDashboard },
      { href: "/provider/requests", label: "So‘rovlar", icon: Search },
      { href: "/provider/jobs", label: "Ishlar", icon: Briefcase },
      { href: "/provider/calendar", label: "Taqvim", icon: Calendar },
      { href: "/provider/profile", label: "Profil", icon: User },
    ];

    return (
      <nav aria-label="Usta mobil navigatsiyasi" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-outline-variant/30 py-2 px-3 flex items-center justify-around shadow-lg">
        {providerTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
                isActive ? "text-secondary font-bold" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Customer Mobile Tabs
  const customerTabs = [
    { href: "/", label: "Asosiy", icon: Home },
    { href: "/qidiruv", label: "Qidiruv", icon: Search },
    { href: "/buyurtmalar", label: "Buyurtmalar", icon: Receipt },
    { href: "/xabarlar", label: "Xabarlar", icon: MessageSquare },
    { href: "/profil", label: "Profil", icon: User },
  ];

  return (
    <nav aria-label="Mijoz mobil navigatsiyasi" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-outline-variant/30 py-2 px-3 flex items-center justify-around shadow-lg">
      {customerTabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
