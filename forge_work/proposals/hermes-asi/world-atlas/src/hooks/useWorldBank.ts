import { useState, useEffect } from 'react';
import type { CountryWorldBank } from '../lib/types';

const WB_BASE = 'https://api.worldbank.org/v2/country';

const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  population: 'SP.POP.TOTL',
  lifeExpectancy: 'SP.DYN.LE00.IN',
  co2: 'EN.ATM.CO2E.PC',
  internet: 'IT.NET.USER.ZS',
};

interface CacheEntry {
  data: CountryWorldBank;
  fetched: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

async function fetchIndicator(countryId: string, indicator: string): Promise<{ value: number; date: string } | null> {
  const url = `${WB_BASE}/${countryId}/indicator/${indicator}?format=json&per_page=1&date=2022:2024`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = await res.json();
    // World Bank returns [meta, data]; data is array of records sorted by date desc
    const record = json[1]?.[0];
    if (!record || record.value === null || record.value === undefined) return null;
    return { value: record.value, date: record.date };
  } catch (err) {
    console.warn(`[WB] ${indicator} for ${countryId}: ${err instanceof Error ? err.message : 'err'}`);
    return null;
  }
}

export function useWorldBank(cca3: string | null) {
  const [data, setData] = useState<CountryWorldBank | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cca3) {
      setData(null);
      return;
    }
    const cached = cache.get(cca3);
    if (cached && Date.now() - cached.fetched < CACHE_TTL) {
      setData(cached.data);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchIndicator(cca3, INDICATORS.gdp),
      fetchIndicator(cca3, INDICATORS.gdpPerCapita),
      fetchIndicator(cca3, INDICATORS.population),
      fetchIndicator(cca3, INDICATORS.lifeExpectancy),
      fetchIndicator(cca3, INDICATORS.co2),
      fetchIndicator(cca3, INDICATORS.internet),
    ]).then(([gdp, gdpPerCapita, population, lifeExpectancy, co2, internet]) => {
      if (cancelled) return;
      const result: CountryWorldBank = { gdp, gdpPerCapita, population, lifeExpectancy, co2, internet };
      setData(result);
      cache.set(cca3, { data: result, fetched: Date.now() });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [cca3]);

  return { data, loading };
}
