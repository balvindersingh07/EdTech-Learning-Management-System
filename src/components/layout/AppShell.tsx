import { Navbar } from "@/components/organisms/Navbar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { Outlet } from "react-router-dom";

export function AppShell() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="mesh-bg min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <Navbar
            onMenu={() => dispatch(setSidebarOpen(!open))}
            userName={user?.name}
            userRole={user?.role}
          />
          <main className="relative flex-1 px-4 pb-12 pt-4 sm:px-6 lg:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,197,94,0.12),transparent_35%)]" />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
