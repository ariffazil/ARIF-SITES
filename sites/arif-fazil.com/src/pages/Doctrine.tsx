import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';

const FLOOR_DEFS = [
  { id: 'F1', name: 'AMANAH', desc: 'Every action reversible or backed up. Irreversible → 888_HOLD.' },
  { id: 'F2', name: 'TRUTH', desc: 'Evidence before narrative. OBS/DER/INT/SPEC labeling.' },
  { id: 'F3', name: 'WITNESS', desc: 'Tri-witness consensus for high-blast actions.' },
  { id: 'F4', name: 'CLARITY', desc: 'ΔS ≤ 0 — every output reduces entropy.' },
  { id: 'F5', name: 'PEACE²', desc: 'Non-destructive power. Guard weakest.' },
  { id: 'F6', name: 'MARUAH', desc: 'Dignity first. ASEAN/MY context.' },
  { id: 'F7', name: 'HUMILITY', desc: 'Cap confidence at 0.90. Declare unknowns.' },
  { id: 'F8', name: 'GENIUS', desc: 'G ≥ 0.80 + C_dark < 0.30 to proceed.' },
  { id: 'F9', name: 'ANTI-HANTU', desc: 'No hallucination, no consciousness claims.' },
  { id: 'F10', name: 'ONTOLOGY', desc: 'AI is instrument. No soul, no feelings.' },
  { id: 'F11', name: 'AUDIT', desc: 'Every action leaves trace. Receipts > narratives.' },
  { id: 'F12', name: 'INJECTION', desc: 'Sanitize inputs. External ≠ authority.' },
  { id: 'F13', name: 'SOVEREIGN', desc: 'Human veto FINAL. Arif decides irreversible.' },
];

const ORGANS = [
  { name: 'arifOS', role: 'Constitutional kernel', port: '8088', must_never: 'Self-authorize', ring: 'MIND' },
  { name: 'GEOX', role: 'Earth intelligence', port: '8081', must_never: 'Authorize drilling', ring: 'ORGAN' },
  { name: 'WEALTH', role: 'Capital intelligence', port: '18082', must_never: 'Allocate capital', ring: 'ORGAN' },
  { name: 'WELL', role: 'Human readiness', port: '18083', must_never: 'Diagnose', ring: 'ORGAN' },
  { name: 'AAA', role: 'Control plane / A2A', port: '3001', must_never: 'Issue verdicts', ring: 'BODY' },
  { name: 'A-FORGE', role: 'Execution shell', port: '7071/7072', must_never: 'Self-authorize', ring: 'BODY' },
];

const doctrineTools = [
  {
    name: 'get_doctrine',
    description: 'Get the arifOS constitutional doctrine: 13 floors, organ topology, and federation manifesto.',
    execute() {
      return {
        content: [{ type: 'text', text: JSON.stringify({
          floors: FLOOR_DEFS,
          organs: ORGANS,
          manifesto: 'DITEMPA BUKAN DIBERI — Forged, Not Given. AI executes, humans decide. The constitution is law, not advice.'
        }, null, 2) }]
      };
    }
  }
];

export function Doctrine() {
  useWebMCP(doctrineTools);
  useEffect(() => { document.title = 'Doctrine — arifOS Constitution · Constellation · Manifesto'; }, []);
    document.querySelector('link[rel=canonical]')?.setAttribute('href','https://arif-fazil.com/doctrine');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Constitutional Law · Federation Topology · Sovereign Manifesto</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />Doctrine
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed mb-8">
            The immutable bedrock of arifOS. Not philosophy, not prose — fixed law:
            physics axioms, constitutional floors, federation topology, and the sovereign compact
            that every organ, agent, and workflow must obey.
          </p>
        </div>
      </section>

      {/* 13 FLOORS */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">F1–F13 · Constitutional Floors</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">The Constitution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FLOOR_DEFS.map((f) => (
              <div key={f.id} className="brutalist-card flex items-start gap-4">
                <span className="font-mono text-2xl font-black text-forge-orange shrink-0 w-12">{f.id}</span>
                <div>
                  <span className="font-bold text-forge-white">{f.name}</span>
                  <p className="font-body text-sm text-forge-dim mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEDERATION TOPOLOGY */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">ΔΩΨ · Federation Constellation</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">The Organs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORGANS.map((o) => (
              <div key={o.name} className="brutalist-card">
                <div className={`font-mono text-xs uppercase tracking-widest mb-2 ${
                  o.ring === 'MIND' ? 'text-[#00D4AA]' : o.ring === 'BODY' ? 'text-[#D4A853]' : 'text-[#7C6FD4]'
                }`}>{o.ring}</div>
                <h3 className="text-2xl font-black uppercase mb-2">{o.name}</h3>
                <p className="font-body text-sm text-forge-dim mb-2">{o.role}</p>
                <p className="font-mono text-xs text-forge-dim">:{o.port}</p>
                <p className="font-mono text-xs text-forge-orange mt-1">Never: {o.must_never}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24">
        <div className="site-frame">
          <div className="section-label">Sovereign Compact</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">Manifesto</h2>
          <div className="max-w-3xl space-y-6 text-forge-dim leading-relaxed">
            <p className="text-xl font-bold text-forge-white">DITEMPA BUKAN DIBERI — Forged, Not Given.</p>
            <p>AI executes. Humans decide. The constitution is law, not advice.</p>
            <p>Every action is reversible, evidence-labeled, and hash-chained. No agent judges its own action. No tool bypasses the chain.</p>
            <p>The federation has three laws:</p>
            <ul className="list-disc pl-6 space-y-2 font-body">
              <li>Never let the forge outrun the kernel.</li>
              <li>Never let the kernel operate without AAA visibility.</li>
              <li>Never let AAA pretend to be judge or hand.</li>
            </ul>
            <p className="italic mt-8">Three rings. One sovereign. F13 is final.</p>
          </div>

          {/* Doorway to arifOS kernel */}
          <div className="mt-16 text-center border-t border-forge-iron pt-12">
            <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-4">Run the Kernel</p>
            <h3 className="text-2xl font-black uppercase italic mb-6">Observe the Constitution in Action</h3>
            <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 border-2 border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-forge-black transition-colors">
              Open arifOS Observatory ↗
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
