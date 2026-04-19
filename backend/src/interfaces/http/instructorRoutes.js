import { Router } from "express";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/requireRole.js";
import { CourseBuilder } from "../../patterns/builder/CourseBuilder.js";
import { UserFactory } from "../../patterns/factory/UserFactory.js";
import {
  GradingContext,
  NumericGradingStrategy,
  RubricGradingStrategy,
} from "../../patterns/strategy/GradingStrategy.js";

export function createInstructorRouter(deps) {
  const { store } = deps;
  const r = Router();
  const auth = createAuthMiddleware();

  r.use(auth, requireRole("instructor"));

  r.get("/courses", (req, res) => {
    const list = store.listInstructorCourses(req.user.sub);
    return res.json(list);
  });

  r.get("/courses/:courseId", (req, res) => {
    const course = store.getCourse(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const profile = UserFactory.fromRecord(store.getUserById(req.user.sub));
    if (!profile.ownsCourse(course)) {
      return res.status(403).json({ message: "You do not own this course" });
    }
    return res.json(course);
  });

  r.post("/courses", async (req, res) => {
    const instructorId = req.user.sub;
    const instructor = store.getUserById(instructorId);
    const { title, description, category, level } = req.body ?? {};
    if (!title || !description) {
      return res.status(400).json({ message: "title and description required" });
    }
    const id = `c_${Math.random().toString(36).slice(2, 8)}`;
    const course = new CourseBuilder()
      .withBasics({
        title,
        description,
        category: category ?? "General",
        level: level ?? "Beginner",
        instructorId,
        instructorName: instructor?.name ?? "Instructor",
      })
      .build(id);

    await store.withWrite(async () => {
      store.upsertCourse(course);
    });
    return res.status(201).json(course);
  });

  r.put("/courses/:courseId", async (req, res) => {
    const instructorId = req.user.sub;
    const course = store.getCourse(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const profile = UserFactory.fromRecord(store.getUserById(instructorId));
    if (!profile.ownsCourse(course)) {
      return res.status(403).json({ message: "You do not own this course" });
    }
    const { title, description, category, level } = req.body ?? {};
    const next = {
      ...course,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
    };
    await store.withWrite(async () => {
      store.upsertCourse(next);
    });
    return res.json(next);
  });

  r.get("/assignments", (req, res) => {
    const list = store.listInstructorAssignments(req.user.sub);
    return res.json(list);
  });

  r.get("/assignments/:assignmentId/submissions", (req, res) => {
    const instructorId = req.user.sub;
    const assignment = store.assignments.get(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    const course = store.getCourse(assignment.courseId);
    const profile = UserFactory.fromRecord(store.getUserById(instructorId));
    if (!course || !profile.ownsCourse(course)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const subs = store.submissions.filter((s) => s.assignmentId === req.params.assignmentId);
    return res.json(subs);
  });

  r.get("/assignments/:assignmentId/submissions/:studentId", (req, res) => {
    const instructorId = req.user.sub;
    const assignment = store.assignments.get(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    const course = store.getCourse(assignment.courseId);
    const profile = UserFactory.fromRecord(store.getUserById(instructorId));
    if (!course || !profile.ownsCourse(course)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const sub = store.findSubmission(req.params.assignmentId, req.params.studentId);
    if (!sub) return res.status(404).json({ message: "Submission not found" });
    return res.json({ assignment, submission: sub });
  });

  r.post("/assignments/:assignmentId/students/:studentId/grade", async (req, res) => {
    const instructorId = req.user.sub;
    const { assignmentId, studentId } = req.params;
    const { score, rubricBand, strategy } = req.body ?? {};

    const assignment = store.assignments.get(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    const course = store.getCourse(assignment.courseId);
    const profile = UserFactory.fromRecord(store.getUserById(instructorId));
    if (!course || !profile.ownsCourse(course)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ctx = new GradingContext(new NumericGradingStrategy());
    if (strategy === "rubric") {
      ctx.setStrategy(new RubricGradingStrategy());
    }

    let result;
    try {
      if (strategy === "rubric") {
        if (!rubricBand) return res.status(400).json({ message: "rubricBand required for rubric strategy" });
        result = ctx.execute({ maxScore: assignment.maxScore, rubricBand });
      } else {
        if (score === undefined || score === null || Number.isNaN(Number(score))) {
          return res.status(400).json({ message: "score required for numeric strategy" });
        }
        result = ctx.execute({ maxScore: assignment.maxScore, score: Number(score) });
      }
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    await store.withWrite(async () => {
      const sub = store.findSubmission(assignmentId, studentId);
      if (sub) {
        sub.score = result.score;
        sub.feedback = typeof req.body?.feedback === "string" && req.body.feedback.trim()
          ? req.body.feedback
          : result.feedback;
        store.upsertSubmission(sub);
      }
      const a = store.assignments.get(assignmentId);
      if (a) {
        a.status = "graded";
        a.score = result.score;
        store.assignments.set(assignmentId, a);
      }
    });

    return res.json({ ok: true, score: result.score, feedback: result.feedback });
  });

  return r;
}
