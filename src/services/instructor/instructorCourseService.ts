import type { Course } from "@/types";
import { api } from "../api";

export const instructorCourseService = {
  async listMine(): Promise<Course[]> {
    const { data } = await api.get<Course[]>("/v1/instructor/courses");
    return data;
  },
  async getById(id: string): Promise<Course> {
    const { data } = await api.get<Course>(`/v1/instructor/courses/${id}`);
    return data;
  },
  async create(body: Partial<Course>): Promise<Course> {
    const { data } = await api.post<Course>("/v1/instructor/courses", body);
    return data;
  },
  async update(id: string, body: Partial<Course>): Promise<Course> {
    const { data } = await api.put<Course>(`/v1/instructor/courses/${id}`, body);
    return data;
  },
};
