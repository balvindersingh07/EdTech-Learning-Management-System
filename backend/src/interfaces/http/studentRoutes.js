import { Router } from "express";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/requireRole.js";
import { domainEvents, EventNames } from "../../patterns/observer/DomainEvents.js";
import { AssignmentWorkflow } from "../../patterns/state/AssignmentSubmissionState.js";

export function createStudentRouter(deps) {
  const { store, courseRepo } = deps;
  const r = Router();
  const auth = createAuthMiddleware();

  r.use(auth, requireRole("student"));

  r.get("/courses/catalog", async (_req, res) => {
    const list = store.listCatalogCourses();
    return res.json(list);
  });

  r.get("/courses/:courseId", async (req, res) => {
    const course = await courseRepo.getById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.json(course);
  });

  r.post("/enrollments", async (req, res) => {
    const studentId = req.user.sub;
    const { courseId } = req.body ?? {};
    if (!courseId) return res.status(400).json({ message: "courseId required" });
    const course = store.getCourse(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await store.withWrite(async () => {
      store.enrollStudent(studentId, courseId);
    });
    return res.json({ ok: true });
  });

  r.get("/assignments", (_req, res) => {
    const studentId = req.user.sub;
    const list = store.listStudentAssignments(studentId);
    return res.json(list);
  });

  r.post("/assignments/:assignmentId/submit", async (req, res) => {
    const studentId = req.user.sub;
    const { assignmentId } = req.params;
    const { fileName } = req.body ?? {};
    if (!fileName) return res.status(400).json({ message: "fileName required" });

    const assignment = store.assignments.get(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const allowed = store.getStudentCourseIds(studentId);
    if (!allowed.has(assignment.courseId)) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    if (store.findSubmission(assignmentId, studentId)) {
      return res.status(409).json({ message: "Already submitted" });
    }

    const wf = new AssignmentWorkflow();
    try {
      wf.submit();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const student = store.getUserById(studentId);
    const course = store.getCourse(assignment.courseId);
    const instructor = course ? store.getUserById(course.instructorId) : undefined;

    await store.withWrite(async () => {
      store.upsertSubmission({
        assignmentId,
        studentId,
        studentName: student?.name ?? "Student",
        submittedAt: new Date().toISOString(),
        fileName,
      });
      const a = store.assignments.get(assignmentId);
      if (a) {
        a.status = "submitted";
        store.assignments.set(assignmentId, a);
      }
    });

    domainEvents.emit(EventNames.ASSIGNMENT_SUBMITTED, {
      studentName: student?.name,
      assignmentTitle: assignment.title,
      instructorEmail: instructor?.email,
    });

    return res.json({ ok: true });
  });

  return r;
}
