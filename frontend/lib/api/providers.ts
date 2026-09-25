import { apiClient, extractApiData } from "./client";
import { Provider } from "@/types";
import { MOCK_PROVIDERS } from "../mock-data/providers";

function normalizeProvider(p: any): Provider {
  return {
    ...p,
    id: String(p.id),
    name: p.name || "Usta",
    title: p.title || p.shortTitle || "Mutaxassis",
    shortTitle: p.shortTitle || p.title || "Mutaxassis",
    avatar:
      p.avatar && (p.avatar.startsWith("http") || p.avatar.startsWith("/"))
        ? p.avatar
        : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150",
    coverImage:
      p.coverImage && (p.coverImage.startsWith("http") || p.coverImage.startsWith("/"))
        ? p.coverImage
        : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    rating: typeof p.rating === "number" ? p.rating : 4.9,
    reviewsCount: typeof p.reviewsCount === "number" ? p.reviewsCount : 0,
    completedJobsCount: typeof p.completedJobsCount === "number" ? p.completedJobsCount : 0,
    experienceYears: typeof p.experienceYears === "number" ? p.experienceYears : 5,
    responseMinutes: typeof p.responseMinutes === "number" ? p.responseMinutes : 15,
    warrantyMonths: typeof p.warrantyMonths === "number" ? p.warrantyMonths : 12,
    availableTime: p.availableTime || "Bugun bo‘sh",
    aboutText: p.aboutText || "Malakali mutaxassis. Xizmatlar tezkor va sifatli bajariladi.",
    addressFull: p.addressFull || "Toshkent shahri",
    phone: p.phone || "+998 90 123 45 67",
    priceRange: p.priceRange || {
      min: 100000,
      max: 300000,
      formatted: "100 000 – 300 000 so‘m",
    },
    categoryIds: Array.isArray(p.categoryIds) ? p.categoryIds : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    services: Array.isArray(p.services) ? p.services : [],
    portfolio: Array.isArray(p.portfolio) ? p.portfolio : [],
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
  };
}

export async function getProviders(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  district?: string;
  verifiedOnly?: boolean;
}): Promise<Provider[]> {
  try {
    const res = await apiClient.get<any>("/providers/", params);
    const list = extractApiData<any[]>(res);
    if (Array.isArray(list)) {
      return list.map(normalizeProvider);
    }
    return [];
  } catch (error) {
    console.warn("Providers API unreachable, using fallback:", error);
    let list = [...MOCK_PROVIDERS];
    if (params?.category) {
      list = list.filter((p) => p.categoryIds.includes(params.category!));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (params?.maxPrice) {
      list = list.filter((p) => p.priceRange.min <= params.maxPrice!);
    }
    if (params?.verifiedOnly) {
      list = list.filter((p) => p.verified);
    }
    return list;
  }
}

export async function getProviderById(idOrSlug: string): Promise<Provider | null> {
  try {
    const res = await apiClient.get<any>(`/providers/${idOrSlug}/`);
    const data = extractApiData<any>(res);
    if (data && (data.id || data.slug)) {
      return normalizeProvider(data);
    }
    return MOCK_PROVIDERS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  } catch (error) {
    console.warn(`Provider ${idOrSlug} unreachable, using fallback:`, error);
    return MOCK_PROVIDERS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }
}
