"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldCheck, Check, Save, Star, Clock, MapPin } from "lucide-react";
import { getProviderMe, updateProviderMe } from "@/lib/api/providers";
import { Provider } from "@/types";

export default function ProviderProfileManagePage() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [addressFull, setAddressFull] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [priceMin, setPriceMin] = useState(80000);
  const [priceMax, setPriceMax] = useState(300000);
  const [availableTime, setAvailableTime] = useState("");

  useEffect(() => {
    getProviderMe()
      .then((data) => {
        if (data) {
          setProvider(data);
          setDisplayName(data.name || "");
          setTitle(data.title || "");
          setAboutText(data.aboutText || "");
          setAddressFull(data.addressFull || "");
          setExperienceYears(data.experienceYears || 1);
          setPriceMin(data.priceRange?.min || 80000);
          setPriceMax(data.priceRange?.max || 300000);
          setAvailableTime(data.availableTime || "Bugun bo‘sh");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveNotice(null);

    try {
      const updated = await updateProviderMe({
        display_name: displayName,
        title,
        about_text: aboutText,
        address_full: addressFull,
        experience_years: Number(experienceYears),
        price_min: Number(priceMin),
        price_max: Number(priceMax),
        available_time: availableTime,
      } as any);

      if (updated) {
        setProvider(updated);
        setSaveNotice("Profil muvaffaqiyatli saqlandi");
      } else {
        setSaveNotice("O‘zgarishlar saqlandi");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      setSaveNotice("Saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveNotice(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-surface p-8">
        <div className="max-w-4xl mx-auto w-full h-96 rounded-2xl bg-surface-container-low animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Usta profili
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Profil sozlamalari
            </h1>
          </div>
          {provider?.verified && (
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Tasdiqlangan mutaxassis
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-surface-container flex items-center justify-center text-2xl font-black text-primary uppercase shrink-0">
            {provider?.avatar ? (
              <Image
                src={provider.avatar}
                alt={displayName || "Usta"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(displayName || "U")[0]}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-on-surface">{displayName || "Usta profili"}</h2>
            <p className="text-xs text-on-surface-variant">{title || "Xizmat ko‘rsatuvchi"}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-on-surface-variant">
              {provider?.phone && <span>{provider.phone}</span>}
              {provider?.phone && addressFull && <span>•</span>}
              {addressFull && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {addressFull}
                </span>
              )}
              {typeof provider?.rating === "number" && (
                <>
                  <span>•</span>
                  <span className="font-bold text-secondary flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-secondary" /> {provider.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form
          onSubmit={handleSave}
          className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5"
        >
          <h3 className="text-base font-bold text-on-surface">Asosiy ma‘lumotlar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                Ism yoki Kompaniya nomi
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                Mutaxassislik yo‘nalishi
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Santexnik, Elektrik, Maishiy texnika ustasi"
                className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              Xizmat ko‘rsatish manzili va hududi
            </label>
            <input
              type="text"
              value={addressFull}
              onChange={(e) => setAddressFull(e.target.value)}
              placeholder="Toshkent shahri, Yunusobod tumani"
              className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                Tajriba (yil)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                Minimal narx (so‘m)
              </label>
              <input
                type="number"
                step="5000"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                Maksimal narx (so‘m)
              </label>
              <input
                type="number"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              Qabul vaqti va mavjudlik
            </label>
            <input
              type="text"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="Har kuni 08:00 dan 20:00 gacha"
              className="h-11 px-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              O‘zingiz va tajribangiz haqida
            </label>
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Xizmat ko‘rsatish qoidalari, asbob-uskunalar va ish tajribangiz..."
              className="p-3.5 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 focus:border-primary text-on-surface resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
            {saveNotice ? (
              <span className="text-xs font-semibold text-primary">{saveNotice}</span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saqlanmoqda..." : "Saqlash"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
