import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import { instructorPaths } from "@/lib/appPaths";
import { instructorAssignmentService } from "@/services/instructor/instructorAssignmentService";
import type { Assignment } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function InstructorAssignmentsPage() {
  const p = instructorPaths();
  const [items, setItems] = useState<Assignment[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [firstStudentByAssignment, setFirstStudentByAssignment] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    instructorAssignmentService
      .list()
      .then(async (data) => {
        if (!mounted) return;
        const map: Record<string, string> = {};
        await Promise.all(
          data.map(async (a) => {
            try {
              const subs = await instructorAssignmentService.listSubmissions(a.id);
              if (subs[0]) map[a.id] = subs[0].studentId;
            } catch {
              /* ignore */
            }
          }),
        );
        if (!mounted) return;
        setFirstStudentByAssignment(map);
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
      <Card title="Unable to load grading queue" description={error ?? "Try again later."}>
        <Button className="mt-3" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Grading queue</h1>
        <p className="text-[var(--muted)]">Review submissions for courses you own.</p>
      </div>
      <div className="grid gap-4">
        {items.map((a) => {
          const studentId = firstStudentByAssignment[a.id];
          return (
            <Card key={a.id} padding="md" className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-[var(--text)]">{a.title}</p>
                <p className="text-sm text-[var(--muted)]">{a.courseTitle}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Due {new Date(a.dueAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={a.status === "graded" ? "success" : "warning"}>{a.status}</Badge>
                {studentId && a.status !== "graded" ? (
                  <Link
                    to={`${p.grade(a.id)}?studentId=${encodeURIComponent(studentId)}`}
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-[var(--text)] shadow-inner backdrop-blur hover:bg-white/10"
                  >
                    Open grading
                  </Link>
                ) : (
                  <span className="text-xs text-[var(--muted)]">No submissions yet</span>
                )}
              </div>
            </Card>
          );
        })}
        {!items.length ? <Card title="No assignments" description="Create courses to receive coursework." /> : null}
      </div>
    </div>
  );
}
