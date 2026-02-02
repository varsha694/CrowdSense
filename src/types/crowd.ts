// Types for CrowdSense platform

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  type: LocationType;
  capacity: number;
  currentCount: number;
  latitude: number;
  longitude: number;
  averageServiceRate: number; // people served per minute
  lastUpdated: Date;
  imageUrl?: string;
}

export type LocationType = 
  | 'hospital'
  | 'mall'
  | 'office'
  | 'university'
  | 'transport'
  | 'auditorium'
  | 'government'
  | 'restaurant';

export interface CrowdLog {
  id: string;
  locationId: string;
  count: number;
  timestamp: Date;
}

export interface HourlyTrend {
  hour: number;
  avgCount: number;
  avgUtilization: number;
}

export interface DailyPattern {
  day: string;
  avgCount: number;
  peakHour: number;
}

export type CrowdStatus = 'low' | 'medium' | 'high' | 'critical';

export interface AlertRule {
  id: string;
  locationId: string;
  thresholdPercent: number;
  waitTimeThreshold: number; // in minutes
  emailRecipients: string[];
  smsRecipients: string[];
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}

// Utility functions for crowd analysis
export const calculateUtilization = (currentCount: number, capacity: number): number => {
  // Capacity Utilization = (current_count / max_capacity) * 100
  return Math.round((currentCount / capacity) * 100);
};

export const getCrowdStatus = (utilizationPercent: number): CrowdStatus => {
  // Crowd Status Levels:
  // 0-40% → Low (Green)
  // 41-75% → Medium (Yellow)
  // 76-90% → High (Red)
  // 91-100% → Critical (Dark Red)
  if (utilizationPercent <= 40) return 'low';
  if (utilizationPercent <= 75) return 'medium';
  if (utilizationPercent <= 90) return 'high';
  return 'critical';
};

export const calculateWaitTime = (currentCount: number, averageServiceRate: number): number => {
  // Estimated Wait Time = current_count / average_service_rate
  // Returns time in minutes
  if (averageServiceRate <= 0) return 0;
  return Math.round(currentCount / averageServiceRate);
};

export const getStatusColor = (status: CrowdStatus): string => {
  switch (status) {
    case 'low': return 'hsl(142, 76%, 46%)';
    case 'medium': return 'hsl(45, 93%, 58%)';
    case 'high': return 'hsl(0, 84%, 60%)';
    case 'critical': return 'hsl(0, 90%, 45%)';
  }
};

export const getStatusLabel = (status: CrowdStatus): string => {
  switch (status) {
    case 'low': return 'Low Crowd';
    case 'medium': return 'Moderate';
    case 'high': return 'Busy';
    case 'critical': return 'Near Capacity';
  }
};

export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const getLocationTypeIcon = (type: LocationType): string => {
  switch (type) {
    case 'hospital': return '🏥';
    case 'mall': return '🛒';
    case 'office': return '🏢';
    case 'university': return '🎓';
    case 'transport': return '🚉';
    case 'auditorium': return '🎭';
    case 'government': return '🏛️';
    case 'restaurant': return '🍽️';
  }
};
