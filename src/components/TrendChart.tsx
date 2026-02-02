import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { CrowdLog, HourlyTrend } from '@/types/crowd';
import { generateHourlyTrends } from '@/data/seedData';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  locationId: string;
  crowdLogs: CrowdLog[];
  capacity: number;
  className?: string;
}

export function TrendChart({ locationId, crowdLogs, capacity, className }: TrendChartProps) {
  const chartData = useMemo(() => {
    if (crowdLogs.length === 0) {
      // Use generated hourly trends if no logs
      return generateHourlyTrends(locationId).map((trend) => ({
        time: `${trend.hour.toString().padStart(2, '0')}:00`,
        count: trend.avgCount,
        utilization: trend.avgUtilization,
      }));
    }
    
    return crowdLogs.slice(-24).map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      count: log.count,
      utilization: Math.round((log.count / capacity) * 100),
    }));
  }, [locationId, crowdLogs, capacity]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-semibold">
            {payload[0].value.toLocaleString()} people
          </p>
          <p className="text-xs text-primary">
            {Math.round((payload[0].value / capacity) * 100)}% capacity
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={cn("h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface HourlyBarChartProps {
  locationId: string;
  className?: string;
}

export function HourlyBarChart({ locationId, className }: HourlyBarChartProps) {
  const hourlyData = useMemo(() => {
    return generateHourlyTrends(locationId).map((trend) => ({
      hour: `${trend.hour.toString().padStart(2, '0')}:00`,
      utilization: trend.avgUtilization,
      isPeak: trend.avgUtilization >= 80,
    }));
  }, [locationId]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-semibold">
            {payload[0].value}% avg. utilization
          </p>
          {payload[0].payload.isPeak && (
            <p className="text-xs text-status-high mt-1">⚠️ Peak Hour</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={cn("h-[200px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="hour"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            interval={2}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="utilization"
            radius={[4, 4, 0, 0]}
            fill="hsl(var(--primary))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
