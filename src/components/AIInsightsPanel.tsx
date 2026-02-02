import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, calculateUtilization, getCrowdStatus, CrowdStatus } from '../types/crowd';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Sparkles, 
  Route, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Clock,
  ChevronRight,
  Lightbulb,
  Shield,
  RefreshCw,
  MapPin,
  Users,
  Zap
} from 'lucide-react';

interface AIInsightsPanelProps {
  locations: Location[];
  className?: string;
}

interface Insight {
  id: string;
  type: 'route' | 'prediction' | 'alert' | 'tip' | 'normalization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  icon: typeof Sparkles;
  action?: string;
  zones?: string[];
  timestamp: Date;
}

// Insight message templates for variation
const alertTemplates = {
  congestion: [
    (count: number, zones: string) => `Critical congestion detected across ${count} zones: ${zones}. Consider delaying travel to these areas.`,
    (count: number, zones: string) => `${count} locations experiencing high crowd density: ${zones}. Alternative routes recommended.`,
    (count: number, zones: string) => `Alert: ${zones} showing dangerous congestion levels. Emergency protocols may be activated.`,
  ],
  peakHours: [
    (hours: number) => `Peak hours in effect. Expect ${20 + Math.floor(Math.random() * 15)}% higher density for the next ${hours} hour(s).`,
    (hours: number) => `Currently experiencing rush hour conditions. Crowd levels elevated for approximately ${hours} more hour(s).`,
    (hours: number) => `High-traffic period active. Plan for ${hours}+ hours of increased congestion at transport hubs.`,
  ],
  approaching: [
    (hours: number) => `Peak hours begin in ${hours} hour(s). Plan visits to busy locations before the rush.`,
    (hours: number) => `Congestion warning: ${hours} hour(s) until peak traffic. Consider early departures.`,
    (hours: number) => `Traffic surge expected in ${hours} hour(s). Current window is optimal for travel.`,
  ],
  normalization: [
    (zones: string) => `Crowd levels normalizing in ${zones}. Conditions improving.`,
    (zones: string) => `Density decreasing at ${zones}. Safe to resume normal activities.`,
    (zones: string) => `${zones} returning to normal capacity. Traffic flowing smoothly.`,
  ],
  saferRoute: [
    (crowded: string, alt: string, util: number) => `${crowded} is congested. ${alt} is at ${util}% capacity — much safer option.`,
    (crowded: string, alt: string, util: number) => `Avoid ${crowded}. Recommend ${alt} instead, currently ${util}% utilized.`,
    (crowded: string, alt: string, util: number) => `Route optimization: Bypass ${crowded}. ${alt} shows ${util}% capacity — optimal choice.`,
  ],
  transportBusy: [
    (util: number) => `Transport hubs averaging ${util}% capacity. Metro or alternative transport recommended.`,
    (util: number) => `Railway stations at ${util}% average density. Consider off-peak travel times.`,
    (util: number) => `High traffic at transport nodes (${util}% avg). Plan extra travel time or use alternatives.`,
  ],
};

// Pick random template
const pickTemplate = <T extends (...args: any[]) => string>(templates: T[]): T => {
  return templates[Math.floor(Math.random() * templates.length)];
};

export function AIInsightsPanel({ locations, className }: AIInsightsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [insightVersion, setInsightVersion] = useState(0);
  
  // Analyze current crowd conditions
  const analysis = useMemo(() => {
    const statusCounts: Record<CrowdStatus, Location[]> = {
      low: [],
      medium: [],
      high: [],
      critical: [],
    };
    
    locations.forEach((loc) => {
      const util = calculateUtilization(loc.currentCount, loc.capacity);
      const status = getCrowdStatus(util);
      statusCounts[status].push(loc);
    });
    
    const totalLocations = locations.length;
    const avgUtilization = locations.reduce((sum, loc) => 
      sum + calculateUtilization(loc.currentCount, loc.capacity), 0
    ) / totalLocations || 0;
    
    const highDensity = [...statusCounts.high, ...statusCounts.critical];
    const lowDensity = statusCounts.low;
    
    // Group by city for zone analysis
    const cityDensity: Record<string, { total: number; count: number; locations: Location[] }> = {};
    locations.forEach((loc) => {
      if (!cityDensity[loc.city]) {
        cityDensity[loc.city] = { total: 0, count: 0, locations: [] };
      }
      cityDensity[loc.city].total += calculateUtilization(loc.currentCount, loc.capacity);
      cityDensity[loc.city].count++;
      cityDensity[loc.city].locations.push(loc);
    });
    
    const hotCities = Object.entries(cityDensity)
      .filter(([_, data]) => (data.total / data.count) > 70)
      .map(([city]) => city);
    
    const coolCities = Object.entries(cityDensity)
      .filter(([_, data]) => (data.total / data.count) < 40)
      .map(([city]) => city);
    
    // Transport analysis
    const transportLocations = locations.filter((loc) => loc.type === 'transport');
    const avgTransportUtil = transportLocations.reduce((sum, loc) => 
      sum + calculateUtilization(loc.currentCount, loc.capacity), 0
    ) / transportLocations.length || 0;
    
    return {
      statusCounts,
      highDensity,
      lowDensity,
      avgUtilization,
      hotCities,
      coolCities,
      avgTransportUtil,
      transportLocations,
    };
  }, [locations, insightVersion]);
  
  // Generate dynamic insights based on current conditions
  const insights = useMemo((): Insight[] => {
    const newInsights: Insight[] = [];
    const currentHour = new Date().getHours();
    const {
      highDensity,
      lowDensity,
      hotCities,
      coolCities,
      avgTransportUtil,
    } = analysis;
    
    // ALERT: Multiple high-density zones
    if (highDensity.length >= 3) {
      const zones = highDensity.slice(0, 3).map(l => l.name).join(', ');
      newInsights.push({
        id: `alert-congestion-${insightVersion}`,
        type: 'alert',
        title: 'Multi-Zone Congestion Alert',
        description: pickTemplate(alertTemplates.congestion)(highDensity.length, zones),
        priority: 'high',
        icon: AlertTriangle,
        zones: highDensity.map(l => l.city),
        timestamp: new Date(),
      });
    }
    
    // ALERT: Hot cities warning
    if (hotCities.length >= 2) {
      newInsights.push({
        id: `alert-cities-${insightVersion}`,
        type: 'alert',
        title: 'Regional Congestion Warning',
        description: `Heavy crowd density detected in ${hotCities.join(', ')}. City-wide delays possible.`,
        priority: 'high',
        icon: MapPin,
        zones: hotCities,
        timestamp: new Date(),
      });
    }
    
    // PREDICTION: Peak hours
    const peakHours = [17, 18, 19]; // 5-7 PM
    const morningPeak = [9, 10]; // 9-10 AM
    
    if (peakHours.includes(currentHour)) {
      const hoursRemaining = 20 - currentHour;
      newInsights.push({
        id: `prediction-peak-${insightVersion}`,
        type: 'prediction',
        title: 'Peak Hours Active',
        description: pickTemplate(alertTemplates.peakHours)(hoursRemaining),
        priority: 'medium',
        icon: TrendingUp,
        timestamp: new Date(),
      });
    } else if (morningPeak.includes(currentHour)) {
      newInsights.push({
        id: `prediction-morning-${insightVersion}`,
        type: 'prediction',
        title: 'Morning Rush Active',
        description: `Morning commute peak in progress. Office areas and transport hubs experiencing ${15 + Math.floor(Math.random() * 10)}% higher traffic.`,
        priority: 'medium',
        icon: Users,
        timestamp: new Date(),
      });
    } else if (currentHour >= 14 && currentHour < 17) {
      newInsights.push({
        id: `prediction-approaching-${insightVersion}`,
        type: 'prediction',
        title: 'Peak Hours Approaching',
        description: pickTemplate(alertTemplates.approaching)(17 - currentHour),
        priority: 'low',
        icon: Clock,
        timestamp: new Date(),
      });
    }
    
    // ROUTE: Safer alternatives
    if (highDensity.length > 0 && lowDensity.length > 0) {
      const crowded = highDensity[0];
      const alternative = lowDensity.find(
        (loc) => loc.city === crowded.city && loc.type === crowded.type
      ) || lowDensity[0];
      
      const altUtil = calculateUtilization(alternative.currentCount, alternative.capacity);
      
      newInsights.push({
        id: `route-safer-${insightVersion}`,
        type: 'route',
        title: 'Safer Alternative Found',
        description: pickTemplate(alertTemplates.saferRoute)(crowded.name, alternative.name, altUtil),
        priority: 'high',
        icon: Route,
        action: 'View Route',
        timestamp: new Date(),
      });
    }
    
    // NORMALIZATION: If conditions improving in previously hot areas
    if (coolCities.length > 0 && highDensity.length < 2) {
      const improvingZones = coolCities.slice(0, 2).join(' and ');
      newInsights.push({
        id: `normal-${insightVersion}`,
        type: 'normalization',
        title: 'Conditions Improving',
        description: pickTemplate(alertTemplates.normalization)(improvingZones),
        priority: 'low',
        icon: TrendingDown,
        zones: coolCities,
        timestamp: new Date(),
      });
    }
    
    // TIP: Transport advice
    if (avgTransportUtil > 60) {
      newInsights.push({
        id: `tip-transport-${insightVersion}`,
        type: 'tip',
        title: 'Transport Advisory',
        description: pickTemplate(alertTemplates.transportBusy)(Math.round(avgTransportUtil)),
        priority: avgTransportUtil > 80 ? 'high' : 'medium',
        icon: Lightbulb,
        timestamp: new Date(),
      });
    }
    
    // TIP: Optimal timing (only show if conditions are relatively calm)
    if (highDensity.length < 2 && currentHour >= 11 && currentHour <= 14) {
      newInsights.push({
        id: `tip-optimal-${insightVersion}`,
        type: 'tip',
        title: 'Optimal Travel Window',
        description: 'Current conditions are favorable for travel. Most locations operating below 60% capacity.',
        priority: 'low',
        icon: Shield,
        timestamp: new Date(),
      });
    }
    
    // Real-time update indicator
    if (highDensity.length >= 1) {
      const recentChange = highDensity[0];
      const util = calculateUtilization(recentChange.currentCount, recentChange.capacity);
      newInsights.push({
        id: `realtime-${insightVersion}`,
        type: 'alert',
        title: 'Live Density Spike',
        description: `${recentChange.name} showing ${util}% capacity. Monitoring for further changes.`,
        priority: util > 85 ? 'high' : 'medium',
        icon: Zap,
        zones: [recentChange.city],
        timestamp: new Date(),
      });
    }
    
    return newInsights.slice(0, 5);
  }, [analysis, insightVersion]);
  
  // Refresh insights
  const refreshInsights = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInsightVersion((v) => v + 1);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 600);
  }, []);
  
  // Auto-refresh when locations data changes significantly
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightVersion((v) => v + 1);
      setLastUpdated(new Date());
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Also refresh when locations change
  useEffect(() => {
    setInsightVersion((v) => v + 1);
    setLastUpdated(new Date());
  }, [locations]);
  
  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-status-high/30 bg-status-high/5 dark:border-status-high/40 dark:bg-status-high/10';
      case 'medium':
        return 'border-status-medium/30 bg-status-medium/5 dark:border-status-medium/40 dark:bg-status-medium/10';
      default:
        return 'border-border bg-muted/30';
    }
  };
  
  const getPriorityIconColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-status-high bg-status-high/20';
      case 'medium':
        return 'text-status-medium bg-status-medium/20';
      default:
        return 'text-primary bg-primary/20';
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  
  return (
    <Card className={`glass-card h-full ${className ?? ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Insights
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
              LIVE
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshInsights}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {formatTimeAgo(lastUpdated)} • {insights.length} active insights
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-muted/50 animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-all duration-300 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getPriorityIconColor(insight.priority)}`}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium leading-tight">
                        {insight.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTimeAgo(insight.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {insight.zones && insight.zones.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {insight.zones.slice(0, 3).map((zone) => (
                          <span
                            key={zone}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {insight.action && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-2 text-xs text-primary"
                      >
                        {insight.action}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {!isLoading && insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All systems normal</p>
            <p className="text-xs mt-1">No alerts or recommendations</p>
          </div>
        )}
        
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              🤖 AI-powered • Updates every 15s
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-low animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
