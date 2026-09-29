import { apiClient, extractApiData } from "./client";
import { Booking, BookingStatus } from "@/types";

export interface CreateBookingData {
  provider_id: string;
  service_name: string;
  scheduled_date?: string;
  scheduled_time?: string;
  address_text: string;
  notes?: string;
  price?: number;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const res = await apiClient.get<any>("/bookings/");
    const list = extractApiData<Booking[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Bookings API error:", error);
    return [];
  }
}

export async function getBookingById(idOrOrderNumber: string): Promise<Booking | null> {
  try {
    const res = await apiClient.get<any>(`/bookings/${idOrOrderNumber}/`);
    const data = extractApiData<Booking>(res);
    if (data && (data.id || data.orderNumber)) {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Booking ${idOrOrderNumber} error:`, error);
    return null;
  }
}

export async function createDirectBooking(data: CreateBookingData): Promise<Booking> {
  const res = await apiClient.post<any>("/bookings/", data);
  const created = extractApiData<Booking>(res);
  if (!created) throw new Error("Buyurtma yaratilmadi");
  return created;
}

export async function updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
  const res = await apiClient.post<any>(`/bookings/${id}/advance_status/`, {
    target_status: status,
    notes,
  });
  const data = extractApiData<Booking>(res);
  if (!data) throw new Error("Status yangilanmadi");
  return data;
}

export async function cancelBooking(id: string, reason = "Bekor qilindi"): Promise<void> {
  await apiClient.post(`/bookings/${id}/cancel/`, { reason });
}
