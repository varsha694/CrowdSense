import { cn } from '../../lib/utils';
import { CrowdStatus } from '../../types/crowd';

interface AlertPulseProps {
  status: CrowdStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRing?: boolean;
}

export function AlertPulse({ status, size = 'md', className, showRing = true }: AlertPulseProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const ringDelay = {
    high: 'animate-[pulse-ring_1.5s_cubic-bezier(0,0,0.2,1)_infinite]',
    medium: 'animate-[pulse-ring_2.5s_cubic-bezier(0,0,0.2,1)_infinite]',
    low: '', // No pulse for low
  };

  const statusColors = {
    high: 'bg-status-high',
    medium: 'bg-status-medium',
    low: 'bg-status-low',
  };

  const glowColors = {
    high: 'shadow-[0_0_12px_hsl(var(--status-high)/0.6)]',
    medium: 'shadow-[0_0_8px_hsl(var(--status-medium)/0.4)]',
    low: '',
  };

  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || status === 'low') {
    return (
      <span
        className={cn(
          'relative inline-flex rounded-full',
          statusColors[status],
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span className={cn('relative inline-flex', className)}>
      {showRing && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            statusColors[status],
            ringDelay[status]
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex rounded-full',
          statusColors[status],
          sizeClasses[size],
          glowColors[status],
          status === 'high' && 'animate-pulse'
        )}
      />
    </span>
  );
}

interface AlertHaloProps {
  status: CrowdStatus;
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1, derived from capacity percentage
}

export function AlertHalo({ status, children, className, intensity = 1 }: AlertHaloProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use inline styles for dynamic shadow values
  const getHaloStyle = () => {
    if (prefersReducedMotion || status === 'low') return {};
    
    if (status === 'high') {
      return {
        boxShadow: `0 0 20px hsla(0, 84%, 60%, ${0.3 * intensity}), 0 0 40px hsla(0, 84%, 60%, ${0.15 * intensity})`,
      };
    }
    if (status === 'medium') {
      return {
        boxShadow: `0 0 15px hsla(38, 92%, 50%, ${0.2 * intensity})`,
      };
    }
    return {};
  };

  return (
    <div
      className={cn(
        'relative transition-shadow duration-500',
        className
      )}
      style={getHaloStyle()}
    >
      {children}
    </div>
  );
}

interface PulsingBadgeProps {
  count: number;
  className?: string;
}

export function PulsingBadge({ count, className }: PulsingBadgeProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (count === 0) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full',
        'bg-status-high text-white',
        !prefersReducedMotion && 'animate-pulse shadow-[0_0_10px_hsl(var(--status-high)/0.5)]',
        className
      )}
    >
      {count}
    </span>
  );
}
