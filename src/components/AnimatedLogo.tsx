import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import logoSrc from '../assets/logo.png';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function AnimatedLogo({ size = 'md', showText = true }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };
  
  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };
  
  const subtextSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };
  
  return (
    <div className="flex items-center gap-3 group">
      {/* Animated Logo Icon */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Show image logo centered */}
        <img src={logoSrc} alt="CrowdSense" className="w-full h-full object-contain" />
      </motion.div>
      
      {/* Text */}
      {showText && (
        <div>
          <motion.h1
            className={`${textSizes[size]} font-bold tracking-tight`}
            initial={false}
          >
            <span className="text-foreground group-hover:text-primary transition-colors">Crowd</span>
            <motion.span
              className="text-primary"
              animate={{
                textShadow: [
                  '0 0 0px hsl(var(--primary))',
                  '0 0 10px hsl(var(--primary))',
                  '0 0 0px hsl(var(--primary))',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Sense
            </motion.span>
          </motion.h1>
          <motion.p
            className={`${subtextSizes[size]} text-muted-foreground -mt-0.5 uppercase tracking-widest`}
            initial={false}
          >
            Real-Time Intelligence
          </motion.p>
        </div>
      )}
    </div>
  );
}
