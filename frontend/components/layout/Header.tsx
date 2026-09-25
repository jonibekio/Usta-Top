"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, ChevronDown, Plus, MessageSquare, Receipt, Menu, X } from "lucide-react";
import UstaTopLogo from "../ui/UstaTopLogo";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/xizmatlar", label: "Xizmatlar" },
    { href: "/ustalar", label: "Ustalar" },
    { href: "/#qanday-ishlaydi", label: "Qanday ishlaydi" },
    { href: "/#kafolat", label: "Kafolat va Xavfsizlik" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,23,42,0.06)]">
      <div className="h-20 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Left: Logo & Location Pill */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="shrink-0 flex items-center">
            <UstaTopLogo />
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors text-on-surface">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-xs md:text-sm font-semibold truncate max-w-[140px] md:max-w-[190px]">
              Toshkent, Chilonzor
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 p-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Chat, Orders, Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/qidiruv"
            className="hidden sm:inline-flex items-center justify-center h-11 px-4 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-lg shadow-[0_2px_6px_rgba(0,40,142,0.2)] active:scale-[0.99] transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Buyurtma berish
          </Link>

          <Link
            href="/xabarlar"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center"
            title="Xabarlar"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-surface"></span>
          </Link>

          <Link
            href="/buyurtmalar"
            className="hidden md:flex items-center gap-1.5 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-sm font-medium"
          >
            <Receipt className="w-5 h-5" />
            <span>Buyurtmalarim</span>
          </Link>

          {/* User Profile Pill */}
          <Link
            href="/profil"
            className="flex items-center gap-2.5 pl-2 border-l border-outline-variant/30 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-fixed bg-surface-container">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary font-bold text-xs">
                    {user?.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-container ring-1 ring-surface"></span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-bold text-on-surface leading-tight truncate max-w-[120px]">
                {user?.name || "Mijoz"}
              </span>
              <span className="text-[11px] text-secondary font-semibold uppercase tracking-wider">
                {user?.role === "PROVIDER" ? "Usta" : user?.role === "ADMIN" ? "Admin" : "Mijoz"}
              </span>
            </div>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-4 shadow-lg flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            <Link
              href="/qidiruv"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 bg-primary text-on-primary font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Buyurtma berish
            </Link>
            <Link
              href="/buyurtmalar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Buyurtmalarim
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
