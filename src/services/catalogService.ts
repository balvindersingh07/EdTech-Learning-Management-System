import type { SubjectOption } from "@/types";
import { api } from "./api";

export const catalogService = {
  async listSubjects(): Promise<SubjectOption[]> {
    const { data } = await api.get<SubjectOption[]>("/v1/catalog/subjects");
    return data;
  },
};
