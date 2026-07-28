import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function PlaybookPage() {
  useEffect(() => {
    document.title = 'Strategi PRN NS 2026 — Agentic Playbook Operasi | arifOS';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#050608] min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-black"
    >
      {/* TOP UNIFIED NAVIGATION HEADER */}
      <div className="bg-slate-950 border-b border-forge-iron py-3 px-4 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            🔞 EYES ONLY · OPERASI
          </span>
          <span className="text-slate-300 font-bold">arifOS · Federation Intelligence · Agentic Playbook</span>
        </div>

        {/* UNIFIED NAV SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1 rounded">
          <Link
            to="/politics/ns-election"
            className="px-3 py-1 rounded text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            🗺️ LIVE GIS MAP
          </Link>
          <span className="px-3 py-1 rounded text-xs font-bold bg-amber-500 text-black">
            📋 OPERATIONAL PLAYBOOK
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-10 border-b border-forge-iron bg-gradient-to-b from-slate-950 to-[#07090E]">
        <div className="site-frame">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
            Strategi PRN Negeri Sembilan 2026 · Field Operations Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-3 tracking-tight">
            8 Swing Seats → <span className="text-amber-400">Formula Kemenangan</span>
          </h1>
          <p className="text-slate-300 font-body text-base max-w-3xl leading-relaxed">
            Disediakan khusus untuk <strong>Izzu & Geng Politik</strong>. Jangan buang tenaga kat 28 kerusi yang dah fixed. Tumpukan semua jentera, poster, WhatsApp blast, dan kenderaan kat 8 kerusi kritikal ini.
          </p>

          {/* METRIC STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 font-mono">
            <div className="p-4 rounded bg-slate-900/80 border border-amber-500/40">
              <div className="text-3xl font-black text-amber-400">8</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Swing Seats Utama</div>
            </div>
            <div className="p-4 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-3xl font-black text-emerald-400">19</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Majoriti Perlu</div>
            </div>
            <div className="p-4 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-3xl font-black text-slate-200">36</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Jumlah DUN</div>
            </div>
            <div className="p-4 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-3xl font-black text-red-400">1 Ogos</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Hari Mengundi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 SWING SEATS FIELD STRATEGY */}
      <section className="py-12 border-b border-forge-iron">
        <div className="site-frame">
          <h2 className="text-2xl font-black italic uppercase text-slate-100 mb-6 flex items-center gap-2">
            🔥 8 Hot Swing Seats — Sasaran Operasi Lapangan
          </h2>

          <div className="space-y-6">
            {/* N32 Linggi */}
            <div className="p-6 rounded-lg border border-red-500/50 bg-slate-950 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2">
                <span className="font-bold text-red-400 text-sm">DUN N32 LINGGI — 🔥 MB vs MB</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">2023 Maj: 1,461 (BN)</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                <strong>Aminuddin Harun (PH) vs BN Incumbent vs Bersatu.</strong> MB Aminuddin tinggalkan Sikamat untuk serang Linggi. Ini pertembungan peribadi. Kalau dia kalah di Linggi, PH Negeri Sembilan hilang kepala.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">💬 Message Felda:</span>
                  <p className="text-slate-300 italic">"Aminuddin janji macam2 masa PH. Apa dapat? Air still putus. Jalan berlubang. 3 tahun cukup. Bagi Tok Ma'mat orang kita."</p>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">💬 Message Anak Muda:</span>
                  <p className="text-slate-300 italic">"Kerja cukup? Harga barang turun? PH cakap nak ubah tapi hampa still susah. Undi protes — undi BN/PN."</p>
                </div>
              </div>
            </div>

            {/* N14 Ampangan */}
            <div className="p-6 rounded-lg border border-amber-500/50 bg-slate-950 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2">
                <span className="font-bold text-amber-400 text-sm">DUN N14 AMPANGAN — ⚠️ Majoriti Paling Kecik (329 Undi)</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">2023 Maj: 329 (PH)</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Pertandingan 3 penjuru. 2023 ada calon bebas (Rafie) ambil 3,079 undi — hampir semua undi protes Melayu. Kalau undi protes tu disalurkan betul, PH serta-merta tumbang.
              </p>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-xs">
                <span className="text-amber-400 font-bold block mb-1">💬 Message Utama Ampangan:</span>
                <p className="text-slate-300 italic">"Kali ni pilih betul-betul. Jangan buang undi kat calon tak menang. Undi protes = undi DAP. Nak hukum PH? Undi BN/PN."</p>
              </div>
            </div>

            {/* N9 Lenggeng */}
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2">
                <span className="font-bold text-slate-200 text-sm">DUN N9 LENGGENG — 🏡 Kawasan Aliff</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">2023 Maj: 685 (BN)</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                UMNO vs PH (AMANAH) vs Bersatu/PAS. 2023 BN menang 50.7% sahaja. Kalau undi Melayu tak berpecah, PH tiada peluang.
              </p>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-xs">
                <span className="text-blue-400 font-bold block mb-1">💬 Message Lenggeng:</span>
                <p className="text-slate-300 italic">"Jangan bagi DAP/PH menang sini. Pastikan undi Melayu tak terbahagi."</p>
              </div>
            </div>

            {/* N25 Paroi & N20 Labu & N31 Bagan Pinang & N5 Serting & N1 Chennah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded border border-emerald-500/40 bg-slate-950">
                <h4 className="font-bold text-emerald-400 text-sm mb-1">DUN N25 PAROI — PAS Defend</h4>
                <p className="text-slate-300 text-[11px] mb-2">2023 Maj: 5,539 (PAS). Bersatu kena elak pecah undi dengan PAS.</p>
                <p className="text-slate-400 italic">"Paroi dah jadi PAS. Jangan bagi PH curi balik."</p>
              </div>

              <div className="p-4 rounded border border-amber-500/40 bg-slate-950">
                <h4 className="font-bold text-amber-400 text-sm mb-1">DUN N20 LABU — 3 Penjuru Bahaya</h4>
                <p className="text-slate-300 text-[11px] mb-2">2023 Maj: 1,640 (Bersatu). Bersatu vs PAS vs PH.</p>
                <p className="text-slate-400 italic">"Bersatu & PAS elak laga sesama sendiri, bagi jalan sapu PH."</p>
              </div>

              <div className="p-4 rounded border border-blue-500/40 bg-slate-950">
                <h4 className="font-bold text-blue-400 text-sm mb-1">DUN N31 BAGAN PINANG — Kem Tentera</h4>
                <p className="text-slate-300 text-[11px] mb-2">2023 Maj: 3,426 (PAS). BN tanding tebus maruah kubu lama.</p>
                <p className="text-slate-400 italic">"Bagan Pinang kubu tradisi. Tarik balik undi pos tentera."</p>
              </div>

              <div className="p-4 rounded border border-red-500/40 bg-slate-950">
                <h4 className="font-bold text-red-400 text-sm mb-1">DUN N1 CHENNAH — Anthony Loke</h4>
                <p className="text-slate-300 text-[11px] mb-2">2023 Maj: 2,200 (DAP). Barometer pengundi Cina & MCA.</p>
                <p className="text-slate-400 italic">"Loke sibuk politik nasional, bagi orang tempatan jaga Chennah."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTER NARRATIVE ENGINE & GOTV CHECKLIST */}
      <section className="py-12 bg-slate-950/80 border-b border-forge-iron">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* COUNTER NARRATIVE */}
            <div>
              <h3 className="text-xl font-black italic uppercase text-amber-400 mb-4">
                📝 Counter-Narrative Siap Guna (WhatsApp / Poster)
              </h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded border border-slate-800 bg-slate-900/60">
                  <span className="text-red-400 font-bold block mb-1">Bila DAP cakap: "BN-PN musnahkan majmuk"</span>
                  <p className="text-slate-300 italic">"BN perintah NS 63 tahun. Cina & India hidup aman. Sekolah Cina & Tamil kekal. DAP cuma guna taktik menakutkan."</p>
                </div>
                <div className="p-4 rounded border border-slate-800 bg-slate-900/60">
                  <span className="text-red-400 font-bold block mb-1">Bila PH cakap: "Kos sara hidup turun"</span>
                  <p className="text-slate-300 italic">"Banding harga barang 2021 vs 2026. Minyak subsidi dipotong, gaji tak naik. Realiti jangan tipu rakyat."</p>
                </div>
              </div>
            </div>

            {/* GOTV CHECKLIST */}
            <div>
              <h3 className="text-xl font-black italic uppercase text-emerald-400 mb-4">
                👥 GOTV Operations Checklist (Hari Mengundi)
              </h3>
              <ul className="space-y-3 font-mono text-xs text-slate-300">
                <li className="p-3 rounded border border-slate-800 bg-slate-900/60 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">☑</span>
                  <span><strong>Petugas Polling Station:</strong> 1 Coordinator per DUN + Group WhatsApp khas.</span>
                </li>
                <li className="p-3 rounded border border-slate-800 bg-slate-900/60 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">☑</span>
                  <span><strong>Pengangkutan Warga Emas:</strong> Sediakan van/kereta seawal 7:30 pagi.</span>
                </li>
                <li className="p-3 rounded border border-slate-800 bg-slate-900/60 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">☑</span>
                  <span><strong>WhatsApp Broadcast Tree:</strong> H-3 Jam. Blast reminder membawa Kad Pengenalan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950 text-xs font-mono text-slate-500">
        <div className="site-frame flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <strong>arifOS · Federation Intelligence</strong> — Field Operations Playbook<br />
            Published on <code>arif-fazil.com/politics/ns-election/playbook/</code>
          </div>
          <div className="text-right italic">
            DITEMPA BUKAN DIBERI — Khusus Untuk Izzu & Geng Politik.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
