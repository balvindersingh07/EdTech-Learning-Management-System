import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  empty?: ReactNode;
  loading?: boolean;
}

export function Table<T extends { id: string }>({ columns, rows, empty, loading }: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }
  if (!rows.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-[var(--muted)]">
        {empty ?? "No records"}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/5 shadow-inner backdrop-blur-sm">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-white/5">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3 text-[var(--text)]", c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
