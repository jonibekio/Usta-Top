import { apiClient, extractApiData } from "./client";

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  qualityRating?: number;
  punctualityRating?: number;
  priceRating?: number;
}

export async function createBookingReview(bookingId: string, payload: CreateReviewPayload): Promise<any> {
  const res = await apiClient.post<any>(`/bookings/${bookingId}/review/`, {
    rating: payload.rating,
    comment: payload.comment,
    qualityRating: payload.qualityRating ?? payload.rating,
    punctualityRating: payload.punctualityRating ?? payload.rating,
    priceRating: payload.priceRating ?? payload.rating,
  });
  return extractApiData(res);
}

export async function getProviderReviews(providerId: string): Promise<any[]> {
  try {
    const res = await apiClient.get<any>(`/providers/${providerId}/reviews/`);
    const data = extractApiData<any[]>(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load provider reviews:", error);
    return [];
  }
}
