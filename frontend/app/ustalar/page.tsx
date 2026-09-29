"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Filter,
  Loader2,
  Calendar,
  Heart,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Briefcase,
  Check,
} from "lucide-react";
import { getProviders } from "@/lib/api/providers";
import { getCategories } from "@/lib/api/categories";
import { getLocationHierarchy, RegionItem } from "@/lib/api/locations";
import { getFavorites, toggleFavorite } from "@/lib/api/favorites";
import { useLocation } from "@/lib/location/LocationContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { Provider, ServiceCategory } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import BookingModal from "@/components/bookings/BookingModal";

function UstalarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const { isAuthenticated } = useAuth();
  const { location, setLocation } = useLocation();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [hierarchy, setHierarchy] = useState<RegionItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [minRating, setMinRating] = useState<string>("");
  const [minExperience, setMinExperience] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Direct Booking state
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCategories(),
      getLocationHierarchy(),
    ]).then(([cats, locs]) => {
      setCategories(cats);
      setHierarchy(locs);

      if (location?.regionSlug) {
        const foundReg = locs.find((r) => r.slug === location.regionSlug || r.name === location.region);
        if (foundReg) {
          setSelectedRegionId(foundReg.id);
          if (location.district && location.district !== "Barcha tumanlar") {
            const foundDist = foundReg.districts.find((d) => d.name === location.district || d.slug === location.districtSlug);
            if (foundDist) {
              setSelectedDistrictId(foundDist.id);
            }
          }
        }
      }
    });
  }, [location]);

  // Fetch favorites for current user
  useEffect(() => {
    if (isAuthenticated) {
      getFavorites().then((favs) => {
        setFavoriteIds(new Set(favs.map((f) => f.provider.id)));
      });
    } else {
      setFavoriteIds(new Set());
    }
  }, [isAuthenticated]);

  const activeRegion = hierarchy.find((r) => r.id === selectedRegionId);
  const availableDistricts = activeRegion?.districts || [];

  const handleRegionChange = (regId: string) => {
    setSelectedRegionId(regId);
    setSelectedDistrictId("");
    const reg = hierarchy.find((r) => r.id === regId);
    if (reg) {
      setLocation(reg.name, reg.slug, "Barcha tumanlar", "");
    }
  };

  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const dist = availableDistricts.find((d) => d.id === distId);
    if (dist && activeRegion) {
      setLocation(activeRegion.name, activeRegion.slug, dist.name, dist.slug);
    }
  };

  const fetchFilteredProviders = useCallback(() => {
    setIsLoading(true);

    const activeDist = availableDistricts.find((d) => d.id === selectedDistrictId);

    getProviders({
      search: search.trim() || undefined,
      category: selectedCategory || undefined,
      region: activeRegion?.name || undefined,
      district: activeDist?.name || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      experienceYears: minExperience ? parseInt(minExperience, 10) : undefined,
      verifiedOnly: verifiedOnly || undefined,
      ordering: ordering || undefined,
    })
      .then((data) => setProviders(data))
      .catch((err) => {
        console.error("Failed to load providers:", err);
        setProviders([]);
      })
      .finally(() => setIsLoading(false));
  }, [
    search,
    selectedCategory,
    activeRegion,
    selectedDistrictId,
    availableDistricts,
    minRating,
    minExperience,
    verifiedOnly,
    ordering,
  ]);

  useEffect(() => {
    fetchFilteredProviders();
  }, [fetchFilteredProviders]);

  const handleToggleFavorite = async (e: React.MouseEvent, providerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/ustalar`;
      return;
    }

    const isFav = favoriteIds.has(providerId);
    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(providerId);
      else next.add(providerId);
      return next;
    });

    try {
      const result = await toggleFavorite(providerId, isFav);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (result) next.add(providerId);
        else next.delete(providerId);
        return next;
      });
    } catch {
      // Revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(providerId);
        else next.delete(providerId);
        return next;
      });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedRegionId("");
    setSelectedDistrictId("");
    setMinRating("");
    setMinExperience("");
    setOrdering("rating");
    setVerifiedOnly(false);
  };

  const hasActiveFilters = Boolean(
    search ||
      selectedCategory ||
      selectedRegionId ||
      selectedDistrictId ||
      minRating ||
      minExperience ||
      verifiedOnly ||
      ordering !== "rating"
  );

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              Ustalar katalogi
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              O‘zbekiston bo‘yicha malakali, saralangan va tekshirilgan ustalar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-on-surface-variant">
              Topildi: <strong className="text-on-surface text-sm">{providers.length}</strong> ta usta
            </span>
          </div>
        </div>

        {/* Primary Filter Bar */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Usta ismi yoki mutaxassislik bo‘yicha qidirish..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary w-full md:w-56 font-medium"
            >
              <option value="">Barcha xizmatlar</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Region Select */}
            <select
              value={selectedRegionId}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary w-full md:w-48 font-medium"
            >
              <option value="">Barcha viloyatlar</option>
              {hierarchy.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* District Select (dynamic based on selected region) */}
            {availableDistricts.length > 0 && (
              <select
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary w-full md:w-48 font-medium animate-in fade-in"
              >
                <option value="">Barcha tumanlar</option>
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                showAdvancedFilters || minRating || minExperience
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-surface-container-low border-outline-variant/40 text-on-surface hover:bg-surface-container"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrlar</span>
            </button>
          </div>

          {/* Expanded Secondary Filters Strip */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Rating Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-on-surface-variant">Reyting:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="">Barchasi</option>
                  <option value="4.0">4.0+ yulduz</option>
                  <option value="4.5">4.5+ yulduz</option>
                  <option value="4.8">4.8+ yuqori reyting</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-on-surface-variant">Tajriba:</span>
                <select
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="">Barchasi</option>
                  <option value="1">1+ yil</option>
                  <option value="3">3+ yil</option>
                  <option value="5">5+ yil</option>
                  <option value="10">10+ yil tajribali</option>
                </select>
              </div>

              {/* Ordering / Sorting */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Tartiblash:</span>
                </span>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="rating">Reyting bo‘yicha</option>
                  <option value="price_asc">Narx: arzondan qimmatga</option>
                  <option value="price_desc">Narx: qimmatdan arzonga</option>
                  <option value="experience">Tajriba bo‘yicha</option>
                  <option value="jobs">Bajarilgan ishlar soni</option>
                </select>
              </div>

              {/* Verified Only Checkbox */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-xs font-semibold text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-primary focus:ring-primary"
                />
                <span>Faqat tasdiqlangan</span>
              </label>

              {/* Reset all button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-primary hover:underline ml-auto cursor-pointer"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="w-full min-h-[350px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-on-surface-variant font-medium">Ustalar saralanmoqda...</p>
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            title="Mos ustalar topilmadi"
            description="Kiritilgan parametrlar va filtrlar bo‘yicha hozircha mutaxassis mavjud emas. Viloyat yoki toifani o‘zgartirib ko‘ring."
            actionLabel="Filtrlarni tozalash"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p) => {
              const isFav = favoriteIds.has(p.id);

              return (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Link
                        href={`/ustalar/${p.slug || p.id}`}
                        className="flex items-center gap-3 group-hover:opacity-95 transition-opacity"
                      >
                        <div className="w-13 h-13 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {p.avatar ? (
                            <Image
                              src={p.avatar}
                              alt={p.name}
                              width={52}
                              height={52}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            p.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="text-base font-bold text-on-surface leading-tight hover:text-primary transition-colors">
                              {p.name}
                            </h3>
                            {p.verified && (
                              <span title="Tasdiqlangan mutaxassis">
                                <CheckCircle className="w-4 h-4 text-tertiary-container fill-tertiary-container text-white shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5">{p.title}</p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2">
                        {/* Rating Pill */}
                        <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-bold text-on-surface shrink-0">
                          <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                          <span>{p.rating.toFixed(1)}</span>
                          {p.reviewsCount > 0 && (
                            <span className="text-[10px] text-on-surface-variant font-normal">
                              ({p.reviewsCount})
                            </span>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(e, p.id)}
                          title={isFav ? "Sevimlilardan o‘chirish" : "Sevimlilarga saqlash"}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isFav
                              ? "bg-red-500/10 text-red-500"
                              : "text-on-surface-variant hover:text-red-500 hover:bg-surface-container"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${isFav ? "fill-red-500" : ""}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Pill Row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mb-3">
                      {(p.district || p.city) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>
                            {p.district ? `${p.district}, ` : ""}
                            {p.city || "Toshkent"}
                          </span>
                        </div>
                      )}
                      {p.experienceYears > 0 && (
                        <span>{p.experienceYears} yil tajriba</span>
                      )}
                      {p.completedJobsCount > 0 && (
                        <span>{p.completedJobsCount} ta buyurtma</span>
                      )}
                    </div>

                    {/* About snippet */}
                    {p.aboutText && (
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                        {p.aboutText}
                      </p>
                    )}
                  </div>

                  {/* Footer Row: Price + CTAs */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 gap-2">
                    <div>
                      <span className="text-[11px] text-on-surface-variant block">Narx</span>
                      <span className="text-xs font-bold text-on-surface">
                        {p.priceRange.formatted || `${p.priceRange.min.toLocaleString()} so‘mdan`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingProvider(p)}
                        className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Buyurtma</span>
                      </button>

                      <Link
                        href={`/ustalar/${p.slug || p.id}`}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-xl transition-colors"
                      >
                        Profil
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default function MatchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <UstalarContent />
    </Suspense>
  );
}
