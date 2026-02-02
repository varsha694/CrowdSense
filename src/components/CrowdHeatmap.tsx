import { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, formatTimeAgo } from '../types/crowd';
import { Card, CardContent } from './ui/card';
import { LiveIndicator } from './LiveIndicator';
import { DensityHeatmapLayer } from './DensityHeatmapLayer';
import { MovementTrails } from './MovementTrails';
import { InteractiveMarkers } from './InteractiveMarkers';
import { AIInsightsPanel } from './AIInsightsPanel';
import { HistoricalReplayControls } from './HistoricalReplayControls';

interface IndiaHeatmapProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
  selectedLocation?: Location | null;
  lastUpdate?: Date;
  className?: string;
}

// Fix for default marker icons in leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1 });
  }, [center, map]);
  return null;
}

export function IndiaHeatmap({ 
  locations, 
  onLocationSelect, 
  selectedLocation,
  lastUpdate,
  className,
}: IndiaHeatmapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // simple display set (live or replay) — for now mirror input locations
  const displayLocations = useMemo(() => locations, [locations]);


  // India center coordinates
  const indiaCenter: [number, number] = [20.5937, 78.9629];
  
  const mapCenter = useMemo(() => {
    if (selectedLocation) {
      return [selectedLocation.latitude, selectedLocation.longitude] as [number, number];
    }
    return indiaCenter;
  }, [selectedLocation]);

  useEffect(() => {
    // Update current time periodically when in live mode
    if (!isLiveMode) return;
    setCurrentTime(new Date());
    const t = setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, [isLiveMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Map Container */}
      <Card className="lg:col-span-3 relative overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-primary/5">
        {/* Top overlay controls */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
          {isLiveMode ? (
            <LiveIndicator />
          ) : (
            <div className="px-2 py-1 rounded-md bg-amber-500/90 text-amber-950 text-xs font-medium animate-pulse">
              📼 Replay Mode
            </div>
          )}
          <span className="text-xs text-muted-foreground bg-background/90 dark:bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
            {isLiveMode
              ? lastUpdate ? `Updated ${formatTimeAgo(lastUpdate)}` : 'Updated: —'
              : `Viewing ${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
            }
          </span>
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-background/95 dark:bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/50 max-w-[200px]">
          <p className="text-xs font-medium mb-2">Crowd Density</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 rounded-full bg-gradient-to-r from-status-low to-lime-400" />
              <span className="text-xs text-muted-foreground">Low (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 rounded-full bg-gradient-to-r from-lime-400 via-status-medium to-orange-500" />
              <span className="text-xs text-muted-foreground">Moderate (41-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 rounded-full bg-gradient-to-r from-orange-500 to-status-high" />
              <span className="text-xs text-muted-foreground">High (76-100%)</span>
            </div>
          </div>
          
          {/* Flow toggle */}
          <div className="mt-3 pt-2 border-t border-border/50">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={showTrails} 
                onChange={(e) => setShowTrails(e.target.checked)}
                className="rounded border-border"
              />
              Show movement flows
            </label>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Map container with dark tiles always */}
          <div className={`rounded-lg overflow-hidden border-2 border-border/30 ${className ?? ''}`}>
            <MapContainer
              center={indiaCenter}
              zoom={5}
              style={{ height: '600px', width: '100%' }}
              ref={mapRef}
              className="rounded-lg"
            >
              {/* Always use dark map tiles for contrast with heatmap */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {selectedLocation && <MapUpdater center={mapCenter} />}

              {/* Continuous density heatmap layer - uses displayLocations for replay */}
              <DensityHeatmapLayer locations={displayLocations} />
              
              {/* Movement trails and flow arrows */}
              {showTrails && <MovementTrails locations={displayLocations} />}
              
              {/* Interactive markers (only on zoom) */}
              <InteractiveMarkers 
                locations={displayLocations}
                onLocationSelect={onLocationSelect}
                selectedLocation={selectedLocation}
              />
            </MapContainer>
          </div>

        </CardContent>
        </Card>
      {/* AI Insights Sidebar */}
      <AIInsightsPanel locations={displayLocations} className="lg:col-span-1" />
    </div>
  );
}

// Provide legacy/nicer export name expected by pages
export const CrowdHeatmap = IndiaHeatmap;
