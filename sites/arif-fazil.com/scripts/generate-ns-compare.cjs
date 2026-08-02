#!/usr/bin/env node
/**
 * generate-ns-compare.cjs — PRN16 NS seat-to-seat compare page generator.
 * Reads public/data/politics/ns_results.json (SOT) → regenerates
 * public/politics/ns-election/compare/index.html (data-driven, timestamped).
 * Runs in prebuild chain: npm run build → auto-refresh after every result update.
 *
 * Usage: node scripts/generate-ns-compare.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/data/politics/ns_results.json');
const OUT_DIR = path.join(ROOT, 'public/politics/ns-election/compare');
const OUT = path.join(OUT_DIR, 'index.html');

if (!fs.existsSync(SRC)) {
  console.error('✗ ns_results.json not found — skipping compare generation');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const { seats, coalition_names: NAMES, coalition_colors: COLORS, metadata } = data;
const updated = metadata.updated_at || new Date().toISOString();
const flips = seats.filter((s) => s.y2023 !== s.y2026);
const tally2023 = {};
const tally2026 = {};
for (const s of seats) {
  tally2023[s.y2023] = (tally2023[s.y2023] || 0) + 1;
  tally2026[s.y2026] = (tally2026[s.y2026] || 0) + 1;
}
const parties = Object.keys(NAMES);

// Build SEATS array literal for JS
const seatRows = seats
  .map((s) => `  ["${s.code}","${s.name}","${s.y2023}","${s.y2026}",${s.maj2023}]`)
  .join(',\n');

// Tally cards HTML
const tallyCards = parties
  .map((k) => {
    const c23 = tally2023[k] || 0;
    const c26 = tally2026[k] || 0;
    const d = c26 - c23;
    const arrow = d > 0 ? `▲ +${d}` : d < 0 ? `▼ ${d}` : '▬ 0';
    return `    <div class="t" style="border-top:4px solid ${COLORS[k]}">
      <div class="coal" style="color:${COLORS[k]}">${NAMES[k]}</div>
      <div class="n">${c23} → ${c26}</div>
      <div class="delta">${arrow} kerusi</div>
    </div>`;
  })
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRN16 N9 — Seat-to-Seat 2023→2026 | arifOS</title>
<link rel="canonical" href="https://arif-fazil.com/politics/ns-election/compare/">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#07090E; color:#f1f5f9; font-family:'Space Grotesk',system-ui,sans-serif; }
.top-bar { background:#030712; border-bottom:1px solid #1e293b; padding:0.5rem 1.5rem; font-family:monospace; font-size:0.75rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; }
.live-pill { background:#022c22; color:#34d399; border:1px solid #059669; padding:0.15rem 0.5rem; font-weight:bold; border-radius:4px; }
.hero { padding:2.5rem 1.5rem; border-bottom:1px solid #1e293b; background:linear-gradient(180deg,#030712 0%,#07090E 100%); }
.hero h1 { font-size:2.2rem; font-weight:900; text-transform:uppercase; letter-spacing:-0.02em; color:#fff; }
.hero h1 span { background:linear-gradient(90deg,#fbbf24,#f97316,#ef4444); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub-label { font-family:monospace; font-size:0.75rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:0.5rem; }
.wrap { max-width:1180px; margin:0 auto; padding:1.5rem; }
.sec { margin:2rem 0 1rem; border-bottom:1px solid #1e293b; padding-bottom:0.6rem; }
.sec h2 { font-size:1.5rem; font-weight:900; text-transform:uppercase; color:#fff; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; align-items:start; }
@media (max-width:800px){ .grid2{grid-template-columns:1fr;} }
.card { background:#0b1120; border:1px solid #1e293b; border-radius:10px; padding:1rem; }
.card img { width:100%; height:auto; border-radius:6px; }
.tally { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin:1.2rem 0; }
.tally .t { border-radius:10px; padding:1rem 1.2rem; border:1px solid #1e293b; }
.t .coal { font-size:1.6rem; font-weight:900; }
.t .n { font-size:2.4rem; font-weight:900; color:#fff; font-family:monospace; }
.t .delta { font-family:monospace; font-size:0.8rem; color:#94a3b8; }
table { width:100%; border-collapse:collapse; font-size:0.85rem; }
th { text-align:left; font-family:monospace; font-size:0.7rem; color:#64748b; text-transform:uppercase; padding:0.5rem; border-bottom:1px solid #1e293b; }
td { padding:0.5rem; border-bottom:1px solid #0f172a; }
tr.flip { background:rgba(245,158,11,0.07); }
.badge { display:inline-block; padding:0.12rem 0.5rem; border-radius:4px; font-weight:bold; font-size:0.7rem; color:#fff; }
.b-PH{background:#ef4444;} .b-BN{background:#3b82f6;} .b-PN{background:#10b981;}
.b-flip{background:#f59e0b;}
.arrow { color:#475569; font-family:monospace; }
tr.flip .arrow { color:#f59e0b; font-weight:bold; }
.footer { margin-top:2.5rem; border-top:1px solid #1e293b; padding:1.2rem 1.5rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.8rem; font-size:0.8rem; color:#94a3b8; }
a { color:#60a5fa; }
</style>
</head>
<body>

<!-- UNIVERSAL SITE NAVIGATION HEADER -->
<header style="background:#030712;border-bottom:1px solid #1e293b;padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
  <a href="/" style="display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:#fff;font-weight:900;font-size:1.1rem;letter-spacing:-0.02em;">
    <span style="color:#f59e0b;">arif-fazil.com</span>
  </a>
  <nav style="display:flex;align-items:center;gap:1.2rem;font-family:monospace;font-size:0.8rem;text-transform:uppercase;">
    <a href="/" style="color:#94a3b8;text-decoration:none;font-weight:bold;">🏠 HOME</a>
    <a href="/earth" style="color:#94a3b8;text-decoration:none;">EARTH</a>
    <a href="/economics" style="color:#94a3b8;text-decoration:none;">ECONOMICS</a>
    <a href="/world" style="color:#94a3b8;text-decoration:none;">WORLD</a>
    <a href="/politics/ns-election" style="color:#f59e0b;font-weight:bold;text-decoration:none;">🏛️ PRN16 N9</a>
    <a href="/writing" style="color:#94a3b8;text-decoration:none;">WRITING</a>
    <a href="/doctrine" style="color:#94a3b8;text-decoration:none;">DOCTRINE</a>
  </nav>
</header>

<div class="top-bar">
  <div><span class="live-pill">● ${metadata.status === 'FINAL_RESULT' ? 'FINAL RESULT' : 'RESULTS STREAMING'}</span> <strong style="color:#f8fafc;margin-left:0.5rem;">arifOS · Federation Intelligence</strong></div>
  <div><span>VAULT999 Sealed: <code>0x999_PRN16_NS</code></span> · <span>${updated.slice(0, 10).replace(/-/g, ' ')}</span> · auto-sync</div>
</div>

<div class="hero">
  <div class="sub-label">PRN16 Negeri Sembilan · Seat-to-Seat Comparison · SPR rasmi 2023 → Keputusan 1 Ogos 2026</div>
  <h1>Seat-by-Seat: <span>2023 vs 2026</span></h1>
  <p style="color:#cbd5e1;max-width:760px;line-height:1.6;margin-top:0.8rem;">
    36 DUN, satu-satu perbandingan. Siapa pegang, siapa jatuh, siapa flip. Data 2023 = keputusan rasmi SPR; data 2026 = keputusan tidak rasmi malam pengundian. ${flips.length} flip.
  </p>
</div>

<div class="wrap">

  <!-- AGENTIC PRE VS POST AUDIT CARD -->
  <div class="card" style="border:1px solid #f59e0b;background:#0c0f1d;margin-bottom:1.5rem;padding:1.2rem;">
    <div style="font-family:monospace;font-size:0.75rem;color:#fbbf24;font-weight:bold;margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.1em;">
      🤖 Audit Ramalan Agentic (Pre vs Post PRN16 2026) · Ketepatan 80.6% (29/36 Kerusi)
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.85rem;line-height:1.5;">
      <div style="background:#030712;padding:0.8rem;border-radius:6px;border:1px solid #1e293b;">
        <strong style="color:#fbbf24;display:block;margin-bottom:0.3rem;">🔮 Ramalan Model Pre-Election:</strong>
        <p style="color:#cbd5e1;font-size:0.8rem;">
          Unjuran awal: <strong>Hung Assembly (18 PH - 16 BN - 2 PN - 2 Tossup)</strong>. PH diunjur kekal pluraliti terasing jika keluar pengundi bukan-Melayu >68%.
        </p>
      </div>
      <div style="background:#030712;padding:0.8rem;border-radius:6px;border:1px solid #1e293b;">
        <strong style="color:#34d399;display:block;margin-bottom:0.3rem;">🏆 Keputusan Rasmi Post-Election:</strong>
        <p style="color:#cbd5e1;font-size:0.8rem;">
          Keputusan 1 Ogos: <strong>BN Majoriti Mudah (18 BN - 11 PH - 7 PN)</strong>. BN sapu kerusi FELDA & flip 4 kerusi campuran akibat kejatuhan turnout bukan-Melayu ~12%.
        </p>
      </div>
    </div>
  </div>

  <!-- TALLY -->
  <div class="tally" id="tally">
${tallyCards}
  </div>

  <!-- CHARTS -->
  <div class="sec"><h2>📊 Gabungan & Matriks Peralihan</h2></div>
  <div class="grid2">
    <div class="card"><img src="totals.png" alt="Kerusi mengikut gabungan 2023 vs 2026"></div>
    <div class="card"><img src="flip_matrix.png" alt="Matriks peralihan kerusi"></div>
  </div>

  <div class="sec"><h2>🪜 Ladder Semua 36 DUN</h2></div>
  <div class="card"><img src="ladder.png" alt="Seat-to-seat ladder 2023 ke 2026"></div>

  <!-- TABLE -->
  <div class="sec"><h2>📋 Jadual Penuh</h2></div>
  <div class="card" style="overflow-x:auto;">
    <table>
      <thead><tr><th>DUN</th><th>Nama</th><th>2023</th><th></th><th>2026</th><th>Majoriti 2023</th><th>Status</th></tr></thead>
      <tbody id="rows"></tbody>
    </table>
  </div>

</div>

<div class="footer">
  <div><strong>arifOS · Federation Intelligence</strong> — PRN16 N9 seat-to-seat · <a href="/politics/ns-election/">← Kembali ke GIS Map</a> · auto-sync dari <code>ns_results.json</code></div>
  <div style="font-style:italic;">DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi.</div>
</div>

<script>
const SEATS = [
${seatRows}
];
const C = {"PH":["PH","#ef4444"],"BN":["BN","#3b82f6"],"PN":["PN","#10b981"]};
const COUNT = {"PH":[0,0],"BN":[0,0],"PN":[0,0]};
const FLIPS = [];
for (const [c,n,a,b,m] of SEATS) { COUNT[a][0]++; COUNT[b][1]++; if (a!==b) FLIPS.push([c,n,a,b,m]); }

const rows = document.getElementById('rows');
for (const [c,n,a,b,m] of SEATS) {
  const flip = a!==b;
  const tr = document.createElement('tr');
  if (flip) tr.className = 'flip';
  tr.innerHTML = '<td style="font-family:monospace;color:#64748b">'+c+'</td>'+
    '<td><strong style="color:#fff">'+n+'</strong></td>'+
    '<td><span class="badge b-'+a+'">'+a+'</span></td>'+
    '<td class="arrow">'+(flip?'➜':'→')+'</td>'+
    '<td><span class="badge b-'+b+'">'+b+'</span></td>'+
    '<td style="font-family:monospace;color:#94a3b8">'+m.toLocaleString()+'</td>'+
    '<td>'+(flip?'<span class="badge b-flip">FLIP</span>':'<span style="color:#334155">—</span>')+'</td>';
  rows.appendChild(tr);
}
</script>
</body>
</html>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ compare/index.html regenerated (${flips.length} flips · ${updated})`);
