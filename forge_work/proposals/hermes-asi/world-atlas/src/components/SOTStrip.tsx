import type { SOTIndex } from '../lib/types';

interface Props {
  sot: SOTIndex;
}

export function SOTStrip({ sot }: Props) {
  return (
    <div className="sot-strip">
      <div className="sot-cell" data-axis="geo">
        <div className="label">Δ Geopolitics</div>
        <div className="value">{sot.geo}</div>
      </div>
      <div className="sot-cell" data-axis="econ">
        <div className="label">Ω Economics</div>
        <div className="value">{sot.econ}</div>
      </div>
      <div className="sot-cell" data-axis="soc">
        <div className="label">Ψ Social</div>
        <div className="value">{sot.soc}</div>
      </div>
      <div className="sot-cell" data-axis="aggregate">
        <div className="label">SOT · Aggregate</div>
        <div className="value">{sot.aggregate}</div>
        <div className="delta faint">{new Date(sot.updated).toUTCString().slice(17, 22)} UTC</div>
      </div>
    </div>
  );
}
