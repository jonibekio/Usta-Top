import { apiClient, extractApiData } from "./client";

export interface NeighborhoodItem {
  id: string;
  name: string;
  slug: string;
}

export interface DistrictItem {
  id: string;
  name: string;
  slug: string;
  neighborhoods?: NeighborhoodItem[];
}

export interface RegionItem {
  id: string;
  name: string;
  slug: string;
  districts: DistrictItem[];
}

export interface SavedAddress {
  id: string;
  region?: string;
  district?: string;
  neighborhood?: string;
  regionName?: string;
  districtName?: string;
  neighborhoodName?: string;
  address_text: string;
  landmark?: string;
  is_default: boolean;
  created_at?: string;
}

export async function getLocationHierarchy(): Promise<RegionItem[]> {
  try {
    const res = await apiClient.get<any>("/locations/hierarchy/");
    const data = extractApiData<RegionItem[]>(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load location hierarchy:", error);
    return [];
  }
}

export async function getSavedAddresses(): Promise<SavedAddress[]> {
  try {
    const res = await apiClient.get<any>("/locations/addresses/");
    const data = extractApiData<SavedAddress[]>(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch saved addresses:", error);
    return [];
  }
}

export async function createSavedAddress(data: {
  region?: string;
  district?: string;
  neighborhood?: string;
  address_text: string;
  landmark?: string;
  is_default?: boolean;
}): Promise<SavedAddress | null> {
  try {
    const res = await apiClient.post<any>("/locations/addresses/", data);
    return extractApiData<SavedAddress>(res);
  } catch (error) {
    console.error("Failed to create saved address:", error);
    throw error;
  }
}

export async function deleteSavedAddress(id: string): Promise<void> {
  await apiClient.delete(`/locations/addresses/${id}/`);
}
