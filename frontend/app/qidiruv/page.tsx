"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wrench,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { createServiceRequest } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceCategory } from "@/types";

const DISTRICTS = [
  "Chilonzor",
  "Mirzo Ulug‘bek",
  "Yunusobod",
  "Yakkasaroy",
  "Shayxontohur",
  "Olmazor",
  "Uchtepa",
  "Yashnobod",
  "Sergeli",
  "Mirobod",
  "Bektemir",
  "Yangihayot",
];

function ProblemDiagnosisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("Chilonzor");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<"URGENT" | "TODAY" | "TOMORROW">("URGENT");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      const catParam = searchParams.get("category");
      const qParam = searchParams.get("q");

      if (catParam && cats.some((c) => c.slug === catParam || c.id === catParam)) {
        setSelectedCategory(catParam);
      } else if (cats.length > 0) {
        setSelectedCategory(cats[0].slug);
      }

      if (qParam) {
        setDescription(qParam);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (user?.phone) {
      setContactPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!description.trim()) {
      setErrorMessage("Iltimos, bajarilishi kerak bo‘lgan ishni qisqacha tavsiflang.");
      return;
    }

    const phoneToUse = contactPhone.trim() || user?.phone || "";
    if (!isAuthenticated && (!phoneToUse || phoneToUse.length < 9)) {
      setErrorMessage("Iltimos, bog‘lanish uchun telefon raqamingizni kiriting.");
      return;
    }

    const activeCat = categories.find(
      (c) => c.slug === selectedCategory || c.id === selectedCategory
    );

    setIsSubmitting(true);
    try {
      const created = await createServiceRequest({
        categoryId: selectedCategory || (categories[0]?.slug ?? "santexnika"),
        categoryName: activeCat?.name || "Xizmat",
        problemDescription: description.trim(),
        urgency,
        urgencyText:
          urgency === "URGENT"
            ? "Shoshilinch"
            : urgency === "TODAY"
            ? "Bugun"
            : "Ertaga",
        location: {
          city: "Toshkent",
          district,
          address: address.trim() || `${district} tumani`,
        },
        phone: phoneToUse,
      });

      if (created?.code || created?.id) {
        router.push(`/buyurtmalar?created=${encodeURIComponent(created.code || created.id)}`);
      } else {
        router.push("/buyurtmalar");
      }
    } catch (err: any) {
      console.error("Request creation failed:", err);
      setErrorMessage(
        err?.message || "Buyurtma yuborishda xatolik yuz berdi. Qayta urinib ko‘ring."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">
            Xizmatga buyurtma berish
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Muammoni tavsiflang va ustalardan narx takliflarini qabul qiling
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-error-container/30 border border-error-container text-on-error-container flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-6"
        >
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Xizmat yo‘nalishi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-fixed/20 text-primary font-bold shadow-sm"
                        : "border-outline-variant/40 hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <Wrench className="w-4 h-4 mb-2 opacity-80" />
                    <span className="text-xs leading-snug">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Muammo yoki topshiriq tavsifi <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qanday ish bajarilishi kerakligini yozing..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:bg-surface transition-colors"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Tuman
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} tumani
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Aniq manzil / Mo‘ljal
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ko‘cha, uy, xonadon raqami"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:bg-surface transition-colors"
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Qulay vaqt
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "URGENT", label: "Shoshilinch (1-2 soat)" },
                { key: "TODAY", label: "Bugun" },
                { key: "TOMORROW", label: "Ertaga" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setUrgency(item.key as any)}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                    urgency === item.key
                      ? "border-primary bg-primary text-on-primary shadow-sm"
                      : "border-outline-variant/40 hover:bg-surface-container text-on-surface"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Phone (if guest or wanting to confirm) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Bog‘lanish uchun telefon raqam <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:bg-surface transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Yuborilmoqda...</span>
                </>
              ) : (
                <span>Buyurtmani yuborish</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProblemDiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <ProblemDiagnosisContent />
    </Suspense>
  );
}
