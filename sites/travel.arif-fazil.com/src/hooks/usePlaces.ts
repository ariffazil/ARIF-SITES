import { useState, useCallback } from 'react';

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  types: string[];
  geometry: {
    location: { lat: number; lng: number };
  };
  photos?: { photo_reference: string; width: number; height: number }[];
}

export function usePlaces() {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, location?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query });
      if (location) params.set('location', location);
      const res = await fetch(`/api/places/search?${params.toString()}`);
      const data = await res.json();
      if (data.status !== 'OK') {
        throw new Error(data.error_message || data.status);
      }
      setResults(data.results || []);
      return data.results as PlaceResult[];
    } catch (err) {
      setError(String(err));
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
