import { apiClient, extractApiData } from "./client";
import { ServiceCategory } from "@/types";

export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const res = await apiClient.get<any>("/categories/");
    const list = extractApiData<ServiceCategory[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const res = await apiClient.get<any>(`/categories/${slug}/`);
    const data = extractApiData<ServiceCategory>(res);
    if (data && (data.id || data.slug)) return data;
  } catch {
    const all = await getCategories();
    return all.find((c) => c.slug === slug || c.id === slug) || null;
  }
  return null;
}
