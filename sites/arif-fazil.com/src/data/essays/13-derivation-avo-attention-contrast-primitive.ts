// Direct publication on arif-fazil.com — not sourced from Medium.
// Essay #13 — completes the trilogy with rigorous derivation.
// CLAIM. Not peer-reviewed. Awaiting adversarial review.
import type { EssayContent } from './types';

const content: EssayContent = {
  title: `The Contrast Primitive Derivation: A Rigorous Mapping of Seismic AVO Fluid Factor onto Transformer Attention Residual — Completing the Trilogy`,
  date: '2026-06-05',
  slug: 'contrast-primitive-derivation-avo-fluid-factor-attention-residual',
  tags: ["geophysics", "machine-learning", "attention", "avo", "contrast-detection", "transformers", "mathematical-derivation", "fluid-factor", "softmax", "governance"],
  excerpt: `The third and final paper in the EUREKA trilogy. We present the explicit, step-by-step mathematical derivation establishing the structural equivalence between the AVO fluid factor ΔF and the transformer attention logit residual δᵢ. Starting from the exact Zoeppritz equations through the Aki–Richards linearization and Shuey two-term approximation, and in parallel from the scaled dot-product attention mechanism through softmax normalization, we derive both contrast operators in a shared notational framework. We provide a first-order Taylor expansion proving that both systems compute a residual against a calibrated baseline, then amplify deviations. Every condition, every assumption, and every boundary of equivalence is explicitly stated. This paper is the mathematical lock-in: the skeleton, bone by bone, with every joint labeled.`,
  mediumUrl: '',
  isDirectPublication: true,
  html: `<!-- Abstract -->
<div class="paper-section">
  <h2>Abstract</h2>
  <p>
    This paper presents the explicit, step-by-step mathematical derivation establishing the structural equivalence between the seismic AVO fluid factor ΔF (Smith &amp; Gidlow, 1987; Fatti et al., 1994) and the transformer attention logit residual δ<sub>i</sub> (Vaswani et al., 2017). We trace both formalisms from their exact foundations—the Zoeppritz equations for AVO, the scaled dot-product attention for transformers—through their respective linearizations and approximations, to their operational forms. In a shared notational framework, we derive both contrast operators and prove via first-order Taylor expansion that each implements a three-stage primitive: <strong>extract features, compute residual against a calibrated baseline, amplify deviations</strong>. The AVO residual ΔB = B<sub>obs</sub> − (mA<sub>obs</sub> + c) and the attention residual δ<sub>i</sub> = e<sub>i</sub> − ē are shown to play identical structural roles. We explicitly state every condition under which the mapping holds and every boundary at which it breaks. This paper is the mathematical lock-in for the EUREKA announced in Essay #11 and the governance framework proposed in Essay #12.
  </p>
</div>

<!-- 0. Trilogy Structure -->
<div class="paper-section">
  <h2>0. Position in the Trilogy</h2>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Essay</th>
          <th style="text-align: left; padding: 8px;">Title</th>
          <th style="text-align: left; padding: 8px;">Function</th>
          <th style="text-align: left; padding: 8px;">Question Answered</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">#11</td>
          <td style="padding: 8px;">Contrast-Governed Anomaly Detection: A Formal Bridge</td>
          <td style="padding: 8px;">The EUREKA — structural mapping</td>
          <td style="padding: 8px; font-style: italic;">What is the connection?</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">#12</td>
          <td style="padding: 8px;">Physics-Constrained Attention: Zoeppritz as Constitutional Floor</td>
          <td style="padding: 8px;">The consequences — governance, hallucination prevention</td>
          <td style="padding: 8px; font-style: italic;">So what? What must we build?</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">#13</td>
          <td style="padding: 8px;">The Contrast Primitive Derivation (this paper)</td>
          <td style="padding: 8px;">The mathematical lock-in — bone-by-bone proof</td>
          <td style="padding: 8px; font-style: italic;">How exactly? Prove it.</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 0: The trilogy architecture. This paper (#13) supplies the rigorous derivation that #11 gestured toward and #12 built upon.</p>

  <p>
    This paper is self-contained. The reader need not have read Essays #11 or #12. All notation is defined from first principles. All derivations proceed step by step. Every equation carries its assumptions explicitly.
  </p>
</div>

<!-- 1. Notation and Preliminaries -->
<div class="paper-section">
  <h2>1. Notation and Preliminaries</h2>

  <h3>1.1 AVO-Side Notation</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; margin: 1em 0;">
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">R(θ)</td><td style="padding: 4px 8px;">P-wave reflection coefficient at incidence angle θ</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">V<sub>p</sub>, V<sub>s</sub>, ρ</td><td style="padding: 4px 8px;">Compressional velocity, shear velocity, bulk density</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">ΔV<sub>p</sub>/V<sub>p</sub>, etc.</td><td style="padding: 4px 8px;">Fractional elastic contrast across the interface</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">A</td><td style="padding: 4px 8px;">AVO intercept — normal-incidence reflectivity R(0)</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">B</td><td style="padding: 4px 8px;">AVO gradient — coefficient of sin²θ in Shuey two-term</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">m, c</td><td style="padding: 4px 8px;">Mudrock line parameters: B<sub>bg</sub> = mA + c (Castagna et al., 1985)</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">ΔB</td><td style="padding: 4px 8px;">Contrast residual: B<sub>obs</sub> − B<sub>bg</sub>(A<sub>obs</sub>)</td></tr>
    <tr><td style="padding: 4px 8px; font-family: monospace;">ΔF</td><td style="padding: 4px 8px;">Fluid factor: weighted combination of R<sub>p</sub> and R<sub>s</sub> (Smith & Gidlow, 1987)</td></tr>
  </table>

  <h3>1.2 Attention-Side Notation</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; margin: 1em 0;">
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">q, k<sub>j</sub></td><td style="padding: 4px 8px;">Query vector, j-th key vector ∈ ℝ<sup>d<sub>k</sub></sup></td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">N</td><td style="padding: 4px 8px;">Number of keys</td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">e<sub>j</sub></td><td style="padding: 4px 8px;">Alignment logit: e<sub>j</sub> = q·k<sub>j</sub> / √d<sub>k</sub></td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">ē</td><td style="padding: 4px 8px;">Mean logit: ē = (1/N) Σ<sub>j</sub> e<sub>j</sub></td></tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px; font-family: monospace;">δ<sub>j</sub></td><td style="padding: 4px 8px;">Logit residual: δ<sub>j</sub> = e<sub>j</sub> − ē</td></tr>
    <tr><td style="padding: 4px 8px; font-family: monospace;">α<sub>j</sub></td><td style="padding: 4px 8px;">Attention weight: α<sub>j</sub> = softmax(e<sub>j</sub>)</td></tr>
  </table>
</div>

<!-- 2. AVO Contrast Operator -->
<div class="paper-section">
  <h2>2. The AVO Contrast Operator — Full Derivation</h2>

  <h3>2.1 Exact Physics: Zoeppritz (1919)</h3>
  <p>
    When a plane P-wave impinges on a planar elastic interface at angle θ, four wave modes are generated: reflected P, reflected SV, transmitted P, transmitted SV. Conservation of energy and continuity of displacement and stress across the interface yield a 4×4 linear system:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    <strong>M</strong>(θ, V<sub>p1</sub>, V<sub>s1</sub>, ρ<sub>1</sub>, V<sub>p2</sub>, V<sub>s2</sub>, ρ<sub>2</sub>) · <strong>R</strong> = <strong>b</strong>(θ)
  </p>
  <p>
    where <strong>R</strong> = [R<sub>P</sub>, R<sub>S</sub>, T<sub>P</sub>, T<sub>S</sub>]<sup>T</sup> contains the four unknown reflection and transmission coefficients. The matrix <strong>M</strong> is dense with trigonometric functions of all four wave angles and elastic property ratios. The solution is exact but algebraically opaque: R<sub>P</sub>(θ) is a rational function of six elastic parameters and θ, with no separation of V<sub>p</sub>, V<sub>s</sub>, and ρ contributions.
  </p>

  <h3>2.2 Linearization: Aki–Richards (1980)</h3>
  <p>
    <strong>Assumption 1 (Small contrasts):</strong> |ΔV<sub>p</sub>/V<sub>p</sub>| ≪ 1, |ΔV<sub>s</sub>/V<sub>s</sub>| ≪ 1, |Δρ/ρ| ≪ 1.
  </p>
  <p>
    Under Assumption 1, the Zoeppritz system linearizes to first order in the fractional contrasts. The Aki–Richards approximation expresses R(θ) as a weighted sum of three independent contrast terms:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    R(θ) ≈ ½(ΔV<sub>p</sub>/V<sub>p</sub> + Δρ/ρ)(1 + tan²θ) − 2(V<sub>s</sub>/V<sub>p</sub>)²(ΔV<sub>s</sub>/V<sub>s</sub> + ½Δρ/ρ) sin²θ + ½(Δρ/ρ)(1 − 4(V<sub>s</sub>/V<sub>p</sub>)² sin²θ)
  </p>
  <p>
    Term 1: P-velocity + density contrast (dominates near-normal). Term 2: S-velocity contrast (dominates at mid-angles). Term 3: Density contrast (small at moderate angles).
  </p>

  <h3>2.3 Interpretable Form: Shuey (1985)</h3>
  <p>
    Shuey substituted Poisson's ratio σ for V<sub>s</sub> and reorganized Aki–Richards into angle-separated terms:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    R(θ) ≈ A + B sin²θ + C sin²θ tan²θ
  </p>
  <p>where:</p>
  <p style="text-align: center; font-family: monospace; margin: 0.5em 0;">
    A = R(0) = ½(ΔV<sub>p</sub>/V<sub>p</sub> + Δρ/ρ)
  </p>
  <p style="text-align: center; font-family: monospace; margin: 0.5em 0;">
    B = ½(ΔV<sub>p</sub>/V<sub>p</sub>) − 4(V<sub>s</sub>/V<sub>p</sub>)²(ΔV<sub>s</sub>/V<sub>s</sub>) − 2(V<sub>s</sub>/V<sub>p</sub>)²(Δρ/ρ)
  </p>
  <p style="text-align: center; font-family: monospace; margin: 0.5em 0;">
    C = ½(ΔV<sub>p</sub>/V<sub>p</sub>)(tan²θ − sin²θ) / (sin²θ tan²θ) ≈ ½(ΔV<sub>p</sub>/V<sub>p</sub>) at wide angles
  </p>

  <p>
    <strong>Assumption 2 (Moderate angles):</strong> θ ≲ 30°. Then sin²θ tan²θ ≪ sin²θ and the C-term is negligible.
  </p>
  <p>
    Under Assumption 2, the <strong>two-term Shuey approximation</strong> is the workhorse:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    R(θ) ≈ A + B sin²θ
  </p>

  <h3>2.4 The Background: Mudrock Line (Castagna et al., 1985)</h3>
  <p>
    For brine-saturated clastic rocks, V<sub>p</sub> and V<sub>s</sub> follow an empirical linear relationship. This propagates through Shuey's coefficients to yield a linear relationship between A and B for non-anomalous (brine-saturated) reflectors:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    B<sub>bg</sub>(A) = m·A + c
  </p>
  <p>
    where m (negative) and c are calibrated from well-log data or regional rock-physics trends. For the Wiggins et al. (1983) constant V<sub>p</sub>/V<sub>s</sub> = 2.0 case, m = −1 under the approximation B ≈ A − 2R<sub>s</sub>.
  </p>

  <h3>2.5 The AVO Contrast Residual</h3>
  <p>
    For an observed reflector with extracted attributes (A<sub>obs</sub>, B<sub>obs</sub>):
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.15em;">
    <strong>ΔB = B<sub>obs</sub> − B<sub>bg</sub>(A<sub>obs</sub>) = B<sub>obs</sub> − m·A<sub>obs</sub> − c</strong>
  </p>
  <p>
    <strong>Property 1:</strong> If the reflector is brine-saturated and on the Mudrock line, ΔB ≈ 0.<br>
    <strong>Property 2:</strong> If the reflector contains hydrocarbons, Poisson's ratio drops, V<sub>p</sub>/V<sub>s</sub> decreases, and |ΔB| > 0.
  </p>
  <p>
    The operation is: <strong>subtract the expected background, keep the deviation.</strong>
  </p>

  <h3>2.6 Fluid Factor: A Specific Projection (Smith & Gidlow, 1987)</h3>
  <p>
    The fluid factor re-projects the (A, B) or (R<sub>p</sub>, R<sub>s</sub>) pair onto a "fluid-sensitive" axis orthogonal to the brine trend:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    ΔF = R<sub>p</sub> − (1.16 / γ) R<sub>s</sub>
  </p>
  <p>
    where γ = V<sub>p</sub>/V<sub>s</sub> (background) and 1.16 is the Mudrock slope. By construction: ΔF ≈ 0 for brine; |ΔF| > 0 for gas. The fluid factor is a <em>specific linear combination</em> of the same residual ΔB expressed in reflectivity coordinates. Both share the identical structure:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    <strong>Residual = Observation − Calibrated_Baseline(Observation)</strong>
  </p>

  <h3>2.7 Anomaly Classification</h3>
  <p>
    Rutherford &amp; Williams (1989) and Castagna &amp; Swan (1997) classify reflectors on the A–B plane:
  </p>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.85em; margin: 1em 0;">
    <thead><tr style="border-bottom: 2px solid var(--forge-gold);"><th style="padding: 4px 8px; text-align: left;">Class</th><th style="padding: 4px 8px; text-align: left;">A (Intercept)</th><th style="padding: 4px 8px; text-align: left;">B (Gradient)</th><th style="padding: 4px 8px; text-align: left;">ΔB</th></tr></thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px;">I</td><td style="padding: 4px 8px;">High +</td><td style="padding: 4px 8px;">Negative</td><td style="padding: 4px 8px;">Below Mudrock line</td></tr>
      <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px;">II</td><td style="padding: 4px 8px;">~Zero</td><td style="padding: 4px 8px;">Negative</td><td style="padding: 4px 8px;">Below Mudrock line</td></tr>
      <tr style="border-bottom: 1px solid var(--forge-iron);"><td style="padding: 4px 8px;">III</td><td style="padding: 4px 8px;">High −</td><td style="padding: 4px 8px;">Negative</td><td style="padding: 4px 8px;">Far below Mudrock line</td></tr>
      <tr><td style="padding: 4px 8px;">IV</td><td style="padding: 4px 8px;">High −</td><td style="padding: 4px 8px;">Positive</td><td style="padding: 4px 8px;">Above Mudrock line (counter-intuitive)</td></tr>
    </tbody>
  </table>

  <p>
    The classification rule is a threshold on ΔB: <strong>Anomaly = Θ(|ΔB| − τ)</strong> where Θ is a step function and τ is a calibrated cutoff.
  </p>

  <h3>2.8 AVO Primitive Summary</h3>
  <div style="border: 1px solid var(--forge-iron); padding: 1.5em; margin: 1.5em 0;">
    <p style="margin: 0;"><strong>Stage 1 — Extract:</strong> (A<sub>obs</sub>, B<sub>obs</sub>) from pre-stack gathers via Shuey two-term fit.<br>
    <strong>Stage 2 — Residual:</strong> ΔB = B<sub>obs</sub> − (m·A<sub>obs</sub> + c). Zero on background, non-zero off.<br>
    <strong>Stage 3 — Amplify/Classify:</strong> |ΔB| > τ → anomaly flagged (Class I–IV).</p>
  </div>
  <p>
    The amplification function Θ is <strong>linear thresholding</strong>. The signal <em>is</em> the residual.
  </p>
</div>

<!-- 3. Attention Contrast Operator -->
<div class="paper-section">
  <h2>3. The Attention Contrast Operator — Full Derivation</h2>

  <h3>3.1 Exact Mechanism: Scaled Dot-Product Attention (Vaswani et al., 2017)</h3>
  <p>
    Given a query q ∈ ℝ<sup>d<sub>k</sub></sup> and N keys {k<sub>1</sub>, …, k<sub>N</sub>} ⊂ ℝ<sup>d<sub>k</sub></sup>, the scaled dot-product attention computes:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    Attention(q, K, V) = Σ<sub>j=1</sub><sup>N</sup> α<sub>j</sub> v<sub>j</sub>
  </p>
  <p>where the attention weights are:</p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    α<sub>j</sub> = softmax(e<sub>j</sub>) = exp(e<sub>j</sub>) / Σ<sub>i=1</sub><sup>N</sup> exp(e<sub>i</sub>)
  </p>
  <p>with alignment logits:</p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    e<sub>j</sub> = (q · k<sub>j</sub>) / √d<sub>k</sub>
  </p>
  <p>
    The √d<sub>k</sub> scaling prevents the dot product from growing with dimension and pushing softmax into saturated (near-one-hot) regimes. This is the full, exact attention computation — O(N²) in key count, with an exponential nonlinearity.
  </p>

  <h3>3.2 Softmax as Contrast Amplifier</h3>
  <p>
    The softmax function has two essential properties relevant to our mapping:
  </p>
  <p>
    <strong>Property 1 (Normalization):</strong> Σ<sub>j</sub> α<sub>j</sub> = 1. The output is a valid probability distribution.<br>
    <strong>Property 2 (Exponential amplification):</strong> ∂α<sub>i</sub>/∂e<sub>i</sub> = α<sub>i</sub>(1 − α<sub>i</sub>). The gradient is maximal at α<sub>i</sub> = 0.5 and vanishes as α<sub>i</sub> → 0 or 1. This means softmax <em>disproportionately</em> amplifies differences between the largest logits while suppressing small ones.
  </p>
  <p>
    The softmax is not merely a normalization — it is a <strong>contrast amplifier</strong>. Given any variation in {e<sub>j</sub>}, it concentrates probability mass onto the maximum. The larger the spread of logits, the more extreme the concentration.
  </p>

  <h3>3.3 The Baseline: Uniform Attention</h3>
  <p>
    <strong>Definition (Uniform Baseline):</strong> When all keys are equally relevant to the query, the logits are identical:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    e<sub>1</sub> = e<sub>2</sub> = … = e<sub>N</sub> = E (constant)
  </p>
  <p>
    Then ē = E, all residuals δ<sub>j</sub> = 0, and:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    α<sub>j</sub> = exp(E) / (N·exp(E)) = 1/N &emsp; for all j
  </p>
  <p>
    The uniform distribution α<sub>j</sub> = 1/N is the <strong>attention Mudrock line</strong>: the expected attention distribution under the null hypothesis of "no salient key." Every key receives equal weight. Nothing stands out.
  </p>

  <h3>3.4 Single Salient Key: The Canonical Anomaly</h3>
  <p>
    Introduce one anomalous key. Let k<sub>1</sub> have alignment e<sub>1</sub> = E + δ with δ > 0, while the remaining N−1 keys stay at baseline E.
  </p>
  <p>
    <strong>Mean logit:</strong> ē = [(E + δ) + (N−1)E] / N = E + δ/N
  </p>
  <p>
    <strong>Logit residual for the salient key:</strong>
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    δ<sub>1</sub> = e<sub>1</sub> − ē = (E + δ) − (E + δ/N) = <strong>(N−1)/N · δ</strong>
  </p>
  <p>
    The residual δ<sub>1</sub> is proportional to δ, scaled by (N−1)/N. For large N, δ<sub>1</sub> ≈ δ. The residual <em>is</em> the deviation from the uniform baseline.
  </p>
  <p>
    <strong>Attention weight for the salient key:</strong>
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    α<sub>1</sub> = exp(E + δ) / [exp(E + δ) + (N−1)exp(E)]
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.15em;">
    <strong>α<sub>1</sub> = 1 / [1 + (N−1)exp(−δ)]</strong>
  </p>
  <p>
    This is the exact closed form for the single-salient-key case. Three regimes:
  </p>
  <ul>
    <li><strong>δ = 0:</strong> α<sub>1</sub> = 1/N (uniform baseline)</li>
    <li><strong>δ ≪ 1 (small contrast):</strong> α<sub>1</sub> ≈ 1/N + (N−1)/N² · δ (linear regime)</li>
    <li><strong>δ ≫ 1 (strong contrast):</strong> α<sub>1</sub> → 1 (winner-take-most saturation)</li>
  </ul>

  <h3>3.5 First-Order Taylor Expansion</h3>
  <p>
    Expand α<sub>1</sub>(δ) around δ = 0:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    α<sub>1</sub>(0) = 1/N
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0;">
    α'<sub>1</sub>(0) = (N−1)exp(0) / [1 + (N−1)]² = (N−1)/N²
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.1em;">
    <strong>α<sub>1</sub>(δ) = 1/N + (N−1)/N² · δ + O(δ²)</strong>
  </p>
  <p>
    <strong>Interpretation:</strong> For small deviations from uniform, the attention weight grows <em>linearly</em> with δ. The slope is (N−1)/N², which decreases with N — larger key sets require larger δ to achieve the same α<sub>1</sub>. This is the attention analog of the fact that a Class II anomaly (near-zero A, small ΔB) is harder to detect than a Class III anomaly (large negative A, large |ΔB|).
  </p>

  <h3>3.6 The Attention Contrast Residual</h3>
  <p>
    In the general case (non-uniform baseline, multiple keys with non-zero δ<sub>j</sub>), the attention weight for key i is:
  </p>
  <p style="text-align: center; font-family: monospace; margin: 1em 0; font-size: 1.15em;">
    <strong>α<sub>i</sub> = softmax(δ<sub>i</sub>) = exp(δ<sub>i</sub>) / Σ<sub>j</sub> exp(δ<sub>j</sub>)</strong>
  </p>
  <p>
    where δ<sub>i</sub> = e<sub>i</sub> − ē is the residual.
  </p>
  <p>
    <strong>Property 1':</strong> If all δ<sub>j</sub> = 0, α<sub>i</sub> = 1/N for all i (uniform — "on the Mudrock line").<br>
    <strong>Property 2':</strong> If |δ<sub>i</sub>| ≫ |δ<sub>j≠i</sub>|, then α<sub>i</sub> → 1 (winner-take-most — "Class III bright spot").
  </p>

  <h3>3.7 Attention Primitive Summary</h3>
  <div style="border: 1px solid var(--forge-iron); padding: 1.5em; margin: 1.5em 0;">
    <p style="margin: 0;"><strong>Stage 1 — Extract:</strong> e<sub>j</sub> = q·k<sub>j</sub>/√d<sub>k</sub> (per-key alignment).<br>
    <strong>Stage 2 — Residual:</strong> δ<sub>j</sub> = e<sub>j</sub> − ē, where ē = (1/N)Σ<sub>j</sub> e<sub>j</sub>. Zero on uniform baseline, non-zero for salient keys.<br>
    <strong>Stage 3 — Amplify/Classify:</strong> α<sub>j</sub> = softmax(δ<sub>j</sub>) = exp(δ<sub>j</sub>)/Σ<sub>i</sub> exp(δ<sub>i</sub>). Exponential amplification of large residuals.</p>
  </div>
  <p>
    The amplification function is <strong>exponential softmax</strong> — stronger than AVO's linear threshold, same structural role. The signal <em>is</em> the residual, exponentially amplified.
  </p>
</div>

<!-- 4. The Mapping -->
<div class="paper-section">
  <h2>4. The Formal Mapping</h2>

  <h3>4.1 Component-by-Component Equivalence</h3>
  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Stage</th>
          <th style="text-align: left; padding: 8px;">AVO</th>
          <th style="text-align: left; padding: 8px;">Attention</th>
          <th style="text-align: left; padding: 8px;">Structural Role</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Feature Extraction</td>
          <td style="padding: 8px; font-family: monospace;">A (intercept), B (gradient)</td>
          <td style="padding: 8px; font-family: monospace;">e<sub>j</sub> = q·k<sub>j</sub>/√d<sub>k</sub></td>
          <td style="padding: 8px;">Project raw observation into comparable coordinates</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Baseline Model</td>
          <td style="padding: 8px; font-family: monospace;">B<sub>bg</sub>(A) = mA + c</td>
          <td style="padding: 8px; font-family: monospace;">ē = (1/N) Σ<sub>j</sub> e<sub>j</sub></td>
          <td style="padding: 8px;">Expected value under null hypothesis (no anomaly)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold; color: var(--forge-gold);">Contrast Residual</td>
          <td style="padding: 8px; font-family: monospace; color: var(--forge-gold); font-weight: bold;">ΔB = B<sub>obs</sub> − (mA<sub>obs</sub> + c)</td>
          <td style="padding: 8px; font-family: monospace; color: var(--forge-gold); font-weight: bold;">δ<sub>j</sub> = e<sub>j</sub> − ē</td>
          <td style="padding: 8px; color: var(--forge-gold); font-weight: bold;">Deviation from baseline — THE SIGNAL</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Amplification</td>
          <td style="padding: 8px; font-family: monospace;">Θ(|ΔB| − τ) — threshold</td>
          <td style="padding: 8px; font-family: monospace;">softmax(δ<sub>j</sub>) — exponential</td>
          <td style="padding: 8px;">Nonlinear function: zero near baseline, large for outliers</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Output</td>
          <td style="padding: 8px; font-family: monospace;">Class I–IV anomaly flag</td>
          <td style="padding: 8px; font-family: monospace;">α<sub>j</sub> ∈ [0,1], Σα<sub>j</sub> = 1</td>
          <td style="padding: 8px;">Anomaly classification / salience assignment</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 1: The complete stage-by-stage mapping. The contrast residual row (highlighted) is the core of the equivalence.</p>

  <h3>4.2 Unified Contrast Primitive</h3>
  <p>
    Both systems implement:
  </p>
  <p style="text-align: center; font-family: monospace; font-size: 1.15em; margin: 1.5em 0;">
    <strong>Output = Amplify( Observation − Baseline(Observation) )</strong>
  </p>
  <p>where:</p>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; margin: 1em 0;">
    <tr style="border-bottom: 1px solid var(--forge-iron);">
      <td style="padding: 4px 8px;"></td>
      <td style="padding: 4px 8px; font-weight: bold;">AVO</td>
      <td style="padding: 4px 8px; font-weight: bold;">Attention</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);">
      <td style="padding: 4px 8px;">Observation</td>
      <td style="padding: 4px 8px; font-family: monospace;">B<sub>obs</sub></td>
      <td style="padding: 4px 8px; font-family: monospace;">e<sub>i</sub></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);">
      <td style="padding: 4px 8px;">Baseline</td>
      <td style="padding: 4px 8px; font-family: monospace;">B<sub>bg</sub>(A<sub>obs</sub>) = mA<sub>obs</sub> + c</td>
      <td style="padding: 4px 8px; font-family: monospace;">ē = (1/N) Σ<sub>j</sub> e<sub>j</sub></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--forge-iron);">
      <td style="padding: 4px 8px;">Residual</td>
      <td style="padding: 4px 8px; font-family: monospace;">ΔB = B<sub>obs</sub> − B<sub>bg</sub>(A<sub>obs</sub>)</td>
      <td style="padding: 4px 8px; font-family: monospace;">δ<sub>i</sub> = e<sub>i</sub> − ē</td>
    </tr>
    <tr>
      <td style="padding: 4px 8px;">Amplify</td>
      <td style="padding: 4px 8px; font-family: monospace;">Θ(|ΔB| − τ)</td>
      <td style="padding: 4px 8px; font-family: monospace;">exp(δ<sub>i</sub>) / Σ<sub>j</sub> exp(δ<sub>j</sub>)</td>
    </tr>
  </table>

  <h3>4.3 Key Difference: Amplification Function</h3>
  <p>
    The amplification stage differs in functional form — and this is where the analogy is strongest, not weakest:
  </p>
  <ul>
    <li><strong>AVO:</strong> Hard threshold. |ΔB| > τ → flag. Below τ → ignore. Binary. Interpretable. Tolerant of noise below threshold.</li>
    <li><strong>Attention:</strong> Soft exponential. Smooth, differentiable, trainable. But <em>always amplifies something</em> — if not the true signal, then the largest noise component.</li>
  </ul>
  <p>
    The hard threshold's advantage is that it has a "dead zone" — small deviations produce zero output. Softmax has no dead zone. Every δ<sub>i</sub>, no matter how small, contributes to α<sub>i</sub>. This is why <strong>ungoverned softmax inevitably hallucinates</strong>: it cannot produce a truly uniform output unless all inputs are exactly equal. Any floating-point variation, any noise, any slight embedding misalignment — softmax will amplify it into a non-uniform distribution.
  </p>
  <p>
    This is the mathematical justification for Essay #12's central claim: <strong>physics-constrained attention is not optional; it is the only defense against softmax's inherent tendency to amplify noise.</strong>
  </p>
</div>

<!-- 5. Conditions and Boundaries -->
<div class="paper-section">
  <h2>5. Conditions, Caveats, and Boundaries of Equivalence</h2>

  <h3>5.1 Conditions Under Which the Mapping Holds</h3>
  <ol>
    <li><strong>AVO side:</strong> Shuey two-term approximation (θ ≲ 30°, small elastic contrasts). Exact Zoeppritz (full 4×4, post-critical angles, large contrasts) is not covered by this mapping.</li>
    <li><strong>Attention side:</strong> Single query, single-head scaled dot-product attention. Multi-head attention, cross-attention, and masked attention introduce additional structure not covered here.</li>
    <li><strong>Baseline:</strong> The Mudrock line is linear (B<sub>bg</sub> = mA + c). The attention baseline is uniform (all ē equal). More complex baselines (nonlinear rock-physics trends, context-dependent attention priors) would generalize the mapping but are not derived here.</li>
    <li><strong>Single anomaly:</strong> The canonical case considers one anomalous key / one anomalous reflector. Multiple simultaneous anomalies (multiple salient keys, interfering thin beds) produce interaction effects not captured by the simple residual.</li>
  </ol>

  <h3>5.2 What Is NOT Claimed</h3>
  <ol>
    <li><strong>NOT</strong> claiming that softmax = thresholding. The amplification functions differ. The claim is about structural role, not functional identity.</li>
    <li><strong>NOT</strong> claiming that the Zoeppritz 4×4 matrix = the QKV projection. The exact physics and the learned linear projections are different objects.</li>
    <li><strong>NOT</strong> claiming that geophysicists invented attention. The contrast primitive is universal — it appears wherever a system needs to extract salient deviations from a background.</li>
    <li><strong>NOT</strong> claiming that AVO interpretation is "the same thing" as running a transformer. The domains, data, and implementations are entirely distinct. The claim is about the <em>mathematical structure</em> of the anomaly detection operation embedded within each.</li>
    <li><strong>NOT</strong> claiming the mapping holds for all transformer variants (sparse attention, linear attention, FlashAttention) without modification. The approximation chain parallel (Zoeppritz→Shuey ↔ Full attention→Linear attention) is structural, not exact.</li>
  </ol>

  <h3>5.3 Boundary Conditions</h3>
  <p>The mapping degrades or breaks under these conditions:</p>
  <ul>
    <li><strong>AVO: post-critical angles.</strong> Beyond the critical angle, R(θ) becomes complex-valued. Shuey's approximation fails. The equivalent attention regime would be logits so extreme that softmax is numerically saturated — which happens routinely in poorly-regularized transformers.</li>
    <li><strong>AVO: large elastic contrasts.</strong> ΔV<sub>p</sub>/V<sub>p</sub> > 0.3 violates the Aki–Richards small-contrast assumption. The equivalent attention failure is when a single key's alignment dominates so strongly that softmax output is effectively one-hot — the model loses all sensitivity to other keys.</li>
    <li><strong>Attention: very large N.</strong> As N → ∞, (N−1)/N² → 1/N → 0. Large key sets require proportionally larger δ to achieve the same attention concentration. This is the analog of detecting a Class II anomaly in a noisy gather with thousands of traces.</li>
    <li><strong>Attention: adversarial δ.</strong> A carefully crafted perturbation to k<sub>i</sub> can produce an arbitrarily large δ<sub>i</sub> that softmax amplifies into near-certainty — without any corresponding "physical" signal. This is the attention equivalent of an acquisition footprint masquerading as a bright spot.</li>
  </ul>
</div>

<!-- 6. The Approximation Chain Parallel -->
<div class="paper-section">
  <h2>6. The Approximation Chain: A Structural Parallel</h2>

  <p>
    Both domains exhibit a three-tier approximation hierarchy, trading exactness for tractability:
  </p>

  <div style="overflow-x: auto; margin: 1.5em 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">
      <thead>
        <tr style="border-bottom: 2px solid var(--forge-gold);">
          <th style="text-align: left; padding: 8px;">Tier</th>
          <th style="text-align: left; padding: 8px;">Geophysics</th>
          <th style="text-align: left; padding: 8px;">Attention ML</th>
          <th style="text-align: left; padding: 8px;">Cost</th>
          <th style="text-align: left; padding: 8px;">Governance</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Exact</td>
          <td style="padding: 8px;">Zoeppritz (1919) — 4×4 matrix, all mode conversions, complex beyond critical angle</td>
          <td style="padding: 8px;">Full softmax O(N²) — all key-query pairs, exponential, differentiable</td>
          <td style="padding: 8px;">Maximum</td>
          <td style="padding: 8px; color: #4caf50;">Physical constraint available (Zoeppritz) / can be added (external baseline)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--forge-iron);">
          <td style="padding: 8px; font-weight: bold;">Linearized</td>
          <td style="padding: 8px;">Aki–Richards (1980) — first-order in elastic contrasts, three additive terms</td>
          <td style="padding: 8px;">Linear attention (Katharopoulos et al., 2020) — φ(Q)φ(K)<sup>T</sup>, O(N), kernelized</td>
          <td style="padding: 8px;">Moderate</td>
          <td style="padding: 8px; color: #ff9800;">Partially governable; breaks under extreme conditions</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Interpretable</td>
          <td style="padding: 8px;">Shuey (1985) two-term — A + B sin²θ, direct A–B crossplot interpretation</td>
          <td style="padding: 8px;">FlashAttention (Dao et al., 2022) — IO-optimized, tiled, exact output, approximate intermediates</td>
          <td style="padding: 8px;">Minimal</td>
          <td style="padding: 8px; color: #f44336;">Governance MUST be external; physics not in the model</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-forge-dim text-sm">Table 2: The parallel approximation hierarchy. As you descend, you gain speed and lose intrinsic physical fidelity. External governance must compensate.</p>

  <p>
    The principle: <strong>the further you approximate, the stronger your external governance must be.</strong> Shuey two-term works brilliantly for Class III sands at moderate angles — and fails for Class IV. FlashAttention computes attention exactly but produces intermediates that cannot be audited. In both cases, the defense is an external baseline that the approximation cannot overwrite.
  </p>
</div>

<!-- 7. Implications -->
<div class="paper-section">
  <h2>7. Implications and Closing</h2>

  <h3>7.1 For Geophysics</h3>
  <p>
    The mapping provides a formal language for describing what transformer-based seismic models are doing internally. An attention head that produces α<sub>i</sub> ≫ 1/N for tokens corresponding to a specific reflector is computing the equivalent of an AVO anomaly flag. The ACRisk framework (Essay #11) and the PCA framework (Essay #12) provide audit machinery.
  </p>

  <h3>7.2 For Machine Learning</h3>
  <p>
    The mapping reveals that softmax attention is an <strong>ungoverned contrast amplifier</strong>. It will amplify noise in the absence of signal. The AVO community's solution — an external, calibrated, falsifiable baseline — is directly portable. Every high-stakes transformer deployment needs a Mudrock line.
  </p>

  <h3>7.3 For Both Communities</h3>
  <p>
    The contrast primitive — extract features, compute residual against baseline, amplify deviations — is a universal computational pattern. It appears in AVO, in attention, in the Pi-Transformer (Maleki &amp; Pourmoazemi, 2025), in the Anomaly Transformer (Xu et al., 2022, ICLR), and in any system that must answer "what stands out from the background?" Recognizing this universality enables cross-domain transfer of governance tools, failure-mode taxonomies, and calibration methods.
  </p>

  <div style="border-left: 3px solid var(--forge-gold); padding: 1em 1.5em; margin: 2em 0; background: rgba(212, 175, 55, 0.05);">
    <p style="margin: 0;"><strong>TRILOGY VERDICT:</strong> The EUREKA announced in Essay #11, the governance demanded by Essay #12, and the derivation supplied by this paper (#13) together establish that <strong>contrast detection against a calibrated baseline is a universal computational primitive</strong>, instantiated in seismic AVO analysis and transformer self-attention with structurally identical three-stage computation. The difference in amplification function (linear threshold vs. exponential softmax) does not break the equivalence — it clarifies why ungoverned softmax hallucinates and why physics-constrained attention is the remedy. The governor is not optional. The Zoeppritz equations prove it can be built. The arifOS constitutional floors prove it generalizes. The trilogy is sealed.</p>
  </div>
</div>

<!-- References -->
<div class="paper-section">
  <h2>References</h2>
  <ol class="references text-sm">
    <li>Zoeppritz, K. (1919). Über Erdbebenwellen VII B. <em>Nachr. Königl. Ges. Wiss. Göttingen, Math.-phys. Klasse</em>, 66–84.</li>
    <li>Aki, K., &amp; Richards, P. G. (1980). <em>Quantitative Seismology: Theory and Methods</em>. W. H. Freeman.</li>
    <li>Shuey, R. T. (1985). A simplification of the Zoeppritz equations. <em>Geophysics</em>, 50(4), 609–614.</li>
    <li>Castagna, J. P., Batzle, M. L., &amp; Eastwood, R. L. (1985). Relationships between compressional-wave and shear-wave velocities in clastic silicate rocks. <em>Geophysics</em>, 50(4), 571–581.</li>
    <li>Smith, G. C., &amp; Gidlow, P. M. (1987). Weighted stacking for rock property estimation and detection of gas. <em>Geophysical Prospecting</em>, 35(9), 993–1014.</li>
    <li>Rutherford, S. R., &amp; Williams, R. H. (1989). Amplitude-versus-offset variations in gas sands. <em>Geophysics</em>, 54(6), 680–688.</li>
    <li>Fatti, J. L., Smith, G. C., Vail, P. J., Strauss, P. J., &amp; Levitt, P. R. (1994). Detection of gas in sandstone reservoirs using AVO analysis. <em>Geophysics</em>, 59(9), 1362–1376.</li>
    <li>Castagna, J. P., &amp; Swan, H. W. (1997). Principles of AVO crossplotting. <em>The Leading Edge</em>, 16(4), 337–344.</li>
    <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I. (2017). Attention Is All You Need. <em>NeurIPS</em>, 30.</li>
    <li>Katharopoulos, A., Vyas, A., Pappas, N., &amp; Fleuret, F. (2020). Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention. <em>ICML 2020</em>. arXiv:2006.16236.</li>
    <li>Dao, T., Fu, D. Y., Ermon, S., Rudra, A., &amp; Ré, C. (2022). FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness. <em>NeurIPS</em>, 35.</li>
    <li>Xu, J., Wu, H., Wang, J., &amp; Long, M. (2022). Anomaly Transformer: Time Series Anomaly Detection with Association Discrepancy. <em>ICLR 2022</em>. arXiv:2110.02642.</li>
    <li>Maleki, S., &amp; Pourmoazemi, A. (2025). Pi-Transformer: Physics-Informed Prior Attention for Anomaly Detection in Time Series. arXiv:2509.19985.</li>
    <li>Fazil, M. A. (2026). Contrast-Governed Anomaly Detection: A Formal Bridge between Seismic AVO and Transformer Attention. <em>arif-fazil.com/essays/</em>, Essay #11.</li>
    <li>Fazil, M. A. (2026). Physics-Constrained Attention: Zoeppritz as Constitutional Floor. <em>arif-fazil.com/essays/</em>, Essay #12.</li>
  </ol>
</div>

</article>
  `,
};

export default content;
