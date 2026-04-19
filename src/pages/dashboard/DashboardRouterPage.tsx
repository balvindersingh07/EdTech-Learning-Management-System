import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { useNavigate } from "react-router-dom";

export function DashboardRouterPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-lg py-16">
      <Card title="Select a role to continue" description="Your session is active but no role is assigned.">
        <Button className="mt-4" onClick={() => navigate("/login")}>
          Go to login
        </Button>
      </Card>
    </div>
  );
}
