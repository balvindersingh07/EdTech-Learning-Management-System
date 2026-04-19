import { Card } from "@/components/molecules/Card";
import { adminService } from "@/services/admin/adminService";
import { chartEnrollmentTrend } from "@/data/dummyData";
import type { ActivityLogEntry, PlatformUserRow } from "@/types";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminReportsPage() {
  const [users, setUsers] = useState<PlatformUserRow[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [summaryHtml, setSummaryHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminService.listUsers(),
      adminService.activity(),
      adminService.reportSummary("html").catch(() => ""),
    ])
      .then(([u, a, html]) => {
        if (!mounted) return;
        setUsers(u);
        setActivity(a);
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
        <p className="text-[var(--muted)]">Governance view — separate from instructor teaching tools.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Directory size" description="Users tracked in admin scope">
          <p className="text-3xl font-bold text-[var(--text)]">{users.length}</p>
        </Card>
        <Card title="Courses live" description="Across all instructors">
          <p className="text-3xl font-bold text-[var(--text)]">3</p>
        </Card>
        <Card title="Audit entries" description="Recent admin-visible events">
          <p className="text-3xl font-bold text-[var(--text)]">{activity.length}</p>
        </Card>
      </div>
      {summaryHtml ? (
        <Card title="Bridge export (HTML)" description="Generated via ReportExporter + HtmlExporter on the API">
          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: summaryHtml }} />
        </Card>
      ) : null}
      <Card title="Enrollment pulse (sample series)" description="Illustrative chart for executive review">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartEnrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
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
        </div>
      </Card>
    </div>
  );
}
