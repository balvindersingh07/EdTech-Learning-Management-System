import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-white/15 text-[var(--text)] ring-1 ring-inset ring-white/10",
  success: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  warning: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  danger: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100",
  info: "bg-teal-50 text-teal-900 dark:bg-teal-950/80 dark:text-teal-100 ring-1 ring-inset ring-teal-500/20",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
