"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Plus,
  MessageSquare,
  Receipt,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import UstaTopLogo from "../ui/UstaTopLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLocation } from "@/lib/location/LocationContext";
import NotificationPopover from "@/components/notifications/NotificationPopover";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { location, openLocationModal } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/xizmatlar", label: "Xizmatlar" },
    { href: "/ustalar", label: "Ustalar" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30">
      <div className="h-18 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="shrink-0 flex items-center">
            <UstaTopLogo />
          </Link>

          <button
            type="button"
            onClick={openLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-outline-variant/30"
            title="Hududni o‘zgartirish"
          >
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="max-w-[130px] truncate">
              {location.district && location.district !== "Barcha tumanlar"
                ? location.district
                : location.region}
            </span>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated && user?.role === "PROVIDER" && (
            <Link
              href="/provider/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith("/provider")
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              Usta kabineti
            </Link>
          )}

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-tertiary-container text-on-tertiary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              Admin paneli
            </Link>
          )}
        </nav>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          <Link
            href="/qidiruv"
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Buyurtma berish
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationPopover />

              <Link
                href="/xabarlar"
                className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                title="Xabarlar"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {user?.role === "CUSTOMER" && (
                <Link
                  href="/buyurtmalar"
                  className="hidden md:flex items-center gap-1.5 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-sm font-medium"
                >
                  <Receipt className="w-5 h-5" />
                  <span>Buyurtmalar</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50 text-sm"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="font-bold text-on-surface truncate">{user?.name || user?.phone}</p>
                      <p className="text-xs text-on-surface-variant capitalize">
                        {user?.role === "PROVIDER" ? "Usta" : user?.role === "ADMIN" ? "Admin" : "Mijoz"}
                      </p>
                    </div>

                    <Link
                      href="/profil"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-on-surface-variant" />
                      Profil sozlamalari
                    </Link>

                    {user?.role === "PROVIDER" && (
                      <Link
                        href="/provider/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-secondary" />
                        Usta kabineti
                      </Link>
                    )}

                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Admin boshqaruvi
                      </Link>
                    )}

                    <div className="border-t border-outline-variant/20 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-error hover:bg-error-container/20 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/register?role=PROVIDER"
                className="hidden lg:inline-flex text-xs font-semibold text-on-surface-variant hover:text-primary px-3 py-2"
              >
                Usta bo‘lib ishlash
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center h-9 px-4 border border-outline-variant/50 hover:bg-surface-container text-on-surface font-semibold text-sm rounded-lg transition-colors"
              >
                Kirish
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {user?.role === "PROVIDER" && (
                <Link
                  href="/provider/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container"
                >
                  Usta kabineti
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container"
                >
                  Admin paneli
                </Link>
              )}
              <Link
                href="/buyurtmalar"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                Buyurtmalarim
              </Link>
              <Link
                href="/xabarlar"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                Xabarlar
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                Profil
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error-container/20 text-left"
              >
                Chiqish
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 border border-outline-variant/50 text-on-surface font-semibold text-sm rounded-lg flex items-center justify-center"
              >
                Kirish
              </Link>
              <Link
                href="/auth/register?role=PROVIDER"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 bg-surface-container text-on-surface font-semibold text-sm rounded-lg flex items-center justify-center"
              >
                Usta bo‘lib ishlash
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
