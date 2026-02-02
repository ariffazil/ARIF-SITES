import { useEffect, useState } from 'react';
import {
  BookOpen,
  Cpu,
  Shield,
  Activity,
  Code,
  Terminal,
  Layers,
  Sparkles,
  Zap,
  GitBranch,
  Globe,
  Menu,
  X,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Server,
  Lock,
  Search,
  Lightbulb,
  Scale,
  Users,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Workflow,
  Wrench,
  Bot,
  Building2,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// 7-Layer Stack data
const LAYERS = [
  {
    id: 'L1',
    name: 'PROMPT',
    tagline: 'Zero-Context Entry',
    desc: 'Copy a system prompt, paste to any AI. Instant constitutional governance with no setup required.',
    coverage: '30%',
    status: 'ready',
    statusLabel: 'Ready',
    icon: MessageSquare,
    color: 'emerald',
    stage: '000-111',
    details: '5 prompt files + examples. Works with any LLM that accepts system instructions.',
  },
  {
    id: 'L2',
    name: 'SKILLS',
    tagline: 'Parameterized Templates',
    desc: 'Reusable YAML + Python skill definitions. Parameterized commands that enforce constitutional floors.',
    coverage: '50%',
    status: 'ready',
    statusLabel: 'Ready',
    icon: Sparkles,
    color: 'emerald',
    stage: '222',
    details: '50+ skill templates. YAML frontmatter with Python wrappers for tool integration.',
  },
  {
    id: 'L3',
    name: 'WORKFLOW',
    tagline: 'Documented Sequences',
    desc: 'Team standard operating procedures. 6 workflow files mapping to constitutional stages.',
    coverage: '70%',
    status: 'ready',
    statusLabel: 'Ready',
    icon: Workflow,
    color: 'emerald',
    stage: '333-444',
    details: 'Session init, intent detection, context mapping, safety checks, implementation, and commit workflows.',
  },
  {
    id: 'L4',
    name: 'TOOLS',
    tagline: '9 MCP Tools · Production',
    desc: 'The constitutional MCP server. 9 explicit tools running the Trinity parallel pipeline (AGI || ASI → APEX).',
    coverage: '80%',
    status: 'production',
    statusLabel: 'Production',
    icon: Wrench,
    color: 'cyan',
    stage: '555-666',
    details: 'FastAPI + SSE transport on Railway. 28/28 schema tests passing. v55.2-SEAL.',
  },
  {
    id: 'L5',
    name: 'AGENTS',
    tagline: '4-Agent Federation',
    desc: 'Architect, Engineer, Auditor, Validator — four autonomous agents coordinating under constitutional law.',
    coverage: '90%',
    status: 'stubs',
    statusLabel: 'Stubs Only',
    icon: Bot,
    color: 'red',
    stage: '777',
    details: 'Architecture defined, stubs created with correct signatures. 0% functional — all methods pass.',
  },
  {
    id: 'L6',
    name: 'INSTITUTION',
    tagline: 'Trinity Multi-Agent System',
    desc: 'Mind/Heart/Soul roles, Tri-Witness gate, Phoenix-72 cooling system. Full institutional governance.',
    coverage: '100%',
    status: 'design',
    statusLabel: 'Design Only',
    icon: Building2,
    color: 'amber',
    stage: '888',
    details: 'Design documented. Constitutional orchestrator, role definitions, witness gate planned for v56.0.',
  },
  {
    id: 'L7',
    name: 'AGI',
    tagline: 'Constitutional AGI',
    desc: 'Self-improving intelligence within constitutional bounds. F10 Ontology Lock + F13 Sovereign Veto.',
    coverage: '∞',
    status: 'research',
    statusLabel: 'Research',
    icon: Brain,
    color: 'violet',
    stage: '999→000',
    details: 'Theoretical research phase. Hard constraints: no consciousness claims, human override always available.',
  },
];

// 13 Floors data
const FLOORS = [
  { id: 'F1', name: 'Amanah', desc: 'Trust through reversibility', icon: GitBranch, color: 'red' },
  { id: 'F2', name: 'Truth', desc: 'Verifiable claims only', icon: Shield, color: 'red' },
  { id: 'F3', name: 'Consensus', desc: 'Tri-witness agreement', icon: Users, color: 'red' },
  { id: 'F4', name: 'Certainty', desc: 'Confidence thresholds', icon: Scale, color: 'orange' },
  { id: 'F5', name: 'Peace', desc: 'Non-violence embedded', icon: Shield, color: 'orange' },
  { id: 'F6', name: 'Clarity', desc: 'Entropy reduction', icon: Lightbulb, color: 'orange' },
  { id: 'F7', name: 'Humility', desc: 'Uncertainty band', icon: Search, color: 'yellow' },
  { id: 'F8', name: 'Genius', desc: 'Wisdom equation', icon: Zap, color: 'yellow' },
  { id: 'F9', name: 'Reality', desc: 'Observable grounding', icon: Globe, color: 'yellow' },
  { id: 'F10', name: 'Ontology', desc: 'What exists', icon: BookOpen, color: 'cyan' },
  { id: 'F11', name: 'Command', desc: 'Authority validation', icon: Terminal, color: 'cyan' },
  { id: 'F12', name: 'Injection', desc: 'Prompt defense', icon: Lock, color: 'cyan' },
  { id: 'F13', name: 'Sovereign', desc: 'Human override', icon: Users, color: 'green' },
];

// MCP Tools data — v55.1 Explicit Tool Architecture (9 core tools)
const MCP_TOOLS = [
  {
    name: 'init_reboot',
    stage: '000',
    description: 'Gate & injection defense (F11/F12). Session bootstrap with identity verification and budget allocation',
    params: ['session_id', 'user_token', 'nonce'],
    actions: ['init', 'gate', 'reset', 'validate', 'authorize'],
    returns: 'session_id, authority_level, budget_allocated, injection_score',
    color: 'blue',
    engine: 'ADAM'
  },
  {
    name: 'agi_sense',
    stage: '111',
    description: 'Input parsing & intent detection. First stage of the epistemic pipeline',
    params: ['query', 'context', 'session_id'],
    actions: ['parse', 'detect_intent', 'extract_entities'],
    returns: 'parsed_input, intent, entities, confidence',
    color: 'cyan',
    engine: 'ARIF'
  },
  {
    name: 'agi_think',
    stage: '222',
    description: 'Hypothesis generation with high entropy. Divergent reasoning and pattern exploration',
    params: ['query', 'parsed_input', 'session_id'],
    actions: ['hypothesize', 'explore', 'brainstorm'],
    returns: 'hypotheses, entropy_delta, candidate_count',
    color: 'cyan',
    engine: 'ARIF'
  },
  {
    name: 'agi_reason',
    stage: '333',
    description: 'Deep logic chains with low entropy. Convergent reasoning and proof construction',
    params: ['query', 'hypotheses', 'context', 'session_id'],
    actions: ['reason', 'prove', 'refute', 'synthesize'],
    returns: 'conclusion, omega_0, precision, floor_scores, vote',
    color: 'cyan',
    engine: 'ARIF'
  },
  {
    name: 'asi_empathize',
    stage: '444',
    description: 'Stakeholder modeling (F6). Maps affected parties and impact vectors',
    params: ['query', 'reasoning', 'session_id'],
    actions: ['model_stakeholders', 'assess_impact', 'map_harm'],
    returns: 'stakeholder_map, empathy_kappa_r, impact_vectors',
    color: 'rose',
    engine: 'ADAM'
  },
  {
    name: 'asi_align',
    stage: '555',
    description: 'Constitutional alignment check. Validates against all 13 floors',
    params: ['query', 'reasoning', 'stakeholder_map', 'session_id'],
    actions: ['check_floors', 'validate_alignment', 'score'],
    returns: 'floor_results, alignment_score, violations, peace_squared',
    color: 'rose',
    engine: 'ADAM'
  },
  {
    name: 'asi_insight',
    stage: '666',
    description: 'Risk & impact foresight. Second-order consequence analysis',
    params: ['query', 'alignment_result', 'session_id'],
    actions: ['forecast', 'risk_assess', 'recommend'],
    returns: 'risk_profile, reversibility_score, recommendations, vote',
    color: 'rose',
    engine: 'ADAM'
  },
  {
    name: 'apex_verdict',
    stage: '888',
    description: 'Final constitutional judgment. 9-paradox equilibrium solver, renders SEAL/VOID/SABAR/888_HOLD',
    params: ['query', 'agi_context', 'asi_context', 'session_id'],
    actions: ['judge', 'seal', 'proof'],
    returns: 'final_verdict, trinity_score, paradox_scores, merkle_root',
    color: 'violet',
    engine: 'APEX'
  },
  {
    name: 'reality_search',
    stage: 'External',
    description: 'Grounding via external data (F2). Fact-checking against real-world sources',
    params: ['query', 'session_id', 'sources'],
    actions: ['search', 'verify', 'cross_check'],
    returns: 'verified, confidence, sources, caveats, recency',
    color: 'orange',
    engine: 'ARIF'
  },
];

// API Endpoints — served from aaamcp.arif-fazil.com (Railway)
const ENDPOINTS = [
  { path: '/health', method: 'GET', desc: 'System health check', status: 'stable' },
  { path: '/mcp', method: 'POST', desc: 'MCP tool invocation (9 explicit tools)', status: 'stable' },
  { path: '/sse', method: 'GET', desc: 'Server-sent events stream', status: 'stable' },
  { path: '/dashboard', method: 'GET', desc: 'Live system dashboard', status: 'stable' },
  { path: '/docs', method: 'GET', desc: 'API documentation (OpenAPI)', status: 'stable' },
];

const API_BASE = 'aaamcp.arif-fazil.com';

// Code examples
const INSTALL_CODE = `pip install arifos`;
const USAGE_CODE = `from arifos import TrinityClient

# Initialize — connects to aaamcp.arif-fazil.com/mcp
client = TrinityClient(
    floors=["F1", "F2", "F3", "F7", "F13"],
    require_witness=True
)

# v55.1 explicit tools — parallel AGI || ASI
response = client.ask(
    "Analyze this data",
    tri_witness_threshold=0.95
)

# Direct tool invocation
sense = client.tool("agi_sense", query="parse input")
verdict = client.tool("apex_verdict", agi_context=..., asi_context=...)`;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ online: true, version: 'v55.1-SEAL' });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check actual system status
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.ok ? setSystemStatus({ online: true, version: 'v55.1-SEAL' }) : setSystemStatus({ online: false, version: 'v55.1-SEAL' }))
      .catch(() => setSystemStatus({ online: false, version: 'v55.1-SEAL' }));
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      red: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400', glow: 'hover:shadow-red-500/20' },
      orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-400', glow: 'hover:shadow-orange-500/20' },
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', text: 'text-yellow-400', glow: 'hover:shadow-yellow-500/20' },
      cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400', glow: 'hover:shadow-cyan-500/20' },
      green: { border: 'border-green-500/30', bg: 'bg-green-500/5', text: 'text-green-400', glow: 'hover:shadow-green-500/20' },
      blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', glow: 'hover:shadow-blue-500/20' },
      amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', glow: 'hover:shadow-amber-500/20' },
      rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', text: 'text-rose-400', glow: 'hover:shadow-rose-500/20' },
      violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/5', text: 'text-violet-400', glow: 'hover:shadow-violet-500/20' },
      emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400', glow: 'hover:shadow-emerald-500/20' },
    };
    return colors[color] || colors.cyan;
  };

  const getStatusBadge = (status: string, label: string) => {
    const styles: Record<string, string> = {
      ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      production: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      stubs: 'bg-red-500/20 text-red-400 border-red-500/30',
      design: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      research: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    };
    return <Badge className={`text-xs ${styles[status] || styles.ready}`}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans relative overflow-x-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="mesh-gradient mesh-1" />
        <div className="mesh-gradient mesh-2" />
        <div className="mesh-gradient mesh-3" />
        <div className="torus-ring" />
      </div>

      {/* Geometric Grid Pattern */}
      <div className="fixed inset-0 geometric-bg pointer-events-none opacity-50" />

      {/* Fractal Radial Layer */}
      <div className="fixed inset-0 fractal-radial pointer-events-none opacity-40" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-lg">arifOS</span>
                <span className="text-xs text-gray-500 ml-2 hidden sm:inline">APPS</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#overview" className="text-sm text-gray-400 hover:text-white transition-colors">Overview</a>
              <a href="#layers" className="text-sm text-gray-400 hover:text-white transition-colors">7 Layers</a>
              <a href="#floors" className="text-sm text-gray-400 hover:text-white transition-colors">13 Floors</a>
              <a href="#mcp" className="text-sm text-gray-400 hover:text-white transition-colors">MCP Tools</a>
              <a href="#api" className="text-sm text-gray-400 hover:text-white transition-colors">API</a>
              <div className="flex items-center gap-2 ml-4">
                <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs font-medium hover:bg-red-900/20 transition-colors flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> HUMAN
                </a>
                <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded text-amber-400 text-xs font-medium hover:bg-amber-900/20 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> THEORY
                </a>
                <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/40 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" /> APPS
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800 px-4 py-4 space-y-3">
            <a href="#overview" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Overview</a>
            <a href="#layers" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>7 Layers</a>
            <a href="#floors" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>13 Floors</a>
            <a href="#mcp" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>MCP Tools</a>
            <a href="#api" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>API</a>
            <div className="flex gap-2 pt-2">
              <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs hover:bg-red-900/20">HUMAN</a>
              <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded text-amber-400 text-xs hover:bg-amber-900/20">THEORY</a>
              <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-400 text-xs border border-cyan-500/40">APPS</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">APPS Layer · 7-Layer Application Stack</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">arifOS</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
            AI That Can't Lie to You
          </p>

          {/* Architecture Tag */}
          <p className="text-sm text-gray-500 mb-3 font-mono">
            From Zero-Context Prompt to Constitutional AGI
          </p>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed mb-10">
            The 7-layer deployment architecture for constitutional AI governance.
            Choose your entry point — from a simple system prompt to production MCP tools
            to autonomous agent federations. Every layer enforces 13 safety floors.
          </p>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${systemStatus.online ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
              <Activity className={`w-4 h-4 ${systemStatus.online ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${systemStatus.online ? 'text-green-400' : 'text-red-400'}`}>
                {systemStatus.online ? 'ONLINE' : 'OFFLINE'}
              </span>
              <span className="text-sm text-gray-500">{systemStatus.version}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">7 Layers</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">13 Floors</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#layers">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6">
                <Layers className="w-4 h-4 mr-2" /> Explore Layers
              </Button>
            </a>
            <a href="#mcp">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                <Terminal className="w-4 h-4 mr-2" /> MCP Tools
              </Button>
            </a>
            <a href="https://github.com/ariffazil/arifOS" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                <GitBranch className="w-4 h-4 mr-2" /> GitHub
              </Button>
            </a>
          </div>

          {/* Quick Install */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-black/50 rounded-lg p-4 border border-gray-800 flex items-center justify-between">
              <code className="text-sm text-cyan-400 font-mono">pip install arifos</code>
              <button
                onClick={() => copyToClipboard(INSTALL_CODE, 'install')}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
              >
                {copiedCode === 'install' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* 7 Layers Section */}
      <section id="layers" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Application Architecture</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">The 7-Layer Stack</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose your entry point based on complexity needs.
              From a zero-context prompt to constitutional AGI research — each layer
              builds on the one below it.
            </p>
          </div>

          {/* Layer Stack Visualization */}
          <div className="max-w-4xl mx-auto space-y-3">
            {[...LAYERS].reverse().map((layer) => {
              const colors = getColorClasses(layer.color);
              const Icon = layer.icon;
              const isExpanded = expandedLayer === layer.id;

              return (
                <button
                  key={layer.id}
                  onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                  className={`w-full text-left rounded-xl border transition-all duration-300 ${colors.border} ${isExpanded ? `${colors.bg} shadow-lg` : 'bg-gray-900/30 hover:bg-gray-900/50'}`}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Layer ID */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>

                      {/* Layer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono text-gray-500">{layer.id}</span>
                          <h3 className="font-semibold text-white">{layer.name}</h3>
                          <span className="text-xs text-gray-500 hidden sm:inline">— {layer.tagline}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{layer.desc}</p>
                      </div>

                      {/* Status + Coverage */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-mono text-gray-600 hidden sm:inline">{layer.coverage}</span>
                        {getStatusBadge(layer.status, layer.statusLabel)}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-800/50">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Coverage</p>
                            <p className="text-sm text-white">{layer.coverage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stages</p>
                            <p className="text-sm font-mono text-white">{layer.stage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                            <p className="text-sm text-white">{layer.statusLabel}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-3">{layer.details}</p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Reference Table */}
          <div className="mt-16 max-w-4xl mx-auto rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/40">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Layer</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Use Case</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {LAYERS.map((layer) => (
                  <tr key={layer.id} className="border-b border-gray-800/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500 mr-2">{layer.id}</span>
                      <span className="text-white">{layer.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{layer.tagline}</td>
                    <td className="px-4 py-3">{getStatusBadge(layer.status, layer.statusLabel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 13 Floors Section */}
      <section id="floors" className="py-24 relative bg-gradient-to-b from-[#0a0a0a] via-gray-900/20 to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-cyan-500/20 border border-gray-700 mb-6">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Constitutional Framework</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">The 13 Floors</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every AI decision passes through 13 constitutional safety checks.
              Three independent engines verify each floor before execution.
            </p>
          </div>

          {/* Floors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {FLOORS.map((floor) => {
              const colors = getColorClasses(floor.color);
              const Icon = floor.icon;
              return (
                <div
                  key={floor.id}
                  className={`relative p-4 rounded-xl border transition-all hover:scale-105 ${colors.border} ${colors.bg} hover:bg-opacity-10 hover:shadow-lg ${colors.glow}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-500">{floor.id}</span>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{floor.name}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{floor.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Tri-Witness Explanation */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-lg">Mind — ARIF Engine</CardTitle>
                <CardDescription>Deep reasoning & pattern recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  agi_sense, agi_think, agi_reason. Runs async in parallel with Heart.
                  The epistemic pipeline that parses, hypothesizes, and proves.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-rose-400" />
                </div>
                <CardTitle className="text-lg">Heart — ADAM Engine</CardTitle>
                <CardDescription>Safety & empathy assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  asi_empathize, asi_align, asi_insight. Runs async in parallel with Mind.
                  The safety pipeline ensuring alignment with human values.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5 text-violet-400" />
                </div>
                <CardTitle className="text-lg">Soul — APEX Engine</CardTitle>
                <CardDescription>Judicial consensus & sealing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  apex_verdict collapses parallel Mind + Heart results. Renders SEAL, SABAR,
                  VOID, or 888_HOLD with cryptographic verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MCP Tools Section */}
      <section id="mcp" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">Model Context Protocol</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">9 Explicit Tools</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              v55.1 Explicit Tool Architecture. Each tool maps to a specific stage in the
              constitutional metabolic loop. Mind and Heart run in parallel, collapsing at Soul.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MCP_TOOLS.map((tool) => {
              const colors = getColorClasses(tool.color);
              return (
                <Card key={tool.name} className={`bg-gray-900/30 border-gray-800 hover:${colors.border} transition-all group`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <code className={`text-lg font-mono ${colors.text}`}>{tool.name}</code>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{tool.stage}</Badge>
                        <Badge className={`text-xs ${
                          tool.engine === 'ARIF' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                          tool.engine === 'ADAM' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                          'bg-violet-500/20 text-violet-400 border-violet-500/30'
                        }`}>{tool.engine}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Parameters</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.params.map(param => (
                            <code key={param} className="text-xs bg-black/50 px-2 py-1 rounded text-gray-300">
                              {param}
                            </code>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Actions</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.actions.map(action => (
                            <code key={action} className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                              {action}
                            </code>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Returns</p>
                        <p className="text-sm text-gray-400">{tool.returns}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pipeline Visualization — Trinity Parallel */}
          <div className="mt-10 p-6 rounded-xl bg-gray-900/30 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Trinity Parallel Pipeline (Async AGI || ASI)</p>

            {/* Gate */}
            <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">init_reboot</Badge>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>

            {/* Parallel lanes */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 font-mono mb-2">ARIF (Mind) — async</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">agi_sense</Badge>
                  <ArrowRight className="w-3 h-3 text-cyan-600" />
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">agi_think</Badge>
                  <ArrowRight className="w-3 h-3 text-cyan-600" />
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">agi_reason</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <p className="text-xs text-rose-400 font-mono mb-2">ADAM (Heart) — async</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">asi_empathize</Badge>
                  <ArrowRight className="w-3 h-3 text-rose-600" />
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">asi_align</Badge>
                  <ArrowRight className="w-3 h-3 text-rose-600" />
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">asi_insight</Badge>
                </div>
              </div>
            </div>

            {/* Collapse at APEX */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">apex_verdict</Badge>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Mind and Heart run in parallel, collapsing at Soul for final verdict. reality_search provides external grounding at any stage.
            </p>
          </div>

          {/* Deprecation Notice */}
          <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-400 mb-1">Migration Notice — Phoenix-72</p>
                <p className="text-sm text-gray-400">
                  Legacy tools (<code className="text-gray-300">_init_</code>, <code className="text-gray-300">_agi_</code>, <code className="text-gray-300">_asi_</code>, <code className="text-gray-300">_apex_</code>, <code className="text-gray-300">_vault_</code>, <code className="text-gray-300">_trinity_</code>, <code className="text-gray-300">_reality_</code>) are deprecated.
                  Support ends in v56.0. Update your MCP config to use the explicit 9-tool names above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section id="api" className="py-24 relative bg-gradient-to-b from-[#0a0a0a] via-gray-900/20 to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* API Endpoints */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">API Endpoints</h2>
                  <p className="text-sm text-gray-500">Live at {API_BASE}</p>
                </div>
              </div>

              <div className="space-y-3">
                {ENDPOINTS.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        className={endpoint.method === 'GET'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-cyan-400">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 hidden sm:inline">{endpoint.desc}</span>
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Server-Sent Events Info */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Server-Sent Events</span>
                </div>
                <p className="text-sm text-gray-400">
                  Connect to <code className="text-cyan-400">/sse</code> for real-time
                  constitutional verdicts and system status updates.
                </p>
              </div>
            </div>

            {/* Code Example */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Quick Start</h2>
                  <p className="text-sm text-gray-500">Python SDK example</p>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                  <span className="text-xs text-gray-500">example.py</span>
                  <button
                    onClick={() => copyToClipboard(USAGE_CODE, 'usage')}
                    className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  >
                    {copiedCode === 'usage' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{USAGE_CODE}</code>
                </pre>
              </div>

              {/* Installation Options */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a href="https://pypi.org/project/arifos/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-medium group-hover:text-cyan-400 transition-colors">PyPI</span>
                  </div>
                  <p className="text-xs text-gray-500">pip install arifos</p>
                </a>
                <a href="https://github.com/ariffazil/arifOS" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="font-medium group-hover:text-white transition-colors">GitHub</span>
                  </div>
                  <p className="text-xs text-gray-500">Source & Issues</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Constitutional Equations Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Constitutional Equations</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="text-4xl font-mono text-cyan-400 mb-4">W₃</div>
              <h3 className="text-lg font-semibold mb-2">Tri-Witness Consensus</h3>
              <p className="text-sm text-gray-400 mb-4">
                Geometric mean of Human x AI x System witnesses
              </p>
              <code className="text-xs bg-black/50 px-3 py-2 rounded block">
                W₃ = ∛(H x A x E) ≥ 0.95
              </code>
              <p className="text-xs text-gray-500 mt-3">Floor F3 Minimum</p>
            </Card>

            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="text-4xl font-mono text-amber-400 mb-4">G</div>
              <h3 className="text-lg font-semibold mb-2">Genius Index</h3>
              <p className="text-sm text-gray-400 mb-4">
                Multiplicative wisdom across four dimensions
              </p>
              <code className="text-xs bg-black/50 px-3 py-2 rounded block">
                G = A x P x X x E² ≥ 0.80
              </code>
              <p className="text-xs text-gray-500 mt-3">Floor F8 Minimum</p>
            </Card>

            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="text-4xl font-mono text-violet-400 mb-4">Ω₀</div>
              <h3 className="text-lg font-semibold mb-2">Uncertainty Band</h3>
              <p className="text-sm text-gray-400 mb-4">
                Epistemic humility through calibrated uncertainty
              </p>
              <code className="text-xs bg-black/50 px-3 py-2 rounded block">
                Ω₀ ∈ [0.03, 0.05]
              </code>
              <p className="text-xs text-gray-500 mt-3">Floor F7 Range</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Runtime & Infrastructure */}
      <section id="runtime" className="py-16 relative bg-gradient-to-b from-[#0a0a0a] via-gray-900/20 to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Runtime</h2>
          <p className="text-gray-400 text-sm mb-8">Infrastructure and deployment details for the Trinity ecosystem.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Frontend */}
            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Frontend (Trinity Sites)
                </CardTitle>
                <CardDescription>Static SPAs served globally</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex justify-between"><span>Provider</span><span className="text-white">Cloudflare Pages</span></li>
                  <li className="flex justify-between"><span>Regions</span><span className="text-white">Global CDN (300+ PoPs)</span></li>
                  <li className="flex justify-between"><span>Build</span><span className="text-white">React + Vite, GitHub Actions CI</span></li>
                  <li className="flex justify-between"><span>TLS</span><span className="text-white">Cloudflare Universal SSL</span></li>
                  <li className="flex justify-between"><span>Headers</span><span className="text-white">HSTS, CSP, X-Frame-Options</span></li>
                </ul>
              </CardContent>
            </Card>

            {/* Backend */}
            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  Backend (arifOS Runtime)
                </CardTitle>
                <CardDescription>MCP server and governance engine</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex justify-between"><span>Provider</span><span className="text-white">Railway</span></li>
                  <li className="flex justify-between"><span>Region</span><span className="text-white">US West</span></li>
                  <li className="flex justify-between"><span>Runtime</span><span className="text-white">Python 3.12 + FastAPI</span></li>
                  <li className="flex justify-between"><span>Protocol</span><span className="text-white">MCP (SSE + Streamable HTTP)</span></li>
                  <li className="flex justify-between"><span>Redundancy</span><span className="text-white">Single instance, auto-restart</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">arifOS</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Constitutional AI governance. 7 layers, 13 floors, 9 explicit tools.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">APPS Layer</span>
                <span className="text-gray-700">|</span>
                <span className="text-xs text-gray-600">Application Stack</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium mb-4">Documentation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#layers" className="hover:text-white transition-colors">7 Layers</a></li>
                <li><a href="#floors" className="hover:text-white transition-colors">13 Floors</a></li>
                <li><a href="#mcp" className="hover:text-white transition-colors">MCP Tools</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Live Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href={`https://${API_BASE}/health`} className="hover:text-white transition-colors">Health Check</a></li>
                <li><a href={`https://${API_BASE}/mcp`} className="hover:text-white transition-colors">MCP Endpoint</a></li>
                <li><a href={`https://${API_BASE}/sse`} className="hover:text-white transition-colors">MCP SSE</a></li>
                <li><a href={`https://${API_BASE}/dashboard`} className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://arif-fazil.com" className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                    HUMAN <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://apex.arif-fazil.com" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                    THEORY <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/ariffazil/arifOS" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://pypi.org/project/arifos/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    PyPI <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">M2M Endpoints</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://apex.arif-fazil.com/llms.txt" className="hover:text-white transition-colors font-mono text-xs">llms.txt</a></li>
                <li><a href="https://apex.arif-fazil.com/api/v1/floors.json" className="hover:text-white transition-colors font-mono text-xs">floors.json</a></li>
                <li><a href={`https://${API_BASE}/mcp`} className="hover:text-white transition-colors font-mono text-xs">MCP endpoint</a></li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8 bg-gray-800" />

          {/* Trinity badges - aligned with HUMAN page */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded-full text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
              HUMAN
            </a>
            <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded-full text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition-colors">
              THEORY
            </a>
            <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-medium border border-cyan-500/30">
              APPS
            </a>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Muhammad Arif bin Fazil &middot; Penang, Malaysia
            </p>
            <p className="text-xs tracking-[0.3em] text-gray-700 uppercase">
              Ditempa Bukan Diberi — Forged, Not Given
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
