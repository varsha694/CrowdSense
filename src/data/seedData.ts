import { Location, CrowdLog, HourlyTrend } from '@/types/crowd';

// Seed data with real Indian coordinates for heatmap visualization
export const seedLocations: Location[] = [
  // Mumbai
  {
    id: 'loc-1',
    name: 'Lilavati Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'hospital',
    capacity: 500,
    currentCount: 380,
    latitude: 19.0544,
    longitude: 72.8294,
    averageServiceRate: 8,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-2',
    name: 'Phoenix Palladium Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'mall',
    capacity: 3000,
    currentCount: 1850,
    latitude: 18.9947,
    longitude: 72.8258,
    averageServiceRate: 50,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-3',
    name: 'Chhatrapati Shivaji Terminus',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'transport',
    capacity: 10000,
    currentCount: 7500,
    latitude: 18.9398,
    longitude: 72.8355,
    averageServiceRate: 200,
    lastUpdated: new Date(),
  },
  
  // Delhi
  {
    id: 'loc-4',
    name: 'AIIMS Hospital',
    city: 'Delhi',
    state: 'Delhi',
    type: 'hospital',
    capacity: 2400,
    currentCount: 1920,
    latitude: 28.5672,
    longitude: 77.2100,
    averageServiceRate: 30,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-5',
    name: 'Select Citywalk',
    city: 'Delhi',
    state: 'Delhi',
    type: 'mall',
    capacity: 4000,
    currentCount: 2200,
    latitude: 28.5289,
    longitude: 77.2192,
    averageServiceRate: 60,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-6',
    name: 'Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    type: 'mall',
    capacity: 8000,
    currentCount: 3200,
    latitude: 28.6315,
    longitude: 77.2167,
    averageServiceRate: 100,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-7',
    name: 'Delhi University',
    city: 'Delhi',
    state: 'Delhi',
    type: 'university',
    capacity: 15000,
    currentCount: 8500,
    latitude: 28.6889,
    longitude: 77.2099,
    averageServiceRate: 150,
    lastUpdated: new Date(),
  },
  
  // Bangalore
  {
    id: 'loc-8',
    name: 'Manipal Hospital Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'hospital',
    capacity: 600,
    currentCount: 420,
    latitude: 12.9698,
    longitude: 77.7500,
    averageServiceRate: 10,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-9',
    name: 'Phoenix Marketcity',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'mall',
    capacity: 5000,
    currentCount: 3800,
    latitude: 12.9976,
    longitude: 77.6967,
    averageServiceRate: 80,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-10',
    name: 'IISc Campus',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'university',
    capacity: 8000,
    currentCount: 2400,
    latitude: 13.0219,
    longitude: 77.5671,
    averageServiceRate: 80,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-11',
    name: 'Embassy Tech Village',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'office',
    capacity: 20000,
    currentCount: 15000,
    latitude: 12.9279,
    longitude: 77.6899,
    averageServiceRate: 200,
    lastUpdated: new Date(),
  },
  
  // Chennai
  {
    id: 'loc-12',
    name: 'Apollo Hospital',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'hospital',
    capacity: 700,
    currentCount: 490,
    latitude: 13.0067,
    longitude: 80.2206,
    averageServiceRate: 12,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-13',
    name: 'Express Avenue Mall',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'mall',
    capacity: 3500,
    currentCount: 1400,
    latitude: 13.0569,
    longitude: 80.2673,
    averageServiceRate: 55,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-14',
    name: 'Chennai Central Station',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'transport',
    capacity: 12000,
    currentCount: 8400,
    latitude: 13.0827,
    longitude: 80.2707,
    averageServiceRate: 250,
    lastUpdated: new Date(),
  },
  
  // Hyderabad
  {
    id: 'loc-15',
    name: 'KIMS Hospital',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'hospital',
    capacity: 450,
    currentCount: 180,
    latitude: 17.4239,
    longitude: 78.4738,
    averageServiceRate: 8,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-16',
    name: 'Inorbit Mall Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'mall',
    capacity: 4500,
    currentCount: 2700,
    latitude: 17.4355,
    longitude: 78.3847,
    averageServiceRate: 70,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-17',
    name: 'Hitech City IT Park',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'office',
    capacity: 25000,
    currentCount: 18750,
    latitude: 17.4474,
    longitude: 78.3762,
    averageServiceRate: 250,
    lastUpdated: new Date(),
  },
  
  // Kolkata
  {
    id: 'loc-18',
    name: 'AMRI Hospital',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'hospital',
    capacity: 400,
    currentCount: 320,
    latitude: 22.5096,
    longitude: 88.3632,
    averageServiceRate: 7,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-19',
    name: 'South City Mall',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'mall',
    capacity: 3000,
    currentCount: 2100,
    latitude: 22.5006,
    longitude: 88.3639,
    averageServiceRate: 45,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-20',
    name: 'Howrah Station',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'transport',
    capacity: 15000,
    currentCount: 13500,
    latitude: 22.5836,
    longitude: 88.3388,
    averageServiceRate: 300,
    lastUpdated: new Date(),
  },
  
  // Pune
  {
    id: 'loc-21',
    name: 'Ruby Hall Clinic',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'hospital',
    capacity: 350,
    currentCount: 140,
    latitude: 18.5362,
    longitude: 73.8996,
    averageServiceRate: 6,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-22',
    name: 'Phoenix Marketcity Pune',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'mall',
    capacity: 4000,
    currentCount: 2000,
    latitude: 18.5623,
    longitude: 73.9158,
    averageServiceRate: 65,
    lastUpdated: new Date(),
  },
  
  // Ahmedabad
  {
    id: 'loc-23',
    name: 'Sterling Hospital',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'hospital',
    capacity: 300,
    currentCount: 240,
    latitude: 23.0469,
    longitude: 72.5293,
    averageServiceRate: 5,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-24',
    name: 'Ahmedabad One Mall',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'mall',
    capacity: 3500,
    currentCount: 1750,
    latitude: 23.0469,
    longitude: 72.5129,
    averageServiceRate: 55,
    lastUpdated: new Date(),
  },
  
  // Jaipur
  {
    id: 'loc-25',
    name: 'Fortis Hospital Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'hospital',
    capacity: 280,
    currentCount: 196,
    latitude: 26.8504,
    longitude: 75.8043,
    averageServiceRate: 5,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-26',
    name: 'World Trade Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'mall',
    capacity: 5000,
    currentCount: 3500,
    latitude: 26.8939,
    longitude: 75.8097,
    averageServiceRate: 75,
    lastUpdated: new Date(),
  },
];

// Generate mock hourly trends for a location
export const generateHourlyTrends = (locationId: string): HourlyTrend[] => {
  const trends: HourlyTrend[] = [];
  
  // Simulate realistic hourly patterns
  const basePatterns: { [key: number]: number } = {
    0: 0.1, 1: 0.05, 2: 0.05, 3: 0.05, 4: 0.08, 5: 0.15,
    6: 0.25, 7: 0.4, 8: 0.6, 9: 0.75, 10: 0.85, 11: 0.9,
    12: 0.95, 13: 0.85, 14: 0.8, 15: 0.75, 16: 0.8, 17: 0.9,
    18: 0.95, 19: 0.85, 20: 0.7, 21: 0.5, 22: 0.3, 23: 0.15
  };
  
  for (let hour = 0; hour < 24; hour++) {
    const variation = 0.9 + Math.random() * 0.2; // ±10% variation
    const utilization = Math.round(basePatterns[hour] * 100 * variation);
    trends.push({
      hour,
      avgCount: Math.round(utilization * 10), // Approximate count
      avgUtilization: Math.min(100, utilization),
    });
  }
  
  return trends;
};

// Generate mock crowd logs for historical data
export const generateCrowdLogs = (locationId: string, capacity: number, hoursBack: number = 24): CrowdLog[] => {
  const logs: CrowdLog[] = [];
  const now = new Date();
  
  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    
    // Use realistic patterns
    const basePatterns: { [key: number]: number } = {
      0: 0.1, 1: 0.05, 2: 0.05, 3: 0.05, 4: 0.08, 5: 0.15,
      6: 0.25, 7: 0.4, 8: 0.6, 9: 0.75, 10: 0.85, 11: 0.9,
      12: 0.95, 13: 0.85, 14: 0.8, 15: 0.75, 16: 0.8, 17: 0.9,
      18: 0.95, 19: 0.85, 20: 0.7, 21: 0.5, 22: 0.3, 23: 0.15
    };
    
    const variation = 0.85 + Math.random() * 0.3;
    const count = Math.round(capacity * basePatterns[hour] * variation);
    
    logs.push({
      id: `log-${locationId}-${i}`,
      locationId,
      count: Math.min(capacity, Math.max(0, count)),
      timestamp,
    });
  }
  
  return logs;
};

// Get unique cities from locations
export const getUniqueCities = (): string[] => {
  return [...new Set(seedLocations.map(loc => loc.city))].sort();
};
