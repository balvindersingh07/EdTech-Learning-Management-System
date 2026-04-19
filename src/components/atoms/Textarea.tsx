import { cn } from "@/lib/cn";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref,
) {
  const tid = id ?? props.name;
  return (
    <label className="block w-full space-y-1.5" htmlFor={tid}>
      {label ? <span className="text-sm font-medium text-[var(--text)]">{label}</span> : null}
      <textarea
        ref={ref}
        id={tid}
        className={cn(
          "min-h-[120px] w-full rounded-2xl border bg-white/10 px-3 py-2 text-sm text-[var(--text)] shadow-inner outline-none backdrop-blur-sm transition focus:ring-2 focus:ring-teal-400/45 placeholder:text-[var(--muted)]/70",
          error ? "border-red-400/80" : "border-white/15",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </label>
  );
});
