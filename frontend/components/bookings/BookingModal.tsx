"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Clock, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Provider, ProviderService, Booking } from "@/types";
import { createDirectBooking } from "@/lib/api/bookings";
import { getSavedAddresses, SavedAddress } from "@/lib/api/locations";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLocation } from "@/lib/location/LocationContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider;
  preselectedServiceId?: string;
  onSuccess?: (booking: Booking) => void;
}

const TIME_SLOTS = [
  "09:00 – 12:00",
  "12:00 – 15:00",
  "15:00 – 18:00",
  "18:00 – 21:00",
  "Tezkor (1 soat ichida)",
];

export default function BookingModal({
  isOpen,
  onClose,
  provider,
  preselectedServiceId,
  onSuccess,
}: BookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { location } = useLocation();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (provider.services[0]?.id ? String(provider.services[0].id) : "")
  );
  const [scheduledDate, setScheduledDate] = useState<string>("Bugun");
  const [scheduledTime, setScheduledTime] = useState<string>(TIME_SLOTS[0]);
  const [addressText, setAddressText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize address based on location context and user saved addresses
  useEffect(() => {
    if (location?.district && location.district !== "Barcha tumanlar" && location.region) {
      setAddressText(`${location.region}, ${location.district}`);
    } else if (provider.city || provider.district) {
      setAddressText(`${provider.city || "Toshkent"}, ${provider.district || ""}`.trim());
    }

    if (isAuthenticated) {
      getSavedAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        const def = addrs.find((a) => a.is_default);
        if (def) {
          setAddressText(def.address_text);
        }
      });
    }
  }, [isAuthenticated, location, provider]);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    } else if (provider.services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(String(provider.services[0].id));
    }
  }, [preselectedServiceId, provider]);

  if (!isOpen) return null;

  const currentService: ProviderService | undefined = provider.services.find(
    (s) => String(s.id) === String(selectedServiceId)
  );

  const priceEstimate = currentService?.price || provider.priceRange?.min || 100000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/ustalar/${provider.slug || provider.id}`);
      return;
    }

    if (!addressText.trim()) {
      setErrorMsg("Iltimos, xizmat ko‘rsatiladigan manzilni kiriting.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const serviceName = currentService?.name || provider.title || "Mutaxassis xizmati";
      const booking = await createDirectBooking({
        provider_id: provider.id,
        service_name: serviceName,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        address_text: addressText.trim(),
        notes: notes.trim(),
        price: priceEstimate,
      });

      if (onSuccess) {
        onSuccess(booking);
      } else {
        router.push(`/buyurtmalar/${booking.orderNumber || booking.id}`);
      }
      onClose();
    } catch (err: any) {
      console.error("Direct booking error:", err);
      setErrorMsg(err?.message || "Buyurtma yuborishda xatolik yuz berdi. Iltimos qayta urinib ko‘ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div>
            <h2 className="text-base font-extrabold text-on-surface">Usta xizmatiga buyurtma</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Mutaxassis: <strong className="text-on-surface">{provider.name}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Service Selection */}
          {provider.services.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                Xizmat turi
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                {provider.services.map((svc) => (
                  <option key={svc.id} value={String(svc.id)}>
                    {svc.name} — {svc.priceFormatted || `${svc.price.toLocaleString()} so‘m`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Kuni</span>
              </label>
              <select
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                <option value="Bugun">Bugun</option>
                <option value="Ertaga">Ertaga</option>
                <option value="Indinga">Indinga</option>
                <option value="Dam olish kuni">Dam olish kuni</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Vaqt oralig‘i</span>
              </label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Manzil <span className="text-error">*</span></span>
              </label>
              {savedAddresses.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-primary">
                  <span>Saqlanganlardan:</span>
                  <select
                    className="bg-transparent underline cursor-pointer text-primary focus:outline-none max-w-[140px] truncate"
                    onChange={(e) => {
                      if (e.target.value) setAddressText(e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Tanlang</option>
                    {savedAddresses.map((a) => (
                      <option key={a.id} value={a.address_text}>
                        {a.address_text}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <input
              type="text"
              required
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="Tuman, ko‘cha, xonadon yoki mo‘ljal..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Problem / Notes */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              Qo‘shimcha izoh yoki nosozlik tavsifi
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Muammo haqida qisqacha ma‘lumot (masalan: jo‘mrakdan suv sizmoqda)..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Price Preview Card */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant block">Taxminiy boshlang‘ich narx:</span>
              <span className="text-xs font-semibold text-on-surface">Usta joyida ko‘rib aniqlashtirishi mumkin</span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-primary tnum">
                {priceEstimate.toLocaleString()} so‘m
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Buyurtmani tasdiqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
