/** Shared types for the SOT Atlas. */

export type Axis = 'geo' | 'econ' | 'soc';

export interface Country {
  cca3: string;
  cca2: string;
  name: string;
  official: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  latlng: [number, number];
  languages: string[];
  currencies: string[];
  flag: string;
  unMember: boolean;
  independent: boolean;
}

export interface CountryWorldBank {
  gdp?: { value: number; date: string } | null;
  gdpPerCapita?: { value: number; date: string } | null;
  population?: { value: number; date: string } | null;
  lifeExpectancy?: { value: number; date: string } | null;
  co2?: { value: number; date: string } | null;
  internet?: { value: number; date: string } | null;
}

export interface GDELTArticle {
  title: string;
  url: string;
  seendate: string;
  domain: string;
  urlMobile: string;
  socialimage: string;
  language: string;
  tone: number[];
  // our derived fields
  axis?: Axis;
  lat?: number;
  lng?: number;
  sourcecountry?: string;
}

export interface SOTIndex {
  geo: number;   // 0-100
  econ: number;  // 0-100
  soc: number;   // 0-100
  aggregate: number;
  updated: string;
}

/** TopoJSON world atlas feature properties */
export interface WorldFeature {
  properties: {
    name: string;
    id: string;  // ISO-3166 numeric
  };
  rsmKey?: string;
}
