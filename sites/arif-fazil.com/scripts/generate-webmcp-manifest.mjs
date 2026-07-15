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
  }));
const dropped = results
  .filter(({ probe }) => !probe.ok)
  .map(({ tool, probe }) => ({
    name: tool.name,
    endpoint: tool.endpoint,
    status: probe.status,
    error: probe.error,
  }));

const manifest = {
  name: 'arif-fazil.com WebMCP Surface',
  version: '1.1',
  description:
    'Browser-native agent tool surface for arif-fazil.com, governed by arifOS constitutional floors F1-F13.',
  sovereign: 'did:web:arif-fazil.com',
  constitutional_kernel: 'https://arifos.arif-fazil.com',
  mcp_endpoint: 'https://mcp.arif-fazil.com/mcp',
  adapter_script: '/_shared/webmcp/arifos-webmcp-adapter.js',
  generated_at: verifiedAt,
  tools: published,
  constraints: {
    read_only: true,
    requires_sovereign_confirm: false,
    floor_guards: ['F1', 'F2', 'F8', 'F9', 'F12', 'F13'],
  },
  dropped: dropped,
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `[webmcp] wrote ${OUT} (published=${published.length}, dropped=${dropped.length})`
);
for (const d of dropped) {
  console.warn(`[webmcp] DROPPED ${d.name} -> ${d.endpoint} status=${d.status ?? 'n/a'}`);
}
