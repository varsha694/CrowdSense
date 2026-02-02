import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { useCrowdStore } from '@/store/crowdStore';
import { useAuthStore } from '@/store/authStore';
import {
  calculateUtilization,
  getCrowdStatus,
  getStatusLabel,
  getLocationTypeIcon,
  LocationType,
} from '@/types/crowd';
import { StatusBadge } from '@/components/ui/status-badge';
import { CapacityBar } from '@/components/ui/capacity-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Trash2,
  MapPin,
  Minus,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    locations,
    updateLocationCount,
    addLocation,
    deleteLocation,
  } = useCrowdStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    city: '',
    state: '',
    type: 'office' as LocationType,
    capacity: 100,
    currentCount: 0,
    latitude: 20.5937,
    longitude: 78.9629,
    averageServiceRate: 10,
  });
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addLocation(newLocation);
    toast.success('Location added successfully');
    setIsAddDialogOpen(false);
    setNewLocation({
      name: '',
      city: '',
      state: '',
      type: 'office',
      capacity: 100,
      currentCount: 0,
      latitude: 20.5937,
      longitude: 78.9629,
      averageServiceRate: 10,
    });
  };
  
  const handleUpdateCount = (locationId: string, delta: number) => {
    const location = locations.find((l) => l.id === locationId);
    if (!location) return;
    
    const newCount = Math.max(0, Math.min(location.capacity, location.currentCount + delta));
    updateLocationCount(locationId, newCount);
    toast.success(`Count updated to ${newCount}`);
  };
  
  const handleDeleteLocation = (locationId: string) => {
    deleteLocation(locationId);
    toast.success('Location deleted');
  };
  
  // Stats
  const highCapacityCount = locations.filter((loc) => {
    const util = calculateUtilization(loc.currentCount, loc.capacity);
    return getCrowdStatus(util) === 'high' || getCrowdStatus(util) === 'critical';
  }).length;
  
  return (
    <PageLayout>
      <main className="container px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin <span className="text-gradient-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage locations and update crowd counts in real-time
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Create a new monitored location
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={newLocation.name}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, name: e.target.value })
                      }
                      placeholder="Location name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newLocation.type}
                      onValueChange={(value: LocationType) =>
                        setNewLocation({ ...newLocation, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">🏥 Hospital</SelectItem>
                        <SelectItem value="mall">🛒 Mall</SelectItem>
                        <SelectItem value="office">🏢 Office</SelectItem>
                        <SelectItem value="university">🎓 University</SelectItem>
                        <SelectItem value="transport">🚉 Transport</SelectItem>
                        <SelectItem value="auditorium">🎭 Auditorium</SelectItem>
                        <SelectItem value="government">🏛️ Government</SelectItem>
                        <SelectItem value="restaurant">🍽️ Restaurant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={newLocation.city}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, city: e.target.value })
                      }
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={newLocation.state}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, state: e.target.value })
                      }
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Capacity</Label>
                    <Input
                      type="number"
                      value={newLocation.capacity}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          capacity: parseInt(e.target.value) || 100,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Service Rate (per min)</Label>
                    <Input
                      type="number"
                      value={newLocation.averageServiceRate}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          averageServiceRate: parseInt(e.target.value) || 10,
                        })
                      }
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newLocation.latitude}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          latitude: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newLocation.longitude}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          longitude: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLocation}>Add Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
        
        {/* Alert Card */}
        {highCapacityCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="border-status-high/30 bg-status-high/5">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-status-high/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-status-high" />
                </div>
                <div>
                  <p className="font-semibold text-status-high">
                    {highCapacityCount} location{highCapacityCount > 1 ? 's' : ''} at high capacity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Consider taking action to manage crowd levels
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Locations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-border overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Managed Locations ({locations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Location</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current / Capacity</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead className="text-center">Update Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => {
                      const utilization = calculateUtilization(
                        location.currentCount,
                        location.capacity
                      );
                      const status = getCrowdStatus(utilization);
                      
                      return (
                        <TableRow key={location.id} className="border-border">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {getLocationTypeIcon(location.type)}
                              </span>
                              <span className="font-medium">{location.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {location.city}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={status} size="sm">
                              {getStatusLabel(status)}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {location.currentCount.toLocaleString()} /{' '}
                              {location.capacity.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <CapacityBar
                                current={location.currentCount}
                                max={location.capacity}
                                status={status}
                                showLabel={false}
                                size="sm"
                              />
                              <span className="text-xs text-muted-foreground">
                                {utilization}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleUpdateCount(location.id, -10)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Input
                                type="number"
                                value={location.currentCount}
                                onChange={(e) =>
                                  updateLocationCount(
                                    location.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-20 h-8 text-center text-sm"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleUpdateCount(location.id, 10)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteLocation(location.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </PageLayout>
  );
};

export default AdminDashboard;
