import { motion } from 'framer-motion';
import { Clock, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  showLive?: boolean;
}

const timeRanges = [
  { id: 'live', label: 'Live', icon: Radio },
  { id: '1h', label: '1H' },
  { id: '6h', label: '6H' },
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
];

export function TimeFilter({ selectedRange, onRangeChange, showLive = true }: TimeFilterProps) {
  const filteredRanges = showLive ? timeRanges : timeRanges.filter((r) => r.id !== 'live');
  
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
        {filteredRanges.map((range) => (
          <Button
            key={range.id}
            variant={selectedRange === range.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onRangeChange(range.id)}
            className={`relative h-7 px-3 text-xs font-medium ${
              selectedRange === range.id ? '' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {selectedRange === range.id && (
              <motion.div
                layoutId="timeFilterBg"
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1 ${
              selectedRange === range.id ? 'text-primary-foreground' : ''
            }`}>
              {range.id === 'live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-status-low animate-pulse" />
              )}
              {range.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
