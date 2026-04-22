// React hook for live vitals from arifOS MCP
// Polls API and provides real-time updates

import { useState, useEffect, useCallback, useRef } from 'react';
import { getVitals, connectWebSocket } from '../api/arifosmcp';
import type { Vitals } from '../api/arifosmcp';

interface UseLiveVitalsOptions {
  pollInterval?: number;  // milliseconds
  useWebSocket?: boolean;
}

interface UseLiveVitalsReturn {
  vitals: Vitals | null;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  refresh: () => Promise<void>;
}

export function useLiveVitals(
  options: UseLiveVitalsOptions = {}
): UseLiveVitalsReturn {
  const { pollInterval = 5000, useWebSocket = false } = options;
  
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch vitals manually
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVitals();
      setVitals(data);
      setError(null);
      setIsConnected(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    // Initial fetch
    refresh();

    if (useWebSocket) {
      // WebSocket connection
      try {
        wsRef.current = connectWebSocket(
          (data) => {
            if (data && typeof data === 'object' && 'cpu' in data) {
              setVitals(data as Vitals);
              setIsConnected(true);
            }
          },
          () => {
            setIsConnected(false);
          }
        );

        wsRef.current.onclose = () => {
          setIsConnected(false);
          // Fallback to polling if WebSocket closes
          intervalRef.current = setInterval(refresh, pollInterval);
        };
      } catch {
        // Fallback to polling
        intervalRef.current = setInterval(refresh, pollInterval);
      }
    } else {
      // Polling mode
      intervalRef.current = setInterval(refresh, pollInterval);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, pollInterval, useWebSocket]);

  return {
    vitals,
    loading,
    error,
    isConnected,
    refresh,
  };
}
