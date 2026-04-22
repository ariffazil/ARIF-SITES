// arifOS MCP API Client
// Bridges static frontend to dynamic MCP backend

const MCP_BASE_URL = import.meta.env.VITE_MCP_URL || 'https://arifosmcp.arif-fazil.com';
const API_VERSION = 'v1';

export interface Vitals {
  cpu: number;
  memory: number;
  entropy: number;
  reversibility: number;
  omega: number;
  timestamp: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: object;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

export interface ConstitutionState {
  version: string;
  activeFloors: string[];
  primaryFloor: string;
  omegaZero: number;
}

// Health check
export async function checkHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// Get live vitals
export async function getVitals(): Promise<Vitals> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/vitals`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch vitals: ${res.status}`);
  return res.json();
}

// Get available tools
export async function getTools(): Promise<Tool[]> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/tools`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch tools: ${res.status}`);
  return res.json();
}

// Execute a tool
export async function executeTool<T = unknown>(
  toolName: string,
  params: object
): Promise<T> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/tools/${toolName}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Tool execution failed: ${res.status}`);
  return res.json();
}

// Get recent logs
export async function getLogs(limit: number = 50): Promise<LogEntry[]> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/logs?limit=${limit}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);
  return res.json();
}

// Get constitutional state
export async function getConstitution(): Promise<ConstitutionState> {
  const res = await fetch(`${MCP_BASE_URL}/api/${API_VERSION}/constitution`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch constitution: ${res.status}`);
  return res.json();
}

// WebSocket connection for real-time updates
export function connectWebSocket(
  onMessage: (data: unknown) => void,
  onError?: (error: Event) => void
): WebSocket {
  const wsUrl = MCP_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
  const ws = new WebSocket(`${wsUrl}/ws`);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  };
  
  ws.onerror = onError || ((e) => console.error('WebSocket error:', e));
  
  return ws;
}
