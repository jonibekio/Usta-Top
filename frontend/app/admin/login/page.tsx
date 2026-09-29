"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Phone, AlertCircle, Loader2 } from "lucide-react";
import UstaTopLogo from "@/components/ui/UstaTopLogo";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as ADMIN, redirect to dashboard immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, user, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const digits = phone.replace(/\D/g, "");
      const cleanPhone = digits.startsWith("998") ? `+${digits}` : `+998${digits}`;

      const loggedUser = await login(cleanPhone, password);

      if (!loggedUser || loggedUser.role !== "ADMIN") {
        setErrorMsg("Ruxsat berilmadi. Ushbu portal faqat tizim administratorlari uchun.");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message || "Telefon raqami yoki parol noto‘g‘ri kiritildi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-12 bg-surface">
      <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/30 max-w-md w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex items-center gap-1.5">
            <UstaTopLogo className="h-7 w-auto" />
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-on-primary">
              Admin
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-on-surface tracking-tight mt-1">
            Boshqaruv Tizimi
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs">
            Ushbu xavfsiz sahifa faqat platforma ma’murlari uchun mo‘ljallangan.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              Admin telefon raqami
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-on-surface-variant select-none">
                +998
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="90 000 00 00"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-15 pr-4 py-2.5 text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              Xavfsizlik paroli
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>Admin panelga kirish</span>
          </button>
        </form>
      </div>
    </div>
  );
}
