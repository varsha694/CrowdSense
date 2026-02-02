import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/PageLayout';
import { DashboardStats } from '../components/DashboardStats';
import { LocationFilters } from '../components/LocationFilters';
import { LocationCard } from '../components/LocationCard';
import { DashboardMap } from '../components/DashboardMap';
import { useCrowdStore } from '../store/crowdStore';
import { Map, Grid3X3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Dashboard = () => {
  const { getFilteredLocations, simulateRealTimeUpdate, locations } = useCrowdStore();
  const filteredLocations = getFilteredLocations();
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      simulateRealTimeUpdate();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [simulateRealTimeUpdate]);
  
  return (
    <PageLayout>
      <main className="container px-4 py-6" id="dashboard-content">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Real-Time Crowd <span className="text-gradient-primary">Intelligence</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Monitor live crowd density across India. Track occupancy, predict peak hours, 
            and prevent overcrowding with actionable insights.
          </p>
        </motion.div>
        
        {/* Stats */}
        <section className="mb-8">
          <DashboardStats />
        </section>
        
        {/* Main Content */}
        <Tabs defaultValue="map" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="map" className="gap-2">
                <Map className="w-4 h-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-2">
                <Grid3X3 className="w-4 h-4" />
                Grid View
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredLocations.length}</span> of{' '}
              <span className="font-medium text-foreground">{locations.length}</span> locations
            </div>
          </div>
          
          {/* Filters */}
          <LocationFilters />
          
          <TabsContent value="map" className="space-y-6">
            {/* Overview Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <Map className="w-4 h-4 text-primary" />
                  Location Overview
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Click on any marker to view location details • For density analysis, visit the <a href="/heatmap" className="text-primary hover:underline">Heatmap</a> page
                </p>
              </div>
              {/* Map container - always dark */}
              <div className="relative bg-[hsl(222,47%,6%)]">
                <DashboardMap locations={filteredLocations} className="h-[450px]" />
              </div>
            </motion.div>
            
          </TabsContent>
          
          <TabsContent value="grid">
            <div className="data-grid">
              {filteredLocations.map((location, index) => (
                <LocationCard key={location.id} location={location} index={index} />
              ))}
            </div>
            
            {filteredLocations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No locations match your filters. Try adjusting your search.
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default Dashboard;
