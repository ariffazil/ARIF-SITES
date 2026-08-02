#!/usr/bin/env node
/**
 * generate-nav-canon.cjs — derive src/data/navCanon.ts from canon/navigation.json.
 * DERIVED file (file-authority.yaml): never hand-edit — regenerate.
 * Law I3: SOT → generator → page. Navigation comes from canon, never from page.
 *
 * Usage: node scripts/generate-nav-canon.cjs   (runs in prebuild)
 */
const fs = require('fs');
const path = require('path');

const CANON = '/root/web-canon/canon/navigation.json';
const OUT = path.join(__dirname, '..', 'src/data/navCanon.ts');

try {
  const nav = JSON.parse(fs.readFileSync(CANON, 'utf8'));

  const items = (nav.primary_links?.items || []).map((it) => ({
    label: it.label,
    href: it.href,
  }));

  if (!items.length) {
    console.error('✗ navigation.json has no primary_links — canon not synced');
    process.exit(1);
  }

  const ts = `// AUTO-GENERATED from /root/web-canon/canon/navigation.json (generate-nav-canon.cjs)
// DERIVED — never hand-edit. Edit canon, regenerate.
// F2: this file must match canon exactly. Drift = entropy.

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const primaryNav: NavItem[] = ${JSON.stringify(items, null, 2)};
`;

  fs.writeFileSync(OUT, ts);
  console.log(`✓ navCanon.ts generated (${items.length} items)`);
} catch (e) {
  console.error(`✗ generate-nav-canon: ${e.message}`);
  process.exit(1);
}
