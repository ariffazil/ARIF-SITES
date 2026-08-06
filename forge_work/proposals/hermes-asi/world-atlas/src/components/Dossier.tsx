import type { Country } from '../lib/types';
import { useWorldBank } from '../hooks/useWorldBank';

interface Props {
  country: Country | null;
}

function fmtNumber(n: number | undefined, opts: { compact?: boolean; currency?: string } = {}): string {
  if (n === undefined || n === null || isNaN(n)) return '—';
  if (opts.compact) {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toFixed(0);
  }
  return n.toLocaleString('en-US');
}

function fmtGDP(v: number | undefined): string {
  if (v === undefined || v === null) return '—';
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  return `$${v.toFixed(0)}`;
}

function fmtGDPPerCapita(v: number | undefined): string {
  if (v === undefined || v === null) return '—';
  return `$${fmtNumber(v, { compact: true })}`;
}

export function Dossier({ country }: Props) {
  const { data, loading } = useWorldBank(country?.cca3 ?? null);

  if (!country) {
    return (
      <div className="dossier">
        <div className="empty">
          CLICK A COUNTRY ON THE MAP
          <div style={{ marginTop: 8, fontSize: 10, opacity: 0.6 }}>
            Hover for tooltip · Click for dossier
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dossier">
      <div className="country-flag">{country.flag}</div>
      <div className="country-name">{country.name}</div>
      <div className="country-official">{country.official}</div>

      <div className="grid">
        <div className="stat">
          <div className="lbl">CAPITAL</div>
          <div className="val">{country.capital || '—'}</div>
        </div>
        <div className="stat">
          <div className="lbl">REGION</div>
          <div className="val">{country.region || '—'}</div>
        </div>
        <div className="stat">
          <div className="lbl">POPULATION</div>
          <div className="val">{fmtNumber(country.population, { compact: true })}</div>
        </div>
        <div className="stat">
          <div className="lbl">AREA</div>
          <div className="val">{fmtNumber(country.area, { compact: true })} km²</div>
        </div>
      </div>

      <div className="tags">
        {country.unMember && <span className="tag">UN MEMBER</span>}
        {country.independent && <span className="tag">INDEPENDENT</span>}
        {country.currencies.map((c) => (
          <span key={c} className="tag">{c}</span>
        ))}
        {country.languages.slice(0, 3).map((l) => (
          <span key={l} className="tag">{l}</span>
        ))}
      </div>

      <div className="wb-block">
        <h4>WORLD BANK · {data?.gdp?.date ?? 'LATEST'}</h4>
        {loading && <div style={{ fontSize: 11, color: 'var(--atlas-faint)', fontFamily: 'var(--font-mono)' }}>QUERYING…</div>}
        <div className="wb-row">
          <span className="k">GDP (current US$)</span>
          <span className={`v ${data?.gdp ? '' : 'unavail'}`}>{fmtGDP(data?.gdp?.value)}</span>
        </div>
        <div className="wb-row">
          <span className="k">GDP per capita</span>
          <span className={`v ${data?.gdpPerCapita ? '' : 'unavail'}`}>{fmtGDPPerCapita(data?.gdpPerCapita?.value)}</span>
        </div>
        <div className="wb-row">
          <span className="k">Population</span>
          <span className={`v ${data?.population ? '' : 'unavail'}`}>{fmtNumber(data?.population?.value, { compact: true })}</span>
        </div>
        <div className="wb-row">
          <span className="k">Life expectancy</span>
          <span className={`v ${data?.lifeExpectancy ? '' : 'unavail'}`}>{data?.lifeExpectancy?.value ? `${data.lifeExpectancy.value.toFixed(1)} yrs` : '—'}</span>
        </div>
        <div className="wb-row">
          <span className="k">CO₂ per capita</span>
          <span className={`v ${data?.co2 ? '' : 'unavail'}`}>{data?.co2?.value ? `${data.co2.value.toFixed(2)} t` : '—'}</span>
        </div>
        <div className="wb-row">
          <span className="k">Internet users</span>
          <span className={`v ${data?.internet ? '' : 'unavail'}`}>{data?.internet?.value ? `${data.internet.value.toFixed(1)}%` : '—'}</span>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 10, color: 'var(--atlas-faint)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
        arifOS Atlas · {country.cca3}
      </div>
    </div>
  );
}
