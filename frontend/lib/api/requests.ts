import { apiClient, extractApiData } from "./client";
import { ServiceRequest } from "@/types";

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const res = await apiClient.get<any>("/requests/");
    const list = extractApiData<ServiceRequest[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Requests API error:", error);
    return [];
  }
}

export async function getServiceRequestById(idOrCode: string): Promise<ServiceRequest | null> {
  try {
    const res = await apiClient.get<any>(`/requests/${idOrCode}/`);
    const data = extractApiData<ServiceRequest>(res);
    if (data && (data.id || data.code)) {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Request ${idOrCode} error:`, error);
    return null;
  }
}

export async function createServiceRequest(data: Partial<ServiceRequest> & { phone?: string }): Promise<ServiceRequest> {
  const res = await apiClient.post<any>("/requests/", data);
  const created = extractApiData<ServiceRequest>(res);
  if (!created) {
    throw new Error("Buyurtma yaratilmadi");
  }
  return created;
}

export async function cancelServiceRequest(idOrCode: string, reason = "Mijoz tomonidan bekor qilindi"): Promise<void> {
  await apiClient.post(`/requests/${idOrCode}/cancel/`, { reason });
}
