import type { Course } from "@/types";
import { api } from "../api";

export const studentCourseService = {
  async catalog(): Promise<Course[]> {
    const { data } = await api.get<Course[]>("/v1/student/courses/catalog");
    return data;
  },
  async getById(id: string): Promise<Course> {
    const { data } = await api.get<Course>(`/v1/student/courses/${id}`);
    return data;
  },
  async enroll(courseId: string): Promise<{ ok: boolean }> {
    const { data } = await api.post<{ ok: boolean }>("/v1/student/enrollments", { courseId });
    return data;
  },
};
