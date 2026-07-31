import { LiveClock } from './LiveClock';

// Clean status bar — just orientation + live clock. Props accepted for backward compat but ignored.
type ZenPulseProps = { whereAmI?: string; whyCare?: string; whatNext?: string };
export function ZenPulse(_props?: ZenPulseProps) {
  return (
    <div className="border-b border-forge-iron bg-forge-black">
      <div className="site-frame flex items-center justify-between py-2 font-technical text-[0.65rem] uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="text-forge-dim/60">arif-fazil.com</span>
          <span className="text-forge-dim">·</span>
          <span className="text-forge-dim">Human Cockpit</span>
        </div>
        <LiveClock />
      </div>
    </div>
  );
}

export default ZenPulse;
