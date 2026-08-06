/* eslint-disable */
/**
 * prepare-data.cjs
 * Strips the mledoze/world-countries dataset (1.4MB) down to sketch fields (~70KB)
 * and writes it to src/data/countries-min.json. Runs prebuild.
 *
 * Why this matters: we need a fast, offline, no-auth country dossier for the Atlas.
 * Embedding 1.4MB of genealogy + name translations into the bundle is wasteful;
 * 70KB trimmed is enough for everything the SOT panel needs.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC = 'https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json';
const OUT = path.resolve(__dirname, '../src/data/countries-min.json');
const CACHE = path.resolve(__dirname, '../.cache/countries.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

async function main() {
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  let raw;
  if (fs.existsSync(CACHE)) {
    raw = fs.readFileSync(CACHE, 'utf8');
    console.log(`[prepare-data] using cache ${CACHE} (${(raw.length / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`[prepare-data] fetching ${SRC} ...`);
    raw = await fetch(SRC);
    fs.writeFileSync(CACHE, raw);
    console.log(`[prepare-data] cached ${(raw.length / 1024).toFixed(1)} KB`);
  }
  const full = JSON.parse(raw);

  const MIN = full.map((c) => ({
    cca3: c.cca3,
    cca2: c.cca2,
    name: c.name?.common ?? '',
    official: c.name?.official ?? '',
    capital: Array.isArray(c.capital) ? c.capital[0] : '',
    region: c.region ?? '',
    subregion: c.subregion ?? '',
    population: c.population ?? 0,
    area: c.area ?? 0,
    latlng: c.latlng ?? [0, 0],
    languages: c.languages ? Object.values(c.languages) : [],
    currencies: c.currencies ? Object.keys(c.currencies) : [],
    flag: c.flag ?? '',
    unMember: c.unMember ?? false,
    independent: c.independent ?? false,
  }));

  fs.writeFileSync(OUT, JSON.stringify(MIN));
  console.log(`[prepare-data] wrote ${MIN.length} countries → ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);
}

main().catch((e) => {
  console.error('[prepare-data] FAILED:', e.message);
  process.exit(1);
});
