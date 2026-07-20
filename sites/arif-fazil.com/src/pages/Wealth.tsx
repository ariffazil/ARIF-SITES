import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWebMCP } from '@/hooks/useWebMCP';

type BriefingMeta = {
  date: string;
  generated_at: string;
  source: string;
  model_note: string;
  delta_vs_yesterday?: {
    klci_change: number;
    ringgit_change: number;
    brent_change: number;
  };
};

type SoWhatItem = {
  domain: string;
  signal: string;
  // Trinity-aligned lenses — Δ → Ω → Ξ → Ψ.
  delta?: string;
  omega?: string;
  xi?: string;
  psi?: string;
  // Legacy family-member fields (kept for backwards-compat with older payloads).
  for_aia?: string;
  for_izzu?: string;
  for_aliff?: string;
  for_arif?: string;
  tone: string;
};

type Briefing = {
  meta: BriefingMeta;
  bursa: {
    klci_close: number | null;
    klci_change_pct: number | null;
    most_active: { title: string; url: string; desc: string } | null;
    top_gainers_search: { title: string; desc: string }[];
    source_urls: string[];
  };
  ringgit: {
    usd_myr: number | null;
    trend: string | null;
    sources: string[];
  };
  economy: { items: { title: string; desc: string; category: string }[] };
  politics: {
    narratives: { title: string; desc: string; source: string }[];
    economy_policy: { title: string; desc: string }[];
    regional: { title: string; desc: string }[];
  };
  social: {
    cost_of_living: { title: string; desc: string }[];
    labor: { title: string; desc: string }[];
    youth_career: { title: string; desc: string }[];
  };
  oil_energy: {
    brent_price: number | null;
    malaysia_oil: { title: string; desc: string }[];
    energy_transition: { title: string; desc: string }[];
  };
  global: {
    fed: { items: { title: string; desc: string }[] };
    china: { items: { title: string; desc: string }[] };
    asean: { items: { title: string; desc: string }[] };
  };
  so_what: SoWhatItem[];
};

type ArchiveEntry = {
  briefings: string[];
  last_updated: string;
};

function DeltaChip({ value, label, decimals = 2 }: { value: number; label: string; decimals?: number }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";
  const bgClass = isPositive ? "bg-green-500/10" : "bg-red-500/10";
  const sign = isPositive ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-1 text-[0.65rem] px-1.5 py-0.5 rounded font-mono ${colorClass} ${bgClass}`}>
      {sign}{value.toFixed(decimals)} {label}
    </span>
  );
}

function AckFloor({ id, name, color, desc }: { id: string; name: string; color: string; desc: string }) {
  return (
    <li className="grid grid-cols-[3.5rem_7rem_1fr] gap-3 items-baseline px-3 py-2.5 bg-white/[0.02] border-l-2 border-forge-iron">
      <span className="font-mono text-sm font-bold" style={{ color }}>{id}</span>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-forge-white">{name}</span>
      <span className="text-sm text-forge-dim leading-relaxed">{desc}</span>
    </li>
  );
}

function SoWhatCard({ item }: { item: SoWhatItem }) {
  const accentClass: Record<string, string> = {
    MARKET: "border-blue-500/40 bg-blue-500/5 text-blue-400",
    "FX / RINGGIT": "border-purple-500/40 bg-purple-500/5 text-purple-400",
    "OIL & GAS": "border-orange-500/40 bg-orange-500/5 text-orange-400",
    "COST OF LIVING": "border-red-500/40 bg-red-500/5 text-red-400",
    POLITICS: "border-gray-500/40 bg-gray-500/5 text-gray-400",
  };
  const accent = accentClass[item.domain] || "border-forge-orange/40 bg-forge-orange/5 text-forge-orange";

  // Trinity lenses — Δ (ground) → Ω (mind) → Ξ (capital) → Ψ (sovereign).
  // Falls back to legacy for_aia/for_izzu/for_aliff/for_arif for older payloads.
  const lenses: Array<[string, string, string, keyof SoWhatItem]> = [
    ["Δ", "GROUND",   "text-forge-orange", "delta"],
    ["Ω", "MIND",     "text-forge-green",  "omega"],
    ["Ξ", "CAPITAL",  "text-purple-400",   "xi"],
    ["Ψ", "SOVEREIGN","text-forge-gold",   "psi"],
  ];
  const legacy: Record<string, keyof SoWhatItem> = {
    delta: "for_aia",
    omega: "for_izzu",
    xi:    "for_aliff",
    psi:   "for_arif",
  };
  const lensValue = (k: keyof SoWhatItem): string => {
    const v = (item as any)[k];
    if (v) return v as string;
    const lk = legacy[k as string];
    return lk ? ((item as any)[lk] as string) || "" : "";
  };

  return (
    <div className={`brutalist-card p-6 mb-4 !border-l-4 ${accent}`}>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest border border-current px-2 py-0.5 rounded">
          {item.domain}
        </span>
        <span className="text-sm font-bold uppercase tracking-tight">
          {item.signal}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lenses.map(([symbol, label, color, key]) => (
          <div key={symbol} className="p-3 bg-white/5 border border-white/10">
            <p className={`font-mono text-[0.6rem] uppercase mb-1 ${color}`}>
              {symbol} {label}
            </p>
            <p className="text-xs leading-relaxed">{lensValue(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Wealth() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [archives, setArchives] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isOffline, setIsOffline] = useState(false);
  const [acked, setAcked] = useState(false);

  const wealthTools = useMemo(() => {
    return [
      {
        name: 'get_wealth_page_briefing',
        description: 'Get the loaded WEALTH briefing data currently shown on the page (KLCI, Forex, Brent, Macro signals)',
        execute() {
          return {
            content: [{
              type: 'text',
              text: briefing 
                ? JSON.stringify(briefing, null, 2) 
                : 'No briefing currently loaded on page.'
            }]
          };
        }
      }
    ];
  }, [briefing]);

  useWebMCP(wealthTools);

  useEffect(() => {
    document.title = 'Daily Briefing — Malaysia Economics | Arif Fazil';
    document.querySelector('link[rel=canonical]')?.setAttribute('href','https://arif-fazil.com/economics');
    async function load() {
      try {
        const bRes = await fetch("https://mcp.arif-fazil.com/briefing");
        if (!bRes.ok) throw new Error(`HTTP ${bRes.status}`);
        const [b, aRes] = await Promise.all([
          bRes.json() as Promise<Briefing>,
          fetch("/data/wealth/archive_index.json"),
        ]);
        const a: ArchiveEntry = aRes.ok ? await aRes.json() : { briefings: [] };
        setBriefing(b);
        setArchives(a.briefings || []);
        setLastUpdated(b.meta.generated_at);
      } catch {
        // Live endpoint unavailable — fall back to static snapshot
        try {
          const [staticRes, archiveRes] = await Promise.all([
            fetch("/data/wealth/latest.json"),
            fetch("/data/wealth/archive_index.json"),
          ]);
          if (!staticRes.ok) throw new Error("Static snapshot unavailable");
          const b: Briefing = await staticRes.json();
          const a: ArchiveEntry = archiveRes.ok ? await archiveRes.json() : { briefings: [] };
          setBriefing(b);
          setArchives(a.briefings || []);
          setLastUpdated(b.meta.generated_at);
          setIsOffline(true);
        } catch (e: any) {
          setError(e.message || "Failed to load briefing");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Hydrate constitutional acknowledgment from localStorage.
  useEffect(() => {
    if (!briefing) return;
    try {
      const dates: string[] = JSON.parse(localStorage.getItem("arifos_wealth_ack") || "[]");
      setAcked(dates.indexOf(briefing.meta.date) !== -1);
    } catch {
      setAcked(false);
    }
  }, [briefing]);

  const acknowledge = () => {
    if (!briefing) return;
    try {
      const dates: string[] = JSON.parse(localStorage.getItem("arifos_wealth_ack") || "[]");
      if (dates.indexOf(briefing.meta.date) === -1) {
        dates.push(briefing.meta.date);
        // bounded KV-cache pattern: keep last 30
        localStorage.setItem("arifos_wealth_ack", JSON.stringify(dates.slice(-30)));
      }
      setAcked(true);
    } catch {
      setAcked(true);
    }
  };

  const revoke = () => {
    if (!briefing) return;
    try {
      const dates: string[] = JSON.parse(localStorage.getItem("arifos_wealth_ack") || "[]");
      const next = dates.filter((d) => d !== briefing.meta.date);
      localStorage.setItem("arifos_wealth_ack", JSON.stringify(next));
    } catch {}
    setAcked(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl font-display animate-pulse">Ξ</div>
        <p className="font-mono text-xs text-forge-dim uppercase tracking-widest">Synchronizing WEALTH Data...</p>
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <section className="py-24 bg-forge-black min-h-screen">
        <div className="site-frame text-center max-w-2xl mx-auto">
          <div className="brutalist-card border-forge-iron inline-block p-12 w-full">
            <h2 className="text-2xl font-black mb-4 uppercase text-forge-white">System Offline</h2>
            <p className="text-sm text-forge-dim mb-8">
              The WEALTH engine is currently offline or synchronizing. No cached state is available.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-forge-iron border-t-forge-orange animate-spin"></div>
              <p className="text-[0.65rem] font-mono text-forge-dim">
                Please check back later. System health can be monitored at the Observatory.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const delta = briefing.meta.delta_vs_yesterday;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── CONSTITUTIONAL ACKNOWLEDGMENT ────────────────── */}
      <section className="pt-12">
        <div className="site-frame">
          {!acked ? (
            <div className="brutalist-card border-forge-orange bg-gradient-to-b from-forge-orange/[0.04] to-transparent">
              <div className="flex justify-between items-baseline mb-5 flex-wrap gap-3">
                <span className="font-mono text-[0.7rem] text-forge-orange uppercase tracking-[0.2em]">
                  ◆ CONSTITUTIONAL ACKNOWLEDGMENT
                </span>
                <span className="font-mono text-[0.7rem] text-forge-dim uppercase tracking-[0.2em]">
                  Briefing {briefing.meta.date}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase leading-tight mb-4">
                Read this before you act on anything below.
              </h2>
              <p className="text-forge-dim text-base leading-relaxed mb-6 max-w-3xl">
                This briefing is AI-synthesized under arifOS F1–F13 constitutional governance.
                The data is real (Bernama, Reuters, BURSA Malaysia, BNM) but the
                <span className="text-forge-orange"> translation layer </span>
                is the model's. By proceeding you accept the following floors as the contract on
                which these signals rest:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                <AckFloor id="F1"  name="AMANAH"      color="#FF4500" desc="Reversible first. No sealed action without an escape path." />
                <AckFloor id="F2"  name="TRUTH"       color="#00FF41" desc="Evidence-gated. Every claim has a band — CLAIM, PLAUSIBLE, ESTIMATE, UNKNOWN." />
                <AckFloor id="F7"  name="STEWARDSHIP" color="#A855F7" desc="HARAM patterns blocked. We do not act on what the sovereign would not endorse." />
                <AckFloor id="F9"  name="ANTI-CASCADE" color="#3B82F6" desc="No runaway loops. The system halts and surfaces when its own confidence drops." />
                <AckFloor id="F13" name="SOVEREIGN"   color="#D4A853" desc="Human veto is final. You can SEAL, HOLD, or VOID any output of this system." />
              </ul>
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <button
                  type="button"
                  onClick={acknowledge}
                  className="font-mono text-sm font-bold uppercase tracking-wider px-5 py-3 bg-forge-orange text-forge-black border-2 border-forge-orange hover:bg-forge-orange/80 transition-colors"
                >
                  ✓ I acknowledge — proceed
                </button>
                <a
                  href="/doctrine"
                  className="font-mono text-sm font-bold uppercase tracking-wider px-5 py-3 bg-transparent text-forge-dim border-2 border-forge-iron hover:text-forge-white hover:border-forge-white transition-colors"
                >
                  Read the full canon →
                </a>
              </div>
              <p className="font-mono text-[0.65rem] text-forge-dim uppercase tracking-wider leading-relaxed">
                Acknowledgment is stored locally on this device, keyed to this briefing date.
                A new briefing asks again. You can revoke it any time.
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2.5 bg-forge-green/10 border border-forge-green/40 py-2 px-3 mt-2 font-mono text-xs uppercase tracking-[0.15em] text-forge-green">
              <span className="font-bold">✓</span>
              <span>Constitutional floors acknowledged</span>
              <button
                type="button"
                onClick={revoke}
                className="text-forge-dim hover:text-forge-red font-mono text-base leading-none ml-1"
                title="Revoke acknowledgment"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="section-label">Ξ WEALTH · Capital Intelligence</div>
            <a 
              href="https://wealth.arif-fazil.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-forge-orange/10 border border-forge-orange/30 text-forge-orange hover:bg-forge-orange/20 font-mono text-[0.65rem] uppercase tracking-wider transition-all"
            >
              Open the live WEALTH cockpit → wealth.arif-fazil.com
            </a>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter mb-4">
            Daily Briefing
          </h1>
          <p className="font-body text-xl text-forge-dim mb-8">
            {briefing.meta.date} · BURSA Malaysia + Ekonomi + Politik + Social
          </p>

          {isOffline && (
            <div className="mb-6 brutalist-card border-yellow-500/50 bg-yellow-500/5 p-4 flex items-center gap-3">
              <span className="text-yellow-500 font-mono text-xs">⚠ OFFLINE MODE</span>
              <span className="text-forge-dim text-xs">Live engine unreachable — showing last cached briefing ({briefing?.meta?.date}). Briefing updates daily at 09:00 UTC.</span>
            </div>
          )}

          {/* Key metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 -space-x-[2px] -space-y-[2px]">
            <div className="brutalist-card p-6 flex flex-col items-center justify-center">
              <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest mb-1">FBM KLCI</p>
              <p className="text-2xl font-black font-mono">
                {briefing.bursa.klci_close?.toLocaleString("en-MY", { minimumFractionDigits: 2 }) ?? "—"}
              </p>
              {delta && <DeltaChip value={delta.klci_change} label="pts" />}
            </div>
            
            <div className="brutalist-card p-6 flex flex-col items-center justify-center">
              <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest mb-1">USD/MYR</p>
              <p className="text-2xl font-black font-mono">
                {briefing.ringgit.usd_myr?.toFixed(4) ?? "—"}
              </p>
              {delta && <DeltaChip value={delta.ringgit_change} label="MYR" decimals={4} />}
            </div>

            <div className="brutalist-card p-6 flex flex-col items-center justify-center">
              <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest mb-1">Brent Crude</p>
              <p className="text-2xl font-black font-mono">
                {briefing.oil_energy.brent_price ? `$${briefing.oil_energy.brent_price.toFixed(2)}` : "—"}
              </p>
              {delta && <DeltaChip value={delta.brent_change} label="$" />}
            </div>

            <div className="brutalist-card p-6 flex flex-col items-center justify-center">
              <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest mb-1">KLCI Change</p>
              <p className={`text-2xl font-black font-mono ${(briefing.bursa.klci_change_pct ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {briefing.bursa.klci_change_pct != null
                  ? `${briefing.bursa.klci_change_pct >= 0 ? "+" : ""}${briefing.bursa.klci_change_pct.toFixed(2)}%`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center text-[0.65rem] font-mono text-forge-dim uppercase tracking-widest">
            <span>Generated: {new Date(lastUpdated).toLocaleString("en-MY")} MYT</span>
            <a href="/data/wealth/archive_index.json" target="_blank" className="text-forge-orange hover:underline">
              View Archives ({archives.length})
            </a>
          </div>
        </div>
      </section>

      {/* ── SO WHAT ──────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">◆ SO WHAT — Decision Logic</div>
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl font-black uppercase italic mb-6">
              Translation Layer. <span className="text-forge-orange">Δ → Ω → Ξ → Ψ</span>
            </h2>
            <p className="font-body text-lg text-forge-dim leading-relaxed">
              Data without context is noise. The translation layer moves from{" "}
              <span className="text-forge-orange font-bold">Δ</span> (what the ground says) to{" "}
              <span className="text-forge-green font-bold">Ω</span> (what the logic concludes) to{" "}
              <span className="text-purple-400 font-bold">Ξ</span> (what capital should do), with{" "}
              <span className="text-forge-gold font-bold">Ψ</span> as the sovereign check.
              Evidence-gated. Risk-aware. No vibes.
            </p>
          </div>

          {briefing.so_what.length === 0 ? (
            <div className="brutalist-card border-dashed p-12 text-center">
              <p className="font-mono text-sm text-forge-dim">Synthesis pending market close research.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {briefing.so_what.map((item, i) => (
                <SoWhatCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MARKET DETAIL ─────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 -space-x-[2px] -space-y-[2px]">
            
            {/* BURSA */}
            <div className="brutalist-card">
              <div className="section-label !mb-6">Bursa Malaysia</div>
              {briefing.bursa.most_active && (
                <div className="bg-white/5 border border-white/10 p-4 mb-4">
                  <p className="font-mono text-[0.6rem] text-forge-orange uppercase mb-1">Most Active</p>
                  <p className="text-sm font-bold mb-1">{briefing.bursa.most_active.title}</p>
                  <p className="text-[0.7rem] text-forge-dim leading-tight">{briefing.bursa.most_active.desc}</p>
                </div>
              )}
              <div className="space-y-2">
                {briefing.bursa.source_urls.slice(0, 3).map((u, i) => (
                  <a key={i} href={u} target="_blank" className="block text-[0.65rem] font-mono text-blue-400 hover:underline truncate">
                    [SOURCE_{i+1}] {u}
                  </a>
                ))}
              </div>
            </div>

            {/* RINGGIT */}
            <div className="brutalist-card">
              <div className="section-label !mb-6">Ringgit & FX</div>
              <p className="text-sm text-forge-dim leading-relaxed mb-4">{briefing.ringgit.trend}</p>
              <div className="bg-purple-500/10 border border-purple-500/30 p-4">
                <p className="font-mono text-[0.6rem] text-purple-400 uppercase">Spot Rate</p>
                <p className="text-xl font-black font-mono">1 USD = {briefing.ringgit.usd_myr?.toFixed(4)} MYR</p>
              </div>
            </div>

            {/* OIL & GAS */}
            <div className="brutalist-card">
              <div className="section-label !mb-6">Oil & Energy</div>
              {briefing.oil_energy.malaysia_oil.map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <p className="text-xs font-bold mb-1 uppercase tracking-tight">{item.title}</p>
                  <p className="text-[0.7rem] text-forge-dim leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* GLOBAL */}
            <div className="brutalist-card">
              <div className="section-label !mb-6">Global Context</div>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[0.6rem] text-red-400 uppercase mb-1">US FED</p>
                  {briefing.global.fed.items.map((item, i) => (
                    <p key={i} className="text-[0.7rem] text-forge-dim leading-tight mb-2">{item.desc}</p>
                  ))}
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] text-red-400 uppercase mb-1">CHINA</p>
                  {briefing.global.china.items.map((item, i) => (
                    <p key={i} className="text-[0.7rem] text-forge-dim leading-tight mb-2">{item.desc}</p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── EKONOMI ──────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">🏛️ Ekonomi Malaysia</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefing.economy.items.map((item, i) => (
              <div key={i} className="brutalist-card !border-l-4 border-l-green-500">
                <p className="font-mono text-[0.6rem] text-green-500 uppercase tracking-widest mb-2">{item.category}</p>
                <p className="text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POLITIK & SOCIAL ─────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="section-label">⚖️ Politik Malaysia</div>
              <div className="space-y-6">
                {briefing.politics.narratives.map((item, i) => (
                  <div key={i} className="border-l-2 border-forge-iron pl-6">
                    <h3 className="text-lg font-black uppercase mb-2">{item.title}</h3>
                    <p className="text-sm text-forge-dim leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="section-label">🏠 Rakyat & Society</div>
              <div className="space-y-6">
                {briefing.social.cost_of_living.map((item, i) => (
                  <div key={i} className="brutalist-card p-6">
                    <h3 className="text-sm font-bold uppercase mb-2 text-red-400">{item.title}</h3>
                    <p className="text-xs text-forge-dim leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAW: WEALTH-AS-WISDOM ─────────────────────────── */}
      <section className="py-16 border-b-2 border-forge-iron bg-gradient-to-b from-forge-steel to-forge-black">
        <div className="site-frame">
          <div className="brutalist-card border-forge-gold/40 bg-gradient-to-br from-forge-gold/[0.06] to-transparent">
            <div className="flex flex-wrap items-baseline gap-3 mb-6">
              <span className="font-mono text-[0.65rem] text-forge-gold uppercase tracking-[0.25em]">
                ◆ WAW · Wealth-as-Wisdom
              </span>
              <span className="font-mono text-[0.6rem] text-forge-dim">EUEREKA — what WAW discovered</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-6">
              Capital has <span className="text-forge-gold">physics</span>. Not narrative.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-white/[0.03] border border-white/10">
                <p className="font-mono text-[0.6rem] text-forge-gold uppercase tracking-widest mb-2">NPV</p>
                <p className="text-sm font-bold mb-1">Stored Energy</p>
                <p className="text-xs text-forge-dim">Reward accumulated in the system. Energy stored, not promised.</p>
              </div>
              <div className="p-4 bg-white/[0.03] border border-white/10">
                <p className="font-mono text-[0.6rem] text-forge-gold uppercase tracking-widest mb-2">IRR</p>
                <p className="text-sm font-bold mb-1">Rate of Work</p>
                <p className="text-xs text-forge-dim">Capital efficiency per unit time. Energy released per cycle.</p>
              </div>
              <div className="p-4 bg-white/[0.03] border border-white/10">
                <p className="font-mono text-[0.6rem] text-forge-gold uppercase tracking-widest mb-2">DSCR</p>
                <p className="text-sm font-bold mb-1">Survival Margin</p>
                <p className="text-xs text-forge-dim">Structural load capacity. Can the system survive the next stress?</p>
              </div>
            </div>
            <p className="text-sm text-forge-dim leading-relaxed mb-6">
              WAW is the WEALTH EUREKA. It was confirmed in the EUREKA trilogy (AVO contrast detection) — 
              where physics-grounded measurement outperforms narrative projection. WEALTH applies the same 
              doctrine to capital: every metric is grounded in a physical dimension. No narratives. No projections without evidence.
            </p>
            <a
              href="/writing"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-forge-gold uppercase tracking-wider hover:text-forge-orange transition-colors"
            >
              Read the EUREKA trilogy →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER NOTE ───────────────────────────────────── */}
      <section className="py-12 bg-forge-black">
        <div className="site-frame">
          <div className="brutalist-card border-forge-iron bg-forge-steel/30">
            <p className="font-mono text-[0.65rem] text-forge-dim leading-relaxed uppercase">
              <span className="text-forge-orange font-bold mr-2">Model Note:</span>
              {briefing.meta.model_note}
              <br />
              Generated via arifOS WEALTH engine + Brave Search. Context is informational. 
              Not financial advice. Verify all critical signals.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "wealth",
  routeUrl: "/wealth/",
};

export default Wealth;
