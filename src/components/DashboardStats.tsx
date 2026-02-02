import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCrowdStore } from '@/store/crowdStore';
import { calculateUtilization, getCrowdStatus } from '@/types/crowd';
import { Users, AlertTriangle, TrendingUp, Clock, MapPin, Activity } from 'lucide-react';

export function DashboardStats() {
  const { locations } = useCrowdStore();
  
  const stats = useMemo(() => {
    const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
    const totalCurrent = locations.reduce((sum, loc) => sum + loc.currentCount, 0);
    const avgUtilization = Math.round((totalCurrent / totalCapacity) * 100);
    
    const statusCounts = locations.reduce(
      (acc, loc) => {
        const util = calculateUtilization(loc.currentCount, loc.capacity);
        const status = getCrowdStatus(util);
        acc[status]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0, critical: 0 }
    );
    
    const criticalLocations = locations.filter((loc) => {
      const util = calculateUtilization(loc.currentCount, loc.capacity);
      return getCrowdStatus(util) === 'critical' || getCrowdStatus(util) === 'high';
    });
    
    const busiestLocation = locations.reduce((prev, curr) => {
      const prevUtil = calculateUtilization(prev.currentCount, prev.capacity);
      const currUtil = calculateUtilization(curr.currentCount, curr.capacity);
      return currUtil > prevUtil ? curr : prev;
    });
    
    return {
      totalLocations: locations.length,
      totalCurrent,
      totalCapacity,
      avgUtilization,
      statusCounts,
      criticalLocations,
      busiestLocation,
    };
  }, [locations]);
  
  const statCards = [
    {
      label: 'Total Locations',
      value: stats.totalLocations,
      icon: MapPin,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Occupancy',
      value: stats.totalCurrent.toLocaleString(),
      subValue: `of ${stats.totalCapacity.toLocaleString()}`,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Avg Utilization',
      value: `${stats.avgUtilization}%`,
      icon: Activity,
      color: stats.avgUtilization > 75 ? 'text-status-high' : 'text-status-low',
      bgColor: stats.avgUtilization > 75 ? 'bg-status-high/10' : 'bg-status-low/10',
    },
    {
      label: 'High Capacity Alerts',
      value: stats.statusCounts.high + stats.statusCounts.critical,
      icon: AlertTriangle,
      color: 'text-status-high',
      bgColor: 'bg-status-high/10',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              {stat.subValue && (
                <p className="text-xs text-muted-foreground mt-0.5">{stat.subValue}</p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
