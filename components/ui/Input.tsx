import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          suppressHydrationWarning
          className={cn(
            "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500",
            error
              ? "border-red-400 focus:ring-red-400 focus:border-red-400"
              : "border-slate-300 hover:border-slate-400",
            className,
          )}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
