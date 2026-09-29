"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Wrench,
  CheckCircle,
  Calendar,
  AlertCircle,
  Loader2,
  HelpCircle,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Check,
} from "lucide-react";
import { getProviderById } from "@/lib/api/providers";
import { startConversation } from "@/lib/api/conversations";
import { getFavorites, toggleFavorite } from "@/lib/api/favorites";
import { getProviderReviews } from "@/lib/api/reviews";
import { useAuth } from "@/lib/auth/AuthContext";
import { Provider, ProviderService } from "@/types";
import BookingModal from "@/components/bookings/BookingModal";

export default function ProviderProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";
  const { user, isAuthenticated } = useAuth();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "about" | "portfolio" | "reviews">("services");
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    getProviderById(id)
      .then((data) => {
        setProvider(data);
        if (data?.id) {
          getProviderReviews(data.id).then((revs) => {
            if (revs && revs.length > 0) {
              setReviewsList(revs);
            } else if (data.reviews && data.reviews.length > 0) {
              setReviewsList(data.reviews);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load provider", err);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && provider?.id) {
      getFavorites().then((favs) => {
        setIsFavorited(favs.some((f) => f.provider.id === provider.id));
      });
    }
  }, [isAuthenticated, provider?.id]);

  const handleToggleFavorite = async () => {
    if (!provider) return;
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/ustalar/${id}`);
      return;
    }

    const previous = isFavorited;
    setIsFavorited(!previous);

    try {
      const nextState = await toggleFavorite(provider.id, previous);
      setIsFavorited(nextState);
    } catch {
      setIsFavorited(previous);
    }
  };

  const handleStartChat = async () => {
    if (!provider) return;
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/ustalar/${id}`);
      return;
    }

    setIsStartingChat(true);
    try {
      await startConversation(provider.id, "Assalomu alaykum!");
      router.push("/xabarlar");
    } catch (err: any) {
      console.error("Failed to start chat:", err);
      setActionNotice("Muloqotni boshlashda xatolik yuz berdi.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const openBookingForService = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-on-surface-variant font-medium">Usta ma’lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <HelpCircle className="w-12 h-12 text-on-surface-variant/40" />
        <h1 className="text-xl font-bold text-on-surface">Usta profili topilmadi</h1>
        <p className="text-xs text-on-surface-variant max-w-sm">
          Mutaxassis tizimda topilmadi yoki hisobi vaqtincha nofaol.
        </p>
        <Link
          href="/ustalar"
          className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg"
        >
          Ustalar ro‘yxatiga qaytish
        </Link>
      </div>
    );
  }

  const allReviews = reviewsList.length > 0 ? reviewsList : provider.reviews;

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/ustalar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ustalar ro‘yxatiga qaytish</span>
        </Link>

        {actionNotice && (
          <div className="p-4 rounded-xl bg-primary-fixed/20 border border-primary/20 text-on-surface text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center text-primary font-bold text-2xl shrink-0">
              {provider.avatar ? (
                <Image
                  src={provider.avatar}
                  alt={provider.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                provider.name.charAt(0)
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                    <CheckCircle className="w-3 h-3 text-tertiary-container" />
                    Tasdiqlangan
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">{provider.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-3">
                <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface">
                  <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                  <span>{provider.rating.toFixed(1)}</span>
                  {provider.reviewsCount > 0 && (
                    <span className="text-[11px] font-normal text-on-surface-variant">
                      ({provider.reviewsCount} ta sharh)
                    </span>
                  )}
                </div>

                {(provider.district || provider.city) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {provider.district ? `${provider.district}, ` : ""}
                      {provider.city || "Toshkent"}
                    </span>
                  </div>
                )}

                {provider.experienceYears > 0 && (
                  <span>{provider.experienceYears} yil tajriba</span>
                )}

                {provider.completedJobsCount > 0 && (
                  <span>{provider.completedJobsCount} ta buyurtma</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Favorite heart toggle */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              title={isFavorited ? "Sevimlilardan o‘chirish" : "Sevimlilarga saqlash"}
              className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isFavorited
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "border-outline-variant/50 text-on-surface-variant hover:text-red-500 hover:bg-surface-container"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="flex-1 md:flex-none h-11 px-5 border border-outline-variant/50 hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isStartingChat ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <MessageSquare className="w-4 h-4 text-primary" />
              )}
              <span>Xabar yuborish</span>
            </button>

            <button
              type="button"
              onClick={() => openBookingForService()}
              className="flex-1 md:flex-none h-11 px-6 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Buyurtma berish</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "services"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Xizmatlar va narxlar ({provider.services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "about"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Usta haqida
          </button>
          {provider.portfolio.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "portfolio"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Portfolio ({provider.portfolio.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "reviews"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Sharhlar ({allReviews.length})
          </button>
        </div>

        {/* Tab 1: Services */}
        {activeTab === "services" && (
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface">Taklif etiladigan xizmatlar</h2>
              <span className="text-xs text-on-surface-variant">
                Boshlang‘ich narxlar ko‘rsatilgan
              </span>
            </div>

            {provider.services.length === 0 ? (
              <p className="text-xs text-on-surface-variant">Xizmat narxlari buyurtma vaqtida kelishuv asosida belgilanadi.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {provider.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-on-surface truncate">{svc.name}</h4>
                      {svc.description && (
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{svc.description}</p>
                      )}
                      <span className="text-xs font-bold text-primary tnum block mt-1">
                        {svc.priceFormatted || `${svc.price.toLocaleString()} so‘m`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openBookingForService(String(svc.id))}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Buyurtma
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About */}
        {activeTab === "about" && (
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-bold text-on-surface">Usta ma’lumotlari</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {provider.aboutText || "Malakali mutaxassis. Xizmatlar tezkor, sifatli va kafolatli bajariladi."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-outline-variant/20">
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-[11px] text-on-surface-variant block">Xizmat hududi</span>
                <span className="text-xs font-bold text-on-surface">{provider.addressFull || `${provider.district || "Toshkent"}, ${provider.city || ""}`}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-[11px] text-on-surface-variant block">O‘rtacha javob vaqti</span>
                <span className="text-xs font-bold text-on-surface">~{provider.responseMinutes || 15} daqiqa</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-[11px] text-on-surface-variant block">Kafolat muddati</span>
                <span className="text-xs font-bold text-on-surface">{provider.warrantyMonths || 6} oy</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Portfolio */}
        {activeTab === "portfolio" && provider.portfolio.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {provider.portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col"
              >
                <div className="relative h-48 w-full bg-surface-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5">
                  <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
                  {item.location && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{item.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4">
            {allReviews.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-2">
                <Star className="w-8 h-8 text-on-surface-variant/40" />
                <h3 className="text-sm font-bold text-on-surface">Hozircha sharhlar mavjud emas</h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Xizmatdan foydalangandan so‘ng birinchi bo‘lib sharh qoldirishingiz mumkin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allReviews.map((rev, idx) => (
                  <div
                    key={rev.id || idx}
                    className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-on-surface">
                          {rev.userName || rev.user_name || "Mijoz"}
                        </span>
                        <div className="flex items-center gap-1 text-secondary-container">
                          <Star className="w-3.5 h-3.5 fill-secondary-container" />
                          <span className="text-xs font-bold">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>

                    <span className="text-[10px] text-on-surface-variant/60">
                      {rev.date || (rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "Yaqinda")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Direct Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          provider={provider}
          preselectedServiceId={selectedServiceId}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
