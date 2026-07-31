/**
 * Six human missions — cockpit surface for arif-fazil.com / arifOS.
 *
 * Doctrine (2026-07-30): humans do not pick tools. Humans state missions.
 * Agents select instruments. Tool Explorer is engine room, not cockpit.
 * Metric to minimize: how often Arif must know which tool was used.
 */

export type MissionId =
  | 'investigate'
  | 'interpret'
  | 'decide'
  | 'build'
  | 'monitor'
  | 'remember';

export type Mission = {
  id: MissionId;
  verb: string;
  oneLine: string;
  humanSays: string;
  federationDoes: string;
  /** Primary organ(s) — routing hint only; not a tool menu */
  organs: string[];
  /** Example human entry points on this site (paths or absolute URLs) */
  surfaces: { label: string; href: string }[];
  /** Kernel verbs that typically fire — plumbing, not cockpit */
  kernelHint: string;
};

export const MISSION_DOCTRINE = {
  title: 'Six missions. Not 128 tools.',
  thesis:
    'You state the problem. The federation chooses the instruments, challenges the result, and returns only what matters.',
  humanOnly: [
    'State what you want',
    'Supply evidence or data',
    'Examine the conclusion and uncertainty',
    'Approve or reject consequential action',
  ] as const,
  engineRoom:
    'Tool Explorer, registries, and raw MCP catalogs are for developers, audits, and debugging — not daily sovereign work.',
  survivalRule:
    'Used in a tested workflow → KEEP · Overlapping → MERGE AS MODE · Internal compute → HIDE · Alias → SDK ONLY · No workflow → REMOVE',
  metric:
    'How often did Arif need to know which tool was used? Target: zero.',
  sealed: '2026-07-30',
} as const;

export const MISSIONS: Mission[] = [
  {
    id: 'investigate',
    verb: 'Investigate',
    oneLine: 'Gather and test reality',
    humanSays: 'What is actually true here — and what would falsify it?',
    federationDoes:
      'Ingest data, QC, probe live state, surface contradictions before narrative hardens.',
    organs: ['GEOX', 'WEALTH', 'arifOS'],
    surfaces: [
      { label: 'Earth wells', href: '/earth' },
      { label: 'PETRONAS VITALS', href: '/wealth/vitals/' },
      { label: 'Observatory', href: 'https://arifos.arif-fazil.com' },
      { label: 'N9 Election Telemetry', href: '/politics/ns-election/' },
    ],
    kernelHint: 'arif_init → arif_observe → arif_think',
  },
  {
    id: 'interpret',
    verb: 'Interpret',
    oneLine: 'Build competing explanations',
    humanSays: 'What could this mean — and what is the kill case?',
    federationDoes:
      'Generate rival models, run falsification, keep uncertainty bands honest (F2/F7).',
    organs: ['GEOX', 'WEALTH', 'WELL'],
    surfaces: [
      { label: 'Basin dossiers', href: '/earth' },
      { label: 'MakcikGPT', href: '/makcikgpt/' },
      { label: 'Economics', href: '/economics' },
    ],
    kernelHint: 'arif_think → organ challenge → arif_route',
  },
  {
    id: 'decide',
    verb: 'Decide',
    oneLine: 'Compare consequences and uncertainty',
    humanSays: 'Should we advance, hold, or kill — and why?',
    federationDoes:
      'Consequence map, irreversibility gate, constitutional floors, SEAL/HOLD/VOID.',
    organs: ['arifOS', 'WEALTH', 'AAA'],
    surfaces: [
      { label: 'Doctrine', href: '/doctrine' },
      { label: 'Institution', href: '/institution' },
      { label: '999 proof', href: '/999/' },
      { label: 'N9 Operational Playbook', href: '/politics/ns-election/playbook/' },
    ],
    kernelHint: 'arif_judge → (HOLD | SEAL | VOID)',
  },
  {
    id: 'build',
    verb: 'Build',
    oneLine: 'Prepare and execute approved changes',
    humanSays: 'Make this real — reversibly first.',
    federationDoes:
      'Plan, dry-run, mutate only after authority. A-FORGE executes; kernel never self-authorizes.',
    organs: ['A-FORGE', 'arifOS'],
    surfaces: [
      { label: 'Forge', href: '/forge/' },
      { label: 'A-FORGE', href: 'https://forge.arif-fazil.com' },
      { label: 'Genesis /000', href: '/000/' },
    ],
    kernelHint: 'arif_forge after arif_judge SEAL',
  },
  {
    id: 'monitor',
    verb: 'Monitor',
    oneLine: 'Detect change, degradation, or danger',
    humanSays: 'Is the system or the human still fit to act?',
    federationDoes:
      'Health, drift, vitality (WELL), tripwires, live market proxies — alarms without noise.',
    organs: ['WELL', 'WEALTH', 'arifOS'],
    surfaces: [
      { label: 'VITALS', href: '/wealth/vitals/' },
      { label: 'Pulse', href: '/pulse/' },
      { label: 'WELL', href: 'https://well.arif-fazil.com' },
      { label: 'N9 Live Election Audit', href: '/politics/ns-election/' },
    ],
    kernelHint: 'arif_observe continuous · WELL REFLECT_ONLY',
  },
  {
    id: 'remember',
    verb: 'Remember',
    oneLine: 'Retrieve and preserve governed knowledge',
    humanSays: 'What did we seal, and what is still lore?',
    federationDoes:
      'VAULT999 append-only receipts, memory metabolism, scars over diaries.',
    organs: ['VAULT999', 'arifOS', 'AAA'],
    surfaces: [
      { label: '999 ledger', href: '/999/' },
      { label: 'Writing', href: '/writing' },
      { label: 'MCP (agents)', href: 'https://mcp.arif-fazil.com' },
    ],
    kernelHint: 'arif_memory · arif_seal',
  },
];
