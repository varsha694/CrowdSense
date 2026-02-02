import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: boolean;
}

export function LiveIndicator({ className, size = 'md', label = true }: LiveIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full bg-status-low opacity-75 animate-pulse-ring',
            sizeClasses[size]
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full bg-status-low',
            sizeClasses[size]
          )}
        />
      </span>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-status-low">
          Live
        </span>
      )}
    </div>
  );
}
