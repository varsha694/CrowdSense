import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrowdLog } from '../types/crowd';

export function useCrowdLogs(locationId: string | undefined, hours: number = 24) {
  const [logs, setLogs] = useState<CrowdLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!locationId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hours);

      const { data, error } = await supabase
        .from('crowd_logs')
        .select('*')
        .eq('location_id', locationId)
        .gte('recorded_at', startTime.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      
      // map DB rows to CrowdLog shape
      setLogs((data as any[]).map((r) => ({
        id: r.id,
        locationId: r.location_id,
        count: r.count,
        timestamp: new Date(r.recorded_at),
      })));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [locationId, hours]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useAllCrowdLogs(hours: number = 24) {
  const [logsByLocation, setLogsByLocation] = useState<Record<string, CrowdLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hours);

      const { data, error } = await supabase
        .from('crowd_logs')
        .select('*')
        .gte('recorded_at', startTime.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;

      // Group logs by location
      const grouped: Record<string, CrowdLog[]> = {};
      (data as any[]).forEach((r) => {
        const log: CrowdLog = {
          id: r.id,
          locationId: r.location_id,
          count: r.count,
          timestamp: new Date(r.recorded_at),
        };
        if (!grouped[log.locationId]) grouped[log.locationId] = [];
        grouped[log.locationId].push(log);
      });
      
      setLogsByLocation(grouped);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hours]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logsByLocation, loading, error, refetch: fetchLogs };
}
