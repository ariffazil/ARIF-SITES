import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type CommodityDef = {
  slug: string;
  name: string;
  symbol: string;
  description: string;
  source: string;
  color: string;
  yahoo: string;
  price: string;
  delta: string;
  pct: string;
  verdict: 'SEAL' | 'SABAR' | 'HOLD';
  verdictColor: string;
  bias: string;
  s1: string;
  s2: string;
  r1: string;
  r2: string;
  driver: string;
  ground: { title: string; desc: string };
  mind: { title: string; desc: string };
  capital: { title: string; desc: string };
  sovereign: { title: string; desc: string };
};

const COMMODITIES: Record<string, CommodityDef> = {
  oil: {
    slug: 'oil', name: 'Brent Crude Oil', symbol: 'BZ=F',
    description: 'Brent crude futures — global benchmark for oil prices. Drives Malaysian petroleum revenue and fiscal budget buffers.',
    source: 'yfinance: BZ=F',
    color: '#C4791A',
    yahoo: 'BZ=F',
    price: '$90.12',
    delta: '+$1.45',
    pct: '+1.64%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'BULLISH MANDATE',
    s1: '$88.50', s2: '$85.00', r1: '$92.00', r2: '$95.00',
    driver: 'Primary Driver: Middle East geopolitical risk premium · OPEC+ supply discipline · PETRONAS dividend buffer',
    ground: { title: 'Global Energy Pulse', desc: 'Brent crude benchmark directly influences PETRONAS dividend contributions to Putrajaya and RON95/BUDI95 fuel subsidy thresholds.' },
    mind: { title: 'Trading Desk Risk', desc: 'O&G equity tickers (Dayang, Dialog, Sapura) exhibit strong 0.82 correlation to Brent spot price movements.' },
    capital: { title: 'PETRONAS PROPA Impact', desc: 'Internal corporate KPI narratives intensify when Brent swings. Distinguish core operational signal from executive spin.' },
    sovereign: { title: 'Frontier Drilling Budget', desc: 'Sustained oil above $85/bbl funds offshore exploration campaigns in the Malay and Sabah basins.' },
  },
  gas: {
    slug: 'gas', name: 'Natural Gas', symbol: 'NG=F',
    description: 'Natural gas futures — benchmark for LNG pricing. Influences Sarawak gas revenue, SEARAH economics, and TNB power tariffs.',
    source: 'yfinance: NG=F',
    color: '#00D4AA',
    yahoo: 'NG=F',
    price: '$3.42',
    delta: '+$0.08',
    pct: '+2.40%',
    verdict: 'SABAR',
    verdictColor: 'bg-amber-950 text-amber-400 border-amber-500/40',
    bias: 'NEUTRAL ACCUMULATION',
    s1: '$3.20', s2: '$3.00', r1: '$3.60', r2: '$3.85',
    driver: 'Primary Driver: Asian LNG demand · Bintulu MLNG cargo dispatch · Seasonal thermal cooling demand',
    ground: { title: 'LNG Export Benchmarks', desc: 'Japan-Korea Marker (JKM) and Henry Hub futures dictate Sarawak state gas sales and Bintulu export revenues.' },
    mind: { title: 'Power Generation Net Cost', desc: 'Natural gas inputs drive 55%+ of Peninsular Malaysia electricity generation costs under IBR tariff rebalancing.' },
    capital: { title: 'SEARAH Asset Economics', desc: 'Gas realization prices determine asset valuation multiples across domestic upstream gas fields.' },
    sovereign: { title: 'Sarawak PDA Sovereignty', desc: 'State-federal gas distribution rights between PETROS and PETRONAS depend on long-term gas netback margins.' },
  },
  gold: {
    slug: 'gold', name: 'Gold (XAU/USD)', symbol: 'GC=F',
    description: 'Gold futures — sovereign hedge and zero-counterparty risk asset. Tracked in USD/oz and RM/gram for capital preservation.',
    source: 'yfinance: GC=F',
    color: '#D4A853',
    yahoo: 'GC=F',
    price: '$2,485.40',
    delta: '+$14.20',
    pct: '+0.58%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'SOVEREIGN HEDGE',
    s1: '$2,450.00', s2: '$2,420.00', r1: '$2,500.00', r2: '$2,525.00',
    driver: 'Primary Driver: Central bank gold accumulation · US Fed rate cut expectations · Geopolitical safe-haven demand',
    ground: { title: 'Zero Counterparty Risk', desc: 'Physical gold remains the ultimate store of value, free from sovereign debt default or fiat debasement risk.' },
    mind: { title: 'Currency Hedging', desc: 'Gold in MYR terms (RM 348/gram) protects domestic purchasing power against Ringgit volatility.' },
    capital: { title: 'Portfolio Protection', desc: 'Allocating 5-10% to gold lowers overall portfolio drawdowns during equity market corrections.' },
    sovereign: { title: 'Central Bank Reserves', desc: 'Global monetary authorities continue net gold purchases to diversify away from USD reserve dominance.' },
  },
  klci: {
    slug: 'klci', name: 'Bursa Malaysia (FBM KLCI)', symbol: '^KLSE',
    description: 'FTSE Bursa Malaysia KLCI — benchmark index of Malaysia top 30 blue-chip equities and capital market pulse.',
    source: 'yfinance: ^KLSE',
    color: '#3B82F6',
    yahoo: '^KLSE',
    price: '1,724.90',
    delta: '+4.50',
    pct: '+0.26%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'BULLISH RECOVERY',
    s1: '1,712.00', s2: '1,701.00', r1: '1,732.00', r2: '1,745.00',
    driver: 'Primary Driver: Blue-chip accumulation · OPR stability at 2.75% · Domestic demand resilience',
    ground: { title: 'Domestic Equities & Blue Chips', desc: 'Index anchored by banking, O&G, and utility blue chips. Retail & institutional volume steady above RM2.4B daily average.' },
    mind: { title: 'Monetary Stance & Rates', desc: 'BNM OPR maintained at 2.75% provides low-volatility monetary buffer. Foreign inflow responding to defensive valuation multiples.' },
    capital: { title: 'Corporate Earnings & Yield', desc: 'Average dividend yield across top 30 constituent stocks holding at ~4.1%, preserving capital against bond yield volatility.' },
    sovereign: { title: 'Fiscal Buffer & Policy', desc: 'Federal fiscal target aligned with 4.5%–5.0% GDP growth projection. State election resolution removes near-term political risk discount.' },
  },
  usdmyr: {
    slug: 'usdmyr', name: 'Ringgit FX (USD/MYR)', symbol: 'USDMYR=X',
    description: 'Malaysian Ringgit exchange rate against US Dollar — imported inflation barometer, BNM OPR buffer, and trade surplus anchor.',
    source: 'yfinance: USDMYR=X',
    color: '#F59E0B',
    yahoo: 'USDMYR=X',
    price: '4.0835',
    delta: '+0.0636',
    pct: 'vs 90d mean (4.0199)',
    verdict: 'SABAR',
    verdictColor: 'bg-amber-950 text-amber-400 border-amber-500/40',
    bias: 'STABLE CONTROL',
    s1: '4.0200', s2: '3.9800', r1: '4.1500', r2: '4.5000 (Stress)',
    driver: 'Primary Driver: US Federal Reserve rate pause (3.50%-3.75%) · BNM OPR 2.75% · Export trade surplus buffer',
    ground: { title: 'Imported Inflation & Prices', desc: 'Every 0.10 MYR shift impacts imported food, electronics, and capital equipment costs. Current 1.90% inflation rate reflects moderate FX passthrough.' },
    mind: { title: 'Fed vs BNM Rate Differential', desc: 'US Fed funds rate at 3.50%–3.75% against Bank Negara OPR at 2.75%. Differential narrowing reduces capital outflow pressure.' },
    capital: { title: 'PETRONAS & Exporter Translation', desc: 'PETRONAS USD revenue stream provides natural hedge for national accounts. Exporters converting USD receipts support domestic Ringgit liquidity.' },
    sovereign: { title: 'Trade Surplus & Reserves', desc: 'Malaysia H1 trade surplus reaching MYR 147.1B (+27.5% export growth) maintains strong central bank reserve foundation.' },
  },
};

export function CommodityPage({ slug }: { slug: string }) {
  const commodity = COMMODITIES[slug] || COMMODITIES['gold'];
  const [ticker, setTicker] = useState<{ price: string; change: string; changePct: string } | null>(null);

  useEffect(() => {
    if (commodity) {
      document.title = `${commodity.name} · WEALTH Signal Terminal | Arif Fazil`;
      fetch(`/${commodity.slug}/api/ticker`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.price) {
            setTicker({
              price: data.price.toFixed(2),
              change: (data.change >= 0 ? '+' : '') + data.change.toFixed(2),
              changePct: (data.changePct >= 0 ? '+' : '') + data.changePct.toFixed(2) + '%',
            });
          }
        })
        .catch(() => {});
    }
  }, [commodity]);

  const currentPrice = ticker ? ticker.price : commodity.price;
  const currentDelta = ticker ? ticker.change : commodity.delta;
  const currentPct = ticker ? ticker.changePct : commodity.pct;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-black pb-20">
      
      {/* LOCAL MARKET NAV TICKER */}
      <div className="bg-[#080b12] border-b border-forge-iron py-2 px-4 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
            ● WEALTH SIGNAL TERMINAL
          </span>
          <span className="text-slate-300">arifOS · Federation Market Intelligence · {commodity.name}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <a href="/klci/" className={`px-2 py-0.5 rounded ${slug === 'klci' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>KLCI</a>
          <a href="/usdmyr/" className={`px-2 py-0.5 rounded ${slug === 'usdmyr' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}>USD/MYR</a>
          <a href="/oil/" className={`px-2 py-0.5 rounded ${slug === 'oil' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>OIL</a>
          <a href="/gas/" className={`px-2 py-0.5 rounded ${slug === 'gas' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>GAS</a>
          <a href="/gold/" className={`px-2 py-0.5 rounded ${slug === 'gold' ? 'bg-yellow-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}>GOLD</a>
        </div>
      </div>

      {/* HERO & LIVE VERDICT */}
      <section className="py-12 md:py-16 border-b border-forge-iron bg-gradient-to-b from-[#080b12] via-[#05070c] to-forge-black">
        <div className="site-frame">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-1">
                WEALTH MARKET SIGNAL · {commodity.symbol}
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter" style={{ color: commodity.color }}>
                {commodity.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded font-mono text-sm font-bold border uppercase tracking-wider ${commodity.verdictColor}`}>
                VERDICT: {commodity.verdict}
              </span>
            </div>
          </div>

          <p className="font-body text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            {commodity.description}
          </p>

          {/* PRICE CARD */}
          <div className="bg-[#0b0e17] border border-forge-iron rounded-xl p-6 md:p-8 mb-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">Live Price Quote</div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-4xl md:text-5xl font-black text-white">{currentPrice}</span>
                  <span className="font-mono text-lg md:text-xl font-bold text-emerald-400">{currentDelta}</span>
                  <span className="font-mono text-sm text-slate-400">({currentPct})</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-slate-800 text-slate-200 font-mono text-xs uppercase font-bold tracking-wider">
                  BIAS: {commodity.bias}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs text-amber-400">
              {commodity.driver}
            </div>

            {/* KEY LEVELS */}
            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="text-slate-400 uppercase">Key Levels:</span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">S1: {commodity.s1}</span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">S2: {commodity.s2}</span>
              <span className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">R1: {commodity.r1}</span>
              <span className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">R2: {commodity.r2}</span>
            </div>
          </div>

          {/* STANDALONE INTERACTIVE DASHBOARD ACTION */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#0e1322] border border-blue-500/30 rounded-lg">
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Full Interactive Standalone Terminal</h3>
              <p className="font-body text-xs text-slate-400 mt-1">Open 3D/2D price chart, technical indicators, APEX primitives, and JSON machine context.</p>
            </div>
            <a
              href={`/${commodity.slug}/`}
              className="px-5 py-2.5 rounded bg-amber-500 text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              LAUNCH FULL /{commodity.slug.toUpperCase()}/ TERMINAL →
            </a>
          </div>
        </div>
      </section>

      {/* 4-PLANE DECISION DRIVERS GRID */}
      <section className="py-16">
        <div className="site-frame">
          <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">4-PLANE DECISION MATRIX</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">$\Delta \rightarrow \Omega \rightarrow \Xi \rightarrow \Psi$ Signal Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#080b12] border border-forge-iron rounded-xl p-6">
              <div className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">Δ GROUND · PHYSICAL DATA</div>
              <h3 className="text-lg font-bold text-white mb-2">{commodity.ground.title}</h3>
              <p className="font-body text-sm text-slate-300 leading-relaxed">{commodity.ground.desc}</p>
            </div>

            <div className="bg-[#080b12] border border-forge-iron rounded-xl p-6">
              <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Ω MIND · TECHNICAL & RISK</div>
              <h3 className="text-lg font-bold text-white mb-2">{commodity.mind.title}</h3>
              <p className="font-body text-sm text-slate-300 leading-relaxed">{commodity.mind.desc}</p>
            </div>

            <div className="bg-[#080b12] border border-forge-iron rounded-xl p-6">
              <div className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Ξ CAPITAL · EARNINGS & ALIGNMENT</div>
              <h3 className="text-lg font-bold text-white mb-2">{commodity.capital.title}</h3>
              <p className="font-body text-sm text-slate-300 leading-relaxed">{commodity.capital.desc}</p>
            </div>

            <div className="bg-[#080b12] border border-forge-iron rounded-xl p-6">
              <div className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Ψ SOVEREIGN · FISCAL POLICY</div>
              <h3 className="text-lg font-bold text-white mb-2">{commodity.sovereign.title}</h3>
              <p className="font-body text-sm text-slate-300 leading-relaxed">{commodity.sovereign.desc}</p>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
