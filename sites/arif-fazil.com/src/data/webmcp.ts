/**
 * src/data/webmcp.ts — Canonical WebMCP tool registry for arif-fazil.com.
 *
 * F2: Only LIVE endpoints belong in SOUL_WEB_MCP_TOOLS.
 * Deferred ideas go in SOUL_WEB_MCP_DEFERRED (no public endpoint field) so
 * manifests never advertise 404 doors.
 */
export type WebMCPTool = {
  name: string;
  description: string;
  endpoint: string;
  method?: 'GET' | 'POST';
  params?: Record<string, string>;
  floor?: 'F2' | 'F3' | 'F4' | 'F8' | 'F11' | 'F12';
  last_verified?: string;
  verified?: boolean;
  endpoint_status?: 'live' | 'deferred' | 'removed';
  deferred_reason?: string;
};

/** Live browser tools only — probed into /.well-known/webmcp.json */
export const SOUL_WEB_MCP_TOOLS: WebMCPTool[] = [
  {
    name: 'verify_did',
    description: 'W3C DID document for did:web:arif-fazil.com',
    endpoint: 'https://arif-fazil.com/.well-known/did.json',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_floors',
    description: 'arifOS constitutional floor definitions (F1–F13) as floors.json',
    endpoint: 'https://arif-fazil.com/floors.json',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_missions',
    description: 'Six-mission human cockpit catalog (not 128 tools)',
    endpoint: 'https://arif-fazil.com/missions.json',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_llms_overview',
    description: 'Machine site overview for agents (llms.txt)',
    endpoint: 'https://arif-fazil.com/llms.txt',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_vault_verify',
    description: 'VAULT999 live chain proof (pair with AAA seal-chain head)',
    endpoint: 'https://arif-fazil.com/999/verify',
    method: 'GET',
    floor: 'F11',
    verified: true,
  },
  {
    name: 'get_seal_chain_head',
    description: 'Independent AAA witness of seal chain head (F3 cross-verify)',
    endpoint: 'https://aaa.arif-fazil.com/api/seal-chain/head',
    method: 'GET',
    floor: 'F3',
    verified: true,
  },
  {
    name: 'get_gold_price',
    description: 'Latest XAUUSD gold price, RSI, signal, EMA values',
    endpoint: 'https://arif-fazil.com/wealth/gold/api/gold/ticker',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_gold_history',
    description: 'XAUUSD OHLCV candlestick data with EMA and RSI indicators',
    endpoint: 'https://arif-fazil.com/wealth/gold/api/gold/history',
    method: 'GET',
    floor: 'F2',
    params: { interval: '1h', period: '30d' },
    verified: true,
  },
  {
    name: 'get_gold_signals',
    description: 'Latest XAUUSD trading signal with confluence analysis',
    endpoint: 'https://arif-fazil.com/wealth/gold/api/gold/signals',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_gold_levels',
    description: 'XAUUSD support and resistance levels from multiple timeframes',
    endpoint: 'https://arif-fazil.com/wealth/gold/api/gold/levels',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_gold_macro',
    description: 'Macro context for gold: DXY, VIX, US10Y, silver, gold/silver ratio',
    endpoint: 'https://arif-fazil.com/wealth/gold/api/gold/macro',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
];

/**
 * Deferred capabilities — documentation only.
 * Must NOT appear as tools[] endpoints until wired.
 */
export const SOUL_WEB_MCP_DEFERRED: Array<{
  name: string;
  reason: string;
  intended_path?: string;
}> = [
  {
    name: 'get_federation_status',
    reason: 'No public organ health matrix on apex domain yet',
    intended_path: '/api/organs',
  },
  {
    name: 'get_wealth_briefing',
    reason: 'WEALTH briefing is MCP compute, not a public REST route',
    intended_path: '/wealth/api/wealth/briefing',
  },
  {
    name: 'get_market_overview',
    reason: 'No multi-asset overview REST route',
    intended_path: '/wealth/api/wealth/overview',
  },
  {
    name: 'get_market_ticker',
    reason: 'No federated ticker REST route',
    intended_path: '/wealth/api/wealth/ticker',
  },
  {
    name: 'get_asset_detail',
    reason: 'No per-asset detail REST route',
    intended_path: '/wealth/api/wealth/{asset}',
  },
];
