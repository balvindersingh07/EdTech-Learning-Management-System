import { cn } from "@/lib/cn";
import { adminPaths, instructorPaths, studentPaths } from "@/lib/appPaths";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import type { UserRole } from "@/types";
import { NavLink } from "react-router-dom";

type NavItem = { to: string; label: string };

function navForRole(role: UserRole): NavItem[] {
  if (role === "student") {
    const p = studentPaths();
    return [
      { to: p.dashboard, label: "Dashboard" },
      { to: p.courses, label: "Course catalog" },
      { to: p.assignments, label: "My assignments" },
    ];
  }
  if (role === "instructor") {
    const p = instructorPaths();
    return [
      { to: p.dashboard, label: "Dashboard" },
      { to: p.courses, label: "My courses" },
      { to: p.courseNew, label: "Create course" },
      { to: p.assignments, label: "Grading queue" },
      { to: p.reports, label: "Teaching reports" },
    ];
  }
  const p = adminPaths();
  return [
    { to: p.dashboard, label: "Dashboard" },
    { to: p.users, label: "User management" },
    { to: p.reports, label: "Platform reports" },
  ];
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const role = useAppSelector((s) => s.auth.user?.role);

  const items = role ? navForRole(role) : [];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
        )}
        onClick={() => dispatch(setSidebarOpen(false))}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "panel-3d fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[var(--panel)]/90 px-3 py-6 shadow-[var(--shadow-3d)] backdrop-blur-xl transition-transform dark:border-white/5 dark:bg-[var(--panel)]/80 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-900 text-sm font-bold text-white shadow-lg ring-2 ring-teal-200/25">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Alma LMS</p>
            <p className="text-xs text-[var(--muted)]">Role: {role}</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => dispatch(setSidebarOpen(false))}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-teal-500/20 text-[var(--text)] shadow-inner ring-1 ring-teal-400/35"
                    : "text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)]",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4 rounded-2xl border border-white/10 bg-gradient-to-br from-teal-700/95 to-teal-950/95 p-4 text-white shadow-[0_20px_50px_var(--brand-glow)]">
          <p className="text-sm font-semibold">Pro workspace</p>
          <p className="mt-1 text-xs text-teal-100">Depth, clarity, and focus for every role.</p>
        </div>
      </aside>
    </>
  );
}
