import { cn } from "@/lib/utils";
import { CrowdStatus } from "@/types/crowd";

interface CapacityBarProps {
  current: number;
  max: number;
  status: CrowdStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CapacityBar({
  current,
  max,
  status,
  showLabel = true,
  size = "md",
  className,
}: CapacityBarProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };
  
  const statusColors = {
    low: "bg-status-low",
    medium: "bg-status-medium",
    high: "bg-status-high",
    critical: "bg-status-critical",
  };
  
  const glowColors = {
    low: "shadow-[0_0_10px_hsl(var(--status-low)/0.5)]",
    medium: "shadow-[0_0_10px_hsl(var(--status-medium)/0.5)]",
    high: "shadow-[0_0_10px_hsl(var(--status-high)/0.5)]",
    critical: "shadow-[0_0_15px_hsl(var(--status-critical)/0.6)]",
  };
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">Capacity</span>
          <span className="text-xs font-medium tabular-nums">
            {current.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            statusColors[status],
            glowColors[status]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-semibold tabular-nums">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
