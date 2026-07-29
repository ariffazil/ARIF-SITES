import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuoteCard } from '@/components/QuoteCard';

const sections = [
  {
    id: 'tectonic',
    title: '1. Tectonic Evolution',
    content: [
      { heading: 'Regional Setting', text: 'The Kinabalu Basin occupies the NW Borneo margin at the junction of four plates: Eurasian, Indo-Australian, Pacific, and Philippine Sea. Three marginal basins surround it: the South China Sea (west), Sulu Sea (northeast), and Celebes Sea (east). This complex plate boundary setting produced a multi-phase tectonic history spanning from Eocene subduction through Miocene collision to ongoing Pliocene-Recent transpression.' },
      { heading: 'Phase 1 — Eocene-Oligocene: Proto-SCS Subduction (55–23 Ma)', text: 'Subduction of the proto-South China Sea plate beneath NW Borneo. Deep marine turbidites deposited in the Crocker Basin (Rajang-Crocker Group), now the accretionary prism forming Sabah\'s structural backbone. Formations: East Crocker, West Crocker, Trusmadi, Sapulut.' },
      { heading: 'Phase 2 — Late Eocene: Sarawak Orogeny (~40 Ma)', text: 'Collision-driven uplift. West Crocker Formation receives detritus from eroded Rajang Group. Deep marine sedimentation ceases.' },
      { heading: 'Phase 3 — Late Oligocene-Early Miocene: Forearc & Melange (25–20 Ma)', text: 'Forearc basin deposition: Labang and Kulapis formations (deepwater clastics with syn-depositional growth faults). Widespread melange development (Kuamut, Garinono, Ayer) — tectonic blocks in sheared shale matrix.' },
      { heading: 'Phase 4 — 22–20 Ma: Sabah Orogeny — Base Miocene Unconformity', text: 'Collision of the Dangerous Grounds continental block with NW Borneo. Major uplift and erosion. The Base Miocene Unconformity (BMU) separates deformed deep-marine strata below from shallow deltaic deposits above. This is the fundamental stratigraphic boundary in Sabah geology.' },
      { heading: 'Phase 5 — 18–12 Ma: Sulu Sea Rifting & Delta Progradation', text: 'NW-SE rifting of the Sulu Sea in a back-arc setting. Regional extension rejuvenated the Central Sabah Basin. Vast delta systems prograded eastward: Tanjong, Meligan, Kudat formations. Cumulative thickness >6,000 m. Sediment sourced from the uplifted Rajang-Crocker highlands. All Neogene "circular basins" were part of a single NE-SW trending shallow basin.' },
      { heading: 'Phase 6 — 15.5 Ma: Middle Miocene Unconformity (DRU)', text: 'Cagayan Arc-Palawan collision. Extension halted, inversion begins. The Deep Regional Unconformity (DRU) marks the MMU in offshore Sabah.' },
      { heading: 'Phase 7 — 12–5 Ma: Post-Collision Delta Systems', text: 'Champion and Kapilit deltas prograded following the same pattern as Meligan-Tanjong. Stage IVC-IVG cycles deposited in offshore NW Sabah — the main hydrocarbon-bearing units of the Kinabalu Field.' },
      { heading: 'Phase 8 — ~10–8 Ma: Mount Kinabalu Granite Emplacement', text: 'The Kinabalu granodiorite pluton intruded the Crocker Range. Contributed to regional uplift, sediment supply, and thermal maturation of source rocks. Today stands as SE Asia\'s highest peak at 4,095 m.' },
      { heading: 'Phase 9 — 8.6 Ma–Present: Meliau Orogeny & Transpression', text: 'The Shallow Regional Unconformity (SRU) at 8.6 Ma marks major folding and uplift driven by strike-slip and transpressional faulting. All Miocene outliers in central Sabah owe their current outcrop pattern to this deformation. Transpression propagated from Sulawesi, causing inversion and the final structural architecture of the basin. Ongoing seismicity (2015 Mw 6.0 Kinabalu earthquake).' },
    ]
  },
  {
    id: 'stratigraphy',
    title: '2. Stratigraphy',
    content: [
      { heading: 'Basement', text: 'Ophiolite complex of probable Late Cretaceous age. Includes ultramafic rocks, serpentinite, and metamorphic rocks of basic protolith. The presence of limited granite suggests arc plutonic rocks intruded into older ophiolitic basement.' },
      { heading: 'Rajang-Crocker Group (Late Cretaceous–Eocene)', text: 'Deep marine turbidites. Thickness >5,000 m. Highly deformed with tight isoclinal folds and thrusts. Forms the accretionary prism of the proto-SCS subduction system.' },
      { heading: 'Labang & Kulapis Formations (Late Eocene–Oligocene)', text: 'Deep-water clastics deposited in a forearc basin setting. Abundant syn-depositional extensional faults suggesting active growth faulting during subsidence.' },
      { heading: 'Kuamut/Garinono/Ayer Mélange (Early Miocene ~22–20 Ma)', text: 'Sheared matrix with blocks of sandstone, limestone, chert, basalt. Formed during the Sabah Orogeny collision event. Lies below the BMU.' },
      { heading: 'Gomantong Limestone (Early Miocene Burdigalian)', text: 'Carbonate build-up on structural highs. Contains clasts of Labang Formation, proving uplift started by 22–20 Ma. Stretches 200 km ENE-WSW across eastern Sabah.' },
      { heading: 'Tanjong/Meligan/Kudat Formations (18–12 Ma)', text: 'Deltaic to shallow marine. Coarsening-upward cycles. Thickness up to 6,000 m. Fill the "circular basins" of Sabah.' },
      { heading: 'Stage IV Series (12–5 Ma)', text: 'KEY RESERVOIR UNIT. Four main cycles:\n• Stage IVC — Coastal progradation, mouthbar sands\n• Stage IVD — Shoal complexes, stacked coarsening-upward\n• Stage IVE — Gradual transgression, shore-parallel sand transport\n• Stage IVF — Widespread marine transgression, laterally extensive sand sheets\n• Stage IVG — Shallowing, coastal sand bodies'},
    ]
  },
  {
    id: 'kinabalu-field',
    title: '3. Kinabalu Field',
    content: [
      { heading: 'Discovery & Overview', text: 'Discovered in 1989 by well KN-1 (1,043 ft net oil sand, 113 ft net gas sand). Located 55 km WNW of Labuan Island in ~54 m water depth. Total oil-in-place ~500 MMstb. Field onstream December 1997, peak production 48,000 bpd. Cumulative production ~50 MMbbl by 2003.' },
      { heading: 'Three Accumulations', text: 'Kinabalu Main — oil in 30+ sandstone reservoirs (F, J, K, L, M, O). "Normally pressured", long hydrocarbon columns. Kinabalu Deep — condensate-rich gas with 250 ft oil rim, mild geopressure (1,000 psi over). Separated from Main by 1,700 ft water-bearing section. Kinabalu East — gas-dominant with two thin oil rims.' },
      { heading: 'Trap', text: 'Dip-closure against the SW-NE trending Kinabalu Growth Fault. Structural dip ~8° WNW. Spill point to northeast controlled by flexure. Small sub-seismic faults within the Main block.' },
      { heading: 'Reservoir (L Sand)', text: 'Four genetic sequences: (1) Shoal complexes — 10–55 ft thick, coarsening-upward, por 20–23%, perm 300–630 mD. BEST RESERVOIR. (2) Intershoal sands — <5 ft, por 22%, perm 480 mD. (3) Distal shelf — heterolithics, por 10%, perm 13 mD. (4) Shelf/transgressive muds — seals. Lithofacies: poorly stratified sandstone (best), laminated sandstone, bioturbated sandstone (poor).' },
      { heading: 'Production & Water Injection', text: 'Rapid pressure decline (~900 psi in first year) revealed weak/no aquifer drive. Gas injection for K2 reservoir (gas cap present, existing wells). Water injection for L2 reservoir — innovative source from shallow B & C aquifer sands (213 billion bbl and 69 billion bbl water-in-place). Two horizontal injectors (KN-112, KN-119) gravity-dump at ~1,200 bpd. ESP planned for 20,000 bpd. Recovery factor improved from 21% to 43% (+16 MMbbl).' },
    ]
  },
  {
    id: 'fields',
    title: '4. Other Fields & Recent Discoveries',
    content: [
      { heading: 'Samarang', text: 'Adjacent to Kinabalu. Oil and gas. Shared pipeline infrastructure via Samarang complex to Labuan Crude Oil Terminal.' },
      { heading: 'Kebabangan', text: 'Gas field 100 km west of Kota Kinabalu. Platform receives Malikai tieback. Pipeline to Sabah Oil and Gas Terminal.' },
      { heading: 'Sumandak', text: 'Discovered 2001 (Sumandak-1). Cluster of 7+ wells in Samarang-Asam Paya PSC. Stage IVC play.' },
      { heading: 'Malikai', text: 'Deepwater oil development. Tieback to Kebabangan platform.' },
      { heading: 'Zoisit Deep-1', text: 'Recent discovery confirming continued potential in the mature Kinabalu Basin.' },
      { heading: 'Well A & Well B (2025–26)', text: 'Well A proved oil in deeper stratigraphic intervals beneath known gas accumulations — mixed oil-gas reservoirs. Changed the perception of the basin from gas-dominant to oil-prone. Well B used reprocessed seismic to identify multiple deeper targets across varied play types. Published at EAGE 2026.' },
    ]
  },
  {
    id: 'petroleum-system',
    title: '5. Petroleum System',
    content: [
      { heading: 'Source Rock', text: 'Not directly penetrated by any well. Inferred from geochemistry: Type III and Type II/III organic matter (deltaic). Depth >3,200 m. Maturity Ro 0.7–0.8%. Hydrocarbon generation from Late Miocene–Early Pliocene, continuing today.' },
      { heading: 'Reservoir', text: 'Primary: Post-MMU Stage IV clastic plays. Channel, mouthbar, and shoal complex sands. Por 20–30%, perm up to 630 mD. Secondary: Pre-MMU Oligocene syn-rift clastics and carbonates (emerging play, proven in Layang-Layang Basin).' },
      { heading: 'Seal', text: 'Intra-formational marine shales (10–50 ft thick). Transgressive shales of Stage IVF and IVG act as regional seals. Fault sealing confirmed by seismic amplitude brightening.' },
      { heading: 'Trap', text: 'Structural traps dominant: fault-dependent dip closures against growth faults. Syn-kinematic anticlines in fold-thrust belt. Stratigraphic traps underexplored.' },
      { heading: 'Timing', text: 'Critical risk: trap formation vs. migration timing. Pliocene inversion can breach older traps. Generation started Late Miocene, peaked Pliocene.' },
    ]
  },
  {
    id: 'comparison',
    title: '6. Kinabalu vs. Layang-Layang Basins',
    content: [
      { heading: 'Inboard vs. Outboard', text: 'Kinabalu Basin = inboard fold-thrust belt. Post-MMU Stage IV clastic play. Hydrocarbon-producing (mature). Water depths shallow to ~1,000 m. Layang-Layang Basin = outboard Oligocene syn-rift system. Pre-MMU carbonate and clastic plays. Frontier status. Tepat-1 discovery proved working system. Deepwater >1,000 m. Prospect Ayam Hutan estimated ~7 TCF P50 gas.' },
    ]
  },
];

export function KinabaluBasin() {
  useEffect(() => {
    document.title = 'Kinabalu Basin — Subsurface Dossier | Arif Fazil';
    document.querySelector('link[rel=canonical]')?.setAttribute('href','https://arif-fazil.com/earth/kinabalu-basin');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── HERO ── */}
      <section className="py-24 border-b-2 border-forge-iron bg-[#060d1a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" 
             style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 80% 30%, #0369a1 0%, transparent 50%)'}} />
        <div className="site-frame relative z-10">
          <div className="section-label">Subsurface · Φ GEOX · Basin Intelligence</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mt-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
                Kinabalu<br />Basin
              </h1>
              <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-4">
                Offshore NW Sabah, Malaysia · Producing Hydrocarbon Basin
              </p>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                A comprehensive geological dossier spanning tectonic evolution, 
                stratigraphy, petroleum systems, and field-scale reservoir geology.
              </p>
            </div>
            <div className="hidden lg:block">
              <QuoteCard
                topic="The Sabah Margin"
                quote="The diverse structural trends and depositional framework of Sabah were developed by several regional tectonic events since the early Tertiary. At least three major episodes were linked to NW-SE compression coinciding with ongoing subduction of the proto-South China Sea."
                author="Balaguru & Hall"
                source="Search and Discovery #30084 (2009)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CROSS-SECTION ── */}
      <section className="py-16 bg-forge-steel border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">Regional Geology · NW–SE Transect</div>
          <h2 className="text-3xl font-black uppercase italic mb-8">Cross-Section: Dangerous Grounds → Sulu Sea</h2>
          <div className="brutalist-card overflow-hidden">
            <iframe 
              src="/earth/kinabalu-cross-section.html" 
              className="w-full" 
              style={{ height: '780px', border: 'none' }}
              title="Kinabalu Basin Regional Cross-Section"
              loading="lazy"
            />
          </div>
          <p className="font-technical text-[0.6rem] text-forge-dim mt-4">
            Schematic geological cross-section. Vertical exaggeration ~5×. 
            Sources: Balaguru & Hall (2009), Balaguru et al. (2003), Bait (2003), Madon & Jong (2022), PETRONAS MPM (2025).
          </p>
        </div>
      </section>

      {/* ── DOSSIER CONTENT ── */}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="py-16 border-b border-forge-iron">
          <div className="site-frame">
            <div className="section-label">{section.id === 'tectonic' ? 'Basin Dossier' : ''}</div>
            <h2 className="text-4xl font-black uppercase italic mb-12">{section.title}</h2>
            <div className="space-y-8">
              {section.content.map((item, i) => (
                <motion.div
                  key={i}
                  whileInView={{ x: [10, 0], opacity: [0, 1] }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                  <div className="lg:col-span-1">
                    <span className="w-2 h-2 bg-forge-orange block mb-2"></span>
                    <h3 className="font-technical text-sm uppercase tracking-wider text-forge-white">{item.heading}</h3>
                  </div>
                  <div className="lg:col-span-3">
                    <p className="font-body text-forge-dim leading-relaxed whitespace-pre-line text-sm">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── PDF DOWNLOAD ── */}
      <section className="py-16 bg-forge-steel border-t-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-technical text-forge-dim uppercase tracking-widest mb-4">Download the Full Dossier</p>
          <h2 className="text-3xl font-black uppercase italic mb-8">Kinabalu Basin — Complete Reference</h2>
          <p className="font-body text-forge-dim text-sm max-w-2xl mx-auto mb-8">
            A 10-section geological dossier covering tectonic evolution, stratigraphy, 
            the Kinabalu Field, petroleum systems, cross-section, and exploration outlook.
          </p>
          <a href="/earth/kinabalu-basin.pdf" className="button-forge button-forge--accent inline-block">
            Download PDF Dossier →
          </a>
          <p className="font-technical text-[0.6rem] text-forge-dim mt-4">
            PDF includes full stratigraphic chart, field data tables, and references · 20pp
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-forge-black border-t-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-technical text-forge-dim uppercase tracking-widest mb-4">Earth Intelligence at Scale</p>
          <h2 className="text-4xl font-black uppercase italic mb-8">Explore the GEOX Surface.</h2>
          <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge button-forge--accent">
            Launch GEOX Surface ↗
          </a>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "kinabalu-basin",
  routeUrl: "/earth/kinabalu-basin/",
};

export default KinabaluBasin;
