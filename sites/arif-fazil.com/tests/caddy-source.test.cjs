const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CADDYFILE = path.resolve(__dirname, "../../../deploy/Caddyfile");
const source = fs.readFileSync(CADDYFILE, "utf8");

function block(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.notEqual(from, -1, `missing block start: ${start}`);
  assert.notEqual(to, -1, `missing block end: ${end}`);
  return source.slice(from, to);
}

test("legacy MakcikGPT bot route serves generated HTML before browser redirect", () => {
  const site = block("arif-fazil.com {", "arifos.arif-fazil.com {");
  const handler = site.indexOf("@legacy_makcik_bot");
  const redirect = site.indexOf("redir @wealth_makcik_browser_root");
  assert.ok(handler >= 0 && redirect > handler);
  assert.match(site, /root \* \/var\/www\/html\/arif\/makcikgpt-md/);
  assert.match(site, /try_files \{path\} \{path\}\.html \/index\.html/);
  assert.match(
    site,
    /@wealth_makcik_browser_root \{[\s\S]*not header_regexp User-Agent[\s\S]*\}/,
  );
});

test("canonical redirects and wiki mapping are explicit", () => {
  assert.match(source, /handle \/arifos \{\s*redir \/arifos\/ 308\s*\}/);
  assert.match(source, /redir \/999\/verify\/ \/999\/verify 308/);
  assert.match(source, /redir \/wiki \/wiki\/ 308/);
  assert.match(source, /handle_path \/wiki\/\* \{\s*root \* \/var\/www\/html\/wiki/);
  assert.match(source, /@wiki_prefixed path \/wiki \/wiki\/\*/);
  assert.doesNotMatch(source, /arifos\.arif-fazil\.com\/wiki\/wiki/);
});

test("commodity API handlers precede static dashboard handlers", () => {
  for (const [name, port] of [["gold", 3456], ["oil", 3457], ["gas", 3458]]) {
    const directApi = source.indexOf(`path /${name}/api/*`);
    const directStatic = source.indexOf(`handle /${name}/*`, directApi);
    assert.ok(directApi >= 0 && directStatic > directApi, `${name} direct API must precede static route`);
    const segment = source.slice(directApi, directStatic);
    assert.match(segment, new RegExp(`reverse_proxy localhost:${port}`));
  }
});

test("static matcher and vhost truth stay source-backed", () => {
  assert.match(source, /@root_static path[^\n]*\/AGENTS\.md/);
  assert.doesNotMatch(source, /@root_static path[^\n]*\/agents\.md/);
  const discovery = source.match(/^[\t ]*@observatory_discovery path[^\n]+/m);
  assert.ok(discovery, "expected @observatory_discovery path matcher");
  const discoveryPaths = (discovery[0].match(/\/\.well-known\/[^\s/]+/g) || []).map((p) => p.replace(/^\/.well-known\//, ""));
  for (const obsolete of ["observatory.json", "arifos-federation.json"]) {
    assert.ok(!discoveryPaths.includes(obsolete), `obsolete ${obsolete} must not be advertised`);
  }
  for (const runtimeArtifact of [
    "observatory-snapshot-latest.json",
    "observatory_signing_key.pub.pem",
    "did-arifos-observatory.json",
    "did.json",
  ]) {
    assert.ok(discoveryPaths.includes(runtimeArtifact), `observatory discovery must list ${runtimeArtifact}`);
  }
  assert.doesNotMatch(source, /^ai\.arif-fazil\.com \{/m);
  assert.doesNotMatch(source, /^app\.arif-fazil\.com \{/m);

  const sharedRoots = [...source.matchAll(/root \* ([^\n]*_shared[^\n]*)/g)].map((match) => match[1].trim());
  assert.ok(sharedRoots.length >= 1);
  assert.deepEqual(new Set(sharedRoots), new Set(["/var/www/html/_shared"]));
});

test("main-site fallback retains a real 404", () => {
  const site = block("arif-fazil.com {", "arifos.arif-fazil.com {");
  assert.match(site, /respond "404 — Not Found" 404/);
});
