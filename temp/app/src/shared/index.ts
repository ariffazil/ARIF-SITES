// Shared module exports - API
export {
  checkHealth as checkMcpHealth,
  getVitals,
  getTools,
  executeTool,
  getLogs,
  getConstitution,
  connectWebSocket,
} from './api/arifosmcp';

export {
  checkHealth as checkGeoxHealth,
  getMaterials,
  runInterpretation,
  getAtlas,
  calculatePhysics,
  getWellLog,
} from './api/geox';

// Types
export type {
  Vitals,
  Tool,
  LogEntry,
  ConstitutionState,
} from './api/arifosmcp';

export type {
  Material,
  InterpretationResult,
  AtlasEntry,
  PhysicsResult,
} from './api/geox';

// Hooks
export { useLiveVitals } from './hooks/useLiveVitals';
export { useGeoxMaterials, useGeoxAtlas } from './hooks/useGeox';
