import type { Assignment } from "@/types";
import { api } from "../api";

export const studentAssignmentService = {
  async list(): Promise<Assignment[]> {
    const { data } = await api.get<Assignment[]>("/v1/student/assignments");
    return data;
  },
  async submit(assignmentId: string, fileName: string): Promise<{ ok: boolean }> {
    const { data } = await api.post<{ ok: boolean }>(`/v1/student/assignments/${assignmentId}/submit`, {
      fileName,
    });
    return data;
  },
};
