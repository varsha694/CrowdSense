import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { Location, calculateUtilization, getCrowdStatus, getLocationTypeIcon, formatTimeAgo, calculateWaitTime, CrowdStatus } from '../types/crowd';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, Clock, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AlertPulse } from './ui/AlertPulse';

interface InteractiveMarkersProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
  selectedLocation?: Location | null;
}

function getStatusColor(status: CrowdStatus): string {
  switch (status) {
    case 'low': return '#22c55e';
    case 'medium': return '#eab308';
    case 'high': return '#ef4444';
    case 'critical': return '#8b0000';
    default: return '#6b7280';
  }
}

export function InteractiveMarkers({ locations, onLocationSelect, selectedLocation }: InteractiveMarkersProps) {
  const navigate = useNavigate();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5);

  // Track zoom level to show/hide markers
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });

  // Only show markers when zoomed in enough or when hovered/selected
  const showMarkers = zoomLevel >= 6;

  if (!showMarkers && !hoveredLocation && !selectedLocation) {
    return null;
  }

  return (
    <>
      {locations.map((location) => {
        const utilization = calculateUtilization(location.currentCount ?? (location as any).current_count, location.capacity);
        const status = getCrowdStatus(utilization);
        const color = getStatusColor(status);
        const isSelected = selectedLocation?.id === location.id;
        const isHovered = hoveredLocation === location.id;
        const waitTime = calculateWaitTime(location.currentCount ?? (location as any).current_count, location.averageServiceRate ?? (location as any).average_service_rate);
        
        // Calculate marker size based on zoom and state
        const baseRadius = zoomLevel >= 8 ? 12 : zoomLevel >= 6 ? 10 : 8;
        const radius = isSelected || isHovered ? baseRadius + 4 : baseRadius;

        return (
          <CircleMarker
            key={location.id}
            center={[location.latitude, location.longitude]}
            radius={radius}
            pathOptions={{
              color: isSelected ? '#3b82f6' : color,
              fillColor: color,
              fillOpacity: isSelected || isHovered ? 0.9 : 0.7,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onLocationSelect?.(location),
              mouseover: () => setHoveredLocation(location.id),
              mouseout: () => setHoveredLocation(null),
            }}
          >
            <Popup className="custom-popup">
              <div className="min-w-[220px] p-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLocationTypeIcon(location.type ?? (location as any).category)}</span>
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                  </div>
                  <AlertPulse status={status} size="sm" />
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">{location.city}</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">Crowd</span>
                    </div>
                    <span className="font-medium text-sm">
                      {(location.currentCount ?? (location as any).current_count).toLocaleString()} / {location.capacity.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(utilization, 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Capacity</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: color, color: color }}
                    >
                      {utilization}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Wait Time</span>
                    </div>
                    <span className="text-xs font-medium">{waitTime < 1 ? '< 1 min' : `${waitTime} min`}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 border-t">
                      <span className="text-xs text-muted-foreground">
                      Updated {formatTimeAgo(new Date(location.lastUpdated ?? (location as any).updated_at))}
                    </span>
                    <div className="flex items-center gap-1">
                      {utilization > 50 ? (
                        <TrendingUp className="h-3 w-3 text-status-high" />
                      ) : utilization > 30 ? (
                        <Minus className="h-3 w-3 text-status-medium" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-status-low" />
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-2 gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/location/${location.id}`);
                    }}
                  >
                    View Details
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
