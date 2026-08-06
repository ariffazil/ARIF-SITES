/**
 * AtlasGate — per-route ring/plane authority (WEB_ATLAS §4, §3).
 * Law: no page defines its own identity. Route → ring + plane from Atlas.
 * Sets <html data-ring data-plane> so tokens.css styles the page correctly.
 *
 * SOURCE OF TRUTH: /root/web-canon/canon/atlas.yaml (mirrored at /canon/atlas.yaml)
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Route prefix → [ring, plane]. Longest prefix wins.
// Keep in sync with canon/atlas.yaml `routes:` (DITEMPA — drift is entropy).
const ATLAS: Array<[string, string, string]> = [
  ['/politics/ns-election/compare', 'BODY', 'organ'],
  ['/politics/ns-election/playbook', 'BODY', 'organ'],
  ['/politics/ns-election', 'BODY', 'organ'],
  ['/politics/shadow', 'SOUL', 'narrative'],
  ['/world/makcikgpt', 'BODY', 'organ'],
  ['/world', 'BODY', 'organ'],
  ['/malaysia', 'BODY', 'organ'],
  ['/propa', 'BODY', 'organ'],
  ['/economics', 'BODY', 'organ'],
  ['/wealth', 'BODY', 'organ'],
  ['/well', 'BODY', 'organ'],
  ['/forge', 'BODY', 'organ'],
  ['/oil', 'BODY', 'organ'],
  ['/gas', 'BODY', 'organ'],
  ['/gold', 'BODY', 'organ'],
  ['/missions', 'MIND', 'proof'],
  ['/mcp', 'MIND', 'proof'],
  ['/verify', 'MIND', 'proof'],
  ['/999', 'MIND', 'proof'],
  ['/canon', 'MIND', 'proof'],
  ['/earth', 'ORGAN', 'domain'],
  ['/geox', 'ORGAN', 'domain'],
  ['/writing', 'SOUL', 'narrative'],
  ['/essays', 'SOUL', 'narrative'],
  ['/doctrine', 'SOUL', 'narrative'],
  ['/000', 'SOUL', 'narrative'],
  ['/', 'SOUL', 'narrative'],
];

export default function AtlasGate() {
  const { pathname } = useLocation();

  useEffect(() => {
    let ring = 'SOUL';
    let plane = 'narrative';
    let best = -1;
    for (const [prefix, r, p] of ATLAS) {
      if (prefix !== '/' && !pathname.startsWith(prefix)) continue;
      if (prefix === '/' && pathname !== '/') continue;
      if (prefix.length > best) {
        best = prefix.length;
        ring = r;
        plane = p;
      }
    }
    const el = document.documentElement;
    el.setAttribute('data-ring', ring);
    el.setAttribute('data-plane', plane);
  }, [pathname]);

  return null;
}
