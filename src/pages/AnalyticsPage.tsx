import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { useCrowdStore } from '@/store/crowdStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeFilter } from '@/components/TimeFilter';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  Clock,
  ArrowUp,
  ArrowDown,
  Target,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { calculateUtilization, getCrowdStatus } from '@/types/crowd';

const COLORS = {
  low: 'hsl(var(--status-low))',
  medium: 'hsl(var(--status-medium))',
  high: 'hsl(var(--status-high))',
};

const AnalyticsPage = () => {
  const { locations, getFilteredLocations } = useCrowdStore();
  const filteredLocations = getFilteredLocations();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  
  // Calculate summary stats
  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
  const totalCurrent = locations.reduce((sum, loc) => sum + loc.currentCount, 0);
  const avgUtilization = Math.round((totalCurrent / totalCapacity) * 100);
  
  // Status distribution
  const statusDistribution = locations.reduce((acc, loc) => {
    const util = calculateUtilization(loc.currentCount, loc.capacity);
    const status = getCrowdStatus(util);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = [
    { name: 'Low Density', value: statusDistribution.low || 0, color: COLORS.low },
    { name: 'Moderate', value: statusDistribution.medium || 0, color: COLORS.medium },
    { name: 'High Density', value: (statusDistribution.high || 0) + (statusDistribution.critical || 0), color: COLORS.high },
  ];
  
  // City-wise breakdown
  const cityData = locations.reduce((acc, loc) => {
    if (!acc[loc.city]) {
      acc[loc.city] = { city: loc.city, current: 0, capacity: 0 };
    }
    acc[loc.city].current += loc.currentCount;
    acc[loc.city].capacity += loc.capacity;
    return acc;
  }, {} as Record<string, { city: string; current: number; capacity: number }>);
  
  const cityChartData = Object.values(cityData).map((c) => ({
    ...c,
    utilization: Math.round((c.current / c.capacity) * 100),
  })).sort((a, b) => b.utilization - a.utilization);
  
  // Hourly trend data (mock)
  const hourlyTrendData = Array.from({ length: 24 }, (_, i) => {
    const basePatterns: { [key: number]: number } = {
      0: 0.1, 1: 0.05, 2: 0.05, 3: 0.05, 4: 0.08, 5: 0.15,
      6: 0.25, 7: 0.4, 8: 0.6, 9: 0.75, 10: 0.85, 11: 0.9,
      12: 0.95, 13: 0.85, 14: 0.8, 15: 0.75, 16: 0.8, 17: 0.9,
      18: 0.95, 19: 0.85, 20: 0.7, 21: 0.5, 22: 0.3, 23: 0.15
    };
    return {
      hour: `${i}:00`,
      today: Math.round(basePatterns[i] * 100 * (0.9 + Math.random() * 0.2)),
      yesterday: Math.round(basePatterns[i] * 100 * (0.85 + Math.random() * 0.2)),
      lastWeek: Math.round(basePatterns[i] * 100 * (0.8 + Math.random() * 0.3)),
    };
  });
  
  // Peak hours calculation
  const peakHours = hourlyTrendData
    .sort((a, b) => b.today - a.today)
    .slice(0, 3)
    .map((h) => h.hour);
  
  return (
    <PageLayout>
      <main className="container px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Crowd <span className="text-gradient-primary">Analytics</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Historical patterns, predictions, and crowd intelligence insights
          </p>
        </motion.div>
        
        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <TimeFilter
            selectedRange={selectedTimeRange}
            onRangeChange={setSelectedTimeRange}
            showLive={false}
          />
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Footfall</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {totalCurrent.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-status-low">
                  <ArrowUp className="w-3 h-3" />
                  <span>12% vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Utilization</p>
                    <p className="text-2xl font-bold tabular-nums">{avgUtilization}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-status-medium/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-status-medium" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-status-medium">
                  <ArrowDown className="w-3 h-3" />
                  <span>3% vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Peak Hour</p>
                    <p className="text-2xl font-bold tabular-nums">6 PM</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-status-high/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-status-high" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Consistent for 7 days
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Alerts</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {(statusDistribution.high || 0) + (statusDistribution.critical || 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-status-high/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-status-high" />
                  </div>
                </div>
                <p className="text-xs text-status-high mt-2">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Main Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <Calendar className="w-4 h-4" />
              Comparison
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Hourly Crowd Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={hourlyTrendData}>
                        <defs>
                          <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="hour" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="today"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#colorToday)"
                          name="Today"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      City-wise Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={cityChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis 
                          dataKey="city" 
                          type="category" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Utilization']}
                        />
                        <Bar 
                          dataKey="utilization" 
                          fill="hsl(var(--primary))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Peak Hours Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {peakHours.map((hour, index) => (
                      <div key={hour} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-status-high/20' : index === 1 ? 'bg-status-medium/20' : 'bg-muted'
                          }`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <span className="font-medium">{hour}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          index === 0 ? 'text-status-high' : index === 1 ? 'text-status-medium' : 'text-muted-foreground'
                        }`}>
                          {index === 0 ? 'Busiest' : index === 1 ? 'Very Busy' : 'Busy'}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Today vs Yesterday vs Last Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={hourlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="today" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                      name="Today"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="yesterday" 
                      stroke="hsl(var(--status-medium))" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name="Yesterday"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lastWeek" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="3 3"
                      name="Last Week"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default AnalyticsPage;
