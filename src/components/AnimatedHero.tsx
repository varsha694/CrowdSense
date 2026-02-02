import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IndiaMapAnimation } from './IndiaMapAnimation';
import { AnimatedHeadline } from './AnimatedHeadline';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, BarChart3, Radio, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedHeroProps {
  onExplore?: () => void;
}

export function AnimatedHero({ onExplore }: AnimatedHeroProps) {
  const navigate = useNavigate();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [signalCount, setSignalCount] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // Simulate live signal detection
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container relative z-10 px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Live indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-low" />
              </span>
              <span className="text-xs font-medium text-primary">
                Live signals detected • {signalCount.toLocaleString()} updates
              </span>
            </motion.div>

            {/* Animated headline */}
            <AnimatedHeadline className="py-2" />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Real-time crowd intelligence across India — turning live data into timely decisions.
              {hoveredCity && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="block mt-2 text-primary"
                >
                  Monitoring: {hoveredCity}
                </motion.span>
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={onExplore}
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                {/* Ripple effect on hover */}
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Signal className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Start Sensing Live Data</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/heatmap')}
                className="group border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              >
                <Map className="w-5 h-5 mr-2" />
                View India Heatmap
                <motion.span
                  className="ml-2 opacity-0 group-hover:opacity-100"
                  initial={false}
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/analytics')}
                className="group hover:bg-primary/5"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Analytics
              </Button>
            </motion.div>

            {/* Stats preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
            >
              {[
                { label: 'Active Locations', value: '15+', icon: Map },
                { label: 'Live Updates', value: '5s', icon: Radio },
                { label: 'Cities Covered', value: '12', icon: Signal },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animated India Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[600px] mx-auto">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Map container */}
              <div className="absolute inset-8">
                <IndiaMapAnimation 
                  className="w-full h-full"
                  onCityHover={setHoveredCity}
                />
              </div>

              {/* Corner decorations */}
              {[0, 90, 180, 270].map((rotation) => (
                <motion.div
                  key={rotation}
                  className="absolute w-8 h-8 border-l-2 border-t-2 border-primary/30"
                  style={{
                    top: rotation < 180 ? 0 : 'auto',
                    bottom: rotation >= 180 ? 0 : 'auto',
                    left: rotation === 0 || rotation === 270 ? 0 : 'auto',
                    right: rotation === 90 || rotation === 180 ? 0 : 'auto',
                    transform: `rotate(${rotation}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: rotation / 360,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center text-xs text-muted-foreground mt-4"
            >
              Animated visualization represents simulated real-time signals
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 120V60C240 20 480 80 720 60C960 40 1200 80 1440 60V120H0Z"
            fill="hsl(var(--card))"
            initial={{ d: "M0 120V80C240 60 480 100 720 80C960 60 1200 100 1440 80V120H0Z" }}
            animate={{
              d: [
                "M0 120V60C240 20 480 80 720 60C960 40 1200 80 1440 60V120H0Z",
                "M0 120V80C240 60 480 40 720 80C960 60 1200 40 1440 80V120H0Z",
                "M0 120V60C240 20 480 80 720 60C960 40 1200 80 1440 60V120H0Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
}
