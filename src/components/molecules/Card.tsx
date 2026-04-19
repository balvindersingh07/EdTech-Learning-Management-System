import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const pad: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  className,
  title,
  description,
  actions,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/12 bg-[var(--card)]/90 shadow-[var(--shadow-3d)] backdrop-blur-xl",
        pad[padding],
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            {title ? <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3> : null}
            {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </div>
  );
}
