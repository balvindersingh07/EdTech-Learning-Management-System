import type { Assignment } from "@/types";
import { api } from "../api";

export interface SubmissionBundle {
  assignment: Assignment;
  submission: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    submittedAt: string;
    fileName: string;
    score?: number;
    feedback?: string;
  };
}

export const instructorAssignmentService = {
  async list(): Promise<Assignment[]> {
    const { data } = await api.get<Assignment[]>("/v1/instructor/assignments");
    return data;
  },
  async listSubmissions(assignmentId: string): Promise<SubmissionBundle["submission"][]> {
    const { data } = await api.get<SubmissionBundle["submission"][]>(
      `/v1/instructor/assignments/${assignmentId}/submissions`,
    );
    return data;
  },
  async getSubmission(assignmentId: string, studentId: string): Promise<SubmissionBundle> {
    const { data } = await api.get<SubmissionBundle>(
      `/v1/instructor/assignments/${assignmentId}/submissions/${studentId}`,
    );
    return data;
  },
  async grade(
    assignmentId: string,
    studentId: string,
    body: { score?: number; feedback?: string; strategy?: "numeric" | "rubric"; rubricBand?: string },
  ): Promise<{ ok: boolean; score: number; feedback: string }> {
    const { data } = await api.post<{ ok: boolean; score: number; feedback: string }>(
      `/v1/instructor/assignments/${assignmentId}/students/${studentId}/grade`,
      body,
    );
    return data;
  },
};
