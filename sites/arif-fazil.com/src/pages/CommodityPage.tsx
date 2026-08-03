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
};

const COMMODITIES: Record<string, CommodityDef> = {
  oil: {
    slug: 'oil', name: 'Oil (Brent Crude)', symbol: 'BZ=F',
    description: 'Brent crude futures — global benchmark for oil prices. Drives Malaysian petroleum revenue and RON95/BUDI95 subsidy costs.',
    source: 'yfinance: BZ=F',
    color: '#C4791A',
    yahoo: 'BZ=F',
  },
  gas: {
    slug: 'gas', name: 'Natural Gas', symbol: 'NG=F',
    description: 'Natural gas futures — benchmark for LNG pricing. Influences Sarawak gas revenue, SEARAH economics, and TNB power tariffs.',
    source: 'yfinance: NG=F',
    color: '#00D4AA',
    yahoo: 'NG=F',
  },
  gold: {
    slug: 'gold', name: 'Gold (XAU/USD)', symbol: 'GC=F',
    description: 'Gold futures — sovereign hedge and B40 savings barometer. Tracked in USD/oz and RM/gram by MakcikGPT audience.',
    source: 'yfinance: GC=F',
    color: '#D4A853',
    yahoo: 'GC=F',
  },
  klci: {
    slug: 'klci', name: 'Bursa Malaysia (FBM KLCI)', symbol: '^KLSE',
    description: 'FTSE Bursa Malaysia KLCI — benchmark index of Malaysia top 30 blue-chip equities and capital market pulse.',
    source: 'yfinance: ^KLSE',
    color: '#3B82F6',
    yahoo: '^KLSE',
  },
  usdmyr: {
    slug: 'usdmyr', name: 'Ringgit FX (USD/MYR)', symbol: 'USDMYR=X',
    description: 'Malaysian Ringgit exchange rate against US Dollar — imported inflation barometer, BNM OPR buffer, and trade surplus anchor.',
    source: 'yfinance: USDMYR=X',
    color: '#F59E0B',
    yahoo: 'USDMYR=X',
  },
};

export function CommodityPage({ slug }: { slug: string }) {
  const commodity = COMMODITIES[slug];
  const [ticker, setTicker] = useState<{ price: number; change: number; changePct: number } | null>(null);

  useEffect(() => {
    if (commodity) {
      document.title = `${commodity.name} · Commodity Dashboard | Arif Fazil`;
      fetch(`/${slug}/api/ticker`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.price) {
            setTicker({ price: data.price, change: data.change || 0, changePct: data.changePct || 0 });
          }
        })
        .catch(() => {});
    }
  }, [commodity, slug]);

  if (!commodity) {
    return <div className="py-24 text-center text-forge-dim">Commodity not found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Δ-ONLY · PRICE DATA · NO SYNTHESIS</div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6"
              style={{ color: commodity.color }}>
            {commodity.name}
          </h1>
          <p className="font-body text-lg text-forge-dim max-w-2xl leading-relaxed mb-4">
            {commodity.description}
          </p>
          <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest">
            Source: <span className="text-forge-orange">{commodity.source}</span>
          </p>

          {ticker && (
            <div className="mt-6 p-4 bg-forge-black/80 border border-forge-iron rounded inline-flex items-center gap-4">
              <span className="font-mono text-xs text-forge-dim uppercase tracking-widest">Live yfinance Pipe:</span>
              <span className="font-mono text-2xl font-bold text-forge-white">${ticker.price.toFixed(2)}</span>
              <span className={`font-mono text-sm font-semibold ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePct >= 0 ? '+' : ''}{ticker.changePct.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* DASHBOARD — link to existing static charts */}
      <section className="py-20">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <a href={`/${commodity.slug}/`}
               className="brutalist-card border-2 border-dashed border-forge-iron hover:border-forge-orange transition-colors flex flex-col items-center justify-center py-12">
              <span className="text-4xl mb-4">📊</span>
              <h2 className="text-xl font-black uppercase italic mb-3">Full Dashboard</h2>
              <p className="font-body text-sm text-forge-dim mb-6 text-center max-w-xs">
                Interactive chart with technical levels, history, and macro context. Opens the existing dashboard.
              </p>
              <span className="font-mono text-xs uppercase tracking-widest text-forge-orange border border-forge-orange px-4 py-2 hover:bg-forge-orange hover:text-forge-black transition-colors">
                Open {commodity.slug === 'oil' ? 'Brent' : commodity.slug === 'gas' ? 'Nat Gas' : 'Gold'} →
              </span>
            </a>

            <div className="space-y-4">
              <div className="brutalist-card p-5">
                <h3 className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-orange mb-3">Δ Only — Price Snapshot</h3>
                <p className="font-body text-sm text-forge-dim leading-relaxed">
                  This page is Δ-only — verified price data, no AI synthesis, no narrative overlay.
                  The Ω (interpretation) layer will be re-enabled when the briefing engine's
                  evidence-gating passes audit. Until then: numbers only, sourced from yfinance.
                </p>
              </div>
              <div className="brutalist-card p-5">
                <h3 className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-orange mb-3">Sources</h3>
                <ul className="space-y-2">
                  <li><a href={`https://finance.yahoo.com/quote/${commodity.yahoo}`} target="_blank" className="font-mono text-[0.65rem] text-blue-400 hover:underline">Yahoo Finance: {commodity.symbol} ↗</a></li>
                  <li><a href={`/${commodity.slug}/`} className="font-mono text-[0.65rem] text-forge-orange hover:underline">Full Dashboard: /{commodity.slug}/ ↗</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
