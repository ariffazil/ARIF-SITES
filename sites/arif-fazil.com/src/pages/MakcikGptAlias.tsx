import { MakcikGPT } from './MakcikGPT';

/**
 * Canonical alias wrapper for the MakcikGPT landing.
 *
 * Canonical URL: /makcikgpt/   (renders MakcikGPT directly)
 * Bare alias:   /world/makcikgpt    (renders MakcikGPT directly)
 * /index suffix: /makcikgpt/index → redirected to /makcikgpt/
 *   (handled by the App router — see <Route path="/makcikgpt/index" />)
 *
 * The legacy /wealth/makcikgpt/ and /economics/makcikgpt/ paths are routed
 * by the App router with <Navigate replace> — they never enter this component.
 * They were the old canonical home before the 2026-07-21 world/migration.
 */
export function MakcikGPTAlias() {
  return <MakcikGPT />;
}

export default MakcikGPTAlias;
