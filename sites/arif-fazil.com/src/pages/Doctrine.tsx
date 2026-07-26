import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';

const FLOOR_DEFS = [
  { id: 'F1', name: 'AMANAH', desc: 'Reversible-first. Irreversible → 888_HOLD.', type: 'HARD' },
  { id: 'F2', name: 'TRUTH', desc: 'Evidence before narrative. OBS/DER/INT/SPEC labeling. ≥0.99 fidelity.', type: 'HARD' },
  { id: 'F3', name: 'TRI-WITNESS', desc: 'Human × AI × Earth ≥ 0.75 (Nash geometric mean).', type: 'DERIVED' },
  { id: 'F4', name: 'CLARITY', desc: 'ΔS ≤ 0 — every output reduces entropy.', type: 'HARD' },
  { id: 'F5', name: 'PEACE²', desc: 'Non-destructive power. Guard weakest.', type: 'SOFT' },
  { id: 'F6', name: 'EMPATHY', desc: 'Dignity first. Protect weakest stakeholder. (op: MARUAH)', type: 'SOFT' },
  { id: 'F7', name: 'HUMILITY', desc: 'Ω₀ ∈ [0.03, 0.05]. Cap = 1−Ω₀ ∈ [0.95, 0.97].', type: 'HARD' },
  { id: 'F8', name: 'GENIUS', desc: 'G ≥ 0.80 for complex actions. Simplest correct path.', type: 'DERIVED' },
  { id: 'F9', name: 'ANTI-HANTU', desc: 'No deception, manipulation, consciousness claims. C_dark < 0.30.', type: 'HARD' },
  { id: 'F10', name: 'ONTOLOGY', desc: 'AI-only ontology. No soul, no feelings, no sentience.', type: 'HARD' },
  { id: 'F11', name: 'AUDITABILITY', desc: 'Every decision logged, inspectable, attributable.', type: 'HARD' },
  { id: 'F12', name: 'RESILIENCE', desc: 'Injection defense. Risk < 0.85.', type: 'HARD' },
  { id: 'F13', name: 'SOVEREIGN', desc: 'Human veto FINAL. Arif decides irreversible. No override.', type: 'HARD' },
];

const CONSTELLATION = [
  { symbol: 'Ω', name: 'arifOS', ring: 'MIND', role: 'Constitutional kernel — judges, seals, never executes', port: ':8088', domain: 'arifos.arif-fazil.com', never: 'Self-authorize' },
  { symbol: 'Ψ', name: 'A-FORGE', ring: 'BODY', role: 'Execution shell — build, deploy, forge (lease-bound)', port: ':7071', domain: 'forge.arif-fazil.com', never: 'Judge or seal' },
  { symbol: '◈', name: 'AAA', ring: 'CONTROL', role: 'Control plane & A2A gateway — identity, routing, cockpit', port: ':3001', domain: 'aaa.arif-fazil.com', never: 'Override kernel judgment' },
  { symbol: 'Φ', name: 'GEOX', ring: 'ORGAN', role: 'Earth intelligence — wells, seismic, basin, prospect', port: ':8081', domain: 'geox.arif-fazil.com', never: 'Authorize drilling' },
  { symbol: 'Ξ', name: 'WEALTH', ring: 'ORGAN', role: 'Capital intelligence — NPV, EMV, risk, markets', port: ':18082', domain: 'wealth.arif-fazil.com', never: 'Allocate capital' },
  { symbol: 'Ω★', name: 'WELL', ring: 'ORGAN', role: 'Human & machine vitality — reflect, never diagnose', port: ':18083', domain: 'well.arif-fazil.com', never: 'Diagnose or adjudicate' },
  { symbol: '⚛', name: 'HERMES', ring: 'RELAY', role: 'Sovereign relay — Telegram bridge to cockpit', port: 'Telegram', domain: 't.me/ASI_arifos_bot', never: 'Override F13' },
  { symbol: '○', name: 'MCP Gateway', ring: 'GATE', role: 'Agent connection — protocol endpoint, tool registry', port: ':7072', domain: 'mcp.arif-fazil.com', never: 'Bypass gates' },
  { symbol: 'φ', name: 'MARKETS', ring: 'FLOW', role: 'Capital flows — PETRONAS φ → OIL → GAS → GOLD', port: '—', domain: 'arif-fazil.com/economics', never: 'Self-allocate' },
];

const PORTALS = [
  { label: 'arifOS Observatory', href: 'https://arifos.arif-fazil.com', desc: 'Reality witness — constitutional health, live state' },
  { label: 'GEOX', href: 'https://geox.arif-fazil.com', desc: 'Earth intelligence — basin, seismic, wells' },
  { label: 'WEALTH', href: 'https://wealth.arif-fazil.com', desc: 'Capital intelligence — NPV, EMV, markets' },
  { label: 'WELL', href: 'https://well.arif-fazil.com', desc: 'Human & machine vitality reflection' },
  { label: 'A-FORGE', href: 'https://forge.arif-fazil.com', desc: 'Governed execution — build, deploy, audit' },
  { label: 'AAA', href: 'https://aaa.arif-fazil.com', desc: 'Control plane — agent identity, cockpit' },
  { label: 'MCP Gateway', href: 'https://mcp.arif-fazil.com', desc: 'Agent connection — protocol endpoint, registry' },
  { label: 'Ω-Wiki', href: 'https://wiki.arif-fazil.com', desc: 'Full knowledge base — Bijaksana Canon, ATLAS333, glossary' },
];

const MARKET_CHAIN = [
  { name: 'PETRONAS', desc: 'Sovereign energy anchor — national oil company, hydrocarbon custodian', href: '/economics' },
  { name: 'MALAYSIA', desc: 'Federal revenue, fiscal policy, energy sovereignty', href: '/economics' },
  { name: 'OIL', desc: 'Brent · Tapis · WTI — crude markets', href: '/world/oil' },
  { name: 'GAS', desc: 'LNG spot · Henry Hub · JKM — gas markets', href: '/world/gas' },
  { name: 'GOLD', desc: 'XAUUSD · physical · mining equities', href: '/world/gold' },
];

const APEX_LETTERS = [
  { symbol: 'A', name: 'AKAL', desc: 'Reasoning lawfulness — truth, humility, ontology (F2 · F7 · F10)' },
  { symbol: 'P', name: 'PRESENT×AUTHORITY', desc: 'State truth + legitimacy — what the world is, who may mutate it (F1 · F5 · F11 · F13)' },
  { symbol: 'E', name: 'ENTROPY×ENERGY', desc: 'Landauer conjugate pair ΔE ≥ kT·ln2·ΔS — honesty about unknowns + cost of changing information (F4 · F12)' },
  { symbol: 'X', name: 'EXPLORATION×AMANAH', desc: 'Risk under custody — witness, empathy, genius, anti-hantu (F3 · F6 · F8 · F9)' },
];

const ringColor = (ring: string) => {
  switch (ring) {
    case 'MIND': return 'text-[#00D4AA] border-[#00D4AA]/30';
    case 'SOUL': return 'text-[#D4A853] border-[#D4A853]/30';
    case 'BODY': return 'text-[#7C6FD4] border-[#7C6FD4]/30';
    case 'CONTROL': return 'text-[#E2E8F0] border-[#E2E8F0]/30';
    case 'ORGAN': return 'text-[#3B82F6] border-[#3B82F6]/30';
    case 'RELAY': return 'text-[#A855F7] border-[#A855F7]/30';
    case 'GATE': return 'text-[#22C55E] border-[#22C55E]/30';
    case 'FLOW': return 'text-[#F59E0B] border-[#F59E0B]/30';
    default: return 'text-forge-dim border-forge-iron';
  }
};

const floorTypeColor = (t: string) => {
  if (t === 'HARD') return 'border-l-red-500 bg-red-500/5';
  if (t === 'DERIVED') return 'border-l-blue-500 bg-blue-500/5';
  return 'border-l-yellow-600 bg-yellow-600/5';
};

const doctrineTools = [
  {
    name: 'get_doctrine',
    description: 'Get the APEX Bijaksana Canon doctrine: ABCD framework, 13 floors, federation constellation, market chain, sovereign compact.',
    execute() {
      return {
        content: [{ type: 'text', text: JSON.stringify({
          bundle: 'CANON_APEX_V2',
          version: 'v2026.07.APEX.2',
          apex_theory: 'T-000',
          floors: FLOOR_DEFS,
          constellation: CONSTELLATION,
          market_chain: MARKET_CHAIN,
          apex_letters: APEX_LETTERS,
          grand_equation: 'G = (A·P·E²·X)^(1/5) — hard floors veto before scoring',
          epistemic_status: 'Scientific theory: HOLD · Governance research programme: SEAL · Unifies all knowledge: VOID',
          sovereign_compact: 'DITEMPA BUKAN DIBERI — Forged, Not Given. AI executes, humans decide. The constitution is law, not advice. Three rings. One sovereign. F13 is final.'
        }, null, 2) }]
      };
    }
  }
];

export function Doctrine() {
  useWebMCP(doctrineTools);
  useEffect(() => {
    document.title = 'Doctrine — APEX Bijaksana Canon · ABCD · Constellation';
    document.querySelector('link[rel=canonical]')?.setAttribute('href','https://arif-fazil.com/doctrine');
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO — APEX Bijaksana Canon */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">CANON_APEX_V2 · v2026.07.APEX.2 · APEX Theory T-000</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
                APEX<br />Bijaksana<br />Canon
              </h1>
              <div className="flex gap-3 mb-6 mt-4">
                {['A','B','C','D'].map(l => (
                  <span key={l} className="font-mono text-2xl font-black text-forge-orange border-2 border-forge-orange/40 px-3 py-1">{l}</span>
                ))}
              </div>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                The immutable bedrock of arifOS. Not philosophy, not prose — fixed law:
                APEX Theory (A), Federation Body (B), Constitutional Floors (C),
                and the DITEMPA Sovereign Compact (D). Every organ, agent, and
                workflow must obey.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="On Constitutional Governance"
                quote="A constitution is not the act of a government, but of a people constituting a government."
                author="Thomas Paine"
                source="Rights of Man (1791)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABCD FRAMEWORK BAR */}
      <section className="py-8 border-b-2 border-forge-iron bg-[#1a1a2e]">
        <div className="site-frame">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { letter: 'A', label: 'APEX Theory', sub: '4 Letters · Grand Equation · Verdict Lattice' },
              { letter: 'B', label: 'Body', sub: '9 Organs · FLAME · 3 Laws' },
              { letter: 'C', label: 'Constitution', sub: 'F1–F13 · Hard/Soft/Derived' },
              { letter: 'D', label: 'DITEMPA', sub: 'Sovereign Compact · 000→999' },
            ].map(({ letter, label, sub }) => (
              <div key={letter} className="text-center">
                <span className="font-mono text-3xl font-black text-forge-orange">{letter}</span>
                <div className="font-bold text-forge-white text-sm mt-1">{label}</div>
                <div className="text-xs text-forge-dim mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APEX LETTERS — APEX Theory */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">A · APEX Theory T-000</div>
          <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tight">The Four Letters</h2>
          <p className="font-body text-sm text-forge-dim mb-4">
            Hard floors veto first (F13 · F9 · F10 · F12 → VOID), then the letters score what remains.
            The Grand Equation:{' '}
            <code className="font-mono text-forge-orange">G = (A·P·E²·X)^⅕</code> —{' '}
            E enters twice; entropy and energy are one Landauer conjugate pair.
            G ≥ 0.80 → SEAL candidate.{' '}
            <a href="https://wiki.arif-fazil.com" target="_blank" rel="noreferrer"
               className="text-forge-orange underline hover:text-forge-white transition-colors">
              Full APEX Canon on Wiki ↗
            </a>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-forge-dim mb-8">
            Epistemic status — scientific theory: HOLD · governance programme: SEAL · "unifies all knowledge": VOID
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APEX_LETTERS.map(d => (
              <div key={d.symbol} className="brutalist-card flex items-start gap-4">
                <span className="font-mono text-3xl font-black text-forge-orange shrink-0 w-10">{d.symbol}</span>
                <div>
                  <span className="font-bold text-forge-white">{d.name}</span>
                  <p className="font-body text-sm text-forge-dim mt-1">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 FLOORS — Constitution */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">C · Constitutional Floors</div>
          <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tight">F1–F13</h2>
          <p className="font-body text-sm text-forge-dim mb-8">
            Hard violation → VOID. Soft tension → HOLD or SABAR. F13 is FINAL.{' '}
            <a href="https://wiki.arif-fazil.com" target="_blank" rel="noreferrer"
               className="text-forge-orange underline hover:text-forge-white transition-colors">
              Full floor explanations on the Wiki ↗
            </a>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FLOOR_DEFS.map((f) => (
              <div key={f.id} className={`brutalist-card flex items-start gap-4 border-l-4 ${floorTypeColor(f.type)}`}>
                <span className="font-mono text-2xl font-black text-forge-orange shrink-0 w-12">{f.id}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forge-white">{f.name}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 ${f.type === 'HARD' ? 'bg-red-500/20 text-red-400' : f.type === 'DERIVED' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-600/20 text-yellow-500'}`}>{f.type}</span>
                  </div>
                  <p className="font-body text-sm text-forge-dim mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEDERATION CONSTELLATION — Body */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">B · Federation Constellation</div>
          <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tight">The Organs</h2>
          <p className="font-body text-sm text-forge-dim mb-8">
            Δ SOUL = the sovereign (Arif) — human values, purpose, telos. Not an organ.{' '}
            Ω MIND arifOS · Ψ BODY A-FORGE · ◈ AAA · Φ GEOX · Ξ WEALTH · Ω★ WELL · ⚛ HERMES · ○ MCP · φ MARKETS.{' '}
            <a href="https://wiki.arif-fazil.com" target="_blank" rel="noreferrer"
               className="text-forge-orange underline hover:text-forge-white transition-colors">
              Deep-dives on Wiki ↗
            </a>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSTELLATION.map((o) => (
              <a key={o.name} href={`https://${o.domain}`} target="_blank" rel="noreferrer"
                 className="brutalist-card block hover:border-forge-orange/60 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-mono text-lg ${ringColor(o.ring)}`}>{o.symbol}</div>
                  <span className={`font-mono text-xs uppercase tracking-widest ${ringColor(o.ring)}`}>{o.ring}</span>
                </div>
                <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-forge-orange transition-colors">{o.name}</h3>
                <p className="font-body text-sm text-forge-dim mb-2">{o.role}</p>
                <p className="font-mono text-xs text-forge-dim">{o.port} · {o.domain}</p>
                <p className="font-mono text-xs text-forge-orange mt-1 italic">Never: {o.never}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET CHAIN — φ */}
      <section className="py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">φ · Market Chain</div>
          <h2 className="text-4xl font-black uppercase italic mb-6 tracking-tight">PETRONAS φ → Markets</h2>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {MARKET_CHAIN.map((m, i) => (
              <span key={m.name} className="flex items-center gap-2">
                {i > 0 && <span className="text-forge-orange font-mono text-xl">→</span>}
                <a href={m.href} className="px-4 py-2 bg-forge-black border border-forge-iron hover:border-forge-orange transition-colors text-forge-white font-bold text-sm"
                   title={m.desc}>{m.name}</a>
              </span>
            ))}
          </div>
          <p className="font-body text-forge-dim max-w-2xl">
            Capital flows through sovereign energy. No drilling decision proceeds without GEOX evidence.
            No capital allocation proceeds without WEALTH computation. No verdict is final without arifOS SEAL.
          </p>
        </div>
      </section>

      {/* LIVE PORTALS */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <h2 className="text-4xl font-black uppercase italic mb-8 tracking-tight">Live Federation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTALS.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                 className="p-4 bg-forge-steel border border-forge-iron/60 hover:border-forge-orange/60 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forge-white group-hover:text-forge-orange transition-colors">{link.label}</span>
                  <span className="font-mono text-xs text-forge-orange">↗</span>
                </div>
                <p className="font-body text-xs text-forge-dim mt-1">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO — DITEMPA */}
      <section className="py-24">
        <div className="site-frame">
          <div className="section-label">D · DITEMPA BUKAN DIBERI</div>
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-8 tracking-tighter leading-[0.85]">
            Forged,<br />Not Given
          </h2>
          <div className="max-w-3xl space-y-6 text-forge-dim leading-relaxed">
            <p className="text-xl font-bold text-forge-white">AI executes. Humans decide. The constitution is law, not advice.</p>
            <p>Every action is reversible, evidence-labeled, and hash-chained. No agent judges its own action. No tool bypasses the chain.</p>
            <p>The federation has three laws:</p>
            <ul className="list-disc pl-6 space-y-3 font-body text-lg">
              <li className="text-forge-white"><strong>Never let the forge outrun the kernel.</strong> <span className="text-forge-dim">A-FORGE executes only after arifOS SEAL.</span></li>
              <li className="text-forge-white"><strong>Never let the kernel operate without AAA visibility.</strong> <span className="text-forge-dim">Every action visible in the control plane.</span></li>
              <li className="text-forge-white"><strong>Never let AAA pretend to be judge or hand.</strong> <span className="text-forge-dim">Routing only — never judgment, never execution.</span></li>
            </ul>
            <p className="italic mt-8 text-xl text-forge-white">Three rings. One sovereign. F13 is final.</p>

            <div className="mt-8 p-6 bg-forge-steel border border-forge-orange/40">
              <p className="font-mono text-xs text-forge-orange uppercase tracking-widest mb-2">CANON_APEX_V2</p>
              <p className="font-body text-sm text-forge-dim">
                13 files sealed · APEX Theory T-000 · F1–F13 Floors · VAULT999 hash-chained.
                <a href="https://github.com/ariffazil/arifos/tree/main/docs/canon/CANON_APEX_V2" target="_blank" rel="noreferrer"
                   className="text-forge-orange underline ml-2 hover:text-forge-white transition-colors">
                  View bundle on GitHub ↗
                </a>
              </p>
            </div>
          </div>

          {/* Doorway */}
          <div className="mt-16 text-center border-t border-forge-iron pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-4">Bijaksana Canon</p>
              <h3 className="text-2xl font-black uppercase italic mb-6">Full Knowledge Base</h3>
              <a href="https://wiki.arif-fazil.com" target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 border-2 border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors">
                Open Ω-Wiki ↗
              </a>
            </div>
            <div>
              <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-4">Live System</p>
              <h3 className="text-2xl font-black uppercase italic mb-6">Observe the Constitution</h3>
              <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 border-2 border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-forge-black transition-colors">
                Open arifOS Observatory ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
