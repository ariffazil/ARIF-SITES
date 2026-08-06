/* eslint-disable */
/**
 * smoke-test.cjs
 * Hits the live APIs the Atlas depends on and prints what comes back.
 * Run after build (or standalone) to verify the data pipeline still works.
 */
const https = require('https');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...headers }, timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

async function main() {
  // 1. GDELT DOC 2 — geopolitical theme
  console.log('=== GDELT geopolitics ===');
  const gdelt = await get(
    'https://api.gdeltproject.org/api/v2/doc/doc?query=(conflict+OR+diplomacy+OR+ceasefire)+sourcelang:eng&format=json&maxrecords=5&sort=datedesc'
  );
  console.log(`status=${gdelt.status} bytes=${gdelt.body.length}`);
  if (gdelt.status === 200 && gdelt.body.trim().startsWith('{')) {
    const j = JSON.parse(gdelt.body);
    console.log(`articles=${j.articles?.length ?? 0}`);
    if (j.articles?.[0]) console.log(`  sample: ${j.articles[0].title?.slice(0, 80)}`);
  } else {
    console.log('  rate-limited or non-JSON, will retry on tick');
  }

  // 2. World Bank — Malaysia GDP
  console.log('\n=== World Bank MY GDP ===');
  const wb = await get('https://api.worldbank.org/v2/country/MYS/indicator/NY.GDP.MKTP.CD?format=json&date=2022&per_page=1');
  console.log(`status=${wb.status} bytes=${wb.body.length}`);
  if (wb.status === 200) {
    const j = JSON.parse(wb.body);
    console.log(`  country=${j[1]?.[0]?.country?.value} ${j[1]?.[0]?.date}: $${(j[1]?.[0]?.value / 1e9).toFixed(1)}B`);
  }

  // 3. World Bank — indicators for any country, sanity
  console.log('\n=== World Bank WLD population ===');
  const pop = await get('https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&date=2022&per_page=1');
  console.log(`status=${pop.status} bytes=${pop.body.length}`);
  if (pop.status === 200) {
    const j = JSON.parse(pop.body);
    console.log(`  world pop ${j[1]?.[0]?.date}: ${(j[1]?.[0]?.value / 1e9).toFixed(2)}B`);
  }

  // 4. TopoJSON world atlas
  console.log('\n=== TopoJSON geometry ===');
  const topo = await get('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  console.log(`status=${topo.status} bytes=${topo.body.length}`);
  console.log(`  ok: ${topo.status === 200 && topo.body.length > 50000}`);

  console.log('\n[smoke-test] done');
}

main().catch((e) => {
  console.error('[smoke-test] FAILED:', e.message);
  process.exit(1);
});
