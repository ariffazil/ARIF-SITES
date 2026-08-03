import { useState } from 'react';
import { STATIC_AXES, type AxisVector } from '@/data/axisAdapter';

type Lens = 'power' | 'meaning';

interface Props {
  /** Which namespace to render: power (geopolitics) or meaning (language) */
  lens: Lens;
  /** Optional override for section label */
  label?: string;
  /** Optional override for heading */
  heading?: string;
}

const LENS_CONFIG: Record<Lens, { label: string; heading: string; accentText: string }> = {
  power: {
    label: '7 POWER VECTORS PROFILE',
    heading: 'Select Vector to Inspect Power Mechanics',
    accentText: 'STRATEGIC THESIS & POWER BASE',
  },
  meaning: {
    label: '7 LINGUISTIC AXES PROFILE',
    heading: 'Select Axis to Inspect Language Philosophy',
    accentText: 'EPISTEMIC THESIS & MEANING FRAME',
  },
};

/** The 7 vectors, ordered 1-7, defaulting to Nusantara (index 6) */
const AXES = STATIC_AXES;

export function SevenAxisGlobe({ lens, label, heading }: Props) {
  const cfg = LENS_CONFIG[lens];
  const [selected, setSelected] = useState<AxisVector>(AXES[6]); // Default: Nusantara

  const data = lens === 'power' ? selected.power : selected.meaning;

  return (
    <section className="py-16 border-b border-slate-800">
      <div className="site-frame">
        <div className="mb-8">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
            {label ?? cfg.label}
          </div>
          <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
            {heading ?? cfg.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* VECTOR SELECTOR BUTTONS */}
          <div className="space-y-2">
            {AXES.map((v) => {
              const isSelected = selected.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between font-mono text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                    <span className="font-bold">{v.code}</span>
                    <span className="text-slate-300 font-sans text-sm line-clamp-1">{v.name}</span>
                  </div>
                  {isSelected && <span className="text-cyan-400">◄</span>}
                </button>
              );
            })}
          </div>

          {/* INSPECTOR PANEL */}
          <div className="lg:col-span-2 bg-[#080c16] border border-slate-800 rounded-xl p-6 md:p-8 font-mono relative overflow-hidden">
            {/* Color accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: selected.color }}></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                  AXIS {selected.id} — {selected.code}
                </span>
                <h3 className="text-2xl font-black text-white font-sans mt-1">{selected.name}</h3>
                <div className="text-xs text-slate-400 mt-1">{selected.region}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: selected.color }}>
                  {lens === 'power' ? 'POWER LENS' : 'MEANING LENS'}
                </div>
                <span className="text-[0.55rem] text-slate-500 font-mono uppercase tracking-wider">
                  verb: {selected.verb}
                </span>
              </div>
            </div>

            {/* Content — adapts based on lens */}
            <div className="space-y-6 text-sm font-sans">
              {/* Thesis */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  {cfg.accentText}:
                </h4>
                <p className="text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 font-body text-base">
                  {data.thesis}
                </p>
              </div>

              {/* Gift + Blindness — BOTH LENSES SHOW BOTH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                    {lens === 'power' ? 'Strategic Gift' : 'Epistemic Gift'}:
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded border border-slate-900 leading-relaxed">
                    {data.gift}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 font-bold">
                    Blind Spot:
                  </h4>
                  <p className="text-xs text-slate-300 bg-amber-950/20 p-3 rounded border border-amber-900/30 leading-relaxed italic">
                    {data.blindness}
                  </p>
                </div>
              </div>

              {/* Lens-specific fields */}
              {lens === 'power' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2 font-bold">
                      Primary Friction Points:
                    </h4>
                    <ul className="space-y-2">
                      {selected.power.frictionPoints.map((fp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-900">
                          <span className="text-red-400 shrink-0">⚡</span>
                          <span>{fp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                      Key Geopolitical Levers:
                    </h4>
                    <ul className="space-y-2">
                      {selected.power.levers.map((kl, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-900">
                          <span className="text-cyan-400 shrink-0">⚙</span>
                          <span>{kl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {lens === 'meaning' && (
                <div>
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                    Mirror Pair: {
                      selected.mirrorOf > 0
                        ? `${selected.code} ↔ ${AXES.find(a => a.id === selected.mirrorOf)?.code ?? '?'}`
                        : 'None — this is the Pivot'
                    }
                  </h4>
                  <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded border border-slate-900">
                    {selected.mirrorOf > 0
                      ? `This axis mirrors axis ${selected.mirrorOf}. Both observe the same phenomenon — one from power, one from meaning. The shared verb '${selected.verb}' is invariant.`
                      : `Nusantara is the pivot — it does not mirror any single axis. It refracts all of them. The verb '${selected.verb}' is the crossroads function.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
