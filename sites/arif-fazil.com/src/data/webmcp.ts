/**
 * src/data/webmcp.ts — Canonical WebMCP tool registry for arif-fazil.com.
 *
 * Single source of truth for browser-native agent tools. Every entry
 * must reference a live endpoint that has been probed. The generated
 * manifest (`public/.well-known/webmcp.json`) is built from this list.
 *
 * Adding a tool here is a documented act: it declares a public read-only
 * surface and is not a substitute for a real backend. The `verify`
 * field is checked at build time against the live `tools/list` count.
 */
export type WebMCPTool = {
  /** Stable identifier; matches `name` in the generated manifest. */
  name: string;
  /** Plain-language description surfaced to agents. */
  description: string;
  /** Public endpoint that returns the payload. */
  endpoint: string;
  /** HTTP method. Default GET. */
  method?: 'GET' | 'POST';
  /** Optional path/header template. */
  params?: Record<string, string>;
  /** Floor the tool answers to; informational. */
  floor?: 'F2' | 'F4' | 'F8' | 'F11' | 'F12';
  /** When this entry was last probed successfully. */
  last_verified?: string;
  /** `true` when the endpoint was probed at build time. */
  verified?: boolean;
  /**
   * When set, the tool is intentionally deferred from the generated
   * manifest. The endpoint is documented but not yet wired; treat as
   * a placeholder rather than a live tool.
   */
  endpoint_status?: 'live' | 'deferred' | 'removed';
  /** Human-readable reason for non-live entries. */
  deferred_reason?: string;
};

export const SOUL_WEB_MCP_TOOLS: WebMCPTool[] = [
  {
    name: 'get_federation_status',
    description: 'Live health status of all arifOS federation organs',
    endpoint: 'https://arif-fazil.com/api/organs',
    method: 'GET',
    floor: 'F2',
    endpoint_status: 'deferred',
    deferred_reason: 'No public health proxy endpoint; remove when organ status route is wired through arifOS /api/organs/*',
  },
  {
    name: 'get_wealth_briefing',
    description: 'Live AI-generated market briefing across the federated asset set',
    endpoint: 'https://arif-fazil.com/wealth/api/wealth/briefing',
    method: 'GET',
    floor: 'F2',
    endpoint_status: 'deferred',
    deferred_reason: 'No WEALTH briefing route yet; the WEALTH organ exposes capital_* tools over MCP instead',
  },
  {
    name: 'verify_did',
    description: 'W3C DID document for did:web:arif-fazil.com',
    endpoint: 'https://arif-fazil.com/.well-known/did.json',
    method: 'GET',
    floor: 'F2',
    verified: true,
  },
  {
    name: 'get_constitution',
    description: 'arifOS constitutional floor definitions (F1-F13)',
    endpoint: 'https://arifos.arif-fazil.com/constitution.json',
    method: 'GET',
    floor: 'F2',
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
  {
    name: 'get_market_overview',
    description: 'Live multi-asset market overview across 7 federated assets',
    endpoint: 'https://arif-fazil.com/wealth/api/wealth/overview',
    method: 'GET',
    floor: 'F2',
    endpoint_status: 'deferred',
    deferred_reason: 'No overview route yet; same path family as briefing, awaits WEALTH surface',
  },
  {
    name: 'get_market_ticker',
    description: 'Quick price ticker for all 7 federated assets',
    endpoint: 'https://arif-fazil.com/wealth/api/wealth/ticker',
    method: 'GET',
    floor: 'F2',
    endpoint_status: 'deferred',
    deferred_reason: 'No ticker route yet',
  },
  {
    name: 'get_asset_detail',
    description: 'Detailed analysis for a specific federated asset',
    endpoint: 'https://arif-fazil.com/wealth/api/wealth/{asset}',
    method: 'GET',
    floor: 'F2',
    params: { asset: 'gold|sp500|nasdaq|bitcoin|dxy|oil|us10y' },
    endpoint_status: 'deferred',
    deferred_reason: 'No per-asset detail route yet',
  },
];
