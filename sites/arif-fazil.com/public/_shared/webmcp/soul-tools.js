/**
 * arif-fazil.com WebMCP Tools
 * Ring: SOUL (Ψ) — Human Identity Surface
 * Site: arif-fazil.com
 * Phase 1: Read-only identity/context tools (reversible, safe)
 */

arifosWebMCP.registerTools([

  // ── Tool 1: Sovereign Identity ──────────────────────────────────
  {
    name: 'get_sovereign_identity',
    description: 'Retrieve canonical identity of Arif Fazil — role, scars, Trinity architecture, and operating principles from llms.txt',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      const r = await fetch('/llms.txt', { cache: 'no-store' });
      const text = await r.text();
      return { content: [{ type: 'text', text }] };
    }
  },

  // ── Tool 2: Federation Map ──────────────────────────────────────
  {
    name: 'get_federation_map',
    description: 'Get the arifOS federation site map — all organ URLs, MCP endpoints, and governance surfaces',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute() {
      return {
        sovereign: 'Arif Fazil — F13 veto holder',
        organs: {
          governance: 'https://arifos.arif-fazil.com',
          control: 'https://aaa.arif-fazil.com',
          earth: 'https://geox.arif-fazil.com',
          capital: 'https://wealth.arif-fazil.com',
          substrate: 'https://well.arif-fazil.com',
          forge: 'https://forge.arif-fazil.com',
          mcp: 'https://mcp.arif-fazil.com/mcp',
        },
        motto: 'DITEMPA BUKAN DIBERI — Forged, Not Given',
      };
    }
  },

  // ── Tool 3: Humans Behind arifOS ───────────────────────────────
  {
    name: 'get_humans',
    description: 'Retrieve humans.txt — people, technology stack, and acknowledgments behind arif-fazil.com',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      const r = await fetch('/humans.txt', { cache: 'no-store' });
      const text = await r.text();
      return { content: [{ type: 'text', text }] };
    }
  },

]);

console.log('[arif-fazil.com] WebMCP tools registered: get_sovereign_identity, get_federation_map, get_humans');
