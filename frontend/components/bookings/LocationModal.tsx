"use client";

import React, { useState } from "react";
import { X, MapPin } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: string) => void;
  currentAddress?: string;
}

export default function LocationModal({
  isOpen,
  onClose,
  onSave,
  currentAddress = "Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy",
}: LocationModalProps) {
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-bold text-on-surface">Manzilni aniqlashtirish</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
          Asosiy manzil: <strong className="text-on-surface">{currentAddress}</strong>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface">
            Podyezd, domofon yoki orientir qo‘shing:
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="p-3 rounded-lg bg-surface-container text-on-surface text-sm font-medium outline-none focus:ring-2 focus:ring-primary w-full resize-none"
            placeholder="Masalan: 2-podyezd, kod 45K, 28-xonadon, Makro supermarketi ro‘parasida..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors cursor-pointer"
          >
            Yopish
          </button>
          <button
            onClick={() => onSave(details)}
            className="px-4 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            Saqlash va yuborish
          </button>
        </div>
      </div>
    </div>
  );
}
