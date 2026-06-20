---
title: 'Physics-Constrained Attention: Zoeppritz as Constitutional Floor — Why the
  AVO-Attention Equivalence Demands Governed Transformers, and How to Build Them'
date: '2026-06-05'
slug: physics-constrained-attention-zoeppritz-constitutional-floor
tags:
- geophysics
- machine-learning
- attention
- avo
- governance
- arifos
- hallucination
- physics-informed
- transformers
- acrisk
- constitutional-ai
excerpt: 'Building on the AVO-attention equivalence established in Essay #11, we argue
  that the mapping is not merely descriptive—it is prescriptive. If transformer attention
  and AVO anomaly detection implement the same contrast-amplification primitive, then
  the physics constraints that make AVO reliable (exact Zoeppritz equations, Mudrock
  line calibration, fluid factor validation) can and must be ported to transformer
  architectures as constitutional governance floors. We formalize the Physics-Constrained
  Attention (PCA) framework, demonstrate that the Bayesian Physics-Informed Vision
  Transformer (BPI-ViT) is a partial reference implementation, and show how the arifOS
  F1–F13 constitutional floor architecture generalizes this principle beyond geophysics:
  every transformer deployed in high-stakes domains requires a calibrated baseline—a
  "Mudrock line for attention"—against which attention anomalies are validated before
  they become outputs. Without physics-constrained attention, transformer hallucination
  is not a bug; it is the default behavior of an ungoverned contrast amplifier.'
mediumUrl: ''
isDirectPublication: true
---


<article class="scientific-paper">

<!-- Title Block -->
<div class="paper-header mb-12">
  <h1 class="paper-title">Physics-Constrained Attention: Zoeppritz as Constitutional Floor</h1>
  <h2 class="paper-subtitle text-xl text-forge-dim mt-4" style="font-style: italic;">Why the AVO-Attention Equivalence Demands Governed Transformers, and How to Build Them</h2>

  <div class="paper-authors mt-6">
    <p><strong>Muhammad Arif bin Fazil</strong></p>
    <p class="text-forge-dim">Senior Exploration Geoscientist · Sovereign Architect, arifOS · GEOX Earth Intelligence</p>
    <p class="text-forge-dim">Penang, Malaysia</p>
  </div>

  <div class="paper-meta mt-4 font-mono text-xs text-forge-dim">
    <p>Published: 5 June 2026 · Direct Publication · arif-fazil.com/essays/</p>
    <p>Builds on Essay #11: "Contrast-Governed Anomaly Detection: A Formal Bridge between Seismic AVO and Transformer Attention"</p>
    <p>Epistemic Tag: CLAIM — awaiting adversarial review. Not peer-reviewed.</p>
  </div>
</div>

<!-- Abstract -->
<div class="paper-section">
  <h2>Abstract</h2>
  <p>
    In a companion paper (Essay #11, this site), we established that seismic AVO anomaly detection and transformer self-attention implement the same computational primitive: contrast extraction against a calibrated baseline, followed by normalization and amplification of significant deviations. That paper mapped the AVO fluid factor ΔF = B − mA − c onto the attention logit residual δ<sub>i</sub> = e<sub>i</sub> − ē, and identified the Mudrock line as the geophysical analog of the uniform-attention null hypothesis.
  </p>
  <p>
    In this extension, we argue that the equivalence is not merely <em>descriptive</em>—it is <em>prescriptive</em>. If transformer attention and AVO anomaly detection are structurally identical, then the physics constraints that make AVO reliable must be ported to transformer architectures as <strong>constitutional governance floors</strong>. We formalize the <strong>Physics-Constrained Attention (PCA)</strong> framework: a transformer attention head is governed if, and only if, its attention-weight distribution can be validated against a calibrated physical baseline external to the model. We demonstrate that the Bayesian Physics-Informed Vision Transformer (BPI-ViT) architecture—which passes predicted elastic parameters through exact Zoeppritz forward modeling during training—is a partial reference implementation of PCA. We then show how the arifOS F1–F13 constitutional floor architecture generalizes this principle beyond geophysics: every transformer deployed in high-stakes domains requires a calibrated baseline—a "Mudrock line for attention"—against which attention anomalies are validated <em>before</em> they become outputs.
  </p>
  <p>
    The central claim is: <strong>transformer hallucination is not a bug. It is the default behavior of an ungoverned contrast amplifier.</strong> Without an external physics baseline, softmax will amplify <em>something</em>—if not a real signal, then noise. The Zoeppritz equations are not merely a physics prior; they are the constitutional floor that separates a valid attention anomaly from a hallucinated one. This principle generalizes: every AI system that uses attention needs a "Mudrock line"—a calibrated, external, falsifiable baseline—or it will eventually amplify noise into confident falsehood.
  </p>
</div>

<!-- 1. Introduction -->
<div class="paper-section">
  <h2>1. From Description to Prescription</h2>

  <h3>1.1 What Essay #11 Established</h3>
  <p>
    Essay #11 ("Contrast-Governed Anomaly Detection: A Formal Bridge between Seismic AVO and Transformer Attention") established the following mapping under specified conditions (linear background trend, uniform attention baseline, small-residual approximation):
  </p>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">AVO Component</th>
          <th style="text-align: left; padding: 8px;">Mathematical Form</th>
          <th style="text-align: left; padding: 8px;">Attention Equivalent</th>
          <th style="text-align: left; padding: 8px;">Mathematical Form</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;">Observation</td>
          <td style="padding: 8px; font-family: monospace;">R(θ) for a specific reflection</td>
          <td style="padding: 8px;">Alignment score</td>
          <td style="padding: 8px; font-family: monospace;">e<sub>i</sub> = q·k<sub>i</sub> / √d<sub>k</sub></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;">Feature extraction</td>
          <td style="padding: 8px; font-family: monospace;">Intercept A, Gradient B (Shuey)</td>
          <td style="padding: 8px;">Feature extraction</td>
          <td style="padding: 8px; font-family: monospace;">Q, K from learned linear projections</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;">Background model</td>
          <td style="padding: 8px; font-family: monospace;">Mudrock line B<sub>bg</sub> = mA + c</td>
          <td style="padding: 8px;">Background model</td>
          <td style="padding: 8px; font-family: monospace;">Uniform distribution ē = (1/N)Σe<sub>j</sub></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Contrast residual</td>
          <td style="padding: 8px; font-family: monospace; font-weight: bold;">ΔF = B − mA − c</td>
          <td style="padding: 8px; font-weight: bold;">Contrast residual</td>
          <td style="padding: 8px; font-family: monospace; font-weight: bold;">δ<sub>i</sub> = e<sub>i</sub> − ē</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;">Amplification</td>
          <td style="padding: 8px; font-family: monospace;">Threshold / Mahalanobis distance</td>
          <td style="padding: 8px;">Amplification</td>
          <td style="padding: 8px; font-family: monospace;">α<sub>i</sub> = softmax(δ<sub>i</sub>)</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Anomaly flag</td>
          <td style="padding: 8px; font-family: monospace;">Class I–IV classification</td>
          <td style="padding: 8px;">Anomaly flag</td>
          <td style="padding: 8px; font-family: monospace;">α<sub>i</sub> ≫ 1/N → token selected</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm" style="margin-top: -0.5em;">Table 1: The AVO-Attention mapping established in Essay #11. R(θ) = reflection coefficient at angle θ; e<sub>i</sub> = attention logit for key i; A = AVO intercept; B = AVO gradient; m, c = Mudrock line parameters; ē = mean logit; δ<sub>i</sub> = logit residual; α<sub>i</sub> = attention weight.</p>

  <h3>1.2 The Unfinished Business</h3>
  <p>
    Essay #11 stopped at the mapping. It said: <em>these two things are structurally the same.</em> This paper asks the next question: <strong>so what?</strong>
  </p>
  <p>
    If AVO and attention are the same computational primitive, then four decades of geophysical hard-won knowledge about what makes AVO <em>reliable</em> must translate into prescriptions for what makes transformer attention <em>governable</em>. The geophysicist does not trust every bright spot. She knows that coal, tight carbonates, and tuning effects produce false positives. She calibrates against the Mudrock line. She cross-validates with well control. She computes the fluid factor. She classifies the anomaly. She never trusts amplitude alone.
  </p>
  <p>
    The ML engineer deploying a transformer today does none of these things. The softmax output is taken at face value. The attention weight <em>is</em> the answer. There is no Mudrock line for attention. There is no fluid factor. There is no external physical referent against which an attention spike is validated.
  </p>
  <p>
    This paper supplies those missing pieces.
  </p>

  <h3>1.3 The Central Thesis</h3>
  <div style="border-left: 3px solid var(--forge-gold); padding: 1em 1.5em; margin: 1.5em 0; background: rgba(212, 175, 55, 0.05);">
    <p style="margin: 0;"><strong>THESIS:</strong> Transformer hallucination is the default behavior of an ungoverned contrast amplifier. Softmax will amplify <em>something</em>—if not a real signal, then noise, and if not noise, then an adversarial perturbation, and if not that, then a spurious correlation. The only way to prevent this is to constrain attention with an <em>external, calibrated, falsifiable baseline</em> that the model cannot modify. In geophysics, that baseline is the Zoeppritz equations plus the Mudrock line. In any other high-stakes domain, an equivalent baseline must be constructed. Without it, the transformer is a contrast engine without a governor—and it will eventually hallucinate.</p>
  </div>
</div>

<!-- 2. The Physics-Constrained Attention Framework -->
<div class="paper-section">
  <h2>2. The Physics-Constrained Attention (PCA) Framework</h2>

  <h3>2.1 Formal Definition</h3>
  <p>
    We define a <strong>Physics-Constrained Attention (PCA) head</strong> as an attention mechanism satisfying three conditions:
  </p>

  <div style="border: 1px solid var(--forge-iron); padding: 1.5em; margin: 1.5em 0;">
    <p><strong>Condition 1 — External Baseline (the "Mudrock line" condition):</strong> There exists a calibrated baseline function B(·) external to the model's trainable parameters, such that B(x) predicts the expected attention distribution over keys given input x under the null hypothesis of "no anomaly." This baseline must be derived from physics, empirical measurement, or constitutional specification—not learned from the same data distribution the model is trained on.</p>

    <p><strong>Condition 2 — Residual Validation (the "Fluid Factor" condition):</strong> For every attention head h and every query q, the attention weight distribution α<sub>h,q</sub> is compared against the baseline B(x). The residual R<sub>h,q</sub> = D(α<sub>h,q</sub> || B(x)) is computed, where D is a divergence measure (KL, JS, or Mahalanobis). If R<sub>h,q</sub> exceeds a calibrated threshold τ<sub>h</sub>, the attention head is flagged for audit.</p>

    <p><strong>Condition 3 — Physical Consistency (the "Zoeppritz" condition):</strong> The model's output—when mapped back to the physical or decision domain—must satisfy a set of forward constraints C that are mathematically independent of the model's learned parameters. These constraints act as a hard filter: any output that violates C is rejected regardless of attention-weight confidence.</p>
  </div>

  <h3>2.2 Why Three Conditions?</h3>
  <p>
    Each condition addresses a distinct failure mode of ungoverned attention:
  </p>
  <ul>
    <li><strong>Condition 1 (External Baseline)</strong> prevents <em>baseline capture</em>—the model learning to treat its own biased distribution as "normal." This is the attention equivalent of using a Mudrock line calibrated on brine sands rather than letting the model define its own background.</li>
    <li><strong>Condition 2 (Residual Validation)</strong> prevents <em>silent amplification</em>—the model assigning high attention to tokens that deviate from baseline for spurious reasons. This is the fluid factor: ΔF tells you whether the deviation is significant <em>after</em> accounting for the background trend.</li>
    <li><strong>Condition 3 (Physical Consistency)</strong> prevents <em>confident falsehood</em>—the model outputting a physically impossible result with high attention-weight confidence. This is Zoeppritz: the exact physics refuses to propagate an impossible solution, no matter how confidently the attention head selected it.</li>
  </ul>
</div>

<!-- 3. BPI-ViT as Reference Implementation -->
<div class="paper-section">
  <h2>3. BPI-ViT: A Partial Reference Implementation</h2>

  <h3>3.1 Architecture Review</h3>
  <p>
    The Bayesian Physics-Informed Vision Transformer (BPI-ViT), as described in recent geophysical literature (Chen et al., 2024–2025; ResearchGate preprints), fuses three paradigms:
  </p>
  <ol>
    <li><strong>Vision Transformer (ViT)</strong> backbone for global, long-range spatial feature extraction from pre-stack seismic gathers.</li>
    <li><strong>Bayesian Neural Network (BNN)</strong> layers for structure-level uncertainty quantification—replacing deterministic point estimates with posterior distributions over V<sub>p</sub>, V<sub>s</sub>, and ρ.</li>
    <li><strong>Physics-Informed constraint</strong>: predicted elastic parameters are forward-modeled through the <em>exact Zoeppritz equations</em> to compute synthetic reflection coefficients, which are compared against observed seismic data in the loss function.</li>
  </ol>

  <h3>3.2 Mapping BPI-ViT to PCA Conditions</h3>
  <p>
    The BPI-ViT satisfies our three PCA conditions, partially:
  </p>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">PCA Condition</th>
          <th style="text-align: left; padding: 8px;">BPI-ViT Implementation</th>
          <th style="text-align: left; padding: 8px;">Status</th>
          <th style="text-align: left; padding: 8px;">Gap</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">C1: External Baseline</td>
          <td style="padding: 8px;">Bayesian prior distributions over elastic parameters serve as the "background" expectation.</td>
          <td style="padding: 8px; color: #d4af37;">PARTIAL</td>
          <td style="padding: 8px;">The prior is set by the model designer, not calibrated from an independent physical measurement (e.g., well logs from a different basin). Risk of prior misspecification.</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">C2: Residual Validation</td>
          <td style="padding: 8px;">Bayesian posterior variance quantifies uncertainty—high variance flags unreliable predictions. The physics loss term penalizes large residual misfit.</td>
          <td style="padding: 8px; color: #d4af37;">PARTIAL</td>
          <td style="padding: 8px;">Attention-weight divergence from baseline is not explicitly computed as an audit metric. The uncertainty quantification operates on outputs (elastic parameters), not on attention distributions directly.</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">C3: Physical Consistency</td>
          <td style="padding: 8px;">Exact Zoeppritz forward modeling during training enforces that predicted (V<sub>p</sub>, V<sub>s</sub>, ρ) must produce physically consistent reflection coefficients.</td>
          <td style="padding: 8px; color: #4caf50;">SATISFIED</td>
          <td style="padding: 8px;">This is the strongest part of BPI-ViT. The Zoeppritz constraint is hard physical law, not a learned prior. A hallucinated elastic parameter vector will produce reflection coefficients that violate the observed seismic—and the loss function will punish it.</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 2: BPI-ViT compliance with PCA conditions. The architecture satisfies C3 fully and C1–C2 partially. Closing the C1–C2 gaps constitutes the research program proposed in Section 5.</p>

  <h3>3.3 The Zoeppritz Loss as Constitutional Gate</h3>
  <p>
    The critical insight is that the exact Zoeppritz forward model functions as a <strong>constitutional gate</strong> in the computational graph. During backpropagation, if the ViT attention heads have assigned high weight to a spurious feature—coherent noise, multiple reflections, acquisition footprint—the predicted elastic parameters will be physically inconsistent. The Zoeppritz-derived reflection coefficients will not match the observed seismic. The loss gradient will flow backward and <em>suppress those attention weights</em>.
  </p>
  <p>
    This is constitutional governance implemented in gradient descent. The physics constraint does not tell the model what to attend to. It tells the model what it <em>cannot</em> attend to—anything that produces a physically impossible output. The model is free to explore any attention distribution that satisfies the constraint. This is exactly the arifOS principle: <strong>governance defines the floor, not the ceiling.</strong>
  </p>
</div>

<!-- 4. Generalizing Beyond Geophysics -->
<div class="paper-section">
  <h2>4. The Mudrock Line for Everything: Generalizing PCA Beyond Geophysics</h2>

  <h3>4.1 The Universal Pattern</h3>
  <p>
    The PCA framework is not specific to seismic data. The pattern generalizes:
  </p>
  <ol>
    <li><strong>Identify the physical or constitutional invariant</strong> that the model's outputs must satisfy, independent of the model's learned parameters.</li>
    <li><strong>Calibrate a baseline</strong> for what "normal" attention looks like under the null hypothesis of no anomaly.</li>
    <li><strong>Compute the residual</strong> between observed attention and baseline attention.</li>
    <li><strong>Reject</strong> outputs that violate the invariant, regardless of attention-weight confidence.</li>
  </ol>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Domain</th>
          <th style="text-align: left; padding: 8px;">Physical Invariant (Zoeppritz equivalent)</th>
          <th style="text-align: left; padding: 8px;">Calibrated Baseline (Mudrock line equivalent)</th>
          <th style="text-align: left; padding: 8px;">Residual (Fluid Factor equivalent)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;"><strong>Seismic AVO</strong></td>
          <td style="padding: 8px;">Exact Zoeppritz equations (continuity of displacement and stress at elastic interface)</td>
          <td style="padding: 8px;">Mudrock line B = mA + c (Castagna et al., 1985)</td>
          <td style="padding: 8px;">ΔF = B − mA − c (Smith & Gidlow, 1987)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;"><strong>Medical Imaging</strong></td>
          <td style="padding: 8px;">Anatomical constraints (organ adjacency, tissue density ranges, known physiology)</td>
          <td style="padding: 8px;">Population-normal atlas of expected attention distributions for healthy anatomy</td>
          <td style="padding: 8px;">Attention KL-divergence from healthy-atlas baseline</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;"><strong>Legal / Regulatory AI</strong></td>
          <td style="padding: 8px;">Statutory text + precedent (the law as fixed constraint)</td>
          <td style="padding: 8px;">Expected citation distribution under faithful legal reasoning (Shepard's-style graph)</td>
          <td style="padding: 8px;">Attention deviation from precedent-consistent citation patterns</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px;"><strong>Financial Risk</strong></td>
          <td style="padding: 8px;">No-arbitrage conditions, conservation of capital, accounting identities</td>
          <td style="padding: 8px;">Market-implied attention distribution from option prices / volatility surface</td>
          <td style="padding: 8px;">Attention concentration exceeding market-implied risk bounds</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Constitutional AI (arifOS)</strong></td>
          <td style="padding: 8px;">F1–F13 constitutional floors (sovereign-defined, machine-enforced)</td>
          <td style="padding: 8px;">Expected agent behavior under sovereign intent (the "constitutional Mudrock line")</td>
          <td style="padding: 8px;">Divergence of agent action from constitutional baseline → HOLD or escalation</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 3: PCA generalized across domains. In every case, the structure is identical: an external invariant, a calibrated baseline, a residual computation, and a rejection mechanism for violations.</p>

  <h3>4.2 The Constitutional Mudrock Line</h3>
  <p>
    The generalization to arifOS constitutional AI is direct and intentional. In arifOS, the F1–F13 constitutional floors function exactly as the Mudrock line functions in AVO:
  </p>
  <ul>
    <li><strong>F1 AMANAH (immutable gate):</strong> The baseline says "no irreversible action without sovereign acknowledgment." An agent action that bypasses this is an attention anomaly—a deviation from the constitutional baseline. The system does not debate it. It holds.</li>
    <li><strong>F13 SOVEREIGN (veto):</strong> The sovereign is the ultimate physical invariant. No model output survives sovereign rejection. This is Zoeppritz for agents: the exact boundary condition that cannot be approximated away.</li>
  </ul>
  <p>
    The arifOS constitutional floors are not "safety guidelines." They are <strong>physics constraints for agent attention</strong>. They define what outputs are physically (constitutionally) possible. The agent's attention mechanism—its "what should I focus on?" computation—is free within those bounds. But it cannot produce an output that violates the floors, regardless of how confidently its attention heads have selected that path.
  </p>
</div>

<!-- 5. ACRisk Extended -->
<div class="paper-section">
  <h2>5. ACRisk Extended: Auditing Attention as AVO</h2>

  <h3>5.1 The ACRisk Framework (Recap)</h3>
  <p>
    Essay #11 introduced the GEOX ACRisk framework for auditing attention heads in geophysical transformers. ACRisk evaluates each attention head along three axes:
  </p>
  <ul>
    <li><strong>U<sub>phys</sub> (Physical Utility):</strong> Does this head attend to physically meaningful features (velocity contrasts, density boundaries) rather than artifacts?</li>
    <li><strong>D<sub>transform</sub> (Transformational Distortion):</strong> Does the softmax amplification distort the underlying physical signal beyond recognition?</li>
    <li><strong>B<sub>cog</sub> (Cognitive Baseline):</strong> Is the head's attention baseline calibrated against known rock-physics trends, or has it drifted into a learned-but-unphysical background?</li>
  </ul>

  <h3>5.2 The ACRisk Score as Fluid Factor</h3>
  <p>
    We now make the connection explicit. The ACRisk score for an attention head <em>is</em> a generalized fluid factor:
  </p>
  <p style="text-align: center; font-family: monospace; font-size: 1.1em; margin: 1.5em 0;">
    ACRisk<sub>h</sub> = w<sub>1</sub>·U<sub>phys</sub> + w<sub>2</sub>·(1 − D<sub>transform</sub>) + w<sub>3</sub>·B<sub>cog</sub>
  </p>
  <p>
    Just as the fluid factor ΔF measures deviation from the Mudrock line, ACRisk measures deviation from physically-governed attention. A head with high U<sub>phys</sub>, low D<sub>transform</sub>, and high B<sub>cog</sub> is a "Class III head"—it produces clean, interpretable, physically-grounded attention anomalies. A head with low scores across all axes is producing noise-correlated attention—the equivalent of a false bright spot.
  </p>

  <h3>5.3 Attention Head Classification</h3>
  <p>
    We propose an AVO-inspired classification of transformer attention heads in geophysical models:
  </p>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Head Class</th>
          <th style="text-align: left; padding: 8px;">ACRisk Profile</th>
          <th style="text-align: left; padding: 8px;">AVO Analog</th>
          <th style="text-align: left; padding: 8px;">Interpretation</th>
          <th style="text-align: left; padding: 8px;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Class I</td>
          <td style="padding: 8px; font-family: monospace;">High U<sub>phys</sub>, Moderate D<sub>transform</sub></td>
          <td style="padding: 8px;">High-impedance gas sand</td>
          <td style="padding: 8px;">Attends to real physical boundaries; may miss subtle fluid effects</td>
          <td style="padding: 8px; color: #4caf50;">Trust with calibration</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Class II</td>
          <td style="padding: 8px; font-family: monospace;">Moderate U<sub>phys</sub>, Low D<sub>transform</sub></td>
          <td style="padding: 8px;">Near-zero impedance contrast</td>
          <td style="padding: 8px;">Physically meaningful but subtle; easily drowned by noise heads</td>
          <td style="padding: 8px; color: #ff9800;">Flag for human review</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Class III</td>
          <td style="padding: 8px; font-family: monospace;">High U<sub>phys</sub>, Low D<sub>transform</sub>, High B<sub>cog</sub></td>
          <td style="padding: 8px;">Classic bright spot</td>
          <td style="padding: 8px;">Clean, interpretable, physically-grounded attention anomaly</td>
          <td style="padding: 8px; color: #4caf50;">Trust; use for interpretation</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Class IV</td>
          <td style="padding: 8px; font-family: monospace;">High U<sub>phys</sub>, High D<sub>transform</sub></td>
          <td style="padding: 8px;">Dimming-with-offset gas sand</td>
          <td style="padding: 8px;">Physically real but softmax-distorted; counter-intuitive attention pattern</td>
          <td style="padding: 8px; color: #f44336;">High risk of misinterpretation; requires cross-validation</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 4: Attention head classification inspired by Rutherford-Williams-Castagna AVO taxonomy. A "Class IV head" is the most dangerous: it attends to real physics but in a way that is easily misinterpreted—exactly like a Class IV AVO anomaly.</p>
</div>

<!-- 6. The Hallucination Theorem -->
<div class="paper-section">
  <h2>6. The Ungoverned Contrast Amplifier: A Theorem Sketch</h2>

  <h3>6.1 Softmax Will Always Amplify Something</h3>
  <p>
    Consider a set of N logits {e<sub>1</sub>, ..., e<sub>N</sub>} with mean ē and variance σ². The softmax output is:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    α<sub>i</sub> = exp(e<sub>i</sub>) / Σ<sub>j</sub> exp(e<sub>j</sub>)
  </p>
  <p>
    For any non-constant set of logits (σ² > 0), the softmax output <strong>must</strong> concentrate probability mass on some subset of keys. This is a mathematical necessity, not a model choice. The softmax function is a <em>contrast amplifier</em>: given any variation in inputs, it will amplify the variation into a non-uniform output distribution.
  </p>

  <h3>6.2 The Noise Amplification Lemma</h3>
  <p>
    <strong>Lemma (Noise Amplification):</strong> Let e<sub>i</sub> = s<sub>i</sub> + η<sub>i</sub>, where s<sub>i</sub> is the true signal component and η<sub>i</sub> ~ N(0, σ²<sub>η</sub>) is independent Gaussian noise. Then, for any finite N, there exists a noise realization where argmax<sub>i</sub> α<sub>i</sub> ≠ argmax<sub>i</sub> s<sub>i</sub>. That is, <strong>softmax can amplify noise into selection with non-zero probability.</strong>
  </p>
  <p>
    <em>Proof sketch:</em> The argmax of the softmax is identical to the argmax of the logits (softmax is monotonic). The argmax of noisy logits e<sub>i</sub> selects the maximum of {s<sub>i</sub> + η<sub>i</sub>}. Since η<sub>i</sub> has unbounded support, for any set of signal values {s<sub>i</sub>}, there is non-zero probability that η<sub>k</sub> is sufficiently large to make e<sub>k</sub> the maximum even when s<sub>k</sub> is not. ∎
  </p>

  <h3>6.3 The Governance Corollary</h3>
  <p>
    <strong>Corollary (Governance Necessity):</strong> An ungoverned softmax attention mechanism operating on noisy inputs will, with probability approaching 1 as the number of queries grows, produce at least one "hallucinated" attention peak—a high-confidence selection of a key whose signal component is not the true maximum.
  </p>
  <p>
    This is not a bug. It is not a flaw in the training data. It is a <strong>mathematical consequence of applying a contrast amplifier to noisy inputs without an external validation baseline.</strong> The only defense is Condition 3 of PCA: an external constraint that rejects outputs where the selected key's physical implications are inconsistent with known invariants.
  </p>
  <p>
    In geophysics, the Zoeppritz equations provide that external constraint. In constitutional AI, the F1–F13 floors provide it. In any domain where transformers are deployed for high-stakes decisions, an equivalent constraint <em>must</em> be constructed—or hallucination is guaranteed.
  </p>
</div>

<!-- 7. The Approximation Chain as Governance Ladder -->
<div class="paper-section">
  <h2>7. The Approximation Chain as Governance Ladder</h2>

  <h3>7.1 The Parallel Revisited</h3>
  <p>
    Essay #11 noted the structural parallel between the Zoeppritz → Aki–Richards → Shuey approximation chain and the full attention → linear attention → efficient attention chain. Here we extend the parallel to governance:
  </p>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Level</th>
          <th style="text-align: left; padding: 8px;">Geophysics</th>
          <th style="text-align: left; padding: 8px;">Attention ML</th>
          <th style="text-align: left; padding: 8px;">Governance Property</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Exact</td>
          <td style="padding: 8px;">Zoeppritz (4×4 matrix)</td>
          <td style="padding: 8px;">Full softmax O(N²)</td>
          <td style="padding: 8px; color: #4caf50;">Maximum fidelity; maximum cost; <strong>governable</strong> (physical constraint available)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Linearized</td>
          <td style="padding: 8px;">Aki–Richards (small contrast)</td>
          <td style="padding: 8px;">Linear attention φ(Q)φ(K)<sup>T</sup></td>
          <td style="padding: 8px; color: #ff9800;">Tractable; breaks under extreme conditions; <strong>partially governable</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Interpretable</td>
          <td style="padding: 8px;">Shuey A + B sin²θ</td>
          <td style="padding: 8px;">FlashAttention / efficient variants</td>
          <td style="padding: 8px; color: #f44336;">Fast; deployable; <strong>governance must be external</strong> (physics not in the model)</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 5: The approximation-governance ladder. As you descend the approximation chain, you gain speed and lose intrinsic physical fidelity. Governance must become more explicit and external to compensate.</p>

  <h3>7.2 The Governance Principle</h3>
  <p>
    The principle is: <strong>the further you approximate, the stronger your external governance must be.</strong>
  </p>
  <p>
    Shuey's two-term approximation works brilliantly for Class III sands at moderate angles—and fails catastrophically for Class IV sands at wide angles. The geophysicist knows this and adjusts her interpretation accordingly. She does not deploy Shuey blindly. She cross-validates against well control, checks the angle range, and switches to exact Zoeppritz when the approximation breaks.
  </p>
  <p>
    The ML engineer deploying FlashAttention on a trillion-token corpus has no equivalent discipline. The approximation (IO-optimized attention) is treated as equivalent to the exact computation. There is no "angle range check" for attention. There is no "well control" for transformer outputs. There is no mechanism to detect when the approximation has broken and escalate to the exact solution.
  </p>
  <p>
    PCA provides this mechanism. The external baseline and physical consistency conditions remain valid regardless of which approximation level is deployed. If FlashAttention produces an attention distribution that violates the physical constraint, it is rejected—even if the computation was IO-optimal.
  </p>
</div>

<!-- 8. Construction: Building a PCA Head -->
<div class="paper-section">
  <h2>8. Construction: How to Build a Governed Attention Head</h2>

  <h3>8.1 The PCA Architecture</h3>
  <p>
    We now provide a concrete architecture for a Physics-Constrained Attention head. This is not speculative; it is a direct engineering specification derived from the AVO-attention equivalence.
  </p>

  <div style="border: 1px solid var(--forge-iron); padding: 1.5em; margin: 1.5em 0;">
    <p><strong>PCA Head(h) Forward Pass:</strong></p>
    <ol>
      <li><strong>Standard attention:</strong> Compute e<sub>i</sub> = q·k<sub>i</sub> / √d<sub>k</sub>, then α<sub>i</sub> = softmax(e<sub>i</sub>). This is the ungoverned attention distribution.</li>
      <li><strong>Baseline retrieval:</strong> Retrieve the calibrated baseline distribution β = B(x) for this input context x. For seismic data, β is derived from the Mudrock line plus the known elastic properties of brine-saturated rock at this depth. For other domains, β comes from the domain-specific invariant.</li>
      <li><strong>Residual computation:</strong> Compute the fluid factor analog: R<sub>h</sub> = D<sub>KL</sub>(α || β) or R<sub>h</sub> = max<sub>i</sub> |α<sub>i</sub> − β<sub>i</sub>|. This is a scalar anomaly score for this attention head on this query.</li>
      <li><strong>Threshold check:</strong> If R<sub>h</sub> > τ<sub>h</sub>, flag this head's output for audit. The threshold τ<sub>h</sub> is calibrated on a validation set where "no anomaly" is known to be true (brine sands, healthy anatomy, compliant legal reasoning).</li>
      <li><strong>Physical consistency (optional, domain-dependent):</strong> If a forward model exists (Zoeppritz, anatomical simulator, legal precedent graph, accounting identity), pass the model's output through it. If the forward-modeled output deviates from the observed input beyond a calibrated tolerance, reject the output regardless of attention confidence.</li>
    </ol>
  </div>

  <h3>8.2 Calibrating the Threshold</h3>
  <p>
    The threshold τ<sub>h</sub> is not a hyperparameter to be tuned on the test set. It is a <strong>physical constant</strong> derived from the noise characteristics of the measurement system and the expected variability of the baseline. In AVO terms: the Mudrock line has scatter. Brine sands do not fall exactly on the line; they form a cloud around it. The fluid factor threshold is set by the width of that cloud. The same principle applies to PCA: τ<sub>h</sub> is set by the empirical distribution of R<sub>h</sub> on a calibration dataset where "no anomaly" is independently verified.
  </p>
  <p>
    This calibration step is essential and cannot be automated away. Someone—a geophysicist, a radiologist, a lawyer, an auditor—must define what "normal" looks like, empirically, with ground truth independent of the model.
  </p>
</div>

<!-- 9. Implications for the ML Community -->
<div class="paper-section">
  <h2>9. What the ML Community Must Learn from Geophysics</h2>

  <h3>9.1 Bright Spots Are Not Always Gas</h3>
  <p>
    Every exploration geophysicist learns this the hard way. A Class III AVO anomaly—high negative intercept, strong negative gradient, textbook bright spot—can be produced by:
  </p>
  <ul>
    <li>Low-impedance brine sands (false positive)</li>
    <li>Coal seams (very low impedance, strong AVO response)</li>
    <li>Organic-rich shales (low impedance, anisotropic)</li>
    <li>Tuning effects from thin-bed interference (constructive wavelet superposition)</li>
    <li>Acquisition footprint (systematic amplitude variation unrelated to geology)</li>
  </ul>
  <p>
    The geophysicist does not drill a bright spot. She drills a bright spot that <em>survives</em> cross-validation against the Mudrock line, well control, elastic inversion, and (in high-stakes cases) exact Zoeppritz modeling.
  </p>

  <h3>9.2 Attention Peaks Are Not Always Signal</h3>
  <p>
    The ML community has not yet internalized this lesson. An attention weight of 0.95 on a token looks like a confident, interpretable decision. It may be:
  </p>
  <ul>
    <li>A syntactically prominent but semantically irrelevant token (the "coal seam" of NLP)</li>
    <li>A positional encoding artifact (the "tuning effect" of transformers)</li>
    <li>An adversarial perturbation in the input embedding (the "acquisition footprint")</li>
    <li>A spurious correlation amplified by softmax (the "false bright spot")</li>
  </ul>
  <p>
    The PCA framework provides the cross-validation that ML currently lacks. It says: <strong>do not trust the attention weight. Trust the attention weight only after it has survived an external, calibrated, physical validation.</strong>
  </p>

  <h3>9.3 The Bitter Lesson, Extended</h3>
  <p>
    Rich Sutton's Bitter Lesson (2019) observed that general methods leveraging computation beat domain-specific hand-crafted approaches in AI. The corollary we add: <strong>general methods that leverage computation also inherit general failure modes.</strong> The softmax attention mechanism is a general method. Its general failure mode is that it will amplify any variation—signal or noise—into a confident selection. Domain-specific physics constraints are not "hand-crafted features" in Sutton's sense. They are <strong>external validation baselines</strong> that are true regardless of how much computation you throw at the problem. The Zoeppritz equations are true whether you compute them with a 1919 pencil or a 2026 GPU cluster.
  </p>
</div>

<!-- 10. Conclusion -->
<div class="paper-section">
  <h2>10. Conclusion: The Governor Is Not Optional</h2>

  <p>
    This paper extends the AVO-attention equivalence established in Essay #11 from description to prescription. The key conclusions are:
  </p>

  <ol>
    <li><strong>Transformer attention <em>is</em> a contrast amplifier.</strong> Softmax will amplify variation into confident selection. If the variation is signal, the selection is correct. If the variation is noise, the selection is hallucination. The mechanism does not distinguish between these cases—it cannot, because it has no external referent.</li>

    <li><strong>The AVO community solved this problem forty years ago.</strong> They did it with the Mudrock line (calibrated baseline), the fluid factor (residual computation), AVO classification (anomaly taxonomy), and—when stakes are high enough—exact Zoeppritz forward modeling (physical consistency constraint). These are not heuristics. They are the engineering controls that make contrast detection reliable.</li>

    <li><strong>The BPI-ViT architecture partially implements these controls</strong> and demonstrates their effectiveness: physics-constrained attention produces better inversions with calibrated uncertainty. But BPI-ViT is specific to seismic data. The PCA framework generalizes the principle to any domain.</li>

    <li><strong>Every high-stakes transformer deployment needs a Mudrock line.</strong> Medical imaging needs an anatomical atlas. Legal AI needs a precedent graph. Financial AI needs no-arbitrage conditions. Constitutional AI (arifOS) uses F1–F13 floors. Without an external baseline, the contrast amplifier will eventually amplify noise into confident falsehood. It is not a question of <em>if</em>. It is a question of <em>when</em> and <em>how badly</em>.</li>

    <li><strong>The approximation-governance tradeoff is fundamental.</strong> The more you approximate the attention computation (linear attention, FlashAttention, sparse attention), the stronger your external governance must be. Approximation gains speed at the cost of fidelity. Governance must compensate.</li>
  </ol>

  <div style="border-left: 3px solid var(--forge-gold); padding: 1em 1.5em; margin: 2em 0; background: rgba(212, 175, 55, 0.05);">
    <p style="margin: 0;"><strong>FINAL VERDICT:</strong> A transformer without physics-constrained attention is a sports car without brakes. It will go fast. It will look impressive. And eventually, it will crash. The Zoeppritz equations are not just a physics prior for seismic inversion. They are the proof-of-concept that external, falsifiable, physical constraints can govern attention without crippling it. The arifOS constitutional floors extend this proof-of-concept to agent behavior. The principle is universal: <strong>contrast amplification requires governance. The governor is not optional.</strong></p>
  </div>
</div>

<!-- Acknowledgments -->
<div class="paper-section">
  <h2>Acknowledgments</h2>
  <p>
    This work builds on the AVO-attention equivalence framework established in Essay #11. The author acknowledges the independent convergence of Pi-Transformer (Maleki & Pourmoazemi, 2025) and Anomaly Transformer (Xu et al., 2022, ICLR) on the same contrast-extraction primitive, without which the universality claim would be weaker. The arifOS constitutional floor architecture (F1–F13) provides the governance generalization. John Castagna, Herb Swan, George Smith, and Peter Gidlow—geophysicists who built the AVO edifice decades before transformers existed—deserve credit they will never receive from the ML community. This paper attempts to partially rectify that.
  </p>
  <p>
    <strong>DITEMPA BUKAN DIBERI — Forged, Not Given.</strong>
  </p>
</div>

<!-- References -->
<div class="paper-section">
  <h2>References</h2>
  <ol class="references text-sm">
    <li>Aki, K., &amp; Richards, P. G. (1980). <em>Quantitative Seismology: Theory and Methods</em>. W. H. Freeman.</li>
    <li>Castagna, J. P., Batzle, M. L., &amp; Eastwood, R. L. (1985). Relationships between compressional-wave and shear-wave velocities in clastic silicate rocks. <em>Geophysics</em>, 50(4), 571–581.</li>
    <li>Castagna, J. P., &amp; Swan, H. W. (1997). Principles of AVO crossplotting. <em>The Leading Edge</em>, 16(4), 337–344.</li>
    <li>Castagna, J. P., Swan, H. W., &amp; Foster, D. J. (1998). Framework for AVO gradient and intercept interpretation. <em>Geophysics</em>, 63(3), 948–956.</li>
    <li>Chen, Y., et al. (2024–2025). A Physics-aware Bayesian Vision Transformer for Seismic AVO Inversion: Towards an Embodied Structural Intelligence Framework with Structure-aware Uncertainty Modeling. <em>ResearchGate preprints</em>.</li>
    <li>Dao, T., Fu, D. Y., Ermon, S., Rudra, A., &amp; Ré, C. (2022). FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness. <em>Advances in Neural Information Processing Systems</em>, 35.</li>
    <li>Fatti, J. L., Smith, G. C., Vail, P. J., Strauss, P. J., &amp; Levitt, P. R. (1994). Detection of gas in sandstone reservoirs using AVO analysis: A 3-D seismic case history using the Geostack technique. <em>Geophysics</em>, 59(9), 1362–1376.</li>
    <li>Katharopoulos, A., Vyas, A., Pappas, N., &amp; Fleuret, F. (2020). Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention. <em>Proceedings of ICML 2020</em>. arXiv:2006.16236.</li>
    <li>Maleki, S., &amp; Pourmoazemi, A. (2025). Pi-Transformer: Physics-Informed Prior Attention for Anomaly Detection in Time Series. <em>arXiv:2509.19985</em>.</li>
    <li>Rutherford, S. R., &amp; Williams, R. H. (1989). Amplitude-versus-offset variations in gas sands. <em>Geophysics</em>, 54(6), 680–688.</li>
    <li>Shuey, R. T. (1985). A simplification of the Zoeppritz equations. <em>Geophysics</em>, 50(4), 609–614.</li>
    <li>Smith, G. C., &amp; Gidlow, P. M. (1987). Weighted stacking for rock property estimation and detection of gas. <em>Geophysical Prospecting</em>, 35(9), 993–1014.</li>
    <li>Sutton, R. (2019). The Bitter Lesson. <em>Incomplete Ideas (blog)</em>.</li>
    <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I. (2017). Attention Is All You Need. <em>Advances in Neural Information Processing Systems</em>, 30.</li>
    <li>Xu, J., Wu, H., Wang, J., &amp; Long, M. (2022). Anomaly Transformer: Time Series Anomaly Detection with Association Discrepancy. <em>International Conference on Learning Representations (ICLR)</em>. arXiv:2110.02642.</li>
    <li>Zoeppritz, K. (1919). Über Erdbebenwellen VII B. Über Reflexion und Durchgang seismischer Wellen durch Unstetigkeitsflächen. <em>Nachrichten von der Königlichen Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-physikalische Klasse</em>, 66–84.</li>
    <li>Fazil, M. A. (2026). Contrast-Governed Anomaly Detection: A Formal Bridge between Seismic AVO and Transformer Attention. <em>arif-fazil.com/essays/</em>, Essay #11.</li>
  </ol>
</div>

</article>
  
