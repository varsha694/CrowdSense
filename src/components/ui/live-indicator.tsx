import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LiveIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
  className?: string;
}

export function LiveIndicator({ isConnected, lastUpdate, className }: LiveIndicatorProps) {
  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center">
        {isConnected ? (
          <>
            <motion.span
              className="absolute w-2.5 h-2.5 bg-status-low rounded-full"
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="w-2.5 h-2.5 bg-status-low rounded-full relative z-10" />
          </>
        ) : (
          <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {isConnected ? (
          <>
            <span className="text-status-low font-medium">LIVE</span>
            {lastUpdate && (
              <span className="ml-1.5">· Updated {formatTime(lastUpdate)}</span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">Disconnected</span>
        )}
      </span>
    </div>
  );
}
