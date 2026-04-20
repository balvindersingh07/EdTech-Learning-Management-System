export const seedData = {
  users: [
    {
      id: "u-admin",
      name: "System Admin",
      email: "admin@lms.local",
      password: "Admin@123",
      role: "admin",
      accountStatus: "active",
    },
  ],
  customSubjects: [],
  courses: [
    {
      id: "lms-course-full-stack",
      title: "Full-Stack Web Development",
      slug: "full-stack-web",
      instructorId: "u-admin",
      instructorName: "System Admin",
      subject: "lms-subj-engineering",
      subjectName: "Engineering",
      isBuiltIn: true,
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
          id: "lms-mod-fs-foundations",
          title: "Foundations",
          lectures: [
            { id: "lms-lec-fs-1", title: "How the web works", durationMin: 18, type: "video" },
            { id: "lms-lec-fs-2", title: "HTTP & REST recap", durationMin: 22, type: "reading" },
          ],
        },
        {
          id: "lms-mod-fs-react",
          title: "React deep dive",
          lectures: [
            { id: "lms-lec-fs-3", title: "Hooks in production", durationMin: 35, type: "video" },
            { id: "lms-lec-fs-4", title: "State machines", durationMin: 28, type: "video" },
            { id: "lms-lec-fs-5", title: "Quiz: React patterns", durationMin: 12, type: "quiz" },
          ],
        },
      ],
    },
    {
      id: "lms-course-dsa",
      title: "Data Structures & Algorithms",
      slug: "dsa-mastery",
      instructorId: "u-admin",
      instructorName: "System Admin",
      subject: "lms-subj-computer-science",
      subjectName: "Computer Science",
      isBuiltIn: true,
      description: "Strengthen problem-solving with arrays, trees, graphs, and dynamic programming.",
      level: "Advanced",
      category: "Computer Science",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
      progressPercent: 34,
      enrolledCount: 2631,
      rating: 4.7,
      modules: [
        {
          id: "lms-mod-dsa-core",
          title: "Core structures",
          lectures: [
            { id: "lms-lec-dsa-1", title: "Big-O intuition", durationMin: 20, type: "video" },
            { id: "lms-lec-dsa-2", title: "Stacks & queues", durationMin: 26, type: "video" },
          ],
        },
      ],
    },
    {
      id: "lms-course-pm",
      title: "Product Management Essentials",
      slug: "pm-essentials",
      instructorId: "u-admin",
      instructorName: "System Admin",
      subject: "lms-subj-product",
      subjectName: "Product",
      isBuiltIn: true,
      description: "Ship outcomes, not outputs. Learn discovery, prioritization, and stakeholder management.",
      level: "Beginner",
      category: "Product",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      enrolledCount: 942,
      rating: 4.6,
      modules: [
        {
          id: "lms-mod-pm-discovery",
          title: "Discovery",
          lectures: [{ id: "lms-lec-pm-1", title: "Problem framing", durationMin: 24, type: "video" }],
        },
      ],
    },
  ],
  assignments: [
    {
      id: "lms-assign-fs-rest",
      courseId: "lms-course-full-stack",
      courseTitle: "Full-Stack Web Development",
      title: "REST API design exercise",
      dueAt: "2026-04-22T23:59:00Z",
      status: "pending",
      maxScore: 100,
    },
    {
      id: "lms-assign-fs-react-lab",
      courseId: "lms-course-full-stack",
      courseTitle: "Full-Stack Web Development",
      title: "React state management lab",
      dueAt: "2026-04-18T23:59:00Z",
      status: "submitted",
      maxScore: 100,
    },
    {
      id: "lms-assign-dsa-contest",
      courseId: "lms-course-dsa",
      courseTitle: "Data Structures & Algorithms",
      title: "Weekly contest #6",
      dueAt: "2026-04-20T23:59:00Z",
      status: "graded",
      maxScore: 100,
      score: 88,
    },
  ],
  submissions: [],
  notifications: [
    {
      id: "lms-notif-1",
      title: "Welcome",
      body: "Use the catalog to enroll. Built-in courses use lms-* prefixed identifiers.",
      createdAt: "2026-04-17T09:30:00Z",
      read: false,
    },
  ],
  activityLog: [
    {
      id: "lms-act-1",
      actor: "System Admin",
      action: "Policy",
      target: "Student & instructor self-registration requires admin approval",
      createdAt: "2026-04-17T11:22:00Z",
    },
  ],
  platformUsers: [
    {
      id: "u-admin",
      name: "System Admin",
      email: "admin@lms.local",
      role: "admin",
      status: "active",
      lastActive: "2026-04-17T10:12:00Z",
    },
  ],
};
