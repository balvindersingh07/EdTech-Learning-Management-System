import { Card } from "@/components/molecules/Card";
import { dummyAssignments, dummyCourses, dummySubmissions, chartCourseViews } from "@/data/dummyData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function InstructorDashboardPage() {
  const totalStudents = dummyCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const pendingGrading = dummySubmissions.filter((s) => s.score === undefined).length;

  const gridStroke = "rgba(148, 163, 184, 0.25)";
  const axisStroke = "rgba(148, 163, 184, 0.85)";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Teaching overview</h1>
        <p className="text-[var(--muted)]">Monitor engagement and submissions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total learners" description="Across your published courses.">
          <p className="text-3xl font-bold text-primary">{totalStudents.toLocaleString()}</p>
        </Card>
        <Card title="Active courses" description="Visible on the catalog.">
          <p className="text-3xl font-bold text-[var(--text)]">{dummyCourses.length}</p>
        </Card>
        <Card title="Awaiting grades" description="Submissions without scores.">
          <p className="text-3xl font-bold text-secondary">{pendingGrading}</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Course views" description="Last 7 days (sample telemetry).">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartCourseViews}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(30, 41, 59, 0.92)",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="views" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Recent submissions" description="Quick glance at incoming work.">
          <div className="space-y-3">
            {dummySubmissions.map((s) => (
              <div
                key={`${s.assignmentId}-${s.studentId}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-inner"
              >
                <div>
                  <p className="font-semibold text-[var(--text)]">{s.studentName}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {dummyAssignments.find((a) => a.id === s.assignmentId)?.title}
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(s.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
            {!dummySubmissions.length ? <p className="text-sm text-[var(--muted)]">No submissions yet.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
