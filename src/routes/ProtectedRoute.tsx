import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
