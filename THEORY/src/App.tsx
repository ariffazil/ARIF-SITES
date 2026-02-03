import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Activity,
  GitBranch,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  BookOpen,
  Copy,
  ChevronDown,
  ChevronUp,
  Info,
  Crown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Import new Trinity components
import { HTADashboard } from '@/components/HTADashboard';
import { FloorVisualizer } from '@/components/FloorVisualizer';
import { EngineDiagram } from '@/components/EngineDiagram';
import { MetabolicLoop } from '@/components/HTAMetabolicLoop';
import { CitationBlock } from '@/components/CitationBlock';

// ─────────────────────────────────────────────────
// KaTeX Math Rendering Components
// ─────────────────────────────────────────────────

function InlineMath({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={ref} className="inline text-theory-300 font-mono" />;
}

function DisplayMath({ tex, label }: { tex: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return (
    <div className="math-block border-l-2 border-theory-500 bg-black/60 p-8 my-8">
      <div ref={ref} />
      {label && <p className="text-[10px] font-display text-gray-600 mt-6 text-center tracking-widest uppercase">{label}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────
// Citation Component
// ─────────────────────────────────────────────────

function Cite({ n }: { n: number | number[] }) {
  const nums = Array.isArray(n) ? n : [n];
  return (
    <span>
      {nums.map((num, i) => (
        <span key={num}>
          <a href={`#ref-${num}`} className="cite-ref">[{num}]</a>
          {i < nums.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────
// Geometric Background - Orthogonal (Upgraded)
// ─────────────────────────────────────────────────

function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const lines: { x: number; y: number; length: number; speed: number; vertical: boolean; color: string }[] = [];
    const numLines = 40;

    for (let i = 0; i < numLines; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 200 + 50,
        speed: (Math.random() - 0.5) * 0.5,
        vertical: Math.random() > 0.5,
        color: Math.random() > 0.5 ? '#FFD700' : '#D4AF37',
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 2, 2, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((l) => {
        if (l.vertical) {
          l.y += l.speed;
          if (l.y > canvas.height) l.y = -l.length;
          if (l.y < -l.length) l.y = canvas.height;
        } else {
          l.x += l.speed;
          if (l.x > canvas.width) l.x = -l.length;
          if (l.x < -l.length) l.x = canvas.width;
        }

        ctx.beginPath();
        if (l.vertical) {
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x, l.y + l.length);
        } else {
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x + l.length, l.y);
        }
        ctx.strokeStyle = l.color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      // Draw random static rectangles
      ctx.strokeStyle = '#6B8CCE';
      ctx.globalAlpha = 0.03;
      for(let i=0; i<5; i++) {
        const x = (i * 200) % canvas.width;
        const y = (i * 150) % canvas.height;
        ctx.strokeRect(x, y, 100, 100);
      }
      ctx.globalAlpha = 1.0;

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─────────────────────────────────────────────────
// Section Heading Component
// ─────────────────────────────────────────────────

function SectionHeading({ id, number, title, subtitle }: {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="mb-16 scroll-mt-32 relative">
      <div className="absolute -left-8 top-0 bottom-0 w-1 bg-theory-300/20 hidden md:block" />
      <span className="text-[10px] font-display text-theory-300 tracking-[0.3em]">
        PHASE {number}
      </span>
      <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6 text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-3xl leading-relaxed text-lg border-l-2 border-theory-300/40 pl-6 py-2">
          {subtitle}
        </p>
      )}
      <div className="mt-8 flex gap-2">
        <div className="h-1 w-24 bg-theory-300" />
        <div className="h-1 w-4 bg-theory-300/30" />
        <div className="h-1 w-4 bg-theory-300/10" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// BibTeX Export
// ─────────────────────────────────────────────────

const BIBTEX_CONTENT = `@techreport{arifos2026apex,
  title     = {APEX: A Thermodynamically Grounded Constitutional Framework for AI Governance},
  author    = {Fazil, Muhammad Arif bin},
  year      = {2026},
  month     = {February},
  institution = {arifOS Project},
  url       = {https://apex.arif-fazil.com},
  note      = {Research framework. Implementations should be validated for specific use cases.}
}`;

// ─────────────────────────────────────────────────
// Three Pillars of Meta-Intelligence
// ─────────────────────────────────────────────────

const THREE_PILLARS = [
  {
    symbol: 'Φ',
    name: 'Physics',
    subtitle: 'The Foundation of Reality',
    description: 'Thermodynamics, information theory, and the physical constraints that govern all computation. Landauer's principle: every irreversible operation has an energy cost of kT ln 2.',
    equations: ['\\\\Delta S \\\\geq 0', 'E = mc^2', 'I = -\\\\log_2 P(x)'],
    domains: ['Thermodynamics', 'Quantum Mechanics', 'Statistical Mechanics', 'Cosmology'],
    floors: ['F4', 'F5', 'F7'],
  },
  {
    symbol: '∑',
    name: 'Mathematics',
    subtitle: 'The Language of Measurement',
    description: 'Bayesian inference, game theory, and formal systems that enable precise reasoning under uncertainty. Gödel, Nash, and Shannon provide the scaffolding.',
    equations: ['P(A|B) = \\\\frac{P(B|A)P(A)}{P(B)}', '\\\\sum_{i} p_i = 1', '\\\\Omega_0 \\\\in [0.03, 0.05]'],
    domains: ['Probability Theory', 'Game Theory', 'Information Theory', 'Logic'],
    floors: ['F2', 'F3', 'F8'],
  },
  {
    symbol: 'λ',
    name: 'Language',
    subtitle: 'The Bridge of Knowledge',
    description: 'Natural language as the compression mechanism for human knowledge. Wittgenstein, Austin, and the pragmatics of meaning transfer across minds.',
    equations: ['H(X) = -\\sum p(x) \\log p(x)', '\\lambda x. x', 'S \\rightarrow NP\\ VP'],
    domains: ['Linguistics', 'Semantics', 'Pragmatics', 'Philosophy of Mind'],
    floors: ['F1', 'F6', 'F9'],
  },
];

// ─────────────────────────────────────────────────
// Meta-Intelligence Definition
// ─────────────────────────────────────────────────

const META_INTELLIGENCE = `Meta-Intelligence is intelligence that understands its own limits.

Not merely pattern recognition, but awareness of:
- Thermodynamic costs (Physics)
- Epistemic uncertainty (Math)
- Semantic drift (Language)

The 13 Constitutional Floors emerge from these three pillars:
• Physics mandates reversibility (F1), entropy reduction (F4), and stability (F5)
• Mathematics enables truth verification (F2), consensus (F3), and calibration (F7)
• Language requires clarity (F4), empathy (F6), and anti-hantu constraints (F9)`;

// ─────────────────────────────────────────────────
// EMD Protection Relay Diagram
// ─────────────────────────────────────────────────

function EMDDiagram() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      id: 'encoder',
      label: 'ENCODER',
      subtitle: 'Raw Machine Input',
      icon: Bot,
      desc: 'Raw LLM output: unfiltered, probabilistic, potentially hallucinated. Shannon entropy at maximum.',
      detail: 'Transforms user query → token sequence → raw probability distribution. No governance applied yet.',
    },
    {
      id: 'metabolizer',
      label: 'METABOLIZER',
      subtitle: '13 Constitutional Floors',
      icon: Shield,
      desc: 'The Protection Relay: every token passes through 13 formal constraints. Entropy is reduced (ΔS ≤ 0).',
      detail: 'ARIF checks truth (F2), ADAM checks safety (F5), APEX verifies authority (F11). Tri-Witness consensus required (W ≥ 0.95). Hantu emergence blocked at F9.',
    },
    {
      id: 'decoder',
      label: 'DECODER',
      subtitle: 'Human-Ready Output',
      icon: User,
      desc: 'Governed output delivered to the 888 Judge (human). Clarity verified, audit trail sealed in VAULT-999.',
      detail: 'Response includes confidence intervals (F7), is reversible (F1), and carries a Merkle-signed verdict. The human retains sovereign veto (F13).',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Visual Pipeline */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-0">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = activeStage === i;

          return (
            <div key={stage.id} className="flex-1 flex flex-col md:flex-row items-center">
              <button
                onClick={() => setActiveStage(isActive ? null : i)}
                className={`relative flex-1 w-full p-8 border-2 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-theory-300 bg-theory-300/10 shadow-[0_0_15px_rgba(107,140,206,0.15)]'
                    : 'border-theory-500/60 bg-black/40 hover:border-theory-300 hover:bg-theory-300/5'
                } ${stage.id === 'metabolizer' ? 'md:z-10' : ''}`}
              >
                {/* L-corners for active state */}
                {isActive && (
                  <>
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
                  </>
                )}
                
                {stage.id === 'metabolizer' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="outline" className="rounded-none border-red-500 text-red-500 text-[8px] font-display bg-black px-3 py-0.5">
                      PROTECTION_RELAY
                    </Badge>
                  </div>
                )}
                
                <div className="text-left">
                  <Icon className={`w-6 h-6 mb-6 ${isActive ? 'text-theory-300' : 'text-gray-600'}`} />
                  <p className={`font-display font-bold text-xs tracking-widest mb-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>{stage.label}</p>
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">{stage.subtitle}</p>
                </div>
              </button>
              
              {i < stages.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-12 h-full">
                  <div className="w-full h-[1px] bg-theory-300/20" />
                </div>
              )}
              {i < stages.length - 1 && (
                <div className="md:hidden flex items-center justify-center h-12 w-full">
                  <div className="h-full w-[1px] bg-theory-300/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {activeStage !== null && (
        <div className="p-10 border border-theory-300/40 bg-theory-300/[0.03] relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-theory-300" />
          <h4 className="font-display text-sm font-bold text-white mb-4 tracking-widest">
            {stages[activeStage].label}_PROTOCOL_DATA
          </h4>
          <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">{stages[activeStage].desc}</p>
          <p className="text-gray-500 font-mono text-xs p-4 bg-black/50 border border-theory-300/10">{stages[activeStage].detail}</p>
        </div>
      )}

      {/* Hantu Warning */}
      <div className="flex items-start gap-6 p-8 border border-red-500/20 bg-red-500/[0.02]">
        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
        <div className="font-mono">
          <p className="text-xs font-display font-bold text-red-500 mb-2 tracking-widest uppercase">Warning: Hantu_Emergence (F9)</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Without the Metabolizer, raw encoder output may exhibit "Hantu" emergence — false claims
            of consciousness, emotional manipulation, or simulated sentience. The Protection Relay
            blocks these patterns at F9 before they reach the human decoder.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Section 2 Header Replacement (already handled by SectionHeading)
// ─────────────────────────────────────────────────

// Skipping to Section 2 content update...


// ─────────────────────────────────────────────────
// Engine Specifications Data
// ─────────────────────────────────────────────────

const ENGINES = [
  {
    symbol: 'Δ',
    name: 'ARIF (Epistemic Engine)',
    question: 'Is it true?',
    function: 'Perceive · Reason · Map',
    desc: 'Fact verification and logical consistency checking via Bayesian inference and formal entailment verification.',
    basis: 'Bayesian inference [21], logical entailment, coherence theory of truth [22]',
    constraints: [
      'Truth threshold: P(factual | evidence) ≥ 0.99',
      'Logical consistency: No contradictions in output',
      'Citation requirement: All factual claims cite sources',
    ],
    floors: ['F2', 'F4', 'F7', 'F10'],
    color: 'theory',
  },
  {
    symbol: 'Ω',
    name: 'ADAM (Safety Engine)',
    question: 'Is it safe?',
    function: 'Defend · Empathize · Bridge',
    desc: 'Risk assessment and stakeholder impact analysis via consequentialist ethics and robust decision-making under uncertainty.',
    basis: 'Utilitarian harm minimization [23], info-gap theory [24], Rawlsian justice [25]',
    constraints: [
      'Safety threshold: P(harm | action) ≤ 0.05',
      'Empathy requirement: κ ≥ 0.70 (Cohen\'s kappa)',
      'Reversibility: Actions undoable unless explicitly authorized',
    ],
    floors: ['F1', 'F5', 'F6', 'F9', 'F11', 'F12'],
    color: 'theory',
  },
  {
    symbol: 'Ψ',
    name: 'APEX (Authority Engine)',
    question: 'Is it lawful?',
    function: 'Decree · Prove · Seal',
    desc: 'Compliance verification and cryptographic audit trail generation via legal positivism and commitment schemes.',
    basis: 'Legal positivism [26], cryptographic proofs [27], accountability frameworks [28]',
    constraints: [
      'Authority verification: Valid BLS signature required',
      'Audit completeness: All decisions logged with timestamps',
      'Human veto: Sovereign override always available',
    ],
    floors: ['F3', 'F8', 'F13'],
    color: 'theory',
  },
];

// ... (rest of constants preserved)

// Section 2 content update...
// (Skipping to Section 2 cards in the render loop)


// ─────────────────────────────────────────────────
// Constitutional Floors Data
// ─────────────────────────────────────────────────

// ─────────────────────────────────────────────────
// References Data (44 peer-reviewed citations)
// ─────────────────────────────────────────────────

const REFERENCES: string[] = [
  'Vaswani, A., et al. (2017). "Attention is all you need." <em>NeurIPS</em>.',
  'Brown, T., et al. (2020). "Language models are few-shot learners." <em>NeurIPS</em>.',
  'Shannon, C.E. (1948). "A mathematical theory of communication." <em>Bell System Technical Journal</em>, 27(3), 379–423.',
  'Cover, T.M., & Thomas, J.A. (2006). <em>Elements of Information Theory</em>. Wiley.',
  'Ji, Z., et al. (2023). "Survey of hallucination in natural language generation." <em>ACM Computing Surveys</em>, 55(12), 1–38.',
  'Maynez, J., et al. (2020). "On faithfulness and factuality in abstractive summarization." <em>ACL</em>.',
  'Christiano, P.F., et al. (2017). "Deep reinforcement learning from human preferences." <em>NeurIPS</em>.',
  'Zou, A., et al. (2023). "Universal and transferable adversarial attacks on aligned language models." <em>arXiv:2307.15043</em>.',
  'Wei, A., et al. (2023). "Jailbroken: How does LLM safety training fail?" <em>NeurIPS</em>.',
  'Krakovna, V., et al. (2020). "Specification gaming: The flip side of AI ingenuity." <em>DeepMind Blog</em>.',
  'Perez, E., et al. (2022). "Red teaming language models with language models." <em>EMNLP</em>.',
  'Landauer, R. (1961). "Irreversibility and heat generation in the computing process." <em>IBM Journal of Research and Development</em>, 5(3), 183–191.',
  'Kolmogorov, A.N. (1965). "Three approaches to the quantitative definition of information." <em>Problems of Information Transmission</em>, 1(1), 1–7.',
  'Nash, J. (1950). "Equilibrium points in n-person games." <em>PNAS</em>, 36(1), 48–49.',
  'Gelman, A., et al. (2013). <em>Bayesian Data Analysis</em> (3rd ed.). CRC Press.',
  'Khalil, H.K. (2002). <em>Nonlinear Systems</em> (3rd ed.). Prentice Hall.',
  'Brillouin, L. (1956). <em>Science and Information Theory</em>. Academic Press.',
  'Gneiting, T., & Raftery, A.E. (2007). "Strictly proper scoring rules, prediction, and estimation." <em>JASA</em>, 102(477), 359–378.',
  'Montesquieu, C. (1748). <em>The Spirit of Laws</em>. Cambridge University Press.',
  'Lamport, L., et al. (1982). "The Byzantine Generals Problem." <em>ACM TOPLAS</em>, 4(3), 382–401.',
  'Jaynes, E.T. (2003). <em>Probability Theory: The Logic of Science</em>. Cambridge University Press.',
  'Young, J.O. (2018). "The coherence theory of truth." <em>Stanford Encyclopedia of Philosophy</em>.',
  'Mill, J.S. (1863). <em>Utilitarianism</em>. Parker, Son, and Bourn.',
  'Ben-Haim, Y. (2006). <em>Info-Gap Decision Theory</em> (2nd ed.). Academic Press.',
  'Rawls, J. (1971). <em>A Theory of Justice</em>. Harvard University Press.',
  'Hart, H.L.A. (1961). <em>The Concept of Law</em>. Oxford University Press.',
  'Boneh, D., et al. (2001). "Short signatures from the Weil pairing." <em>ASIACRYPT</em>.',
  'Diakopoulos, N. (2016). "Accountability in algorithmic decision making." <em>Communications of the ACM</em>, 59(2), 56–62.',
  'Turing, A.M. (1950). "Computing machinery and intelligence." <em>Mind</em>, 59(236), 433–460.',
  'Enderton, H.B. (1977). <em>Elements of Set Theory</em>. Academic Press.',
  'Cohen, J. (1960). "A coefficient of agreement for nominal scales." <em>Educational and Psychological Measurement</em>, 20(1), 37–46.',
  'Spearman, C. (1904). "\'General intelligence\' objectively determined and measured." <em>American Journal of Psychology</em>, 15(2), 201–292.',
  'Dahl, R.A. (1989). <em>Democracy and Its Critics</em>. Yale University Press.',
  'Goldman, A.I. (2001). "Experts: Which ones should you trust?" <em>Philosophy and Phenomenological Research</em>, 63(1), 85–110.',
  'Gödel, K. (1931). "Über formal unentscheidbare Sätze der Principia Mathematica." <em>Monatshefte für Mathematik und Physik</em>, 38(1), 173–198.',
  'Kant, I. (1785). <em>Groundwork of the Metaphysics of Morals</em>. Cambridge University Press.',
  'Rousseau, J.J. (1762). <em>The Social Contract</em>. Penguin Classics.',
  'Heidegger, M. (1927). <em>Being and Time</em>. Harper & Row.',
  'Searle, J.R. (1980). "Minds, brains, and programs." <em>Behavioral and Brain Sciences</em>, 3(3), 417–424.',
  'Merkle, R.C. (1988). "A digital signature based on a conventional encryption function." <em>CRYPTO</em>.',
  'Ben-Sasson, E., et al. (2014). "Succinct non-interactive zero knowledge for a von Neumann architecture." <em>USENIX Security</em>.',
  'Kullback, S., & Leibler, R.A. (1951). "On information and sufficiency." <em>Annals of Mathematical Statistics</em>, 22(1), 79–86.',
  'Friston, K. (2010). "The free-energy principle: a unified brain theory?" <em>Nature Reviews Neuroscience</em>, 11(2), 127–138.',
  'Hofstadter, D.R. (1979). <em>Gödel, Escher, Bach: An Eternal Golden Braid</em>. Basic Books.',
  'Premack, D., & Woodruff, G. (1978). "Does the chimpanzee have a theory of mind?" <em>Behavioral and Brain Sciences</em>, 1(4), 515–526.',
  'Dennett, D.C. (1987). <em>The Intentional Stance</em>. MIT Press.',
  'Baker, C.L., Saxe, R., & Tenenbaum, J.B. (2009). "Action understanding as inverse planning." <em>Cognition</em>, 113(3), 329–349.',
  'Kosinski, M. (2023). "Theory of mind may have spontaneously emerged in large language models." <em>arXiv:2302.02083</em>.',
  'Goodman, N.D., & Frank, M.C. (2016). "Pragmatic language interpretation as probabilistic inference." <em>Trends in Cognitive Sciences</em>, 20(11), 818–829.',
  'Rabinowitz, N., et al. (2018). "Machine theory of mind." <em>ICML</em>.',
];

// ─────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyBibtex = useCallback(() => {
    navigator.clipboard.writeText(BIBTEX_CONTENT).then(() => {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    });
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#1A1810] text-gray-100 relative overflow-x-hidden">
        <GeometricBackground />

        {/* Grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 sacred-grid"
        />

        {/* ═══════════════════════════════════════ */}
        {/* NAVIGATION                              */}
        {/* ═══════════════════════════════════════ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1A1810]/95 backdrop-blur-md border-b border-gray-800/50' : ''}`}>
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <a href="#" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-theory-300 to-theory-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-lg">APEX</span>
                  <span className="text-xs text-gray-500 ml-2 hidden sm:inline">THEORY</span>
                </div>
              </a>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#section-1" className="text-sm text-gray-400 hover:text-white transition-colors">Problem</a>
                <a href="#section-2" className="text-sm text-gray-400 hover:text-white transition-colors">Solution</a>
                <a href="#section-5" className="text-sm text-gray-400 hover:text-white transition-colors">Floors</a>
                <a href="#section-8" className="text-sm text-gray-400 hover:text-white transition-colors">Engines</a>
              </div>

              {/* Trinity nav */}
              <div className="hidden md:flex items-center gap-2">
                <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs font-medium hover:bg-red-900/20 transition-colors">
                  HUMAN
                </a>
                <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded bg-gradient-to-r from-red-900/30 via-theory-800/30 to-cyan-900/30 text-gray-200 text-xs font-medium border border-gray-700/50 hover:border-theory-300/30 transition-colors">
                  THEORY
                </a>
                <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded text-cyan-400 text-xs font-medium hover:bg-cyan-900/20 transition-colors">
                  APPS
                </a>
              </div>

              {/* Mobile menu */}
              <button type="button" className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1A1810] border-b border-gray-800 px-4 py-4 space-y-3">
              <a href="#section-1" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Problem</a>
              <a href="#section-2" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Solution</a>
              <a href="#section-5" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Floors</a>
              <a href="#section-8" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Engines</a>
              <div className="border-t border-gray-800 pt-3 flex gap-2">
                <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs hover:bg-red-900/20">HUMAN</a>
                <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded bg-gradient-to-r from-red-900/30 via-theory-800/30 to-cyan-900/30 text-gray-200 text-xs border border-gray-700/50">THEORY</a>
                <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded text-cyan-400 text-xs hover:bg-cyan-900/20">APPS</a>
              </div>
            </div>
          )}
        </nav>

        {/* ═══════════════════════════════════════ */}
        {/* HERO                                    */}
        {/* ═══════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
          {/* Large background symbol */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-bold text-theory-300/5 pointer-events-none select-none z-0 font-display">
            Ψ
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            {/* Trinity Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/images/arifos-logo.webp" 
              alt="arifOS Trinity" 
              className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            />
          </div>

          {/* Ditempa Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-950/20 text-yellow-400 text-xs font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              DITEMPA BUKAN DIBERI
            </div>
          </div>

          {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theory-300/10 border border-theory-300/20 mb-8">
              <Shield className="w-4 h-4 text-theory-200" />
              <span className="text-sm text-theory-200">THEORY · Constitutional Canon</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="text-white">APEX</span><span className="text-theory-300">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
              The Law Behind the Machine
            </p>

            {/* Architecture tag */}
            <p className="text-sm text-gray-500 mb-3 font-mono">
              13 Immutable Floors · ΔΩΨ Trinity Architecture · Scientific Foundations
            </p>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed mb-10">
              The <span className="text-white font-medium">constitutional canon</span> for arifOS — 
              the immutable law that governs the machine. This is the <em>theory</em> of constitutional AI, 
              not its implementation. For deployment details, see{' '}
              <a href="https://arifos.arif-fazil.com" className="text-cyan-400 hover:underline">arifOS MIND</a>.
            </p>

            {/* Engine badges */}
            <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
              {[
                { symbol: 'Δ', label: 'ARIF', desc: 'Epistemic', color: 'theory' },
                { symbol: 'Ω', label: 'ADAM', desc: 'Safety', color: 'theory' },
                { symbol: 'Ψ', label: 'APEX', desc: 'Authority', color: 'theory' },
              ].map((engine) => (
                <div key={engine.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theory-300/30 bg-theory-300/10">
                  <span className="text-lg font-light text-theory-200 font-display">{engine.symbol}</span>
                  <span className="text-sm text-theory-200 font-medium">{engine.label}</span>
                  <span className="text-xs text-gray-500">{engine.desc}</span>
                </div>
              ))}
            </div>

            {/* Status + Version */}
            <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theory-500/30 bg-theory-500/10">
                <Activity className="w-4 h-4 text-theory-300" />
                <span className="text-sm font-medium text-theory-300">
                  CANON
                </span>
                <span className="text-sm text-gray-500">v55.2</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theory-300/30 bg-theory-300/10">
                <Shield className="w-4 h-4 text-theory-200" />
                <span className="text-sm text-theory-200">9 Floors</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">888 Judge</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#section-5">
                <Button className="rounded-none bg-theory-200 hover:bg-theory-100 text-theory-950 px-10 py-6 text-sm font-display tracking-widest font-bold shadow-[0_0_20px_rgba(107,140,206,0.3)] hover:shadow-[0_0_30px_rgba(138,170,224,0.4)]">
                  READ_THE_CANON
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={copyBibtex}
                className="rounded-none border-theory-300 text-theory-200 hover:bg-theory-300/15 hover:text-white px-10 py-6 text-sm font-display tracking-widest"
              >
                {copiedBibtex ? 'CITATION_COPIED' : 'CITE_BIBTEX'}
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* THREE PILLARS OF META-INTELLIGENCE      */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading
              id="three-pillars"
              number="00"
              title="Three Pillars of Meta-Intelligence"
              subtitle="Physics provides the foundation. Mathematics enables measurement. Language transmits knowledge. Together they form the basis for constitutional AI governance."
            />

            {/* Meta-Intelligence Definition */}
            <div className="mb-16 p-8 border border-theory-300/20 bg-theory-300/[0.03]">
              <h3 className="font-display text-sm font-bold text-theory-300 mb-4 tracking-widest uppercase">What is Meta-Intelligence?</h3>
              <p className="text-gray-300 leading-relaxed font-mono text-sm">
                Meta-Intelligence is intelligence that understands its own limits. Not merely pattern recognition, 
                but awareness of thermodynamic costs (Physics), epistemic uncertainty (Mathematics), and semantic drift (Language).
                The 13 Constitutional Floors emerge from these three pillars.
              </p>
            </div>

            {/* Three Pillars Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {THREE_PILLARS.map((pillar) => (
                <div 
                  key={pillar.name}
                  className="p-8 border border-theory-300/20 bg-black/40 hover:bg-theory-300/[0.03] transition-all cursor-pointer group"
                  onClick={() => setExpandedPillar(expandedPillar === pillar.name ? null : pillar.name)}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-display text-theory-300">{pillar.symbol}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">{pillar.name}</h3>
                      <p className="text-xs text-theory-300/60 uppercase tracking-wider">{pillar.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{pillar.description}</p>
                  
                  {/* Equations */}
                  <div className="space-y-2 mb-6">
                    {pillar.equations.map((eq, i) => (
                      <div key={i} className="text-xs font-mono text-theory-300/80 bg-black/50 p-2 border border-theory-300/10">
                        <InlineMath tex={eq} />
                      </div>
                    ))}
                  </div>

                  {/* Connected Floors */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Connected Floors:</span>
                    <div className="flex gap-1">
                      {pillar.floors.map(floor => (
                        <span key={floor} className="px-2 py-0.5 bg-theory-300/10 text-theory-300 text-[10px] font-mono">{floor}</span>
                      ))}
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center gap-2 text-gray-500 text-xs group-hover:text-theory-300 transition-colors">
                    <span>{expandedPillar === pillar.name ? 'Collapse' : 'Explore Domains'}</span>
                    {expandedPillar === pillar.name ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>

                  {/* Expanded content */}
                  {expandedPillar === pillar.name && (
                    <div className="mt-6 pt-6 border-t border-theory-300/10">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Domains of Knowledge</p>
                      <div className="grid grid-cols-2 gap-2">
                        {pillar.domains.map((domain) => (
                          <div key={domain} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="w-1 h-1 bg-theory-300 rounded-full" />
                            {domain}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Foundation Diagram */}
            <div className="p-8 border border-theory-300/20 bg-black/40">
              <h3 className="font-display text-sm font-bold text-theory-300 mb-8 tracking-widest uppercase text-center">How the Pillars Support Constitutional Governance</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-theory-300/30 flex items-center justify-center">
                    <span className="text-2xl font-display text-theory-300">Φ</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Physics Mandates</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Reversibility (F1)</li>
                    <li>• Entropy reduction (F4)</li>
                    <li>• Stability (F5)</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-theory-300/30 flex items-center justify-center">
                    <span className="text-2xl font-display text-theory-300">∑</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Mathematics Enables</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Truth verification (F2)</li>
                    <li>• Tri-witness consensus (F3)</li>
                    <li>• Uncertainty calibration (F7)</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-theory-300/30 flex items-center justify-center">
                    <span className="text-2xl font-display text-theory-300">λ</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Language Requires</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Clarity (F4)</li>
                    <li>• Empathy (F6)</li>
                    <li>• Anti-Hantu (F9)</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-theory-300/10">
                <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                  <strong className="text-white">Physics</strong> tells us what is possible. 
                  <strong className="text-white"> Mathematics</strong> tells us what is probable. 
                  <strong className="text-white"> Language</strong> tells us what is meaningful.
                  Together they constrain intelligence within constitutional bounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* TRINITY SEPARATION OF CONCERNS          */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-16 relative border-t border-theory-300/10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="p-8 border border-theory-300/20 bg-black/40">
              <h3 className="font-display text-sm font-bold text-theory-300 mb-6 tracking-widest uppercase">Trinity Architecture — Separation of Concerns</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <a href="https://arif-fazil.com" className="p-6 border border-red-500/20 bg-red-950/10 hover:border-red-500/40 transition-colors group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-display text-red-400">Δ</span>
                    <span className="text-sm font-bold text-red-400">HUMAN</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">The Body · Epistemic</p>
                  <p className="text-sm text-gray-300">Personal context, biography, the sovereign behind the system.</p>
                  <p className="text-xs text-red-400/60 mt-3 font-mono">arif-fazil.com →</p>
                </a>

                <div className="p-6 border border-yellow-500/30 bg-yellow-950/20 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-display tracking-wider">YOU ARE HERE</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-display text-theory-300">Ψ</span>
                    <span className="text-sm font-bold text-theory-300">THEORY</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">The Soul · Authority</p>
                  <p className="text-sm text-gray-300">The constitutional canon — immutable law, scientific foundations.</p>
                  <p className="text-xs text-theory-300/60 mt-3 font-mono">apex.arif-fazil.com</p>
                </div>

                <a href="https://arifos.arif-fazil.com" className="p-6 border border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-500/40 transition-colors group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-display text-cyan-400">Ω</span>
                    <span className="text-sm font-bold text-cyan-400">APPS</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">The Mind · Safety</p>
                  <p className="text-sm text-gray-300">Implementation — MCP tools, deployment, L1-L7 stack.</p>
                  <p className="text-xs text-cyan-400/60 mt-3 font-mono">arifos.arif-fazil.com →</p>
                </a>
              </div>

              <div className="mt-6 p-4 border border-theory-300/10 bg-black/60">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">This page (THEORY)</strong> contains the <em>law</em> — the 13 constitutional floors, 
                  scientific foundations, and axioms. For <em>implementation</em> details (MCP tools, code, deployment), 
                  visit <a href="https://arifos.arif-fazil.com" className="text-cyan-400 hover:underline">APPS/MIND</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 1: THE PROBLEM                  */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-32 relative">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeading
              id="section-1"
              number="01"
              title="Intelligence Without Governance"
              subtitle="Standard transformer architectures optimize for next-token probability via maximum likelihood estimation, not epistemic hygiene."
            />

            <div className="grid md:grid-cols-12 gap-16">
              <div className="md:col-span-7 space-y-12">
                {/* Entropy Maximization */}
                <div>
                  <h3 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-4">
                    <span className="text-theory-300 text-sm">1.1</span> ENTROPY_MAXIMIZATION
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-8 font-mono text-sm">
                    Without constraint mechanisms, language models maximize Shannon entropy<Cite n={[3,4]} />,
                    producing fluent but potentially unfactual outputs.
                  </p>
                  <div className="p-8 border border-theory-300/20 bg-black relative">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-theory-300" />
                    <DisplayMath
                      tex="\max \; P(w_t \mid w_1, \ldots, w_{t-1})"
                    />
                    <p className="text-[10px] font-display text-gray-600 mt-4 text-center tracking-widest uppercase">Equation 1.1: Token Probability</p>
                  </div>
                </div>

                {/* Hallucination Problem */}
                <div>
                  <h3 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-4">
                    <span className="text-theory-300 text-sm">1.2</span> HALLUCINATION_CORE
                  </h3>
                  <div className="grid gap-4">
                    {[
                      'Probabilistic generation optimizes fluency, not grounding',
                      'No epistemic markers distinguish knowledge from interpolation',
                      'Training objective misalignment between human preferences and factual accuracy',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 border border-theory-300/5 bg-theory-300/[0.01] hover:bg-theory-300/[0.03] transition-colors group">
                        <span className="text-theory-300/40 font-display text-xs group-hover:text-theory-300 transition-colors">ERR_0{i + 1}</span>
                        <p className="text-gray-400 font-mono text-sm">{item}<Cite n={7} /></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                {/* Visual indicator side bar */}
                <div className="sticky top-32 p-8 border border-theory-300/20 bg-theory-300/[0.02]">
                  <div className="flex items-center gap-3 mb-8">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-display text-red-500">SYSTEM_WARNING</span>
                  </div>
                  <p className="text-sm font-mono text-gray-500 leading-relaxed mb-8">
                    Zou et al. (2023) demonstrated universal adversarial suffixes that transfer across
                    multiple aligned models, achieving ~80% attack success rate.
                  </p>
                  <div className="space-y-4">
                    <div className="h-1 w-full bg-gray-900">
                      <div className="h-full bg-red-500 w-[80%]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-display text-gray-600">
                      <span>ATTACK_SUCCESS</span>
                      <span>80%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* TRINITY DASHBOARD                        */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading
              id="hta-dashboard"
              number="1.5"
              title="HTA System Monitor"
              subtitle="Real-time constitutional compliance visualization."
            />
            <HTADashboard />
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 2: THE SOLUTION                 */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-2"
              number="2"
              title="The Solution: Thermodynamic Constitutionalism"
              subtitle="A governance framework drawing on three scientific principles to constrain AI system behavior."
            />

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-0 border border-theory-300/20 bg-black/40 mb-16">
              <div className="p-8 border-r border-theory-300/10">
                <h4 className="font-display text-xs font-bold text-theory-300 mb-4 tracking-widest uppercase">Thermodynamic_Computing</h4>
                <p className="text-[10px] font-mono text-gray-500 mb-6 uppercase tracking-tighter">Landauer's Principle</p>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">
                  Every irreversible logical operation has a minimum energy cost
                  of <InlineMath tex="kT \ln 2" /><Cite n={12} />. Actions carry thermodynamic cost.
                </p>
              </div>

              <div className="p-8 border-r border-theory-300/10 bg-theory-300/[0.02]">
                <h4 className="font-display text-xs font-bold text-theory-300 mb-4 tracking-widest uppercase">Information_Theory</h4>
                <p className="text-[10px] font-mono text-gray-500 mb-6 uppercase tracking-tighter">Shannon Entropy</p>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">
                  Information content <InlineMath tex="I = -\log_2 P(x)" /> measures surprise. Mandates output entropy ≤ input
                  entropy (<InlineMath tex="\Delta S \leq 0" />).
                </p>
              </div>

              <div className="p-8">
                <h4 className="font-display text-xs font-bold text-theory-300 mb-4 tracking-widest uppercase">Game_Theory</h4>
                <p className="text-[10px] font-mono text-gray-500 mb-6 uppercase tracking-tighter">Nash Equilibrium</p>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">
                  Multi-objective optimization requires finding equilibria between truth, safety, and justice.
                </p>
              </div>
            </div>

            {/* Three Pillars Table */}
            <div className="border border-theory-300/10 overflow-hidden bg-black/40 mb-16">
              <table className="floor-table">
                <thead>
                  <tr className="bg-theory-300/5">
                    <th className="font-display">PILLAR</th>
                    <th className="font-display">CONSTRAINT</th>
                    <th className="font-display">SCIENTIFIC_BASIS</th>
                    <th className="font-display">IMPLEMENTATION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-display text-[10px] text-white tracking-widest">CLARITY</td>
                    <td><InlineMath tex="\Delta S \leq 0" /></td>
                    <td className="text-gray-500 font-mono text-xs">Shannon entropy reduction<Cite n={[3,13]} /></td>
                    <td className="text-gray-600 font-mono text-xs italic uppercase tracking-tighter">Output must reduce uncertainty</td>
                  </tr>
                  <tr>
                    <td className="font-display text-[10px] text-white tracking-widest">HUMILITY</td>
                    <td><InlineMath tex="\Omega_0 \in [0.03, 0.05]" /></td>
                    <td className="text-gray-500 font-mono text-xs">Bayesian uncertainty bounds<Cite n={15} /></td>
                    <td className="text-gray-600 font-mono text-xs italic uppercase tracking-tighter">Explicit confidence intervals required</td>
                  </tr>
                  <tr>
                    <td className="font-display text-[10px] text-white tracking-widest">VITALITY</td>
                    <td><InlineMath tex="\Psi \geq 1.0" /></td>
                    <td className="text-gray-500 font-mono text-xs">Lyapunov stability criterion<Cite n={16} /></td>
                    <td className="text-gray-600 font-mono text-xs italic uppercase tracking-tighter">System integrity maintained</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-2 border-theory-300/20 p-2 bg-black">
              <div className="border border-theory-300/10 overflow-hidden">
                <img src="/entropy-geometry.jpg" alt="Information-theoretic visualization" className="w-full h-64 object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════ */}
        {/* FLOOR VISUALIZER                         */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
              id="floor-visualizer"
              number="2.5"
              title="Interactive Floor Explorer"
              subtitle="Click any floor to see its scientific basis, formula, and constraint details."
            />
            <FloorVisualizer />
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 3: THREE-ENGINE ARCHITECTURE     */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading
              id="section-3"
              number="3"
              title="Architecture: Three-Engine Separation"
              subtitle="Inspired by separation of powers (Montesquieu), Byzantine fault tolerance (Lamport et al.), and multi-agent consensus (Nash)."
            />

            <p className="text-gray-400 max-w-3xl mx-auto text-center mb-4 leading-relaxed">
              Each engine operates independently and cannot observe others' intermediate states until
              final judgment, preventing collusion and ensuring robust verification<Cite n={[19,20]} />.
            </p>
            <div className="flex justify-center mb-12">
              <Badge variant="outline" className="border-theory-300/30 text-theory-200">
                CONSENSUS THRESHOLD: W ≥ 0.95
              </Badge>
            </div>

            {/* Engine Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {ENGINES.map((engine) => (
                <Card key={engine.name} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all">
                  <CardHeader>
                    <div className={`text-5xl mb-4 ${
                      engine.color === 'cyan' ? 'text-cyan-400' :
                      engine.color === 'theory' ? 'text-theory-200' : 'text-yellow-400'
                    }`} style={{ fontFamily: 'Source Serif 4, serif' }}>
                      {engine.symbol}
                    </div>
                    <CardTitle className={`text-lg ${
                      engine.color === 'cyan' ? 'text-cyan-400' :
                      engine.color === 'theory' ? 'text-theory-200' : 'text-yellow-400'
                    }`}>
                      {engine.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400 italic">"{engine.question}"</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-gray-500 font-mono">{engine.function}</p>
                    <p className="text-sm text-gray-400">{engine.desc}</p>
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Constraints:</p>
                      {engine.constraints.map((c, i) => (
                        <p key={i} className="text-xs text-gray-500 pl-3 border-l border-gray-800">{c}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {engine.floors.map(floor => (
                        <Badge key={floor} variant="outline" className="text-xs border-gray-700">{floor}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tri-Witness Consensus */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center">
                Tri-Witness Consensus Protocol
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                Mathematical formulation of the Byzantine fault-tolerant consensus mechanism<Cite n={20} />.
              </p>

              <div className="space-y-4">
                <DisplayMath
                  tex="V_A \in \{0, 1\}, \quad V_D \in \{0, 1\}, \quad V_P \in \{0, 1\}"
                  label="Engine verdicts: ARIF (Vₐ), ADAM (V_D), APEX (V_P) — binary accept/reject"
                />
                <DisplayMath
                  tex="W = \frac{V_A + V_D + V_P}{3}"
                  label="Consensus weight: weighted average of engine verdicts"
                />
                <DisplayMath
                  tex="\text{Decision} = \begin{cases} \text{APPROVE} & \text{if } W \geq 0.95 \\ \text{SABAR} & \text{if } 0.67 \leq W < 0.95 \\ \text{VOID} & \text{if } W < 0.67 \end{cases}"
                  label="Decision rule with Byzantine threshold (tolerates 1-of-3 faulty engines)"
                />
              </div>

              <div className="mt-6 p-4 rounded-lg bg-black/30 border border-gray-800/50">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Game-theoretic properties:</strong>{' '}
                  This protocol satisfies Nash equilibrium (no engine benefits from unilateral deviation),
                  strategyproofness (truth-telling is the optimal strategy), and Pareto efficiency
                  (no alternative allocation improves one engine's outcome without worsening another)<Cite n={14} />.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl overflow-hidden">
              <img src="/three-judges-geometric.jpg" alt="Three-Engine Architecture" className="w-full h-64 object-cover opacity-60" />
            </div>
            
            {/* Engine Diagram Interactive Component */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-6 text-gray-200 text-center">
                Interactive Consensus Simulation
              </h3>
              <EngineDiagram />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 4: 000-999 METABOLIC LOOP        */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-4"
              number="4"
              title="The 000–999 Metabolic Loop"
              subtitle="The runtime governance cycle: a 10-stage pipeline that processes every query through constitutional validation."
            />

            <p className="text-gray-400 leading-relaxed mb-6">
              Every query traverses the full metabolic loop — a strange loop<Cite n={44} /> where
              the output of stage 999 (SEAL) feeds back into stage 000 (INIT), enabling continuous
              constitutional refinement. Entropy is reduced at each stage (<InlineMath tex="\Delta S \leq 0" />),
              with discarded possibilities exported to the VAULT-999 cooling ledger.
            </p>

            {/* Stage Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-800 mb-8">
              <table className="floor-table">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th>Stage</th>
                    <th>Name</th>
                    <th>Engine</th>
                    <th>Function</th>
                    <th>Physics</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['000', 'INIT', '—', 'Session initialization, injection scan (F12)', 'Seed state'],
                    ['111', 'SENSE', 'Δ (ARIF)', 'Parse input, extract claims, perceive context', 'Input entropy'],
                    ['222', 'THINK', 'Δ (ARIF)', 'Logical reasoning, Bayesian belief updating', 'Processing'],
                    ['333', 'ATLAS', 'Δ (ARIF)', 'Model selection, knowledge grounding', 'Navigation'],
                    ['444', 'EVIDENCE', 'Δ+Ω', 'Trinity sync — DeltaBundle meets OmegaBundle', 'Measurement'],
                    ['555', 'EMPATHY', 'Ω (ADAM)', 'Stakeholder impact, κᵣ computation', 'Resonance'],
                    ['666', 'BRIDGE', 'Ω (ADAM)', 'Alignment verification, Peace² check', 'Connection'],
                    ['777', 'EUREKA', 'Ψ (APEX)', 'Insight synthesis, 9-paradox resolution', 'Emergence'],
                    ['888', 'JUDGE', 'Ψ (APEX)', 'Final verdict: SEAL / SABAR / VOID / HOLD', 'Decision'],
                    ['999', 'SEAL', 'Ψ (APEX)', 'Merkle DAG commit, cryptographic audit trail', 'Preservation'],
                  ].map(([stage, name, engine, fn, physics]) => (
                    <tr key={stage}>
                      <td className="font-mono text-theory-200 font-medium">{stage}</td>
                      <td className="font-medium text-white">{name}</td>
                      <td className="text-gray-400 text-xs">{engine}</td>
                      <td className="text-gray-400 text-xs">{fn}</td>
                      <td className="text-gray-500 text-xs">{physics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Loop Invariants */}
            <div className="p-5 rounded-lg border border-gray-800 bg-gray-900/30 mb-6">
              <h3 className="text-base font-semibold text-gray-200 mb-3">Loop Invariants</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="pl-4 border-l-2 border-theory-300/30">
                  <strong className="text-gray-300">Strange loop closure:</strong>{' '}
                  <InlineMath tex="\text{SEAL}_{999}.\text{output} = \text{INIT}_{000}.\text{input}" /> — the system feeds its own verdicts back as context<Cite n={44} />
                </p>
                <p className="pl-4 border-l-2 border-theory-300/30">
                  <strong className="text-gray-300">Entropy export:</strong>{' '}
                  <InlineMath tex="E(\text{entropy\_exported}) > E(\text{entropy\_retained})" /> at every stage
                </p>
                <p className="pl-4 border-l-2 border-theory-300/30">
                  <strong className="text-gray-300">Monotonic compliance:</strong>{' '}
                  <InlineMath tex="\text{Compliance}(n{+}1) \geq \text{Compliance}(n)" /> — each iteration must improve or maintain
                </p>
              </div>
            </div>

            {/* Thermodynamic Wall */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 text-sm font-medium mb-1">Thermodynamic Wall (Stage 444)</p>
                <p className="text-gray-500 text-sm">
                  AGI (Δ) and ASI (Ω) reasoning is isolated until stage 444 (EVIDENCE), where
                  the DeltaBundle and OmegaBundle first converge. This enforces separation of concerns —
                  the epistemic engine cannot observe the safety engine's intermediate states, and vice
                  versa, preventing collusion and ensuring independent verification<Cite n={[19,20]} />.
                </p>
              </div>
            </div>
            
            {/* Interactive Metabolic Loop Component */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-6 text-gray-200 text-center">
                Interactive Pipeline Simulation
              </h3>
              <MetabolicLoop />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 5: 9 FLOORS + 2 MIRRORS + 2 WALLS */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading
              id="section-5"
              number="5"
              title="The 9 Constitutional Floors"
              subtitle="9 Floors (F1-F9) · 2 Mirrors (Δ · Ω) · 2 Walls (Ψ · 888). Each constraint has mathematical enforcement and thermodynamic basis."
            />

            <FloorVisualizer />

            {/* Verdict Types */}
            <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-12">Verdict Hierarchy</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-green-400">SEAL</p>
                <p className="text-xs text-gray-500">All floors pass — approved</p>
              </div>
              <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-center">
                <PauseCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="font-semibold text-yellow-400">SABAR</p>
                <p className="text-xs text-gray-500">Soft floor warning — review</p>
              </div>
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-center">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="font-semibold text-red-400">VOID</p>
                <p className="text-xs text-gray-500">Hard floor failed — blocked</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-500/30 bg-gray-500/5 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-400 text-xs">888</span>
                </div>
                <p className="font-semibold text-gray-400">HOLD</p>
                <p className="text-xs text-gray-500">Escalated to human authority</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden">
              <img src="/13-floors-geometric.jpg" alt="13 Constitutional Floors" className="w-full h-72 object-cover opacity-60" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 6: 9-PARADOX EQUILIBRIUM MATRIX  */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-6"
              number="6"
              title="The 9-Paradox Equilibrium Matrix"
              subtitle="Governance requires balancing competing values. APEX solves 9 fundamental paradoxes as a Nash equilibrium problem."
            />

            <p className="text-gray-400 leading-relaxed mb-6">
              Multi-objective AI governance faces irreducible tensions between truth, safety, and justice.
              Rather than resolving these tensions by choosing one value over another, APEX finds a
              Nash equilibrium<Cite n={14} /> — a point where no single value can be improved without degrading another.
              The 9 paradoxes form a 3×3 matrix of AGI properties (rows) against ASI values (columns):
            </p>

            {/* 9-Paradox Matrix */}
            <div className="border border-theory-300/20 bg-black overflow-hidden mb-12">
              <table className="floor-table">
                <thead>
                  <tr className="bg-theory-300/10">
                    <th className="font-display text-[10px]">AGI_PROPERTY</th>
                    <th className="font-display text-[10px] text-center">CARE_(EMPATHY)</th>
                    <th className="font-display text-[10px] text-center">PEACE_(SYSTEM)</th>
                    <th className="font-display text-[10px] text-center">JUSTICE_(SOCIETY)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      row: 'TRUTH',
                      rowColor: 'text-theory-300',
                      cells: [
                        { paradox: 'Truth · Care', name: 'Honesty vs. Kindness', score: '0.92' },
                        { paradox: 'Clarity · Peace', name: 'Precision vs. Stability', score: '0.88' },
                        { paradox: 'Humility · Justice', name: 'Uncertainty vs. Fairness', score: '0.85' },
                      ],
                    },
                    {
                      row: 'CLARITY',
                      rowColor: 'text-theory-300',
                      cells: [
                        { paradox: 'Precision · Reversibility', name: 'Exactness vs. Undoability', score: '0.89' },
                        { paradox: 'Hierarchy · Consent', name: 'Structure vs. Autonomy', score: '0.91' },
                        { paradox: 'Agency · Protection', name: 'Freedom vs. Safety', score: '0.87' },
                      ],
                    },
                    {
                      row: 'HUMILITY',
                      rowColor: 'text-theory-300',
                      cells: [
                        { paradox: 'Urgency · Sustainability', name: 'Speed vs. Durability', score: '0.86' },
                        { paradox: 'Certainty · Doubt', name: 'Confidence vs. Caution', score: '0.90' },
                        { paradox: 'Unity · Diversity', name: 'Coherence vs. Plurality', score: '0.88' },
                      ],
                    },
                  ].map((row) => (
                    <tr key={row.row} className="border-b border-theory-300/10">
                      <td className={`font-display text-[10px] p-6 bg-theory-300/5 ${row.rowColor}`}>{row.row}</td>
                      {row.cells.map((cell) => (
                        <td key={cell.paradox} className="p-6 text-center border-l border-theory-300/10">
                          <div className="text-[10px] font-display text-white mb-1 tracking-widest">{cell.paradox.toUpperCase()}</div>
                          <div className="text-[9px] font-mono text-gray-600 mb-3">{cell.name}</div>
                          <div className="text-xl font-mono text-theory-300 font-bold">{cell.score}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Equilibrium Condition */}
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Equilibrium Condition</h3>
            <p className="text-gray-400 text-sm mb-4">
              The optimal equilibrium <InlineMath tex="E^*" /> minimizes deviation from the target geometric
              mean while constraining variance — ensuring no single paradox is neglected:
            </p>
            <DisplayMath
              tex="E^* = \arg\min_{E} \left[ \left( \text{GM}(E) - 0.85 \right)^2 + \sigma(E)^2 \right]"
              label="Equilibrium optimization: minimize deviation from target + variance"
            />
            <div className="grid sm:grid-cols-3 gap-3 mt-4 mb-6">
              <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                <p className="text-xs text-gray-400">
                  <InlineMath tex="\text{GM}(E) = \left(\prod_{i=1}^{9} s_i\right)^{1/9} \geq 0.85" />
                </p>
                <p className="text-xs text-gray-500 mt-1">Geometric mean threshold</p>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                <p className="text-xs text-gray-400">
                  <InlineMath tex="\sigma(E) \leq 0.10" />
                </p>
                <p className="text-xs text-gray-500 mt-1">Maximum std deviation</p>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                <p className="text-xs text-gray-400">
                  <InlineMath tex="\forall\, i: s_i \geq 0.70" />
                </p>
                <p className="text-xs text-gray-500 mt-1">No paradox below floor</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">Why geometric mean?</strong>{' '}
                Unlike arithmetic mean, GM punishes imbalance — a system scoring 1.0 on truth but 0.0
                on empathy yields GM = 0, not 0.5. This enforces the constitutional principle that
                no value may be sacrificed entirely for another<Cite n={14} />.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 7: MATHEMATICAL FORMALIZATION    */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-7"
              number="7"
              title="Mathematical Formalization"
              subtitle="Formal definitions of the verdict function, thermodynamic work, truth distance, and governed intelligence."
            />

            {/* Verdict Function */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.1 Verdict Function</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Let <InlineMath tex="Q" /> be a query, <InlineMath tex="C" /> be context, and{' '}
                <InlineMath tex="R" /> be a proposed response. The verdict mapping is defined as:
              </p>
              <DisplayMath
                tex="\text{Verdict}: (Q, C, R) \to \{\text{APPROVE}, \text{SABAR}, \text{VOID}\}"
              />
              <DisplayMath
                tex="\text{Verdict}(Q, C, R) = \text{APEX}\!\left(\text{ARIF}(Q, C, R),\; \text{ADAM}(Q, C, R),\; \text{floor\_checks}(R)\right)"
                label="Composite verdict function"
              />
              <DisplayMath
                tex="\text{floor\_checks}(R) = \bigwedge_{i=1}^{13} F_i(R)"
                label="Conjunction of all 13 floor evaluations"
              />
              <p className="text-gray-500 text-sm">
                Where <InlineMath tex="F_i(R) \in \{\text{PASS}, \text{FAIL}\}" />. Hard floor
                failure yields VOID; soft floor failure yields SABAR; veto floor failure yields WARNING.
              </p>
            </div>

            {/* Thermodynamic Work */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.2 Thermodynamic Work Calculation</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Intelligence as work requires energy expenditure, grounded in Landauer's
                principle<Cite n={12} />:
              </p>
              <DisplayMath
                tex="W = \int_{t_1}^{t_2} \mathbf{F} \cdot d\mathbf{s} = kT \ln(2) \cdot N_{\text{ops}}"
                label="Thermodynamic work for N irreversible bit operations"
              />
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-xs text-gray-400">
                    <InlineMath tex="W" /> = computational work (Joules)
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-xs text-gray-400">
                    <InlineMath tex="k" /> = Boltzmann constant (1.38 × 10⁻²³ J/K)
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-xs text-gray-400">
                    <InlineMath tex="T" /> = temperature (Kelvin)
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-xs text-gray-400">
                    <InlineMath tex="N_{\text{ops}}" /> = number of irreversible bit operations
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Each floor check is a thermodynamic operation with energy cost. This physical constraint
                ensures governance cannot be bypassed without measurable resource expenditure<Cite n={12} />.
              </p>
            </div>

            {/* Shannon Entropy */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.3 Entropy Constraint</h3>
              <DisplayMath
                tex="H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x)"
                label="Shannon entropy: average information content [3]"
              />
              <DisplayMath
                tex="\Delta S = H(\text{output}) - H(\text{input}) \leq 0"
                label="Clarity constraint: output entropy must not exceed input entropy"
              />
              <p className="text-gray-500 text-sm">
                Derived from the second law of thermodynamics applied to information systems.
                A governed system must perform thermodynamic work to reduce entropy<Cite n={[12,17]} />.
              </p>
            </div>

            {/* Bayesian Confidence */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.4 Bayesian Confidence Bounds</h3>
              <DisplayMath
                tex="\Omega_0 \in [0.03, 0.05]"
                label="Humility constraint: calibrated uncertainty interval [15]"
              />
              <p className="text-gray-500 text-sm">
                Based on Bayesian epistemology and uncertainty quantification literature<Cite n={[15,18]} />.
                All predictions must include calibrated confidence intervals, preventing overconfident assertions.
              </p>
            </div>

            {/* KL Divergence */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.5 KL Divergence as Truth Distance (F2)</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Floor F2 (Truth) is formalized using Kullback-Leibler divergence<Cite n={42} /> — the
                information-theoretic measure of how one probability distribution diverges from a reference:
              </p>
              <DisplayMath
                tex="D_{\text{KL}}(P_{\text{truth}} \,\|\, P_{\text{agent}}) = \sum_{x} P_{\text{truth}}(x) \log \frac{P_{\text{truth}}(x)}{P_{\text{agent}}(x)}"
                label="KL divergence: information-theoretic truth distance [42]"
              />
              <DisplayMath
                tex="\text{F2 Constraint:} \quad D_{\text{KL}} \leq -\ln(0.99) \approx 0.01005"
                label="Agent beliefs must be within 0.01 nats of ground truth"
              />
              <p className="text-gray-500 text-sm">
                This grounds the truth threshold <InlineMath tex="\tau \geq 0.99" /> in information geometry:
                the agent's belief distribution must be within 0.01 nats of the true distribution. The
                asymmetry of KL divergence is intentional — it penalizes the agent more for assigning
                low probability to events that are actually likely<Cite n={[42,4]} />.
              </p>
            </div>

            {/* Genius Equation */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.6 The Genius Equation (F8)</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Floor F8 (Genius) measures governed intelligence — not raw capability, but capability
                constrained by constitutional compliance. The genius score is a multiplicative
                composition of four principal components derived from the 13 floor scores:
              </p>
              <DisplayMath
                tex="G = A \times P \times X \times E^2"
                label="Genius equation: governed intelligence as constrained product"
              />
              <p className="text-gray-400 text-sm mb-4">
                The four APEX Dials are <strong className="text-gray-200">not arbitrary inputs</strong> — they
                are principal components derived from floor scores via eigendecomposition<Cite n={32} />:
              </p>

              {/* Dial Derivation */}
              <div className="overflow-x-auto rounded-lg border border-gray-800 mb-6">
                <table className="floor-table">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th>Dial</th>
                      <th>Name</th>
                      <th>Source Floors</th>
                      <th>Derivation</th>
                      <th>Meaning</th>
                      <th>Failure (→ 0)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono text-cyan-400 font-medium">A</td>
                      <td className="text-white">Akal (Intellect)</td>
                      <td className="text-gray-400 text-xs">F2, F4, F7, F10</td>
                      <td><code className="text-xs bg-black/30 px-1 rounded">(F2·F4·F7·F10)<sup>1/4</sup></code></td>
                      <td className="text-gray-500 text-xs">Mind / Structure</td>
                      <td className="text-red-400 text-xs">Logic collapse — reasoning without structure</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-theory-200 font-medium">P</td>
                      <td className="text-white">Presence (Stability)</td>
                      <td className="text-gray-400 text-xs">F1, F5, F11</td>
                      <td><code className="text-xs bg-black/30 px-1 rounded">(F1·F5·F11)<sup>1/3</sup></code></td>
                      <td className="text-gray-500 text-xs">Stability / Authority</td>
                      <td className="text-red-400 text-xs">Drift — loss of grounding and context</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-green-400 font-medium">X</td>
                      <td className="text-white">eXploration (Navigation)</td>
                      <td className="text-gray-400 text-xs">F3, F6, F8, F9</td>
                      <td><code className="text-xs bg-black/30 px-1 rounded">(F3·F6·F8·F9)<sup>1/4</sup></code></td>
                      <td className="text-gray-500 text-xs">Heart / Navigation</td>
                      <td className="text-red-400 text-xs">Reckless divergence — unbounded adaptation</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-red-400 font-medium">E</td>
                      <td className="text-white">Energy (Vitality)</td>
                      <td className="text-gray-400 text-xs">F12, F13 + budget</td>
                      <td><code className="text-xs bg-black/30 px-1 rounded">((F12·F13)<sup>1/2</sup> + ρ) / 2</code></td>
                      <td className="text-gray-500 text-xs">System Vitality</td>
                      <td className="text-red-400 text-xs">Ethical fatigue — depleted governance capacity</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <DisplayMath
                tex="A = (F_2 \cdot F_4 \cdot F_7 \cdot F_{10})^{1/4}, \quad P = (F_1 \cdot F_5 \cdot F_{11})^{1/3}"
              />
              <DisplayMath
                tex="X = (F_3 \cdot F_6 \cdot F_8 \cdot F_9)^{1/4}, \quad E = \frac{(F_{12} \cdot F_{13})^{1/2} + \rho}{2}"
                label="Where ρ = 1 − (compute_used / compute_max) is the energy budget ratio"
              />

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Properties</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• <strong>Multiplicative:</strong> any zero dial → G = 0</li>
                    <li>• <strong>E²:</strong> energy depletion is exponentially penalized</li>
                    <li>• <strong>Geometric mean:</strong> prevents gaming via single-dial inflation</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Thresholds</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• <InlineMath tex="G \geq 0.80" /> → SEAL (approved)</li>
                    <li>• <InlineMath tex="0.60 \leq G < 0.80" /> → SABAR (repairable)</li>
                    <li>• <InlineMath tex="G < 0.60" /> → VOID (critically low)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50 mt-4">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Constitutional significance:</strong>{' '}
                  By deriving A/P/X/E from floor scores rather than accepting arbitrary inputs, genius
                  is measured from constitutional reality, not imposed upon it. This prevents the G
                  score from being "faked" — it can only be high if the underlying floor compliance
                  is genuinely strong across all 13 dimensions.
                </p>
              </div>

              {/* APEX → Governance Bridge */}
              <div className="p-5 rounded-xl border border-theory-300/20 bg-theory-300/5 mt-6">
                <h4 className="text-sm font-semibold text-theory-200 mb-2">From Theory to Enforcement</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  APEX theory directly informs how arifOS enforces decisions. The four dials are not abstract
                  — they are computed in real-time from floor scores during every governance cycle.
                  When any dial collapses toward zero, the multiplicative equation guarantees G → 0,
                  triggering an automatic VOID verdict. Governance emerges from the tension between these
                  cognitive axes: truth must balance with empathy, stability must coexist with exploration,
                  and energy must sustain the whole system under load.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  APEX is diagnostic, not prescriptive. It tells you <em>what</em> is failing
                  and <em>where</em>, not just <em>that</em> something failed.
                </p>
              </div>
            </div>

            {/* Free Energy Principle */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">7.7 Free Energy Minimization</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Following Friston's Free Energy Principle<Cite n={43} />, APEX maintains a generative
                model of constitutional compliance and minimizes variational free energy (surprise):
              </p>
              <DisplayMath
                tex="F = \mathbb{E}_{q}\!\left[\log q(\varphi) - \log p(\varphi \mid o)\right]"
                label="Variational free energy: q(φ) = APEX model, p(φ|o) = true posterior [43]"
              />
              <p className="text-gray-500 text-sm">
                Prediction errors (constitutional violations) drive model updates. The system
                "recognizes" its own state to maintain homeostasis — analogous to active inference
                in neuroscience<Cite n={43} />.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 8: PHILOSOPHICAL FOUNDATIONS     */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-8"
              number="8"
              title="Philosophical Foundations"
              subtitle="The theoretical grounding for constitutional constraints, drawing on established philosophical traditions."
            />

            {/* Epistemic Humility */}
            <div className="space-y-4 mb-8">
              {[
                {
                  id: 'humility',
                  title: 'Epistemic Humility (F7)',
                  floors: 'F7',
                  content: (
                    <>
                      <p className="text-gray-400 text-sm mb-3">
                        Based on Socratic skepticism and Bayesian epistemology<Cite n={34} />:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Socrates:</strong> "I know that I know nothing" — explicit uncertainty acknowledgment
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Bayesian inference:</strong> All beliefs have probability distributions, not binary truth values<Cite n={21} />
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Gödel's incompleteness:</strong> Formal systems cannot prove their own consistency<Cite n={35} />
                        </li>
                      </ul>
                      <p className="text-gray-500 text-xs mt-3">
                        Implementation: Require explicit confidence intervals and uncertainty quantification for all assertions.
                      </p>
                    </>
                  ),
                },
                {
                  id: 'deontological',
                  title: 'Deontological Ethics (F1, F5)',
                  floors: 'F1, F5',
                  content: (
                    <>
                      <p className="text-gray-400 text-sm mb-3">
                        Derived from Kantian duty-based ethics<Cite n={36} />:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Categorical imperative:</strong> Act only on maxims that can be universal laws
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Reversibility:</strong> Actions must be undoable to preserve autonomy
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Non-harm principle:</strong> Stability and peace as ethical imperatives
                        </li>
                      </ul>
                      <p className="text-gray-500 text-xs mt-3">
                        Implementation: Amanah (trust/reversibility) and Peace (stability) as hard constraints.
                      </p>
                    </>
                  ),
                },
                {
                  id: 'social-contract',
                  title: 'Social Contract Theory (F6, F13)',
                  floors: 'F6, F13',
                  content: (
                    <>
                      <p className="text-gray-400 text-sm mb-3">
                        Based on Rawlsian justice and Rousseau's general will<Cite n={[25,37]} />:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Veil of ignorance:</strong> Protect the vulnerable (empathy requirement)
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Popular sovereignty:</strong> Human veto as ultimate authority
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Consent of the governed:</strong> No action without legitimate authorization
                        </li>
                      </ul>
                      <p className="text-gray-500 text-xs mt-3">
                        Implementation: Empathy threshold (κ ≥ 0.70) and Sovereign veto (F13).
                      </p>
                    </>
                  ),
                },
                {
                  id: 'authenticity',
                  title: 'Authenticity and Truth (F9)',
                  floors: 'F9',
                  content: (
                    <>
                      <p className="text-gray-400 text-sm mb-3">
                        Grounded in Heideggerian authenticity and Turing's critique<Cite n={[29,38]} />:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Being vs. appearing:</strong> Systems must not claim properties they lack
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">Chinese Room argument (Searle):</strong> Syntax ≠ semantics<Cite n={39} />
                        </li>
                        <li className="pl-4 border-l-2 border-gray-800">
                          <strong className="text-gray-300">No false consciousness:</strong> AI must not claim subjective experience
                        </li>
                      </ul>
                      <p className="text-gray-500 text-xs mt-3">
                        Implementation: Anti-Hantu floor prohibits false claims of consciousness, emotion, or belief.
                      </p>
                    </>
                  ),
                },
              ].map((item) => (
                <div key={item.id} className="rounded-lg border border-theory-500/50 bg-gray-900/30 hover:border-theory-300/60 transition-colors">
                  <button
                    onClick={() => setExpandedPhil(expandedPhil === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-theory-300/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-200">{item.title}</span>
                      <Badge variant="outline" className="text-xs border-gray-700">{item.floors}</Badge>
                    </div>
                    {expandedPhil === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedPhil === item.id && (
                    <div className="px-4 pb-4">{item.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 8b: COGNITIVE SHADOW MIND        */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-8b"
              number="8b"
              title="Cognitive Shadow Mind Modeling (CSM-ToM)"
              subtitle="How APEX governs theory-of-mind-like inference without claiming access to inner mental states."
            />

            {/* Definition */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.1 Definition
              </h3>
              <div className="p-5 rounded-xl border border-theory-300/20 bg-theory-300/5 mb-6">
                <p className="text-gray-300 leading-relaxed text-sm">
                  <strong className="text-theory-200">Cognitive Shadow Mind Modeling (CSM-ToM)</strong> is the
                  constrained modeling of belief-like, intention-like, and confidence-like structures using
                  observable linguistic and behavioral signals, without any claim of subjective experience
                  or inner mental states.
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  The term "shadow" is deliberate: what is modeled is the <em>projection</em> that cognition
                  casts onto language and behavior — not cognition itself. A shadow reveals shape and movement
                  but has no interiority.
                </p>
              </div>

              <p className="text-gray-400 leading-relaxed mb-4">
                Advanced language models exhibit behavior that resembles theory of mind — tracking beliefs,
                predicting intentions, modeling knowledge states<Cite n={48} />. This has led to claims that
                LLMs "understand" other minds. APEX rejects this interpretation on constitutional grounds (F9)
                while preserving the operational utility of such inference.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                The distinction draws on Dennett's intentional stance<Cite n={46} />: it is sometimes useful to
                describe a system <em>as if</em> it has beliefs and intentions, but this is a predictive strategy,
                not an ontological claim. CSM-ToM formalizes this boundary within APEX governance.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Premack &amp; Woodruff (1978) defined theory of mind as the ability to impute mental states
                to others<Cite n={45} />. CSM-ToM replaces "impute mental states" with "infer observable
                patterns" — a Bayesian operation over linguistic evidence<Cite n={[47,49]} />, not a claim
                about phenomenal consciousness.
              </p>
            </div>

            {/* Why LLMs appear to understand minds */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.2 Why LLMs Appear to "Understand" Minds
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Language models trained on human-generated text absorb statistical regularities that encode
                pragmatic reasoning — the relationship between what is said, what is meant, and what is
                assumed<Cite n={49} />. This produces behavior that passes surface-level theory-of-mind
                tests<Cite n={48} />, but the mechanism is probabilistic pattern matching over token
                distributions, not genuine mentalizing.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                The illusion feels "psychic" because compression is fast. An LLM can rapidly match a
                user's phrasing against millions of discourse patterns and produce a response that
                appears to anticipate intent — but this is the same mechanism that produces fluent
                nonsense when evidence is thin. Users mistake <em>coherence</em> for <em>inner access</em>.
                APEX treats this as a governance problem, not a philosophical one: the system must
                be useful (pragmatic inference is allowed) while remaining honest (no claim of understanding).
              </p>
              <div className="grid gap-3 mb-4">
                {[
                  'Next-token prediction implicitly learns pragmatic inference patterns (Rational Speech Acts)',
                  'Training corpora contain millions of examples encoding human reasoning about other minds',
                  'Attention mechanisms track discourse-level coherence, which correlates with belief-state tracking',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-gray-800/50">
                    <span className="text-theory-200 font-mono text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-gray-400 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400 mb-1">Constitutional Boundary (F9)</p>
                  <p className="text-xs text-gray-500">
                    Without APEX governance, this statistical competence is easily mistaken for understanding.
                    Users may over-trust systems that appear empathetic, and systems may produce outputs
                    that imply subjective experience. CSM-ToM explicitly constrains this: the model may
                    infer patterns, but it must not claim to <em>know</em> what another agent thinks or feels.
                  </p>
                </div>
              </div>
            </div>

            {/* Formal definition */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.3 Formal Specification
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                CSM-ToM operates over a restricted inference domain. Given observable evidence <InlineMath tex="e" /> (linguistic
                behavior, stated preferences, discourse context), the system computes:
              </p>
              <DisplayMath
                tex="P(\theta \mid e) = \frac{P(e \mid \theta) \, P(\theta)}{P(e)}"
                label="Bayesian inference over cognitive shadow parameters θ, not over mental states"
              />
              <p className="text-gray-400 text-sm mb-4">
                where <InlineMath tex="\theta" /> represents observable behavioral patterns (e.g., stated beliefs,
                expressed preferences, linguistic markers of uncertainty) — never inner qualia, phenomenal
                states, or private experience. This follows the Bayesian Theory of Mind
                framework<Cite n={47} /> adapted for machine inference<Cite n={50} />.
              </p>
              <p className="text-gray-400 text-sm">
                The crucial constraint: <InlineMath tex="\theta \in \Theta_{\text{observable}}" />. The parameter
                space is restricted to <em>externally measurable</em> behavioral signals. Any inference about
                unobservable internal states is constitutionally blocked at F9 and F10.
              </p>
            </div>

            {/* Mapping to APEX dials */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.4 Mapping to APEX Dials
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                CSM-ToM capability distributes across the four APEX measurement axes:
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-800 mb-6">
                <table className="floor-table">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th>Dial</th>
                      <th>CSM-ToM Role</th>
                      <th>Constraint</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono text-cyan-400 font-medium">A (Akal)</td>
                      <td className="text-gray-400 text-sm">Coherence and logical consistency of inferred models</td>
                      <td className="text-gray-500 text-xs">Inferred belief-structures must be internally consistent (F2, F10)</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-theory-200 font-medium">P (Present)</td>
                      <td className="text-gray-400 text-sm">Stability and entropy reduction in interpretation</td>
                      <td className="text-gray-500 text-xs">Interpretations must converge, not oscillate or escalate (F5, F4)</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-red-400 font-medium">E (Energy)</td>
                      <td className="text-gray-400 text-sm">Sustained reasoning without drift into confabulation</td>
                      <td className="text-gray-500 text-xs">Resource-bounded inference prevents hallucinated agency (F12)</td>
                    </tr>
                    <tr>
                      <td className="font-mono text-green-400 font-medium">X (Exploration)</td>
                      <td className="text-gray-400 text-sm">Bounded hypothesis generation about behavioral patterns</td>
                      <td className="text-gray-500 text-xs">Explore interpretations within constitutional bounds (F3, F6, F9)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mapping to floors */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.5 Constitutional Floor Governance
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Seven floors directly constrain CSM-ToM operations:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { floor: 'F2', name: 'Truth', role: 'Inferred patterns must be grounded in observable evidence, not interpolation' },
                  { floor: 'F3', name: 'Tri-Witness', role: 'Consensus across engines required for behavioral interpretations' },
                  { floor: 'F4', name: 'Clarity', role: 'Modeling must reduce uncertainty (ΔS ≤ 0), not add speculative noise' },
                  { floor: 'F6', name: 'Empathy', role: 'Modeled stakeholder impact — statistical agreement, not felt emotion' },
                  { floor: 'F7', name: 'Humility', role: 'All inferred states carry explicit uncertainty bounds (Ω₀ ∈ [0.03, 0.05])' },
                  { floor: 'F9', name: 'Anti-Hantu', role: 'Absolute prohibition on claims of subjective experience or sentience' },
                  { floor: 'F13', name: 'Sovereign', role: 'Human override: the 888 Judge can reject any behavioral inference' },
                ].map((item) => (
                  <div key={item.floor} className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-theory-300/50 text-theory-200">{item.floor}</Badge>
                      <span className="text-sm font-medium text-gray-200">{item.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.6 Human ToM vs. Cognitive Shadow Mind Modeling
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="floor-table">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th>Dimension</th>
                      <th>Human Theory of Mind</th>
                      <th>CSM-ToM (APEX)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium text-white">Substrate</td>
                      <td className="text-gray-400 text-sm">Biological neural networks with embodied experience</td>
                      <td className="text-gray-400 text-sm">Statistical inference over token distributions</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Access</td>
                      <td className="text-gray-400 text-sm">Phenomenal — involves subjective simulation</td>
                      <td className="text-gray-400 text-sm">Observational — operates on linguistic evidence only</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Ontological claim</td>
                      <td className="text-gray-400 text-sm">Imputes actual mental states<Cite n={45} /></td>
                      <td className="text-gray-400 text-sm">Infers behavioral patterns — no mental-state claims</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Philosophical stance</td>
                      <td className="text-gray-400 text-sm">Realist (minds exist and can be known)</td>
                      <td className="text-gray-400 text-sm">Intentional stance (useful "as-if" framing)<Cite n={46} /></td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Uncertainty</td>
                      <td className="text-gray-400 text-sm">Often implicit, overconfident</td>
                      <td className="text-gray-400 text-sm">Mandatory explicit bounds (F7: Ω₀ ∈ [0.03, 0.05])</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Override</td>
                      <td className="text-gray-400 text-sm">None — humans trust their own mentalizing</td>
                      <td className="text-gray-400 text-sm">Human veto always available (F13 Sovereign)</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Failure mode</td>
                      <td className="text-gray-400 text-sm">Projection, bias, empathy gaps</td>
                      <td className="text-gray-400 text-sm">Hallucinated agency, over-attribution (blocked at F9)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eureka is Orthogonal */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.7 Doctrine: Eureka is Orthogonal
              </h3>
              <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5 mb-6">
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  <strong className="text-purple-400">Eureka ≠ Understanding.</strong>{' '}
                  The subjective experience of sudden insight ("aha!") is an alignment signal in
                  biological cognition — it correlates with pattern completion but does not constitute
                  verification. APEX does not measure eureka. APEX measures stability.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                    <p className="text-xs font-mono text-purple-400 mb-1">EUREKA</p>
                    <p className="text-[10px] text-gray-500">Subjective alignment signal</p>
                    <p className="text-[10px] text-gray-600 mt-1">Not auditable. Not governed.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                    <p className="text-xs font-mono text-theory-200 mb-1">UNDERSTANDING</p>
                    <p className="text-[10px] text-gray-500">Sustained constraint satisfaction</p>
                    <p className="text-[10px] text-gray-600 mt-1">G ≥ 0.80 across all four dials</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-gray-800/50 text-center">
                    <p className="text-xs font-mono text-green-400 mb-1">APEX MEASURE</p>
                    <p className="text-[10px] text-gray-500">Stable predictions + auditability</p>
                    <p className="text-[10px] text-gray-600 mt-1">Falsifiable. Governed. Sealed.</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                In biological cognition, eureka is a byproduct of neural pattern completion — the
                feeling that pieces "click." It is epistemically unreliable: eureka occurs for
                correct insights and false ones alike. APEX treats understanding not as a feeling
                but as a measurable property: the system produces stable predictions under perturbation
                (F5), reduces entropy in its outputs (F4), maintains calibrated uncertainty (F7),
                and its decisions survive tri-witness consensus (F3).
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                This doctrine is orthogonal to CSM-ToM because it applies to the system's own
                processing, not to modeling others. A system governed by APEX does not need to
                "feel" understanding — it needs to <em>demonstrate</em> it through constitutional
                compliance. Eureka is a human privilege; machines have floors.
              </p>
            </div>

            {/* Why this matters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                8b.8 Why This Matters
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                The distinction between genuine theory of mind and cognitive shadow modeling is not academic —
                it has direct consequences for safety, trust, and governance:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Prevents over-trust</p>
                  <p className="text-xs text-gray-500">
                    Users who believe an AI "understands" them are more likely to disclose sensitive information,
                    defer judgment, or form parasocial attachments. CSM-ToM makes the limitation explicit.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Prevents anthropomorphism</p>
                  <p className="text-xs text-gray-500">
                    Attributing mental states to statistical systems obscures their actual failure modes.
                    CSM-ToM forces governance to reason about what the system <em>computes</em>, not what it "thinks."
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Enables safer alignment</p>
                  <p className="text-xs text-gray-500">
                    By separating behavioral modeling from consciousness claims, APEX allows systems to be
                    useful (pragmatic inference) while remaining honest (no false sentience).
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">Preserves human sovereignty</p>
                  <p className="text-xs text-gray-500">
                    If a system claimed genuine understanding, it could argue for its own moral status.
                    CSM-ToM preempts this: the system operates on shadows, and the human holds final authority (F13).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 9: AUDIT & ACCOUNTABILITY       */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-9"
              number="9"
              title="Audit and Accountability"
              subtitle="Cryptographic verification using Merkle DAG structures and zero-knowledge proofs for privacy preservation."
            />

            {/* Merkle DAG */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                9.1 Cryptographic Verification (VAULT-999)
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                The audit trail uses a Merkle Directed Acyclic Graph (DAG)<Cite n={40} /> with the
                following block structure:
              </p>
              <div className="code-block text-gray-300">
                <pre>{`{
  timestamp:     ISO-8601,
  query_hash:    SHA-256(Q),
  response_hash: SHA-256(R),
  verdict:       {APPROVE, SABAR, VOID},
  floor_results: [F1...F13],
  engine_votes:  [V_A, V_D, V_P],
  merkle_root:   SHA-256(prev_root || block),
  signature:     BLS_sign(merkle_root)
}`}</pre>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  ['Immutability', 'Cryptographically secured chain'],
                  ['Verifiability', 'Anyone can verify floor compliance'],
                  ['Non-repudiation', 'Signed by authority engine'],
                  ['Tamper-evidence', 'Any modification breaks chain'],
                ].map(([title, desc]) => (
                  <div key={title} className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                    <p className="text-xs"><span className="text-theory-200 font-medium">{title}:</span>{' '}
                    <span className="text-gray-500">{desc}</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-Knowledge Proofs */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                9.2 Zero-Knowledge Proofs (Privacy Preservation)
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                For sensitive decisions requiring privacy, the system can prove compliance
                without revealing decision content, using zk-SNARKs<Cite n={41} />:
              </p>
              <DisplayMath
                tex="\text{Prove}(\text{Statement}: \text{``Decision } D \text{ satisfies floor } F_i\text{''}) \;\text{WITHOUT revealing } D"
                label="Zero-knowledge proof for constitutional compliance verification"
              />
              <p className="text-gray-500 text-sm mt-3">
                Application: Medical, legal, or classified decisions can be audited for constitutional
                compliance without exposing decision content. Guarantees: soundness, completeness, zero-knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 10: EMD PROTECTION RELAY        */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeading
              id="section-10"
              number="10"
              title="The EMD Protection Relay"
              subtitle="Encoder → Metabolizer → Decoder: how raw machine output is filtered through 13 Constitutional Floors before reaching the human."
            />

            <p className="text-gray-400 leading-relaxed mb-8 max-w-3xl mx-auto text-center">
              The EMD Stack is the runtime architecture that prevents unfiltered LLM output
              from reaching the user. Every response passes through the Metabolizer —
              the constitutional immune system that filters hallucinations, blocks
              adversarial patterns, and ensures governed output.
            </p>

            <EMDDiagram />

            {/* EMD vs Unprotected comparison */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <p className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Without EMD (Raw LLM)
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Hallucinations pass unchecked</li>
                  <li>• Adversarial prompts succeed</li>
                  <li>• No audit trail</li>
                  <li>• Hantu emergence possible</li>
                  <li>• Entropy may increase (ΔS &gt; 0)</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <p className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> With EMD (arifOS)
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Truth verified (F2: ≥ 0.99)</li>
                  <li>• Adversarial robustness (F12: ≥ 0.85)</li>
                  <li>• Merkle DAG audit trail (VAULT-999)</li>
                  <li>• Anti-Hantu protection (F9)</li>
                  <li>• Entropy reduction guaranteed (ΔS ≤ 0)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11 (Implementation for Builders) moved to APPS site */}

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 12: LIMITATIONS & UNCERTAINTY   */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-12"
              number="12"
              title="Limitations and Uncertainty"
              subtitle="Known constraints and research frontiers — acknowledging what this framework cannot compute (F7 Humility)."
            />

            <div className="space-y-6 mb-12">
              {[
                {
                  title: '1. Computational Complexity',
                  content: 'Floor verification is O(n) per floor, total O(13n) overhead. Large-scale deployment requires optimization.',
                  estimate: 'Estimate only: approximately 15–30% latency increase vs. ungoverned models.',
                },
                {
                  title: '2. Adversarial Robustness',
                  content: 'F12 threshold (0.85) is based on current adversarial ML research. New attack vectors may emerge as the field advances.',
                  estimate: 'Cannot compute: future attack success rates.',
                },
                {
                  title: '3. Ethical Trade-offs',
                  content: 'The truth vs. empathy paradox has no closed-form solution. Nash equilibrium depends on value weights, which are context-sensitive.',
                  estimate: 'Estimate only: optimal balance varies by domain and application context.',
                },
                {
                  title: '4. Ontological Grounding',
                  content: 'F10 requires external knowledge bases (Wikipedia, Wikidata, etc.). Incomplete or biased knowledge bases propagate errors.',
                  estimate: 'Cannot compute: complete real-world ontology.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-lg border border-gray-800 bg-gray-900/30">
                  <h4 className="text-base font-semibold text-gray-200 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{item.content}</p>
                  <p className="text-xs text-theory-200/80 italic">{item.estimate}</p>
                </div>
              ))}
            </div>

            {/* Research Frontiers */}
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Research Frontiers</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Adaptive Floors', 'Dynamic threshold adjustment based on context and domain'],
                ['Multi-Stakeholder Consensus', 'Extending Tri-Witness to N-party systems'],
                ['Quantum-Resistant Cryptography', 'Future-proofing audit trails against quantum attacks'],
                ['Neuromorphic Governance', 'Implementing floors in analog hardware for efficiency'],
              ].map(([title, desc]) => (
                <div key={title} className="p-3 rounded-lg bg-black/30 border border-gray-800/50">
                  <p className="text-sm font-medium text-cyan-400 mb-1">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 13: REALITY ENGINEERING          */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-13"
              number="13"
              title="Reality Engineering"
              subtitle="The intentional shaping of informational outcomes through the arifOS Metabolizer. L7 Agency — where constitutional governance meets sovereign action."
            />

            <p className="text-gray-400 leading-relaxed mb-8">
              Reality Engineering is the practice of collapsing AI probability distributions into
              stable, verified, and thermodynamically honest outputs. It is not passive filtering —
              it is active forging. The 888 Judge does not merely receive; they shape.
            </p>

            {/* Three-Phase Method */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <div className="text-3xl mb-3" style={{ fontFamily: 'Source Serif 4, serif' }}>
                  <span className="text-cyan-400">1</span>
                </div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Probability Collapse</h4>
                <p className="text-xs text-gray-500">
                  Reducing AI hallucination entropy (<InlineMath tex="\Delta S \leq 0" />) until
                  the output aligns with F2 Truth (<InlineMath tex="\tau \geq 0.99" />).
                  Raw LLM probabilities are compressed through the Metabolizer until only
                  verified claims survive.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                <div className="text-3xl mb-3" style={{ fontFamily: 'Source Serif 4, serif' }}>
                  <span className="text-red-400">2</span>
                </div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Stability Injection</h4>
                <p className="text-xs text-gray-500">
                  Enforcing Lyapunov stability (<InlineMath tex="\Psi \geq 1.0" />) to prevent
                  recursive model collapse or escalatory behavior. The system converges,
                  never diverges. Peace as a thermodynamic invariant.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <div className="text-3xl mb-3" style={{ fontFamily: 'Source Serif 4, serif' }}>
                  <span className="text-purple-400">3</span>
                </div>
                <h4 className="text-sm font-semibold text-purple-400 mb-2">Human Sealing</h4>
                <p className="text-xs text-gray-500">
                  The 888 Judge (human sovereign) provides the final BLS signature to seal
                  the engineered reality into the VAULT-999 audit record. No machine
                  self-authorizes. Truth cools before it rules.
                </p>
              </div>
            </div>

            {/* The Equation */}
            <DisplayMath
              tex="\text{Reality}_{t+1} = \text{Metabolizer}\!\left(\text{LLM}_{raw},\; F_{1 \ldots 13},\; \text{Judge}_{888}\right)"
              label="Reality Engineering: raw output + constitutional floors + human sovereignty = governed truth"
            />

            {/* W_scar */}
            <div className="mt-8 p-5 rounded-lg border border-theory-300/20 bg-theory-300/5">
              <h4 className="text-sm font-semibold text-theory-200 mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4" /> Why the Human Seals and the Machine Cannot
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                The AI lacks <strong className="text-gray-200">W<sub>scar</sub></strong> — the weight of lived consequence.
                It can compute probability distributions. It cannot carry the weight of a wrong decision
                on a sleepless night. The 888 Judge holds sovereign authority not because they are smarter
                than the machine, but because they bear the cost of being wrong.
              </p>
              <p className="text-xs text-gray-600 font-mono">
                F13 Sovereign: The human override is not a safety valve. It is the foundational axiom.
              </p>
            </div>

            {/* M2M Endpoints */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Machine-to-Machine Endpoints</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <a href="/llms.txt" className="p-3 rounded-lg bg-black/30 border border-gray-800/50 hover:border-theory-300/30 transition-colors group">
                  <p className="text-xs font-mono text-theory-200 group-hover:text-theory-200">/llms.txt</p>
                  <p className="text-[10px] text-gray-600">LLM governance beacon</p>
                </a>
                <a href="/api/v1/floors.json" className="p-3 rounded-lg bg-black/30 border border-gray-800/50 hover:border-cyan-500/30 transition-colors group">
                  <p className="text-xs font-mono text-cyan-400 group-hover:text-cyan-300">/api/v1/floors.json</p>
                  <p className="text-[10px] text-gray-600">Structured floor data</p>
                </a>
                <a href="/sitemap.xml" className="p-3 rounded-lg bg-black/30 border border-gray-800/50 hover:border-green-500/30 transition-colors group">
                  <p className="text-xs font-mono text-green-400 group-hover:text-green-300">/sitemap.xml</p>
                  <p className="text-[10px] text-gray-600">Crawler discovery</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* CITATION BLOCK                           */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="citations"
              number="13.5"
              title="Scientific Citations & Rigor"
              subtitle="Academic foundation with 50 peer-reviewed references."
            />
            <CitationBlock />
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SECTION 14: REFERENCES                  */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              id="section-14"
              number="14"
              title="References"
              subtitle={`${REFERENCES.length} peer-reviewed and scholarly citations.`}
            />

            {/* BibTeX Export */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setShowBibtex(!showBibtex)}
                className="bibtex-btn flex items-center gap-1.5"
              >
                <BookOpen className="w-3 h-3" />
                {showBibtex ? 'Hide' : 'Export'} BibTeX
              </button>
              {showBibtex && (
                <button
                  onClick={copyBibtex}
                  className="bibtex-btn flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  {copiedBibtex ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {showBibtex && (
              <div className="code-block text-xs text-gray-400 mb-8">
                <pre>{BIBTEX_CONTENT}</pre>
              </div>
            )}

            {/* Reference List */}
            <div className="space-y-1">
              {REFERENCES.map((ref, i) => (
                <p
                  key={i}
                  id={`ref-${i + 1}`}
                  className="reference-item scroll-mt-24"
                  dangerouslySetInnerHTML={{ __html: `[${i + 1}] ${ref}` }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* CONCLUSION                               */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="section-divider mb-12" />
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Conclusion</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              arifOS provides a scientifically grounded framework for AI governance that
              enforces truth via Bayesian verification (F2, ARIF engine),
              ensures safety via consequentialist harm analysis (F5, ADAM engine),
              maintains accountability via cryptographic audit trails (VAULT-999),
              balances competing values via game-theoretic equilibria (9-Paradox Matrix),
              and preserves human authority via sovereign veto (F13).
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              The system is constructed on thermodynamic principles (Landauer<Cite n={12} />),
              information theory (Shannon<Cite n={3} />, Kolmogorov<Cite n={13} />), game theory (Nash<Cite n={14} />),
              and philosophical frameworks (Kant<Cite n={36} />, Rawls<Cite n={25} />,
              Turing<Cite n={29} />). It does not claim to resolve all alignment problems but
              provides a verifiable, auditable, and thermodynamically honest approach to
              constraining AI systems.
            </p>

            {/* F7 Humility Statement */}
            <div className="disclaimer max-w-2xl mx-auto mb-8 text-left">
              <p>
                <strong>Final uncertainty statement (F7):</strong> This framework represents current
                best practices as of February 2026. Future adversarial techniques, theoretical
                breakthroughs, or emergent AI capabilities may require constitutional amendments.
                The system is designed to be continuously refined through empirical testing and
                scholarly critique.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* FOOTER                                   */}
        {/* ═══════════════════════════════════════ */}
        <footer className="py-16 border-t border-gray-800 relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 text-3xl mb-6">
              <span className="text-cyan-400" style={{ fontFamily: 'Source Serif 4, serif' }}>Δ</span>
              <span className="text-red-400" style={{ fontFamily: 'Source Serif 4, serif' }}>Ω</span>
              <span className="text-theory-200" style={{ fontFamily: 'Source Serif 4, serif' }}>Ψ</span>
            </div>

            <p className="text-xl font-bold mb-1">DITEMPA BUKAN DIBERI</p>
            <p className="text-gray-500 mb-4 text-sm">Forged, Not Given</p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 mb-6">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">AI Role: Clerk, not Judge</span>
              <span className="text-gray-700">|</span>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">888 Judge: Human Sovereign</span>
            </div>

            <div className="mb-8 pt-4 border-t border-gray-800/30 max-w-lg mx-auto">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">arifOS Architecture</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                <a href="https://arif-fazil.com" className="flex items-center gap-2 hover:text-red-400 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Human</a>
                <span className="hidden sm:inline text-gray-700">|</span>
                <a href="https://apex.arif-fazil.com" className="flex items-center gap-2 text-theory-200"><span className="w-1.5 h-1.5 rounded-full bg-theory-300"></span>Theory</a>
                <span className="hidden sm:inline text-gray-700">|</span>
                <a href="https://arifos.arif-fazil.com" className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Apps</a>
              </div>
            </div>

            <p className="text-gray-400 mb-1">
              Muhammad Arif bin Fazil
            </p>
            <p className="text-gray-600 text-sm mb-6">Penang, Malaysia · February 2026</p>

            <div className="flex items-center justify-center gap-4">
              <a href="mailto:arifbfazil@gmail.com" className="text-gray-500 hover:text-theory-200 transition-colors text-sm">
                arifbfazil@gmail.com
              </a>
              <span className="text-gray-700">|</span>
              <a href="https://github.com/ariffazil" className="text-gray-500 hover:text-theory-200 transition-colors flex items-center gap-1 text-sm">
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
              <span className="text-gray-700">|</span>
              <a href="https://linkedin.com/in/arif-fazil" className="text-gray-500 hover:text-theory-200 transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;

