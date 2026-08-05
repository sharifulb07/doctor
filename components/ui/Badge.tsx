import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { AppointmentStatus } from "@/types";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | AppointmentStatus;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
  [AppointmentStatus.PENDING]: "bg-amber-100 text-amber-700",
  [AppointmentStatus.CONFIRMED]: "bg-sky-100 text-sky-700",
  [AppointmentStatus.COMPLETED]: "bg-emerald-100 text-emerald-700",
  [AppointmentStatus.CANCELLED]: "bg-red-100 text-red-700",
};

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        variantStyles[variant] || variantStyles.default,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
