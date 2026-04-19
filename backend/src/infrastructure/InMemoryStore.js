/**
 * In-memory persistence (development / capstone demo).
 * Writes are serialized with a simple async lock to avoid lost updates under concurrent requests.
 */
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
    /** @type {Map<string, Set<string>>} studentId -> courseIds */
    this.studentEnrollments = new Map();
    this.studentEnrollments.set("u1", new Set(["c1", "c2"]));
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
}
