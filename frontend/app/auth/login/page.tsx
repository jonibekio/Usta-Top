"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, UserCheck, Briefcase } from "lucide-react";
import UstaTopLogo from "@/components/ui/UstaTopLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/types";

const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "Telefon raqami kamida 9 ta raqamdan iborat bo‘lishi kerak")
    .max(12, "Telefon raqami noto‘g‘ri kiritildi"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi shart"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "901234567",
      password: "password123",
    },
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const cleanPhone = data.phone.startsWith("+998") ? data.phone : `+998${data.phone.replace(/^998/, "")}`;
      await login(cleanPhone, data.password, selectedRole);
      if (selectedRole === "PROVIDER") {
        router.push("/provider/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setLoginError(err?.message || "Telefon raqami yoki parol noto‘g‘ri kiritildi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-12 bg-surface">
      <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/30 max-w-md w-full flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <UstaTopLogo className="h-10 w-auto" />
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight mt-2">
            Tizimga kirish
          </h1>
          <p className="text-xs text-on-surface-variant">
            Usta Top hisobingizga kiring va xizmatlardan foydalaning
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedRole("CUSTOMER")}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === "CUSTOMER"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Mijoz</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("PROVIDER")}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === "PROVIDER"
                ? "bg-secondary-container text-on-secondary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Usta</span>
          </button>
        </div>

        {loginError && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Phone Input with +998 Prefix divider */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Telefon raqam:</label>
            <div className="h-12 bg-surface rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center overflow-hidden">
              <div className="px-3.5 bg-surface-container flex items-center gap-1 text-sm font-bold text-on-surface font-mono border-r border-outline-variant/40">
                <span>+998</span>
              </div>
              <input
                type="tel"
                placeholder="90 123 45 67"
                {...register("phone")}
                className="flex-1 px-3.5 text-sm font-mono outline-none bg-transparent"
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-error font-medium">{errors.phone.message}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Parol:</label>
            <div className="h-12 bg-surface rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center px-3.5 gap-2">
              <Lock className="w-4 h-4 text-outline shrink-0" />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-error font-medium">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Hisobingiz yo‘qmi?{" "}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </div>
    </div>
  );
}
