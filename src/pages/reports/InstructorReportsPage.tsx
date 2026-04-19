import { Card } from "@/components/molecules/Card";
import { dummyActivity, chartEnrollmentTrend, chartCourseViews } from "@/data/dummyData";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function InstructorReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Teaching analytics</h1>
        <p className="text-[var(--muted)]">Signals for courses you deliver — not platform administration.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Enrollment trend" description="Illustrative cohort growth">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartEnrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#22C55E" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Engagement curve" description="Sample weekly rhythm">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartCourseViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#2dd4bf" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card title="Teaching activity (sample)" description="Operational notes for your programs">
        <div className="divide-y divide-white/10">
          {dummyActivity.slice(0, 4).map((log) => (
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
