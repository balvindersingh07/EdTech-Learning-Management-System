import { Button } from "@/components/atoms/Button";
import { NotificationDropdown } from "@/components/organisms/NotificationDropdown";
import { useTheme } from "@/hooks/useTheme";
import { notificationService } from "@/services/notificationService";
import { logout } from "@/store/slices/authSlice";
import type { UserRole } from "@/types";
import type { NotificationItem } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface NavbarProps {
  onMenu: () => void;
  userName?: string;
  userRole?: UserRole;
}

export function Navbar({ onMenu, userName, userRole }: NavbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((s) => s.auth.token);
  const cartCount = useAppSelector((s) => s.enrollment.cart.length);
  const { isDark, toggle } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }
    let cancelled = false;
    notificationService
      .list()
      .then((rows) => {
        if (!cancelled) setNotifications(rows);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <header className="sticky top-0 z-30 overflow-visible border-b border-white/10 bg-[var(--panel)]/75 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="border border-white/10 text-[var(--text)] lg:hidden"
            aria-label="Open navigation"
            onClick={onMenu}
          >
            ☰
          </Button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/90">Depth UI</p>
            <p className="text-sm font-semibold text-[var(--text)]">
              {userRole ? `${capitalize(userRole)} workspace` : "LMS"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[var(--text)]">{userName}</p>
            <p className="text-xs text-[var(--muted)]">
              {userRole ? capitalize(userRole) : ""}
              {cartCount ? ` · ${cartCount} queued enrollments` : ""}
            </p>
          </div>
          <NotificationDropdown
            items={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
              if (unreadCount) toast.success("Notifications marked as read");
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full border border-white/10 p-0 text-lg text-[var(--text)]"
            aria-label="Toggle dark mode"
            onClick={() => {
              toggle();
              toast.success(isDark ? "Light mode" : "Dark mode");
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden border border-white/10 text-[var(--text)] sm:inline-flex"
            onClick={() => {
              dispatch(logout());
              navigate("/login", { replace: true });
              toast.success("Signed out");
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
