"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Phone,
  MapPin,
  Heart,
  Bell,
  Trash2,
  Plus,
  Loader2,
  CheckCircle,
  Calendar,
  MessageSquare,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getSavedAddresses,
  createSavedAddress,
  deleteSavedAddress,
  getLocationHierarchy,
  SavedAddress,
  RegionItem,
} from "@/lib/api/locations";
import { getFavorites, toggleFavorite, FavoriteItem } from "@/lib/api/favorites";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  NotificationItem,
} from "@/lib/api/notifications";
import EmptyState from "@/components/ui/EmptyState";
import BookingModal from "@/components/bookings/BookingModal";
import { Provider } from "@/types";

export default function CustomerProfilePage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "favorites" | "notifications">("profile");

  // Profile fields
  const [name, setName] = useState("");
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [hierarchy, setHierarchy] = useState<RegionItem[]>([]);
  const [newRegionId, setNewRegionId] = useState("");
  const [newDistrictId, setNewDistrictId] = useState("");
  const [newAddressText, setNewAddressText] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  // Load hierarchy for address form
  useEffect(() => {
    getLocationHierarchy().then(setHierarchy);
  }, []);

  // Load tab-specific data
  useEffect(() => {
    if (!user) return;

    if (activeTab === "addresses") {
      setIsLoadingAddresses(true);
      getSavedAddresses()
        .then(setAddresses)
        .finally(() => setIsLoadingAddresses(false));
    } else if (activeTab === "favorites") {
      setIsLoadingFavorites(true);
      getFavorites()
        .then(setFavorites)
        .finally(() => setIsLoadingFavorites(false));
    } else if (activeTab === "notifications") {
      setIsLoadingNotifications(true);
      getNotifications()
        .then(setNotifications)
        .finally(() => setIsLoadingNotifications(false));
    }
  }, [user, activeTab]);

  const activeRegion = hierarchy.find((r) => r.id === newRegionId);
  const availableDistricts = activeRegion?.districts || [];

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    setIsSavingAddress(true);
    try {
      const activeDist = availableDistricts.find((d) => d.id === newDistrictId);
      const fullText = [
        activeRegion?.name,
        activeDist?.name,
        newAddressText.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      const created = await createSavedAddress({
        region: activeRegion?.name,
        district: activeDist?.name,
        address_text: fullText,
        landmark: newLandmark.trim() || undefined,
        is_default: newIsDefault,
      });

      if (created) {
        setAddresses((prev) => [created, ...prev]);
        setIsAddingAddress(false);
        setNewAddressText("");
        setNewLandmark("");
        setNewRegionId("");
        setNewDistrictId("");
        setProfileNotice("Manzil muvaffaqiyatli saqlandi.");
      }
    } catch (err) {
      console.error("Save address error:", err);
      alert("Manzilni saqlashda xatolik yuz berdi.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Ushbu manzilni o‘chirishga ishonchingiz komilmi?")) return;
    try {
      await deleteSavedAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const handleRemoveFavorite = async (providerId: string) => {
    try {
      await toggleFavorite(providerId, true);
      setFavorites((prev) => prev.filter((f) => f.provider.id !== providerId));
    } catch (err) {
      console.error("Remove favorite error:", err);
    }
  };

  const handleMarkNotification = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all error:", err);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-surface p-8 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center max-w-md w-full shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-primary mb-4">
            <UserIcon className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Tizimga kiring</h2>
          <p className="text-xs text-on-surface-variant mt-2 mb-6">
            Profil ma’lumotlarini ko‘rish va hisobingizni boshqarish uchun tizimga kiring.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full h-11 leading-[44px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all"
          >
            Kirish
          </Link>
        </div>
      </div>
    );
  }

  const roleText =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "PROVIDER"
      ? "Xizmat ko‘rsatuvchi (Usta)"
      : "Mijoz";

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-6">
        {/* User Card Header */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center text-2xl font-black text-primary uppercase shrink-0">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(user.name || "U")[0]}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-on-surface">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  {roleText}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/buyurtmalar"
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
            >
              Buyurtmalarim
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="px-3.5 py-2 text-error hover:bg-error/10 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === "profile"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Shaxsiy ma‘lumotlar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "addresses"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saqlangan manzillar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "favorites"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Sevimli ustalar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "notifications"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Bildirishnomalar</span>
          </button>
        </div>

        {profileNotice && (
          <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary flex items-center justify-between">
            <span>{profileNotice}</span>
            <button
              type="button"
              onClick={() => setProfileNotice(null)}
              className="text-on-surface-variant hover:text-on-surface cursor-pointer text-base"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab 1: Profile Settings */}
        {activeTab === "profile" && (
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <h2 className="text-base font-bold text-on-surface">Shaxsiy hisob sozlamalari</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">To‘liq ism:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-surface-container text-xs font-medium outline-none border border-outline-variant/30 focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Telefon raqam:</label>
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="h-11 px-3.5 rounded-xl bg-surface-container/60 text-xs font-medium outline-none border border-outline-variant/20 text-on-surface-variant font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setProfileNotice("O‘zgarishlar muvaffaqiyatli saqlandi")}
                className="h-10 px-6 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Saqlash
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-on-surface">Mening manzillarim</h2>
                <p className="text-xs text-on-surface-variant">
                  Buyurtma berishda tez tanlash uchun manzillarni saqlang
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi manzil</span>
              </button>
            </div>

            {/* Add Address Form Drawer */}
            {isAddingAddress && (
              <form
                onSubmit={handleCreateAddress}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-top-2"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Yangi manzil qo‘shish
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Viloyat / Shahar
                    </label>
                    <select
                      value={newRegionId}
                      onChange={(e) => {
                        setNewRegionId(e.target.value);
                        setNewDistrictId("");
                      }}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="">Tanlang</option>
                      {hierarchy.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Tuman
                    </label>
                    <select
                      value={newDistrictId}
                      onChange={(e) => setNewDistrictId(e.target.value)}
                      disabled={!newRegionId}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="">Tanlang</option>
                      {availableDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Aniq manzil (ko‘cha, uy, xonadon) <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      placeholder="Masalan: Navoiy ko‘chasi, 14-uy, 22-xonadon"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Mo‘ljal (Landmark)
                    </label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="Masalan: Korzinka yonida"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span>Asosiy manzil qilib belgilash</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 border border-outline-variant/40 text-on-surface text-xs rounded-xl"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      {isSavingAddress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Saqlash</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Address List */}
            {isLoadingAddresses ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : addresses.length === 0 ? (
              <EmptyState
                title="Saqlangan manzillar mavjud emas"
                description="Tez buyurtma berish uchun yashash yoki ish joyingiz manzilini qo‘shing."
                actionLabel="Manzil qo‘shish"
                onAction={() => setIsAddingAddress(true)}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-on-surface leading-snug">
                            {a.address_text}
                          </p>
                          {a.is_default && (
                            <span className="px-2 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                              Asosiy
                            </span>
                          )}
                        </div>
                        {a.landmark && (
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            Mo‘ljal: {a.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(a.id)}
                      title="O‘chirish"
                      className="text-on-surface-variant hover:text-error p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Favorites */}
        {activeTab === "favorites" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-on-surface">Sevimli ustalar</h2>

            {isLoadingFavorites ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : favorites.length === 0 ? (
              <EmptyState
                title="Sevimli ustalar ro‘yxati bo‘sh"
                description="Katalogdan o‘zingizga ma‘qul kelgan ustalarni yurakcha tugmasi orqali saqlab qo‘yishingiz mumkin."
                actionLabel="Ustalarni ko‘rish"
                actionHref="/ustalar"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((fav) => {
                  const p = fav.provider;
                  return (
                    <div
                      key={fav.id}
                      className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <Link href={`/ustalar/${p.slug || p.id}`} className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                              {p.avatar ? (
                                <Image
                                  src={p.avatar}
                                  alt={p.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                p.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-on-surface hover:text-primary transition-colors">
                                {p.name}
                              </h4>
                              <p className="text-[11px] text-on-surface-variant">{p.title}</p>
                            </div>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRemoveFavorite(p.id)}
                            title="Sevimlilardan o‘chirish"
                            className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-2">
                          <div className="flex items-center gap-0.5 text-secondary font-bold">
                            <Star className="w-3 h-3 fill-secondary-container" />
                            <span>{p.rating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{p.district || p.city || "Toshkent"}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setBookingProvider(p)}
                          className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                        >
                          Buyurtma
                        </button>
                        <Link
                          href={`/ustalar/${p.slug || p.id}`}
                          className="flex-1 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-xl text-center"
                        >
                          Profil
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface">Bildirishnomalar tarixi</h2>
              {notifications.some((n) => !n.isRead) && (
                <button
                  type="button"
                  onClick={handleMarkAllNotifications}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Barchasini o‘qilgan qilish
                </button>
              )}
            </div>

            {isLoadingNotifications ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState
                title="Yangi bildirishnomalar yo‘q"
                description="Buyurtmalar va muloqotlar holati haqidagi xabarlar shu yerda aks etadi."
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkNotification(n.id)}
                    className={`p-4 rounded-2xl border transition-colors flex items-start justify-between gap-4 cursor-pointer ${
                      n.isRead
                        ? "bg-surface-container-lowest border-outline-variant/20 opacity-80"
                        : "bg-surface-container-lowest border-primary/40 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          n.isRead ? "bg-surface-container text-on-surface-variant" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">{n.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{n.body}</p>
                        <span className="text-[10px] text-on-surface-variant/60 mt-1 block">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingProvider && (
        <BookingModal
          isOpen={Boolean(bookingProvider)}
          provider={bookingProvider}
          onClose={() => setBookingProvider(null)}
        />
      )}
    </div>
  );
}
