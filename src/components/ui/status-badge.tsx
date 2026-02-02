import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-all",
  {
    variants: {
      status: {
        low: "bg-status-low/15 text-status-low border border-status-low/30",
        medium: "bg-status-medium/15 text-status-medium border border-status-medium/30",
        high: "bg-status-high/15 text-status-high border border-status-high/30",
        critical: "bg-status-critical/15 text-status-critical border border-status-critical/30 animate-pulse",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      status: "low",
      size: "default",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
}

export function StatusBadge({
  className,
  status,
  size,
  showDot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "low" && "bg-status-low",
            status === "medium" && "bg-status-medium",
            status === "high" && "bg-status-high",
            status === "critical" && "bg-status-critical animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
