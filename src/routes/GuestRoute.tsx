import { pathsForRole } from "@/lib/appPaths";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

export function GuestRoute() {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  if (token && user?.role) {
    return <Navigate to={pathsForRole(user.role).dashboard} replace />;
  }

  if (token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
