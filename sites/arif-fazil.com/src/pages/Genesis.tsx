import { motion } from 'framer-motion';

export function Genesis() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen py-24"
    >
      <div className="site-frame">
        {/* Header */}
        <div className="mb-16">
          <p className="section-label">000 — GENESIS / EXPERIMENT</p>
          <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tighter mb-6 italic">
            Muhammad Arif bin Fazil
          </h1>
          <p className="font-body text-xl text-forge-dim leading-relaxed max-w-2xl">
            Geoscientist. Builder of governed intelligence. Human judge behind arifOS.
          </p>
          <p className="font-body text-forge-dim leading-relaxed max-w-xl mt-4">
            I am the human root of this system. AI assists, drafts, reasons, and coordinates —
            but the human remains the final judge. This page anchors that identity in code,
            cryptography, and plain language.
          </p>
          <p className="font-technical text-sm text-forge-orange uppercase tracking-[0.2em] mt-6">
            DITEMPA BUKAN DIBERI — Forged, Not Given.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Root Identity */}
            <div className="brutalist-card border-forge-dim">
              <div className="section-label !mb-6 text-forge-white">Root Identity</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Human</p>
                    <p className="text-sm text-forge-white">Muhammad Arif bin Fazil</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Root Domain</p>
                    <p className="text-sm text-forge-white">https://arif-fazil.com</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Root DID</p>
                    <p className="text-sm text-forge-white font-mono">did:web:arif-fazil.com</p>
                  </div>
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">RootKey</p>
                    <p className="text-sm text-forge-white font-mono">did:web:arif-fazil.com#genesis-2026</p>
                  </div>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Ed25519</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">W3C DID Core</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Human-sovereign</span>
                  <span className="font-technical text-[0.6rem] uppercase px-2 py-1 border border-forge-iron text-forge-dim">Non-delegable</span>
                </div>
              </div>
            </div>

            {/* Human Statement */}
            <div className="brutalist-card border-forge-orange bg-forge-steel/50">
              <div className="section-label !mb-4 text-forge-orange">Human Statement</div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4 italic">
                I am the human judge behind arifOS.
              </h2>
              <div className="font-mono text-sm text-forge-dim leading-relaxed whitespace-pre-wrap border-l-2 border-forge-orange pl-4">
{`I am Muhammad Arif bin Fazil.

arifOS is a system I built to keep AI useful, auditable, and accountable to human judgment.

AI systems may assist, draft, test, and coordinate. They do not replace human responsibility. The human remains the final judge — not as a courtesy, but as a structural constraint.

This is not a claim of perfection. It is a commitment to discipline, evidence, and accountability.

The 13 constitutional floors exist because intelligence without constraint is dangerous.`}
              </div>
            </div>

            {/* Genesis Statement */}
            <div className="brutalist-card border-forge-dim">
              <div className="section-label !mb-4 text-forge-white">Genesis Statement</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-1">Type</p>
                    <p className="text-sm text-forge-white">ArifGenesisStatement v1</p>
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

            {/* Evidence Scope */}
            <div className="space-y-6">
              <div>
                <p className="section-label">Evidence Scope</p>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 italic">
                  What /000 Proves and Does Not Prove
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="brutalist-card border-forge-green">
                  <h4 className="font-technical text-sm text-forge-green uppercase tracking-widest mb-3">
                    What /000 Proves
                  </h4>
                  <ul className="space-y-2 text-sm text-forge-dim">
                    <li>The controller of this domain holds the private key corresponding to this public key.</li>
                    <li>The human named Muhammad Arif bin Fazil issued this genesis statement.</li>
                    <li>This domain is controlled and maintained by a specific human operator.</li>
                    <li>The genesis statement has not been tampered with since signing.</li>
                  </ul>
                </div>
                <div className="brutalist-card border-forge-red">
                  <h4 className="font-technical text-sm text-forge-red uppercase tracking-widest mb-3">
                    What /000 Does NOT Prove
                  </h4>
                  <ul className="space-y-2 text-sm text-forge-dim">
                    <li>Humanity, consciousness, or moral authority.</li>
                    <li>Employment, formal credentials, or professional licenses.</li>
                    <li>Government-issued identity or legal personhood.</li>
                    <li>That the human is always right, wise, or infallible.</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-forge-dim italic max-w-xl">
                Cryptography proves control and authorship. It supports identity.
                It does not replace human judgment, wisdom, or accountability.
              </p>
            </div>

            {/* Wisdom Wall */}
            <div className="space-y-12">
              <div>
                <p className="section-label">Wisdom Index</p>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4 italic">
                  Field laws, systems laws, and weight
                </h2>
                <p className="text-sm text-forge-dim max-w-xl">
                  The lessons that built arifOS. Write like a wall of notes an AI system should read before it becomes too confident.
                </p>
              </div>

              {/* Field Laws */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">Field Laws</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0001 — Uncertainty named early is cheaper than certainty invented late.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Good work starts by stating what is unknown before the story hardens.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Unknowns must stay explicit or the system starts to hallucinate confidence.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0002 — A quiet well decision beats a dramatic post-mortem.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Discipline matters more than performance when consequences are real.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Reversible, sober action outranks spectacle and platform theatrics.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0006 — Ground truth outranks elegance.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> A beautiful theory still loses if the evidence does not support it.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Proof and runtime state must override polished but unsupported claims.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0009 — Signal without calibration is only noise wearing a badge.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Data becomes useful only when its limitations are visible.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Public trust surfaces must separate real, partial, and speculative state.
                    </p>
                  </div>
                </div>
              </div>

              {/* Systems Laws */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">Systems Laws</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0003 — Every interface teaches behaviour.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Labels, routes, and layouts train people and agents into assumptions.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Site law exists because misaligned architecture causes misaligned action.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0005 — A map is honest only when its scale is obvious.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> People need to know whether they are seeing biography, origin, or proof.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> The root domain split keeps those layers from collapsing into one symbolic blur.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0008 — Names are part of the architecture.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> If naming drifts, ownership drifts, and trust drifts with it.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Hostname law and repo law prevent semantic sprawl from becoming operational sprawl.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0010 — A bounded surface is kinder than an unlimited one.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Clear constraints reduce confusion and prevent false expectations.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Machine-facing routes expose only what can be explained, maintained, and verified.
                    </p>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">Weight</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0004 — Authority should stay visible.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> If a human owns the consequence, the human must remain legible.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Human sovereignty is structural, not decorative.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0007 — Dignity survives precision.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Exactness does not require coldness, mysticism, or manipulation.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> The system aims for humane clarity rather than intimidation.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0011 — Trust grows where authorship is continuous.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> People trust work more when the line from author to artifact remains visible.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> /999 exposes proofs that tie claims back to domain control, credentials, and signed artifacts.
                    </p>
                  </div>
                  <div className="brutalist-card p-5">
                    <h3 className="text-base mb-2">0012 — Humility is a systems feature.</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      <strong>Meaning:</strong> Honest limits make collaboration safer and more useful.
                    </p>
                    <p className="text-xs text-forge-dim leading-relaxed mt-1">
                      <strong>Builds arifOS:</strong> Governance works only when the system can admit partial truth without collapsing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bridge to /999 */}
            <div className="brutalist-card border-forge-orange bg-forge-steel/50">
              <div className="section-label !mb-4 text-forge-orange">Bridge to /999</div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4 italic">
                Wisdom is not enough without verification.
              </h2>
              <p className="font-body text-forge-dim leading-relaxed mb-6">
                <code>/000</code> gives context and memory. <code>/999</code> gives evidence and proof.
                Context may guide behaviour, but evidence must govern truth claims.
              </p>
              <a
                href="/999/"
                className="inline-block font-technical text-sm uppercase tracking-widest px-6 py-3 border border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors"
              >
                Open /999 — Seal & Verification →
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="brutalist-card bg-forge-steel border-forge-dim">
              <div className="section-label !mb-2">Operational Links</div>
              <ul className="space-y-3">
                <li><a href="/" className="text-sm text-forge-dim hover:text-forge-white transition-colors">← Root Directory</a></li>
                <li><a href="/999/" className="text-sm text-forge-green hover:text-forge-white transition-colors">/999 Proof Chamber →</a></li>
                <li><a href="/llms.txt" className="text-sm text-forge-dim hover:text-forge-white transition-colors">llms.txt (Agent Context)</a></li>
                <li><a href="/soul.json" className="text-sm text-forge-dim hover:text-forge-white transition-colors">soul.json (Identity)</a></li>
                <li><a href="/.well-known/did.json" className="text-sm text-forge-dim hover:text-forge-white transition-colors">did.json</a></li>
              </ul>
            </div>

            <div className="border-2 border-forge-iron p-6">
              <div className="font-technical text-[0.6rem] text-forge-dim uppercase mb-4">Memory Integrity</div>
              <div className="w-full bg-forge-iron h-1 mb-2">
                <div className="bg-forge-green h-full w-[88%] shadow-glow-green"></div>
              </div>
              <div className="flex justify-between font-technical text-[0.6rem] uppercase">
                <span>Sync Status</span>
                <span className="text-forge-green">88% Synchronized</span>
              </div>
            </div>

            <div className="brutalist-card border-forge-dim p-5">
              <div className="section-label !mb-3 text-forge-white">Ψ SOUL · Canonical Human Anchor</div>
              <p className="text-xs text-forge-dim leading-relaxed">
                Arif Fazil is a Malaysian exploration geoscientist, AI systems architect, and creator of arifOS.
                He works primarily in offshore Malaysia, with a background tied to PETRONAS.
              </p>
              <p className="text-xs text-forge-dim leading-relaxed mt-3 italic border-l-2 border-forge-iron pl-3">
                "I am the human judge behind arifOS. AI assists, drafts, reasons, and coordinates — but the human remains the final judge."
              </p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-forge-iron">
          <div className="font-technical text-sm text-forge-dim uppercase tracking-widest mb-2">
            Ψ /000 — Genesis Human Identity
          </div>
          <p className="text-xs text-forge-dim max-w-xl">
            /000 is the human origin. /999 is the proof. Cryptography proves control, not absolute truth.
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
