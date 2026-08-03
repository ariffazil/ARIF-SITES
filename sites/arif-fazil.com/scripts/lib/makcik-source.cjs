/**
 * makcik-source.cjs — Single source of truth (F4 CLARITY) for MakcikGPT.
 *
 * All generators that emit any /world/makcikgpt/* surface (feed.xml,
 * sitemap.xml, llms.{txt,json}, page.json, makcikgpt-md/index.html) MUST
 * go through this helper so they cannot drift out of parity.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SITE_ROOT = path.resolve(__dirname, "..", "..");
const ESSAYS_JSON = path.join(SITE_ROOT, "src/data/essays.json");
const CANONICAL_PREFIX = "/world/makcikgpt/";

class MakcikSourceError extends Error {
  constructor(message, violations) {
    super(message);
    this.name = "MakcikSourceError";
    this.violations = violations || [];
  }
}

function loadEssays() {
  const raw = fs.readFileSync(ESSAYS_JSON, "utf8");
  // Clean header line if present
  const jsonText = raw.startsWith("//") ? raw.slice(raw.indexOf("\n") + 1) : raw;
  return JSON.parse(jsonText);
}

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
 * Computes deterministic Merkle leaf hash over sorted claim_register + sorted source_ledger.
 * Law 3: Excludes timestamps, layout, CSS, rendering code, and file mtimes.
 */
function computeCanonicalPayloadHash(piece) {
  const claimRegister = Array.isArray(piece.claim_register)
    ? piece.claim_register
        .slice()
        .sort((a, b) => (a.claim_id || "").localeCompare(b.claim_id || ""))
    : [];

  const sourceLedger = Array.isArray(piece.source_ledger)
    ? piece.source_ledger
        .slice()
        .sort((a, b) => (a.source_id || "").localeCompare(b.source_id || ""))
    : [];

  const payload = JSON.stringify({
    id: piece.id,
    slug: piece.dest ? piece.dest.path : "",
    claim_register: claimRegister,
    source_ledger: sourceLedger,
  });

  return crypto.createHash("sha256").update(payload).digest("hex");
}

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
      "MakcikGPT canonical subset is empty — essays.json must contain at least one BM + onsite entry under /world/makcikgpt/",
    );
  }

  const seenIds = new Map();
  const seenPaths = new Map();

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const where = `entry[${i}] (id=${p && p.id})`;

    for (const f of ["id", "title", "date", "lang"]) {
      const v = requiredFieldViolation(p, f);
      if (v) violations.push(`${where}: ${v}`);
    }

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

  // Graduated Provenance Enforcement (Law 2 / B2 Guard)
  for (const p of pieces) {
    const status = p.provenance_status || "legacy";
    if (status === "sealed") {
      if (!Array.isArray(p.claim_register) || p.claim_register.length === 0) {
        const msg = `Sealed article "${p.id}" missing required claim_register entries`;
        if (throwOnError) throw new MakcikSourceError(msg, [msg]);
        violations.push(msg);
      }
      for (const claim of p.claim_register || []) {
        if (claim.maruah_review === "pending") {
          const msg = `Sealed article "${p.id}" claim "${claim.claim_id}" has pending maruah_review — requires F13 sign-off`;
          if (throwOnError) throw new MakcikSourceError(msg, [msg]);
          violations.push(msg);
        }
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

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes("--test-hash-idempotency")) {
    const { pieces } = getMakcikSource();
    const piece = pieces[0];
    const h1 = computeCanonicalPayloadHash(piece);
    const h2 = computeCanonicalPayloadHash(piece);
    if (h1 !== h2) {
      console.error("✗ NON-DETERMINISTIC HASH DETECTED");
      process.exit(1);
    }
    console.log(`✓ Hash idempotency confirmed: ${h1}`);
    process.exit(0);
  }
  if (args.includes("--enforce-sealed-gate")) {
    try {
      getMakcikSource();
      console.log("✓ Sealed article provenance gate passed.");
      process.exit(0);
    } catch (e) {
      console.error(`✗ SEALED GATE FAILED: ${e.message}`);
      process.exit(1);
    }
  }
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
  computeCanonicalPayloadHash,
};