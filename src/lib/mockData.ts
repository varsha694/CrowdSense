export interface Location {
  id: string;
  name: string;
  description: string;
  capacity: number;
  currentCount: number;
  lastUpdated: Date;
  category: 'event' | 'hospital' | 'office' | 'campus' | 'service';
  averageServiceRate: number; // people served per minute
}

export interface CrowdLog {
  locationId: string;
  count: number;
  timestamp: Date;
}

// Generate hourly data for the past 24 hours
const generateHourlyData = (baseCount: number, variance: number): CrowdLog[] => {
  const now = new Date();
  const logs: CrowdLog[] = [];
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    timestamp.setMinutes(0, 0, 0);
    
    // Simulate realistic crowd patterns (higher during work hours)
    const hour = timestamp.getHours();
    let multiplier = 0.3;
    if (hour >= 9 && hour <= 11) multiplier = 0.8;
    else if (hour >= 12 && hour <= 14) multiplier = 1.0;
    else if (hour >= 15 && hour <= 17) multiplier = 0.9;
    else if (hour >= 18 && hour <= 20) multiplier = 0.6;
    
    const count = Math.floor(baseCount * multiplier + (Math.random() - 0.5) * variance);
    logs.push({
      locationId: '',
      count: Math.max(0, count),
      timestamp,
    });
  }
  
  return logs;
};

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Auditorium',
    description: 'Central conference hall for events and gatherings',
    capacity: 500,
    currentCount: 342,
    lastUpdated: new Date(),
    category: 'event',
    averageServiceRate: 2.5,
  },
  {
    id: '2',
    name: 'Emergency Department',
    description: 'Hospital emergency room and waiting area',
    capacity: 80,
    currentCount: 67,
    lastUpdated: new Date(Date.now() - 120000),
    category: 'hospital',
    averageServiceRate: 0.5,
  },
  {
    id: '3',
    name: 'Building A Lobby',
    description: 'Main entrance lobby for corporate offices',
    capacity: 150,
    currentCount: 45,
    lastUpdated: new Date(Date.now() - 300000),
    category: 'office',
    averageServiceRate: 3.0,
  },
  {
    id: '4',
    name: 'Student Center',
    description: 'Central campus hub with dining and recreation',
    capacity: 400,
    currentCount: 289,
    lastUpdated: new Date(Date.now() - 60000),
    category: 'campus',
    averageServiceRate: 4.0,
  },
  {
    id: '5',
    name: 'DMV Office',
    description: 'Public motor vehicle services center',
    capacity: 120,
    currentCount: 98,
    lastUpdated: new Date(Date.now() - 180000),
    category: 'service',
    averageServiceRate: 0.3,
  },
  {
    id: '6',
    name: 'Food Court',
    description: 'Mall dining area with multiple vendors',
    capacity: 300,
    currentCount: 156,
    lastUpdated: new Date(Date.now() - 90000),
    category: 'event',
    averageServiceRate: 5.0,
  },
];

export const mockCrowdLogs: Record<string, CrowdLog[]> = {
  '1': generateHourlyData(350, 100).map(log => ({ ...log, locationId: '1' })),
  '2': generateHourlyData(50, 20).map(log => ({ ...log, locationId: '2' })),
  '3': generateHourlyData(60, 30).map(log => ({ ...log, locationId: '3' })),
  '4': generateHourlyData(280, 80).map(log => ({ ...log, locationId: '4' })),
  '5': generateHourlyData(80, 25).map(log => ({ ...log, locationId: '5' })),
  '6': generateHourlyData(180, 60).map(log => ({ ...log, locationId: '6' })),
};

// Crowd analysis utilities
export const getUtilization = (current: number, capacity: number): number => {
  return Math.round((current / capacity) * 100);
};

export type CrowdStatus = 'low' | 'medium' | 'high';

export const getCrowdStatus = (utilization: number): CrowdStatus => {
  if (utilization <= 40) return 'low';
  if (utilization <= 75) return 'medium';
  return 'high';
};

export const getStatusLabel = (status: CrowdStatus): string => {
  const labels: Record<CrowdStatus, string> = {
    low: 'Low Crowd',
    medium: 'Moderate',
    high: 'High Crowd',
  };
  return labels[status];
};

export const getEstimatedWaitTime = (currentCount: number, serviceRate: number): number => {
  // Returns wait time in minutes
  if (serviceRate <= 0) return 0;
  return Math.round(currentCount / serviceRate);
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getCategoryIcon = (category: Location['category']): string => {
  const icons: Record<Location['category'], string> = {
    event: '🎭',
    hospital: '🏥',
    office: '🏢',
    campus: '🎓',
    service: '🏛️',
  };
  return icons[category];
};

export const getCategoryLabel = (category: Location['category']): string => {
  const labels: Record<Location['category'], string> = {
    event: 'Event Venue',
    hospital: 'Healthcare',
    office: 'Office',
    campus: 'Campus',
    service: 'Public Service',
  };
  return labels[category];
};
