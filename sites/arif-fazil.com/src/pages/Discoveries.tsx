import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { discoveries } from '@/data/discoveries';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';

const discoveriesTools = [
  {
    name: 'get_discoveries_data',
    description: 'Get details of discoveries made offshore Malaysia (Bekantan-1, Lebah Emas-1, Bunga Tasbih-1, Puteri Basement-1, etc.) including stratigraphic details, play types, and structural interpretations',
    execute() {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(discoveries, null, 2)
        }]
      };
    }
  }
];

export function Discoveries() {
  useWebMCP(discoveriesTools);
  useEffect(() => {
    document.title = 'Subsurface Discoveries — Arif Fazil | arifOS';
    document.querySelector('link[rel=canonical]')?.setAttribute('href','https://arif-fazil.com/earth');
  }, []);
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Subsurface · Φ GEOX · Evidence</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
                The<br />Discoveries
              </h1>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                Wells I signed off on. Each one material, each one irreversible.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="A Pale Blue Dot"
                quote="Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives... on a mote of dust suspended in a sunbeam."
                author="Carl Sagan"
                source="Pale Blue Dot (1994)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIST ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="site-frame">
          <div className="space-y-12">
            {discoveries.map((d) => (
              <motion.div 
                key={d.id}
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="brutalist-card group"
              >
                <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                  {/* Left: Metadata */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-technical text-2xl font-black text-forge-orange">{d.year}</span>
                      <span className="w-full h-[1px] bg-forge-iron"></span>
                    </div>
                    <h2 className="text-3xl font-black uppercase italic mb-2 group-hover:text-forge-orange transition-colors tracking-tight">
                      {d.title}
                    </h2>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-6">
                      {d.location}
                    </p>
                    
                    {d.link && (
                      <a 
                        href={d.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="button-forge text-[0.7rem] py-2 px-4"
                      >
                        {d.linkLabel || 'View Dataset →'}
                      </a>
                    )}
                  </div>

                  {/* Middle: Summary */}
                  <div className="lg:w-1/3">
                    <div className="section-label !mb-4">Operational Summary</div>
                    <p className="font-body text-forge-dim leading-relaxed">
                      {d.summary}
                    </p>
                  </div>

                  {/* Right: Evidence */}
                  <div className="lg:w-1/3 bg-forge-steel p-6 border-l-2 border-forge-orange">
                    <div className="section-label !mb-4 text-forge-orange">Verification Evidence</div>
                    <ul className="space-y-4">
                      {d.evidence.map((e, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-1 h-1 bg-forge-orange mt-1.5 shrink-0"></span>
                          <span className="font-technical text-[0.7rem] uppercase leading-tight text-forge-white">
                            {e}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BASIN DOSSIER ──────────────────────────────────── */}
      <section className="py-16 border-b border-forge-iron">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label !mb-4">Basin Intelligence · Kinabalu</div>
              <h2 className="text-4xl font-black uppercase italic mb-6 leading-[0.9]">
                Kinabalu<br />Basin Dossier
              </h2>
              <p className="font-body text-forge-dim leading-relaxed mb-6">
                Full geological dossier on the Kinabalu Basin — offshore NW Sabah's 
                producing hydrocarbon province. Tectonic evolution, stratigraphy, 
                the Kinabalu Field (500 MMbbl), petroleum systems, and a regional 
                cross-section from the Dangerous Grounds to the Sulu Sea.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/earth/kinabalu-basin/" className="button-forge">
                  Read the Dossier →
                </a>
                <a href="/earth/kinabalu-basin.pdf" className="button-forge text-[0.7rem] py-2 px-4">
                  Download PDF ↓
                </a>
              </div>
            </div>
            <div className="bg-forge-steel p-6 rounded border border-forge-iron">
              <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest mb-3">Cross-Section</div>
              <p className="font-technical text-[0.7rem] leading-relaxed text-forge-white">
                NW–SE transect: Dangerous Grounds → Layang-Layang Basin → Sabah Trough → 
                Kinabalu Basin → Crocker Range → Mt Kinabalu → Central Sabah → 
                Sandakan Basin → Sulu Sea
              </p>
              <div className="mt-3 flex gap-2 text-[0.55rem] text-forge-dim">
                <span className="bg-forge-black px-2 py-1 rounded">SRTM Topography</span>
                <span className="bg-forge-black px-2 py-1 rounded">Published Geology</span>
                <span className="bg-forge-black px-2 py-1 rounded">8 Sources</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-24 bg-forge-steel border-y-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-technical text-forge-dim uppercase tracking-widest mb-4">Explore the Full Engine</p>
          <h2 className="text-4xl font-black uppercase italic mb-8">Earth Intelligence at Scale.</h2>
          <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge button-forge--accent">
            Launch GEOX Surface ↗
          </a>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "discoveries",
  routeUrl: "/discoveries/",
};

export default Discoveries;
