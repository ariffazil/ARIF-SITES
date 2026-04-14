// arif-fazil.com - THE HUMAN SITE (Ψ)
// Blueprint implementation: Home Page
// Tone: Direct, Evidence-backed, Authoritative.

import { Target, Shield, Compass, Lock, ArrowRight } from 'lucide-react';

const ConstellationNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
    <div className="flex items-center gap-6">
      <a href="/" className="font-bold text-lg tracking-tight text-red-700 no-underline">ARIF FAZIL</a>
      <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
        <a href="/" className="text-red-700 border-b-2 border-red-700 no-underline pb-1">Home</a>
        <a href="/discoveries" className="text-gray-400 hover:text-red-700 no-underline transition-colors">Discoveries</a>
        <a href="/canon" className="text-gray-400 hover:text-red-700 no-underline transition-colors">Canon</a>
        <a href="/essays" className="text-gray-400 hover:text-red-700 no-underline transition-colors">Writings</a>
        <a href="/constellation" className="text-gray-400 hover:text-red-700 no-underline transition-colors">Constellation</a>
      </div>
    </div>
    <a href="/999" className="flex items-center gap-2 text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded uppercase tracking-wider no-underline hover:bg-gray-800 transition-colors">
      <Lock size={12} /> 999 PRIVATE
    </a>
  </nav>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-16 selection:bg-red-100 selection:text-red-900">
      <ConstellationNav />

      {/* 1. HERO SECTION */}
      <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9]">
            Arif Fazil — <br/>
            <span className="text-red-700">Field Geoscientist & <br/>AI Constitutionalist</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-500 mt-8 font-medium tracking-tight">
            From Malay Basin dry holes to governed machine intelligence.
          </p>
          <ul className="mt-10 space-y-4">
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <div className="w-2 h-2 bg-red-700 rounded-full" />
              13+ years in subsurface exploration and appraisal.
            </li>
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <div className="w-2 h-2 bg-red-700 rounded-full" />
              Discoveries: BEKANTAN‑1, PUTERI BASEMENT‑1, Malay Basin.
            </li>
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <div className="w-2 h-2 bg-red-700 rounded-full" />
              Builder of arifOS — a constitutional intelligence kernel.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. BRIDGE BLOCK: GEOLOGY → GOVERNANCE */}
      <section className="bg-gray-50 py-24 px-6 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-700 mb-8">The Bridge</h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-serif italic">
            "Working at depth teaches you that uncertainty is not a weakness to be hidden—it is the condition you work in. 
            When you sign off on a multi-million dollar well, the decision is irreversible. 
            I built arifOS to bring that same discipline to AI: explicit floors, human-in-the-loop holds, 
            and a cryptographic vault for every significant judgment. We don't need faster guesses; we need governed truth."
          </p>
        </div>
      </section>

      {/* 3. WHAT I BUILD NOW */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black mb-16">Active Infrastructure</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* arifOS */}
          <div className="group border border-gray-200 p-8 rounded-2xl hover:border-red-700 transition-all">
            <Shield className="text-red-700 mb-6 w-8 h-8" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">arifOS</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Constitutional kernel for governed intelligence. Enforcing F1-F13 floors at the protocol level.
            </p>
            <a href="/canon" className="flex items-center gap-2 text-sm font-bold text-red-700 uppercase tracking-widest no-underline">
              Read the Canon <ArrowRight size={16} />
            </a>
          </div>

          {/* GEOX */}
          <div className="group border border-gray-200 p-8 rounded-2xl hover:border-green-700 transition-all">
            <Compass className="text-green-700 mb-6 w-8 h-8" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">GEOX</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Earth intelligence inside the arifOS membrane. Calibrating geospatial evidence for energy decisions.
            </p>
            <a href="https://geox.arif-fazil.com" className="flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-widest no-underline">
              Explore Φ Earth <ArrowRight size={16} />
            </a>
          </div>

          {/* AAA */}
          <div className="group border border-gray-200 p-8 rounded-2xl hover:border-blue-700 transition-all">
            <Target className="text-blue-700 mb-6 w-8 h-8" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AAA</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Governance cockpit for humans in the loop. The operator surface for monitoring constellation verdicts.
            </p>
            <a href="https://aaa.arif-fazil.com" className="flex items-center gap-2 text-sm font-bold text-blue-700 uppercase tracking-widest no-underline">
              Open Cockpit <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 4. CALL TO EXPLORE */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12">DITEMPA BUKAN DIBERI</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a href="/discoveries" className="bg-white text-black px-10 py-4 font-bold rounded-lg hover:bg-red-700 hover:text-white transition-colors no-underline">
              Start with Discoveries
            </a>
            <a href="/canon" className="border border-white text-white px-10 py-4 font-bold rounded-lg hover:bg-white hover:text-black transition-colors no-underline">
              Read the Canon
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            Ψ ARIF FAZIL · CONSTITUTIONAL IDENTITY · 2026
          </div>
          <div className="flex md:justify-end gap-8 items-center">
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
               999 — PRIVATE SOVEREIGN ROOM (LOCKED)
             </div>
             <Lock size={12} className="text-gray-300" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
