import { create } from 'zustand';
import { Location, CrowdLog, calculateUtilization, getCrowdStatus } from '@/types/crowd';
import { seedLocations, generateCrowdLogs } from '@/data/seedData';

interface CrowdState {
  locations: Location[];
  crowdLogs: Map<string, CrowdLog[]>;
  selectedCity: string | null;
  searchQuery: string;
  isConnected: boolean;
  lastUpdate: Date;
  
  // Actions
  setSelectedCity: (city: string | null) => void;
  setSearchQuery: (query: string) => void;
  updateLocationCount: (locationId: string, newCount: number) => void;
  addLocation: (location: Omit<Location, 'id' | 'lastUpdated'>) => void;
  deleteLocation: (locationId: string) => void;
  updateLocation: (locationId: string, updates: Partial<Location>) => void;
  getFilteredLocations: () => Location[];
  getLocationById: (id: string) => Location | undefined;
  getCrowdLogsForLocation: (locationId: string) => CrowdLog[];
  simulateRealTimeUpdate: () => void;
}

export const useCrowdStore = create<CrowdState>((set, get) => ({
  locations: seedLocations,
  crowdLogs: new Map(),
  selectedCity: null,
  searchQuery: '',
  isConnected: true,
  lastUpdate: new Date(),
  
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  updateLocationCount: (locationId, newCount) => {
    set((state) => {
      const locations = state.locations.map((loc) => {
        if (loc.id === locationId) {
          return {
            ...loc,
            currentCount: Math.max(0, Math.min(newCount, loc.capacity)),
            lastUpdated: new Date(),
          };
        }
        return loc;
      });
      
      // Add to crowd logs
      const crowdLogs = new Map(state.crowdLogs);
      const existingLogs = crowdLogs.get(locationId) || [];
      crowdLogs.set(locationId, [
        ...existingLogs,
        {
          id: `log-${Date.now()}`,
          locationId,
          count: newCount,
          timestamp: new Date(),
        },
      ].slice(-100)); // Keep last 100 logs
      
      return { locations, crowdLogs, lastUpdate: new Date() };
    });
  },
  
  addLocation: (location) => {
    const newLocation: Location = {
      ...location,
      id: `loc-${Date.now()}`,
      lastUpdated: new Date(),
    };
    set((state) => ({
      locations: [...state.locations, newLocation],
    }));
  },
  
  deleteLocation: (locationId) => {
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== locationId),
    }));
  },
  
  updateLocation: (locationId, updates) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === locationId
          ? { ...loc, ...updates, lastUpdated: new Date() }
          : loc
      ),
    }));
  },
  
  getFilteredLocations: () => {
    const { locations, selectedCity, searchQuery } = get();
    
    return locations.filter((loc) => {
      const matchesCity = !selectedCity || loc.city === selectedCity;
      const matchesSearch =
        !searchQuery ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCity && matchesSearch;
    });
  },
  
  getLocationById: (id) => {
    return get().locations.find((loc) => loc.id === id);
  },
  
  getCrowdLogsForLocation: (locationId) => {
    const location = get().getLocationById(locationId);
    if (!location) return [];
    
    // Check if we have logs, if not generate them
    const existingLogs = get().crowdLogs.get(locationId);
    if (existingLogs && existingLogs.length > 0) {
      return existingLogs;
    }
    
    // Generate historical logs
    const logs = generateCrowdLogs(locationId, location.capacity, 24);
    set((state) => {
      const crowdLogs = new Map(state.crowdLogs);
      crowdLogs.set(locationId, logs);
      return { crowdLogs };
    });
    
    return logs;
  },
  
  // Simulate real-time updates for demo
  simulateRealTimeUpdate: () => {
    set((state) => {
      const locations = state.locations.map((loc) => {
        // Random walk: ±5% change
        const change = Math.floor((Math.random() - 0.5) * loc.capacity * 0.1);
        const newCount = Math.max(0, Math.min(loc.capacity, loc.currentCount + change));
        
        return {
          ...loc,
          currentCount: newCount,
          lastUpdated: new Date(),
        };
      });
      
      return { locations, lastUpdate: new Date(), isConnected: true };
    });
  },
}));
