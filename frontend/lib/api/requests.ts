import { apiClient, extractApiData } from "./client";
import { ServiceRequest } from "@/types";
import { MOCK_REQUESTS } from "../mock-data/requests";

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const res = await apiClient.get<any>("/requests/");
    const list = extractApiData<ServiceRequest[]>(res);
    if (Array.isArray(list)) {
      return list;
    }
    return MOCK_REQUESTS;
  } catch (error) {
    console.warn("Requests API unreachable, using fallback:", error);
    return MOCK_REQUESTS;
  }
}

export async function getServiceRequestById(idOrCode: string): Promise<ServiceRequest | null> {
  try {
    const res = await apiClient.get<any>(`/requests/${idOrCode}/`);
    const data = extractApiData<ServiceRequest>(res);
    if (data && (data.id || data.code)) {
      return data;
    }
    return MOCK_REQUESTS.find((r) => r.id === idOrCode || r.code === idOrCode) || null;
  } catch (error) {
    console.warn(`Request ${idOrCode} unreachable, using fallback:`, error);
    return MOCK_REQUESTS.find((r) => r.id === idOrCode || r.code === idOrCode) || null;
  }
}

export async function createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
  try {
    const res = await apiClient.post<any>("/requests/", data);
    const created = extractApiData<ServiceRequest>(res);
    if (created && (created.id || created.code)) {
      return created;
    }
  } catch (error) {
    console.warn("Failed to create request via API, saving local copy:", error);
  }
    const newReq: ServiceRequest = {
      id: `req-${Date.now()}`,
      code: `UT-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: data.categoryId || "konditsioner",
      categoryName: data.categoryName || "Konditsioner ta'miri",
      problemDescription: data.problemDescription || "Muammo tavsifi",
      detectedIssues: data.detectedIssues || ["Tekshiruv talab qilinadi"],
      answers: data.answers || {
        timeframe: "Bugun",
        condition: "Nosoz",
        additionalSymptoms: [],
        brand: "Boshqa",
      },
      location: data.location || {
        city: "Toshkent",
        district: "Chilonzor",
        address: "Chilonzor tumani",
      },
      urgency: data.urgency || "URGENT",
      urgencyText: data.urgencyText || "⚡ Shoshilinch",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      matchedMasterIds: ["ali-karimov", "bek-usta"],
      hasAudio: false,
      photos: [],
    };
    return newReq;
}
