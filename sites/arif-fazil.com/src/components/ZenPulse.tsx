type ZenPulseProps = {
  whereAmI: string;
  whyCare: string;
  whatNext: string;
};

// Zen-pulse orientation bar — answers three questions in three seconds:
// Where am I? · Why care? · What next? Quiet by design: small, dim, calm.
export function ZenPulse({ whereAmI, whyCare, whatNext }: ZenPulseProps) {
  return (
    <div className="border-b border-forge-iron bg-forge-black">
      <div className="site-frame grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 py-2 font-technical text-[0.65rem] uppercase tracking-widest">
        <div className="flex gap-2">
          <span className="text-forge-dim/60 flex-shrink-0">Where am I?</span>
          <span className="text-forge-dim">{whereAmI}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-forge-dim/60 flex-shrink-0">Why care?</span>
          <span className="text-forge-orange">{whyCare}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-forge-dim/60 flex-shrink-0">What next?</span>
          <span className="text-forge-dim">{whatNext}</span>
        </div>
      </div>
    </div>
  );
}

export default ZenPulse;
