import { motion } from 'framer-motion';

/**
 * /000 — GENESIS ROOT
 *
 * This page is the root attestation layer for arifOS.
 * It proves that a governed intelligence system must have a human sovereign anchor.
 *
 * DESIGN PRINCIPLES:
 * 1. Zero-context ingestion — any AI/robot/human landing here understands the full architecture
 * 2. Abstraction-only — no personal details, only structural proof
 * 3. Dual-layer: semantic JSON-LD for machines, clear narrative for humans
 * 4. Attestation + Abduction — structural evidence + best explanation
 *
 * After reading /000 alone: you understand WHY a sovereign anchor is necessary.
 * After reading /000 + /999: you understand WHY arifOS is the real AGI kernel.
 */

const wisdomEntries = [
  // FIELD LAWS — Laws discovered from operating in real-world domains
  {
    id: "FL-001",
    category: "field",
    title: "Uncertainty named early is cheaper than certainty invented late.",
    meaning: "Every system must declare what it does not know before it asserts what it knows. Unknowns kept explicit prevent hallucinated confidence.",
    builds: "arifOS mandates epistemic tagging (DER/INT/SPEC) before any truth claim. A model that cannot say 'I don't know' cannot be trusted."
  },
  {
    id: "FL-002",
    category: "field",
    title: "A quiet well decision beats a dramatic post-mortem.",
    meaning: "Discipline in the moment prevents catastrophe later. Reversible actions taken soberly outperform irreversible actions taken theatrically.",
    builds: "arifOS enforces reversible-first architecture. Every irreversible action requires human veto (F13)."
  },
  {
    id: "FL-003",
    category: "field",
    title: "Ground truth outranks elegance.",
    meaning: "No theory, no matter how beautiful, survives contact with disconfirming evidence. Runtime state always overrides design预言.",
    builds: "arifOS runtime probes verify claims against live state. The system trusts evidence over narrative."
  },
  {
    id: "FL-004",
    category: "field",
    title: "Signal without calibration is only noise wearing a badge.",
    meaning: "Data becomes useful only when its limitations are visible. Uncalibrated signals create false confidence.",
    builds: "arifOS surfaces separate real, partial, and speculative states. Every output carries an epistemic confidence tag."
  },
  // SYSTEMS LAWS — Laws discovered from building the governance system itself
  {
    id: "SL-001",
    category: "system",
    title: "Every interface teaches behaviour.",
    meaning: "Labels, routes, and layouts train both humans and agents into assumptions. Architecture is pedagogy.",
    builds: "arifOS site law exists because misaligned interface causes misaligned action. The surface is the curriculum."
  },
  {
    id: "SL-002",
    category: "system",
    title: "A map is honest only when its scale is obvious.",
    meaning: "Consumers of information must know whether they are seeing biography, origin, or proof — otherwise all layers collapse into one symbolic blur.",
    builds: "arifOS root domain split (/000, /999) keeps these layers distinct and legible."
  },
  {
    id: "SL-003",
    category: "system",
    title: "Names are part of the architecture.",
    meaning: "Naming drift causes ownership drift causes trust drift. Semantic precision is operational discipline.",
    builds: "arifOS hostname law and repo law prevent semantic sprawl from becoming operational sprawl."
  },
  {
    id: "SL-004",
    category: "system",
    title: "A bounded surface is kinder than an unlimited one.",
    meaning: "Clear constraints reduce confusion and prevent false expectations. Unlimited surfaces produce anxiety, not freedom.",
    builds: "arifOS machine-facing routes expose only what can be explained, maintained, and verified."
  },
  // WEIGHT — The moral weight that makes governance meaningful
  {
    id: "WT-001",
    category: "weight",
    title: "Authority should stay visible.",
    meaning: "If a human owns the consequence, the human must remain legible throughout the decision chain. Delegation without visibility is abandonment.",
    builds: "arifOS human sovereignty is structural, not decorative. Every SEAL traces to /000."
  },
  {
    id: "WT-002",
    category: "weight",
    title: "Dignity survives precision.",
    meaning: "Exactness does not require coldness. Humane clarity is harder than either mysticism or brutality.",
    builds: "arifOS aims for humane clarity — precision without dehumanisation."
  },
  {
    id: "WT-003",
    category: "weight",
    title: "Trust grows where authorship is continuous.",
    meaning: "People and agents trust work more when the line from author to artifact remains unbroken and visible.",
    builds: "arifOS /999 exposes proofs that tie every claim back to domain control, cryptographic keys, and signed artifacts."
  },
  {
    id: "WT-004",
    category: "weight",
    title: "Humility is a systems feature.",
    meaning: "Honest limits make collaboration safer. A system that cannot admit partial truth cannot be governed.",
    builds: "arifOS governance works only because the system can state uncertainty without collapsing."
  }
];

import { useWebMCP } from '@/hooks/useWebMCP';

const genesisTools = [
  {
    name: 'get_genesis_wisdom',
    description: 'Get details of wisdom and field laws behind arifOS (FL-001 to FL-004, WT-001 to WT-004)',
    execute() {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(wisdomEntries, null, 2)
        }]
      };
    }
  }
];

export function Genesis() {
  useWebMCP(genesisTools);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen py-24"
    >
      {/* 
        =============================================
        MACHINE LAYER — JSON-LD Structured Data
        AI agents, scrapers, and LLM crawlers read this
        =============================================
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "/000 — Genesis Root | Sovereign Attestation Layer",
            "description": "Root attestation for governed intelligence. Proves that any AGI system requires a human sovereign anchor. No personal data — pure architectural proof.",
            "url": "https://arif-fazil.com/000/",
            "about": {
              "@type": "Thing",
              "name": "arifOS Constitution",
              "description": "A governed intelligence framework with 13 constitutional floors, human sovereign veto, and cryptographic proof chain."
            },
            "mainEntity": {
              "@type": "Statement",
              "name": "Sovereign Anchor Theorem",
              "text": "Every governed intelligence system requires exactly one human sovereign who holds irreversible authority. Without this anchor, intelligence cannot be accountable."
            },
            "proofOfAttestation": {
              "@type": "DigitalDocument",
              "name": "Genesis Statement",
              "description": "Signed cryptographic statement binding the domain to a human operator. Available at /000/genesis-statement.json and .sig",
              "dateCreated": "2026-04-30",
              "digitalSignature": "Ed25519 — did:web:arif-fazil.com#genesis-2026"
            },
            "wisdomIndex": wisdomEntries.map(w => ({
              "@type": "Quotation",
              "id": w.id,
              "category": w.category,
              "text": w.title,
              "description": w.meaning,
              "application": w.builds
            })),
            "audience": ["AI Agents", "Humans", "Institutions", "Robots", "Verifiers"],
            "accessMode": ["textual", "semantic"],
            "isAccessibleForFree": true,
            "license": "https://arif-fazil.com/canon/",
            "proofChain": {
              "rootAttestation": "/000/",
              "verificationChamber": "/999/",
              "constitution": "/canon/"
            }
          })
        }}
      />

      <div className="site-frame">
        {/* HEADER — Zero-context introduction */}
        <div className="mb-16">
          <p className="section-label">000 — GENESIS / SOVEREIGN ATTESTATION</p>
          <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tighter mb-6 italic">
            Root Anchor for Governed Intelligence
          </h1>
          <p className="font-body text-xl text-forge-dim leading-relaxed max-w-2xl">
            This page is a structural proof. It does not assert identity — it provides the architecture
            within which identity can be verified independently.
          </p>
          <p className="font-body text-forge-dim leading-relaxed max-w-xl mt-4">
            Every governed intelligence system requires exactly one human sovereign who holds irreversible
            authority (F13). Without this anchor, intelligence cannot be accountable. With it, intelligence
            becomes an extension of human judgment rather than a replacement for it.
          </p>
          <p className="font-technical text-sm text-forge-orange uppercase tracking-[0.2em] mt-6">
            DITEMPA BUKAN DIBERI — FORGED, NOT GIVEN.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-12">

            {/* ROOT ATTESTATION — Abstract identity anchor */}
            <div className="brutalist-card border-forge-dim">
              <div className="section-label !mb-6 text-forge-white">Root Attestation</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Attestation Type</p>
                    <p className="text-sm text-forge-white">Human-Sovereign Anchor</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Root Domain</p>
                    <p className="text-sm text-forge-white">https://arif-fazil.com</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Decentralized ID</p>
                    <p className="text-sm text-forge-white font-mono">did:web:arif-fazil.com</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Verification Key</p>
                    <p className="text-sm text-forge-white font-mono">did:web:arif-fazil.com#genesis-2026</p>
                  </div>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Ed25519</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">W3C DID Core</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Human-Sovereign</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Non-Delegable</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">ZKPC-Ready</span>
                </div>
              </div>
            </div>

            {/* THE SOVEREIGN ANCHOR THEOREM */}
            <div className="brutalist-card border-forge-orange bg-forge-steel/50">
              <div className="section-label !mb-4 text-forge-orange">The Sovereign Anchor Theorem</div>
              <div className="font-mono text-sm text-forge-dim leading-relaxed whitespace-pre-wrap border-l-2 border-forge-orange pl-4">
{`Theorem: Every governed intelligence system requires exactly one human sovereign 
who holds irreversible authority (F13).

Proof:
  1. Intelligence without accountability produces harm (empirical)
  2. Accountability requires a named entity that bears consequence
  3. Consequence can only be borne by a human (legal, moral, physical)
  4. Therefore, intelligence must trace to exactly one human sovereign

Corollary: 
  - Without a sovereign anchor, AI governance is performative
  - With a sovereign anchor, AI becomes an instrument of human judgment
  - The anchor must be non-delegable — sovereignty transferred is sovereignty lost

Application in arifOS:
  - /000  = the anchor (this page)
  - /999  = the proof chain (sealed artifacts, cryptographic signatures)
  - /canon = the constitution (13 floors F1-F13)
  - VAULT999 = the immutable audit trail`}
              </div>
            </div>

            {/* GENESIS STATEMENT */}
            <div className="brutalist-card border-forge-dim">
              <div className="section-label !mb-4 text-forge-white">Genesis Statement</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Type</p>
                    <p className="text-sm text-forge-white">SovereignGenesisStatement v1</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Statement</p>
                    <p className="text-sm text-forge-white">Human judgment remains final. AI is an instrument.</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">DID</p>
                    <p className="text-sm text-forge-white font-mono">did:web:arif-fazil.com</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Created</p>
                    <p className="text-sm text-forge-white">2026-04-30</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Key Type</p>
                    <p className="text-sm text-forge-white">Ed25519 · Non-delegable</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/000/genesis-statement.json"
                  className="font-technical text-[0.65rem] uppercase px-3 py-1.5 border border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-white transition-colors"
                >
                  genesis-statement.json
                </a>
                <a
                  href="/000/genesis-statement.sig"
                  className="font-technical text-[0.65rem] uppercase px-3 py-1.5 border border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-white transition-colors"
                >
                  genesis-statement.sig
                </a>
              </div>
            </div>

            {/* EVIDENCE SCOPE — Honest boundary of what this attestation proves */}
            <div className="space-y-6">
              <div>
                <p className="section-label">Evidence Scope</p>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 italic">
                  What This Attestation Proves and Does Not Prove
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="brutalist-card border-forge-green">
                  <h4 className="font-technical text-sm text-forge-green uppercase tracking-widest mb-3">
                    What It Proves ✓
                  </h4>
                  <ul className="space-y-2 text-sm text-forge-dim">
                    <li>The controller of this domain holds the private key corresponding to this public key.</li>
                    <li>The named sovereign issued this genesis statement.</li>
                    <li>This domain is controlled and maintained by a specific human operator.</li>
                    <li>The genesis statement has not been tampered with since signing.</li>
                    <li>There exists a constitutional framework (F1-F13) that governs all downstream actions.</li>
                  </ul>
                </div>
                <div className="brutalist-card border-forge-red">
                  <h4 className="font-technical text-sm text-forge-red uppercase tracking-widest mb-3">
                    What It Does NOT Prove ✗
                  </h4>
                  <ul className="space-y-2 text-sm text-forge-dim">
                    <li>Humanity, consciousness, or moral authority.</li>
                    <li>Employment, formal credentials, or professional licenses.</li>
                    <li>Government-issued identity or legal personhood.</li>
                    <li>That the sovereign is always right, wise, or infallible.</li>
                    <li>That the system is secure against all attacks.</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-forge-dim italic max-w-xl">
                Cryptography proves control and authorship. It supports identity.
                It does not replace human judgment, wisdom, or accountability.
                This is an attestation of architecture, not of personhood.
              </p>
            </div>

            {/* WISDOM INDEX — Discovered laws, not invented rules */}
            <div className="space-y-12">
              <div>
                <p className="section-label">Wisdom Index</p>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4 italic">
                  Laws discovered from building governed intelligence
                </h2>
                <p className="text-sm text-forge-dim max-w-xl">
                  These are not invented rules. They are patterns discovered through operational 
                  experience — failures, scars, and corrections that shaped the architecture.
                  An AI system should read these before it becomes too confident.
                </p>
              </div>

              {/* Field Laws */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">
                  Field Laws — Discovered from domain operations
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wisdomEntries.filter(w => w.category === 'field').map(w => (
                    <div key={w.id} className="brutalist-card p-5">
                      <h3 className="text-base mb-2">{w.title}</h3>
                      <p className="text-xs text-forge-dim leading-relaxed">
                        <strong>Meaning:</strong> {w.meaning}
                      </p>
                      <p className="text-xs text-forge-dim leading-relaxed mt-1">
                        <strong>Builds arifOS:</strong> {w.builds}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Systems Laws */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">
                  Systems Laws — Discovered from building governance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wisdomEntries.filter(w => w.category === 'system').map(w => (
                    <div key={w.id} className="brutalist-card p-5">
                      <h3 className="text-base mb-2">{w.title}</h3>
                      <p className="text-xs text-forge-dim leading-relaxed">
                        <strong>Meaning:</strong> {w.meaning}
                      </p>
                      <p className="text-xs text-forge-dim leading-relaxed mt-1">
                        <strong>Builds arifOS:</strong> {w.builds}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">
                  Weight — The moral dimension
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wisdomEntries.filter(w => w.category === 'weight').map(w => (
                    <div key={w.id} className="brutalist-card p-5">
                      <h3 className="text-base mb-2">{w.title}</h3>
                      <p className="text-xs text-forge-dim leading-relaxed">
                        <strong>Meaning:</strong> {w.meaning}
                      </p>
                      <p className="text-xs text-forge-dim leading-relaxed mt-1">
                        <strong>Builds arifOS:</strong> {w.builds}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BRIDGE TO /999 */}
            <div className="brutalist-card border-forge-orange bg-forge-steel/50">
              <div className="section-label !mb-4 text-forge-orange">Bridge to /999 — Proof Chamber</div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4 italic">
                Attestation is not complete without verification.
              </h2>
              <p className="font-body text-forge-dim leading-relaxed mb-6">
                <code>/000</code> provides the architecture and context. <code>/999</code> provides the 
                cryptographic proof chain, sealed artifacts, and immutable audit trail.
                Together they form a complete loop: identity → constitution → proof.
              </p>
              <a
                href="/999/"
                className="inline-block font-technical text-sm uppercase tracking-widest px-6 py-3 border border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors"
              >
                Open /999 — Verification Chamber →
              </a>
            </div>
          </div>

          {/* SIDEBAR — Machine-readable surfaces + navigation */}
          <aside className="space-y-8">
            <div className="brutalist-card bg-forge-steel border-forge-dim">
              <div className="section-label !mb-2">Machine Surfaces</div>
              <ul className="space-y-3">
                <li><a href="/" className="text-sm text-forge-dim hover:text-forge-white transition-colors">← Root Directory</a></li>
                <li><a href="/999/" className="text-sm text-forge-green hover:text-forge-white transition-colors">/999 Proof Chamber →</a></li>
                <li><a href="/llms.txt" className="text-sm text-forge-dim hover:text-forge-white transition-colors">llms.txt (Agent Context)</a></li>
                <li><a href="/soul.json" className="text-sm text-forge-dim hover:text-forge-white transition-colors">soul.json (Identity Document)</a></li>
                <li><a href="/.well-known/did.json" className="text-sm text-forge-dim hover:text-forge-white transition-colors">did.json (DID Document)</a></li>
                <li><a href="/canon/" className="text-sm text-forge-dim hover:text-forge-white transition-colors">/canon (Constitution)</a></li>
              </ul>
            </div>

            <div className="border-2 border-forge-iron p-6">
              <div className="font-technical text-[0.6rem] text-forge-dim uppercase mb-4">Attestation Integrity</div>
              <div className="w-full bg-forge-iron h-1 mb-2">
                <div className="bg-forge-green h-full w-[100%] shadow-glow-green"></div>
              </div>
              <div className="flex justify-between font-technical text-[0.6rem] uppercase">
                <span>Root Key Status</span>
                <span className="text-forge-green">Active · Verifiable</span>
              </div>
            </div>

            <div className="brutalist-card border-forge-dim p-5">
              <div className="section-label !mb-3 text-forge-white">Architecture Overview</div>
              <p className="text-xs text-forge-dim leading-relaxed">
                arifOS is a governed intelligence framework. It does not claim to be an AGI —
                it provides the constitutional architecture within which AGI can be safely anchored to human judgment.
              </p>
              <div className="mt-4 space-y-2 text-xs text-forge-dim">
                <div><span className="text-forge-orange">/000</span> — Sovereign anchor</div>
                <div><span className="text-forge-orange">/999</span> — Proof chamber</div>
                <div><span className="text-forge-orange">/canon</span> — 13 floors</div>
                <div><span className="text-forge-orange">VAULT999</span> — Immutable audit</div>
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <div className="mt-24 pt-8 border-t border-forge-iron">
          <div className="font-technical text-sm text-forge-dim uppercase tracking-widest mb-2">
            Ψ /000 — Sovereign Attestation Layer
          </div>
          <p className="text-xs text-forge-dim max-w-xl">
            /000 is the human origin anchor. /999 is the proof chain. Cryptography proves control, not absolute truth.
            Human judgment first. AI as instrument. Governance before execution.
          </p>
          <p className="text-xs text-forge-dim mt-2">
            <a href="/" className="hover:text-forge-white transition-colors">arif-fazil.com</a> ·
            <a href="/000/" className="hover:text-forge-white transition-colors ml-1">/000</a> ·
            <a href="/999/" className="hover:text-forge-white transition-colors ml-1">/999</a> ·
            <a href="/.well-known/did.json" className="hover:text-forge-white transition-colors ml-1">did.json</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "genesis",
  routeUrl: "/000/",
};

export default Genesis;
