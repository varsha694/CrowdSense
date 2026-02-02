import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Major Indian cities with coordinates (normalized to SVG viewBox)
const CITIES = [
  { name: 'Delhi', x: 280, y: 120, population: 'high' },
  { name: 'Mumbai', x: 180, y: 280, population: 'high' },
  { name: 'Bengaluru', x: 220, y: 400, population: 'high' },
  { name: 'Chennai', x: 290, y: 400, population: 'medium' },
  { name: 'Kolkata', x: 400, y: 220, population: 'high' },
  { name: 'Hyderabad', x: 250, y: 320, population: 'medium' },
  { name: 'Ahmedabad', x: 160, y: 200, population: 'medium' },
  { name: 'Pune', x: 190, y: 300, population: 'medium' },
  { name: 'Jaipur', x: 230, y: 160, population: 'low' },
  { name: 'Lucknow', x: 320, y: 160, population: 'low' },
  { name: 'Chandigarh', x: 260, y: 90, population: 'low' },
  { name: 'Bhopal', x: 260, y: 220, population: 'low' },
  { name: 'Kochi', x: 210, y: 450, population: 'low' },
  { name: 'Guwahati', x: 450, y: 150, population: 'low' },
  { name: 'Nagpur', x: 280, y: 260, population: 'low' },
];

// Connection lines between cities (simulating data flow)
const CONNECTIONS = [
  { from: 0, to: 4 }, // Delhi to Kolkata
  { from: 0, to: 1 }, // Delhi to Mumbai
  { from: 1, to: 2 }, // Mumbai to Bengaluru
  { from: 2, to: 3 }, // Bengaluru to Chennai
  { from: 0, to: 5 }, // Delhi to Hyderabad
  { from: 1, to: 7 }, // Mumbai to Pune
  { from: 0, to: 8 }, // Delhi to Jaipur
  { from: 5, to: 2 }, // Hyderabad to Bengaluru
];

interface IndiaMapAnimationProps {
  className?: string;
  onCityHover?: (city: string | null) => void;
}

export function IndiaMapAnimation({ className, onCityHover }: IndiaMapAnimationProps) {
  const [activePulse, setActivePulse] = useState(0);
  const [hoveredCity, setHoveredCity] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Cycle through cities for pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % CITIES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 500,
        y: ((e.clientY - rect.top) / rect.height) * 500,
      });
    }
  };

  const getDistance = (cityX: number, cityY: number) => {
    return Math.sqrt(Math.pow(mousePos.x - cityX, 2) + Math.pow(mousePos.y - cityY, 2));
  };

  const getDensityColor = (population: string, isActive: boolean) => {
    if (isActive) return 'hsl(var(--primary))';
    switch (population) {
      case 'high': return 'hsl(var(--status-high))';
      case 'medium': return 'hsl(var(--status-medium))';
      default: return 'hsl(var(--status-low))';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* India outline (simplified stylized shape) */}
        <motion.path
          d="M260 50 L320 70 L380 90 L420 120 L460 150 L480 180 L470 220 L450 250 L420 280 L400 320 L380 350 L350 380 L320 400 L290 420 L260 450 L230 470 L200 460 L180 440 L160 410 L150 380 L140 340 L130 300 L140 260 L150 220 L160 180 L180 140 L200 100 L230 70 Z"
          fill="none"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        {/* Connection lines with animated pulses */}
        {CONNECTIONS.map((conn, i) => {
          const from = CITIES[conn.from];
          const to = CITIES[conn.to];
          return (
            <g key={`conn-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="hsl(var(--primary) / 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Animated pulse traveling along the line */}
              <motion.circle
                r="3"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* City nodes */}
        {CITIES.map((city, index) => {
          const isActive = activePulse === index;
          const isHovered = hoveredCity === index;
          const distance = getDistance(city.x, city.y);
          const proximityScale = Math.max(0, 1 - distance / 150);
          const baseRadius = city.population === 'high' ? 8 : city.population === 'medium' ? 6 : 4;

          return (
            <g
              key={city.name}
              onMouseEnter={() => {
                setHoveredCity(index);
                onCityHover?.(city.name);
              }}
              onMouseLeave={() => {
                setHoveredCity(null);
                onCityHover?.(null);
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulse ring */}
              <AnimatePresence>
                {(isActive || isHovered) && (
                  <>
                    <motion.circle
                      cx={city.x}
                      cy={city.y}
                      fill="none"
                      stroke={getDensityColor(city.population, isActive)}
                      strokeWidth="2"
                      initial={{ r: baseRadius, opacity: 0.8 }}
                      animate={{ r: baseRadius + 25, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                    />
                    <motion.circle
                      cx={city.x}
                      cy={city.y}
                      fill="none"
                      stroke={getDensityColor(city.population, isActive)}
                      strokeWidth="1"
                      initial={{ r: baseRadius, opacity: 0.6 }}
                      animate={{ r: baseRadius + 15, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, delay: 0.2, repeat: isHovered ? Infinity : 0 }}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Glow effect based on proximity */}
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={baseRadius + 10 + proximityScale * 8}
                fill={`url(#cityGlow)`}
                opacity={0.3 + proximityScale * 0.4}
              />

              {/* Main city dot */}
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={baseRadius + (isHovered ? 3 : 0)}
                fill={getDensityColor(city.population, isActive || isHovered)}
                filter="url(#glow)"
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />

              {/* City label on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.text
                    x={city.x}
                    y={city.y - 20}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="12"
                    fontWeight="500"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {city.name}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 w-full h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.5) 50%, transparent 100%)',
        }}
        animate={{
          top: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
