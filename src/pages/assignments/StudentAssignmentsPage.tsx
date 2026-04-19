import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/molecules/Card";
import { studentPaths } from "@/lib/appPaths";
import { studentAssignmentService } from "@/services/student/studentAssignmentService";
import type { Assignment } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function StudentAssignmentsPage() {
  const p = studentPaths();
  const [items, setItems] = useState<Assignment[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    studentAssignmentService
      .list()
      .then((data) => {
        if (!mounted) return;
        setItems(data);
        setStatus("ready");
      })
      .catch((e: Error) => {
        if (!mounted) return;
        setError(e.message);
        setStatus("error");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-48 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card title="Assignments unavailable" description={error ?? "Please try again later."} />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">My assignments</h1>
        <p className="text-[var(--muted)]">Submit coursework for your enrolled programs.</p>
      </div>
      <div className="grid gap-4">
        {items.map((a) => (
          <Card key={a.id} padding="md" className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">{a.title}</p>
              <p className="text-sm text-[var(--muted)]">{a.courseTitle}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Due {new Date(a.dueAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone={
                  a.status === "graded" ? "success" : a.status === "submitted" ? "info" : "warning"
                }
              >
                {a.status}
              </Badge>
              {a.status === "pending" ? (
                <Link
                  to={p.submit(a.id)}
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-gradient-to-b from-teal-500 to-teal-900 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_var(--brand-glow)]"
                >
                  Submit
                </Link>
              ) : null}
            </div>
          </Card>
        ))}
        {!items.length ? <Card title="No assignments" description="Enroll in a course to see work here." /> : null}
      </div>
    </div>
  );
}
