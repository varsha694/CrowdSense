import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Location } from '../types/crowd';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('city', { ascending: true });

      if (error) throw error;
      
      // Map DB rows (snake_case) to app Location shape (camelCase)
      setLocations(
        (data as any[]).map((r) => ({
          id: r.id,
          name: r.name,
          city: r.city,
          state: r.state ?? '',
          type: r.type as any,
          capacity: r.capacity,
          currentCount: r.current_count,
          latitude: r.latitude,
          longitude: r.longitude,
          averageServiceRate: r.average_service_rate,
          lastUpdated: r.updated_at ? new Date(r.updated_at) : new Date(),
          imageUrl: r.image_url,
        } as Location))
      );
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();

    // Set up real-time subscription
    const channel: RealtimeChannel = supabase
      .channel('locations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'locations',
        },
            (payload) => {
          console.log('Real-time update received:', payload);
          setLastUpdate(new Date());

          // Normalize incoming row shapes from Supabase
          const normalize = (r: any): Location => ({
            id: r.id,
            name: r.name,
            city: r.city,
            state: r.state ?? '',
            type: r.type as any,
            capacity: r.capacity,
            currentCount: r.current_count,
            latitude: r.latitude,
            longitude: r.longitude,
            averageServiceRate: r.average_service_rate,
            lastUpdated: r.updated_at ? new Date(r.updated_at) : new Date(),
            imageUrl: r.image_url,
          });

          if (payload.eventType === 'UPDATE') {
            setLocations((prev) =>
              prev.map((loc) => (loc.id === payload.new.id ? normalize(payload.new) : loc))
            );
          } else if (payload.eventType === 'INSERT') {
            setLocations((prev) => [...prev, normalize(payload.new)]);
          } else if (payload.eventType === 'DELETE') {
            setLocations((prev) => prev.filter((loc) => loc.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLocations]);

  const updateCrowdCount = async (
    locationId: string,
    newCount: number
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ current_count: newCount })
        .eq('id', locationId);

      if (error) throw error;

      // Also create a crowd log entry
      await supabase.from('crowd_logs').insert({
        location_id: locationId,
        count: newCount,
      });

      return true;
    } catch (err: any) {
      console.error('Error updating crowd count:', err);
      return false;
    }
  };

  return {
    locations,
    loading,
    error,
    lastUpdate,
    refetch: fetchLocations,
    updateCrowdCount,
  };
}
