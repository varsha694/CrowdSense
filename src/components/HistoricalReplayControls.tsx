import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HistoricalReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  isLiveMode: boolean;
  onToggleLiveMode: () => void;
  className?: string;
}

export function HistoricalReplayControls({
  isPlaying,
  onPlayPause,
  currentTime,
  onTimeChange,
  isLiveMode,
  onToggleLiveMode,
  className,
}: HistoricalReplayControlsProps) {
  const [sliderValue, setSliderValue] = useState(100);

  // Calculate the range (24 hours in minutes = 1440)
  const totalMinutes = 24 * 60;
  const now = new Date();
  const startTime = new Date(now.getTime() - totalMinutes * 60 * 1000);

  // Sync slider with currentTime
  useEffect(() => {
    if (isLiveMode) {
      setSliderValue(100);
    } else {
      const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60);
      setSliderValue(Math.max(0, Math.min(100, (elapsed / totalMinutes) * 100)));
    }
  }, [currentTime, isLiveMode, startTime, totalMinutes]);

  const handleSliderChange = useCallback((value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    
    // Calculate the new time
    const minutesFromStart = (newValue / 100) * totalMinutes;
    const newTime = new Date(startTime.getTime() + minutesFromStart * 60 * 1000);
    onTimeChange(newTime);
  }, [startTime, totalMinutes, onTimeChange]);

  const skipBackward = useCallback(() => {
    const newTime = new Date(currentTime.getTime() - 30 * 60 * 1000); // Skip 30 minutes back
    const clampedTime = new Date(Math.max(startTime.getTime(), newTime.getTime()));
    onTimeChange(clampedTime);
  }, [currentTime, startTime, onTimeChange]);

  const skipForward = useCallback(() => {
    const newTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // Skip 30 minutes forward
    const clampedTime = new Date(Math.min(now.getTime(), newTime.getTime()));
    onTimeChange(clampedTime);
  }, [currentTime, now, onTimeChange]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate timeline markers (every 4 hours)
  const timelineMarkers = Array.from({ length: 7 }, (_, i) => {
    const markerTime = new Date(startTime.getTime() + (i * 4 * 60 * 60 * 1000));
    return {
      position: (i / 6) * 100,
      label: formatTime(markerTime),
    };
  });

  return (
    <Card className={cn(
      "bg-background/95 dark:bg-card/95 backdrop-blur-sm border-border/50 shadow-lg",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Historical Replay</span>
          </div>
          
          <Badge 
            variant={isLiveMode ? "default" : "secondary"}
            className={cn(
              "cursor-pointer transition-all",
              isLiveMode && "bg-status-high animate-pulse"
            )}
            onClick={onToggleLiveMode}
          >
            {isLiveMode ? '🔴 LIVE' : '⏸️ REPLAY'}
          </Badge>

          <div className="flex-1" />
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(currentTime)}</span>
            <span className="font-mono font-medium text-foreground">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-2">
          <div className="absolute -top-4 left-0 right-0 flex justify-between text-[10px] text-muted-foreground pointer-events-none">
            {timelineMarkers.map((marker, i) => (
              <span 
                key={i} 
                className="transform -translate-x-1/2"
                style={{ position: 'absolute', left: `${marker.position}%` }}
              >
                {marker.label}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            disabled={isLiveMode}
            className={cn(
              "cursor-pointer",
              isLiveMode && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={skipBackward}
            disabled={isLiveMode}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="icon"
            onClick={onPlayPause}
            disabled={isLiveMode}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={skipForward}
            disabled={isLiveMode}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <div className="ml-4 text-xs text-muted-foreground">
            1x speed
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
