import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Location,
  calculateUtilization,
  getCrowdStatus,
  calculateWaitTime,
  getStatusLabel,
  formatTimeAgo,
  getLocationTypeIcon,
  CrowdStatus,
} from "@/types/crowd";
import { StatusBadge } from "@/components/ui/status-badge";
import { CapacityBar } from "@/components/ui/capacity-bar";
import { MapPin, Clock, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Pulsing alert animation component
function PulsingAlert({ status }: { status: CrowdStatus }) {
  if (status === 'low') return null;
  
  const colors = {
    medium: 'hsl(var(--status-medium))',
    high: 'hsl(var(--status-high))',
    critical: 'hsl(var(--status-critical))',
  };
  
  const color = colors[status] || colors.high;
  const duration = status === 'critical' ? 1.5 : status === 'high' ? 2 : 2.5;
  
  return (
    <div className="absolute -inset-[2px] rounded-xl pointer-events-none overflow-hidden">
      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: `0 0 20px ${color}`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Inner glow */}
      {status === 'critical' && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            boxShadow: `inset 0 0 30px ${color}`,
          }}
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}

interface LocationCardProps {
  location: Location;
  previousCount?: number;
  index?: number;
}

export function LocationCard({ location, previousCount, index = 0 }: LocationCardProps) {
  const navigate = useNavigate();
  const utilization = calculateUtilization(location.currentCount, location.capacity);
  const status = getCrowdStatus(utilization);
  const waitTime = calculateWaitTime(location.currentCount, location.averageServiceRate);
  
  // Determine trend
  const trend = previousCount !== undefined
    ? location.currentCount > previousCount
      ? "up"
      : location.currentCount < previousCount
      ? "down"
      : "stable"
    : "stable";
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/location/${location.id}`)}
      className={cn(
        "relative glass-card p-5 cursor-pointer hover:border-primary/30 transition-all duration-300 group",
        status === "critical" && "border-status-critical/30",
        status === "high" && "border-status-high/20"
      )}
    >
      {/* Pulsing alert effect for high capacity */}
      <PulsingAlert status={status} />
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLocationTypeIcon(location.type)}</span>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {location.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3" />
              {location.city}, {location.state}
            </div>
          </div>
        </div>
        <StatusBadge status={status}>{getStatusLabel(status)}</StatusBadge>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold tabular-nums">
                {location.currentCount.toLocaleString()}
              </span>
              <TrendIcon
                className={cn(
                  "w-3 h-3",
                  trend === "up" && "text-status-high",
                  trend === "down" && "text-status-low",
                  trend === "stable" && "text-muted-foreground"
                )}
              />
            </div>
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tabular-nums">{waitTime}</span>
            <span className="text-sm font-normal text-muted-foreground"> min</span>
            <p className="text-xs text-muted-foreground">Est. Wait</p>
          </div>
        </div>
      </div>
      
      {/* Capacity Bar */}
      <CapacityBar
        current={location.currentCount}
        max={location.capacity}
        status={status}
        size="md"
      />
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Updated {formatTimeAgo(location.lastUpdated)}
        </span>
        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View Details →
        </span>
      </div>
    </motion.div>
  );
}
