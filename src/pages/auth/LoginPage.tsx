import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { loginHintUsers } from "@/data/loginHints";
import { pathsForRole } from "@/lib/appPaths";
import type { UserRole } from "@/types";
import { clearAuthMessages, login } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAppSelector((s) => s.auth.status);
  const serverError = useAppSelector((s) => s.auth.error);

  const [email, setEmail] = useState("admin@lms.local");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const from = (location.state as { from?: string } | null)?.from;

  const hints = useMemo(
    () =>
      loginHintUsers.map((u) => (
        <button
          key={u.id}
          type="button"
          className="text-left"
          onClick={() => {
            dispatch(clearAuthMessages());
            setEmail(u.email);
            toast.success(`Filled demo ${u.role} account`);
          }}
        >
          <Badge tone="info">{u.role}</Badge>{" "}
          <span className="text-xs text-[var(--muted)]">{u.email}</span>
        </button>
      )),
    [],
  );

  const goAfterAuth = (role: UserRole) => {
    const home = pathsForRole(role).dashboard;
    if (from && typeof from === "string" && from.startsWith(`/app/${role}/`)) {
      navigate(from, { replace: true });
    } else {
      navigate(home, { replace: true });
    }
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Minimum 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const action = await dispatch(login({ email, password }));
    if (login.fulfilled.match(action)) {
      toast.success("Welcome back");
      goAfterAuth(action.payload.user.role);
    } else {
      toast.error(String(action.payload ?? "Login failed"));
    }
  };

  const passwordToggle = (
    <button
      type="button"
      className="rounded-lg p-1 text-[var(--muted)] transition hover:bg-white/10 hover:text-[var(--text)]"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.4 10.4 0 0112 5c4.2 0 7.6 2.5 9 6a10.9 10.9 0 01-3.1 4.3M6.3 6.3C4.5 7.7 3.2 9.7 3 12c1.4 3.5 4.8 6 9 6 1 0 2-.1 2.9-.4" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="auth-page">
      <div className="auth-page-inner grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <Link to="/" className="text-sm font-semibold text-[var(--link)] hover:underline">
            ← Back to home
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--link-soft)]">Alma LMS</p>
          <h1 className="text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">
            Learn with structure. Teach with clarity.
          </h1>
          <p className="text-[var(--muted)]">
            Students and instructors sign up, then an admin approves them. The admin account is static (see demo hint).
            Sign in with email and password.
          </p>
          <div className="rounded-[1.25rem] border border-white/10 bg-[var(--panel)]/70 p-4 shadow-[var(--shadow-3d)] backdrop-blur-xl">
            <p className="text-sm font-semibold text-[var(--text)]">Bootstrap admin (demo)</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Default password <code className="text-[var(--text)]">Admin@123</code> unless overridden by{" "}
              <code className="text-[var(--text)]">ADMIN_PASSWORD</code> on the API process.
            </p>
            <div className="mt-3 flex flex-col gap-2">{hints}</div>
          </div>
        </div>
        <Card
          title="Sign in"
          description="Use the email and password you registered with (or the bootstrap admin below)."
          padding="lg"
          className="border-white/10 bg-[var(--card)]/85 shadow-[var(--shadow-3d)] backdrop-blur-xl"
        >
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                dispatch(clearAuthMessages());
                setEmail(e.target.value);
              }}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                dispatch(clearAuthMessages());
                setPassword(e.target.value);
              }}
              error={errors.password}
              rightAdornment={passwordToggle}
            />
            {serverError && status === "failed" ? (
              <p className="text-sm text-red-400" role="alert">
                {serverError}
              </p>
            ) : null}
            <Button type="submit" className="w-full shadow-[0_16px_40px_var(--brand-glow)]" loading={status === "loading"}>
              Continue
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            New here?{" "}
            <Link className="font-semibold text-[var(--link)] hover:underline" to="/signup">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
