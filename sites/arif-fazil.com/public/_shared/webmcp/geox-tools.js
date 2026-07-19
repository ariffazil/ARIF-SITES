/**
 * GEOX WebMCP Tools
 * Ring: MIND (Ω) — Earth Intelligence Surface
 * Site: geox.arif-fazil.com
 * Phase 1: Read-only earth evidence tools (reversible, safe)
 */

arifosWebMCP.registerTools([

  // ── Tool 1: GEOX Health ───────────────────────────────────────
  {
    name: 'geox_get_health',
    description: 'Get GEOX organ health status — tool count, version, physics-9 compliance flag, MCP surface status',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      const r = await fetch('/health', { cache: 'no-store' });
      return await r.json();
    }
  },

  // ── Tool 2: Tool List ──────────────────────────────────────────
  {
    name: 'geox_get_tools',
    description: 'List all 15 GEOX MCP tools with descriptions — subsurface interpretation, petrophysics, well logs, seismic inversion',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      try {
        const r = await fetch('/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
        });
        return await r.json();
      } catch (e) {
        return { error: e.message, hint: 'GEOX MCP may require session initialization' };
      }
    }
  },

  // ── Tool 3: Earth Witness Status ──────────────────────────────
  {
    name: 'geox_get_witness_status',
    description: 'Get GEOX earth witness status — evidence grounding state, physics-9 compliance, claim verification posture',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      const r = await fetch('/health', { cache: 'no-store' });
      const health = await r.json();
      return {
        organ: 'GEOX — Earth Intelligence Ψ Node',
        status: health.status || 'unknown',
        physics_9: health.physics_9 ?? true,
        claim_policy: 'HYPOTHESIS until evidence verified — no false certainty',
        witness_role: 'Earth evidence preparation — geoscience, petrophysics, physics-9',
        motto: 'Reality matters. Data matters. Depth matters. Evidence matters.',
      };
    }
  },

]);

console.log('[GEOX] WebMCP tools registered: geox_get_health, geox_get_tools, geox_get_witness_status');
