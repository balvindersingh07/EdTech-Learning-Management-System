import { pathsForRole } from "@/lib/appPaths";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/types";
import { Navigate, Outlet } from "react-router-dom";

export interface RoleGuardProps {
  allow: UserRole[];
}

export function RoleGuard({ allow }: RoleGuardProps) {
  const role = useAppSelector((s) => s.auth.user?.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to={pathsForRole(role).dashboard} replace />;
  }

  return <Outlet />;
}
