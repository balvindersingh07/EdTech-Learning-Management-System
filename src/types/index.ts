export type UserRole = "student" | "instructor" | "admin";

/** Subject / discipline — built-in codes use the `lms-subj-` prefix; instructors may add more. */
export interface SubjectOption {
  code: string;
  name: string;
  builtIn?: boolean;
}

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
  /** Subject code (e.g. lms-subj-engineering) */
  subject?: string;
  subjectName?: string;
  /** Seeded catalog entries; not editable via instructor API */
  isBuiltIn?: boolean;
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

/** Instructor dashboard — submission row from GET /instructor/submissions/recent */
export interface InstructorRecentSubmission extends Submission {
  assignmentTitle: string;
  courseId?: string;
}

/** GET /instructor/reports/summary */
export interface InstructorTeachingSummary {
  courseCount: number;
  assignmentCount: number;
  submissionCount: number;
  gradingPending: number;
  courses: {
    id: string;
    title: string;
    enrolledCount: number;
    subjectName: string;
    barPercent: number;
  }[];
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
  status: "active" | "invited" | "suspended" | "pending" | "rejected";
  lastActive: string;
}
