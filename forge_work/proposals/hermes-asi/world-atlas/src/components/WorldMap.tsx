import { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import type { Country, GDELTArticle, Axis } from '../lib/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface Props {
  countries: Country[];
  articles: GDELTArticle[];
  activeAxis: Axis | null;
  onCountryClick: (cca3: string) => void;
  selectedCca3: string | null;
}

export function WorldMap({ countries, articles, activeAxis, onCountryClick, selectedCca3 }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; country: Country } | null>(null);

  // Build country->(tension, count) index from articles
  const countryTensions = useMemo(() => {
    const map = new Map<string, { count: number; geo: number; econ: number; soc: number }>();
    articles.forEach((a) => {
      const lat = a.lat;
      const lng = a.lng;
      if (lat === undefined || lng === undefined) return;
      const c = countries.find((c) => {
        const [clat, clng] = c.latlng;
        if (!clat || !clng) return false;
        const dLat = Math.abs(clat - lat);
        const dLng = Math.abs(clng - lng);
        return dLat < 15 && dLng < 20;
      });
      if (!c) return;
      const entry = map.get(c.cca3) ?? { count: 0, geo: 0, econ: 0, soc: 0 };
      entry.count++;
      if (a.axis) entry[a.axis]++;
      map.set(c.cca3, entry);
    });
    return map;
  }, [articles, countries]);

  // Filter markers by active axis
  const markers = useMemo(() => {
    return articles
      .filter((a) => a.lat !== undefined && a.lng !== undefined)
      .filter((a) => !activeAxis || a.axis === activeAxis)
      .map((a) => ({
        article: a,
        coords: [a.lat!, a.lng!] as [number, number],
        cca3: countries.find((c) => {
          const [clat, clng] = c.latlng;
          if (!clat || !clng) return false;
          return Math.abs(clat - a.lat!) < 15 && Math.abs(clng - a.lng!) < 20;
        })?.cca3,
      }));
  }, [articles, activeAxis, countries]);

  return (
    <div className="map-pane">
      <div className="axis-toggle">
        <button
          data-active={activeAxis === null}
          onClick={() => {}}
          disabled
          style={{ opacity: 0.5 }}
        >
          ⊕ ALL
        </button>
      </div>
      <div className="map-status">GDELT · live</div>
      <div className="legend">
        <div className="row"><span className="dot" data-axis="geo"></span> Δ Geopolitics</div>
        <div className="row"><span className="dot" data-axis="econ"></span> Ω Economics</div>
        <div className="row"><span className="dot" data-axis="soc"></span> Ψ Social</div>
      </div>

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={6} center={[0, 20]}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = geo.properties.name;
                const c = countries.find((c) => c.name === iso3 || c.official === iso3);
                const t = c ? countryTensions.get(c.cca3) : null;
                const isSelected = c && c.cca3 === selectedCca3;
                const fill = isSelected
                  ? '#E8B84B'
                  : t
                  ? 'rgba(232, 184, 75, 0.25)'
                  : 'transparent';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => c && onCountryClick(c.cca3)}
                    onMouseEnter={(evt) => {
                      if (c) {
                        setTooltip({ x: evt.clientX, y: evt.clientY, country: c });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill,
                        stroke: '#2a2a3a',
                        strokeWidth: 0.4,
                        outline: 'none',
                        cursor: c ? 'pointer' : 'default',
                      },
                      hover: {
                        fill: isSelected ? '#E8B84B' : 'rgba(232, 184, 75, 0.45)',
                        stroke: '#E8B84B',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#E8B84B',
                        stroke: '#E8B84B',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {markers.map((m, i) => (
            <Marker key={i} coordinates={m.coords}>
              <circle
                className="map-marker pulse"
                data-axis={m.article.axis}
                r={3}
                style={{ cursor: 'pointer' }}
                onClick={() => m.cca3 && onCountryClick(m.cca3)}
              />
              <circle
                r={8}
                fill="transparent"
                data-axis={m.article.axis}
                style={{ cursor: 'pointer', animation: 'pulse 2s ease-in-out infinite' }}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <div className="name">{tooltip.country.flag} {tooltip.country.name}</div>
          <div className="meta">
            {tooltip.country.region} · {tooltip.country.cca3}
          </div>
          <div className="tensions">
            <span style={{ color: '#E5484D' }}>Δ {countryTensions.get(tooltip.country.cca3)?.geo ?? 0}</span>
            <span style={{ color: '#E8B84B' }}>Ω {countryTensions.get(tooltip.country.cca3)?.econ ?? 0}</span>
            <span style={{ color: '#6BD3B4' }}>Ψ {countryTensions.get(tooltip.country.cca3)?.soc ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}
