import { LandingPage } from "@/pages/marketing/LandingPage";
import { RoleHomeRedirect } from "@/routes/RoleHomeRedirect";
import { useAppSelector } from "@/store/hooks";

export function HomeGate() {
  const token = useAppSelector((s) => s.auth.token);
  if (token) {
    return <RoleHomeRedirect />;
  }
  return <LandingPage />;
}
