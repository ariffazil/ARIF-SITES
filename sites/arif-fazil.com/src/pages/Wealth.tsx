import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  for_aia: string;
  for_izzu: string;
  for_aliff: string;
  for_arif: string;
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

function SoWhatCard({ item }: { item: SoWhatItem }) {
  const accentClass: Record<string, string> = {
    MARKET: "border-blue-500/40 bg-blue-500/5 text-blue-400",
    "FX / RINGGIT": "border-purple-500/40 bg-purple-500/5 text-purple-400",
    "OIL & GAS": "border-orange-500/40 bg-orange-500/5 text-orange-400",
    "COST OF LIVING": "border-red-500/40 bg-red-500/5 text-red-400",
    POLITICS: "border-gray-500/40 bg-gray-500/5 text-gray-400",
  };
  const accent = accentClass[item.domain] || "border-forge-orange/40 bg-forge-orange/5 text-forge-orange";

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
        <div className="p-3 bg-white/5 border border-white/10">
          <p className="font-mono text-[0.6rem] text-forge-orange uppercase mb-1">ALL AIA</p>
          <p className="text-xs leading-relaxed">{item.for_aia}</p>
        </div>
        <div className="p-3 bg-white/5 border border-white/10">
          <p className="font-mono text-[0.6rem] text-blue-400 uppercase mb-1">IZZU</p>
          <p className="text-xs leading-relaxed">{item.for_izzu}</p>
        </div>
        <div className="p-3 bg-white/5 border border-white/10">
          <p className="font-mono text-[0.6rem] text-green-400 uppercase mb-1">ALIFF</p>
          <p className="text-xs leading-relaxed">{item.for_aliff}</p>
        </div>
        <div className="p-3 bg-white/5 border border-white/10">
          <p className="font-mono text-[0.6rem] text-orange-400 uppercase mb-1">ARIF</p>
          <p className="text-xs leading-relaxed">{item.for_arif}</p>
        </div>
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

  useEffect(() => {
    async function load() {
      try {
        const BASE = "https://mcp.arif-fazil.com";
        const [bRes, aRes] = await Promise.all([
          fetch(`${BASE}/briefing`),
          fetch("/data/wealth/archive_index.json"),
        ]);
        if (!bRes.ok) throw new Error(`HTTP ${bRes.status}`);
        const b: Briefing = await bRes.json();
        const a: ArchiveEntry = aRes.ok ? await aRes.json() : { briefings: [] };
        setBriefing(b);
        setArchives(a.briefings || []);
        setLastUpdated(b.meta.generated_at);
      } catch (e: any) {
        setError(e.message || "Failed to load briefing");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      <section className="py-24">
        <div className="site-frame text-center">
          <div className="brutalist-card border-red-500 inline-block p-8">
            <h2 className="text-2xl font-black mb-4 uppercase text-red-500">⚠ Synchronization Failure</h2>
            <p className="text-sm text-forge-dim mb-6">{error || "No data received from WEALTH engine."}</p>
            <p className="text-[0.65rem] font-mono text-forge-dim max-w-sm mx-auto">
              Briefing runs daily at 09:00 UTC (5pm MYT). Check mcp.arif-fazil.com for system health.
            </p>
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
      {/* ── HERO HEADER ─────────────────────────────────── */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">Ξ WEALTH · Capital Intelligence</div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter mb-4">
            Daily Briefing
          </h1>
          <p className="font-body text-xl text-forge-dim mb-8">
            {briefing.meta.date} · BURSA Malaysia + Ekonomi + Politik + Social
          </p>

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
            <h2 className="text-4xl font-black uppercase italic mb-6">Translation Layer.</h2>
            <p className="font-body text-lg text-forge-dim leading-relaxed">
              Data without context is noise. This section translates market signals into decisions 
              for the AIA circle. Evidence-gated and risk-aware.
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
