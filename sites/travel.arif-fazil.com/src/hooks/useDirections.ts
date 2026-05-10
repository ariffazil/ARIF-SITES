import { useState, useCallback } from 'react';

export interface RouteLeg {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  steps: {
    html_instructions: string;
    distance: { text: string };
    duration: { text: string };
    maneuver?: string;
  }[];
}

export interface RouteResult {
  overview_polyline: { points: string };
  legs: RouteLeg[];
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export function useDirections() {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirections = useCallback(async (origin: string, destination: string, mode = 'driving') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ origin, destination, mode });
      const res = await fetch(`/api/directions?${params.toString()}`);
      const data = await res.json();
      if (data.status !== 'OK') {
        throw new Error(data.error_message || data.status);
      }
      const r = data.routes?.[0];
      if (!r) throw new Error('No routes found');
      setRoute(r);
      return r as RouteResult;
    } catch (err) {
      setError(String(err));
      setRoute(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { route, loading, error, getDirections };
}
