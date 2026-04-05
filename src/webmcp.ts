/**
 * WebMCP Tools for the Forge portal.
 *
 * Purpose: expose discovery metadata and canonical routing without pretending
 * the portal itself is the source of every truth surface.
 */

import '@mcp-b/global';

// Wait for polyfill to be ready
if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
  const mcp = (navigator as any).modelContext;

  // Tool 1: get_llms_txt
  mcp.registerTool({
    name: 'get_llms_txt',
    description: 'Retrieve the canonical llms.txt context file - human identity, scars, operating principles, and Trinity architecture',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    async execute() {
      try {
        const response = await fetch('/llms.txt', { cache: 'no-store' });
        const text = await response.text();
        return {
          content: [{
            type: 'text',
            text: `# Forge Portal Context\n\n${text}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: Unable to fetch llms.txt - ${error}`
          }],
          isError: true
        };
      }
    }
  });

  // Tool 2: get_humans_txt
  mcp.registerTool({
    name: 'get_humans_txt',
    description: 'Retrieve humans.txt - people, technology stack, and acknowledgments behind arif-fazil.com',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    async execute() {
      try {
        const response = await fetch('/humans.txt', { cache: 'no-store' });
        const text = await response.text();
        return {
          content: [{
            type: 'text',
            text
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: Unable to fetch humans.txt - ${error}`
          }],
          isError: true
        };
      }
    }
  });

  // Tool 3: get_trinity_links
  mcp.registerTool({
    name: 'get_trinity_links',
    description: 'Return canonical Trinity architecture links (HUMAN, THEORY, APPS, BACKEND)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    async execute() {
      const trinity = {
        architecture: 'Trinity portal routing map',
        role: 'Forge is the orientation layer. It routes to the source-of-truth domains.',
        layers: {
          HUMAN: {
            url: 'https://arif-fazil.com',
            symbol: 'Δ',
            function: 'Human witness and identity',
            ai_context: 'https://arif-fazil.com/llms.txt'
          },
          THEORY: {
            url: 'https://apex.arif-fazil.com',
            symbol: 'Ψ',
            function: 'Constitutional doctrine and law',
            ai_context: 'https://apex.arif-fazil.com/llms.txt'
          },
          APPS: {
            url: 'https://arifos.arif-fazil.com',
            symbol: 'Ω',
            function: 'Kernel surfaces and governance apps',
            ai_context: 'https://arifos.arif-fazil.com/llms.txt'
          },
          BACKEND: {
            url: 'https://runtime.arif-fazil.com',
            docs: 'https://runtime.arif-fazil.com',
            mcp_endpoint: 'https://arifosmcp.arif-fazil.com/mcp',
            health: 'https://arifosmcp.arif-fazil.com/health',
            function: 'Runtime docs and MCP execution surface'
          },
          GEOX: {
            url: 'https://geox.arif-fazil.com',
            function: 'Earth witness and geoscience grounding'
          },
          SPECS: {
            url: 'https://specs.arif-fazil.com',
            function: 'Machine-readable contracts and schemas'
          }
        },
        motto: 'Ditempa Bukan Diberi (Forged, Not Given)',
        contact: 'arifos@arif-fazil.com'
      };

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(trinity, null, 2)
        }]
      };
    }
  });

  console.log('[WebMCP] Forge portal tools registered (3 read-only tools)');
}
