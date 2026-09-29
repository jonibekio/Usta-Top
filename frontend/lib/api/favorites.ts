import { apiClient, extractApiData } from "./client";
import { Provider } from "@/types";

export interface FavoriteItem {
  id: string;
  provider: Provider;
  createdAt: string;
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  try {
    const res = await apiClient.get<any>("/favorites/");
    const data = extractApiData<any[]>(res);
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: String(item.id),
      provider: item.provider,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export async function toggleFavorite(providerId: string, isFavorited: boolean): Promise<boolean> {
  try {
    if (isFavorited) {
      await apiClient.delete(`/favorites/${providerId}/`);
      return false;
    } else {
      const res = await apiClient.post<any>(`/favorites/${providerId}/`);
      const data = extractApiData<{ isFavorited: boolean }>(res);
      return data?.isFavorited ?? true;
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return isFavorited;
  }
}
