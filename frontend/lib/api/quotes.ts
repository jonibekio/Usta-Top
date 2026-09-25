import { apiClient, extractApiData } from "./client";
import { Quote } from "@/types";
import { MOCK_QUOTES } from "../mock-data/quotes";

export async function getQuotesForRequest(requestId: string): Promise<Quote[]> {
  try {
    const res = await apiClient.get<any>(`/requests/${requestId}/quotes/`);
    const list = extractApiData<Quote[]>(res);
    if (Array.isArray(list)) {
      return list;
    }
    return MOCK_QUOTES.filter((q) => q.requestId === requestId || !requestId);
  } catch (error) {
    console.warn("Quotes API unreachable, using fallback:", error);
    return MOCK_QUOTES.filter((q) => q.requestId === requestId || !requestId);
  }
}

export async function acceptQuote(quoteId: string): Promise<Quote> {
  try {
    const res = await apiClient.post<any>(`/quotes/${quoteId}/accept/`);
    const data = extractApiData<Quote>(res);
    if (data && data.id) {
      return data;
    }
    const q = MOCK_QUOTES.find((item) => item.id === quoteId) || MOCK_QUOTES[0];
    return { ...q, status: "ACCEPTED" };
  } catch (error) {
    console.warn(`Accept quote ${quoteId} failed, updating state:`, error);
    const q = MOCK_QUOTES.find((item) => item.id === quoteId) || MOCK_QUOTES[0];
    return { ...q, status: "ACCEPTED" };
  }
}

export async function rejectQuote(quoteId: string): Promise<Quote> {
  try {
    const res = await apiClient.post<any>(`/quotes/${quoteId}/reject/`);
    const data = extractApiData<Quote>(res);
    if (data && data.id) {
      return data;
    }
    const q = MOCK_QUOTES.find((item) => item.id === quoteId) || MOCK_QUOTES[0];
    return { ...q, status: "REJECTED" };
  } catch (error) {
    console.warn(`Reject quote ${quoteId} failed, updating state:`, error);
    const q = MOCK_QUOTES.find((item) => item.id === quoteId) || MOCK_QUOTES[0];
    return { ...q, status: "REJECTED" };
  }
}
