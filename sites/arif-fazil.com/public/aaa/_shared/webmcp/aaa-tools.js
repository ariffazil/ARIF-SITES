/**
 * AAA Cockpit WebMCP Tools
 * Ring: BODY (Δ) — Agent Control Plane Surface
 * Site: aaa.arif-fazil.com
 * Phase 1: Read-only agent/control tools (reversible, safe)
 */

arifosWebMCP.registerTools([

  // ── Tool 1: A2A Agent Card ──────────────────────────────────────
  {
    name: 'get_agent_card',
    description: 'Retrieve the AAA Gateway A2A v1.0.0 agent card — capabilities, skills, authentication schemes, and governance posture',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      const r = await fetch('/a2a/agent-card.json', { cache: 'no-store' });
      return await r.json();
    }
  },

  // ── Tool 2: Active Agents ───────────────────────────────────────
  {
    name: 'get_active_agents',
    description: 'List currently active and connected agents in the AAA federation mesh with status and capability summary',
    inputSchema: { type: 'object', properties: {}, required: [] },
    async execute() {
      try {
        const r = await fetch('/a2a/agent-card.json', { cache: 'no-store' });
        const card = await r.json();
        return {
          gateway: card.name || 'AAA Gateway',
          version: card.version || 'v1.0.0',
          skills: (card.skills || []).map(s => s.name),
          protocols: card.protocols || ['A2A v1.0.0'],
          governance: 'F1-F13 enforced, 888_JUDGE required for execution',
        };
      } catch (e) {
        return { error: e.message, hint: 'AAA A2A gateway may be starting' };
      }
    }
  },

  // ── Tool 3: AAA Governance Model ──────────────────────────────
  {
    name: 'explain_governance',
    description: 'Explain the AAA constitutional governance model — 13 floors, verdict system, VAULT999 audit, and A2A protocol boundaries',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute() {
      return {
        summary: 'AAA enforces arifOS constitutional Floors F1-F13 on all A2A task routing. No agent self-approves.',
        floors_active: 13,
        verdicts: { SEAL: 'Approved', HOLD: 'Human review required', VOID: 'Rejected', SABAR: 'Pause and re-ground' },
        vault: 'VAULT999 — append-only, hash-chained',
        motto: 'Capability without governance is catastrophe',
      };
    }
  },

]);

console.log('[AAA Cockpit] WebMCP tools registered: get_agent_card, get_active_agents, explain_governance');
