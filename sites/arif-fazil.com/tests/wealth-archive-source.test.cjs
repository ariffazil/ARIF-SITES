const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  INDEX_PATH,
  SITE_ROOT,
  buildArchiveIndex,
  loadArchiveEntries,
  renderArchiveIndex,
} = require("../scripts/generate-wealth-archive-index.cjs");

const LATEST_PATH = path.join(SITE_ROOT, "public/data/wealth/latest.json");
const ARCHIVE_DIR = path.join(SITE_ROOT, "public/data/wealth/archive");

test("archive_index exactly matches source archive filenames", () => {
  const entries = loadArchiveEntries();
  const expected = buildArchiveIndex(entries);
  const actual = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));

  assert.deepEqual(actual, expected);
  assert.deepEqual(
    actual.briefings,
    [...actual.briefings].sort((a, b) => b.localeCompare(a)),
    "briefings must be newest first",
  );
});

test("archive_index render is byte-stable", () => {
  const expected = renderArchiveIndex(buildArchiveIndex(loadArchiveEntries()));
  assert.equal(fs.readFileSync(INDEX_PATH, "utf8"), expected);
});

test("latest.json matches the newest archived briefing", () => {
  const [newest] = loadArchiveEntries();
  const newestPath = path.join(ARCHIVE_DIR, `${newest.date}.json`);
  assert.deepEqual(
    JSON.parse(fs.readFileSync(LATEST_PATH, "utf8")),
    JSON.parse(fs.readFileSync(newestPath, "utf8")),
  );
});
