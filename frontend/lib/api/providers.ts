import { apiClient, extractApiData } from "./client";
import { Provider } from "@/types";

function normalizeProvider(p: any): Provider {
  return {
    ...p,
    id: String(p.id),
    name: p.name || p.displayName || "Usta",
    title: p.title || p.shortTitle || "Mutaxassis",
    shortTitle: p.shortTitle || p.title || "Mutaxassis",
    avatar:
      p.avatar && (p.avatar.startsWith("http") || p.avatar.startsWith("/"))
        ? p.avatar
        : "",
    coverImage:
      p.coverImage && (p.coverImage.startsWith("http") || p.coverImage.startsWith("/"))
        ? p.coverImage
        : "",
    rating: typeof p.rating === "number" ? p.rating : 5.0,
    reviewsCount: typeof p.reviewsCount === "number" ? p.reviewsCount : 0,
    completedJobsCount: typeof p.completedJobsCount === "number" ? p.completedJobsCount : 0,
    experienceYears: typeof p.experienceYears === "number" ? p.experienceYears : 1,
    responseMinutes: typeof p.responseMinutes === "number" ? p.responseMinutes : 30,
    warrantyMonths: typeof p.warrantyMonths === "number" ? p.warrantyMonths : 12,
    availableTime: p.availableTime || "Bugun bo‘sh",
    aboutText: p.aboutText || "",
    addressFull: p.addressFull || (p.city ? `${p.city}, ${p.district || ""}` : "Toshkent"),
    phone: p.phone || "",
    priceRange: p.priceRange || {
      min: p.priceMin || 80000,
      max: p.priceMax || 350000,
      formatted: `${(p.priceMin || 80000).toLocaleString()} – ${(p.priceMax || 350000).toLocaleString()} so‘m`,
    },
    categoryIds: Array.isArray(p.categoryIds) ? p.categoryIds : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    services: Array.isArray(p.services) ? p.services : [],
    portfolio: Array.isArray(p.portfolio) ? p.portfolio : [],
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    ratingMetrics: p.ratingMetrics || {
      quality: 5.0,
      punctuality: 5.0,
      priceFairness: 5.0,
    },
  };
}

export async function getProviders(params?: {
  category?: string;
  search?: string;
  region?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  experienceYears?: number;
  isOnline?: boolean;
  verifiedOnly?: boolean;
  ordering?: string;
}): Promise<Provider[]> {
  try {
    const res = await apiClient.get<any>("/providers/", params);
    const list = extractApiData<any[]>(res);
    if (Array.isArray(list)) {
      return list.map(normalizeProvider);
    }
    return [];
  } catch (error) {
    console.error("Providers API error:", error);
    return [];
  }
}

export async function getProviderById(idOrSlug: string): Promise<Provider | null> {
  try {
    const res = await apiClient.get<any>(`/providers/${idOrSlug}/`);
    const data = extractApiData<any>(res);
    if (data && (data.id || data.slug)) {
      return normalizeProvider(data);
    }
    return null;
  } catch (error) {
    console.error(`Provider ${idOrSlug} fetch error:`, error);
    return null;
  }
}

export async function toggleProviderOnline(): Promise<boolean> {
  const res = await apiClient.post<any>("/provider/toggle-online/");
  const data = extractApiData<{ isOnline: boolean }>(res);
  return data?.isOnline ?? true;
}

export async function getProviderDashboardStats(): Promise<{
  weeklyEarnings: number;
  weeklyJobs: number;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  activeJobsCount: number;
  pendingQuotesCount: number;
  isOnline: boolean;
  verificationStatus: string;
} | null> {
  try {
    const res = await apiClient.get<any>("/provider/dashboard-stats/");
    return extractApiData(res);
  } catch {
    return null;
  }
}

export async function getProviderMe(): Promise<Provider | null> {
  try {
    const res = await apiClient.get<any>("/provider/me/");
    const data = extractApiData<any>(res);
    return data ? normalizeProvider(data) : null;
  } catch {
    return null;
  }
}

export async function updateProviderMe(data: Partial<Provider>): Promise<Provider | null> {
  try {
    const res = await apiClient.patch<any>("/provider/me/", data);
    const updated = extractApiData<any>(res);
    return updated ? normalizeProvider(updated) : null;
  } catch {
    return null;
  }
}
