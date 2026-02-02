import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '@/types/crowd';

interface MovementTrailsProps {
  locations: Location[];
}

interface Trail {
  id: string;
  from: Location;
  to: Location;
  direction: 'inflow' | 'outflow';
  intensity: number;
}

export function MovementTrails({ locations }: MovementTrailsProps) {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Generate movement trails between nearby locations
  const potentialTrails = useMemo(() => {
    const result: Trail[] = [];
    
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const loc1 = locations[i];
        const loc2 = locations[j];
        
        // Calculate distance (simplified - in same city or nearby)
        const distance = Math.sqrt(
          Math.pow(loc1.latitude - loc2.latitude, 2) +
          Math.pow(loc1.longitude - loc2.longitude, 2)
        );
        
        // Only create trails for nearby locations (within ~2 degrees)
        if (distance < 2) {
          const util1 = (loc1.currentCount / loc1.capacity) * 100;
          const util2 = (loc2.currentCount / loc2.capacity) * 100;
          
          // Direction based on utilization difference
          const direction = util1 > util2 ? 'outflow' : 'inflow';
          const intensity = Math.abs(util1 - util2) / 100;
          
          result.push({
            id: `${loc1.id}-${loc2.id}`,
            from: util1 > util2 ? loc1 : loc2,
            to: util1 > util2 ? loc2 : loc1,
            direction,
            intensity: Math.min(1, intensity * 2),
          });
        }
      }
    }
    
    return result;
  }, [locations]);
  
  // Rotate which trails are visible for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Select subset of trails to show
  useEffect(() => {
    const selectedTrails = potentialTrails
      .filter((_, index) => index % 3 === animationPhase)
      .slice(0, 5);
    setTrails(selectedTrails);
  }, [potentialTrails, animationPhase]);
  
  // Convert lat/lng to approximate screen position
  // This is a simplified projection for the overlay
  const getPosition = (location: Location) => {
    // Normalize to India's bounding box
    const minLat = 8;
    const maxLat = 35;
    const minLng = 68;
    const maxLng = 97;
    
    const x = ((location.longitude - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((location.latitude - minLat) / (maxLat - minLat)) * 100;
    
    return { x, y };
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <marker
            id="arrowhead"
            markerWidth="3"
            markerHeight="2"
            refX="2"
            refY="1"
            orient="auto"
          >
            <polygon
              points="0 0, 3 1, 0 2"
              fill="hsl(var(--primary))"
              opacity="0.8"
            />
          </marker>
        </defs>
        
        <AnimatePresence>
          {trails.map((trail) => {
            const from = getPosition(trail.from);
            const to = getPosition(trail.to);
            
            // Calculate control point for curved line
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const controlX = midX - dy * 0.2;
            const controlY = midY + dx * 0.2;
            
            return (
              <motion.g
                key={trail.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: trail.intensity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Trail path */}
                <motion.path
                  d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
                  stroke="url(#trailGradient)"
                  strokeWidth="0.3"
                  fill="none"
                  filter="url(#glow)"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Moving particle */}
                <motion.circle
                  r="0.4"
                  fill="hsl(var(--primary))"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    offsetDistance: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath: `path("M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}")`,
                  }}
                />
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 glass-card p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Movement Flow
        </p>
        <div className="flex items-center gap-2">
          <svg width="24" height="12" viewBox="0 0 24 12">
            <path
              d="M 2 6 Q 12 2 22 6"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          </svg>
          <span className="text-xs">Crowd Flow Direction</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Arrows indicate predicted movement
        </p>
      </div>
    </div>
  );
}
