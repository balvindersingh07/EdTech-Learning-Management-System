import { Card } from "@/components/molecules/Card";
import { adminService } from "@/services/admin/adminService";
import type { ActivityLogEntry, PlatformUserRow } from "@/types";
import { useEffect, useState } from "react";

export function AdminReportsPage() {
  const [users, setUsers] = useState<PlatformUserRow[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [stats, setStats] = useState<{ users: number; courses: number; assignments: number } | null>(null);
  const [summaryHtml, setSummaryHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminService.listUsers(),
      adminService.activity(),
      adminService.stats(),
      adminService.reportSummary("html").catch(() => ""),
    ])
      .then(([u, a, s, html]) => {
        if (!mounted) return;
        setUsers(u);
        setActivity(a);
        setStats(s);
        setSummaryHtml(html);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-56 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Platform reports</h1>
        <p className="text-[var(--muted)]">Governance view — metrics from the admin API (no dummy chart series).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Directory size" description="Users tracked in admin scope">
          <p className="text-3xl font-bold text-[var(--text)]">{users.length}</p>
        </Card>
        <Card title="Courses in store" description="Built-in + instructor-authored">
          <p className="text-3xl font-bold text-[var(--text)]">{stats?.courses ?? "—"}</p>
        </Card>
        <Card title="Assignments" description="Across all courses">
          <p className="text-3xl font-bold text-[var(--text)]">{stats?.assignments ?? "—"}</p>
        </Card>
      </div>
      {summaryHtml ? (
        <Card title="Bridge export (HTML)" description="Generated via ReportExporter + HtmlExporter on the API">
          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: summaryHtml }} />
        </Card>
      ) : null}
      <Card title="Activity stream" description="From GET /api/v1/admin/activity">
        <div className="divide-y divide-white/10">
          {activity.map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-semibold text-[var(--text)]">{log.actor}</p>
                <p className="text-xs text-[var(--muted)]">
                  {log.action} · {log.target}
                </p>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          ))}
          {!activity.length ? <p className="py-4 text-sm text-[var(--muted)]">No activity rows.</p> : null}
        </div>
      </Card>
    </div>
  );
}
