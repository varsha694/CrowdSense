import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const HEADLINES = [
  "Sense the Crowd.",
  "Predict the Rush.",
  "Act Before It Builds.",
  "Intelligence in Motion.",
];

interface AnimatedHeadlineProps {
  className?: string;
}

export function AnimatedHeadline({ className }: AnimatedHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HEADLINES.length);
        setIsTyping(true);
      }, 500);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-1"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-gradient-primary">
              {HEADLINES[currentIndex]}
            </span>
          </h1>
          
          {/* Cursor effect */}
          <motion.span
            className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-primary rounded-full"
            animate={{
              opacity: isTyping ? [1, 0, 1] : 0,
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scanning underline effect */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{
          width: ['0%', '100%', '0%'],
          left: ['0%', '0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
