import { Card } from "@/components/molecules/Card";
import { instructorReportService } from "@/services/instructor/instructorReportService";
import type { InstructorTeachingSummary } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function InstructorReportsPage() {
  const [summary, setSummary] = useState<InstructorTeachingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    instructorReportService
      .teachingSummary()
      .then((s) => {
        if (!cancelled) setSummary(s);
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load teaching summary");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-64 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Teaching analytics</h1>
        <p className="text-[var(--muted)]">Live counts from GET /api/v1/instructor/reports/summary (no dummy series).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Courses" description="You own">
          <p className="text-3xl font-bold text-teal-300">{summary?.courseCount ?? 0}</p>
        </Card>
        <Card title="Assignments" description="Across your courses">
          <p className="text-3xl font-bold text-[var(--text)]">{summary?.assignmentCount ?? 0}</p>
        </Card>
        <Card title="Submissions" description="All time">
          <p className="text-3xl font-bold text-cyan-300">{summary?.submissionCount ?? 0}</p>
        </Card>
        <Card title="Awaiting grades" description="Submitted">
          <p className="text-3xl font-bold text-amber-300">{summary?.gradingPending ?? 0}</p>
        </Card>
      </div>
      <Card title="Learners by course" description="Relative bar = enrolledCount vs your largest course">
        <div className="space-y-4">
          {(summary?.courses ?? []).map((c) => (
            <div key={c.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-[var(--text)]">{c.title}</span>
                <span className="text-[var(--muted)]">{c.enrolledCount.toLocaleString()} enrolled</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-600"
                  style={{ width: `${c.barPercent}%` }}
                />
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{c.subjectName}</p>
            </div>
          ))}
          {!summary?.courses?.length ? (
            <p className="text-sm text-[var(--muted)]">No courses in your teaching scope yet.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
