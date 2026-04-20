import type { ActivityLogEntry, PlatformUserRow } from "@/types";
import { api } from "../api";

export interface AdminStats {
  users: number;
  courses: number;
  assignments: number;
}

export const adminService = {
  async stats(): Promise<AdminStats> {
    const { data } = await api.get<AdminStats>("/v1/admin/stats");
    return data;
  },
  async listUsers(): Promise<PlatformUserRow[]> {
    const { data } = await api.get<PlatformUserRow[]>("/v1/admin/users");
    return data;
  },
  async approveUser(userId: string): Promise<void> {
    await api.post(`/v1/admin/users/${encodeURIComponent(userId)}/approve`);
  },
  async rejectUser(userId: string): Promise<void> {
    await api.post(`/v1/admin/users/${encodeURIComponent(userId)}/reject`);
  },
  async activity(): Promise<ActivityLogEntry[]> {
    const { data } = await api.get<ActivityLogEntry[]>("/v1/admin/activity");
    return data;
  },
  async reportSummary(format: "html" | "json" = "html"): Promise<string> {
    const res = await api.get<string>("/v1/admin/reports/summary", {
      params: { format },
      responseType: "text",
      transformResponse: [(d) => d],
    });
    return res.data;
  },
};
