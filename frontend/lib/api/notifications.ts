import { apiClient, extractApiData } from "./client";

export interface NotificationItem {
  id: string;
  notificationType: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await apiClient.get<any>("/notifications/");
    const data = extractApiData<any[]>(res);
    if (!Array.isArray(data)) return [];
    return data.map((n) => ({
      id: String(n.id),
      notificationType: n.notification_type || n.notificationType || "INFO",
      title: n.title,
      body: n.body,
      data: n.data || {},
      isRead: !!n.is_read || !!n.isRead,
      createdAt: n.created_at || n.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const res = await apiClient.get<any>("/notifications/unread-count/");
    const data = extractApiData<{ unreadCount: number }>(res);
    return data?.unreadCount ?? 0;
  } catch {
    return 0;
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await apiClient.post(`/notifications/${id}/read/`);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await apiClient.post("/notifications/read-all/");
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}
