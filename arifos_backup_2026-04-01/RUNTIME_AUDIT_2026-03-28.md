# Runtime Audit — 2026-03-28

## Scope

Audit target: live arifOS MCP runtime and the `arifos` docs site contract.

Docs source:
- `arif-sites/arifos`

Runtime checked:
- `https://arifosmcp.arif-fazil.com`
- `https://arifosmcp.arif-fazil.com/mcp`
- `https://arifosmcp.arif-fazil.com/tools`
- `https://arifosmcp.arif-fazil.com/health`

## Findings

1. Endpoint drift
- Docs site still referenced `aaamcp.arif-fazil.com` and `aaa.arif-fazil.com/mcp`.
- Live runtime is on `arifosmcp.arif-fazil.com/mcp`.
- `aaamcp.arif-fazil.com` did not resolve during the audit.
- `https://aaa.arif-fazil.com/mcp` returned `404`.

2. Tool-surface drift
- Live runtime root reported `tool_count: 39`.
- `/tools` and JSON-RPC `tools/list` exposed `23` publicly discoverable tools.
- Docs site still advertised `9` canonical tools.

3. Repository defect
- `public/llms.txt` contained unresolved merge-conflict markers.

4. Runtime contract anomaly
- Invalid-input probes for `engineering_memory`, `math_estimator`, and `code_engine` returned payload-level failures while the envelope still reported `ok: true`.
- This is a runtime response-shape issue, not only a docs issue.

## Public tools exercised

- `init_anchor`
- `vault_ledger`
- `agi_mind`
- `asi_heart`
- `engineering_memory`
- `physics_reality`
- `math_estimator`
- `code_engine`
- `architect_registry`
- `check_vital`
- `audit_rules`
- `agi_reason`
- `agi_reflect`
- `asi_critique`
- `asi_simulate`
- `apex_judge`
- `vault_seal`
- `verify_vault_ledger`
- `reality_compass`
- `reality_atlas`
- `search_reality`
- `ingest_evidence`
- `agentzero_engineer`

## Result summary

- 23 of 23 publicly listed tools responded over JSON-RPC.
- Most returned `SEAL` and `SUCCESS`.
- Alias behavior was observed for several tools, for example:
  - `vault_seal` routed to `vault_ledger`
  - `audit_rules` routed to `apex_soul`
  - `asi_critique` and `asi_simulate` routed to `asi_heart`

## Docs changes applied

- Updated `llms.json` to reflect the current runtime domain, protocol, and 23-tool public surface.
- Replaced stale `llms.txt` copies with the audited runtime contract.
- Corrected runtime links in `README.md`, `robots.txt`, `_headers`, `site.json`, and `public/docs/mcp.html`.
- Updated homepage metadata and the floor visualization to reflect all 13 floors.

## Remaining runtime issues

- The docs are now aligned with the live public runtime.
- The runtime itself still has the `ok: true` plus `status: ERROR` contract inconsistency for some invalid requests.
- The runtime still reports a mismatch between `39` internally loaded tools and `23` public tools.
