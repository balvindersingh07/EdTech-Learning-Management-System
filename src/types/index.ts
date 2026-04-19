export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ModuleLecture {
  id: string;
  title: string;
  durationMin: number;
  type: "video" | "reading" | "quiz";
}

export interface CourseModule {
  id: string;
  title: string;
  lectures: ModuleLecture[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  instructorId: string;
  instructorName: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnailUrl: string;
  progressPercent?: number;
  modules: CourseModule[];
  enrolledCount: number;
  rating: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueAt: string;
  status: "pending" | "submitted" | "graded";
  maxScore: number;
  score?: number;
}

export interface Submission {
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileName: string;
  score?: number;
  feedback?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface ActivityLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface PlatformUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}
