import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { StatusBadge } from '@/components/ui/status-badge';
import { CapacityBar } from '@/components/ui/capacity-bar';
import { TrendChart, HourlyBarChart } from '@/components/TrendChart';
import { useCrowdStore } from '@/store/crowdStore';
import {
  calculateUtilization,
  getCrowdStatus,
  calculateWaitTime,
  getStatusLabel,
  formatTimeAgo,
  getLocationTypeIcon,
} from '@/types/crowd';
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LocationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLocationById, getCrowdLogsForLocation } = useCrowdStore();
  
  const location = getLocationById(id || '');
  
  if (!location) {
    return (
      <PageLayout>
        <main className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The location you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </main>
      </PageLayout>
    );
  }
  
  const crowdLogs = getCrowdLogsForLocation(location.id);
  const utilization = calculateUtilization(location.currentCount, location.capacity);
  const status = getCrowdStatus(utilization);
  const waitTime = calculateWaitTime(location.currentCount, location.averageServiceRate);
  
  // Find peak hour from trends
  const peakHour = 18; // 6 PM typically
  const isPeakNow = new Date().getHours() >= 17 && new Date().getHours() <= 19;
  
  return (
    <PageLayout>
      <main className="container px-4 py-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{getLocationTypeIcon(location.type)}</span>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{location.name}</h1>
                  <StatusBadge status={status} size="lg">
                    {getStatusLabel(status)}
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {location.city}, {location.state}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {formatTimeAgo(location.lastUpdated)}
                </p>
              </div>
            </div>
            
            {status === 'critical' || status === 'high' ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-high/10 border border-status-high/30">
                <AlertTriangle className="w-5 h-5 text-status-high" />
                <span className="text-sm font-medium text-status-high">
                  High capacity alert
                </span>
              </div>
            ) : null}
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {location.currentCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Current Count</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {location.capacity.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Max Capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-status-medium/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-status-medium" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {waitTime} <span className="text-sm font-normal">min</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Est. Wait Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">{utilization}%</p>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Capacity Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">Capacity Utilization</h3>
          <CapacityBar
            current={location.currentCount}
            max={location.capacity}
            status={status}
            size="lg"
          />
        </motion.div>
        
        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  24-Hour Crowd Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  locationId={location.id}
                  crowdLogs={crowdLogs}
                  capacity={location.capacity}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-primary" />
                  Hourly Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HourlyBarChart locationId={location.id} />
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-status-medium" />
                    <span className="text-sm font-medium">Peak Hours: 6:00 PM - 8:00 PM</span>
                  </div>
                  {isPeakNow && (
                    <p className="text-xs text-status-high mt-1">
                      ⚠️ Currently in peak hours
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Best Time to Visit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Best Time to Visit
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-status-low/10 border border-status-low/30">
              <p className="text-sm font-medium text-status-low">Low Crowd</p>
              <p className="text-xs text-muted-foreground mt-1">6:00 AM - 9:00 AM</p>
            </div>
            <div className="p-4 rounded-lg bg-status-medium/10 border border-status-medium/30">
              <p className="text-sm font-medium text-status-medium">Moderate</p>
              <p className="text-xs text-muted-foreground mt-1">9:00 AM - 5:00 PM</p>
            </div>
            <div className="p-4 rounded-lg bg-status-high/10 border border-status-high/30">
              <p className="text-sm font-medium text-status-high">Avoid</p>
              <p className="text-xs text-muted-foreground mt-1">5:00 PM - 8:00 PM</p>
            </div>
          </div>
        </motion.div>
      </main>
    </PageLayout>
  );
};

export default LocationDetails;
