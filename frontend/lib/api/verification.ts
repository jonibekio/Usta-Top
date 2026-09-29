import { apiClient, extractApiData } from "./client";

export interface VerificationRequest {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  categoryName: string;
  passportSerial: string;
  passportPhotoUrl?: string;
  facePhotoUrl?: string;
  certificates: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

export async function getVerifications(): Promise<VerificationRequest[]> {
  try {
    const res = await apiClient.get<any>("/admin/verifications/");
    const list = extractApiData<any[]>(res);
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      id: String(item.id),
      providerId: String(item.provider?.id || item.provider || ""),
      providerName: item.provider?.displayName || item.provider?.name || "Usta",
      providerAvatar: item.provider?.avatar || "",
      categoryName: item.categoryName || item.category_name || "Xizmat",
      passportSerial: item.passportSerial || item.passport_serial || "",
      passportPhotoUrl: item.passportPhotoUrl || item.passport_photo_url || "",
      facePhotoUrl: item.facePhotoUrl || item.face_photo_url || "",
      certificates: item.certificates || [],
      status: item.status || "PENDING",
      submittedAt: item.createdAt || item.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Verifications fetch error:", error);
    return [];
  }
}

export async function approveVerification(id: string): Promise<void> {
  await apiClient.post(`/admin/verifications/${id}/approve/`);
}

export async function rejectVerification(id: string, reason = "Hujjatlar to‘liq emas"): Promise<void> {
  await apiClient.post(`/admin/verifications/${id}/reject/`, { reason });
}
