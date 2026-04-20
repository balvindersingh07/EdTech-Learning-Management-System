import type { InstructorTeachingSummary } from "@/types";
import { api } from "../api";

export const instructorReportService = {
  async teachingSummary(): Promise<InstructorTeachingSummary> {
    const { data } = await api.get<InstructorTeachingSummary>("/v1/instructor/reports/summary");
    return data;
  },
};
