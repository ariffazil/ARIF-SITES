#!/usr/bin/env node
/**
 * generate-nav-canon.cjs — derive src/data/navCanon.ts from web-canon navigation.json.
 * DERIVED — never hand-edit the .ts. Edit /root/web-canon/canon/navigation.json.
 * Law: SOT → generator → page. Navbar MUST import primaryNav (no hardcoded lists).
 */
const fs = require('fs');
const path = require('path');

const CANON = '/root/web-canon/canon/navigation.json';
const OUT = path.join(__dirname, '..', 'src/data/navCanon.ts');

function mapItems(items) {
  return (items || []).map((it) => ({
    label: it.label,
    href: it.href,
    mode: it.mode || (String(it.href || '').startsWith('http') ? 'external' : 'spa'),
    external: it.mode === 'external' || String(it.href || '').startsWith('http'),
  }));
}

try {
  const nav = JSON.parse(fs.readFileSync(CANON, 'utf8'));
  const primary = mapItems(nav.primary_links?.items);
  const secondary = mapItems(nav.secondary_links?.items);
  const machine = mapItems(nav.machine_links?.items);
  const brand = nav.brand || { label: 'ARIF FAZIL', href: '/', creed: 'Forged, not given.' };

  if (!primary.length) {
    console.error('✗ navigation.json has no primary_links.items');
    process.exit(1);
  }

  const trinityStatus = nav.trinity_nav?.status || 'UNKNOWN';
  if (trinityStatus !== 'DRAFT_FUTURE' && trinityStatus !== 'LIVE') {
    console.warn(`⚠ trinity_nav.status=${trinityStatus} — expected DRAFT_FUTURE or LIVE`);
  }

  const ts = `// AUTO-GENERATED from /root/web-canon/canon/navigation.json (generate-nav-canon.cjs)
// DERIVED — never hand-edit. Edit canon, regenerate.
// F2: this file must match canon exactly. Drift = entropy.
// canon version: ${nav.version || '?'} · as_of: ${nav.as_of || '?'} · trinity: ${trinityStatus}

export interface NavItem {
  label: string;
  href: string;
  mode?: 'spa' | 'static' | 'external';
  external?: boolean;
}

export const brand = ${JSON.stringify(
    {
      label: brand.label || 'ARIF FAZIL',
      href: brand.href || '/',
      creed: brand.creed || 'Forged, not given.',
    },
    null,
    2,
  )} as const;

export const primaryNav: NavItem[] = ${JSON.stringify(primary, null, 2)};

export const secondaryNav: NavItem[] = ${JSON.stringify(secondary, null, 2)};

export const machineNav: NavItem[] = ${JSON.stringify(machine, null, 2)};

/** Trinity is DRAFT — do not render on public shell until status === LIVE */
export const trinityStatus = ${JSON.stringify(trinityStatus)} as const;
`;

  fs.writeFileSync(OUT, ts);
  console.log(
    `✓ navCanon.ts generated (primary=${primary.length} secondary=${secondary.length} machine=${machine.length} trinity=${trinityStatus})`,
  );
} catch (e) {
  console.error(`✗ generate-nav-canon: ${e.message}`);
  process.exit(1);
}
