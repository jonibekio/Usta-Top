"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  providerName?: string;
  minutesLeft?: number;
}

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  providerName = "Ali Karimov",
  minutesLeft = 10,
}: CancelModalProps) {
  const [reason, setReason] = useState("Rejalarim o‘zgarib qoldi");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-bold">Buyurtmani bekor qilish</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed">
          Usta {providerName} allaqachon yo‘lga chiqqan ({minutesLeft} daqiqa qoldi). Hozir bekor qilsangiz, transport xarajatlari tufayli qayta buyurtma berish reytingingizga ta’sir qilishi mumkin.
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
            Bekor qilish sababi:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-11 px-3 rounded-lg bg-surface-container text-on-surface text-sm font-medium outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="Rejalarim o‘zgarib qoldi">Rejalarim o‘zgarib qoldi</option>
            <option value="Muammoni o‘zim hal qildim">Muammoni o‘zim hal qildim</option>
            <option value="Usta juda kechikyapti">Usta juda kechikyapti</option>
            <option value="Boshqa sabab">Boshqa sabab</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold transition-colors cursor-pointer"
          >
            Ortga qaytish
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 h-11 rounded-lg bg-error text-on-error text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Bekor qilishni tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
}
