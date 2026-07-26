#!/usr/bin/env node
/**
 * Generate public/data/wealth/archive_index.json from archived briefing files.
 *
 * The archive directory is the source of truth. The newest briefing's
 * meta.generated_at timestamp becomes last_updated, making repeated runs
 * byte-stable and preventing a clock-only diff.
 */

const fs = require("node:fs");
const path = require("node:path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ARCHIVE_DIR = path.join(SITE_ROOT, "public/data/wealth/archive");
const INDEX_PATH = path.join(SITE_ROOT, "public/data/wealth/archive_index.json");
const DATE_FILE_RE = /^(\d{4}-\d{2}-\d{2})\.json$/;

function loadArchiveEntries() {
  return fs
    .readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && DATE_FILE_RE.test(entry.name))
    .map((entry) => {
      const date = entry.name.match(DATE_FILE_RE)[1];
      const filePath = path.join(ARCHIVE_DIR, entry.name);
      let briefing;
      try {
        briefing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (error) {
        throw new Error(`${path.relative(SITE_ROOT, filePath)} is not valid JSON: ${error.message}`);
      }
      if (!briefing.meta || typeof briefing.meta.generated_at !== "string" || briefing.meta.generated_at.length === 0) {
        throw new Error(
          `${path.relative(SITE_ROOT, filePath)} meta.generated_at must be a non-empty string`,
        );
      }
      return { date, generatedAt: briefing.meta.generated_at };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildArchiveIndex(entries) {
  if (entries.length === 0) {
    throw new Error("wealth archive is empty");
  }
  return {
    briefings: entries.map((entry) => entry.date),
    last_updated: entries[0].generatedAt,
  };
}

function renderArchiveIndex(index) {
  return `${JSON.stringify(index, null, 2)}\n`;
}

function main() {
  const entries = loadArchiveEntries();
  const output = renderArchiveIndex(buildArchiveIndex(entries));
  fs.writeFileSync(INDEX_PATH, output, "utf8");
  console.log(
    `✓ Wrote ${entries.length} briefings → ${path.relative(SITE_ROOT, INDEX_PATH)}`,
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  ARCHIVE_DIR,
  INDEX_PATH,
  SITE_ROOT,
  buildArchiveIndex,
  loadArchiveEntries,
  renderArchiveIndex,
};
