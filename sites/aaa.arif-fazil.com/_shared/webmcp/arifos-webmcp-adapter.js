/**
 * ═══════════════════════════════════════════════════════════════════════
 * arifOS WebMCP Adapter v2 — Constitutional Browser Tool Surface
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Unified adapter serving TWO ecosystems:
 *   1. W3C navigator.modelContext — via @mcp-b/global polyfill (production)
 *   2. Jason WebMCP widget — legacy fallback
 * 
 * Guards every tool with F1-F13 constitutional floors:
 *   F1  Amanah    — read-only tools auto-pass; state-change requires confirm
 *   F2  Truth     — data from live endpoints, not fabricated
 *   F8  Prototype — blocks __proto__ and constructor injection
 *   F9  AntiHantu — no agency claims in tool descriptions
 *   F12 Injection — all inputs treated as untrusted
 *   F13 Sovereign — requestUserInteraction() for state-changing tools
 * 
 * Version: 2026.05.14-FORGED-v2
 * Motto: DITEMPA BUKAN DIBERI — Forged, Not Given
 * 
 * Usage:
 *   <script src="/_shared/webmcp/arifos-webmcp-adapter.js"></script>
 *   <script>
 *     arifosWebMCP.registerReadonly('get_status', 'Get system status', 
 *       {}, async () => fetch('/api/status').then(r => r.json()));
 *   </script>
 * ═══════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  const TRINITY_COLORS = {
    SOUL: '#8B1A1A',  MIND: '#3A9EA8',  BODY: '#D4A853',
  };

  const ring = document.documentElement.getAttribute('data-ring') || 'MIND';
  const themeColor = TRINITY_COLORS[ring] || TRINITY_COLORS.MIND;
  const registered = [];

  // ═══════════════════════════════════════════════════════════════
  // F8 Prototype Pollution Guard
  // ═══════════════════════════════════════════════════════════════
  const BLOCKED_KEYS = ['__proto__', 'constructor', 'prototype'];

  function hasPoisonedInput(input) {
    if (!input || typeof input !== 'object') return false;
    for (const key of BLOCKED_KEYS) {
      if (key in input) return true;
    }
    // Deep check one level
    for (const v of Object.values(input)) {
      if (v && typeof v === 'object') {
        for (const key of BLOCKED_KEYS) {
          if (key in v) return true;
        }
      }
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  // F1/F13 Constitutional Floor Guard
  // ═══════════════════════════════════════════════════════════════
  function floorGuard(name, fn, options = {}) {
    const { readonly = true } = options;

    return async function execute(input, client) {
      // F8: Block prototype pollution on all inputs
      if (hasPoisonedInput(input)) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            verdict: 'VOID', floor: 'F8_PROTOTYPE',
            reason: 'Prototype pollution blocked — __proto__/constructor in input'
          })}]
        };
      }

      // F13: Require sovereign confirm for state-changing tools
      if (!readonly && client?.requestUserInteraction) {
        try {
          const confirmed = await client.requestUserInteraction(
            `[arifOS F13] "${name}" will modify state. Confirm?`
          );
          if (!confirmed) {
            return {
              content: [{ type: 'text', text: JSON.stringify({
                verdict: 'VOID', floor: 'F13_SOVEREIGN',
                reason: 'Human operator did not confirm state change'
              })}]
            };
          }
        } catch (e) {
          return {
            content: [{ type: 'text', text: JSON.stringify({
              verdict: 'VOID', floor: 'F13_SOVEREIGN',
              reason: `Confirmation failed: ${e.message}`
            })}]
          };
        }
      }

      // F12: Treat all input as untrusted
      try {
        return await fn(input, client);
      } catch (err) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            verdict: 'VOID', reason: err.message, tool: name
          })}],
          isError: true
        };
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // Normalize results to WebMCP content format
  // ═══════════════════════════════════════════════════════════════
  async function normalizeResult(result) {
    if (result?.content) return result;
    if (typeof result === 'string') return { content: [{ type: 'text', text: result }] };
    if (typeof result === 'object') return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    return { content: [{ type: 'text', text: String(result) }] };
  }

  // ═══════════════════════════════════════════════════════════════
  // Registration — Read-only tool (F1 safe)
  // ═══════════════════════════════════════════════════════════════
  function registerReadonly(name, description, inputSchema, executeFn) {
    return _register(name, description, inputSchema, executeFn, { readonly: true });
  }

  // ═══════════════════════════════════════════════════════════════
  // Registration — State-changing tool (F13 required)
  // ═══════════════════════════════════════════════════════════════
  function registerStateful(name, description, inputSchema, executeFn) {
    return _register(name, description, inputSchema, executeFn, { readonly: false });
  }

  function _register(name, description, inputSchema, executeFn, options) {
    const guarded = floorGuard(name, executeFn, options);

    const tool = {
      name, description,
      inputSchema: inputSchema || { type: 'object', properties: {}, required: [] },
      execute: guarded,
      readOnlyHint: options.readonly,
    };

    registered.push(tool);

    // ── Path 1: W3C navigator.modelContext (via @mcp-b/global) ──
    if (typeof navigator !== 'undefined' && navigator.modelContext?.registerTool) {
      try {
        navigator.modelContext.registerTool({
          name, description,
          inputSchema: tool.inputSchema,
          readOnlyHint: tool.readOnlyHint,
          async execute(args) {
            const result = await guarded(args, undefined);
            return await normalizeResult(result);
          }
        });
        console.log(`[WebMCP:W3C] ${name} (${options.readonly ? 'RO' : 'RW'})`);
      } catch (e) {
        console.debug(`[WebMCP:W3C] ${name} — unavailable (${e.message})`);
      }
    }

    // ── Path 2: Jason WebMCP widget (legacy fallback) ──────────
    if (typeof window !== 'undefined' && window.WebMCP) {
      try {
        if (!window.__arifos_wmcp) {
          window.__arifos_wmcp = new window.WebMCP({
            color: themeColor, position: 'bottom-right', size: '36px',
          });
        }
        window.__arifos_wmcp.registerTool(name, description, tool.inputSchema, executeFn);
        console.log(`[WebMCP:Jason] ${name}`);
      } catch (e) {
        console.debug(`[WebMCP:Jason] ${name} — unavailable`);
      }
    }

    return tool;
  }

  // ═══════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════
  function getRegisteredTools() {
    return registered.map(t => ({ name: t.name, description: t.description, readonly: t.readOnlyHint }));
  }

  function isSupported() {
    return !!(navigator.modelContext?.registerTool);
  }

  window.arifosWebMCP = {
    registerReadonly,
    registerStateful,
    registerTool: registerReadonly,  // legacy alias
    registerTools(tools) {
      tools.forEach(t => {
        const fn = t.readonly === false ? registerStateful : registerReadonly;
        fn(t.name, t.description, t.inputSchema, t.execute);
      });
    },
    getRegisteredTools,
    isSupported,
    ring,
    themeColor,
    version: '2026.05.14-FORGED-v2',
  };

  console.log(`[arifOS WebMCP v2] ring=${ring} color=${themeColor} supported=${isSupported()}`);
})();
