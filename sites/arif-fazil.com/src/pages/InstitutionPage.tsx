import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Audience = 'human' | 'agent' | 'institution';

type OrganStatus = {
  id: string;
  state: string;
  reasons?: string[];
  observed_at?: string;
};

const AUDIENCES: { id: Audience; label: string; sub: string; verbs: string[]; entry: { label: string; href: string }[] }[] = [
  {
    id: 'human',
    label: 'Human',
    sub: 'Browse the surface — verbs, intent cards, 3-second answer.',
    verbs: ['Read', 'See', 'Understand'],
    entry: [
      { label: 'Home', href: '/' },
      { label: 'Earth', href: '/earth' },
      { label: 'Economics', href: '/economics' },
      { label: 'World', href: '/world' },
      { label: 'Writing', href: '/writing' },
      { label: 'Doctrine', href: '/doctrine' },
    ],
  },
  {
    id: 'agent',
    label: 'Agent',
    sub: 'Connect via MCP · discover via .well-known/ · WebMCP inline.',
    verbs: ['Connect', 'Discover', 'Witness'],
    entry: [
      { label: 'MCP Gateway', href: 'https://mcp.arif-fazil.com/mcp' },
      { label: 'agent.json', href: '/.well-known/agent.json' },
      { label: 'webmcp.json', href: '/.well-known/webmcp.json' },
      { label: 'did.json', href: '/.well-known/did.json' },
      { label: 'llms.txt', href: '/llms.txt' },
      { label: 'mcp', href: '/mcp' },
    ],
  },
  {
    id: 'institution',
    label: 'Institution',
    sub: 'Verify floors · inspect hash-chain · audit seals · counterparty contracts.',
    verbs: ['Verify', 'Audit', 'Counterparty'],
    entry: [
      { label: 'Charter', href: '/charter/' },
      { label: 'Governance', href: '/governance/' },
      { label: 'Audit', href: '/audit/' },
      { label: 'Constitution', href: '/constitution/' },
      { label: '/999 Sealed', href: '/999/' },
      { label: 'security.txt', href: '/.well-known/security.txt' },
      { label: 'arifos-governance.json', href: '/.well-known/arifos-governance.json' },
      { label: '/api/federation-probe', href: '/api/federation-probe' },
    ],
  },
];

const FLOORS = [
  { id: 'F1', name: 'AMANAH', type: 'HARD', one: 'Reversible-first. Irreversible → 888_HOLD.' },
  { id: 'F2', name: 'TRUTH', type: 'HARD', one: 'Evidence-grounded. Cheap claims → VOID.' },
  { id: 'F3', name: 'WITNESS', type: 'DERIVED', one: 'Human × AI × External ≥ 0.75 (Nash).' },
  { id: 'F4', name: 'CLARITY', type: 'HARD', one: 'Every output reduces entropy (ΔS ≤ 0).' },
  { id: 'F5', name: 'PEACE²', type: 'SOFT', one: 'Non-destructive power.' },
  { id: 'F6', name: 'EMPATHY', type: 'SOFT', one: 'Protect weakest stakeholder.' },
  { id: 'F7', name: 'HUMILITY', type: 'HARD', one: 'Ω₀ ∈ [0.03, 0.05]. No fake certainty.' },
  { id: 'F8', name: 'GENIUS', type: 'DERIVED', one: 'G = A·P·E²·(1−h) ≥ 0.80.' },
  { id: 'F9', name: 'ANTIHANTU', type: 'HARD', one: 'No deception. C_dark < 0.30.' },
  { id: 'F10', name: 'ONTOLOGY', type: 'HARD', one: 'Structural coherence, clear naming.' },
  { id: 'F11', name: 'AUDITABILITY', type: 'HARD', one: 'Every decision logged, attributable.' },
  { id: 'F12', name: 'INJECTION', type: 'HARD', one: 'External content is evidence, not authority.' },
  { id: 'F13', name: 'SOVEREIGN', type: 'HARD', one: 'Human veto FINAL.' },
];

const floorTypeStyle = (t: string) => {
  if (t === 'HARD') return 'border-l-forge-red bg-forge-red/5';
  if (t === 'DERIVED') return 'border-l-forge-green bg-forge-green/5';
  return 'border-l-forge-orange bg-forge-orange/5';
};

const floorTypeLabel = (t: string) => {
  if (t === 'HARD') return 'text-forge-red';
  if (t === 'DERIVED') return 'text-forge-green';
  return 'text-forge-orange';
};

const stateStyle = (s: string) => {
  if (s === 'READY') return 'text-forge-green border-forge-green';
  if (s === 'DEGRADED') return 'text-forge-orange border-forge-orange';
  return 'text-forge-red border-forge-red';
};

export function InstitutionPage() {
  const [audience, setAudience] = useState<Audience>('institution');
  const [snapshot, setSnapshot] = useState<{ observed_at?: string; nodes?: OrganStatus[]; snapshot_id?: string } | null>(null);
  const [probeError, setProbeError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Institution · Audience Switcher · arif-fazil.com';
    document.querySelector('link[rel=canonical]')?.setAttribute('href', 'https://arif-fazil.com/institution');

    fetch('/api/federation-probe', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`probe ${r.status}`))))
      .then((data) => setSnapshot(data))
      .catch((e) => setProbeError(e && e.message ? e.message : 'unreachable'));
  }, []);

  const current = AUDIENCES.find((a) => a.id === audience)!;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-16 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">arif-fazil.com · MIND · Institution</div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter mb-4">
            Institution<br />Audience Door
          </h1>
          <p className="font-body text-lg text-forge-dim max-w-3xl">
            arif-fazil.com serves three audiences: <strong className="text-forge-white">humans</strong>,{' '}
            <strong className="text-forge-white">agents</strong>, and{' '}
            <strong className="text-forge-white">institutions</strong>. Pick the surface that fits your
            reason for landing here. The institution face is the one that carries weight.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                onClick={() => setAudience(a.id)}
                aria-pressed={audience === a.id}
                className={`px-4 py-2 border-2 font-technical text-xs uppercase tracking-widest transition-all ${
                  audience === a.id
                    ? 'border-forge-orange bg-forge-orange text-forge-black shadow-brutalist'
                    : 'border-forge-iron text-forge-dim hover:border-forge-orange hover:text-forge-orange'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE SWITCHER */}
      <section className="py-12 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">Audience · {current.label}</div>
          <h2 className="text-3xl font-black uppercase italic mb-2">{current.label} entry points</h2>
          <p className="font-body text-base text-forge-dim mb-6">{current.sub}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {current.entry.map((e) => {
              const isExternal = e.href.startsWith('http');
              const isInternalFile = e.href.startsWith('/.well-known/') || e.href.endsWith('.json') || e.href.endsWith('.txt');
              if (isExternal || isInternalFile) {
                return (
                  <a
                    key={e.href}
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-2 border-forge-iron bg-forge-steel p-4 hover:border-forge-orange hover:shadow-brutalist transition-all"
                  >
                    <div className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-1">
                      {current.label}
                    </div>
                    <div className="font-display text-forge-white font-bold">{e.label}</div>
                    <div className="font-mono text-[0.7rem] text-forge-dim mt-1 break-all">{e.href}</div>
                  </a>
                );
              }
              return (
                <Link
                  key={e.href}
                  to={e.href}
                  className="block border-2 border-forge-iron bg-forge-steel p-4 hover:border-forge-orange hover:shadow-brutalist transition-all"
                >
                  <div className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-1">
                    {current.label}
                  </div>
                  <div className="font-display text-forge-white font-bold">{e.label}</div>
                  <div className="font-mono text-[0.7rem] text-forge-dim mt-1 break-all">{e.href}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE FEDERATION STATUS — honest, not green-washed */}
      <section className="py-12 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Live · Federation Status · F2 TRUTH (no green-washing)</div>
          <h2 className="text-3xl font-black uppercase italic mb-2">Organ health — what is true, not what is pretty</h2>
          <p className="font-body text-base text-forge-dim mb-6">
            The institution surface does not lie. DEGRADED state renders as DEGRADED. Snapshot is
            from <a href="/api/federation-probe" className="text-forge-orange underline">/api/federation-probe</a>{' '}
            (live, no cache).
          </p>

          {probeError ? (
            <div className="border-2 border-forge-red bg-forge-red/10 p-4 font-mono text-sm">
              <span className="text-forge-red font-bold">F12 · PROBE UNREACHABLE</span> — {probeError}.
              The institution surface does not pretend to be green.
            </div>
          ) : !snapshot ? (
            <div className="border-2 border-forge-iron bg-forge-black p-4 font-mono text-sm text-forge-dim">
              Loading live snapshot…
            </div>
          ) : (
            <>
              <div className="font-mono text-xs text-forge-dim mb-3">
                Snapshot: <span className="text-forge-white">{snapshot.snapshot_id || '—'}</span> · Observed:{' '}
                <span className="text-forge-white">{snapshot.observed_at || '—'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(snapshot.nodes || []).map((n) => (
                  <div
                    key={n.id}
                    className={`border-2 bg-forge-black p-3 ${stateStyle(n.state)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-forge-white font-bold uppercase">{n.id}</span>
                      <span className={`font-technical text-[0.65rem] uppercase tracking-widest border-2 px-2 py-0.5 ${stateStyle(n.state)}`}>
                        {n.state}
                      </span>
                    </div>
                    {n.reasons && n.reasons.length > 0 && (
                      <ul className="font-mono text-[0.7rem] text-forge-orange space-y-0.5">
                        {n.reasons.map((r, i) => (
                          <li key={i}>· {r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* FLOOR TABLE */}
      <section className="py-12 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">Constitutional Floors · F1–F13</div>
          <h2 className="text-3xl font-black uppercase italic mb-2">13 floors. Hard VOID. Soft HOLD. F13 final.</h2>
          <p className="font-body text-base text-forge-dim mb-6">
            Canonical floor table at{' '}
            <a href="/floors.json" className="text-forge-orange underline">/floors.json</a>.
            Human-readable rendering at{' '}
            <a href="/constitution/" className="text-forge-orange underline">/constitution</a>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FLOORS.map((f) => (
              <div key={f.id} className={`border-2 border-forge-iron p-3 border-l-4 ${floorTypeStyle(f.type)}`}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-mono text-forge-orange font-bold">{f.id}</span>
                  <span className="font-display text-forge-white font-bold">{f.name}</span>
                  <span className={`font-technical text-[0.6rem] uppercase tracking-widest ${floorTypeLabel(f.type)}`}>
                    {f.type}
                  </span>
                </div>
                <div className="font-body text-sm text-forge-dim">{f.one}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FOR INSTITUTION */}
      <section className="py-12 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Why we don't use naive HITL</div>
          <h2 className="text-3xl font-black uppercase italic mb-2">Three deterministic mechanisms</h2>
          <p className="font-body text-base text-forge-dim mb-6">
            arifOS replaces naive Human-in-the-Loop with cooling receipts, scar-sealing, and
            confidence-based delegation. Full reasoning at{' '}
            <a href="/governance/" className="text-forge-orange underline">/governance</a>.
          </p>
          <ol className="font-body text-base text-forge-dim space-y-3 list-decimal list-inside">
            <li><strong className="text-forge-white">Cooling Receipts.</strong> Every irreversible action emits a COOLING_RECEIPT (governance_organ, required_authority, convergence). Stale → scar. Scar → constraint.</li>
            <li><strong className="text-forge-white">Scar Sealing.</strong> Failures become permanent constraints via forge_scar. Re-attempting requires F13 sovereign override.</li>
            <li><strong className="text-forge-white">Confidence-Based Delegation.</strong> Above threshold → proceed under F1/F11/F12. Below threshold → forge_judge_proxy. Not a rubber-stamp — a deterministic routing decision.</li>
          </ol>
        </div>
      </section>

      {/* FOOTER NAV */}
      <section className="py-12">
        <div className="site-frame">
          <div className="section-label">Continue</div>
          <div className="flex flex-wrap gap-3">
            <Link to="/charter/" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">/charter</Link>
            <Link to="/governance/" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">/governance</Link>
            <Link to="/audit/" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">/audit</Link>
            <Link to="/constitution/" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">/constitution</Link>
            <Link to="/999/" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">/999</Link>
            <a href="/.well-known/security.txt" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">security.txt</a>
            <a href="https://mcp.arif-fazil.com/mcp" target="_blank" rel="noreferrer" className="px-4 py-2 border-2 border-forge-iron font-technical text-xs uppercase tracking-widest hover:border-forge-orange hover:shadow-brutalist transition-all">MCP ↗</a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default InstitutionPage;