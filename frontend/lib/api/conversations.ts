import { apiClient, extractApiData } from "./client";
import { Conversation, ChatMessage } from "@/types";

export async function getConversations(): Promise<Conversation[]> {
  try {
    const res = await apiClient.get<any>("/conversations/");
    const list = extractApiData<Conversation[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Conversations API error:", error);
    return [];
  }
}

export async function getConversationMessages(convId: string): Promise<ChatMessage[]> {
  try {
    const res = await apiClient.get<any>(`/conversations/${convId}/messages/`);
    const list = extractApiData<ChatMessage[]>(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Messages API error:", error);
    return [];
  }
}

export async function sendMessage(convId: string, text: string): Promise<ChatMessage> {
  const res = await apiClient.post<any>(`/conversations/${convId}/messages/`, { text });
  const data = extractApiData<ChatMessage>(res);
  if (!data) throw new Error("Xabar yuborilmadi");
  return data;
}

export async function startConversation(providerId: string, initialMessage?: string): Promise<Conversation> {
  const res = await apiClient.post<any>("/conversations/", {
    provider_id: providerId,
    initialMessage,
  });
  const data = extractApiData<Conversation>(res);
  if (!data) throw new Error("Muloqot yaratilmadi");
  return data;
}
