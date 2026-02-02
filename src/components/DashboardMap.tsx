import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, calculateUtilization, getCrowdStatus, getStatusColor, getStatusLabel } from '@/types/crowd';
import { cn } from '@/lib/utils';

interface DashboardMapProps {
  locations: Location[];
  className?: string;
}

/**
 * DashboardMap - Simple marker-based overview map for the Dashboard
 * 
 * This component displays location markers without heatmap visualization.
 * It's designed for quick overview and navigation, not density analysis.
 */
export function DashboardMap({ locations, className }: DashboardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();
  
  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const map = L.map(mapRef.current, {
      center: [22.9734, 78.6569], // Center of India
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    
    // Dark map tiles for consistent command-center aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);
  
  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();
    
    locations.forEach((location) => {
      const utilization = calculateUtilization(location.currentCount, location.capacity);
      const status = getCrowdStatus(utilization);
      const color = getStatusColor(status);
      const statusLabel = getStatusLabel(status);
      
      // Create pulsing marker for high-density locations
      const isHighDensity = status === 'high' || status === 'critical';
      
      const marker = L.circleMarker([location.latitude, location.longitude], {
        radius: isHighDensity ? 10 : 8,
        fillColor: color,
        fillOpacity: 0.9,
        color: '#ffffff',
        weight: 2,
        opacity: 0.8,
        className: isHighDensity ? 'pulse-marker' : '',
      });
      
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: hsl(210, 40%, 96%);">${location.name}</h3>
          <p style="font-size: 12px; color: hsl(215, 20%, 55%); margin-bottom: 12px;">${location.city}</p>
          
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
            <span style="color: hsl(215, 20%, 55%);">Status:</span>
            <span style="font-weight: 600; color: ${color};">${statusLabel}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
            <span style="color: hsl(215, 20%, 55%);">Utilization:</span>
            <span style="font-weight: 600; color: ${color};">${utilization}%</span>
          </div>
          
          <div style="width: 100%; height: 6px; background: hsl(217, 33%, 17%); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
            <div style="width: ${utilization}%; height: 100%; background: ${color}; border-radius: 3px;"></div>
          </div>
          
          <div style="text-align: center;">
            <span style="font-size: 12px; color: hsl(174, 72%, 46%); cursor: pointer;">Click for details →</span>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
        autoPan: true,
      });
      
      marker.on('click', () => {
        navigate(`/location/${location.id}`);
      });
      
      marker.on('mouseover', function() {
        this.openPopup();
      });
      
      markersLayer.addLayer(marker);
    });
  }, [locations, navigate]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className={cn("relative", className)}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-xl"
        style={{ zIndex: 1 }}
      />
      
      {/* Simple legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-card p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-status-low" />
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-status-medium" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-status-high" />
            <span className="text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
