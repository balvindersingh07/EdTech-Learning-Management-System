import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/molecules/Card";
import { studentPaths } from "@/lib/appPaths";
import { studentAssignmentService } from "@/services/student/studentAssignmentService";
import { studentCourseService } from "@/services/student/studentCourseService";
import type { Assignment, Course } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function StudentDashboardPage() {
  const p = studentPaths();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([studentCourseService.catalog(), studentAssignmentService.list()])
      .then(([c, a]) => {
        if (!mounted) return;
        setCourses(c.slice(0, 2));
        setAssignments(a.filter((x) => x.status === "pending").slice(0, 3));
      })
      .catch(() => {
        if (!mounted) return;
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Your learning hub</h1>
        <p className="text-[var(--muted)]">Student-only view — no instructor or admin tools here.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Spotlight courses"
          description="Pulled from the catalog API — not instructor authoring screens."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={p.course(course.id)}
                className="card-3d group overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/80 shadow-[var(--shadow-3d)]"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{course.title}</p>
                      <p className="text-xs text-[var(--muted)]">{course.instructorName}</p>
                    </div>
                    <Badge tone="info">{course.level}</Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>Progress</span>
                      <span>{course.progressPercent ?? 0}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300"
                        style={{ width: `${course.progressPercent ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!courses.length ? <p className="text-sm text-[var(--muted)]">No catalog data yet.</p> : null}
          </div>
        </Card>
        <Card title="Upcoming assignments" description="Student submission routes only.">
          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm shadow-inner"
              >
                <p className="font-semibold text-[var(--text)]">{a.title}</p>
                <p className="text-xs text-[var(--muted)]">{a.courseTitle}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Due {new Date(a.dueAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <Link
                  to={p.submit(a.id)}
                  className="mt-2 inline-flex h-8 items-center rounded-xl bg-gradient-to-b from-teal-600 to-teal-900 px-3 text-xs font-semibold text-white shadow-[0_10px_30px_var(--brand-glow)]"
                >
                  Submit
                </Link>
              </div>
            ))}
            {!assignments.length ? <p className="text-sm text-[var(--muted)]">No upcoming items.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
