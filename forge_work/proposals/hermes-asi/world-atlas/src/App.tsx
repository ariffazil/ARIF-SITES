import { useState, useEffect, useMemo } from 'react';
import { WorldMap } from './components/WorldMap';
import { NewsRail } from './components/NewsRail';
import { Dossier } from './components/Dossier';
import { SOTStrip } from './components/SOTStrip';
import { useCountries, findCountry } from './hooks/useCountries';
import { useGDELT } from './hooks/useGDELT';
import { computeSOT, axisSymbol } from './lib/sot';
import type { Axis } from './lib/types';

export function App() {
  const countries = useCountries();
  const [activeAxis, setActiveAxis] = useState<Axis | null>(null);
  const [selectedCca3, setSelectedCca3] = useState<string | null>(null);
  const [tab, setTab] = useState<'news' | 'dossier'>('news');
  const [now, setNow] = useState(new Date());

  const { articles, loading, error, lastUpdated } = useGDELT(activeAxis);
  const sot = useMemo(() => computeSOT(articles), [articles]);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const utc = now.toISOString().slice(11, 19);

  const selectedCountry = selectedCca3 ? findCountry(selectedCca3) ?? null : null;

  return (
    <div className="atlas-shell">
      <header className="atlas-header">
        <div className="mark">
          <strong>arifOS / ATLAS</strong>
          <span>·</span>
          <span>STATE OF THE WORLD</span>
        </div>
        <div className="title">
          <span className="accent">WORLD</span>
          <span className="sub">Δ Geopolitics · Ω Economics · Ψ Social</span>
        </div>
        <div className="clock">
          <div className="utc">{utc} UTC</div>
          <div style={{ marginTop: 2 }}>
            {now.toISOString().slice(0, 10)} ·
            <span style={{ color: 'var(--atlas-gold)' }}> SOT {sot.aggregate}</span>
          </div>
        </div>
      </header>

      <SOTStrip sot={sot} />

      <main className="atlas-main">
        <WorldMap
          countries={countries}
          articles={articles}
          activeAxis={activeAxis}
          onCountryClick={(cca3) => {
            setSelectedCca3(cca3);
            setTab('dossier');
          }}
          selectedCca3={selectedCca3}
        />

        <aside className="side-rail">
          <div className="rail-tabs">
            <button
              data-active={tab === 'news'}
              onClick={() => setTab('news')}
            >
              NEWS · {articles.length}
            </button>
            <button
              data-active={tab === 'dossier'}
              onClick={() => setTab('dossier')}
            >
              DOSSIER
            </button>
          </div>
          <div className="axis-toggle" style={{ position: 'relative', background: 'var(--atlas-bg)', borderBottom: '1px solid var(--atlas-border-subtle)', borderRadius: 0 }}>
            <button
              data-active={activeAxis === null}
              onClick={() => setActiveAxis(null)}
            >
              ALL
            </button>
            <button
              data-active={activeAxis === 'geo'}
              data-axis="geo"
              onClick={() => setActiveAxis('geo')}
            >
              {axisSymbol('geo')} GEO
            </button>
            <button
              data-active={activeAxis === 'econ'}
              data-axis="econ"
              onClick={() => setActiveAxis('econ')}
            >
              {axisSymbol('econ')} ECON
            </button>
            <button
              data-active={activeAxis === 'soc'}
              data-axis="soc"
              onClick={() => setActiveAxis('soc')}
            >
              {axisSymbol('soc')} SOC
            </button>
          </div>
          <div className="rail-content">
            {tab === 'news' ? (
              <NewsRail
                articles={articles}
                loading={loading}
                error={error}
                activeAxis={activeAxis}
              />
            ) : (
              <Dossier country={selectedCountry} />
            )}
          </div>
        </aside>
      </main>

      <footer className="atlas-footer">
        <div className="links">
          <a href="/">Home</a>
          <a href="/earth">Earth</a>
          <a href="/economics">Economics</a>
          <a href="/writing">Writing</a>
          <a href="/doctrine">Doctrine</a>
          <a href="/missions">Missions</a>
          <a href="/world/makcikgpt/">MakcikGPT</a>
          <a href="/oil/">Oil</a>
          <a href="/gas/">Gas</a>
          <a href="/gold/">Gold</a>
          <a href="/klci/">KLCI</a>
          <a href="/usdmyr/">USD/MYR</a>
          <a href="/politics/">Politics</a>
        </div>
        <div className="doctrine">
          DITEMPA BUKAN DIBERI · {loading ? 'FETCHING' : 'LIVE'} · last {lastUpdated ? new Date(lastUpdated).toUTCString().slice(17, 22) : '—'} UTC
        </div>
      </footer>
    </div>
  );
}
