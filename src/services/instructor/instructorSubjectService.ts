import type { SubjectOption } from "@/types";
import { api } from "../api";

export const instructorSubjectService = {
  async create(name: string): Promise<SubjectOption> {
    const { data } = await api.post<SubjectOption>("/v1/instructor/subjects", { name });
    return data;
  },
};
