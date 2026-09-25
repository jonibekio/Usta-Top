import { apiClient, extractApiData } from "./client";
import { Booking, BookingStatus } from "@/types";
import { MOCK_BOOKINGS } from "../mock-data/bookings";

export async function getBookings(): Promise<Booking[]> {
  try {
    const res = await apiClient.get<any>("/bookings/");
    const list = extractApiData<Booking[]>(res);
    if (Array.isArray(list)) {
      return list;
    }
    return MOCK_BOOKINGS;
  } catch (error) {
    console.warn("Bookings API unreachable, using fallback:", error);
    return MOCK_BOOKINGS;
  }
}

export async function getBookingById(idOrOrderNumber: string): Promise<Booking | null> {
  try {
    const res = await apiClient.get<any>(`/bookings/${idOrOrderNumber}/`);
    const data = extractApiData<Booking>(res);
    if (data && (data.id || data.orderNumber)) {
      return data;
    }
    return (
      MOCK_BOOKINGS.find(
        (b) => b.id === idOrOrderNumber || b.orderNumber === idOrOrderNumber || b.requestId === idOrOrderNumber
      ) || null
    );
  } catch (error) {
    console.warn(`Booking ${idOrOrderNumber} unreachable, using fallback:`, error);
    return (
      MOCK_BOOKINGS.find(
        (b) => b.id === idOrOrderNumber || b.orderNumber === idOrOrderNumber || b.requestId === idOrOrderNumber
      ) || null
    );
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  try {
    const res = await apiClient.patch<any>(`/bookings/${id}/`, { status });
    const data = extractApiData<Booking>(res);
    if (data && data.id) {
      return data;
    }
    const booking = MOCK_BOOKINGS.find((b) => b.id === id) || MOCK_BOOKINGS[0];
    return { ...booking, status };
  } catch (error) {
    console.warn(`Failed to update booking ${id}, updating state:`, error);
    const booking = MOCK_BOOKINGS.find((b) => b.id === id) || MOCK_BOOKINGS[0];
    return {
      ...booking,
      status,
    };
  }
}
