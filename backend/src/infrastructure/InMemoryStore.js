/**
 * In-memory persistence (development / capstone demo).
 * Writes are serialized with a simple async lock to avoid lost updates under concurrent requests.
 */
import { BUILT_IN_SUBJECTS } from "./builtInSubjects.js";

export class InMemoryStore {
  constructor(seed) {
    this._lock = Promise.resolve();
    this.users = new Map(seed.users.map((u) => [u.id, { ...u }]));
    this.usersByEmail = new Map(seed.users.map((u) => [u.email.toLowerCase(), u.id]));
    this.courses = new Map(seed.courses.map((c) => [c.id, structuredClone(c)]));
    this.assignments = new Map(seed.assignments.map((a) => [a.id, structuredClone(a)]));
    this.submissions = structuredClone(seed.submissions);
    this.notifications = structuredClone(seed.notifications);
    this.activityLog = structuredClone(seed.activityLog);
    this.platformUsers = structuredClone(seed.platformUsers);
    /** @type {{ code: string; name: string }[]} */
    this.customSubjects = structuredClone(seed.customSubjects ?? []);
    /** @type {Map<string, Set<string>>} studentId -> courseIds */
    this.studentEnrollments = new Map();
  }

  /**
   * Rehydrate from Prisma snapshot JSON (see exportState).
   * @param {ReturnType<InMemoryStore["exportState"]>} data
   */
  static fromExportedState(data) {
    const empty = {
      users: [],
      courses: [],
      assignments: [],
      submissions: [],
      notifications: [],
      activityLog: [],
      platformUsers: [],
      customSubjects: [],
    };
    const s = new InMemoryStore(empty);
    s.importState(data);
    return s;
  }

  /** @returns {object} Serializable plain object for Prisma snapshot */
  exportState() {
    return {
      users: [...this.users.values()],
      courses: [...this.courses.values()],
      assignments: [...this.assignments.values()],
      submissions: structuredClone(this.submissions),
      notifications: structuredClone(this.notifications),
      activityLog: structuredClone(this.activityLog),
      platformUsers: structuredClone(this.platformUsers),
      customSubjects: structuredClone(this.customSubjects),
      studentEnrollments: Object.fromEntries(
        [...this.studentEnrollments.entries()].map(([k, v]) => [k, [...v]]),
      ),
    };
  }

  /** @param {ReturnType<InMemoryStore["exportState"]>} data */
  importState(data) {
    this.users = new Map((data.users ?? []).map((u) => [u.id, { ...u }]));
    this.usersByEmail = new Map((data.users ?? []).map((u) => [String(u.email).toLowerCase(), u.id]));
    this.courses = new Map((data.courses ?? []).map((c) => [c.id, structuredClone(c)]));
    this.assignments = new Map((data.assignments ?? []).map((a) => [a.id, structuredClone(a)]));
    this.submissions = structuredClone(data.submissions ?? []);
    this.notifications = structuredClone(data.notifications ?? []);
    this.activityLog = structuredClone(data.activityLog ?? []);
    this.platformUsers = structuredClone(data.platformUsers ?? []);
    this.customSubjects = structuredClone(data.customSubjects ?? []);
    this.studentEnrollments = new Map(
      Object.entries(data.studentEnrollments ?? {}).map(([k, v]) => [k, new Set(Array.isArray(v) ? v : [])]),
    );
  }

  listSubjects() {
    return [
      ...BUILT_IN_SUBJECTS.map((s) => ({ code: s.code, name: s.name, builtIn: true })),
      ...this.customSubjects.map((s) => ({ ...s, builtIn: false })),
    ];
  }

  /**
   * @param {string} name
   * @returns {{ code: string; name: string; builtIn: boolean }}
   */
  addCustomSubject(name) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "subject";
    const code = `lms-subj-${slug}-${Math.random().toString(36).slice(2, 8)}`;
    const row = { code, name: name.trim() };
    this.customSubjects.push(row);
    return { ...row, builtIn: false };
  }

  /**
   * @param {string} instructorId
   * @param {number} limit
   */
  countSubmissionsForInstructor(instructorId) {
    const ownedCourseIds = new Set(
      [...this.courses.values()].filter((c) => c.instructorId === instructorId).map((c) => c.id),
    );
    const assignmentIds = new Set(
      [...this.assignments.values()].filter((a) => ownedCourseIds.has(a.courseId)).map((a) => a.id),
    );
    return this.submissions.filter((s) => assignmentIds.has(s.assignmentId)).length;
  }

  listRecentSubmissionsForInstructor(instructorId, limit = 12) {
    const ownedCourseIds = new Set(
      [...this.courses.values()].filter((c) => c.instructorId === instructorId).map((c) => c.id),
    );
    const assignmentIds = new Set(
      [...this.assignments.values()].filter((a) => ownedCourseIds.has(a.courseId)).map((a) => a.id),
    );
    return [...this.submissions]
      .filter((s) => assignmentIds.has(s.assignmentId))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, limit)
      .map((s) => {
        const a = this.assignments.get(s.assignmentId);
        return {
          ...s,
          assignmentTitle: a?.title ?? s.assignmentId,
          courseId: a?.courseId,
        };
      });
  }

  async withWrite(fn) {
    const previous = this._lock;
    let release;
    this._lock = new Promise((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await fn();
    } finally {
      release();
    }
  }

  getUserByEmail(email) {
    const id = this.usersByEmail.get(email.toLowerCase());
    return id ? this.users.get(id) : undefined;
  }

  addUser(user) {
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email.toLowerCase(), user.id);
  }

  getUserById(id) {
    return this.users.get(id);
  }

  listCatalogCourses() {
    return [...this.courses.values()];
  }

  listInstructorCourses(instructorId) {
    return [...this.courses.values()].filter((c) => c.instructorId === instructorId);
  }

  getCourse(id) {
    return this.courses.get(id);
  }

  upsertCourse(course) {
    this.courses.set(course.id, course);
  }

  getStudentCourseIds(studentId) {
    return this.studentEnrollments.get(studentId) ?? new Set();
  }

  enrollStudent(studentId, courseId) {
    if (!this.studentEnrollments.has(studentId)) {
      this.studentEnrollments.set(studentId, new Set());
    }
    this.studentEnrollments.get(studentId).add(courseId);
  }

  listStudentAssignments(studentId) {
    const ids = this.getStudentCourseIds(studentId);
    return [...this.assignments.values()].filter((a) => ids.has(a.courseId));
  }

  listInstructorAssignments(instructorId) {
    const owned = new Set(
      [...this.courses.values()].filter((c) => c.instructorId === instructorId).map((c) => c.id),
    );
    return [...this.assignments.values()].filter((a) => owned.has(a.courseId));
  }

  findSubmission(assignmentId, studentId) {
    return this.submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
  }

  upsertSubmission(submission) {
    const idx = this.submissions.findIndex(
      (s) => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId,
    );
    if (idx >= 0) this.submissions[idx] = submission;
    else this.submissions.push(submission);
  }

  /**
   * @param {string} userId
   * @param {"active" | "rejected"} next
   */
  setAccountStatus(userId, next) {
    const user = this.users.get(userId);
    if (!user || user.role === "admin") return false;
    user.accountStatus = next;
    const row = this.platformUsers.find((p) => p.id === userId);
    if (row) {
      row.status = next === "active" ? "active" : "rejected";
      row.lastActive = new Date().toISOString();
    }
    return true;
  }
}
