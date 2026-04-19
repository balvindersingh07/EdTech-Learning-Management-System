import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/molecules/Card";
import { Table } from "@/components/organisms/Table";
import { adminPaths } from "@/lib/appPaths";
import { dummyActivity, dummyPlatformUsers } from "@/data/dummyData";
import type { PlatformUserRow } from "@/types";
import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  const columns = [
    {
      key: "name",
      header: "User",
      render: (row: PlatformUserRow) => (
        <div>
          <p className="font-medium text-[var(--text)]">{row.name}</p>
          <p className="text-xs text-[var(--muted)]">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row: PlatformUserRow) => <Badge tone="info">{row.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: PlatformUserRow) => (
        <Badge tone={row.status === "active" ? "success" : row.status === "invited" ? "warning" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "last",
      header: "Last active",
      render: (row: PlatformUserRow) => (
        <span className="text-xs text-[var(--muted)]">
          {new Date(row.lastActive).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </span>
      ),
    },
  ];

  const ap = adminPaths();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Admin control center</h1>
          <p className="text-[var(--muted)]">Governance, directory, and platform reports — isolated from teaching.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={ap.users}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-inner backdrop-blur hover:bg-white/15"
          >
            User directory
          </Link>
          <Link
            to={ap.reports}
            className="rounded-2xl bg-gradient-to-b from-teal-500 to-teal-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_var(--brand-glow)]"
          >
            Platform reports
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total users" description="All roles">
          <p className="text-3xl font-bold text-teal-300">{dummyPlatformUsers.length + 1204}</p>
        </Card>
        <Card title="Monthly active" description="Rolling 30 days">
          <p className="text-3xl font-bold text-[var(--text)]">8.4k</p>
        </Card>
        <Card title="Open reports" description="Needs review">
          <p className="text-3xl font-bold text-teal-200">12</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="User management" description="Recently active accounts (sample rows)">
          <Table columns={columns} rows={dummyPlatformUsers} empty="No users" />
        </Card>
        <Card title="Activity log" description="Latest administrative events">
          <div className="space-y-3">
            {dummyActivity.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-inner"
              >
                <p className="font-semibold text-[var(--text)]">{log.actor}</p>
                <p className="text-xs text-[var(--muted)]">
                  {log.action} · {log.target}
                </p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">
                  {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
