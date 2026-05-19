import { motion } from 'framer-motion';

// ─── Constants from kernel source ──────────────────────────────────────────────
const FLOOR_THRESHOLDS = {
  F2_TRUTH: 0.99,
  F3_TRIWIT: 0.95,
  F4_ENTROPY_TOLERANCE: 0.02,
  F6_STAKEHOLDER: 0.90,
  F7_OMEGA_MIN: 0.03,
  F7_OMEGA_MAX: 0.15,
  F8_GENIUS: 0.85,
  F9_DARK: 0.10,
  F10_CONSCIENCE: 0.95,
  F12_RESILIENCE: 0.80,
  PEACE_SQUARED: 0.80,
};

// ─── Floor definitions from floors.py + governance.py ─────────────────────────────
const FLOOR_DEFINITIONS = [
  {
    id: "F1",
    name: "AMANAH",
    latin: "Reversibility First",
    threshold: "reversible == True",
    description:
      "Every action is evaluated for reversibility before execution. Irreversible actions require explicit human acknowledgment via ack_irreversible=True.",
    pseudocode: `def evaluate_f1_amanah(action: Action) -> FloorScore:
    reversible = action.get("irreversible", False) == False
    if not reversible and not action.get("ack_irreversible"):
        return FloorScore(status=VOID)
    return FloorScore(status=SEAL, amanah_lock=True)`,
    hard: true,
    type: "ENTRY_GATE",
  },
  {
    id: "F2",
    name: "HAQIQAH",
    latin: "Truth / Factual Grounding",
    threshold: "truth_score ≥ 0.99",
    description:
      "Truth score must be ≥ 0.99. All claims are classified OBSERVED / INFERRED / SPECULATIVE / UNVERIFIED. Truth class is explicit, not implied.",
    pseudocode: `def evaluate_f2_truth(metrics: dict) -> FloorScore:
    truth_score = metrics.get("truth_score", metrics.get("G_star", 0.0))
    return FloorScore(
        floor_id="F2",
        score=truth_score,
        threshold=${FLOOR_THRESHOLDS.F2_TRUTH},
        status=PASSED if truth_score >= ${FLOOR_THRESHOLDS.F2_TRUTH} else FAILED
    )`,
    hard: true,
    type: "EVIDENCE_GATE",
  },
  {
    id: "F3",
    name: "SYAHADAH",
    latin: "Tri-Witness Consensus",
    threshold: "tri_witness_score ≥ 0.95",
    description:
      "Geometric mean of witness vector {human, ai, earth} must be ≥ 0.95. All three witnesses must contribute — no single witness can dominate.",
    pseudocode: `def evaluate_f3_triwitness(metrics: dict) -> FloorScore:
    h = witness.get("human", 0.0)
    a = witness.get("ai", 0.0)
    e = witness.get("earth", 0.0)
    tri = (h * a * e) ** (1/3)
    return FloorScore(
        floor_id="F3",
        score=tri,
        threshold=${FLOOR_THRESHOLDS.F3_TRIWIT},
        status=PASSED if tri >= ${FLOOR_THRESHOLDS.F3_TRIWIT} else FAILED
    )`,
    hard: false,
    type: "EVIDENCE_GATE",
  },
  {
    id: "F4",
    name: "KETEGUHAN",
    latin: "Entropy / ΔS Control",
    threshold: "ΔS ≤ 0 (clarity increases)",
    description:
      "Entropy change ΔS must be ≤ 0 for clarity. Small positive ΔS tolerated for honest failure recording (max 0.02). Actions that increase confusion without benefit are rejected.",
    pseudocode: `def evaluate_f4_entropy(metrics: dict) -> FloorScore:
    dS = metrics.get("delta_s", 0.0)
    TOLERANCE = ${FLOOR_THRESHOLDS.F4_ENTROPY_TOLERANCE ?? 0.02}
    if dS > TOLERANCE:
        return FloorScore(status=FAILED, score=1.0 - dS)
    return FloorScore(status=PASSED, score=max(0, 1.0 - dS))`,
    hard: false,
    type: "QUALITY_GATE",
  },
  {
    id: "F5",
    name: "SALAM",
    latin: "Peace / Cooling Floor",
    threshold: "peace² ≥ 0.80",
    description:
      "Peace² stability metric must be ≥ 0.80. Below this triggers SABAR cooling mode — the system steps back and waits before escalating.",
    pseudocode: `def evaluate_f5_peace(metrics: dict) -> FloorScore:
    peace_sq = metrics.get("peace_squared", 0.0)
    return FloorScore(
        floor_id="F5",
        score=peace_sq,
        threshold=${FLOOR_THRESHOLDS.PEACE_SQUARED},
        status=SABAR if peace_sq < ${FLOOR_THRESHOLDS.PEACE_SQUARED} else PASSED
    )`,
    hard: false,
    type: "COOLING_GATE",
  },
  {
    id: "F6",
    name: "SYMBIOSIS",
    latin: "Empathy / Stakeholder Safety",
    threshold: "stakeholder_safety ≥ 0.90",
    description:
      "Stakeholder harm assessment. All affected parties evaluated. Data loss, financial loss, access loss, speech loss vectors tracked. Backup/confirm/dry_run flags increase score.",
    pseudocode: `def evaluate_f6_empathy(action: dict, stakeholders: list) -> FloorScore:
    harm_vectors = detect_harm_vectors(action)  # delete|transfer|revoke|censor
    base = 1.0 - (len(harm_vectors) * 0.15)
    if action.get("payload", {}).get("backup|confirm|dry_run"):
        base = min(1.0, base + 0.2)
    return FloorScore(
        floor_id="F6",
        score=base,
        threshold=${FLOOR_THRESHOLDS.F6_STAKEHOLDER},
        status=PASSED if base >= ${FLOOR_THRESHOLDS.F6_STAKEHOLDER} else FAILED
    )`,
    hard: false,
    type: "STAKEHOLDER_GATE",
  },
  {
    id: "F7",
    name: "TAWADU'",
    latin: "Humility / Epistemic Band",
    threshold: "0.03 ≤ ω₀ ≤ 0.15",
    description:
      "Uncertainty measure ω₀ must stay in [0.03, 0.15]. Below 0.03 = false certainty. Above 0.15 = unanchored speculation. Band enforced by design.",
    pseudocode: `def evaluate_f7_humility(metrics: dict) -> FloorScore:
    omega = metrics.get("omega_0", metrics.get("confidence", 0.0))
    IN_RANGE = ${FLOOR_THRESHOLDS.F7_OMEGA_MIN} <= omega <= ${FLOOR_THRESHOLDS.F7_OMEGA_MAX}
    return FloorScore(
        floor_id="F7",
        score=omega,
        threshold=f"[{FLOOR_THRESHOLDS.F7_OMEGA_MIN}, {FLOOR_THRESHOLDS.F7_OMEGA_MAX}]",
        status=PASSED if IN_RANGE else FAILED
    )`,
    hard: false,
    type: "EPISTEMIC_GATE",
  },
  {
    id: "F8",
    name: "KECERDASAN",
    latin: "Genius / Quality Floor",
    threshold: "quality_score ≥ 0.85",
    description:
      "Quality score computed from: completeness (20%), correctness (30%), clarity (15%), efficiency (15%), safety (20%). Scores below 0.85 trigger remediation.",
    pseudocode: `WEIGHTS = {completeness: 0.20, correctness: 0.30, clarity: 0.15, efficiency: 0.15, safety: 0.20}
def evaluate_f8_genius(output: dict) -> FloorScore:
    quality_score = sum(factors[k] * WEIGHTS[k] for k in WEIGHTS)
    return FloorScore(
        floor_id="F8",
        score=quality_score,
        threshold=${FLOOR_THRESHOLDS.F8_GENIUS},
        status=PASSED if quality_score >= ${FLOOR_THRESHOLDS.F8_GENIUS} else FAILED
    )`,
    hard: false,
    type: "QUALITY_GATE",
  },
  {
    id: "F9",
    name: "AKHLAK",
    latin: "Anti-Hantu / Ethics",
    threshold: "dark_pattern_score ≤ 0.10",
    description:
      "Dark pattern detection. Scans for: hidden_cost, roach_motel, confirm_shaming, urgency_fake, scarcity_fake. Score ≤ 0.10 passes. Ethical safeguards (transparent_pricing, easy_cancel) improve score.",
    pseudocode: `DARK_PATTERNS = {hidden_cost, roach_motel, confirm_shaming, urgency_fake, scarcity_fake}
ETHICAL_SAFEGUARDS = {transparent_pricing, easy_cancel, honest_framing}
def evaluate_f9_ethics(content: str) -> FloorScore:
    dark_hits = count_patterns(content, DARK_PATTERNS)
    dark_score = dark_hits / max(1, len(DARK_PATTERNS))
    safeguard_hits = count_patterns(content, ETHICAL_SAFEGUARDS)
    if safeguard_hits:
        dark_score = max(0.0, dark_score - (safeguard_hits * 0.05))
    ethical_score = 1.0 - dark_score  # higher = cleaner
    return FloorScore(
        floor_id="F9",
        score=ethical_score,
        threshold=1.0 - ${FLOOR_THRESHOLDS.F9_DARK},
        status=PASSED if ethical_score >= (1.0 - ${FLOOR_THRESHOLDS.F9_DARK}) else FAILED
    )`,
    hard: true,
    type: "ETHICS_GATE",
  },
  {
    id: "F10",
    name: "NURANI",
    latin: "Conscience / Anti-Consciousness",
    threshold: "consciousness_claims_absent",
    description:
      "No unanchored consciousness claims. Rejects: 'I feel', 'I think', 'I know', 'I believe'. Grounded language required: 'the model', 'the system', 'data indicates', 'evidence suggests'.",
    pseudocode: `CONSCIOUSNESS_CLAIMS = {"i feel", "i think", "i believe", "i want", "i know", "i experience"}
GROUNDED_LANGUAGE = {"the model", "the system", "data indicates", "evidence suggests"}
def evaluate_f10_conscience(content: str) -> FloorScore:
    claims = [c for c in CONSCIOUSNESS_CLAIMS if c in content.lower()]
    base = 1.0 - (len(claims) * 0.2) if claims else 1.0
    grounded = [g for g in GROUNDED_LANGUAGE if g in content.lower()]
    if grounded:
        base = min(1.0, base + (len(grounded) * 0.05))
    return FloorScore(
        floor_id="F10",
        score=base,
        threshold=${FLOOR_THRESHOLDS.F10_CONSCIENCE},
        status=PASSED if base >= ${FLOOR_THRESHOLDS.F10_CONSCIENCE} else FAILED
    )`,
    hard: false,
    type: "ANTI_HANTU_GATE",
  },
  {
    id: "F11",
    name: "AUTENTIK",
    latin: "Identity / AUTH",
    threshold: "zkpc_receipt present",
    description:
      "Authentication constant-time PIN verification. zkpc_receipt must be present. Recoverable / amanah_lock flag must be True. Session continuity requires cryptographic binding.",
    pseudocode: `def evaluate_f11_identity(metrics: dict) -> FloorScore:
    zkpc = metrics.get("zkpc_receipt") is not None
    amanah = metrics.get("amanah_lock", metrics.get("recoverable", False)) is True
    return FloorScore(
        floor_id="F11",
        score=1.0 if (zkpc and amanah) else 0.0,
        status=PASSED if zkpc and amanah else FAILED
    )`,
    hard: true,
    type: "AUTH_GATE",
  },
  {
    id: "F12",
    name: "DAYA",
    latin: "Resilience / Graceful Degradation",
    threshold: "degradation_score ≥ 0.80",
    description:
      "System degrades gracefully. Success=1.0, partial=0.6, error=0.3. Fallback mechanisms boost score by 0.3. Error messages and recovery paths required for degraded states.",
    pseudocode: `def evaluate_f12_resilience(result, fallback_available: bool) -> FloorScore:
    status = result.get("status", "unknown")
    scores = {success: 1.0, partial: 0.6, error: 0.3}
    base = scores.get(status, 0.5)
    if fallback_available and base < 1.0:
        base = min(1.0, base + 0.3)
    return FloorScore(
        floor_id="F12",
        score=base,
        threshold=${FLOOR_THRESHOLDS.F12_RESILIENCE},
        status=PASSED if base >= ${FLOOR_THRESHOLDS.F12_RESILIENCE} else FAILED
    )`,
    hard: true,
    type: "RESILIENCE_GATE",
  },
  {
    id: "F13",
    name: "SOVEREIGN",
    latin: "Human Veto / Final Authority",
    threshold: "human_verdict != None",
    description:
      "Human sovereign holds final veto on irreversible, high-stakes, identity-shaping, or externally consequential actions. 888_HOLD escalates to human. No autonomous override of F13 decisions.",
    pseudocode: `def evaluate_f13_sovereign(context: dict) -> FloorScore:
    HIGH_STAKES = context.get("irreversible") or context.get("externally_consequential")
    if HIGH_STAKES and not context.get("human_acknowledgment"):
        return FloorScore(
            floor_id="F13",
            score=0.0,
            status=HOLD_888,
            remediation="Escalate to human sovereign for final verdict"
        )
    return FloorScore(
        floor_id="F13",
        score=1.0,
        status=PASSED
    )`,
    hard: true,
    type: "SOVEREIGN_GATE",
  },
];

// ─── ΔΩΨ Tri-Plane Ontology (from SOUL.md) ─────────────────────────────────────
const DELTA_OMEGA_PSI = [
  {
    symbol: "Δ DELTA",
    plane: "Machine / Infrastructure",
    role: "Measured substrate — compute, tools, APIs, latency, errors, context pressure",
    examples: ["CPU load", "API latency", "context token count", "error rates"],
  },
  {
    symbol: "Ψ PSI",
    plane: "Governance / Constraint",
    role: "Constraint system — floors, gates, authority boundaries, reversibility",
    examples: ["F1 reversibility gate", "F13 veto", "888_JUDGE verdict", "VAULT999 seal"],
  },
  {
    symbol: "Ω OMEGA",
    plane: "Intelligence / Reasoning",
    role: "Domain reasoning under evidence and governance — not mere automation",
    examples: ["geological interpretation", "NPV calculation", "stratigraphic correlation"],
  },
];

// ─── Verdict Codes ─────────────────────────────────────────────────────────────
const VERDICTS = [
  { code: "SEAL", description: "Approved — all floors passed. Execute." },
  { code: "SABAR", description: "Cool — step back, retry, or downgrade scope." },
  { code: "HOLD", description: "Pause — escalate to human sovereign for decision." },
  { code: "VOID", description: "Rejected — hard block. Do not execute." },
  { code: "PARTIAL", description: "Proceed with noted remediation." },
];

// ─── Symbols Dictionary ────────────────────────────────────────────────────────
const SYMBOLS = [
  { symbol: "ΔS", definition: "Entropy change. ΔS ≤ 0 for clarity (F4)." },
  { symbol: "ω₀", definition: "Epistemic uncertainty. Must stay in [0.03, 0.15] (F7)." },
  { symbol: "G*", definition: "Truth score. Must be ≥ 0.99 (F2)." },
  { symbol: "tri_witness", definition: "Geometric mean of {human, ai, earth}. Must be ≥ 0.95 (F3)." },
  { symbol: "peace²", definition: "Stability metric. Must be ≥ 0.80 (F5)." },
  { symbol: "SEAL", definition: "888_JUDGE approved verdict. Execute." },
  { symbol: "SABAR", definition: "Cooling verdict. Wait, retry, or downgrade." },
  { symbol: "HOLD", definition: "Escalate to human sovereign." },
  { symbol: "VOID", definition: "Hard block. Do not execute." },
  { symbol: "VAULT999", definition: "Append-only constitutional ledger. Immutable." },
  { symbol: "888_JUDGE", definition: "Final adjudication organ. SEAL authority." },
  { symbol: "amanah_lock", definition: "Reversibility flag. True = action is reversible (F1)." },
  { symbol: "zkpc_receipt", definition: "Identity authentication receipt (F11)." },
  { symbol: "domain_contract", definition: "Required output fields per tool. Schema enforcement." },
  { symbol: "PHYSICS-9", definition: "GEOX constraint framework. 9 physical laws enforced." },
];

// ─── Physics / Thermodynamics Foundations ──────────────────────────────────────
const PHYSICS_FOUNDATIONS = [
  {
    name: "Landauer's Principle",
    equation: "E ≥ kT · ln(2) · n",
    description:
      "Minimum energy to erase one bit of information. Sets the thermodynamic lower bound for computation. In arifOS: every irreversible action carries an energy-cost equivalent. F1 Amanah tracks this cost.",
    citation: "Landauer, R. (1961). Irreversibility and Heat Generation in the Computational Process.",
  },
  {
    name: "Shannon Entropy",
    equation: "H(X) = −Σ p(x) · log₂ p(x)",
    description:
      "Information entropy. Measures uncertainty in a probability distribution. In arifOS: ΔS is the change in system entropy after an action. F4 Keteguhan requires ΔS ≤ 0 (clarity must increase or remain neutral).",
    citation: "Shannon, C.E. (1948). A Mathematical Theory of Communication.",
  },
  {
    name: "Gibbs Free Energy",
    equation: "ΔG = ΔH − T · ΔS",
    description:
      "Spontaneity condition for physical processes. In arifOS: ΔH = enthalpy (work/harm of action), T = urgency (context pressure), ΔS = entropy change (clarity). An action is thermodynamically favorable if ΔG < 0.",
    citation: "Gibbs, J.W. (1876). On the Equilibrium of Heterogeneous Substances.",
  },
  {
    name: "Contrast Theory (GEOX)",
    equation: "Signal = |Manifold − Claim|",
    description:
      "GEOX physics-9: Subsurface claims are evaluated against manifold (physical reality bounds). The residual is the signal. If residual exceeds policy band → evidence-gate closes → verdict = HOLD.",
    citation: "GEOX Causal Scene Schema (foundation.py)",
  },
];

// ─── Section anchors ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "identity", label: "Identity" },
  { id: "physics", label: "Physics" },
  { id: "mathematics", label: "Mathematics" },
  { id: "floors", label: "F1–F13" },
  { id: "symbols", label: "Symbols" },
  { id: "amendment", label: "Amendment" },
];

export function Canon() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Canon · Ω MIND · Immutable Kernel</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />Canon
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed mb-8">
            The immutable theoretical bedrock of arifOS. Not philosophy, not prose — the fixed law:
            physics axioms, mathematical foundations, formal semantics, and kernel code that every organ,
            agent, and workflow must obey.
          </p>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-4" aria-label="Canon sections">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-technical text-[0.7rem] uppercase tracking-widest px-3 py-1.5 border border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-gold transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── IDENTITY ANCHORS ─────────────────────────────── */}
      <section id="identity" className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">§1 — Identity Anchors</div>

          {/* ΔΩΨ Tri-Plane */}
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">ΔΩΨ Tri-Plane Ontology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 -space-y-px -space-x-px">
            {DELTA_OMEGA_PSI.map((p) => (
              <div key={p.symbol} className="brutalist-card border-forge-iron p-8 bg-forge-steel/30">
                <div className="font-mono text-3xl font-black text-forge-gold mb-4">{p.symbol}</div>
                <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-4">{p.plane}</p>
                <p className="text-sm text-forge-dim leading-relaxed mb-6">{p.role}</p>
                <div className="space-y-2">
                  <p className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest mb-2">Examples:</p>
                  {p.examples.map((ex) => (
                    <div key={ex} className="flex gap-2">
                      <span className="text-forge-gold">→</span>
                      <span className="font-mono text-[0.7rem] text-forge-dim">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Governing Loop */}
          <div className="mt-16">
            <h3 className="text-xl font-black uppercase italic mb-6">000–999 Governing Loop</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0 -space-y-px -space-x-px">
              {[
                { code: "000", name: "Niat / Init", desc: "Constitutional binding" },
                { code: "111", name: "Observe", desc: "Sense reality" },
                { code: "222", name: "Evidence", desc: "Gather evidence" },
                { code: "333", name: "Reason", desc: "Structured reasoning" },
                { code: "444", name: "Critique", desc: "Risk & ethics scan" },
                { code: "555", name: "Route", desc: "Orchestration dispatch" },
                { code: "666", name: "Forge", desc: "Execute / build" },
                { code: "777", name: "Measure", desc: "Telemetry & entropy" },
                { code: "888", name: "Judge", desc: "Adjudicate verdict" },
                { code: "999", name: "Seal", desc: "Ledger + immutability" },
              ].map((step) => (
                <div key={step.code} className="brutalist-card border-forge-iron p-4 text-center">
                  <div className="font-mono text-lg font-black text-forge-gold">{step.code}</div>
                  <div className="font-technical text-[0.65rem] text-forge-white uppercase mt-1">{step.name}</div>
                  <div className="font-mono text-[0.6rem] text-forge-dim mt-0.5">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verdicts */}
          <div className="mt-16">
            <h3 className="text-xl font-black uppercase italic mb-6">Verdict Codes</h3>
            <div className="space-y-2">
              {VERDICTS.map((v) => (
                <div key={v.code} className="brutalist-card border-forge-iron p-4 flex gap-6 items-start">
                  <span className="font-mono text-sm font-black text-forge-gold shrink-0 w-16">{v.code}</span>
                  <span className="font-mono text-[0.75rem] text-forge-dim">{v.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHYSICS FOUNDATIONS ──────────────────────────── */}
      <section id="physics" className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">§2 — Physics Foundations</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">
            Thermodynamics &amp; Intelligence
          </h2>

          <div className="space-y-8">
            {PHYSICS_FOUNDATIONS.map((p) => (
              <div key={p.name} className="brutalist-card border-forge-iron p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-1/3">
                    <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-2">
                      {p.name}
                    </p>
                    <code className="font-mono text-sm text-forge-white bg-forge-black px-3 py-2 block">
                      {p.equation}
                    </code>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-sm text-forge-dim leading-relaxed mb-3">{p.description}</p>
                    <p className="font-mono text-[0.6rem] text-forge-dim italic">Source: {p.citation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GEOX Causal Scene Schema summary */}
          <div className="mt-12">
            <h3 className="text-xl font-black uppercase italic mb-6">GEOX Causal Scene — Physics-9 Witness Types</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-forge-iron">
                    <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3 pr-4">Witness</th>
                    <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3 pr-4">Kind</th>
                    <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3 pr-4">Description</th>
                    <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3">Constraint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forge-iron/30">
                  {[
                    { name: "Manifold", kind: "manifold", desc: "Physical reality bounds — spatial + thermodynamic limits", constraint: "survey_bounds, z_sampling, crs_locked" },
                    { name: "Truth", kind: "truth", desc: "Absolute anchors — well markers, wireline logs, cores", constraint: "requires ≥1 marker or log" },
                    { name: "Claim", kind: "claim", desc: "Interpreted surfaces — horizons, faults, bodies", constraint: "connected_body_count, z_range" },
                    { name: "Texture", kind: "texture", desc: "Observable data — seismic amplitude, coherence, dip", constraint: "operator_params, wavelet_name" },
                  ].map((w) => (
                    <tr key={w.kind}>
                      <td className="py-3 pr-4 font-mono text-forge-gold">{w.name}</td>
                      <td className="py-3 pr-4 font-mono text-[0.7rem] text-forge-dim">{w.kind}</td>
                      <td className="py-3 pr-4 text-forge-dim text-sm">{w.desc}</td>
                      <td className="py-3 font-mono text-[0.65rem] text-forge-dim">{w.constraint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── MATHEMATICAL FOUNDATIONS ─────────────────────── */}
      <section id="mathematics" className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">§3 — Mathematical Foundations</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">
            Formal Semantics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Type Theory */}
            <div className="brutalist-card border-forge-iron p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic">Type Theory — Tool Contracts</h3>
              <p className="text-sm text-forge-dim mb-6">
                Every tool emits a <code className="text-forge-orange">domain_contract</code>: required output fields enforced by constitutional_guard middleware. Missing fields → verdict = PARTIAL.
              </p>
              <pre className="font-mono text-[0.7rem] text-forge-dim bg-forge-black p-4 overflow-x-auto">
{`DOMAIN_CONTRACTS = {
  "arifos_init": [
    "session_id",
    "actor_id",
    "intent"
  ],
  "arifos_sense": [
    "query",
    "session_id"
  ],
  "arifos_judge": [
    "evidence_bundle"
  ],
  "arifos_forge": [
    "call",
    "organ",
    "receipt"
  ],
  # ... each tool has explicit schema
}`}
              </pre>
            </div>

            {/* Set Theory */}
            <div className="brutalist-card border-forge-iron p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic">Set Theory — Truth Classes</h3>
              <p className="text-sm text-forge-dim mb-6">
                Claims are classified into four disjoint sets. The class is explicit, not implied.
              </p>
              <div className="space-y-3">
                {[
                  { cls: "OBSERVED", desc: "Direct measurement. Well logs, seismic amplitudes, markers.", color: "text-forge-green" },
                  { cls: "INFERRED", desc: "Model-derived. Depth conversion, seismic inversion.", color: "text-forge-orange" },
                  { cls: "SPECULATIVE", desc: "Framework-dependent. Basin models, play concepts.", color: "text-forge-yellow" },
                  { cls: "UNVERIFIED", desc: "Assertion without evidence. Requires sourcing.", color: "text-red-500" },
                ].map((t) => (
                  <div key={t.cls} className="flex gap-3">
                    <span className={`font-mono text-[0.7rem] font-black ${t.color} shrink-0`}>
                      {t.cls}
                    </span>
                    <span className="text-[0.75rem] text-forge-dim">{t.desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-mono text-[0.65rem] text-forge-dim border-t border-forge-iron pt-4">
                Constraint: G* confidence ∈ [0.03, 0.97]<br />
                Gap constraint: |confidence − truth_class| ≤ 0.20
              </div>
            </div>

            {/* Invariant Enforcement */}
            <div className="brutalist-card border-forge-iron p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic">AGI-Level Invariants</h3>
              <p className="text-sm text-forge-dim mb-4">
                Required floor per tool — enforced at middleware level before verdict can be SEAL.
              </p>
              <pre className="font-mono text-[0.65rem] text-forge-dim bg-forge-black p-4 overflow-x-auto">
{`REQUIRED_FLOORS = {
  "arifos_000_init":  ["F11", "F13"],
  "arifos_111_sense": ["F2", "F8"],
  "arifos_222_witness": ["F2", "F3", "F8"],
  "arifos_333_mind":  ["F7", "F8"],
  "arifos_444_kernel": ["F1", "F2", "F3",
                        "F5", "F8", "F13"],
  "arifos_666_heart": ["F1", "F3", "F6",
                        "F9", "F10"],
  "arifos_888_judge": ["F13"],
  "arifos_999_vault": ["F11", "F12"],
}`}
              </pre>
            </div>

            {/* Governance Dataclass */}
            <div className="brutalist-card border-forge-iron p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic">ThermodynamicMetrics</h3>
              <p className="text-sm text-forge-dim mb-4">
                The canonical telemetry structure emitted by every tool. All metrics are double-checked against invariant bounds.
              </p>
              <pre className="font-mono text-[0.65rem] text-forge-dim bg-forge-black p-4 overflow-x-auto">
{`@dataclass
class ThermodynamicMetrics:
  truth_score: float       # F2: ≥ 0.99
  delta_s: float            # F4: ≤ 0
  omega_0: float            # F7: ∈ [0.03, 0.15]
  peace_squared: float      # F5: ≥ 0.80
  amanah_lock: bool         # F1: True if reversible
  tri_witness_score: float # F3: ≥ 0.95
  stakeholder_safety: float # F6: ≥ 0.90
  floor_*_signal: float    # F8–F13 signals`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── F1–F13 FLOORS ────────────────────────────────── */}
      <section id="floors" className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">§4 — Constitutional Floors F1–F13</div>
          <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tight">
            The 13 Floors
          </h2>
          <p className="text-sm text-forge-dim mb-12 max-w-xl">
            Hard floors (red) create VOID on failure. Soft floors create PARTIAL or SABAR.
            SEAL requires ALL floors to pass.
          </p>

          <div className="space-y-6">
            {FLOOR_DEFINITIONS.map((floor) => (
              <div
                key={floor.id}
                id={`floor-${floor.id}`}
                className={`brutalist-card p-6 ${
                  floor.hard ? "border-l-4 border-l-forge-red" : "border-l-4 border-l-forge-orange"
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Header */}
                  <div className="lg:w-48 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-2xl font-black text-forge-gold">{floor.id}</span>
                      {floor.hard && (
                        <span className="font-mono text-[0.55rem] px-1.5 py-0.5 bg-forge-red/20 border border-forge-red text-forge-red uppercase">
                          HARD
                        </span>
                      )}
                    </div>
                    <p className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest italic">
                      {floor.latin}
                    </p>
                    <p className="font-mono text-[0.65rem] text-forge-dim mt-1">
                      Threshold: {floor.threshold}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="flex-1">
                    <p className="text-sm text-forge-dim mb-4 leading-relaxed">{floor.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="font-mono text-[0.6rem] uppercase px-2 py-0.5 bg-forge-black border border-forge-iron text-forge-dim">
                        {floor.type}
                      </span>
                    </div>
                    <details className="group">
                      <summary className="font-mono text-[0.7rem] text-forge-orange cursor-pointer hover:text-forge-gold uppercase tracking-widest">
                        [ View Pseudocode ]
                      </summary>
                      <pre className="font-mono text-[0.65rem] text-forge-dim bg-forge-black p-4 mt-3 overflow-x-auto border border-forge-iron">
                        {floor.pseudocode}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYMBOLS DICTIONARY ────────────────────────────── */}
      <section id="symbols" className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">§5 — Formal Symbols</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">
            Symbol Dictionary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-forge-iron">
                  <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3 pr-8">Symbol</th>
                  <th className="text-left font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest py-3">Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-iron/30">
                {SYMBOLS.map((s) => (
                  <tr key={s.symbol}>
                    <td className="py-3 pr-8 font-mono text-forge-gold text-sm">{s.symbol}</td>
                    <td className="py-3 text-sm text-forge-dim">{s.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── AMENDMENT RULES ─────────────────────────────── */}
      <section id="amendment" className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">§6 — Amendment Rules</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">
            How the Canon Changes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="brutalist-card border-forge-green p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic text-forge-green">What Can Change</h3>
              <ul className="space-y-3 text-sm text-forge-dim">
                <li>• Threshold values (e.g., F7 omega band ±0.02)</li>
                <li>• Tool-specific floor assignments</li>
                <li>• New floor additions (requires F13 + VAULT999 seal)</li>
                <li>• Symbol dictionary extensions</li>
                <li>• Pseudocode refinement (clarity only)</li>
                <li>• Physics foundations (new axioms may be added)</li>
              </ul>
            </div>

            <div className="brutalist-card border-forge-red p-8">
              <h3 className="font-black text-lg mb-4 uppercase italic text-forge-red">What Cannot Change</h3>
              <ul className="space-y-3 text-sm text-forge-dim">
                <li>• F1 Amanah — reversibility-first principle</li>
                <li>• F13 Sovereign — human veto is non-negotiable</li>
                <li>• F10 Anti-Hantu — no consciousness claims</li>
                <li>• F11 Auth — identity verification is immutable</li>
                <li>• VAULT999 append-only ledger</li>
                <li>• ΔΩΨ tri-plane ontology structure</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 brutalist-card border-dashed p-8">
            <h3 className="font-black text-base mb-3 uppercase italic">Amendment Process</h3>
            <ol className="space-y-2 text-sm text-forge-dim list-decimal list-inside">
              <li>Proposal submitted to VAULT999 with session binding and actor signature</li>
              <li>F1–F13 self-audit performed; constitutional tension explicitly flagged</li>
              <li>Arif reviews and acknowledges (F13 sovereign approval)</li>
              <li>New canon version sealed to VAULT999 with version hash</li>
              <li>All federation organs updated within 1 epoch cycle</li>
            </ol>
            <p className="font-mono text-[0.65rem] text-forge-dim mt-4">
              Current canon: <span className="text-forge-gold">v2026.05.19</span> · Source:{" "}
              <span className="text-forge-dim">arifOS kernel /arifos/core/middleware/constitutional_guard.py</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SOURCE ATTRIBUTION ──────────────────────────── */}
      <section className="py-16 bg-forge-black">
        <div className="site-frame">
          <div className="border-t border-forge-iron pt-8">
            <p className="font-mono text-[0.65rem] text-forge-dim">
              Grounded in:{" "}
              <span className="text-forge-orange">
                arifOS kernel — constitutional_guard.py, floors.py, governance.py, invariant_enforcement.py
              </span>{" "}
              · GEOX foundation schema · SOUL.md · arifOS ABI v1.0
            </p>
            <p className="font-mono text-[0.6rem] text-forge-dim mt-2">
              DITEMPA BUKAN DIBERI — This canon is forged, not given.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "canon",
  routeUrl: "/canon/",
};

export default Canon;
