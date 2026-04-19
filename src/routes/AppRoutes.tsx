import { AppShell } from "@/components/layout/AppShell";
import { AdminDashboardPage } from "@/pages/dashboard/AdminDashboardPage";
import { InstructorDashboardPage } from "@/pages/dashboard/InstructorDashboardPage";
import { StudentDashboardPage } from "@/pages/dashboard/StudentDashboardPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { StudentAssignmentsPage } from "@/pages/assignments/StudentAssignmentsPage";
import { InstructorAssignmentsPage } from "@/pages/assignments/InstructorAssignmentsPage";
import { GradingPage } from "@/pages/assignments/GradingPage";
import { SubmitAssignmentPage } from "@/pages/assignments/SubmitAssignmentPage";
import { CourseDetailPage } from "@/pages/courses/CourseDetailPage";
import { CourseFormPage } from "@/pages/courses/CourseFormPage";
import { CourseListPage } from "@/pages/courses/CourseListPage";
import { InstructorReportsPage } from "@/pages/reports/InstructorReportsPage";
import { AdminReportsPage } from "@/pages/reports/AdminReportsPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { DashboardRouterPage } from "@/pages/dashboard/DashboardRouterPage";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { HomeGate } from "@/routes/HomeGate";
import { RoleHomeRedirect } from "@/routes/RoleHomeRedirect";
import { useAppSelector } from "@/store/hooks";
import { Route, Routes } from "react-router-dom";

function DashboardEntry() {
  const role = useAppSelector((s) => s.auth.user?.role);
  if (role === "student") return <StudentDashboardPage />;
  if (role === "instructor") return <InstructorDashboardPage />;
  if (role === "admin") return <AdminDashboardPage />;
  return <DashboardRouterPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<RoleHomeRedirect />} />

          <Route element={<RoleGuard allow={["student"]} />}>
            <Route path="student/dashboard" element={<DashboardEntry />} />
            <Route path="student/courses" element={<CourseListPage />} />
            <Route path="student/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="student/assignments/:assignmentId/submit" element={<SubmitAssignmentPage />} />
          </Route>

          <Route element={<RoleGuard allow={["instructor"]} />}>
            <Route path="instructor/dashboard" element={<DashboardEntry />} />
            <Route path="instructor/courses" element={<CourseListPage />} />
            <Route path="instructor/courses/new" element={<CourseFormPage mode="create" />} />
            <Route path="instructor/courses/:courseId/edit" element={<CourseFormPage mode="edit" />} />
            <Route path="instructor/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="instructor/assignments" element={<InstructorAssignmentsPage />} />
            <Route path="instructor/assignments/:assignmentId/grade" element={<GradingPage />} />
            <Route path="instructor/reports" element={<InstructorReportsPage />} />
          </Route>

          <Route element={<RoleGuard allow={["admin"]} />}>
            <Route path="admin/dashboard" element={<DashboardEntry />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomeGate />} />
      <Route path="*" element={<HomeGate />} />
    </Routes>
  );
}
