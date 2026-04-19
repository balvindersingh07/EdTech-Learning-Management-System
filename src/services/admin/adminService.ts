import type { ActivityLogEntry, PlatformUserRow } from "@/types";
import { api } from "../api";

export const adminService = {
  async listUsers(): Promise<PlatformUserRow[]> {
    const { data } = await api.get<PlatformUserRow[]>("/v1/admin/users");
    return data;
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
