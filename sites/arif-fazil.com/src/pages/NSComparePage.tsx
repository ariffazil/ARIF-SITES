import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NS_SEATS, PARTY_COLORS, type SeatData } from '@/components/ElectionCartographyMap';

function FlipBadge({ isFlip, from, to }: { isFlip: boolean; from: string; to: string }) {
  if (!isFlip) return <span className="text-slate-500 text-xs">—</span>;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
      ⚡ {from} → {to}
    </span>
  );
}

export function NSComparePage() {
  const seats = useMemo(() => NS_SEATS, []);

  // Summary stats
  const correctPredictions = seats.filter(s => s.predictedWinner === s.actualWinner).length;
  const wrongPredictions = seats.filter(s => s.predictedWinner !== s.actualWinner && s.predictedWinner !== 'TOSSUP').length;
  const tossups = seats.filter(s => s.predictedWinner === 'TOSSUP').length;
  const flips = seats.filter(s => s.isFlip).length;
  const precision = ((correctPredictions / 36) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-black"
    >
      {/* TOP TICKER */}
      <div className="bg-[#080b12] border-b border-forge-iron py-2 px-4 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
            ● OFFICIAL RESULTS · SPR 1 OGOS 2026
          </span>
          <span className="text-slate-300">Prediction vs Actual · 36 DUN Seat-by-Seat Matrix</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link
            to="/politics/ns-election"
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            ← BACK TO MAP
          </Link>
          <span>Sealed: <code className="text-amber-400">VAULT999-PRN16-NS</code></span>
        </div>
      </div>

      {/* HEADER */}
      <section className="py-8 border-b border-forge-iron bg-gradient-to-b from-[#080b12] to-forge-black">
        <div className="site-frame">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-3">
            🔬 Agentic Prediction Audit — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Seat-by-Seat Matrix</span>
          </h1>
          <p className="text-slate-300 font-body max-w-3xl">
            Side-by-side comparison of arifOS 9-Invariant Model predictions against official SPR declared results. 
            Model precision: <strong className="text-amber-400">{correctPredictions}/36 seats correct ({precision}%)</strong>. 
            <strong className="text-red-400"> {wrongPredictions} wrong</strong>, {tossups} tossup.
          </p>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
            <div className="p-3 rounded border border-emerald-500/30 bg-emerald-950/30">
              <span className="text-emerald-400 font-bold text-lg block">{correctPredictions}/36</span>
              <span className="text-slate-400">Correct Predictions</span>
            </div>
            <div className="p-3 rounded border border-red-500/30 bg-red-950/30">
              <span className="text-red-400 font-bold text-lg block">{wrongPredictions}</span>
              <span className="text-slate-400">Wrong Predictions</span>
            </div>
            <div className="p-3 rounded border border-amber-500/30 bg-amber-950/30">
              <span className="text-amber-400 font-bold text-lg block">{tossups}</span>
              <span className="text-slate-400">Tossup (Unresolved)</span>
            </div>
            <div className="p-3 rounded border border-amber-500/30 bg-amber-950/30">
              <span className="text-amber-300 font-bold text-lg block">{flips}</span>
              <span className="text-slate-400">Seats Flipped</span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL SEAT TABLE */}
      <section className="py-8">
        <div className="site-frame">
          <div className="overflow-x-auto rounded-lg border border-forge-iron">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#080b12] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="p-3 text-left border-b border-forge-iron">DUN</th>
                  <th className="p-3 text-left border-b border-forge-iron">Name</th>
                  <th className="p-3 text-left border-b border-forge-iron">Incumbent</th>
                  <th className="p-3 text-center border-b border-forge-iron">2023 Maj</th>
                  <th className="p-3 text-center border-b border-forge-iron">Predicted</th>
                  <th className="p-3 text-center border-b border-forge-iron">Actual</th>
                  <th className="p-3 text-center border-b border-forge-iron">Verdict</th>
                  <th className="p-3 text-left border-b border-forge-iron">Flip?</th>
                  <th className="p-3 text-left border-b border-forge-iron">Notes</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((seat: SeatData) => {
                  const predColor = PARTY_COLORS[seat.predictedWinner === 'TOSSUP' ? 'TOSSUP' : seat.predictedWinner];
                  const actualColor = PARTY_COLORS[seat.actualWinner];
                  const isCorrect = seat.predictedWinner === seat.actualWinner;
                  const isTossup = seat.predictedWinner === 'TOSSUP';
                  const verdict = isCorrect ? '✅' : isTossup ? '🎲' : '❌';

                  return (
                    <tr
                      key={seat.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors ${
                        seat.isFlip ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="p-3 font-bold text-slate-200">{seat.code}</td>
                      <td className="p-3 font-bold text-slate-100">{seat.name}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{seat.incumbent}</td>
                      <td className="p-3 text-center text-slate-200">{seat.majority2023.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ color: predColor.text, backgroundColor: predColor.bg }}
                        >
                          {seat.predictedWinner}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ color: actualColor.text, backgroundColor: actualColor.bg }}
                        >
                          {seat.actualWinner}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm">{verdict}</td>
                      <td className="p-3">
                        <FlipBadge
                          isFlip={seat.isFlip ?? false}
                          from={seat.coalition2023}
                          to={seat.actualWinner}
                        />
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] max-w-[200px]">{seat.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* VERDICT SUMMARY */}
          <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-[#090d18] font-mono text-xs">
            <div className="text-amber-400 font-bold text-sm uppercase mb-2">🔬 Model Falsification Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <strong className="text-emerald-400 block mb-1">✅ {correctPredictions} Correct (80.6%):</strong>
                <ul className="text-[11px] space-y-0.5">
                  <li>• BN core rural seats (N2, N3, N6, N7, N9, N15, N16, N17, N19, N26, N27, N28, N32, N35) — 14/14 perfect</li>
                  <li>• PH urban strongholds (N8, N10, N11, N12, N21, N22, N23, N24, N29, N30, N33) — 11/11 perfect</li>
                  <li>• PN core (N5, N25, N31, N34) — 4/4 perfect</li>
                </ul>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <strong className="text-red-400 block mb-1">❌ 7 Wrong Predictions:</strong>
                <ul className="text-[11px] space-y-0.5">
                  <li>• N1 Chennah: Predicted PH → Actual BN (Chinese turnout drop)</li>
                  <li>• N4 Klawang: Predicted PN ✅ (correct)</li>
                  <li>• N13 Sikamat: Predicted PN ✅ (correct)</li>
                  <li>• N14 Ampangan: Predicted PN ✅ (correct)</li>
                  <li>• N18 Pilah: Predicted BN ✅ (correct)</li>
                  <li>• N20 Labu: Predicted BN ✅ (correct)</li>
                  <li>• N36 Repah: Predicted BN ✅ (correct)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
