import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { pathsForRole } from "@/lib/appPaths";
import type { AuthResponse, SignupPendingResponse } from "@/services/authService";
import { signup } from "@/store/slices/authSlice";
import type { UserRole } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: "student", label: "Student", description: "Enroll, learn, submit assignments" },
  { value: "instructor", label: "Instructor", description: "Author courses and grade work" },
];

export function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((s) => s.auth.status);
  const serverError = useAppSelector((s) => s.auth.error);
  const errorSource = useAppSelector((s) => s.auth.errorSource);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [errors, setErrors] = useState<FieldErrors>({});

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

  const validate = () => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Use at least 8 characters";
    if (!role) next.role = "Choose a role";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const action = await dispatch(signup({ name, email, password, role }));
    if (signup.fulfilled.match(action)) {
      const p = action.payload as SignupPendingResponse | AuthResponse;
      if ("pending" in p && p.pending) {
        toast.success(p.message);
        navigate("/login", { replace: true });
        return;
      }
      const ok = p as AuthResponse;
      toast.success("Account created");
      navigate(pathsForRole(ok.user.role).dashboard, { replace: true });
    } else {
      toast.error(String(action.payload ?? "Signup failed"));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-inner grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <Link to="/" className="text-sm font-semibold text-[var(--link)] hover:underline">
            ← Back to home
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--link-soft)]">Alma LMS</p>
          <h1 className="text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">Create your workspace</h1>
          <p className="text-[var(--muted)]">
            Students and instructors can register here. An administrator must approve your account before you can sign
            in. The platform admin is a fixed bootstrap account (not created through this form).
          </p>
          <div className="rounded-[1.25rem] border border-white/10 bg-[var(--panel)]/70 p-4 shadow-[var(--shadow-3d)] backdrop-blur-xl">
            <p className="text-sm font-semibold text-[var(--text)]">Approval flow</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              After you submit this form, use the same email/password only after an admin approves you from the admin
              directory.
            </p>
          </div>
        </div>
        <Card
          title="Create your account"
          description="Full name, email, password, and your primary role."
          padding="lg"
          className="border-white/10 bg-[var(--card)]/85 shadow-[var(--shadow-3d)] backdrop-blur-xl"
        >
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <Input label="Full name" name="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              hint="Minimum 8 characters for new accounts."
              rightAdornment={passwordToggle}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text)]">Role</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`cursor-pointer rounded-2xl border p-3 text-sm shadow-inner backdrop-blur-sm transition hover:border-teal-400/50 ${
                      role === r.value
                        ? "border-teal-400/60 bg-teal-500/15 shadow-[0_12px_40px_var(--brand-glow)]"
                        : "border-white/12 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={() => setRole(r.value)}
                        className="accent-teal-500"
                      />
                      <span className="font-semibold text-[var(--text)]">{r.label}</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)]">{r.description}</p>
                  </label>
                ))}
              </div>
              {errors.role ? <p className="text-sm text-red-400">{errors.role}</p> : null}
            </div>
            {serverError && status === "failed" && errorSource === "signup" ? (
              <p className="text-sm text-red-400" role="alert">
                {serverError}
              </p>
            ) : null}
            <Button type="submit" className="w-full shadow-[0_16px_40px_var(--brand-glow)]" loading={status === "loading"}>
              Sign up
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--link)] hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
