import { useState, useEffect, useCallback, useRef } from 'react';
import type { GDELTArticle, Axis } from '../lib/types';

/** GDELT DOC2 query — single combined query covering all 3 axes.
 *  GDELT rate-limits 1 req/5s, so we MUST fetch all themes in one query.
 *  We classify each article post-fetch by keyword matching on its title/tone.
 */
const COMBINED_QUERY =
  '((conflict OR diplomacy OR ceasefire OR sanctions OR military OR NATO OR border) OR ' +
  '(economy OR trade OR energy OR oil OR inflation OR tariff OR recession) OR ' +
  '(refugee OR humanitarian OR migration OR disease OR health OR famine OR earthquake OR disaster)) ' +
  'sourcelang:eng';

const REFRESH_MS = 300_000; // 5 min

const AXIS_KEYWORDS: Record<Axis, RegExp> = {
  geo: /\b(conflict|diplomacy|ceasefire|sanction|military|NATO|border|war|troops|missile|attack)\b/i,
  econ: /\b(economy|trade|energy|oil|inflation|tariff|recession|GDP|market|stock|export|import)\b/i,
  soc: /\b(refugee|humanitarian|migration|disease|health|famine|earthquake|disaster|flood|drought)\b/i,
};

function classifyArticle(article: GDELTArticle): Axis {
  const text = article.title ?? '';
  const geo = AXIS_KEYWORDS.geo.test(text);
  const econ = AXIS_KEYWORDS.econ.test(text);
  const soc = AXIS_KEYWORDS.soc.test(text);
  if (geo && !econ && !soc) return 'geo';
  if (econ && !geo && !soc) return 'econ';
  if (soc && !geo && !econ) return 'soc';
  // Multiple matches — use tone as disambiguator
  const tone = toneMean(article.tone);
  if (tone === null) return geo ? 'geo' : econ ? 'econ' : 'soc';
  if (tone < -3) return 'geo';
  if (tone > 2) return 'econ';
  return 'soc';
}

function toneMean(tone: number[]): number | null {
  if (!Array.isArray(tone) || tone.length === 0) return null;
  return tone.reduce((a, b) => a + b, 0) / tone.length;
}

const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';

// Import countries for geocoding
import countriesMin from '../data/countries-min.json';
import type { Country } from '../lib/types';
const countries = countriesMin as unknown as Country[];

// Best-effort geocode from source country name
function geocode(article: GDELTArticle): [number, number] | null {
  if (article.sourcecountry) {
    const c = countries.find(
      (c) =>
        c.cca3 === article.sourcecountry ||
        c.name === article.sourcecountry ||
        c.cca3 === (article as unknown as { actor1geo?: string }).actor1geo ||
        c.cca3 === (article as unknown as { actor2geo?: string }).actor2geo
    );
    if (c) return c.latlng;
  }
  return null;
}

async function fetchGDELTAll(): Promise<GDELTArticle[]> {
  const url = `${GDELT_BASE}?query=${encodeURIComponent(COMBINED_QUERY)}&format=json&maxrecords=60&sort=datedesc`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.warn(`[GDELT] HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    // GDELT returns a string with rate-limit message when throttled
    if (!text.trim().startsWith('{')) {
      console.warn(`[GDELT] rate-limited or non-JSON response`);
      return [];
    }
    const json = JSON.parse(text);
    return (json.articles ?? []).map((a: GDELTArticle) => {
      const coords = geocode(a);
      const axis = classifyArticle(a);
      return { ...a, axis, lat: coords?.[0], lng: coords?.[1] };
    });
  } catch (err: unknown) {
    console.warn(`[GDELT] ${err instanceof Error ? err.message : 'unknown error'}`);
    return [];
  }
}

export function useGDELT(activeAxis: Axis | null) {
  const [articles, setArticles] = useState<GDELTArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Single combined query — avoids GDELT's 5s rate-limit
      const result = await fetchGDELTAll();
      setArticles(result);
      setLastUpdated(new Date().toISOString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'GDELT fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  return { articles, loading, lastUpdated, error, refetch: fetchAll };
}
