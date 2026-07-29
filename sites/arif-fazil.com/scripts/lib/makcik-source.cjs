/**
 * makcik-source.cjs — Single source of truth (F4 CLARITY) for MakcikGPT.
 *
 * All generators that emit any /makcikgpt/* surface (feed.xml,
 * sitemap.xml, llms.{txt,json}, page.json, makcikgpt-md/index.html) MUST
 * go through this helper so they cannot drift out of parity.
 *
 * What "MakcikGPT" means (canonical, 2026-07-25):
 *   the subset of essays.json where
 *     - lang === "bm"
 *     - dest.type === "onsite"
 *     - dest.path starts with the canonical "/makcikgpt/" prefix
 *
 * The helper enforces:
 *   1. non-empty canonical subset (any count ≥ 1 is accepted — no magic count)
 *   2. canonical-path discipline (every dest.path lives under /makcikgpt/)
 *   3. unique IDs and unique paths across the subset
 *   4. required metadata on every entry
 *   5. deterministic ordering: date desc, then id desc as a stable tiebreaker
 *
 * If any invariant fails the helper throws a MakcikSourceError so the
 * generating script can fail-fast. Tests can also call validateMakcikPieces
 * directly with { throwOnError: false } to inspect the violation list.
 */

const fs = require("fs");
const path = require("path");

// Anchor all relative paths off the site root so every script that requires
// this module resolves the canonical essays.json the same way.
const SITE_ROOT = path.resolve(__dirname, "..", "..");
const ESSAYS_JSON = path.join(SITE_ROOT, "src/data/essays.json");
// 2026-07-29: FLATTEN — articles live at /makcikgpt/<slug> (2 layers max from home).
// Old /makcikgpt/<slug> redirects to /makcikgpt/<slug> in Caddy.
const CANONICAL_PREFIX = "/makcikgpt/";

class MakcikSourceError extends Error {
  constructor(message, violations) {
    super(message);
    this.name = "MakcikSourceError";
    this.violations = violations || [];
  }
}

function loadEssays() {
  const raw = fs.readFileSync(ESSAYS_JSON, "utf8");
  return JSON.parse(raw);
}

/**
 * Returns the canonical MakcikGPT subset: BM-authored, onsite-destined,
 * under the canonical /makcikgpt/ prefix.
 *
 * Order is deterministic: newest date first; ties (same date) are broken
 * by id descending so the output is byte-stable across runs.
 */
function pickMakcikPieces(essays) {
  return essays
    .filter(
      (e) =>
        e &&
        e.lang === "bm" &&
        e.dest &&
        e.dest.type === "onsite" &&
        typeof e.dest.path === "string" &&
        e.dest.path.startsWith(CANONICAL_PREFIX),
    )
    .slice()
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      // Tiebreaker — descending by id keeps the list byte-stable.
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.length > 0;
}

function requiredFieldViolation(piece, field) {
  if (!isNonEmptyString(piece[field])) {
    return `entry missing or empty required field: ${field}`;
  }
  return null;
}

/**
 * Validates the canonical subset against every invariant.
 *
 * @param {Array} pieces  Output of pickMakcikPieces().
 * @param {Object} [opts]
 * @param {boolean} [opts.throwOnError=true]  When false, returns
 *   { ok: false, violations } instead of throwing.
 * @returns {{ ok: true, count: number, pieces: Array }}
 * @throws  {MakcikSourceError}
 */
function validateMakcikPieces(pieces, opts = {}) {
  const throwOnError = opts.throwOnError !== false;
  const violations = [];

  if (!Array.isArray(pieces)) {
    violations.push("pieces must be an array");
    if (throwOnError) {
      throw new MakcikSourceError(
        `Makcik source validation failed: ${violations.join("; ")}`,
        violations,
      );
    }
    return { ok: false, violations };
  }

  if (pieces.length === 0) {
    violations.push(
      "MakcikGPT canonical subset is empty — essays.json must contain at least one BM + onsite entry under /makcikgpt/",
    );
  }

  const seenIds = new Map(); // id → first index
  const seenPaths = new Map(); // path → first index

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const where = `entry[${i}] (id=${p && p.id})`;

    // Required scalar fields.
    for (const f of ["id", "title", "date", "lang"]) {
      const v = requiredFieldViolation(p, f);
      if (v) violations.push(`${where}: ${v}`);
    }

    // lang and dest invariants are already enforced by pickMakcikPieces,
    // but we re-check here so a caller that bypasses the filter still fails.
    if (p && p.lang !== "bm") {
      violations.push(`${where}: lang must be "bm" (got "${p.lang}")`);
    }
    if (!p || !p.dest || p.dest.type !== "onsite") {
      violations.push(`${where}: dest.type must be "onsite"`);
    } else if (!isNonEmptyString(p.dest.path)) {
      violations.push(`${where}: dest.path missing or empty`);
    } else if (!p.dest.path.startsWith(CANONICAL_PREFIX)) {
      violations.push(
        `${where}: dest.path "${p.dest.path}" is not under canonical prefix "${CANONICAL_PREFIX}"`,
      );
    }

    // Required metadata blocks.
    if (!p || !p.series || !isNonEmptyString(p.series.id)) {
      violations.push(`${where}: series.id missing or empty`);
    }
    if (!p || !p.series || typeof p.series.n !== "number") {
      violations.push(`${where}: series.n must be a number`);
    }
    if (!p || !Array.isArray(p.tags) || p.tags.length === 0) {
      violations.push(`${where}: tags must be a non-empty array`);
    }
    if (!p || !Object.prototype.hasOwnProperty.call(p, "seal")) {
      violations.push(`${where}: seal field is required (use null for unsigned)`);
    }

    // Uniqueness — IDs and paths must each appear at most once.
    if (p && isNonEmptyString(p.id)) {
      if (seenIds.has(p.id)) {
        violations.push(
          `${where}: duplicate id "${p.id}" (also at entry[${seenIds.get(p.id)}])`,
        );
      } else {
        seenIds.set(p.id, i);
      }
    }
    if (p && p.dest && isNonEmptyString(p.dest.path)) {
      if (seenPaths.has(p.dest.path)) {
        violations.push(
          `${where}: duplicate dest.path "${p.dest.path}" (also at entry[${seenPaths.get(p.dest.path)}])`,
        );
      } else {
        seenPaths.set(p.dest.path, i);
      }
    }
  }

  if (violations.length > 0) {
    if (throwOnError) {
      throw new MakcikSourceError(
        `Makcik source validation failed (${violations.length} violation${violations.length === 1 ? "" : "s"}):\n  - ${violations.join("\n  - ")}`,
        violations,
      );
    }
    return { ok: false, violations };
  }

  return { ok: true, count: pieces.length, pieces };
}

/**
 * Single-call helper for the common case: load essays, pick canonical
 * pieces, validate them, and return a frozen summary.
 *
 * Generators should use this rather than re-implementing the filter.
 */
function getMakcikSource() {
  const essays = loadEssays();
  const pieces = pickMakcikPieces(essays);
  const validation = validateMakcikPieces(pieces);
  return {
    essays,
    pieces,
    count: pieces.length,
    canonicalPrefix: CANONICAL_PREFIX,
    siteRoot: SITE_ROOT,
    essaysJsonPath: ESSAYS_JSON,
    validation,
  };
}

module.exports = {
  CANONICAL_PREFIX,
  ESSAYS_JSON,
  SITE_ROOT,
  MakcikSourceError,
  loadEssays,
  pickMakcikPieces,
  validateMakcikPieces,
  getMakcikSource,
};