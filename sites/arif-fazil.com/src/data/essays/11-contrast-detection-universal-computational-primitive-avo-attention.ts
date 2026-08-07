// Direct publication on arif-fazil.com — not sourced from Medium.
// CLAIM. Not peer-reviewed. Awaiting adversarial review.
import type { EssayContent } from './types';

const content: EssayContent = {
  title: `Contrast-Governed Anomaly Detection: A Formal Bridge between Seismic AVO and Transformer Attention`,
  date: '2026-06-05',
  slug: 'contrast-governed-anomaly-detection-formal-bridge-avo-attention',
  tags: ["geophysics", "machine-learning", "attention", "avo", "contrast-detection", "transformers", "seismic", "governance", "geox", "acrisk"],
  excerpt: `We identify a shared mathematical structure between seismic AVO anomaly analysis and transformer self-attention. Building on classical AVO formalisms (Rutherford & Williams; Castagna & Swan; Smith & Gidlow) and scaled dot-product attention (Vaswani et al.), we show that both systems compute a contrast between an observation and a context-specific baseline, followed by normalization that amplifies significant deviations. Under simplifying assumptions, we derive an explicit mapping between AVO residuals and attention logits, and propose governance frameworks—including GEOX ACRisk audits—for attention heads in geophysical AI models.`,
  mediumUrl: '',
  isDirectPublication: true,
  html: `<!-- Abstract -->
<div class="paper-section">
  <h2>Abstract</h2>
  <p>
    We identify a shared mathematical structure between seismic amplitude-versus-offset (AVO) anomaly analysis and transformer self-attention mechanisms used in modern machine learning models. Building on classical AVO formalisms (Rutherford &amp; Williams, 1989; Castagna &amp; Swan, 1997; Smith &amp; Gidlow, 1987) and the scaled dot-product attention architecture (Vaswani et al., 2017), we show that both systems compute a contrast between an observation and a context-specific baseline, followed by a normalization step that amplifies significant deviations. In AVO, intercept–gradient analysis quantifies deviations from rock-physics trends such as the Mudrock line (Castagna et al., 1985), while in transformers, softmax-normalized query–key similarities yield a probability distribution that emphasizes tokens whose embeddings deviate most from the contextual norm. Under simplifying assumptions—linear background trend, approximately uniform attention baseline—we derive an explicit mapping between AVO residuals and attention logit residuals and demonstrate that both yield "winner-take-most" weighting of anomalous inputs. We discuss shared failure modes (false bright spots, spurious attention peaks), the role of priors and physical constraints, and implications for governance: attention heads in geophysical AI models can be audited using rock-physics-inspired anomaly metrics, including the GEOX ACRisk framework. This cross-disciplinary equivalence provides a conceptual and mathematical bridge between subsurface geophysics and neural sequence models, enabling transfer of interpretability and risk-governance tools across domains.
  </p>
</div>

<!-- 1. Introduction -->
<div class="paper-section">
  <h2>1. Introduction</h2>

  <h3>1.1 Motivation</h3>
  <p>
    Two communities—exploration geophysicists and machine learning researchers—have independently developed formalisms for answering the same question: <em>given a set of observations embedded in a context, which observations are salient, and by how much?</em> The geophysicist answers it with intercept-gradient crossplots, background rock-physics trends, and fluid factors. The ML researcher answers it with query-key dot products, softmax normalization, and attention weight distributions. These communities rarely converse. Their tools share a mathematical skeleton they do not recognize in each other.
  </p>
  <p>
    This paper names that skeleton.
  </p>
  <p>
    The need is bidirectional. On the geophysics side, machine-learning-based seismic interpretation—particularly transformer architectures applied to pre-stack data—is proliferating (Li et al., 2025; seismic foundation models). Interpretability of these models is poor; a "bright spot" detected by a transformer attention head carries no physics guarantee that it corresponds to a Class III AVO anomaly rather than a tuning artifact. On the ML side, attention mechanisms lack external ground truth; there is no independent physical referent against which to validate that an attention peak is "real." The AVO community has spent four decades developing exactly such referents.
  </p>

  <h3>1.2 Gap</h3>
  <p>
    To our knowledge, no published work explicitly connects the mathematical structure of AVO anomaly detection to the softmax attention weight computation. The Pi-Transformer (Maleki &amp; Pourmoazemi, 2025) introduces physics-informed priors for attention and is the closest bridge, but it does not reference geophysics or AVO. The connection identified in this paper appears to be novel.
  </p>

  <h3>1.3 Claim Statement (Scoped)</h3>
  <p>
    <strong>CLAIM:</strong> Under specified conditions (linear background trend, uniform attention baseline, small-residual approximation), the AVO fluid factor ΔF = B − m·A − c and the attention logit residual δ<sub>i</sub> = e<sub>i</sub> − ē play the same structural role in their respective systems. Both are contrast residuals. Both are normalized in ways that amplify outliers. Both produce "winner-take-most" outcomes. We do <em>not</em> claim that Shuey's approximation is identical to softmax, or that the Zoeppritz equations correspond to the QKV projection. The claim is structural: both systems instantiate a <em>governed contrast amplification</em> primitive over a context-specific baseline.
  </p>

  <h3>1.4 Contributions</h3>
  <ol>
    <li>A side-by-side decomposition of AVO anomaly detection and transformer self-attention into six shared computational stages (Table 1).</li>
    <li>A conditional derivation mapping AVO residuals to attention logit residuals under simplifying assumptions, with first-order linearization.</li>
    <li>An analysis of symmetric failure modes—false positives and false negatives—in both domains, connected to baseline misspecification.</li>
    <li>Identification of the Pi-Transformer and physics-informed attention literature as an implicit convergence point.</li>
    <li>A governance framework (GEOX ACRisk) for auditing attention-head anomalies in geophysical transformers using rock-physics-inspired metrics.</li>
    <li>Concrete proposals for cross-domain methodological transfer.</li>
  </ol>
</div>

<!-- 2. Background -->
<div class="paper-section">
  <h2>2. Background</h2>

  <h3>2.1 Seismic AVO and Anomaly Detection</h3>

  <h4>2.1.1 Physical Principle</h4>
  <p>
    When a seismic P-wave encounters an interface between two rock layers with contrasting elastic properties, part of the energy is reflected. The reflection coefficient R depends on the angle of incidence θ. This angle-dependence—AVO—carries diagnostic information about pore fluids, lithology, and pressure (Ostrander, 1984).
  </p>

  <h4>2.1.2 Shuey's Approximation</h4>
  <p>
    Shuey (1985) gave the most widely used linearized form of the Zoeppritz equations:
  </p>
  <div class="math-block">
    R(θ) ≈ A + B sin²θ + C sin²θ tan²θ
  </div>
  <p>
    where A is the intercept (normal-incidence P-wave reflectivity), B is the gradient (mid-offset AVO response), and C captures far-offset curvature. For angles below ~30°, the C term is often neglected, reducing the model to a two-parameter linear fit: R(θ) ≈ A + B sin²θ.
  </p>

  <h4>2.1.3 The Intercept-Gradient Crossplot and Background Trends</h4>
  <p>
    For any given reflection, one estimates A and B and plots the point (A, B) on a crossplot. Most reflections from brine-filled clastic rocks fall along an empirically calibrated background trend—the "Mudrock line" (Castagna et al., 1985). This trend represents the expected relationship B<sub>bg</sub>(A) under the null hypothesis: no hydrocarbon, no anomalous pressure, no lithology change beyond the background.
  </p>
  <p>
    A hydrocarbon-charged reservoir produces a reflection whose (A, B) coordinates deviate from this background. The deviation:
  </p>
  <div class="math-block">
    ΔB = B<sub>obs</sub> − B<sub>bg</sub>(A<sub>obs</sub>)
  </div>
  <p>
    is the <strong>AVO anomaly measure</strong>. Large |ΔB| → anomalous reflection.
  </p>

  <h4>2.1.4 The Fluid Factor</h4>
  <p>
    Smith &amp; Gidlow (1987) introduced the "fluid factor" ΔF, which projects (A, B) onto a direction orthogonal to the brine-sand trend in crossplot space. For a linear background B = mA + c:
  </p>
  <div class="math-block">
    ΔF = B − m·A − c
  </div>
  <p>
    The fluid factor is a <em>contrast score</em>—a scalar whose magnitude indicates how far a given observation deviates from the null (brine) hypothesis. It is not a binary flag; it is a continuous measure of anomalousness.
  </p>

  <h4>2.1.5 AVO Classes</h4>
  <p>
    Rutherford &amp; Williams (1989) and Castagna &amp; Swan (1997) classified gas-sand reflections into four classes (I–IV) based on their position on the A-B crossplot relative to the background trend. This classification is a discretization of the continuous contrast measure ΔB. Class III (bright spots, strongly negative A with increasing magnitude at far offsets) exemplifies the classical anomaly. Class IV (decreasing amplitude with offset) is a subtler, often-missed signal—the false-negative case.
  </p>

  <h3>2.2 Transformer Self-Attention</h3>

  <h4>2.2.1 Scaled Dot-Product Attention</h4>
  <p>
    Vaswani et al. (2017) defined scaled dot-product attention as:
  </p>
  <div class="math-block">
    Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) V
  </div>
  <p>
    For a single query vector q and a set of key-value pairs {k<sub>j</sub>, v<sub>j</sub>}<sub>j=1</sub><sup>N</sup>:
  </p>
  <div class="math-block">
    Attn(q, {k, v}) = Σ<sub>j=1</sub><sup>N</sup> α<sub>j</sub> v<sub>j</sub>
  </div>
  <p>
    where the attention weights α<sub>j</sub> are computed via softmax over alignment scores:
  </p>
  <div class="math-block">
    α<sub>j</sub> = exp(e<sub>j</sub>) / Σ<sub>ℓ=1</sub><sup>N</sup> exp(e<sub>ℓ</sub>), &emsp; e<sub>j</sub> = q·k<sub>j</sub> / √d<sub>k</sub>
  </div>

  <h4>2.2.2 Softmax as Contrast Amplification</h4>
  <p>
    The softmax has two critical effects on the raw alignment scores {e<sub>j</sub>}:
  </p>
  <ol>
    <li><strong>Normalization:</strong> It maps scores to a probability distribution summing to 1, making weights comparable across contexts with varying N.</li>
    <li><strong>Exponential amplification:</strong> It amplifies differences exponentially. If one key is much more aligned to q than others, its weight α<sub>j</sub> becomes disproportionately high.</li>
  </ol>
  <p>
    Consider a simplified scenario: one key k<sub>i</sub> has alignment e<sub>i</sub> = ē + δ where ē is the baseline score shared by all other keys, while the remaining N−1 keys have score e<sub>j≠i</sub> = ē. Then:
  </p>
  <div class="math-block">
    α<sub>i</sub> = exp(ē + δ) / (exp(ē + δ) + (N−1)exp(ē)) = 1 / (1 + (N−1)exp(−δ))
  </div>
  <p>
    If δ = 0 (no contrast), α<sub>i</sub> = 1/N (uniform baseline). If δ > 0, α<sub>i</sub> > 1/N. For moderate N and growing δ, α<sub>i</sub> → 1. The first-order Taylor expansion around δ = 0:
  </p>
  <div class="math-block">
    α<sub>i</sub> ≈ 1/N + ((N−1)/N²)·δ + O(δ²)
  </div>
  <p>
    shows that attention weight is, to first order, linear in the contrast δ, with exponential higher-order terms that accelerate convergence to 1 for larger deviations. This is the mathematical basis for the "winner-take-most" characterization.
  </p>

  <h4>2.2.3 Implicit Baseline: The Uniform Prior</h4>
  <p>
    When all e<sub>j</sub> are equal, attention defaults to a uniform distribution over keys. This uniform distribution serves as an <em>implicit baseline prior</em>—the "no-salient-token" null hypothesis. When a token's alignment exceeds this baseline, the softmax rejects the null and allocates probability mass disproportionately to that token. The baseline is not explicitly modeled; it is a consequence of the softmax functional form.
  </p>
</div>

<!-- 3. Attention as Governed Contrast -->
<div class="paper-section">
  <h2>3. Attention as Governed Contrast</h2>

  <p>
    We now formalize the interpretation of attention weights as governed contrast measures. This section establishes the precise mathematical vocabulary used in the equivalence mapping (Section 4).
  </p>

  <h3>3.1 Contrast Residual</h3>
  <p>
    For a fixed query q and a set of N keys {k<sub>j</sub>}, define the alignment scores e<sub>j</sub> = q·k<sub>j</sub> / √d<sub>k</sub>. Let the baseline alignment be the arithmetic mean:
  </p>
  <div class="math-block">
    ē = (1/N) Σ<sub>j=1</sub><sup>N</sup> e<sub>j</sub>
  </div>
  <p>
    Then the contrast residual for key k<sub>i</sub> is:
  </p>
  <div class="math-block">
    δ<sub>i</sub> = e<sub>i</sub> − ē
  </div>
  <p>
    This residual measures how much key k<sub>i</sub> deviates from the average compatibility with q. It is the attention-domain analog of the AVO fluid factor ΔF.
  </p>

  <h3>3.2 Softmax Response Function</h3>
  <p>
    The attention weight α<sub>i</sub> can be expressed directly in terms of δ<sub>i</sub>:
  </p>
  <div class="math-block">
    α<sub>i</sub> = exp(ē + δ<sub>i</sub>) / Σ<sub>ℓ</sub> exp(ē + δ<sub>ℓ</sub>) = exp(δ<sub>i</sub>) / Σ<sub>ℓ</sub> exp(δ<sub>ℓ</sub>)
  </div>
  <p>
    This makes explicit that the baseline ē cancels—only contrasts matter. The attention distribution is determined entirely by the pattern of deviations from the mean, not by the absolute magnitude of the alignment scores.
  </p>

  <h3>3.3 Properties</h3>
  <ul>
    <li><strong>Translation invariance:</strong> Adding a constant C to all e<sub>j</sub> leaves α<sub>j</sub> unchanged.</li>
    <li><strong>Contrast monotonicity:</strong> α<sub>i</sub> is strictly increasing in δ<sub>i</sub> when all other δ<sub>j≠i</sub> are held constant.</li>
    <li><strong>Baseline property:</strong> δ<sub>i</sub> = 0 for all i ⇒ α<sub>i</sub> = 1/N for all i (uniform distribution).</li>
    <li><strong>Saturation:</strong> As δ<sub>i</sub> → ∞ (with δ<sub>j≠i</sub> bounded), α<sub>i</sub> → 1.</li>
  </ul>
  <p>
    These properties establish attention as a contrast-governed mechanism. The baseline—equal relevance—is the implicit null hypothesis. The softmax is the amplifier. The weight α<sub>i</sub> is the amplified contrast response.
  </p>
</div>

<!-- 4. The Structural Mapping (Table 1) -->
<div class="paper-section">
  <h2>4. The Structural Mapping</h2>

  <p>
    Table 1 presents the side-by-side decomposition of AVO anomaly detection and transformer self-attention into six shared computational stages.
  </p>

  <p class="font-mono text-xs text-forge-dim mb-4">Table 1: Stage-by-stage structural mapping between AVO anomaly detection and transformer self-attention.</p>

  <div class="comparison-table">
    <table>
      <thead>
        <tr>
          <th style="width:8%">Stage</th>
          <th style="width:46%">Seismic AVO Anomaly Detection</th>
          <th style="width:46%">Transformer Self-Attention</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Observation</strong></td>
          <td>Reflection coefficient R(θ) as function of incidence angle (pre-stack amplitude data)</td>
          <td>Sequence of token vectors x<sub>1</sub>, …, x<sub>N</sub> (word embeddings, time series, seismic trace segments)</td>
        </tr>
        <tr>
          <td><strong>2. Feature Extraction</strong></td>
          <td>Intercept A and gradient B from R(θ) via Shuey's two-term linearization (Shuey, 1985)</td>
          <td>Query q = W<sub>Q</sub>x and Keys k<sub>j</sub> = W<sub>K</sub>x<sub>j</sub> from learned linear projections (Vaswani et al., 2017)</td>
        </tr>
        <tr>
          <td><strong>3. Baseline</strong></td>
          <td>Empirical background trend B<sub>bg</sub>(A) — e.g., Mudrock line for brine-saturated clastics (Castagna et al., 1985)</td>
          <td>Implicit uniform prior — all keys equally relevant (no salient token). Emergent property of softmax when all e<sub>j</sub> equal.</td>
        </tr>
        <tr>
          <td><strong>4. Contrast Computation</strong></td>
          <td>Residual ΔB = B<sub>obs</sub> − B<sub>bg</sub>(A<sub>obs</sub>), or fluid factor ΔF = B − mA − c (Smith &amp; Gidlow, 1987)</td>
          <td>Contrast residual δ<sub>i</sub> = e<sub>i</sub> − ē; alignment scores e<sub>j</sub> = q·k<sub>j</sub> / √d<sub>k</sub></td>
        </tr>
        <tr>
          <td><strong>5. Normalization &amp; Amplification</strong></td>
          <td>Scale by background variance σ<sub>bg</sub>; use Mahalanobis distance in (A, B) space; threshold at kσ for anomaly flag</td>
          <td>Softmax: α<sub>j</sub> = exp(e<sub>j</sub>) / Σ<sub>ℓ</sub> exp(e<sub>ℓ</sub>). Normalizes to distribution + exponentially amplifies differences</td>
        </tr>
        <tr>
          <td><strong>6. Outcome</strong></td>
          <td>Anomaly indicator: yes/no, AVO Class I–IV (Rutherford &amp; Williams, 1989), continuous anomaly strength</td>
          <td>Attention weight distribution {α<sub>j</sub>} — selects salient token(s), down-weights rest. "Winner-take-most."</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    Each row in Table 1 identifies a functional correspondence. The operations are not identical in implementation—linear regression vs. learned projections, linear subtraction vs. softmax exponential—but they are identical in <em>structural role</em>. Both systems: observe, extract features, establish a baseline, compute contrast residuals, normalize/amplify those residuals, and produce a "spotlight" outcome.
  </p>
</div>

<!-- 5. Formal Derivation -->
<div class="paper-section">
  <h2>5. Formal Derivation</h2>

  <h3>5.1 AVO Residual Geometry</h3>
  <p>
    Assume the AVO background trend is linear: B<sub>bg</sub>(A) = mA. (The extension to B = mA + c is straightforward; we set c = 0 without loss of generality by translating coordinates.) For a specific reflection with intercept A<sub>0</sub> and observed gradient B<sub>0</sub>, define:
  </p>
  <div class="math-block">
    C<sub>AVO</sub> = [A<sub>0</sub>, B<sub>0</sub>]<sup>T</sup>, &emsp; C<sub>bg</sub> = [A<sub>0</sub>, mA<sub>0</sub>]<sup>T</sup>
  </div>
  <p>
    The anomaly residual vector is:
  </p>
  <div class="math-block">
    ΔC = C<sub>AVO</sub> − C<sub>bg</sub> = [0, B<sub>0</sub> − mA<sub>0</sub>]<sup>T</sup>
  </div>
  <p>
    Let u<sub>⊥</sub> be a unit vector perpendicular to the background line in (A, B) space. The anomaly magnitude—the projection of the residual onto the direction of maximum fluid sensitivity—is:
  </p>
  <div class="math-block">
    ΔB<sub>⊥</sub> = ΔC · u<sub>⊥</sub> = B<sub>0</sub> − mA<sub>0</sub>  &emsp;(up to a constant scale factor)
  </div>
  <p>
    This is the fluid factor ΔF of Smith &amp; Gidlow (1987), expressed in the coordinate system where u<sub>⊥</sub> is the fluid-sensitive direction. The anomaly magnitude is a <em>signed scalar contrast residual</em>.
  </p>

  <h3>5.2 Attention Residual Geometry</h3>
  <p>
    Fix a query q. Let {e<sub>j</sub>}<sub>j=1</sub><sup>N</sup> be the alignment scores. Define the baseline logit:
  </p>
  <div class="math-block">
    ē = (1/N) Σ<sub>j=1</sub><sup>N</sup> e<sub>j</sub>
  </div>
  <p>
    The contrast residual for key k<sub>i</sub> is δ<sub>i</sub> = e<sub>i</sub> − ē. For the special case where exactly one key deviates from the baseline (the "one-outlier model"), with δ<sub>i</sub> = δ and δ<sub>j≠i</sub> = 0, the attention weight is:
  </p>
  <div class="math-block">
    α<sub>i</sub> = 1 / (1 + (N−1)exp(−δ))
  </div>
  <p>
    Key properties of this function:
  </p>
  <ul>
    <li>δ = 0 ⇒ α<sub>i</sub> = 1/N (baseline — no contrast, uniform attention)</li>
    <li>δ → ∞ ⇒ α<sub>i</sub> → 1 (saturation — extreme contrast, dominant attention)</li>
    <li>δ → −∞ ⇒ α<sub>i</sub> → 0 (anti-contrast — key is suppressed below baseline)</li>
    <li>The function is strictly increasing in δ</li>
  </ul>

  <h3>5.3 First-Order Equivalence</h3>
  <p>
    Linearizing the softmax response around δ = 0:
  </p>
  <div class="math-block">
    α<sub>i</sub> ≈ 1/N + ((N−1)/N²)·δ + O(δ²)
  </div>
  <p>
    The zero-order term (1/N) is the baseline—uniform attention. The first-order term ((N−1)/N²)·δ is the contrast response—the attention weight's sensitivity to the residual. Comparing to the AVO case:
  </p>
  <ul>
    <li><strong>AVO:</strong> anomaly flag = f(ΔB<sub>⊥</sub>) where f is a threshold function (anomaly if |ΔB<sub>⊥</sub>| > kσ). To first order near the threshold, the anomaly response is proportional to |ΔB<sub>⊥</sub>|.</li>
    <li><strong>Attention:</strong> α<sub>i</sub> ≈ 1/N + ((N−1)/N²)·δ. To first order, the weight increment above baseline is proportional to δ.</li>
  </ul>
  <p>
    In both systems, the <strong>response is, to first order, a monotone function of a contrast residual</strong>. The AVO fluid factor ΔB<sub>⊥</sub> and the attention logit residual δ play the same formal role: they are the input to a normalization-amplification stage that produces the output—anomaly flag in AVO, attention weight in transformers.
  </p>

  <h3>5.4 Conditions and Limits</h3>
  <p>
    The formal mapping holds under the following conditions:
  </p>
  <ol>
    <li><strong>Linear background trend:</strong> B<sub>bg</sub>(A) = mA. Curved or piecewise trends require extension to higher-order residuals.</li>
    <li><strong>Uniform baseline:</strong> All non-outlier e<sub>j</sub> share the same value ē. In practice, the baseline is a distribution; the one-outlier model is a simplifying abstraction.</li>
    <li><strong>Small residual approximation:</strong> The first-order Taylor expansion is accurate for δ near 0. For large δ, the exponential term dominates and the linear correspondence degrades.</li>
    <li><strong>Noise assumptions:</strong> The background variance in AVO (σ<sub>bg</sub>) has no direct analog in the attention softmax—attention's "noise model" is the softmax temperature, which is fixed at 1 in standard implementations.</li>
  </ol>
  <p>
    Outside these conditions, the mapping is conceptual rather than formal: both systems still compute contrast + normalize + amplify, but the functional forms diverge.
  </p>
</div>

<!-- 6. Failure Modes and Governance -->
<div class="paper-section">
  <h2>6. Failure Modes and Governance</h2>

  <h3>6.1 False Positives: Bright Spots and Spurious Attention</h3>
  <p>
    <strong>AVO domain:</strong> False positive anomalies—"false bright spots"—occur when the background trend is misestimated or when non-hydrocarbon effects (shallow high-porosity brine sands, thin-bed tuning, processing artifacts) mimic a fluid response. Castagna et al. (1985) documented that non-hydrocarbon reflections can exhibit increasing AVO, producing false positives when the background model is inadequately conditioned for the local stratigraphy (Ostrander, 1984; Castagna &amp; Swan, 1997).
  </p>
  <p>
    <strong>Attention domain:</strong> When many keys are similar or the query is ambiguous, attention may focus on an irrelevant token—the "attention misfire" (Jain &amp; Wallace, 2019; Wiegreffe &amp; Pinter, 2019). This occurs when the learned query-key similarity is biased or when out-of-distribution inputs confuse the scoring mechanism. The attention head "detects" a contrast that has no task-relevant significance.
  </p>
  <p>
    <strong>Structural symmetry:</strong> Both failures stem from <em>baseline misspecification</em>. The contrast amplification mechanism faithfully amplifies whatever deviates from the assumed baseline—if the baseline is wrong, the amplification is misleading. A false bright spot is a spurious attention peak in (A, B)-space; a spurious attention peak is a false bright spot in embedding-space.
  </p>

  <h3>6.2 False Negatives: Class IV Sands and Diluted Contrast</h3>
  <p>
    <strong>AVO domain:</strong> Class IV gas sands decrease in amplitude with offset (Rutherford &amp; Williams, 1989; Castagna &amp; Swan, 1997), contradicting the classical bright-spot model. They can be missed entirely if the anomaly detector is tuned only for amplitude increases, producing a false negative.
  </p>
  <p>
    <strong>Attention domain:</strong> A truly important token may fail to receive high attention weight if its significance is masked by a noisy context—many moderately relevant tokens dilute the contrast distribution, and no single token stands out (the "diffuse attention" regime).
  </p>
  <p>
    <strong>Structural symmetry:</strong> Both failures occur when genuine signal does not produce sufficient contrast against the prevailing context. The signal is present but does not "break the pattern" strongly enough to survive normalization.
  </p>

  <h3>6.3 ACRisk Governance: Auditing Attention with Rock-Physics Priors</h3>
  <p>
    The GEOX ACRisk framework (Arif, 2026; GEOX SPACE KNOWLEDGE ARTIFACT) provides a structured audit for anomalies detected by geophysical AI models. The framework decomposes any detected anomaly into three components:
  </p>
  <ul>
    <li><strong>U<sub>phys</sub>:</strong> Physical uncertainty — is there a rock-physics basis for this anomaly, or could it be explained by a non-hydrocarbon effect?</li>
    <li><strong>D<sub>transform</sub>:</strong> Display/transform uncertainty — could the anomaly be an artifact of the data processing, normalization, or projection pipeline?</li>
    <li><strong>B<sub>cog</sub>:</strong> Cognitive bias — could the interpreter (human or machine) be over-weighting this anomaly due to prior expectations, training-data bias, or confirmation-seeking behavior?</li>
  </ul>
  <p>
    We propose extending ACRisk to attention heads in geophysical transformer models. For each attention head that "flags" a seismic feature as salient (high α<sub>j</sub>):
  </p>
  <ol>
    <li><strong>U<sub>phys</sub> audit:</strong> Does the attended region correspond to a physically plausible AVO anomaly? Check whether the underlying (A, B) coordinates of the attended seismic trace segment deviate from the local Mudrock line. If the attention peak exists without a corresponding AVO contrast, flag as potential false positive.</li>
    <li><strong>D<sub>transform</sub> audit:</strong> Is the attention weight robust to changes in data normalization, sequence length, or positional encoding? If small perturbations in preprocessing cause large changes in attention distribution, the "anomaly" may be a transform artifact.</li>
    <li><strong>B<sub>cog</sub> audit:</strong> Does the training distribution contain a disproportionate number of bright-spot examples? Could the attention head be overfitting to Class III gas-sand patterns at the expense of Class IV and other anomaly types? A head trained predominantly on Class III analogues will produce spurious attention peaks when shown Class IV signatures—mirroring the interpreter bias that ACRisk was designed to catch in human analysis.</li>
  </ol>
  <p>
    This framework gives teeth to the formal equivalence: it is not merely an intellectual curiosity. It provides a <em>governance mechanism</em>—a way to audit whether an AI-detected "anomaly" in seismic data is grounded in the same physics that a human interpreter would demand. The ACRisk audit turns the mathematical parallel into an operational quality gate.
  </p>

  <h3>6.4 Non-Stationarity: Drift Under Both Systems</h3>
  <p>
    Both AVO and attention operate under non-stationary conditions (Envisioning, 2025). In AVO, the background trend shifts with depth, compaction, diagenesis, and basin history—the Mudrock line calibrated in the Gulf of Mexico does not transfer to the Malay Basin without adjustment. In transformers, the "background" distribution of token relationships shifts with domain, language, and temporal drift in training data. Both systems must function under <em>drifting priors</em>—the baseline is never static. Governance frameworks (ACRisk, F13 sovereign review) must account for this: an anomaly that is genuine in one context may be baseline in another.
  </p>
</div>

<!-- 7. Literature Context -->
<div class="paper-section">
  <h2>7. Literature Context and Novelty</h2>

  <h3>7.1 AVO Literature</h3>
  <p>
    The foundational AVO literature spans Ostrander (1984), who first demonstrated gas-sand AVO effects; Shuey (1985), who provided the linearized approximation; Rutherford &amp; Williams (1989), who introduced the four-class AVO system; Smith &amp; Gidlow (1987), who introduced the fluid factor as a contrast measure orthogonal to the brine trend; and Castagna &amp; Swan (1997), who systematized crossplot interpretation. The Castagna Mudrock line (Castagna et al., 1985) remains the most cited empirical background trend. This body of work established the conceptual framework of <em>deviation from a calibrated background as the signal of interest</em>.
  </p>

  <h3>7.2 Attention Literature</h3>
  <p>
    Vaswani et al. (2017) introduced scaled dot-product attention. Subsequent work has analyzed attention through multiple lenses: as content-based retrieval (Graves et al., 2014), as a probabilistic inference mechanism, and as an interpretability challenge (Jain &amp; Wallace, 2019; Wiegreffe &amp; Pinter, 2019). The "winner-take-most" property of softmax attention is well-characterized in the ML literature but has not been connected to geophysical contrast detection.
  </p>

  <h3>7.3 Physics-Informed Attention</h3>
  <p>
    The Pi-Transformer (Maleki &amp; Pourmoazemi, 2025) introduces a physics-informed prior distribution over attention weights and treats deviations from this prior as anomalies. This is architecturally analogous to using the Mudrock line as a prior for AVO analysis—both introduce domain knowledge to constrain what counts as "anomalous." However, Maleki &amp; Pourmoazemi do not reference geophysics or AVO. The connection identified here has not been drawn elsewhere.
  </p>

  <h3>7.4 Contrast-Based Weighting as a Unified Principle</h3>
  <p>
    The broader literature on contrastive methods—contrastive learning (Chen et al., 2020), contrastive predictive coding (van den Oord et al., 2018), and anomaly detection via contrast—suggests that <em>learning by distinguishing signal from background</em> is a deep organizational principle across machine learning. This paper adds to that literature by showing that the principle extends to classical geophysical signal processing, unifying a four-decade-old exploration technique with the core mechanism of modern AI architectures.
  </p>

  <h3>7.5 Novelty Claim</h3>
  <p>
    <strong>CLAIM:</strong> To the best of our knowledge, no prior publication has drawn an explicit formal parallel between AVO intercept-gradient analysis and transformer self-attention. The closest work (Pi-Transformer, physics-informed attention) converges on the same pattern without naming the AVO connection. This paper fills that gap.
  </p>
</div>

<!-- 8. Discussion and Implications -->
<div class="paper-section">
  <h2>8. Discussion and Cross-Domain Implications</h2>

  <h3>8.1 AVO → ML: Probabilistic Anomaly Confidence</h3>
  <p>
    The attention mechanism's probabilistic formulation suggests treating the AVO background trend not as a deterministic line but as a probability distribution. Instead of a binary anomaly flag, one could compute a posterior probability that a given (A, B) point belongs to the background (brine) population versus an anomalous (hydrocarbon) population—a Bayesian fluid factor using softmax-like normalization over competing rock-physics hypotheses. This would provide geophysicists with a graded confidence measure rather than a hard threshold.
  </p>

  <h3>8.2 AVO → ML: Multi-Head Interpretation</h3>
  <p>
    Transformers use multiple attention heads, each learning a different projection. By structural analogy, one could design a "multi-head AVO" framework where different rock-physics models (Mudrock line, Gardner trend, local basin calibration, depth-dependent trends) serve as parallel "heads," with each head's anomaly score combined through a learned or physics-informed gating mechanism. This would generalize the single-trend AVO analysis while preserving physical interpretability.
  </p>

  <h3>8.3 ML → AVO: Learned Background Trends</h3>
  <p>
    Rather than relying on hand-calibrated background trends that are basin-specific and depth-dependent, one could train a model to learn a context-dependent baseline from data—a transformer that learns what "normal" reflectivity looks like in a given geological setting and flags deviations. This is the geophysical analog of the Pi-Transformer, with the additional benefit that the learned baseline can be inspected against known rock-physics relationships.
  </p>

  <h3>8.4 ML → AVO: Attention Weights as Interpretability Tools</h3>
  <p>
    AVO interpreters already use crossplots as interpretability tools. Attention weight visualization—showing <em>which</em> parts of the seismic trace contributed most to an anomaly classification—could provide a new dimension of interpretability for machine-learning-based seismic interpretation, grounding AI decisions in physically inspectable amplitude-versus-angle behavior. A transformer that classifies an event as a Class III bright spot could be asked to show <em>why</em>, in the form of the attention weights over angle-gather traces, which can then be cross-checked against the expected AVO signature.
  </p>

  <h3>8.5 The Contrast Primitive</h3>
  <p>
    At the highest level, this equivalence suggests that "contrast detection and amplification" is a <em>computational primitive</em>—a reusable, domain-independent operation that can be instantiated in different substrates (physics-based regression for AVO, learned projections for attention) but always performs the same information-processing function: <em>find what deviates from context, then amplify its weight</em>. Identifying this primitive opens the door to formal comparisons between other apparently unrelated domains—any system that computes "what's different" and "how much it matters" may be an instance of the same kernel.
  </p>
</div>

<!-- 9. Limits -->
<div class="paper-section">
  <h2>9. Limits of the Analogy</h2>
  <ol>
    <li><strong>Baseline specification:</strong> AVO's baseline is physically grounded—the Mudrock line is an empirical relationship between V<sub>P</sub> and V<sub>S</sub> in water-saturated clastics (Castagna et al., 1985). Attention's baseline is learned from data with no external physical referent. AVO can be wrong in physically meaningful and diagnosable ways; attention can only be wrong relative to training-distribution expectations.</li>
    <li><strong>Dimensionality:</strong> AVO operates in a low-dimensional, physically interpretable space (A, B). Attention operates in high-dimensional learned embedding spaces (typically d<sub>k</sub> = 64–128). The contrast being measured is of a fundamentally different character—scalar fluid factor vs. high-dimensional alignment.</li>
    <li><strong>Temporal/positional structure:</strong> AVO analyzes a single interface at a single CDP location. Attention operates over sequences with positional encoding—the "context" has ordering structure that AVO's background trend lacks.</li>
    <li><strong>Supervision:</strong> AVO anomaly detection is calibrated against known wells (weakly supervised). Transformer attention is trained end-to-end with task supervision—the "anomalies" it learns to detect are those that serve the training objective, not necessarily those that are physically meaningful.</li>
    <li><strong>Ground-truthability:</strong> AVO anomalies can be ground-truthed by drilling—there is an independent measurement. Attention weights cannot be independently verified; they are interpretable only insofar as they correlate with downstream task performance. An attention peak is a claim that cannot be falsified by direct measurement—only by ablation or behavioral testing.</li>
  </ol>
</div>

<!-- 10. Conclusion -->
<div class="paper-section">
  <h2>10. Conclusion</h2>
  <p>
    Seismic AVO anomaly detection and transformer self-attention both instantiate a <em>contrast-governed anomaly detection</em> primitive: establish a context-specific baseline, compute contrast residuals, normalize and amplify those residuals, and produce a spotlighted outcome. In AVO, the contrast is between observed and expected reflection behavior via intercept-gradient trends; in attention, it is between a query-key similarity and the distribution of similarities across the context window.
  </p>
  <p>
    Under idealized conditions—linear background trend, uniform attention baseline, small-residual approximation—we have shown that the AVO fluid factor ΔF and the attention logit residual δ play the same structural role, and that the softmax attention weight α<sub>i</sub> is an amplified normalization of δ analogous to thresholding ΔF for anomaly classification. The correspondence is not one-to-one in functional form (linear subtraction vs. softmax exponential) but is exact in computational architecture: both systems compute "what's different, then turn up its weight."
  </p>
  <p>
    This equivalence is actionable. The GEOX ACRisk framework—originally designed for auditing human-interpreted seismic anomalies—extends naturally to auditing attention-head outputs in geophysical transformers. An attention peak without a corresponding AVO contrast is a false bright spot in embedding-space. A genuine AVO anomaly that fails to produce an attention peak is a false negative—a Class IV sand that the model missed. The audit framework gives governance teeth to the mathematical parallel.
  </p>
  <p>
    The formal insight that governed contrast extraction is at play in both domains opens a dialog between geophysicists and AI researchers. Future work includes: empirical evaluation of ACRisk-audited attention heads on pre-stack seismic transformers; development of multi-head AVO frameworks using parallel rock-physics priors; and generalization of the contrast primitive to other domains where "find what stands out from context" is the core computational task.
  </p>
  <p>
    <strong>We are all, as it turns out, in the business of finding what stands out. The difference is only in what we count as background.</strong>
  </p>
</div>

<!-- References -->
<div class="paper-section">
  <h2>References</h2>
  <ol class="references">
    <li>Castagna, J.P., Batzle, M.L., &amp; Eastwood, R.L. (1985). Relationships between compressional-wave and shear-wave velocities in clastic silicate rocks. <em>Geophysics</em>, 50(4), 571–581. <a href="https://doi.org/10.1190/1.1441933" target="_blank" rel="noopener">doi:10.1190/1.1441933</a></li>
    <li>Castagna, J.P. &amp; Swan, H.W. (1997). Principles of AVO crossplotting. <em>The Leading Edge</em>, 16(4), 337–344. <a href="https://doi.org/10.1190/1.1437623" target="_blank" rel="noopener">doi:10.1190/1.1437623</a></li>
    <li>Chen, T., Kornblith, S., Norouzi, M., &amp; Hinton, G. (2020). A simple framework for contrastive learning of visual representations. <em>Proceedings of ICML 2020</em>. <a href="https://arxiv.org/abs/2002.05709" target="_blank" rel="noopener">arXiv:2002.05709</a></li>
    <li>Graves, A., Wayne, G., &amp; Danihelka, I. (2014). Neural Turing Machines. <em>arXiv:1410.5401</em>. <a href="https://arxiv.org/abs/1410.5401" target="_blank" rel="noopener">arXiv:1410.5401</a></li>
    <li>Jain, S. &amp; Wallace, B.C. (2019). Attention is not Explanation. <em>Proceedings of NAACL 2019</em>. <a href="https://arxiv.org/abs/1902.10186" target="_blank" rel="noopener">arXiv:1902.10186</a></li>
    <li>Maleki, S. &amp; Pourmoazemi, M. (2025). Pi-Transformer: Physics-Informed Prior for Anomaly Detection in Transformer Architectures. <em>Preprint</em>.</li>
    <li>Ostrander, W.J. (1984). Plane-wave reflection coefficients for gas sands at nonnormal angles of incidence. <em>Geophysics</em>, 49(10), 1637–1648. <a href="https://doi.org/10.1190/1.1441571" target="_blank" rel="noopener">doi:10.1190/1.1441571</a></li>
    <li>Rutherford, S.R. &amp; Williams, R.H. (1989). Amplitude-versus-offset variations in gas sands. <em>Geophysics</em>, 54(6), 680–688. <a href="https://doi.org/10.1190/1.1442696" target="_blank" rel="noopener">doi:10.1190/1.1442696</a></li>
    <li>Shuey, R.T. (1985). A simplification of the Zoeppritz equations. <em>Geophysics</em>, 50(4), 609–614. <a href="https://doi.org/10.1190/1.1441936" target="_blank" rel="noopener">doi:10.1190/1.1441936</a></li>
    <li>Smith, G.C. &amp; Gidlow, P.M. (1987). Weighted stacking for rock property estimation and detection of gas. <em>Geophysical Prospecting</em>, 35(9), 993–1014. <a href="https://doi.org/10.1111/j.1365-2478.1987.tb00856.x" target="_blank" rel="noopener">doi:10.1111/j.1365-2478.1987.tb00856.x</a></li>
    <li>van den Oord, A., Li, Y., &amp; Vinyals, O. (2018). Representation Learning with Contrastive Predictive Coding. <em>arXiv:1807.03748</em>. <a href="https://arxiv.org/abs/1807.03748" target="_blank" rel="noopener">arXiv:1807.03748</a></li>
    <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A.N., Kaiser, Ł., &amp; Polosukhin, I. (2017). Attention Is All You Need. <em>Advances in Neural Information Processing Systems 30 (NeurIPS 2017)</em>. <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener">arXiv:1706.03762</a></li>
    <li>Wiegreffe, S. &amp; Pinter, Y. (2019). Attention is not not Explanation. <em>Proceedings of EMNLP 2019</em>. <a href="https://arxiv.org/abs/1908.04626" target="_blank" rel="noopener">arXiv:1908.04626</a></li>
    <li>GEOX SPACE KNOWLEDGE ARTIFACT — ACRisk: Anomaly Contrast Risk Audit Framework. Arif, M. (2026). Internal GEOX doctrine.</li>
    <li>Envisioning (2025). Non-Stationarity of Objectives. <em>Envisioning Vocabulary</em>.</li>
  </ol>
</div>

<!-- Footer -->
<div class="paper-footer mt-16 pt-8 border-t-2 border-forge-iron">
  <p class="font-mono text-xs text-forge-dim">
    <strong>DITEMPA BUKAN DIBERI — Forged, Not Given.</strong><br/>
    Direct publication on arif-fazil.com/essays/. Not peer-reviewed. Epistemic tag: CLAIM.<br/>
    Correspondence: essays@arif-fazil.com<br/>
    Awaiting adversarial review. Refutations welcome — seal the counter-claim in VAULT999.
  </p>
</div>

<style>
  .scientific-paper h1.paper-title {
    font-size: 2rem;
    line-height: 1.15;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
  }
  .scientific-paper .paper-section {
    margin-top: 2.5rem;
  }
  .scientific-paper .paper-section h2 {
    font-size: 1.35rem;
    font-weight: 800;
    text-transform: uppercase;
    border-bottom: 2px solid var(--forge-iron, #333);
    padding-bottom: 0.5rem;
    margin-bottom: 1.2rem;
    color: var(--forge-gold, #d4a853);
  }
  .scientific-paper .paper-section h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.6rem;
    color: var(--forge-white, #eee);
  }
  .scientific-paper .paper-section h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--forge-dim, #999);
  }
  .scientific-paper p {
    margin-bottom: 1rem;
    line-height: 1.8;
  }
  .scientific-paper ul, .scientific-paper ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  .scientific-paper li {
    margin-bottom: 0.4rem;
    line-height: 1.7;
  }
  .scientific-paper .math-block {
    background: rgba(212, 168, 83, 0.08);
    border-left: 3px solid var(--forge-gold, #d4a853);
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    font-family: 'Courier New', monospace;
    font-size: 1.05rem;
    overflow-x: auto;
    color: var(--forge-white, #eee);
  }
  .scientific-paper .comparison-table {
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  .scientific-paper .comparison-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }
  .scientific-paper .comparison-table th {
    background: rgba(212, 168, 83, 0.15);
    padding: 0.7rem 1rem;
    text-align: left;
    font-weight: 700;
    border: 1px solid var(--forge-iron, #333);
    color: var(--forge-gold, #d4a853);
  }
  .scientific-paper .comparison-table td {
    padding: 0.65rem 1rem;
    border: 1px solid var(--forge-iron, #333);
    vertical-align: top;
    line-height: 1.5;
  }
  .scientific-paper .references {
    font-size: 0.85rem;
  }
  .scientific-paper .references li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  .scientific-paper .references a {
    color: var(--forge-dim, #999);
    font-size: 0.8rem;
  }
  .scientific-paper .paper-authors p {
    margin-bottom: 0.1rem;
  }
  .scientific-paper strong {
    color: var(--forge-gold, #d4a853);
  }
  .scientific-paper em {
    font-style: italic;
  }
</style>
</article>
`,
};

export default content;
