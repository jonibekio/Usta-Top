import { apiClient, extractApiData } from "./client";
import { Quote } from "@/types";

export async function getQuotesForRequest(requestId: string): Promise<Quote[]> {
  try {
    const res = await apiClient.get<any>(`/requests/${requestId}/quotes/`);
    const list = extractApiData<Quote[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Quotes API error:", error);
    return [];
  }
}

export async function createQuote(
  requestId: string,
  data: {
    serviceFee: number;
    partsFee?: number;
    additionalAmount?: number;
    arrivalTime?: string;
    warranty?: string;
    notes?: string;
  }
): Promise<Quote> {
  const res = await apiClient.post<any>(`/requests/${requestId}/quotes/`, data);
  const quote = extractApiData<Quote>(res);
  if (!quote) throw new Error("Taklif yuborilmadi");
  return quote;
}

export async function acceptQuote(quoteId: string): Promise<Quote> {
  const res = await apiClient.post<any>(`/quotes/${quoteId}/accept/`);
  const data = extractApiData<Quote>(res);
  if (!data) throw new Error("Smeta qabul qilinmadi");
  return data;
}

export async function rejectQuote(quoteId: string): Promise<Quote> {
  const res = await apiClient.post<any>(`/quotes/${quoteId}/reject/`);
  const data = extractApiData<Quote>(res);
  if (!data) throw new Error("Smeta rad etilmadi");
  return data;
}
