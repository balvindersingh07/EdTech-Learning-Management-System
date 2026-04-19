import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-teal-700 focus-visible:ring-primary shadow-soft dark:shadow-none",
  secondary:
    "bg-secondary text-white hover:bg-teal-900 focus-visible:ring-secondary shadow-soft dark:shadow-none",
  ghost:
    "bg-transparent text-[var(--text)] hover:bg-white/10 dark:hover:bg-white/5",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "h-11 px-4 text-sm rounded-2xl",
  lg: "h-12 px-5 text-base rounded-2xl",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-teal-950 disabled:pointer-events-none disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
