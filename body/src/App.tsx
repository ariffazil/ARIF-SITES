import { useEffect, useState } from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MapPin,
  Mountain,
  TrendingUp,
  Bot,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ARTICLES = [
  { title: 'Prompt · Physics · Paradox', desc: 'What happens when you treat AI prompts like physics experiments', url: 'https://medium.com/@arifbfazil/prompt-physics-paradox-1f1581b95acb' },
  { title: 'Einstein vs Oppenheimer', desc: 'The difference between knowing how and knowing why', url: 'https://medium.com/@arifbfazil/einstein-vs-oppenheimer-ab8b642720eb' },
  { title: 'The ARIF Test', desc: 'A simple test for whether AI systems are actually governed', url: 'https://medium.com/@arifbfazil/the-arif-test-df63c074d521' },
  { title: 'Rukun AGI', desc: 'Five pillars for building AI that respects boundaries', url: 'https://medium.com/@arifbfazil/rukun-agi-the-five-pillars-of-artificial-general-intelligence-bba2fb97e4dc' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800/50' : ''}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="font-semibold text-lg">Arif Fazil</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#background" className="text-sm text-gray-400 hover:text-white transition-colors">Background</a>
              <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="#writing" className="text-sm text-gray-400 hover:text-white transition-colors">Writing</a>
            </div>

            {/* Trinity nav */}
            <div className="hidden md:flex items-center gap-2">
              <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium border border-orange-500/40">
                BODY
              </a>
              <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded-full text-cyan-400 text-xs font-medium hover:bg-cyan-500/10 transition-colors">
                MIND
              </a>
              <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded-full text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition-colors">
                SOUL
              </a>
            </div>

            {/* Mobile menu */}
            <button type="button" className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-gray-800 px-4 py-4 space-y-3">
            <a href="#about" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#background" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Background</a>
            <a href="#projects" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#writing" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Writing</a>
            <Separator className="bg-gray-800" />
            <div className="flex gap-2 pt-1">
              <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs border border-orange-500/40">BODY</a>
              <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded-full text-cyan-400 text-xs">MIND</a>
              <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded-full text-amber-400 text-xs">SOUL</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
        {/* Subtle warm gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-[#0a0a0a] to-amber-950/10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <img
              src="/profile-avatar.jpg"
              alt="Arif Fazil"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-orange-500/30 ring-offset-4 ring-offset-[#0a0a0a]"
            />
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
            Arif Fazil
          </h1>

          {/* One-liner */}
          <p className="text-xl text-center text-gray-400 mb-3">
            Geoscientist. Economist. Building AI safety.
          </p>

          {/* Hook */}
          <p className="text-sm text-center text-orange-400/80 font-medium mb-1">
            I build blowout preventers for artificial intelligence.
          </p>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Penang, Malaysia</span>
          </div>

          {/* Bio */}
          <p className="text-center text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            I'm an exploration geoscientist at <span className="text-white font-medium">PETRONAS</span> with
            12+ years reading what the earth remembers — interpreting subsurface data,
            managing risk where failure has real consequences, and making decisions with
            incomplete information. I apply that same discipline to AI: building governance
            systems that treat intelligence as a high-pressure resource that must be piped,
            cooled, and verified before it's safe for use.
          </p>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3">
            <a href="https://github.com/ariffazil">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 gap-2">
                <Github className="w-4 h-4" /> GitHub
              </Button>
            </a>
            <a href="https://linkedin.com/in/arif-fazil">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Button>
            </a>
            <a href="https://medium.com/@arifbfazil">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 gap-2">
                <ExternalLink className="w-4 h-4" /> Medium
              </Button>
            </a>
            <a href="mailto:arifbfazil@gmail.com" title="Email">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 gap-2">
                <Mail className="w-4 h-4" /> Email
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* About / Background */}
      <section id="about" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">A bit about me</h2>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              I studied geology and economics — two fields that seem unrelated until
              you realise both are about reading messy data and making high-stakes
              decisions with incomplete information.
            </p>
            <p>
              At PETRONAS, I work in exploration geoscience — interpreting seismic data,
              evaluating frontier basins, and helping decide where to invest in new wells.
              In this world, a wrong decision doesn't just cost money. It's part science,
              part detective work, part risk management with real physical consequences.
            </p>
            <p>
              That background shaped how I think about AI safety. In Silicon Valley, a
              "crash" means the server goes down. In energy, a "crash" means people get
              hurt. I built{' '}
              <a href="https://arifos.arif-fazil.com" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">arifOS</a>{' '}
              because I wanted AI systems held to the same rigorous safety standards
              I grew up with — 13 checks that every decision has to pass before it executes.
            </p>
          </div>
        </div>
      </section>

      {/* Background Cards */}
      <section id="background" className="py-20 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Background</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Geology */}
            <Card className="bg-gray-900/40 border-gray-800 hover:border-orange-500/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center mb-4">
                  <Mountain className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Geology</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Subsurface interpretation, seismic analysis, frontier basin studies,
                  and prospect evaluation. Reading what the earth has buried.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">PETRONAS</Badge>
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">Exploration</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Economics */}
            <Card className="bg-gray-900/40 border-gray-800 hover:border-green-500/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Economics</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Trained in economic thinking — how incentives shape behaviour,
                  how markets price risk, and how decisions are made under uncertainty.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">Risk</Badge>
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">Decision-making</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI */}
            <Card className="bg-gray-900/40 border-gray-800 hover:border-blue-500/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">AI Governance</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Applying industrial safety thinking to AI systems. Built arifOS —
                  an open-source governance framework with 13 constitutional floors.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">arifOS</Badge>
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">Open Source</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">What I'm building</h2>

          <Card className="bg-gray-900/40 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">arifOS</h3>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">Side project</Badge>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    An AI governance framework — 13 safety checks that sit between an AI and its
                    decisions. Think of it as a building code for intelligence: every action
                    passes through constitutional floors before it executes. Not magic —
                    engineering. The same approach we use to prevent blowouts in wells,
                    applied to prevent blowouts in AI.
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Open source, written in Python, deployed as an MCP server with 9 explicit
                    governance tools. Currently at v55.1-SEAL.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://arifos.arif-fazil.com">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-500 gap-2">
                        Read the docs <ChevronRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="https://apex.arif-fazil.com">
                      <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 gap-2">
                        The theory behind it <ChevronRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="https://github.com/ariffazil/arifOS">
                      <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 gap-2">
                        <Github className="w-4 h-4" /> Source code
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className="py-20 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Writing</h2>

          <div className="space-y-3">
            {ARTICLES.map((article) => (
              <a
                key={article.url}
                href={article.url}
                className="group flex items-start justify-between p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 hover:bg-gray-900/30 transition-all"
              >
                <div>
                  <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{article.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 mt-1 flex-shrink-0 ml-4" />
              </a>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="https://medium.com/@arifbfazil"
              className="text-sm text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
            >
              More on Medium <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Muhammad Arif bin Fazil
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Geoscientist · Economist · AI Governance Architect
          </p>

          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
            <a href="mailto:arifbfazil@gmail.com" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">
              arifbfazil@gmail.com
            </a>
            <span className="text-gray-800">·</span>
            <a href="https://github.com/ariffazil" className="text-gray-500 hover:text-orange-400 transition-colors flex items-center gap-1 text-sm">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <span className="text-gray-800">·</span>
            <a href="https://linkedin.com/in/arif-fazil" className="text-gray-500 hover:text-orange-400 transition-colors flex items-center gap-1 text-sm">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <span className="text-gray-800">·</span>
            <a href="https://x.com/ArifFazil90" className="text-gray-500 hover:text-orange-400 transition-colors flex items-center gap-1 text-sm">
              <Twitter className="w-3.5 h-3.5" /> X
            </a>
          </div>

          {/* Ecosystem - subtle */}
          <div className="flex items-center justify-center gap-3">
            <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium border border-orange-500/30">
              BODY
            </a>
            <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded-full text-cyan-400 text-xs font-medium hover:bg-cyan-500/10 transition-colors">
              MIND
            </a>
            <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded-full text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition-colors">
              SOUL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
