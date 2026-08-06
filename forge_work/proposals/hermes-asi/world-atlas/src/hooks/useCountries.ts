import countriesMin from '../data/countries-min.json';
import type { Country } from '../lib/types';

const countries: Country[] = countriesMin as unknown as Country[];

export function useCountries(): Country[] {
  return countries;
}

export function findCountry(cca3: string): Country | undefined {
  return countries.find((c) => c.cca3 === cca3);
}

export function searchCountries(q: string): Country[] {
  const lower = q.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.cca3.toLowerCase() === lower ||
      c.cca2.toLowerCase() === lower ||
      c.capital.toLowerCase().includes(lower)
  );
}
