import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { Table } from "@/components/organisms/Table";
import { adminService } from "@/services/admin/adminService";
import type { PlatformUserRow } from "@/types";
import { useEffect, useMemo, useState } from "react";

export function UsersPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<PlatformUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adminService
      .listUsers()
      .then((data) => {
        if (!mounted) return;
        setRows(data);
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

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q),
    );
  }, [rows, query]);

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

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-56 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">User management</h1>
        <p className="text-[var(--muted)]">Admin-only directory backed by GET /api/v1/admin/users.</p>
      </div>
      <Card>
        <div className="mb-4 max-w-md">
          <Input placeholder="Search by name, email, or role" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Table columns={columns} rows={filtered} empty="No users match your filters" />
        <Button className="mt-4" variant="ghost" onClick={() => void adminService.listUsers().then(setRows)}>
          Refresh
        </Button>
      </Card>
    </div>
  );
}
