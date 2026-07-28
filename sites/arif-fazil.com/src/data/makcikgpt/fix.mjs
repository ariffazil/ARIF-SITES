const fs = require('fs');
let c = fs.readFileSync('index.ts','utf8');

// Check if meta already present
if (!c.includes('dap-8-tahun-bangang')) {
  // Find the meta array start and insert after the opening bracket
  const marker = 'export const makcikArticlesMeta: MakcikArticleMeta[] = [\n';
  const idx = c.indexOf(marker);
  if (idx !== -1) {
    const before = c.substring(0, idx + marker.length);
    const after = c.substring(idx + marker.length);
    const newEntry = `  {
    slug: 'dap-8-tahun-bangang',
    title: '8 Benda BANGANG DAP Dalam Kerajaan',
    subtitle: 'DAP dah 8 tahun dalam kerajaan. Bukan pembangkang lagi. Tapi buat apa? Makcik senaraikan 8 benda bangang — dengan resit.',
    date: '2026-07-28',
    domain: 'MAKCIKGPT x MALAYSIA',
    language: 'ms',
    excerpt: 'DAP 8 tahun dalam kerajaan: Janji Buku Harapan tak jadi, air still putus, harga barang naik, diam pasal undang-undang, Loke hilang suara, reformasi lesap. Makcik tanya: dah cukup la.',
    tags: ['dap', 'prn-2026', 'negeri-sembilan', 'anwar', 'loke', 'reformasi', 'makcikgpt'],
    seal: '999',
  },
  `;
    c = before + newEntry + after;
  }
}

fs.writeFileSync('index.ts', c, 'utf8');

const v = fs.readFileSync('index.ts', 'utf8');
console.log('Import:', v.includes('dap8TahunBangang') ? 'OK' : 'FAIL');
console.log('Module:', v.includes('dap8TahunBangang,') ? 'OK' : 'FAIL');
console.log('Meta:', v.includes('dap-8-tahun-bangang') ? 'OK' : 'FAIL');
