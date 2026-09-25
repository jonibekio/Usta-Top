import { apiClient, extractApiData } from "./client";
import { ServiceCategory } from "@/types";
import { MOCK_CATEGORIES } from "../mock-data/categories";

export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const res = await apiClient.get<any>("/categories/");
    const list = extractApiData<ServiceCategory[]>(res);
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    return MOCK_CATEGORIES;
  } catch (error) {
    console.warn("Categories API unreachable, falling back:", error);
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}

