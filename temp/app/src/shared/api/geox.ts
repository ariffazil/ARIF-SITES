// GEOX API Client
// Geological intelligence coprocessor integration

const GEOX_BASE_URL = import.meta.env.VITE_GEOX_URL || 'https://geox.arif-fazil.com';
const API_VERSION = 'v1';

export interface Material {
  id: string;
  name: string;
  type: string;
  properties: {
    density: number;
    porosity: number;
    permeability: number;
  };
}

export interface InterpretationResult {
  id: string;
  input: object;
  output: object;
  confidence: number;
  timestamp: string;
}

export interface AtlasEntry {
  id: string;
  basin: string;
  formation: string;
  age: string;
  lithology: string;
  coordinates: [number, number];
}

export interface PhysicsResult {
  calculation: string;
  inputs: object;
  result: number;
  units: string;
}

// Health check
export async function checkHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// Get material database
export async function getMaterials(): Promise<Material[]> {
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/materials`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`);
  return res.json();
}

// Run geological interpretation
export async function runInterpretation(
  wellData: object,
  parameters: object
): Promise<InterpretationResult> {
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/interpret`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ wellData, parameters }),
  });
  if (!res.ok) throw new Error(`Interpretation failed: ${res.status}`);
  return res.json();
}

// Get atlas data
export async function getAtlas(
  basin?: string,
  formation?: string
): Promise<AtlasEntry[]> {
  const params = new URLSearchParams();
  if (basin) params.append('basin', basin);
  if (formation) params.append('formation', formation);
  
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/atlas?${params}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch atlas: ${res.status}`);
  return res.json();
}

// Run physics calculation
export async function calculatePhysics(
  calculation: string,
  inputs: object
): Promise<PhysicsResult> {
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/calculate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ calculation, inputs }),
  });
  if (!res.ok) throw new Error(`Calculation failed: ${res.status}`);
  return res.json();
}

// Get well log data
export async function getWellLog(wellId: string): Promise<{
  id: string;
  curves: Array<{
    name: string;
    unit: string;
    data: number[];
  }>;
  depth: number[];
}> {
  const res = await fetch(`${GEOX_BASE_URL}/api/${API_VERSION}/wells/${wellId}/log`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch well log: ${res.status}`);
  return res.json();
}
