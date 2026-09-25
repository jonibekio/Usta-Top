"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Check, Plus, Star } from "lucide-react";
import { MOCK_PROVIDERS } from "@/lib/mock-data/providers";

export default function ProviderProfileManagePage() {
  const provider = MOCK_PROVIDERS[0];
  const [services, setServices] = useState(provider.services);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    setServices([
      ...services,
      {
        id: `s-${Date.now()}`,
        name: newServiceName,
        description: "Yangi qo'shilgan xizmat turi",
        price: Number(newServicePrice),
        priceFormatted: `${Number(newServicePrice).toLocaleString()} so‘m`,
      },
    ]);
    setNewServiceName("");
    setNewServicePrice("");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="w-full bg-surface-container-low py-8 px-4 md:px-8 lg:px-12 border-b border-outline-variant/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Usta profili
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Profil va xizmatlar sozlamalari
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-tertiary-container" />
              Tasdiqlangan Usta
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-surface-container">
              <Image
                src={provider.avatar}
                alt={provider.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed p-1 rounded-full flex items-center justify-center shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-on-surface">{provider.name}</h2>
            <p className="text-xs text-on-surface-variant">{provider.title}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-on-surface-variant">
              <span>{provider.phone}</span>
              <span>•</span>
              <span>{provider.addressFull}</span>
              <span>•</span>
              <span className="font-bold text-secondary flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-secondary" /> {provider.rating.toFixed(2)} ({provider.reviewsCount})
              </span>
            </div>
          </div>
        </div>

        {/* Services & Pricing Manager */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface">Mening xizmatlarim va narxlarim</h3>

          <div className="flex flex-col gap-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 border border-outline-variant/20"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">{s.name}</span>
                  <span className="text-xs text-on-surface-variant">{s.description}</span>
                </div>
                <span className="text-sm font-bold text-primary tnum">{s.priceFormatted}</span>
              </div>
            ))}
          </div>

          {/* Add Service Form */}
          <form onSubmit={handleAddService} className="pt-3 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Yangi xizmat nomi (masalan: Drenaj tozalash)"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="flex-1 h-11 px-3.5 bg-surface-container rounded-xl text-xs outline-none border border-outline-variant/30"
            />
            <input
              type="number"
              placeholder="Narxi (so‘m)"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              className="w-full sm:w-36 h-11 px-3.5 bg-surface-container rounded-xl text-xs outline-none border border-outline-variant/30 tnum"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Qo‘shish</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
