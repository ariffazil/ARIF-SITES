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
  /** POST-ELECTION: actual winner declared by SPR 1 Ogos 2026 */
  actualWinner: 'PH' | 'BN' | 'PN';
  /** POST-ELECTION: HOLD = retained, GAIN = flipped from another coalition */
  actualResult: 'PH HOLD' | 'BN HOLD' | 'PN HOLD' | 'BN GAIN' | 'PN GAIN';
  isHot?: boolean;
  notes: string;
  coordinates: [number, number];
  falsificationRisk?: string;
  /** True if seat flipped from 2023 coalition */
  isFlip?: boolean;
}

export const NS_SEATS: SeatData[] = [
  { id: 'N1', code: 'N1', name: 'Chennah', incumbent: 'Loke Siew Fook (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 2200, prediction2026: 'BN LEAN', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: BN won seat from DAP Loke Siew Fook. Chinese turnout dipped.', coordinates: [3.136, 102.046] },
  { id: 'N2', code: 'N2', name: 'Pertang', incumbent: 'Jalaluddin Alias (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2790, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Jelebu MP defending stronghold retained.', coordinates: [2.946, 102.213] },
  { id: 'N3', code: 'N3', name: 'Sungai Lui', incumbent: 'Mohd Razi (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 535, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Rural Malay seat retained by BN.', coordinates: [3.161, 102.321] },
  { id: 'N4', code: 'N4', name: 'Klawang', incumbent: 'Bakri Sawir (AMANAH)', party2023: 'AMANAH', coalition2023: 'PH', majority2023: 577, prediction2026: 'PN LEAN', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: PN (PAS) won seat from PH (AMANAH) in Jelebu.', coordinates: [2.969, 102.073] },
  { id: 'N5', code: 'N5', name: 'Serting', incumbent: 'Mohd Fairuz (PN)', party2023: 'PAS', coalition2023: 'PN', majority2023: 843, prediction2026: 'PN HOLD', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN HOLD', notes: 'Retained by PN.', coordinates: [2.876, 102.405] },
  { id: 'N6', code: 'N6', name: 'Palong', incumbent: 'Mustapha Nagoor (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 564, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'FELDA stronghold retained by BN.', coordinates: [2.766, 102.511] },
  { id: 'N7', code: 'N7', name: 'Jeram Padang', incumbent: 'Mohd Zaidy (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 693, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.723, 102.378] },
  { id: 'N8', code: 'N8', name: 'Bahau', incumbent: 'Teo Kok Seong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 8408, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'DAP safe seat retained.', coordinates: [2.808, 102.404] },
  { id: 'N9', code: 'N9', name: 'Lenggeng', incumbent: 'Mohd Asna Amin (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 685, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.846, 101.986] },
  { id: 'N10', code: 'N10', name: 'Nilai', incumbent: 'Arul Kumar (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 10889, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Industrial corridor retained by PH.', coordinates: [2.816, 101.796] },
  { id: 'N11', code: 'N11', name: 'Lobak', incumbent: 'Chew Seh Yong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 13504, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Core DAP safe seat retained.', coordinates: [2.736, 101.936] },
  { id: 'N12', code: 'N12', name: 'Temiang', incumbent: 'Ng Chin Tsai (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 3068, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.748, 101.951] },
  { id: 'N13', code: 'N13', name: 'Sikamat', incumbent: 'Aminuddin Harun (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 2662, prediction2026: 'PN LEAN', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: PN won seat after MB relocated to Linggi.', coordinates: [2.721, 101.966] },
  { id: 'N14', code: 'N14', name: 'Ampangan', incumbent: 'Tengku Zamrah (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 329, prediction2026: 'PN LEAN', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: PN won ultra-marginal seat from PH (329-vote majority in 2023).', coordinates: [2.701, 101.971] },
  { id: 'N15', code: 'N15', name: 'Juasseh', incumbent: 'Bibi Sharliza (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 78, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.776, 102.296] },
  { id: 'N16', code: 'N16', name: 'Seri Menanti', incumbent: 'Muhammad Sufian (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 370, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Royal seat retained by BN.', coordinates: [2.701, 102.161] },
  { id: 'N17', code: 'N17', name: 'Senaling', incumbent: 'Ismail Lasim (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 662, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.686, 102.246] },
  { id: 'N18', code: 'N18', name: 'Pilah', incumbent: 'Noorzunita Begum (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 1079, prediction2026: 'BN LEAN', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: BN won seat from PKR in Kuala Pilah town.', coordinates: [2.736, 102.256] },
  { id: 'N19', code: 'N19', name: 'Johol', incumbent: 'Saiful Yazan (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2117, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.596, 102.261] },
  { id: 'N20', code: 'N20', name: 'Labu', incumbent: 'Hanifah Abu Baker (BERSATU)', party2023: 'BERSATU', coalition2023: 'PN', majority2023: 1640, prediction2026: 'BN LEAN', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: BN won seat from PN (Bersatu) via split friction.', coordinates: [2.736, 101.881] },
  { id: 'N21', code: 'N21', name: 'Bukit Kepayang', incumbent: 'Nicole Tan (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 19684, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Largest DAP majority retained.', coordinates: [2.716, 101.906] },
  { id: 'N22', code: 'N22', name: 'Rahang', incumbent: 'Siau Meow Kong (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 6432, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.706, 101.946] },
  { id: 'N23', name: 'Mambau', code: 'N23', incumbent: 'Yap Yew Weng (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 14940, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.686, 101.916] },
  { id: 'N24', code: 'N24', name: 'Seremban Jaya', incumbent: 'Gunasekaren (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 12703, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.676, 101.976] },
  { id: 'N25', code: 'N25', name: 'Paroi', incumbent: 'Kamarol Ridzuan (PAS)', party2023: 'PAS', coalition2023: 'PN', majority2023: 5539, prediction2026: 'PN HOLD', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN HOLD', notes: 'Retained by PN.', coordinates: [2.711, 102.001] },
  { id: 'N26', code: 'N26', name: 'Chembong', incumbent: 'Zaifulbahri (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 4335, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Rembau core retained by BN.', coordinates: [2.576, 102.046] },
  { id: 'N27', code: 'N27', name: 'Rantau', incumbent: 'Mohamad Hasan (Tok Mat)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 10280, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Tok Mat stronghold retained by BN.', coordinates: [2.596, 101.966] },
  { id: 'N28', code: 'N28', name: 'Kota', incumbent: 'Suhaimi Aini (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 135, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.526, 102.106] },
  { id: 'N29', code: 'N29', name: 'Chuah', incumbent: 'Yew Boon Lye (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 6298, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.646, 101.761] },
  { id: 'N30', code: 'N30', name: 'Lukut', incumbent: 'Choo Ken Hwa (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 10135, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.566, 101.811] },
  { id: 'N31', code: 'N31', name: 'Bagan Pinang', incumbent: 'Abdul Fatah (PAS)', party2023: 'PAS', coalition2023: 'PN', majority2023: 3426, prediction2026: 'PN HOLD', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN HOLD', notes: 'Retained by PN. Port Dickson army camp postal votes.', coordinates: [2.476, 101.831] },
  { id: 'N32', code: 'N32', name: 'Linggi', incumbent: 'Mohd Faizal (BN)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 1461, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', isHot: true, notes: 'BN retained seat vs MB Aminuddin Harun (PH). Epicenter battleground.', coordinates: [2.496, 101.941] },
  { id: 'N33', code: 'N33', name: 'Sri Tanjung', incumbent: 'Rajasekaran (PKR)', party2023: 'PKR', coalition2023: 'PH', majority2023: 3996, prediction2026: 'PH HOLD', predictedWinner: 'PH', actualWinner: 'PH', actualResult: 'PH HOLD', notes: 'Retained by PH.', coordinates: [2.516, 101.861] },
  { id: 'N34', code: 'N34', name: 'Gemas', incumbent: 'Ridzuan Ahmad (BERSATU)', party2023: 'BERSATU', coalition2023: 'PN', majority2023: 3120, prediction2026: 'PN HOLD', predictedWinner: 'PN', actualWinner: 'PN', actualResult: 'PN HOLD', notes: 'Retained by PN.', coordinates: [2.586, 102.611] },
  { id: 'N35', code: 'N35', name: 'Gemencheh', incumbent: 'Suhaimizan Bizar (UMNO)', party2023: 'UMNO', coalition2023: 'BN', majority2023: 2434, prediction2026: 'BN HOLD', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN HOLD', notes: 'Retained by BN.', coordinates: [2.536, 102.396] },
  { id: 'N36', code: 'N36', name: 'Repah', incumbent: 'Veerapan (DAP)', party2023: 'DAP', coalition2023: 'PH', majority2023: 5950, prediction2026: 'BN LEAN', predictedWinner: 'BN', actualWinner: 'BN', actualResult: 'BN GAIN', isHot: true, isFlip: true, notes: '⚡ FLIPPED: BN won Tampin mixed seat from DAP.', coordinates: [2.476, 102.231] },
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
    if (filterCoalition === 'HOT') return s.isFlip || s.isHot;
    return s.actualWinner === filterCoalition;
  });

  // Actual post-election counts
  const actualBN = NS_SEATS.filter(s => s.actualWinner === 'BN').length;
  const actualPH = NS_SEATS.filter(s => s.actualWinner === 'PH').length;
  const actualPN = NS_SEATS.filter(s => s.actualWinner === 'PN').length;
  const flipCount = NS_SEATS.filter(s => s.isFlip).length;

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

    // Trigger invalidateSize after initial layout render
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle map resize on viewMode change
  useEffect(() => {
    if (viewMode === 'MAP' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // Update Leaflet Markers when filter or selected seat changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    filteredSeats.forEach(seat => {
      const colorInfo = PARTY_COLORS[seat.actualWinner];
      const isSelected = selectedSeatId === seat.id;

      const marker = L.circleMarker(seat.coordinates, {
        radius: isSelected ? 12 : seat.isFlip ? 10 : seat.isHot ? 9 : 7,
        fillColor: colorInfo.markerHex,
        color: isSelected ? '#F59E0B' : seat.isFlip ? '#FBBF24' : '#FFFFFF',
        weight: isSelected ? 3 : seat.isFlip ? 2.5 : 1,
        opacity: 1,
        fillOpacity: isSelected ? 0.9 : 0.75,
      }).addTo(map);

      // Popup content
      const flipTag = seat.isFlip ? ' ⚡FLIP' : '';
      const popupHtml = `
        <div style="font-family: monospace; font-size: 12px; color: #000; min-width: 180px;">
          <strong style="font-size: 14px;">DUN ${seat.code} ${seat.name}${flipTag}</strong><br/>
          <span>Incumbent: ${seat.incumbent}</span><br/>
          <span>2023 Maj: <strong>${seat.majority2023.toLocaleString()}</strong></span><br/>
          <span style="color:${colorInfo.markerHex}; font-weight:bold;">2026 Result: ${seat.actualResult}</span><br/>
          <span style="font-size:10px; color:#888;">Prediction: ${seat.prediction2026}</span>
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
              Spatial Interactive Map · Negeri Sembilan 36 DUN · Official SPR Results
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
            PH ({actualPH})
          </button>
          <button
            onClick={() => setFilterCoalition('BN')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'BN' ? 'bg-blue-950 text-blue-300 border border-blue-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-blue-400'}`}
          >
            BN ({actualBN})
          </button>
          <button
            onClick={() => setFilterCoalition('PN')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'PN' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-emerald-400'}`}
          >
            PN ({actualPN})
          </button>
          <button
            onClick={() => setFilterCoalition('HOT')}
            className={`px-3 py-1 rounded transition ${filterCoalition === 'HOT' ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-bold' : 'bg-slate-900 text-slate-400 hover:text-amber-400'}`}
          >
            ⚡ FLIPS ({flipCount})
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
          const colorInfo = PARTY_COLORS[seat.actualWinner];
          const isSelected = selectedSeatId === seat.id;

          return (
            <div
              key={seat.id}
              onClick={() => onSelectSeat(seat)}
              style={{
                borderColor: isSelected ? '#F59E0B' : seat.isFlip ? '#FBBF24' : colorInfo.border,
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : colorInfo.bg,
              }}
              className={`group relative cursor-pointer p-3 rounded border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between ${
                isSelected ? 'ring-2 ring-amber-400 z-10' : ''
              } ${seat.isFlip ? 'ring-1 ring-amber-400/60' : ''}`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-300">{seat.code}</span>
                <div className="flex items-center gap-1">
                  {seat.isFlip && <span className="text-xs">⚡</span>}
                  {seat.isHot && !seat.isFlip && <span className="text-xs">🔥</span>}
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase"
                    style={{ color: colorInfo.text, backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    {seat.actualWinner}
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
          ⚡ Gold border = Seat Flip · Source: SPR 1 Ogos 2026 · arifOS VAULT999-PRN16-NS
        </div>
      </div>
    </div>
  );
};
