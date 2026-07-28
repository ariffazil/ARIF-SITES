import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface SeatData {
  id: string;
  code: string;
  name: string;
  incumbent: string;
  party2023: 'DAP' | 'PKR' | 'AMANAH' | 'UMNO' | 'PAS' | 'BERSATU';
  coalition2023: 'PH' | 'BN' | 'PN';
  majority2023: number;
  prediction2026: 'PH HOLD' | 'PH LEAN' | 'BN HOLD' | 'BN LEAN' | 'PN HOLD' | 'PN LEAN' | 'TOSS UP';
  predictedWinner: 'PH' | 'BN' | 'PN' | 'TOSSUP';
  isHot?: boolean;
  notes: string;
  coordinates: [number, number]; // [lat, lng] for Leaflet
  falsificationRisk?: string;
}

export const NS_SEATS: SeatData[] = [
  { id: 'N1', code: 'N1', name: 'Chennah', incumbent: 'Loke Siew Fook (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 2200, prediction2026: 'PH HOLD', predictedWinner: 'PH', isHot: true, notes: 'vs MCA (BN) · Barometer for Chinese & mixed vote', coordinates: [3.136, 102.046], falsificationRisk: 'FALSIFICATION: If Chinese turnout drops <50% and Malay consolidates >85% anti-DAP, Loke loses by 300-800 votes.' },
  { id: 'N2', code: 'N2', name: 'Pertang', incumbent: 'Jalaluddin Alias (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2790, prediction2026: 'BN HOLD', predictedWinner: 'BN', isHot: true, notes: 'Jelebu MP defending stronghold vs PAS', coordinates: [2.946, 102.213] },
  { id: 'N3', code: 'N3', name: 'Sungai Lui', incumbent: 'Mohd Razi (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 535, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Marginal rural Malay seat', coordinates: [3.161, 102.321] },
  { id: 'N4', code: 'N4', name: 'Klawang', incumbent: 'Bakri Sawir (AMANAH)', party2023: 'AMANAH', coalition2023: 'PH', majority2023: 577, prediction2026: 'PH LEAN', predictedWinner: 'PH', notes: 'Marginal mixed seat in Jelebu', coordinates: [2.969, 102.073] },
  { id: 'N5', code: 'N5', name: 'Serting', incumbent: 'Mohd Fairuz (PN)', party2023: 'PAS', coalition2023: 'PN', majority2023: 843, prediction2026: 'PH LEAN', predictedWinner: 'PH', isHot: true, notes: 'Bersatu split favors PH flip', coordinates: [2.876, 102.405] },
  { id: 'N6', code: 'N6', name: 'Palong', incumbent: 'Mustapha Nagoor (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 564, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'FELDA stronghold under pressure', coordinates: [2.766, 102.511] },
  { id: 'N7', code: 'N7', name: 'Jeram Padang', incumbent: 'Mohd Zaidy (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 693, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Estate / Indian swing voters', coordinates: [2.723, 102.378] },
  { id: 'N8', code: 'N8', name: 'Bahau', incumbent: 'Teo Kok Seong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 8408, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'DAP urban/commercial safe seat', coordinates: [2.808, 102.404] },
  { id: 'N9', code: 'N9', name: 'Lenggeng', incumbent: 'Mohd Asna Amin (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 685, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Semi-rural Seremban fringe', coordinates: [2.846, 101.986] },
  { id: 'N10', code: 'N10', name: 'Nilai', incumbent: 'Arul Kumar (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 10889, prediction2026: 'PH HOLD', predictedWinner: 'PH', isHot: true, notes: 'Industrial corridor & educational hub', coordinates: [2.816, 101.796] },
  { id: 'N11', code: 'N11', name: 'Lobak', incumbent: 'Chew Seh Yong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 13504, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Chinese-majority core Seremban', coordinates: [2.736, 101.936] },
  { id: 'N12', code: 'N12', name: 'Temiang', incumbent: 'Ng Chin Tsai (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 3068, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Mixed urban Seremban seat', coordinates: [2.748, 101.951] },
  { id: 'N13', code: 'N13', name: 'Sikamat', incumbent: 'Aminuddin Harun (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 2662, prediction2026: 'PH LEAN', predictedWinner: 'PH', notes: 'MB seat (MB moved candidacy to Linggi)', coordinates: [2.721, 101.966] },
  { id: 'N14', code: 'N14', name: 'Ampangan', incumbent: 'Tengku Zamrah (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 329, prediction2026: 'TOSS UP', predictedWinner: 'TOSSUP', isHot: true, notes: 'Ultra-marginal (329 vote maj in 2023)', coordinates: [2.701, 101.971] },
  { id: 'N15', code: 'N15', name: 'Juasseh', incumbent: 'Bibi Sharliza (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 78, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Closest 2023 margin (78 votes)', coordinates: [2.776, 102.296] },
  { id: 'N16', code: 'N16', name: 'Seri Menanti', incumbent: 'Muhammad Sufian (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 370, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Royal seat of Yang di-Pertuan Besar', coordinates: [2.701, 102.161] },
  { id: 'N17', code: 'N17', name: 'Senaling', incumbent: 'Ismail Lasim (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 662, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Traditional Malay agricultural belt', coordinates: [2.686, 102.246] },
  { id: 'N18', code: 'N18', name: 'Pilah', incumbent: 'Noorzunita Begum (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 1079, prediction2026: 'PH LEAN', predictedWinner: 'PH', notes: 'Kuala Pilah town center seat', coordinates: [2.736, 102.256] },
  { id: 'N19', code: 'N19', name: 'Johol', incumbent: 'Saiful Yazan (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2117, prediction2026: 'BN HOLD', predictedWinner: 'BN', notes: 'Strong UMNO machinery', coordinates: [2.596, 102.261] },
  { id: 'N20', code: 'N20', name: 'Labu', incumbent: 'Hanifah Abu Baker (BERSATU)', party2023: 'BERSATU', coalition2023: 'PN', majority2023: 1640, prediction2026: 'PH LEAN', predictedWinner: 'PH', isHot: true, notes: 'Bersatu independent run splits PN votes', coordinates: [2.736, 101.881] },
  { id: 'N21', code: 'N21', name: 'Bukit Kepayang', incumbent: 'Nicole Tan (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 19684, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Largest majority in NS (19,684)', coordinates: [2.716, 101.906] },
  { id: 'N22', code: 'N22', name: 'Rahang', incumbent: 'Siau Meow Kong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 6432, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Urban mixed DAP stronghold', coordinates: [2.706, 101.946] },
  { id: 'N23', name: 'Mambau', code: 'N23', incumbent: 'Yap Yew Weng (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 14940, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Urban industrial/residential DAP seat', coordinates: [2.686, 101.916] },
  { id: 'N24', code: 'N24', name: 'Seremban Jaya', incumbent: 'Gunasekaren (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 12703, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'DAP high-density housing seat', coordinates: [2.676, 101.976] },
  { id: 'N25', code: 'N25', name: 'Paroi', incumbent: 'Kamarol Ridzuan (PAS)', party2023: 'PAS', coalition2023: 'PN', majority2023: 5539, prediction2026: 'PN HOLD', predictedWinner: 'PN', isHot: true, notes: 'Largest Malay-majority urban seat', coordinates: [2.711, 102.001] },
  { id: 'N26', code: 'N26', name: 'Chembong', incumbent: 'Zaifulbahri (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 4335, prediction2026: 'BN HOLD', predictedWinner: 'BN', notes: 'Rembau parliamentary core', coordinates: [2.576, 102.046] },
  { id: 'N27', code: 'N27', name: 'Rantau', incumbent: 'Mohamad Hasan (Tok Mat)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 10280, prediction2026: 'BN HOLD', predictedWinner: 'BN', notes: 'Tok Mat impregnable fortress', coordinates: [2.596, 101.966] },
  { id: 'N28', code: 'N28', name: 'Kota', incumbent: 'Suhaimi Aini (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 135, prediction2026: 'BN LEAN', predictedWinner: 'BN', notes: 'Ultra-marginal 135 majority', coordinates: [2.526, 102.106] },
  { id: 'N29', code: 'N29', name: 'Chuah', incumbent: 'Yew Boon Lye (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 6298, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Port Dickson coastal agricultural', coordinates: [2.646, 101.761] },
  { id: 'N30', code: 'N30', name: 'Lukut', incumbent: 'Choo Ken Hwa (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 10135, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Port Dickson urban/tourism seat', coordinates: [2.566, 101.811] },
  { id: 'N31', code: 'N31', name: 'Bagan Pinang', incumbent: 'Abdul Fatah (PAS)', party2023: 'PAS', coalition2023: 'PN', majority2023: 3426, prediction2026: 'PH LEAN', predictedWinner: 'PH', isHot: true, notes: 'Army camp & resort seat; split favors PH', coordinates: [2.476, 101.831] },
  { id: 'N32', code: 'N32', name: 'Linggi', incumbent: 'Mohd Faizal (BN)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 1461, prediction2026: 'TOSS UP', predictedWinner: 'TOSSUP', isHot: true, notes: '⚠️ EPICENTER RISK: MB Aminuddin Harun (PH-PKR) moved from Sikamat vs BN. High volatility due to seat relocation vs structural Malay majority (~64%).', coordinates: [2.496, 101.941] },
  { id: 'N33', code: 'N33', name: 'Sri Tanjung', incumbent: 'Rajasekaran (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 3996, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Port Dickson mixed urban core', coordinates: [2.516, 101.861] },
  { id: 'N34', code: 'N34', name: 'Gemas', incumbent: 'Ridzuan Ahmad (BERSATU)', party2023: 'BERSATU', coalition2023: 'PN', majority2023: 3120, prediction2026: 'PN LEAN', predictedWinner: 'PN', notes: 'Tampin border railway hub', coordinates: [2.586, 102.611] },
  { id: 'N35', code: 'N35', name: 'Gemencheh', incumbent: 'Suhaimizan Bizar (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2434, prediction2026: 'BN HOLD', predictedWinner: 'BN', notes: 'UMNO Tampin stronghold', coordinates: [2.536, 102.396] },
  { id: 'N36', code: 'N36', name: 'Repah', incumbent: 'Veerapan (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 5950, prediction2026: 'PH HOLD', predictedWinner: 'PH', notes: 'Tampin town mixed seat', coordinates: [2.476, 102.231] },
];

export const PARTY_COLORS = {
  PH: { main: '#E53E3E', border: '#FC8181', bg: 'rgba(229,62,62,0.2)', text: '#FEB2B2', markerHex: '#E53E3E' },
  BN: { main: '#3182CE', border: '#63B3ED', bg: 'rgba(49,130,206,0.2)', text: '#90CDF4', markerHex: '#3182CE' },
  PN: { main: '#38A169', border: '#68D391', bg: 'rgba(56,161,105,0.2)', text: '#9AE6B4', markerHex: '#38A169' },
  TOSSUP: { main: '#D69E2E', border: '#F6AD55', bg: 'rgba(214,158,46,0.25)', text: '#FBD38D', markerHex: '#D69E2E' }
};

interface ElectionCartographyMapProps {
  selectedSeatId: string | null;
  onSelectSeat: (seat: SeatData) => void;
}

export const ElectionCartographyMap: React.FC<ElectionCartographyMapProps> = ({
  selectedSeatId,
  onSelectSeat
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.CircleMarker }>({});
  const [filterCoalition, setFilterCoalition] = useState<'ALL' | 'PH' | 'BN' | 'PN' | 'HOT'>('ALL');
  const [viewMode, setViewMode] = useState<'MAP' | 'CARTOGRAM'>('MAP');

  const filteredSeats = NS_SEATS.filter(s => {
    if (filterCoalition === 'ALL') return true;
    if (filterCoalition === 'HOT') return s.isHot;
    return s.predictedWinner === filterCoalition;
  });

  // Initialize Leaflet GIS Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Center on Negeri Sembilan
    const map = L.map(mapContainerRef.current, {
      center: [2.72, 102.15],
      zoom: 10,
      zoomControl: true,
    });

    // Dark Matter Map Tiles (OpenStreetMap Carto Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Leaflet Markers when filter or selected seat changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    filteredSeats.forEach(seat => {
      const colorInfo = PARTY_COLORS[seat.predictedWinner];
      const isSelected = selectedSeatId === seat.id;
      const isLinggi = seat.id === 'N32';

      const marker = L.circleMarker(seat.coordinates, {
        radius: isSelected ? 12 : isLinggi ? 11 : seat.isHot ? 9 : 7,
        fillColor: colorInfo.markerHex,
        color: isSelected ? '#F59E0B' : isLinggi ? '#EF4444' : '#FFFFFF',
        weight: isSelected ? 3 : isLinggi ? 3 : 1,
        opacity: 1,
        fillOpacity: isSelected ? 0.9 : 0.75,
      }).addTo(map);

      // Popup content
      const popupHtml = `
        <div style="font-family: monospace; font-size: 12px; color: #000; min-width: 160px;">
          <strong style="font-size: 14px;">DUN ${seat.code} ${seat.name}</strong><br/>
          <span>Incumbent: ${seat.incumbent}</span><br/>
          <span>2023 Maj: <strong>${seat.majority2023.toLocaleString()}</strong></span><br/>
          <span style="color:${colorInfo.markerHex}; font-weight:bold;">2026: ${seat.prediction2026}</span>
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectSeat(seat);
      });

      markersRef.current[seat.id] = marker;
    });
  }, [filteredSeats, selectedSeatId, onSelectSeat]);

  return (
    <div className="relative w-full rounded-lg border border-forge-iron bg-[#07090E] overflow-hidden shadow-2xl">
      {/* Top Map Toolbar */}
      <div className="p-4 border-b border-forge-iron bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
              Spatial Interactive Map · Negeri Sembilan 36 DUN
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real GIS OpenStreetMap Cartography + Cartogram Mode · arifOS Earth Engine
          </p>
        </div>

        {/* View Mode Toggle & Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* MAP vs CARTOGRAM Toggle */}
          <div className="flex bg-slate-900 border border-slate-700 rounded p-0.5 mr-2">
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-3 py-1 rounded transition text-xs font-bold ${
                viewMode === 'MAP' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ REAL MAP (GIS)
            </button>
            <button
              onClick={() => setViewMode('CARTOGRAM')}
              className={`px-3 py-1 rounded transition text-xs font-bold ${
                viewMode === 'CARTOGRAM' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 CARTOGRAM GRID
            </button>
          </div>

          <button
            onClick={() => setFilterCoalition('ALL')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'ALL' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            ALL (36)
          </button>
          <button
            onClick={() => setFilterCoalition('PH')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'PH' ? 'bg-red-950 text-red-300 border border-red-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-red-400'}`}
          >
            PH (18)
          </button>
          <button
            onClick={() => setFilterCoalition('BN')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'BN' ? 'bg-blue-950 text-blue-300 border border-blue-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-blue-400'}`}
          >
            BN (16)
          </button>
          <button
            onClick={() => setFilterCoalition('PN')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'PN' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-emerald-400'}`}
          >
            PN (2)
          </button>
          <button
            onClick={() => setFilterCoalition('HOT')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'HOT' ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-amber-400'}`}
          >
            🔥 HOT (8)
          </button>
        </div>
      </div>

      {/* REAL GIS LEAFLET MAP VIEW */}
      <div className={`relative w-full h-[520px] ${viewMode === 'MAP' ? 'block' : 'hidden'}`}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* CARTOGRAM GRID VIEW */}
      <div className={`relative min-h-[500px] p-6 bg-radial from-slate-900/50 to-black grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 ${viewMode === 'CARTOGRAM' ? 'grid' : 'hidden'}`}>
        {filteredSeats.map((seat) => {
          const colorInfo = PARTY_COLORS[seat.predictedWinner];
          const isSelected = selectedSeatId === seat.id;
          const isLinggi = seat.id === 'N32';

          return (
            <div
              key={seat.id}
              onClick={() => onSelectSeat(seat)}
              style={{
                borderColor: isSelected ? '#F59E0B' : isLinggi ? '#EF4444' : colorInfo.border,
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : isLinggi ? 'rgba(239, 68, 68, 0.2)' : colorInfo.bg,
              }}
              className={`group relative cursor-pointer p-3 rounded border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between ${
                isSelected ? 'ring-2 ring-amber-400 z-10' : ''
              } ${isLinggi ? 'ring-2 ring-red-500/80 animate-pulse' : ''}`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-300">{seat.code}</span>
                <div className="flex items-center gap-1">
                  {seat.isHot && <span className="text-xs">🔥</span>}
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase"
                    style={{ color: colorInfo.text, backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    {seat.predictedWinner}
                  </span>
                </div>
              </div>

              <div className="my-2">
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                  {seat.name}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 truncate">
                  {seat.incumbent}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Maj '23:</span>
                <span className="font-bold text-slate-200">{seat.majority2023.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Footer Legend */}
      <div className="p-3 bg-slate-950 border-t border-forge-iron flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-600/80 inline-block border border-red-400"></span> PH Lead</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600/80 inline-block border border-blue-400"></span> BN Lead</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600/80 inline-block border border-emerald-400"></span> PN Lead</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/80 inline-block border border-amber-300"></span> Toss-Up</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Source: GEOX Leaflet GIS Cartography Engine · arifOS VAULT999 Verification
        </div>
      </div>
    </div>
  );
};
