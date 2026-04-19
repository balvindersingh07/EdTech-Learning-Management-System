import type {
  ActivityLogEntry,
  Assignment,
  Course,
  NotificationItem,
  PlatformUserRow,
  Submission,
  User,
} from "@/types";

export const dummyUsers: User[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "student",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "instructor",
  },
  {
    id: "u3",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "admin",
  },
];

export const dummyCourses: Course[] = [
  {
    id: "c1",
    title: "Full-Stack Web Development",
    slug: "full-stack-web",
    instructorId: "u2",
    instructorName: "Priya Sharma",
    description:
      "Build modern web apps with React, Node.js, and PostgreSQL. Includes capstone project and code reviews.",
    level: "Intermediate",
    category: "Engineering",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    progressPercent: 62,
    enrolledCount: 1842,
    rating: 4.8,
    modules: [
      {
        id: "m1",
        title: "Foundations",
        lectures: [
          { id: "l1", title: "How the web works", durationMin: 18, type: "video" },
          { id: "l2", title: "HTTP & REST recap", durationMin: 22, type: "reading" },
        ],
      },
      {
        id: "m2",
        title: "React deep dive",
        lectures: [
          { id: "l3", title: "Hooks in production", durationMin: 35, type: "video" },
          { id: "l4", title: "State machines", durationMin: 28, type: "video" },
          { id: "l5", title: "Quiz: React patterns", durationMin: 12, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    slug: "dsa-mastery",
    instructorId: "u2",
    instructorName: "Priya Sharma",
    description:
      "Strengthen problem-solving with arrays, trees, graphs, and dynamic programming with weekly contests.",
    level: "Advanced",
    category: "Computer Science",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    progressPercent: 34,
    enrolledCount: 2631,
    rating: 4.7,
    modules: [
      {
        id: "m3",
        title: "Core structures",
        lectures: [
          { id: "l6", title: "Big-O intuition", durationMin: 20, type: "video" },
          { id: "l7", title: "Stacks & queues", durationMin: 26, type: "video" },
        ],
      },
    ],
  },
  {
    id: "c3",
    title: "Product Management Essentials",
    slug: "pm-essentials",
    instructorId: "u2",
    instructorName: "Priya Sharma",
    description:
      "Ship outcomes, not outputs. Learn discovery, prioritization, and stakeholder management.",
    level: "Beginner",
    category: "Product",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    enrolledCount: 942,
    rating: 4.6,
    modules: [
      {
        id: "m4",
        title: "Discovery",
        lectures: [
          { id: "l8", title: "Problem framing", durationMin: 24, type: "video" },
        ],
      },
    ],
  },
];

export const dummyAssignments: Assignment[] = [
  {
    id: "a1",
    courseId: "c1",
    courseTitle: "Full-Stack Web Development",
    title: "REST API design exercise",
    dueAt: "2026-04-22T23:59:00Z",
    status: "pending",
    maxScore: 100,
  },
  {
    id: "a2",
    courseId: "c1",
    courseTitle: "Full-Stack Web Development",
    title: "React state management lab",
    dueAt: "2026-04-18T23:59:00Z",
    status: "submitted",
    maxScore: 100,
  },
  {
    id: "a3",
    courseId: "c2",
    courseTitle: "Data Structures & Algorithms",
    title: "Weekly contest #6",
    dueAt: "2026-04-20T23:59:00Z",
    status: "graded",
    maxScore: 100,
    score: 88,
  },
];

export const dummySubmissions: Submission[] = [
  {
    assignmentId: "a2",
    studentId: "u1",
    studentName: "Alex Morgan",
    submittedAt: "2026-04-16T18:12:00Z",
    fileName: "state-lab.zip",
  },
];

export const dummyNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Assignment graded",
    body: "Your React state management lab received feedback.",
    createdAt: "2026-04-17T09:30:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "New lecture available",
    body: "Hooks in production is now unlocked in Full-Stack Web Development.",
    createdAt: "2026-04-16T14:05:00Z",
    read: true,
  },
  {
    id: "n3",
    title: "Reminder",
    body: "REST API design exercise is due in 5 days.",
    createdAt: "2026-04-15T08:00:00Z",
    read: true,
  },
];

export const dummyActivity: ActivityLogEntry[] = [
  {
    id: "act1",
    actor: "Jordan Lee",
    action: "Updated role",
    target: "Priya Sharma → instructor",
    createdAt: "2026-04-17T11:22:00Z",
  },
  {
    id: "act2",
    actor: "System",
    action: "Course published",
    target: "PM Essentials",
    createdAt: "2026-04-16T19:40:00Z",
  },
  {
    id: "act3",
    actor: "Alex Morgan",
    action: "Submitted assignment",
    target: "React state management lab",
    createdAt: "2026-04-16T18:12:00Z",
  },
];

export const dummyPlatformUsers: PlatformUserRow[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "student",
    status: "active",
    lastActive: "2026-04-17T10:12:00Z",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "instructor",
    status: "active",
    lastActive: "2026-04-17T09:05:00Z",
  },
  {
    id: "u4",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "student",
    status: "invited",
    lastActive: "2026-04-10T16:44:00Z",
  },
  {
    id: "u5",
    name: "Taylor Brooks",
    email: "taylor@example.com",
    role: "instructor",
    status: "suspended",
    lastActive: "2026-03-22T12:01:00Z",
  },
];

export const chartCourseViews = [
  { name: "Mon", views: 420 },
  { name: "Tue", views: 510 },
  { name: "Wed", views: 480 },
  { name: "Thu", views: 600 },
  { name: "Fri", views: 720 },
  { name: "Sat", views: 880 },
  { name: "Sun", views: 760 },
];

export const chartEnrollmentTrend = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 190 },
  { month: "Mar", enrollments: 240 },
  { month: "Apr", enrollments: 310 },
];
