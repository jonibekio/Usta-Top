import { apiClient, extractApiData } from "./client";
import { AdminStats } from "@/types";

export interface PlatformOverview {
  totalProviders: number;
  completedJobs: number;
  totalCategories: number;
}

export async function getPlatformOverview(): Promise<PlatformOverview> {
  try {
    const res = await apiClient.get<any>("/analytics/overview/");
    const data = extractApiData<PlatformOverview>(res);
    return data || { totalProviders: 0, completedJobs: 0, totalCategories: 0 };
  } catch (error) {
    console.error("Platform overview error:", error);
    return { totalProviders: 0, completedJobs: 0, totalCategories: 0 };
  }
}

export async function getAdminStats(): Promise<AdminStats | null> {
  try {
    const res = await apiClient.get<any>("/admin/stats/");
    return extractApiData<AdminStats>(res) || null;
  } catch (error) {
    console.error("Admin stats error:", error);
    return null;
  }
}
