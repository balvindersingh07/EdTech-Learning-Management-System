import type { NotificationItem } from "@/types";
import { api } from "./api";

export const notificationService = {
  async list(): Promise<NotificationItem[]> {
    const { data } = await api.get<NotificationItem[]>("/v1/notifications");
    return data;
  },
};
