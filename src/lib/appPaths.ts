import type { UserRole } from "@/types";

export function appRoot(role: UserRole) {
  return `/app/${role}`;
}

export function studentPaths() {
  const r = appRoot("student");
  return {
    dashboard: `${r}/dashboard`,
    courses: `${r}/courses`,
    course: (id: string) => `${r}/courses/${id}`,
    assignments: `${r}/assignments`,
    submit: (id: string) => `${r}/assignments/${id}/submit`,
  };
}

export function instructorPaths() {
  const r = appRoot("instructor");
  return {
    dashboard: `${r}/dashboard`,
    courses: `${r}/courses`,
    courseNew: `${r}/courses/new`,
    courseEdit: (id: string) => `${r}/courses/${id}/edit`,
    course: (id: string) => `${r}/courses/${id}`,
    assignments: `${r}/assignments`,
    grade: (id: string) => `${r}/assignments/${id}/grade`,
    reports: `${r}/reports`,
  };
}

export function adminPaths() {
  const r = appRoot("admin");
  return {
    dashboard: `${r}/dashboard`,
    users: `${r}/users`,
    reports: `${r}/reports`,
  };
}

export function pathsForRole(role: UserRole) {
  if (role === "student") return studentPaths();
  if (role === "instructor") return instructorPaths();
  return adminPaths();
}
