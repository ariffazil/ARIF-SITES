import type { GDELTArticle, SOTIndex, Axis } from './types';

/**
 * Compute SOT (State of the World) tension indices from GDELT articles.
 *
 * Each axis index is 0-100 where:
 *  - 0-30  = calm / SEAL
 *  - 30-60 = elevated / SABAR
 *  - 60-80 = tense / HOLD
 *  - 80-100 = critical / VOID
 *
 * Inputs:
 *  - article count per axis (volume)
 *  - average tone (negative = conflict)
 *  - average article "intensity" (length of title as a proxy)
 *  - source country diversity (more spread = broader stress)
 *
 * All math is fully deterministic and observable. The pipeline is:
 *    OBS  →  tone.mean, articles.count, sources.unique
 *    DER  → axis_intensity = -(tone.mean) * log(count+1)
 *    SPEC → 0-100 normalization per axis
 *    SPEC → aggregate = harmonic mean of axes (lowest dominates, F1 AMANAH)
 */
function computeAxis(articles: GDELTArticle[]): number {
  if (articles.length === 0) return 0;
  const meanTone = articles.reduce((a, b) => a + (toneMean(b.tone) ?? 0), 0) / articles.length;
  // Tension comes from NEGATIVE tone (most GDELT negative = conflict)
  const negTone = Math.max(0, -meanTone);
  // Volume contribution (log scale, so it doesn't dominate)
  const volume = Math.log10(articles.length + 1) * 10;
  // Source spread (more unique sources = higher confidence in stress)
  const sources = new Set(articles.map((a) => a.domain)).size;
  const spread = Math.min(20, sources * 1.5);
  // Title length as proxy for event complexity
  const complexity = articles.reduce((a, b) => a + Math.min(60, b.title.length), 0) / articles.length / 2;
  // Combine and clamp
  const raw = negTone * 1.2 + volume + spread + complexity;
  return Math.max(0, Math.min(100, raw));
}

function toneMean(tone: number[]): number | null {
  if (!Array.isArray(tone) || tone.length === 0) return null;
  return tone.reduce((a, b) => a + b, 0) / tone.length;
}

export function computeSOT(articles: GDELTArticle[]): SOTIndex {
  const geo = articles.filter((a) => a.axis === 'geo');
  const econ = articles.filter((a) => a.axis === 'econ');
  const soc = articles.filter((a) => a.axis === 'soc');

  const geoScore = computeAxis(geo);
  const econScore = computeAxis(econ);
  const socScore = computeAxis(soc);

  // F1 AMANAH: aggregate uses LOWEST axis (lowest dominance) — catastrophic
  // events dominate. This is the harmonic mean scaled to 0-100.
  // Harmonic mean = 3 / (1/a + 1/b + 1/c). When any axis is 0, the result is 0.
  // To avoid degenerate zeros, we floor each axis at 0.5.
  const safeAxis = (x: number) => Math.max(0.5, x);
  const harmonic = 3 / (1 / safeAxis(geoScore) + 1 / safeAxis(econScore) + 1 / safeAxis(socScore));
  // Harmonic will be ≤ min(axis). Scale up to 0-100 conservatively.
  const aggregate = Math.min(100, harmonic * 1.5);

  return {
    geo: Math.round(geoScore),
    econ: Math.round(econScore),
    soc: Math.round(socScore),
    aggregate: Math.round(aggregate),
    updated: new Date().toISOString(),
  };
}

export function axisLabel(axis: Axis): string {
  return { geo: 'Geopolitics', econ: 'Economics', soc: 'Social' }[axis];
}

export function axisSymbol(axis: Axis): string {
  return { geo: 'Δ', econ: 'Ω', soc: 'Ψ' }[axis];
}
