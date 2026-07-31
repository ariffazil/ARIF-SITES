#!/usr/bin/env node
/**
 * generate-makcik-index.cjs — MakcikGPT article index (markdown surface)
 *
 * Renders public/makcikgpt-md/index.html from the single source of truth:
 * src/data/essays.json, via scripts/lib/makcik-source.cjs.
 *
 * The /makcikgpt-md/ directory is the "agentic web optimization" surface
 * — its .md siblings are bot-bypass payloads for AI crawlers, and this
 * index.html is the canonical entry that lists every piece in the order
 * they appear in /makcikgpt/.
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   - essays.json → scripts/lib/makcik-source.cjs → makcikgpt-md/index.html
 *
 * Run from site root:  node scripts/generate-makcik-index.cjs
 * Output:              public/makcikgpt-md/index.html
 */

const fs = require("fs");
const path = require("path");
const {
  getMakcikSource,
  SITE_ROOT,
} = require("./lib/makcik-source.cjs");

const OUT_PATH = path.join(SITE_ROOT, "public/makcikgpt-md/index.html");
const SITE_BASE = "https://arif-fazil.com";

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dateParts(iso) {
  const [y, m, d] = iso.split("-");
  return { y, m, d };
}

// Series metadata — single source of truth for the chips at the top of the TOC.
// (Cognitive-flow improvement 2026-07-29 — series grouping + filter chips.)
const SERIES_META = {
  M1: { label: "Energy",             emoji: "⚡", topic: "PETRONAS, oil, gas, rightsizing" },
  M2: { label: "Governance",         emoji: "🏛", topic: "Sarawak gas, SEARAH, Bernama, sovereignty" },
  M3: { label: "Tech & Sovereignty", emoji: "🛡", topic: "YTL, ILMU, AI, monopoli" },
  M4: { label: "Economy",            emoji: "📈", topic: "Johor, daily prices, rakyat" },
  M5: { label: "Politics",           emoji: "🗳", topic: "DAP, Anwar, Loke, Sam Altman" },
};

function buildIndexHtml(pieces) {
  const today = new Date().toISOString().slice(0, 10);
  const totalArticles = pieces.length;
  const presentSeries = Array.from(new Set(pieces.map((p) => p.series.id))).sort();
  const totalSeries = presentSeries.length;

  // Transform pieces into the compact format used by the frontend JavaScript
  const articlesJs = pieces
    .map((p) => {
      return `  {s:"${escapeHtml(p.series.id)}",d:"${escapeHtml(p.date)}",u:"${escapeHtml(p.dest.path)}",t:"${escapeHtml(p.title).replace(/"/g, '\\"')}"}`;
    })
    .join(",\n");

  return `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MakcikGPT — Civic Intelligence in Bahasa Makcik | arif-fazil.com</title>
<meta name="description" content="Civic journalism in Bahasa Makcik. Malaysian sovereignty, resource governance, institutional integrity, technology accountability. ${totalArticles} articles, ${totalSeries} series, seal 999.">
<link rel="canonical" href="${SITE_BASE}/makcikgpt/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Blog","name":"MakcikGPT — Civic Intelligence","url":"${SITE_BASE}/makcikgpt/","inLanguage":"ms","author":{"@type":"Person","name":"Muhammad Arif bin Fazil","url":"${SITE_BASE}/"}}
</script>
<style>
/* ═══ PRIMER DARK TOKENS — Red, Blue, Yellow ═══ */
:root{
  --bg:#0a0a0a; --bg-alt:#111111; --bg-card:#1a1a1a; --bg-hover:#242424;
  --border:#2a2a2a; --border-light:#1e1e1e;
  --fg:#f0f0f0; --fg-muted:#9a9a9a; --fg-subtle:#666666;
  --red:#e0301e; --blue:#1f3fd4; --yellow:#f2b705;
  --body:'Inter',sans-serif; --mono:'JetBrains Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:var(--yellow);color:var(--bg)}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--body);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:960px;margin:0 auto;padding:0 24px}

/* ── TOPBAR ── */
.topbar{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px}
.topbar-links{display:flex;gap:4px}
.topbar-links a{padding:6px 12px;border-radius:6px;color:var(--fg-muted);transition:all .15s}
.topbar-links a:hover{color:var(--fg);background:var(--bg-hover)}
.topbar-sig{display:flex;align-items:center;gap:8px;color:var(--fg-subtle)}
.topbar-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.topbar-dot.r{background:var(--red)}.topbar-dot.b{background:var(--blue)}.topbar-dot.y{background:var(--yellow)}

/* ── HERO ── */
.hero{position:relative;padding:80px 0 64px;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(30,63,212,.06),transparent);pointer-events:none}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.hero h1{font-size:clamp(36px,6vw,64px);font-weight:900;line-height:1.05;letter-spacing:-.03em}
.hero h1 .c-b{color:var(--blue)}.hero h1 .c-r{color:var(--red)}.hero h1 .c-y{color:var(--yellow)}
.hero-sub{font-size:14px;color:var(--fg-muted);margin-top:16px;font-family:var(--mono);letter-spacing:.02em}
.hero-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px}
.hero-tags span{padding:4px 10px;border-radius:20px;font-size:11px;font-family:var(--mono);font-weight:500;border:1px solid var(--border);color:var(--fg-muted);background:var(--bg-alt)}
.hero-visual{position:relative;height:320px;border-radius:12px;border:1px solid var(--border);background:var(--bg-alt);overflow:hidden}
#hero-canvas{width:100%;height:100%;display:block}

/* ── STATS ROW ── */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-radius:10px;overflow:hidden;margin-top:8px;border:1px solid var(--border)}
.stat{background:var(--bg-card);padding:24px 20px;text-align:center}
.stat b{display:block;font-size:32px;font-weight:800;letter-spacing:-.02em}
.stat b.c-r{color:var(--red)}.stat b.c-b{color:var(--blue)}.stat b.c-y{color:var(--yellow)}
.stat span{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--fg-muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px;display:block}

/* ── MAKCIK QUOTE ── */
.quote-wrap{margin-top:48px}
.quote{position:relative;padding:28px 32px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border);border-left:4px solid var(--yellow)}
.quote p{font-size:clamp(17px,2.2vw,21px);font-weight:600;line-height:1.5;color:var(--fg)}
.quote p u{text-decoration-color:var(--yellow);text-underline-offset:4px}
.quote span{display:block;margin-top:14px;font-family:var(--mono);font-size:11px;font-weight:500;color:var(--fg-subtle);letter-spacing:.06em}

/* ── SECTION HEADERS ── */
.sec{margin-top:56px}
.sec-head{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.sec-head .badge{font-family:var(--mono);font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.08em}
.sec-head .badge.r{background:rgba(224,48,30,.15);color:var(--red)}
.sec-head .badge.b{background:rgba(31,63,212,.15);color:var(--blue)}
.sec-head .badge.y{background:rgba(242,183,5,.15);color:var(--yellow)}
.sec-head h2{font-size:clamp(20px,3vw,28px);font-weight:800;letter-spacing:-.02em}
.sec-head .line{flex:1;height:1px;background:var(--border)}

/* ── LATEST ARTICLES ── */
.latest{list-style:none;border-radius:10px;border:1px solid var(--border);overflow:hidden;background:var(--bg-card)}
.latest li{display:flex;gap:14px;align-items:center;padding:14px 20px;border-bottom:1px solid var(--border-light);transition:background .15s}
.latest li:last-child{border-bottom:none}
.latest li:hover{background:var(--bg-hover)}
.latest .num{font-family:var(--mono);font-size:14px;font-weight:700;min-width:32px;color:var(--fg-subtle)}
.latest a{flex:1;font-weight:600;font-size:15px;color:var(--fg);transition:color .15s}
.latest a:hover{color:var(--blue)}
.latest time{font-family:var(--mono);font-size:11px;color:var(--fg-subtle);white-space:nowrap}
.chip{font-family:var(--mono);font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap;letter-spacing:.04em}
.chip.M1{background:rgba(224,48,30,.15);color:var(--red)}
.chip.M2{background:rgba(31,63,212,.15);color:var(--blue)}
.chip.M3{background:rgba(242,183,5,.15);color:var(--yellow)}
.chip.M4{color:var(--fg-muted);background:var(--bg-hover)}
.chip.M5{color:var(--fg);background:var(--bg-hover)}

/* ── SERIES CARDS ── */
.series{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.scard{padding:20px 16px;border-radius:10px;border:1px solid var(--border);background:var(--bg-card);cursor:pointer;transition:all .2s;display:flex;flex-direction:column;position:relative}
.scard:hover{transform:translateY(-3px);border-color:var(--fg-muted);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.scard.active{outline:2px solid var(--yellow);outline-offset:2px;border-color:var(--yellow)}
.scard .fk{font-family:var(--mono);font-size:24px;font-weight:700;margin-bottom:8px}
.scard[data-s=M1] .fk{color:var(--red)}.scard[data-s=M2] .fk{color:var(--blue)}
.scard[data-s=M3] .fk{color:var(--yellow)}.scard[data-s=M4] .fk{color:var(--fg-muted)}
.scard[data-s=M5] .fk{color:var(--fg)}
.scard h3{font-size:13px;font-weight:700;margin-bottom:4px;letter-spacing:-.01em}
.scard p{font-size:12px;color:var(--fg-muted);line-height:1.4;flex:1}
.scard .n{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--fg-subtle);margin-top:12px;display:flex;align-items:center;gap:4px}
.scard.active::after{content:'';position:absolute;top:8px;right:8px;width:8px;height:8px;border-radius:50%;background:var(--yellow)}

/* ── SEARCH ── */
.search{display:flex;border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);margin-bottom:16px}
.search input{flex:1;border:none;padding:14px 18px;font-family:var(--mono);font-size:13px;font-weight:500;background:transparent;color:var(--fg);outline:none}
.search input::placeholder{color:var(--fg-subtle)}
.search .go{padding:14px 20px;background:var(--bg-hover);color:var(--fg-muted);font-family:var(--mono);font-size:11px;font-weight:600;display:flex;align-items:center;letter-spacing:.06em;border-left:1px solid var(--border);cursor:pointer;transition:all .15s}
.search .go:hover{color:var(--fg);background:var(--border)}

/* ── INDEX ── */
.idx{list-style:none;border:1px solid var(--border);border-radius:0 0 10px 10px;border-top:none;overflow:hidden;background:var(--bg-card)}
.idx li{display:flex;gap:12px;align-items:center;padding:11px 18px;border-bottom:1px solid var(--border-light);transition:background .1s}
.idx li:last-child{border-bottom:none}
.idx li:hover{background:var(--bg-hover)}
.idx a{flex:1;font-size:14px;font-weight:500;color:var(--fg);transition:color .15s}
.idx a:hover{color:var(--blue)}
.idx time{font-family:var(--mono);font-size:11px;color:var(--fg-subtle);white-space:nowrap}
.idx-filter-top{border-radius:10px 10px 0 0}
.empty{display:none;border:1px solid var(--border);border-top:none;border-radius:0 0 10px 10px;background:var(--bg-card);padding:40px;text-align:center;font-family:var(--mono);font-size:13px;color:var(--fg-muted)}
.empty.show{display:block}

/* ── FOOTER ── */
footer{margin-top:72px;border-top:1px solid var(--border);padding:28px 0 36px}
footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:var(--mono);font-size:11px;color:var(--fg-subtle)}
footer a{color:var(--fg-muted);transition:color .15s}
footer a:hover{color:var(--blue)}
footer .fdots{display:flex;align-items:center;gap:6px}
footer .fdots .dot{width:6px;height:6px;border-radius:50%;display:inline-block}

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .hero-grid{grid-template-columns:1fr}
  .hero-visual{height:200px}
  .stats{grid-template-columns:repeat(2,1fr)}
  .series{grid-template-columns:repeat(2,1fr)}
  .series .scard:nth-child(5){grid-column:span 2}
}
@media(max-width:480px){
  .hero{padding:48px 0 40px}
  .stats{grid-template-columns:1fr 1fr}
  .stat{padding:16px}
  .series{grid-template-columns:1fr 1fr}
  .latest li{flex-wrap:wrap}
  .topbar-sig{display:none}
}
</style>
</head>
<body>

<!-- ═══ TOPBAR ═══ -->
<nav class="topbar wrap">
  <div class="topbar-links">
    <a href="${SITE_BASE}/">← HOME</a>
    <a href="${SITE_BASE}/world/">/WORLD/</a>
  </div>
  <div class="topbar-sig">
    <span class="topbar-dot r"></span>
    <span class="topbar-dot b"></span>
    <span class="topbar-dot y"></span>
    SEAL 999 · ${escapeHtml(today)}
  </div>
</nav>

<!-- ═══ HERO ═══ -->
<header class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <h1>
          Makcik<br>
          <span class="c-b">Tanya.</span>
          <span class="c-r">Kuasa</span>
          <span class="c-y">Jawab.</span>
        </h1>
        <div class="hero-sub">CIVIC JOURNALISM IN BAHASA MAKCIK — TAKDE SPIN, TAKDE CORPORATE SPEAK</div>
        <div class="hero-tags">
          <span>SOVEREIGNTY</span>
          <span>RESOURCES</span>
          <span>INSTITUTIONS</span>
          <span>TECH ACCOUNTABILITY</span>
        </div>
      </div>
      <div class="hero-visual">
        <canvas id="hero-canvas"></canvas>
      </div>
    </div>
  </div>
</header>

<div class="wrap">

<!-- ═══ STATS ═══ -->
<div class="stats">
  <div class="stat"><b class="c-r">${totalArticles}</b><span>Artikel</span></div>
  <div class="stat"><b class="c-b">${totalSeries}</b><span>Siri</span></div>
  <div class="stat"><b class="c-y">999</b><span>Seal Standard</span></div>
  <div class="stat"><b class="c-r">BM</b><span>Bahasa Makcik</span></div>
</div>

<!-- ═══ MAKCIK QUOTE ═══ -->
<section class="quote-wrap">
  <div class="quote">
    <p>"Depa kata <u>strategic partnership</u>. Makcik tanya satu je — siapa untung, siapa bayar, dan kenapa kita yang terakhir tahu?"</p>
    <span>— MAKCIK · SETIAP ARTIKEL DISEAL 999 · DITEMPA BUKAN DIBERI</span>
  </div>
</section>

<!-- ═══ LATEST ═══ -->
<section class="sec">
  <div class="sec-head">
    <span class="badge r">●</span>
    <h2>Terbaru</h2>
    <div class="line"></div>
  </div>
  <ul class="latest" id="latest"></ul>
</section>

<!-- ═══ SERIES ═══ -->
<section class="sec">
  <div class="sec-head">
    <span class="badge b">◆</span>
    <h2>Siri</h2>
    <div class="line"></div>
  </div>
  <div class="series" id="series"></div>
</section>

<!-- ═══ ALL ARTICLES ═══ -->
<section class="sec">
  <div class="sec-head">
    <span class="badge y">■</span>
    <h2>Semua</h2>
    <div class="line"></div>
    <span class="badge" id="count" style="background:var(--bg-hover);color:var(--fg-muted)"></span>
  </div>
  <div class="search">
    <input id="q" type="text" placeholder="Cari… (PETRONAS · SARAWAK · BANGANG)" aria-label="Cari artikel">
    <div class="go">TAPIS ▸</div>
  </div>
  <ul class="idx idx-filter-top" id="idx"></ul>
  <div class="empty" id="empty">TAKDE HASIL — CUBA KATA KUNCI LAIN.</div>
</section>

</div>

<!-- ═══ FOOTER ═══ -->
<footer>
  <div class="wrap">
    <div class="fdots">
      <span class="dot" style="background:var(--red)"></span>
      <span class="dot" style="background:var(--blue)"></span>
      <span class="dot" style="background:var(--yellow)"></span>
      MAKCIKGPT · ARIF-FAZIL.COM · DITEMPA BUKAN DIBERI 🇲🇾
    </div>
    <div>
      <a href="${SITE_BASE}/llms.txt">LLMS.TXT</a> ·
      <a href="${SITE_BASE}/world/">/WORLD/</a> ·
      <a href="${SITE_BASE}/">HOME</a>
    </div>
  </div>
</footer>

<script>
/* ═══ HERO CANVAS — subtle animated particles in Primer colors ═══ */
(function(){
  const cv=document.getElementById('hero-canvas'),ctx=cv.getContext('2d');
  let W,H,pts=[];
  function size(){
    W=cv.width=cv.clientWidth;H=cv.height=cv.clientHeight;
    pts=Array.from({length:50},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.5+1}));
  }
  size();addEventListener('resize',size);
  const COLORS=['#e0301e','#1f3fd4','#f2b705'];
  function draw(){
    ctx.fillStyle='#111111';ctx.fillRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=COLORS[Math.floor(Math.random()*COLORS.length)];ctx.globalAlpha=.4;
      ctx.fill();
    });
    ctx.globalAlpha=.08;
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='#1f3fd4';ctx.lineWidth=.5;ctx.stroke();}
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ═══ DATA ═══ */
const SERIES={
  M1:{name:"Energy",desc:"PETRONAS, oil, gas, rightsizing"},
  M2:{name:"Governance",desc:"Sarawak gas, SEARAH, Bernama, sovereignty"},
  M3:{name:"Tech & Sovereignty",desc:"YTL, ILMU, AI, monopoli"},
  M4:{name:"Economy",desc:"Johor, harga harian, rakyat"},
  M5:{name:"Politics",desc:"BANGANG files — no one spared"}
};
const ARTICLES=[
${articlesJs}
];

const sorted=[...ARTICLES].sort((a,b)=>b.d.localeCompare(a.d)),BASE="${SITE_BASE}";

/* ═══ LATEST ═══ */
document.getElementById('latest').innerHTML=sorted.slice(0,5).map((a,i)=>
  \`<li><span class="num">0\${i+1}</span><a href="\${BASE}\${a.u}">\${a.t}</a><span class="chip \${a.s}">\${a.s}</span><time>\${a.d}</time></li>\`
).join('');

/* ═══ SERIES ═══ */
let active=null;
const sEl=document.getElementById('series');
sEl.innerHTML=Object.entries(SERIES).map(([k,v])=>{
  const n=ARTICLES.filter(a=>a.s===k).length;
  return \`<div class="scard" data-s="\${k}" role="button" tabindex="0"><div class="fk">\${k}</div><h3>\${v.name}</h3><p>\${v.desc}</p><span class="n">\${n} ARTIKEL ▸</span></div>\`;
}).join('');
sEl.addEventListener('click',e=>{
  const c=e.target.closest('.scard');if(!c)return;
  active=(active===c.dataset.s)?null:c.dataset.s;
  document.querySelectorAll('.scard').forEach(x=>x.classList.toggle('active',x.dataset.s===active));
  render();
});

/* ═══ SEARCH / INDEX ═══ */
const idxEl=document.getElementById('idx'),qEl=document.getElementById('q'),emptyEl=document.getElementById('empty'),countEl=document.getElementById('count');
function render(){
  const q=qEl.value.toLowerCase().trim();
  const rows=sorted.filter(a=>(!active||a.s===active)&&(!q||a.t.toLowerCase().includes(q)||SERIES[a.s].desc.toLowerCase().includes(q)));
  idxEl.innerHTML=rows.map(a=>\`<li><span class="chip \${a.s}">\${a.s}</span><a href="\${BASE}\${a.u}">\${a.t}</a><time>\${a.d}</time></li>\`).join('');
  emptyEl.classList.toggle('show',!rows.length);
  countEl.textContent=rows.length+' / '+ARTICLES.length+' ARTIKEL';
}
qEl.addEventListener('input',render);
render();
</script>
</body>
</html>
`;
}

function main() {
  const { pieces } = getMakcikSource();
  const html = buildIndexHtml(pieces);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html, "utf8");
  console.log(`✓ Wrote ${pieces.length} entries → ${path.relative(SITE_ROOT, OUT_PATH)}`);
}

main();
