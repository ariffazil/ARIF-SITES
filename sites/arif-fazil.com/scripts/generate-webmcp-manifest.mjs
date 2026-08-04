/**
 * scripts/generate-webmcp-manifest.mjs — Generate .well-known/webmcp.json
 * from the canonical SOUL_WEB_MCP_TOOLS registry.
 *
 * Probes every endpoint; tools whose endpoint does not respond are
 * dropped from the generated manifest. The source list is never mutated.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REGISTRY = resolve(ROOT, 'src/data/webmcp.ts');
const OUT = resolve(ROOT, 'public/.well-known/webmcp.json');

/** Tokenize the body of an array literal into a flat list of tokens. */
function tokenize(body) {
  const tokens = [];
  let i = 0;
  let buf = '';
  let quote = null;
  let escape = false;
  while (i < body.length) {
    const ch = body[i];
    if (quote) {
      if (escape) {
        buf += ch;
        escape = false;
      } else if (ch === '\\') {
        buf += ch;
        escape = true;
      } else if (ch === quote) {
        buf += ch;
        quote = null;
      } else {
        buf += ch;
      }
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
    } else if (ch === '/' && body[i + 1] === '/') {
      // line comment
      while (i < body.length && body[i] !== '\n') i += 1;
    } else if (ch === '/' && body[i + 1] === '*') {
      // block comment
      i += 2;
      while (i < body.length && !(body[i] === '*' && body[i + 1] === '/')) i += 1;
      i += 1;
    } else if ('{}[]:,'.includes(ch)) {
      if (buf.trim()) tokens.push(buf.trim());
      tokens.push(ch);
      buf = '';
    } else {
      buf += ch;
    }
    i += 1;
  }
  if (buf.trim()) tokens.push(buf.trim());
  return tokens;
}

/** Parse a TypeScript object literal source into a plain object. */
function parseObject(tokens) {
  if (tokens.shift() !== '{') return {};
  const obj = {};
  while (tokens.length && tokens[0] !== '}') {
    const keyTok = tokens.shift();
    const key = keyTok.replace(/^['"]|['"]$/g, '');
    if (tokens.shift() !== ':') throw new Error('expected ":" after key ' + key);
    if (tokens[0] === '{') {
      obj[key] = parseObject(tokens);
    } else if (tokens[0] === '[') {
      const arr = [];
      tokens.shift();
      while (tokens[0] !== ']') {
        const v = tokens.shift();
        arr.push(v.replace(/^['"]|['"]$/g, ''));
        if (tokens[0] === ',') tokens.shift();
      }
      tokens.shift();
      obj[key] = arr;
    } else {
      const v = tokens.shift();
      if (v === 'true') obj[key] = true;
      else if (v === 'false') obj[key] = false;
      else if (v === 'null' || v === 'undefined') obj[key] = null;
      else if (v !== undefined) obj[key] = v.replace(/^['"]|['"]$/g, '');
    }
    if (tokens[0] === ',') tokens.shift();
  }
  if (tokens[0] === '}') tokens.shift();
  return obj;
}

function loadRegistry() {
  const text = readFileSync(REGISTRY, 'utf8');
  const start = text.indexOf('export const SOUL_WEB_MCP_TOOLS');
  if (start < 0) throw new Error('SOUL_WEB_MCP_TOOLS not found in webmcp.ts');
  const arrStart = text.indexOf('[', start);
  const arrEnd = text.indexOf('];', arrStart);
  if (arrStart < 0 || arrEnd < 0) throw new Error('array bounds not found');
  const body = text.slice(arrStart + 1, arrEnd);
  const tokens = tokenize(body);
  const out = [];
  while (tokens.length) {
    if (tokens[0] === '{') out.push(parseObject(tokens));
    else tokens.shift();
  }
  return out;
}

async function probe(tool) {
  const url = tool.endpoint;
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (res.status < 200 || res.status >= 400) {
      res = await fetch(url, { method: 'GET', redirect: 'follow' });
    }
    if (res.status >= 200 && res.status < 400) return { ok: true, status: res.status };
    return { ok: false, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

const tools = loadRegistry();
const verifiedAt = new Date().toISOString();
const results = [];
for (const tool of tools) {
  const probeResult = await probe(tool);
  if (probeResult.ok) tool.last_verified = verifiedAt;
  results.push({ tool, probe: probeResult });
}
// F2: never publish tools that probe-fail. Never list 404 URLs as active ads.
const published = results
  .filter(({ probe }) => probe.ok)
  .map(({ tool }) => ({
    name: tool.name,
    description: tool.description,
    endpoint: tool.endpoint,
    method: tool.method ?? 'GET',
    ...(tool.params && Object.keys(tool.params).length ? { params: tool.params } : {}),
    floor: tool.floor,
    last_verified: tool.last_verified,
    status: 'live',
  }));
const failed = results
  .filter(({ probe }) => !probe.ok)
  .map(({ tool, probe }) => ({
    name: tool.name,
    endpoint: tool.endpoint,
    status: probe.status ?? 'error',
    error: probe.error,
    note: 'Excluded from tools[] — not advertised as live',
  }));

// Deferred list (names only — no fake endpoints)
let deferred = [];
try {
  const text = readFileSync(REGISTRY, 'utf8');
  const dStart = text.indexOf('export const SOUL_WEB_MCP_DEFERRED');
  if (dStart >= 0) {
    const arrStart = text.indexOf('[', dStart);
    const arrEnd = text.indexOf('];', arrStart);
    const body = text.slice(arrStart + 1, arrEnd);
    const tokens = tokenize(body);
    while (tokens.length) {
      if (tokens[0] === '{') {
        const obj = parseObject(tokens);
        deferred.push({
          name: obj.name,
          reason: obj.reason,
          intended_path: obj.intended_path,
          status: 'deferred',
        });
      } else tokens.shift();
    }
  }
} catch {
  deferred = [];
}

const manifest = {
  name: 'arif-fazil.com WebMCP Surface',
  version: '1.2',
  description:
    'Browser-native agent tool surface for arif-fazil.com. tools[] = LIVE only (F2). deferred[] = names without endpoints.',
  sovereign: 'did:web:arif-fazil.com',
  constitutional_kernel: 'https://arifos.arif-fazil.com',
  mcp_endpoint: 'https://mcp.arif-fazil.com/mcp',
  adapter_script: '/_shared/webmcp/arifos-webmcp-adapter.js',
  generated_at: verifiedAt,
  doctrine: {
    f2: 'Never advertise an endpoint that returns non-2xx',
    f3_witness: {
      vault: 'https://arif-fazil.com/999/verify',
      independent: 'https://aaa.arif-fazil.com/api/seal-chain/head',
    },
  },
  tools: published,
  deferred,
  // keep audit trail of probe failures without presenting them as tools
  excluded_failed_probes: failed,
  constraints: {
    read_only: true,
    requires_sovereign_confirm: false,
    floor_guards: ['F1', 'F2', 'F3', 'F8', 'F9', 'F11', 'F12', 'F13'],
  },
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `[webmcp] wrote ${OUT} (live=${published.length}, deferred=${deferred.length}, failed_probes=${failed.length})`
);
for (const d of failed) {
  console.warn(`[webmcp] EXCLUDED ${d.name} -> ${d.endpoint} status=${d.status ?? 'n/a'}`);
}
