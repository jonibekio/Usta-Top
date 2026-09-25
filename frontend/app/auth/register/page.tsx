"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, User, UserCheck, Briefcase, CheckCircle2 } from "lucide-react";
import UstaTopLogo from "@/components/ui/UstaTopLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/types";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Ismingiz kamida 2 ta belgidan iborat bo‘lishi kerak"),
    phone: z
      .string()
      .min(9, "Telefon raqami kamida 9 ta raqamdan iborat bo‘lishi kerak")
      .max(12, "Telefon raqami noto‘g‘ri kiritildi"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi shart"),
    confirmPassword: z
      .string()
      .min(6, "Parolni tasdiqlang"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kiritilgan parollar bir-biriga mos kelmadi",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [registerError, setRegisterError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    try {
      const cleanPhone = data.phone.startsWith("+998") ? data.phone : `+998${data.phone.replace(/^998/, "")}`;
      await registerUser(data.name, cleanPhone, data.password, selectedRole);
      if (selectedRole === "PROVIDER") {
        router.push("/provider/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setRegisterError(err?.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi. Iltimos qayta urinib ko‘ring.");
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
            Ro‘yxatdan o‘tish
          </h1>
          <p className="text-xs text-on-surface-variant">
            Usta Top platformasida ishonchli xizmatlar dunyosiga qo‘shiling
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface">Hisob turi:</label>
          <div className="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRole("CUSTOMER")}
              className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === "CUSTOMER"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Mijoz sifatida</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("PROVIDER")}
              className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === "PROVIDER"
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Usta (mutaxassis)</span>
            </button>
          </div>
        </div>

        {registerError && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {registerError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Ism va familiya:</label>
            <div className="h-12 bg-surface rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center px-3.5 gap-2">
              <User className="w-4 h-4 text-outline shrink-0" />
              <input
                type="text"
                placeholder="Masalan: Sardor Aliyev"
                {...register("name")}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-error font-medium">{errors.name.message}</span>
            )}
          </div>

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
                placeholder="Kamida 6 ta belgi"
                {...register("password")}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-error font-medium">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Parolni tasdiqlash:</label>
            <div className="h-12 bg-surface rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center px-3.5 gap-2">
              <Lock className="w-4 h-4 text-outline shrink-0" />
              <input
                type="password"
                placeholder="Parolni qayta kiriting"
                {...register("confirmPassword")}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-error font-medium">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Terms note */}
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Ro‘yxatdan o‘tish orqali siz Usta Top{" "}
            <span className="text-primary font-semibold">Foydalanish shartlari</span> va{" "}
            <span className="text-primary font-semibold">Maxfiylik siyosati</span>ga rozilik bildirasiz.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-1 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              "Ro‘yxatdan o‘tkazilmoqda..."
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Ro‘yxatdan o‘tish</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Hisobingiz bormi?{" "}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">
            Tizimga kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
