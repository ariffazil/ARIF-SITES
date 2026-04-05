import { ArrowRight, Bot, Brain, Compass, FileText, Globe, Layers3, Microscope, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import TrinityNav from './components/TrinityNav';

type LinkCard = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  accent: string;
  icon: typeof Globe;
};

const ringCards: LinkCard[] = [
  { title: 'HUMAN', eyebrow: 'Witness', description: 'Human identity, intent, legitimacy, and sovereign witness.', href: 'https://arif-fazil.com', accent: 'text-rose-300 border-rose-500/30 bg-rose-500/10', icon: UserRound },
  { title: 'THEORY', eyebrow: 'Constitution', description: 'Floors, doctrine, invariants, and philosophical grounding.', href: 'https://apex.arif-fazil.com', accent: 'text-amber-200 border-amber-400/30 bg-amber-400/10', icon: Brain },
  { title: 'APPS', eyebrow: 'Kernel', description: 'Governance interfaces, MCP surfaces, and technical entry points.', href: 'https://arifos.arif-fazil.com', accent: 'text-sky-200 border-sky-500/30 bg-sky-500/10', icon: Bot },
  { title: 'RUNTIME', eyebrow: 'Execution', description: 'API endpoints, tool catalog, integration guides, and runtime status.', href: 'https://runtime.arif-fazil.com', accent: 'text-emerald-200 border-emerald-500/30 bg-emerald-500/10', icon: ShieldCheck },
  { title: 'GEOX', eyebrow: 'Reality Witness', description: 'Earth-physics grounding and geoscience verification.', href: 'https://geox.arif-fazil.com', accent: 'text-orange-200 border-orange-500/30 bg-orange-500/10', icon: Microscope },
  { title: 'SPECS', eyebrow: 'Machine Contract', description: 'Structured references, schemas, and machine-facing contracts.', href: 'https://specs.arif-fazil.com', accent: 'text-violet-200 border-violet-500/30 bg-violet-500/10', icon: FileText },
];

const rules = [
  'Portal first. No long biography on the front door.',
  'Law stays in THEORY. APIs stay in RUNTIME.',
  'Machine discovery stays explicit: llms.txt, humans.txt, agent card.',
  'Each domain should say one thing clearly, not five things vaguely.',
];

const surfaces = [
  { name: 'llms.txt', href: '/llms.txt', description: 'Canonical machine context for agents discovering the Trinity.' },
  { name: 'humans.txt', href: '/humans.txt', description: 'Human acknowledgments, authorship, and implementation surface.' },
  { name: 'agent card', href: '/.well-known/agent.json', description: 'Machine-readable discovery card for agent ecosystems.' },
];

export default function App() {
  return (
    <>
      <TrinityNav />
      <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-300/30 selection:text-white">
        <main>
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(230,194,93,0.18),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.14),transparent_30%),linear-gradient(180deg,#050505_0%,#0b0b0b_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-30" />
            <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-amber-200/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-amber-100">
                <Sparkles className="h-3.5 w-3.5" /> forge.arif-fazil.com
              </div>
              <div className="grid gap-12 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-zinc-400">Trinity Portal</p>
                  <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">One front door for the whole arifOS stack.</h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">Forge is the orientation layer. It tells humans and agents where to go next, what each domain means, and which surface holds the real source of truth.</p>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <a href="#rings" className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-200/10 px-5 py-3 text-sm font-medium text-amber-50 transition hover:border-amber-200/50 hover:bg-amber-200/15">Open Trinity Map <ArrowRight className="h-4 w-4" /></a>
                    <a href="https://runtime.arif-fazil.com" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-white/10">Runtime Docs <Compass className="h-4 w-4" /></a>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Portal Mission</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-sm font-medium text-white">Reduce confusion</p><p className="mt-2 text-sm leading-6 text-zinc-400">Stop mixing biography, doctrine, APIs, and machine contracts on the same page.</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-sm font-medium text-white">Route with intent</p><p className="mt-2 text-sm leading-6 text-zinc-400">Every click from Forge should move into a more specific truth surface.</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-sm font-medium text-white">Stay machine-legible</p><p className="mt-2 text-sm leading-6 text-zinc-400">Discovery files and agent metadata must be obvious and close to the front door.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="rings" className="border-b border-white/10 bg-[#090909] py-20"><div className="mx-auto max-w-6xl px-6"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.26em] text-zinc-500">Trinity Map</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Each domain carries one job.</h2><p className="mt-4 text-base leading-7 text-zinc-400">Forge should orient. The rings and satellites should specialize. This is the clarity rule.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{ringCards.map((card)=>{const Icon=card.icon;return <a key={card.title} href={card.href} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"><div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] ${card.accent}`}><Icon className="h-3.5 w-3.5" />{card.eyebrow}</div><h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{card.description}</p><div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-200 group-hover:text-white">Enter surface <ArrowRight className="h-4 w-4" /></div></a>;})}</div></div></section>
          <section id="rules" className="border-b border-white/10 bg-[#050505] py-20"><div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]"><div><p className="font-mono text-xs uppercase tracking-[0.26em] text-zinc-500">Operating Rules</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">The portal should route, not compete.</h2><p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">When every domain repeats the same narrative, users and agents lose the map. Forge exists to compress the top layer and hand off quickly.</p></div><div className="space-y-4">{rules.map((rule,index)=><div key={rule} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex items-start gap-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-amber-200/10 font-mono text-xs text-amber-100">0{index+1}</div><p className="pt-1 text-sm leading-7 text-zinc-300">{rule}</p></div></div>)}</div></div></section>
          <section id="surfaces" className="border-b border-white/10 bg-[#090909] py-20"><div className="mx-auto max-w-6xl px-6"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.26em] text-zinc-500">Machine Discovery</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Keep the machine-facing surfaces visible.</h2><p className="mt-4 text-base leading-7 text-zinc-400">A portal is not complete until agents can discover context, authorship, and routing without scraping ambiguity.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{surfaces.map((surface)=><a key={surface.name} href={surface.href} className="rounded-3xl border border-white/10 bg-black/20 p-6 transition hover:border-sky-400/30 hover:bg-black/30"><div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-sky-100"><Layers3 className="h-3.5 w-3.5" />Discovery</div><h3 className="mt-5 text-xl font-semibold text-white">{surface.name}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{surface.description}</p><div className="mt-6 text-sm font-medium text-zinc-200">Open file</div></a>)}</div></div></section>
          <section id="order" className="bg-[#050505] py-20"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10"><div><p className="font-mono text-xs uppercase tracking-[0.26em] text-zinc-500">Horizon Order</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Recommended deploy sequence.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">Stabilize the front door first. Then refine each specialist surface without reintroducing overlap.</p></div><div className="space-y-3">{['Forge portal','Human witness','Runtime docs','Theory canon','Geox witness','Specs contracts'].map((item,index)=><div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4"><span className="text-sm font-medium text-zinc-200">{item}</span><span className="font-mono text-xs text-amber-100">0{index+1}</span></div>)}</div></div></div></section>
        </main>
        <footer className="border-t border-white/10 bg-black py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between"><div>FORGE PORTAL · HUMAN · THEORY · APPS · RUNTIME · GEOX · SPECS</div><div className="font-mono uppercase tracking-[0.18em] text-zinc-600">Ditempa Bukan Diberi</div></div></footer>
      </div>
    </>
  );
}