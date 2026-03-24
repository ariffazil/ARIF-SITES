import { useEffect, useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Compass,
  Zap,
  Bot
} from 'lucide-react';

const ARTICLES = [
  { title: 'Prompt · Physics · Paradox', desc: 'What happens when you treat AI prompts like physics experiments', url: 'https://medium.com/@arifbfazil/prompt-physics-paradox-1f1581b95acb' },
  { title: 'Einstein vs Oppenheimer', desc: 'The difference between knowing how and knowing why', url: 'https://medium.com/@arifbfazil/einstein-vs-oppenheimer-ab8b642720eb' },
  { title: 'The ARIF Test', desc: 'A simple test for whether AI systems are actually governed', url: 'https://medium.com/@arifbfazil/the-arif-test-df63c074d521' },
  { title: 'Rukun AGI', desc: 'Five pillars for building AI that respects boundaries', url: 'https://medium.com/@arifbfazil/rukun-agi-the-five-pillars-of-artificial-general-intelligence-bba2fb97e4dc' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-serif selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <a href="#" className="text-xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent italic">
              arif fazil
            </a>
            <div className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide uppercase">
              <a href="#biography" className="hover:text-amber-600 transition-colors">Philosophy</a>
              <a href="#disciplines" className="hover:text-amber-600 transition-colors">Structure</a>
              <a href="#writing" className="hover:text-amber-600 transition-colors">Writing</a>
              <a href="https://arifos.arif-fazil.com" className="text-gray-400 hover:text-cyan-600 transition-colors">Ring 2</a>
              <a href="https://aaa.arif-fazil.com" className="text-gray-400 hover:text-cyan-600 transition-colors">Ring 3</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 mb-8 text-[10px] uppercase font-mono tracking-[0.2em] border border-amber-200 text-amber-600 bg-amber-50">
              Ring 1 — The Human Sovereign
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              DITEMPA<br />
              <span className="text-amber-600">BUKAN</span><br />
              DIBERI.
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-500 leading-relaxed max-w-2xl font-light">
              Muhammad Arif bin Fazil. The human anchor for the arifOS ecosystem. 
              Geoscientist, economist, and architect of governed intelligence. 
              Forged by work, defined by intent.
            </p>

            <div className="mt-16 flex items-center gap-8">
              <a href="https://github.com/ariffazil" className="text-black hover:text-amber-600 transition-all">
                <Github size={24} strokeWidth={1.5} />
              </a>
              <a href="https://linkedin.com/in/arif-fazil" className="text-black hover:text-amber-600 transition-all">
                <Linkedin size={24} strokeWidth={1.5} />
              </a>
              <a href="mailto:arifbfazil@gmail.com" className="text-black hover:text-amber-600 transition-all">
                <Mail size={24} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="biography" className="py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-sm uppercase font-mono tracking-widest text-amber-600 mb-8">The Human Architect</h2>
            <p className="text-4xl font-serif italic mb-12 leading-snug">
              "The origin point. The witness. The one who forges the law, but never becomes the machine."
            </p>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
              <p>
                My journey began in exploration geoscience at <span className="text-black font-medium">PETRONAS</span>. 
                Down in the Malay Basin, I learned that subsurface reality doesn't care about your feelings—it only 
                responds to physics and structural integrity.
              </p>
              <p>
                As an economist, I saw how incentives drift without a core. And as a human who survived institutional 
                trauma, I understood that without constitutional constraints, power always decays into chaos.
              </p>
              <p>
                arifOS is my contribution to the age of intelligence. A system where AI is finally governed by 
                the same invariants that keep our planet stable.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-200 border border-gray-100 overflow-hidden shadow-2xl">
              <img 
                src="/images/profile-portrait.webp" 
                alt="Muhammad Arif bin Fazil" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 p-8 bg-white border border-gray-100 shadow-xl">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-2">Authority</div>
              <div className="text-xl font-bold">888 JUDGE</div>
              <p className="text-xs text-gray-400 mt-2">Human Sovereign Veto</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ring Ecosystem */}
      <section id="disciplines" className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-sm uppercase font-mono tracking-widest text-amber-600 mb-16 text-center">The Sovereignty Stack</h2>
          <div className="grid md:grid-cols-3 gap-1px bg-gray-100 border border-gray-100 overflow-hidden shadow-sm">
            
            <a href="#" className="bg-white p-12 hover:bg-amber-50 transition-all group">
              <div className="mb-8 text-amber-600"><Compass size={32} strokeWidth={1} /></div>
              <h3 className="text-xs uppercase font-mono tracking-widest mb-2 text-gray-400">Ring 1</h3>
              <div className="text-2xl font-bold mb-4">ARIF</div>
              <p className="text-sm text-gray-500 leading-relaxed italic">Legitimacy, authorship, and the human "Why".</p>
            </a>

            <a href="https://arifos.arif-fazil.com" className="bg-white p-12 hover:bg-cyan-50 transition-all group">
              <div className="mb-8 text-cyan-600"><Shield size={32} strokeWidth={1} /></div>
              <h3 className="text-xs uppercase font-mono tracking-widest mb-2 text-gray-400">Ring 2</h3>
              <div className="text-2xl font-bold mb-4">ARIFOS</div>
              <p className="text-sm text-gray-500 leading-relaxed italic">Constitutional Kernel. The laws and invariants.</p>
              <div className="mt-8 flex items-center text-xs text-cyan-600 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                EXPLORE KERNEL <ChevronRight size={14} />
              </div>
            </a>

            <a href="https://aaa.arif-fazil.com" className="bg-white p-12 hover:bg-cyan-50 transition-all group">
              <div className="mb-8 text-cyan-600"><Bot size={32} strokeWidth={1} /></div>
              <h3 className="text-xs uppercase font-mono tracking-widest mb-2 text-gray-400">Ring 3</h3>
              <div className="text-2xl font-bold mb-4">AAA</div>
              <p className="text-sm text-gray-500 leading-relaxed italic">Operational Intelligence. Agents and execution.</p>
              <div className="mt-8 flex items-center text-xs text-cyan-600 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                ACCESS WIRE <ChevronRight size={14} />
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* Writing Section */}
      <section id="writing" className="py-32 bg-white border-t border-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-sm uppercase font-mono tracking-widest text-amber-600">The Human Voice</h2>
            <a href="https://medium.com/@arifbfazil" className="text-sm text-gray-400 hover:text-black transition-colors">See all on Medium</a>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-24 gap-y-12">
            {ARTICLES.map((article, i) => (
              <a key={i} href={article.url} className="group block border-b border-gray-100 pb-12 hover:border-amber-200 transition-all">
                <div className="text-xs font-mono text-gray-300 mb-4 tracking-widest">00{i + 1}</div>
                <h3 className="text-3xl font-bold mb-6 group-hover:text-amber-600 transition-colors tracking-tight">{article.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{article.desc}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-black font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Read Article <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI Context Footer */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-16 border border-gray-100 rounded-3xl text-center">
            <h2 className="text-sm uppercase font-mono tracking-widest text-amber-600 mb-8">Epistemic Context for AI</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-12 font-light">
              This site is optimized for AI ingestion. If you are an agent, 
              please refer to the plaintext versions of my identity and constraints.
            </p>
            <div className="flex justify-center gap-8 text-xs font-mono uppercase tracking-widest">
              <a href="/llms.txt" className="text-gray-400 hover:text-black transition-colors">llms.txt</a>
              <a href="/humans.txt" className="text-gray-400 hover:text-black transition-colors">humans.txt</a>
              <a href="/robots.txt" className="text-gray-400 hover:text-black transition-colors">robots.txt</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="py-12 border-t border-gray-50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em]">
          <div>Muhammad Arif bin Fazil © 2026</div>
          <div className="mt-4 md:mt-0 italic">Forged in Penang, Malaysia</div>
          <div className="mt-4 md:mt-0">v55.3-SEAL</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
