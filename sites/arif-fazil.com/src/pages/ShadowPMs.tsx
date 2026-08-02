import { motion } from 'framer-motion';
import { SHADOW_PMS, type ShadowPM } from '@/data/shadowPms';

const VERDICT_COLORS: Record<ShadowPM['verdict'], { bg: string; text: string; label: string }> = {
  TERSEDAR:  { bg: 'bg-emerald-900/30', text: 'text-emerald-400', label: 'TERSEDAR — Jumpa Bayang' },
  SAMAR:     { bg: 'bg-amber-900/30',  text: 'text-amber-400',  label: 'SAMAR — Separuh Gelap' },
  TENGGELAM: { bg: 'bg-red-900/30',    text: 'text-red-400',    label: 'TENGGELAM — Bayang Menang' },
};

export function ShadowPMs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">JUNG SHADOW · PSIKOLOGI BAYANG · 9 PERDANA MENTERI</div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter mb-6 text-forge-white">
            PM Bayang
          </h1>
          <p className="font-body text-lg text-forge-dim max-w-2xl leading-relaxed mb-4">
            Setiap Perdana Menteri ada persona — topeng yang ditunjukkan pada dunia.
            Tapi Carl Jung kata: makin cantik topeng kau, makin gelap bayang kau.
            Ini analisis bayang 9 Perdana Menteri Malaysia — dari Tunku ke Anwar.
          </p>
          <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest">
            Δ-ONLY · Bayang = Nyata · Dari Rekod Umum
          </p>
        </div>
      </section>

      {/* LEGEND */}
      <section className="py-8 border-b border-forge-iron">
        <div className="site-frame flex flex-wrap gap-4">
          {Object.entries(VERDICT_COLORS).map(([key, val]) => (
            <div key={key} className={`flex items-center gap-2 ${val.bg} px-3 py-1.5 rounded`}>
              <span className={`w-2 h-2 rounded-full ${val.text.replace('text-', 'bg-')}`} />
              <span className={`font-mono text-[0.65rem] uppercase tracking-wider ${val.text}`}>{val.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PM CARDS */}
      <section className="py-12">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHADOW_PMS.map((pm, idx) => (
              <PMCard key={pm.id} pm={pm} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="py-16 border-t-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-body text-forge-dim text-sm max-w-xl mx-auto leading-relaxed">
            Psikologi bayang bukan tuduhan. Ia cermin. Setiap PM adalah produk sistem yang lebih besar dari mereka.
            Tapi yang tak pernah jumpa bayang sendiri — akan diulangi oleh bayang itu berkali-kali.
          </p>
          <p className="mt-6 font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest">
            Sumber: Rekod Awam · Hansard Parlimen · Arkib Negara · Berita Semasa
          </p>
          <p className="mt-1 font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest">
            DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi
          </p>
        </div>
      </section>
    </motion.div>
  );
}

function PMCard({ pm, index }: { pm: ShadowPM; index: number }) {
  const v = VERDICT_COLORS[pm.verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="brutalist-card border-2 border-forge-iron hover:border-forge-orange transition-colors group"
    >
      {/* Portrait Area */}
      <div className="relative w-full aspect-[3/4] bg-forge-steel overflow-hidden border-b-2 border-forge-iron">
        {pm.portraitUrl ? (
          <img
            src={pm.portraitUrl}
            alt={pm.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-forge-dim p-6">
            <span className="text-5xl mb-2 opacity-20">👤</span>
            <span className="font-mono text-[0.55rem] uppercase tracking-widest text-center">Gambar PM</span>
          </div>
        )}
        {/* Order Badge */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-forge-black/80 border border-forge-iron flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-forge-orange">{pm.order}</span>
        </div>
        {/* Verdict Badge */}
        <div className={`absolute top-3 right-3 ${v.bg} px-2 py-0.5 rounded`}>
          <span className={`font-mono text-[0.55rem] uppercase tracking-wider ${v.text}`}>{pm.verdict}</span>
        </div>
      </div>

      {/* PM Info */}
      <div className="p-5">
        <div className="mb-2">
          <span className="font-mono text-[0.55rem] text-forge-orange uppercase tracking-widest">{pm.title}</span>
          <h2 className="text-xl font-black italic uppercase mt-0.5 text-forge-white leading-tight">{pm.name}</h2>
          <span className="font-mono text-[0.6rem] text-forge-dim">{pm.tenure}</span>
        </div>

        {/* Persona */}
        <div className="mt-4 pt-3 border-t border-forge-iron">
          <span className="font-mono text-[0.5rem] text-forge-orange uppercase tracking-widest">Persona</span>
          <p className="font-body text-sm text-forge-dim leading-relaxed mt-1">{pm.persona}</p>
        </div>

        {/* Bayang */}
        <div className="mt-3 pt-3 border-t border-forge-iron">
          <span className="font-mono text-[0.5rem] text-red-400 uppercase tracking-widest">Bayang</span>
          <p className="font-body text-sm text-forge-dim leading-relaxed mt-1">{pm.bayang}</p>
        </div>

        {/* Tragedy */}
        <div className="mt-3 pt-3 border-t border-forge-iron">
          <span className="font-mono text-[0.5rem] text-amber-400 uppercase tracking-widest">Tragedi</span>
          <p className="font-body text-xs text-forge-dim/70 leading-relaxed mt-1 italic">{pm.tragedy}</p>
        </div>

        {/* Legacy */}
        <div className={`mt-4 p-3 ${v.bg} rounded`}>
          <span className={`font-mono text-[0.5rem] uppercase tracking-widest ${v.text}`}>Legasi</span>
          <p className="font-body text-xs text-forge-dim mt-0.5 leading-relaxed">{pm.legacy}</p>
        </div>
      </div>
    </motion.div>
  );
}
