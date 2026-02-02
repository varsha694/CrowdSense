import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Location, calculateUtilization } from '../types/crowd';

interface DensityHeatmapLayerProps {
  locations: Location[];
}

// Extend Leaflet types for heat layer
declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: Record<number, string>;
    }
  ): L.Layer;
}

export function DensityHeatmapLayer({ locations }: DensityHeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length === 0) return;

    // Generate heat points from locations with intensity based on utilization
    const heatPoints: [number, number, number][] = locations.flatMap((location) => {
      const utilization = calculateUtilization(location.currentCount ?? (location as any).current_count, location.capacity);
      const intensity = Math.min(utilization / 100, 1);
      
      // Create multiple points around each location for smoother gradients
      const points: [number, number, number][] = [];
      const baseIntensity = intensity * 0.8;
      
      // Center point with highest intensity
      points.push([location.latitude, location.longitude, intensity]);
      
      // Surrounding points for gradient effect based on capacity
      const spreadRadius = Math.min(0.15, location.capacity / 20000);
      const numRings = utilization > 60 ? 3 : 2;
      
      for (let ring = 1; ring <= numRings; ring++) {
        const ringRadius = spreadRadius * (ring / numRings);
        const ringIntensity = baseIntensity * (1 - ring / (numRings + 1));
        const pointsInRing = 6 + ring * 2;
        
        for (let i = 0; i < pointsInRing; i++) {
          const angle = (2 * Math.PI * i) / pointsInRing;
          const lat = location.latitude + ringRadius * Math.cos(angle);
          const lng = location.longitude + ringRadius * Math.sin(angle);
          points.push([lat, lng, ringIntensity]);
        }
      }
      
      return points;
    });

    // Create heat layer with smooth gradient
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: 'rgba(34, 197, 94, 0)',
        0.2: 'rgba(34, 197, 94, 0.6)',
        0.4: 'rgba(132, 204, 22, 0.7)',
        0.5: 'rgba(234, 179, 8, 0.8)',
        0.7: 'rgba(249, 115, 22, 0.85)',
        0.85: 'rgba(239, 68, 68, 0.9)',
        1.0: 'rgba(220, 38, 38, 1)',
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, locations]);

  return null;
}
