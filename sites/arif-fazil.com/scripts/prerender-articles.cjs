const puppeteer = require('/root/.npm-global/lib/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'https://arif-fazil.com';
const DIST = '/root/arif-sites/sites/arif-fazil.com/dist';

const articles = [
  {
    slug: 'petronas-dna',
    title: 'PETRONAS DNA — Dulu Bulldog, Sekarang Anjing',
    desc: 'Analisis kontras DNA institusi PETRONAS dari 1988 (The Edge) berbanding realiti kepimpinan dan JV SEARAH 2026. Dari Rastam yang "fight like bulldogs" kepada CEO yang tulis disclaimer kat LinkedIn.',
    date: '2026-07-01',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'PETRONAS, DNA, CEO, integrity, SEARAH, Eni, rightsizing, Malaysia, petroleum',
  },
  {
    slug: 'sam-altman-elon-musk-anwar-akal',
    title: 'Sam Altman, Elon Musk, Anwar Ibrahim — Depa Ada Akal Ka?',
    desc: 'Tiga lelaki besar, tiga jenis kuasa. Makcik tanya: akal depa ni jaga rakyat, atau jaga kuasa sendiri? OpenAI nonprofit-to-profit, Musk truth-seeking, Anwar MADANI.',
    date: '2026-07-01',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'Sam Altman, Elon Musk, Anwar Ibrahim, OpenAI, AI, Malaysia, MADANI, akal',
  },
  {
    slug: 'searah-followup',
    title: 'SEARAH Dah Beroperasi — Tapi Bocor Pun Dah Sampai Mahkamah',
    desc: '1 Julai 2026, SEARAH mula operasi. Esoknya, mahkamah dengar bekas manager PETRONAS bocorkan rahsia pada PETROS. CEO PETROS pun bekas PETRONAS.',
    date: '2026-07-01',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'SEARAH, PETRONAS, PETROS, bocor, mahkamah, Sarawak, gas, Eni, London',
  },
  {
    slug: 'cerita-makcik',
    title: 'Kenapa Gas Sarawak Punya Dah Masuk Tangan Orang Italy?',
    desc: 'SEARAH LIMITED — USD 2 shell company kat London, 50% PETRONAS + 50% Eni Italy. 19 ladang gas, 14 Indonesia, 5 Malaysia. PETROS takde tempat langsung.',
    date: '2026-06-07',
    author: 'Arif Fazil',
    keywords: 'SEARAH, PETRONAS, Eni, Sarawak, gas, PETROS, London, kedaulatan, Malaysia',
  },
  {
    slug: 'siasatan-harakah',
    title: 'Persoalan RM70 Bilion',
    desc: 'Struktur perjanjian gas terbesar Malaysia — siapa yang tidak termasuk dalam bilik. VSS/MSS ~5,000 pekerja, OSA bisu whistleblower.',
    date: '2026-06-07',
    author: 'Arif Fazil',
    keywords: 'SEARAH, RM70 bilion, PETRONAS, VSS, whistleblower, OSA, Malaysia',
  },
  {
    slug: 'iran-hormuz',
    title: 'Iran Hormuz dan Malaysia: Rightsizing Tak Habis-Habis',
    desc: 'Hormuz tutup-buka, harga minyak dunia tak menentu. PETRONAS rightsizing berkali-kali. Malaysia 600,000 tong/jurang import.',
    date: '2026-06-30',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'Iran, Hormuz, PETRONAS, rightsizing, minyak, gas, Malaysia',
  },
  {
    slug: 'ilmu-bbb',
    title: 'ILMU "Sovereign AI" Konon — Tapi Bila DiAudit, Menangis',
    desc: 'BBB audit dedah: ILMU bukan dari scratch, MalayMMLU exam sendiri, model protect YTL lebih dari negara. 108 panggilan API, markah 3.45/10.',
    date: '2026-07-01',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'ILMU, YTL, AI, sovereign, BBB, audit, Nvidia, Malaysia',
  },
  {
    slug: 'ytl-monopoli',
    title: 'Satu Tangan Kuasa Semua — Air, Api, Rangkaian, AI',
    desc: 'YTL kuasai elektrik, air Johor, telco, tanah data center, dan ILMU. MACC siasat 1BestariNet RM2.7B.',
    date: '2026-07-01',
    author: 'MakcikGPT / Arif Fazil',
    keywords: 'YTL, monopoli, Ranhill, air, elektrik, data center, ILMU, MACC, Malaysia',
  },
];

function makeJsonLd(a) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.desc,
    author: { '@type': 'Person', name: a.author, url: 'https://arif-fazil.com' },
    publisher: {
      '@type': 'Organization',
      name: 'arifOS Federation',
      url: 'https://arif-fazil.com',
      logo: { '@type': 'ImageObject', url: 'https://arif-fazil.com/hero_portrait.jpg' },
    },
    datePublished: a.date,
    dateModified: a.date,
    mainEntityOfPage: `${BASE}/wealth/makcikgpt/${a.slug}`,
    image: 'https://arif-fazil.com/hero_portrait.jpg',
    keywords: a.keywords,
    inLanguage: 'ms',
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.cover-subtitle', '.pull-quote', '.callout'],
    },
  };
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const a of articles) {
    const outDir = path.join(DIST, 'wealth', 'makcikgpt', a.slug);
    const outFile = path.join(outDir, 'index.html');
    
    // Skip if already pre-rendered
    if (fs.existsSync(outFile)) {
      const existing = fs.readFileSync(outFile, 'utf8');
      if (existing.includes('application/ld+json') && existing.includes('<article')) {
        console.log(`Skipping ${a.slug} (already pre-rendered)`);
        continue;
      }
    }

    const page = await browser.newPage();
    const url = `${BASE}/wealth/makcikgpt/${a.slug}`;
    
    console.log(`Rendering: ${a.slug}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    try {
      await page.waitForSelector('.cover-title, .cover-subtitle, h1, article', { timeout: 15000 });
    } catch (e) {
      console.log(`  ⚠ Fallback: waiting extra time`);
      await new Promise(r => setTimeout(r, 5000));
    }
    await new Promise(r => setTimeout(r, 2000));

    // Extract the rendered article HTML
    const articleHtml = await page.evaluate(() => {
      // Get the article content container
      const main = document.querySelector('[class*="essay"]') || document.querySelector('main') || document.querySelector('#root');
      if (!main) return document.body.innerHTML;
      return main.innerHTML;
    });

    // Get the stylesheet links from the built page
    const cssLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\n');
    });

    const jsonLd = JSON.stringify(makeJsonLd(a), null, 2);

    const staticHtml = `<!DOCTYPE html>
<html lang="ms" data-ring="SOUL">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.title} | MakcikGPT</title>
  <meta name="description" content="${a.desc}">
  <meta name="author" content="${a.author}">
  <meta name="keywords" content="${a.keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE}/wealth/makcikgpt/${a.slug}">

  <!-- Open Graph -->
  <meta property="og:title" content="${a.title}">
  <meta property="og:description" content="${a.desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${BASE}/wealth/makcikgpt/${a.slug}">
  <meta property="og:image" content="https://arif-fazil.com/hero_portrait.jpg">
  <meta property="og:site_name" content="MakcikGPT — arifOS Perisikan Persekutuan">
  <meta property="og:locale" content="ms_MY">
  <meta property="article:published_time" content="${a.date}">
  <meta property="article:author" content="${a.author}">
  <meta property="article:section" content="Civic Intelligence">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${a.title}">
  <meta name="twitter:description" content="${a.desc}">
  <meta name="twitter:image" content="https://arif-fazil.com/hero_portrait.jpg">

  <!-- Agent Discovery -->
  <link rel="mcp" href="https://mcp.arif-fazil.com/mcp" type="application/json">
  <link rel="agent" href="/.well-known/agent.json" type="application/json">

  <!-- Structured Data -->
  <script type="application/ld+json">
${jsonLd}
  </script>

  ${cssLinks}
</head>
<body>
  <article itemscope itemtype="https://schema.org/NewsArticle">
    ${articleHtml}
  </article>
</body>
</html>`;

    // Write to dist directory
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, staticHtml);
    console.log(`  → ${outFile} (${(staticHtml.length / 1024).toFixed(1)}KB)`);
  }

  await browser.close();
  console.log(`\nPre-rendered ${articles.length} articles.`);
})();
