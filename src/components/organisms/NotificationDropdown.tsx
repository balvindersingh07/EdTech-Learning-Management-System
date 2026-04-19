import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";
import type { NotificationItem } from "@/types";
import { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface NotificationDropdownProps {
  items: NotificationItem[];
  onMarkAllRead?: () => void;
}

type PanelPos = { top: number; right: number };

export function NotificationDropdown({ items, onMarkAllRead }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 8,
      right: Math.max(8, window.innerWidth - r.right),
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const panel =
    open && pos ? (
      <div
        ref={panelRef}
        role="menu"
        aria-label="Notifications"
        className="fixed z-[200] w-[min(24rem,calc(100vw-1rem))] rounded-2xl border border-white/15 bg-[var(--card)]/98 p-2 shadow-[var(--shadow-3d)] backdrop-blur-xl"
        style={{ top: pos.top, right: pos.right }}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm font-semibold text-[var(--text)]">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              onMarkAllRead?.();
            }}
          >
            Mark all read
          </Button>
        </div>
        <div className="max-h-80 space-y-1 overflow-y-auto py-1">
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">You are all caught up.</p>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "rounded-xl px-3 py-2 transition hover:bg-white/8",
                  !n.read && "bg-teal-500/15",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--text)]">{n.title}</p>
                  {!n.read ? <Badge tone="info">New</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{n.body}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]/80">
                  {new Date(n.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="relative inline-flex shrink-0" ref={anchorRef}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 shrink-0 rounded-full border border-white/15 bg-white/10 p-0 shadow-inner backdrop-blur-sm"
          aria-label="Notifications"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">🔔</span>
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </div>
      {typeof document !== "undefined" && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
