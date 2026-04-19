import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftAdornment, rightAdornment, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label className="block w-full space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-[var(--text)]">{label}</span> : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-white/10 px-3 shadow-inner backdrop-blur-sm transition focus-within:ring-2",
          error ? "border-red-400/80 focus-within:ring-red-400/40" : "border-white/15 focus-within:ring-teal-400/45",
        )}
      >
        {leftAdornment ? <span className="text-[var(--muted)]">{leftAdornment}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]/70",
            className,
          )}
          {...props}
        />
        {rightAdornment ? <span className="shrink-0 text-[var(--muted)]">{rightAdornment}</span> : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </label>
  );
});
