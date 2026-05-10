import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useDirections } from '@/hooks/useDirections';
import { usePlaces } from '@/hooks/usePlaces';
import { decodePolyline } from '@/lib/polyline';
import { Navigation, Layers, Crosshair } from 'lucide-react';

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { route, getDirections } = useDirections();
  const { results } = usePlaces();

  // Init MapLibre
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap &copy; CARTO',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [100.4762, 7.0081], // Hat Yai
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.addControl(new maplibregl.FullscreenControl(), 'bottom-right');

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw route when available
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !route) return;

    const coords = decodePolyline(route.overview_polyline.points);
    if (coords.length === 0) return;

    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords.map(([lat, lng]) => [lng, lat]),
      },
    };

    if (map.getSource('route')) {
      (map.getSource('route') as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource('route', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#10b981',
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });
    }

    // Fit bounds
    const bounds = new maplibregl.LngLatBounds();
    coords.forEach(([lat, lng]) => bounds.extend([lng, lat]));
    map.fitBounds(bounds, { padding: 60, duration: 1200 });
  }, [route, mapLoaded]);

  // Draw place markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove old markers
    document.querySelectorAll('.place-marker').forEach((el) => el.remove());

    results.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'place-marker';
      el.innerHTML = `<div style="width:12px;height:12px;background:#10b981;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(16,185,129,0.6);cursor:pointer;"></div>`;
      el.title = place.name;

      new maplibregl.Marker({ element: el })
        .setLngLat([place.geometry.location.lng, place.geometry.location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 8 }).setHTML(
            `<div style="color:#18181b;font-size:12px;font-weight:600;">${place.name}</div>
             <div style="color:#52525b;font-size:11px;">${place.formatted_address}</div>
             ${place.rating ? `<div style="color:#d4a853;font-size:11px;">★ ${place.rating}</div>` : ''}`
          )
        )
        .addTo(map);
    });
  }, [results, mapLoaded]);

  const handleDemoRoute = () => {
    getDirections('Penang, Malaysia', 'Hat Yai, Thailand', 'driving');
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button
          onClick={handleDemoRoute}
          className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700 hover:border-emerald-500/50 text-emerald-400 text-xs font-bold px-3 py-2 rounded-lg shadow-lg backdrop-blur transition-all"
        >
          <Navigation size={14} />
          Penang → Hat Yai
        </button>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            mapRef.current?.flyTo({ center: [100.4762, 7.0081], zoom: 12 });
          }}
          className="p-2 bg-zinc-900/90 border border-zinc-700 hover:border-emerald-500/50 text-zinc-300 rounded-lg shadow-lg backdrop-blur transition-all"
          title="Recenter"
        >
          <Crosshair size={16} />
        </button>
      </div>

      {/* Route Info */}
      {route && (
        <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/95 border border-zinc-800 rounded-lg p-3 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers size={16} className="text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-zinc-200">Route Active</div>
                <div className="text-[10px] text-zinc-400">
                  {route.legs[0]?.distance?.text} · {route.legs[0]?.duration?.text} · {route.legs[0]?.steps?.length} steps
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const map = mapRef.current;
                if (!map) return;
                const coords = decodePolyline(route.overview_polyline.points);
                const bounds = new maplibregl.LngLatBounds();
                coords.forEach(([lat, lng]) => bounds.extend([lng, lat]));
                map.fitBounds(bounds, { padding: 60 });
              }}
              className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20"
            >
              Fit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
