// React hook for GEOX geological intelligence

import { useState, useEffect, useCallback } from 'react';
import { 
  getMaterials, getAtlas 
} from '../api/geox';
import type { Material, AtlasEntry } from '../api/geox';

interface UseGeoxMaterialsReturn {
  materials: Material[] | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useGeoxMaterials(): UseGeoxMaterialsReturn {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { materials, loading, error, refresh };
}

interface UseGeoxAtlasOptions {
  basin?: string;
  formation?: string;
}

interface UseGeoxAtlasReturn {
  entries: AtlasEntry[] | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useGeoxAtlas(options: UseGeoxAtlasOptions = {}): UseGeoxAtlasReturn {
  const { basin, formation } = options;
  const [entries, setEntries] = useState<AtlasEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAtlas(basin, formation);
      setEntries(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [basin, formation]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, loading, error, refresh };
}
