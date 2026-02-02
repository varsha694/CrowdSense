export interface Location {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  current_count: number;
  average_service_rate: number;
  category: 'event' | 'hospital' | 'office' | 'campus' | 'service' | 'transport' | 'mall';
  latitude: number;
  longitude: number;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface CrowdLog {
  id: string;
  location_id: string;
  count: number;
  recorded_at: string;
}

export interface AlertRule {
  id: string;
  location_id: string;
  threshold_percent: number;
  wait_time_minutes: number | null;
  alert_frequency_minutes: number;
  email_recipients: string[];
  sms_recipients: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export interface AlertLog {
  id: string;
  alert_rule_id: string;
  location_id: string;
  trigger_type: 'capacity' | 'wait_time';
  trigger_value: number;
  sent_at: string;
}

export type CrowdStatus = 'low' | 'medium' | 'high';

export const getUtilization = (current: number, capacity: number): number => {
  return Math.round((current / capacity) * 100);
};

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
    transport: '🚇',
    mall: '🛒',
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
    transport: 'Transport Hub',
    mall: 'Shopping Mall',
  };
  return labels[category];
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
