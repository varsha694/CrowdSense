import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { CrowdHeatmap } from '@/components/CrowdHeatmap';
import { MovementTrails } from '@/components/MovementTrails';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { TimeFilter } from '@/components/TimeFilter';
import { useCrowdStore } from '@/store/crowdStore';
import { Button } from '@/components/ui/button';
import { Map, Sparkles, Play, Pause, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const HeatmapPage = () => {
  const { getFilteredLocations, simulateRealTimeUpdate, locations } = useCrowdStore();
  const filteredLocations = getFilteredLocations();
  const [showMovementTrails, setShowMovementTrails] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayTime, setReplayTime] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('live');
  
  // Simulate real-time updates
  useEffect(() => {
    if (selectedTimeRange !== 'live') return;
    
    const interval = setInterval(() => {
      simulateRealTimeUpdate();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [simulateRealTimeUpdate, selectedTimeRange]);
  
  // Handle replay
  useEffect(() => {
    if (!isReplaying) return;
    
    const interval = setInterval(() => {
      setReplayTime((prev) => {
        if (prev >= 100) {
          setIsReplaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isReplaying]);
  
  const handleReplayToggle = () => {
    if (selectedTimeRange === 'live') {
      setSelectedTimeRange('1h');
    }
    setIsReplaying(!isReplaying);
  };
  
  const handleReplayReset = () => {
    setReplayTime(0);
    setIsReplaying(false);
  };
  
  return (
    <PageLayout>
      <main className="container px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <Map className="w-8 h-8 text-primary" />
                India Crowd <span className="text-gradient-primary">Heatmap</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time crowd density visualization with movement tracking
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={showMovementTrails ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMovementTrails(!showMovementTrails)}
                className="gap-2"
              >
                <motion.div
                  animate={{ rotate: showMovementTrails ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  🔄
                </motion.div>
                Movement Trails
              </Button>
              
              <Button
                variant={showAIPanel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Insights
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Time Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <TimeFilter
              selectedRange={selectedTimeRange}
              onRangeChange={setSelectedTimeRange}
            />
            
            {selectedTimeRange !== 'live' && (
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReplayReset}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReplayToggle}
                  >
                    {isReplaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Slider
                    value={[replayTime]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setReplayTime(value)}
                    className="w-full"
                  />
                </div>
                
                <span className="text-sm text-muted-foreground tabular-nums min-w-[60px]">
                  {Math.floor((replayTime / 100) * (selectedTimeRange === '1h' ? 60 : selectedTimeRange === '6h' ? 360 : selectedTimeRange === '24h' ? 1440 : 10080))} min ago
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className={`grid gap-6 ${showAIPanel ? 'lg:grid-cols-[1fr_350px]' : ''}`}>
          {/* Heatmap Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" />
                    Live Crowd Density
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click on any marker to view location details • {filteredLocations.length} locations active
                  </p>
                </div>
                
                {selectedTimeRange === 'live' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-low/20 border border-status-low/30">
                    <span className="w-2 h-2 rounded-full bg-status-low animate-pulse" />
                    <span className="text-xs font-medium text-status-low">LIVE</span>
                  </div>
                )}
              </div>
              
              {/* Map container - always dark background for optimal heatmap visibility */}
              <div className="relative bg-[hsl(222,47%,6%)]">
                <CrowdHeatmap locations={filteredLocations} className="h-[600px]" />
                
                {showMovementTrails && (
                  <MovementTrails locations={filteredLocations} />
                )}
              </div>
            </div>
          </motion.div>
          
          {/* AI Insights Panel */}
          {showAIPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <AIInsightsPanel locations={filteredLocations} />
            </motion.div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default HeatmapPage;
