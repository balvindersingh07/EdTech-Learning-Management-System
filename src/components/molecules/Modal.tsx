import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";
import { useEffect, type ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, title, description, onClose, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const width = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full rounded-2xl border border-white/12 bg-[var(--card)]/95 p-6 shadow-[var(--shadow-3d)] backdrop-blur-xl",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
            {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" className="shrink-0" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="mt-4">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
