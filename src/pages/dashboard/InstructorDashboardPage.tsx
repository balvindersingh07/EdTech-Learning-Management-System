import { Card } from "@/components/molecules/Card";
import { instructorAssignmentService } from "@/services/instructor/instructorAssignmentService";
import { instructorCourseService } from "@/services/instructor/instructorCourseService";
import type { Assignment, Course, InstructorRecentSubmission } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function InstructorDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [recent, setRecent] = useState<InstructorRecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    return Promise.all([
      instructorCourseService.listMine(),
      instructorAssignmentService.list(),
      instructorAssignmentService.listRecentSubmissions(12),
    ])
      .then(([c, a, r]) => {
        setCourses(c);
        setAssignments(a);
        setRecent(r);
      })
      .catch(() => {
        toast.error("Could not load teaching data");
      });
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount ?? 0), 0);
  const pendingGrading = assignments.filter((x) => x.status === "submitted").length;

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-56 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Teaching overview</h1>
        <p className="text-[var(--muted)]">Data from your instructor API — no static dummy charts.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total learners (enrolled)" description="Sum of enrolledCount on your courses.">
          <p className="text-3xl font-bold text-primary">{totalStudents.toLocaleString()}</p>
        </Card>
        <Card title="Your courses" description="Courses you own.">
          <p className="text-3xl font-bold text-[var(--text)]">{courses.length}</p>
        </Card>
        <Card title="Assignments to grade" description="Submitted, not yet graded.">
          <p className="text-3xl font-bold text-secondary">{pendingGrading}</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Your courses" description="Titles from the API">
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            {courses.map((c) => (
              <li key={c.id} className="flex justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="font-medium text-[var(--text)]">{c.title}</span>
                <span className="shrink-0 text-xs">{c.subjectName ?? c.category}</span>
              </li>
            ))}
            {!courses.length ? <li>No courses yet — create one from the course list.</li> : null}
          </ul>
        </Card>
        <Card title="Recent submissions" description="Latest work on your assignments">
          <div className="space-y-3">
            {recent.map((s) => (
              <div
                key={`${s.assignmentId}-${s.studentId}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-inner"
              >
                <div>
                  <p className="font-semibold text-[var(--text)]">{s.studentName}</p>
                  <p className="text-xs text-[var(--muted)]">{s.assignmentTitle}</p>
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(s.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
            {!recent.length ? <p className="text-sm text-[var(--muted)]">No submissions yet.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
