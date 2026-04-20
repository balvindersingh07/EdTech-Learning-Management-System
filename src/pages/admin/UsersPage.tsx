import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { Table } from "@/components/organisms/Table";
import { adminService } from "@/services/admin/adminService";
import type { PlatformUserRow } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function statusTone(s: PlatformUserRow["status"]) {
  if (s === "active") return "success" as const;
  if (s === "pending" || s === "invited") return "warning" as const;
  if (s === "rejected" || s === "suspended") return "danger" as const;
  return "neutral" as const;
}

export function UsersPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<PlatformUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    return adminService
      .listUsers()
      .then((data) => setRows(data))
      .catch(() => {
        toast.error("Could not load users");
      });
  }, []);

  useEffect(() => {
    let mounted = true;
    load().finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q),
    );
  }, [rows, query]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await adminService.approveUser(id);
      toast.success("User approved");
      await load();
    } catch {
      toast.error("Approve failed");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    setBusyId(id);
    try {
      await adminService.rejectUser(id);
      toast.success("User rejected");
      await load();
    } catch {
      toast.error("Reject failed");
    } finally {
      setBusyId(null);
    }
  };

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
      render: (row: PlatformUserRow) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
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
    {
      key: "actions",
      header: "Actions",
      render: (row: PlatformUserRow) => {
        if (row.role === "admin") return <span className="text-xs text-[var(--muted)]">—</span>;
        if (row.status === "pending") {
          return (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="shadow-[0_10px_24px_var(--brand-glow)]"
                disabled={busyId === row.id}
                onClick={() => void approve(row.id)}
              >
                Approve
              </Button>
              <Button size="sm" variant="danger" disabled={busyId === row.id} onClick={() => void reject(row.id)}>
                Reject
              </Button>
            </div>
          );
        }
        if (row.status === "rejected") {
          return (
            <Button size="sm" disabled={busyId === row.id} onClick={() => void approve(row.id)}>
              Reinstate
            </Button>
          );
        }
        return <span className="text-xs text-[var(--muted)]">—</span>;
      },
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
        <p className="text-[var(--muted)]">
          Approve or reject student and instructor registrations. Admin is a static bootstrap account.
        </p>
      </div>
      <Card>
        <div className="mb-4 max-w-md">
          <Input placeholder="Search by name, email, or role" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Table columns={columns} rows={filtered} empty="No users match your filters" />
        <Button className="mt-4" variant="ghost" onClick={() => void load().then(() => toast.success("Refreshed"))}>
          Refresh
        </Button>
      </Card>
    </div>
  );
}
