import { pathsForRole } from "@/lib/appPaths";
import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router-dom";

export function RoleHomeRedirect() {
  const user = useAppSelector((s) => s.auth.user);

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={pathsForRole(user.role).dashboard} replace />;
}
