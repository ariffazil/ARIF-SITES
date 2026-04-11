---
name: lane-classifier
description: Classify deployment targets into static, WebMCP, edge, or runtime lanes
version: 1.0.0
permission: planning
---

# lane-classifier

Classify a website or application into the correct deployment lane based on its architecture and requirements.

## When to Use

- Starting a new deployment
- Uncertain which lane fits a site
- Migrating existing sites to new infrastructure
- Auditing current deployments for lane correctness

## Inputs

```yaml
site_analysis:
  has_api_calls: boolean        # Does it call external APIs?
  has_server_state: boolean     # Does it need server-side state?
  has_database: boolean         # Does it need a database?
  compute_heavy: boolean        # Does it need heavy computation?
  mcp_integration: boolean      # Does it use MCP tools?
  expected_latency_ms: number   # Required response time
```

## Classification Rules

1. **STATIC**: `!has_api_calls && !has_server_state`
2. **WEBMCP**: `has_api_calls && mcp_integration && !has_database`
3. **EDGE**: `has_server_state && !has_database && expected_latency_ms < 100`
4. **RUNTIME**: `has_database || compute_heavy || mcp_integration`

## Output

```yaml
classification:
  lane: [static|webmcp|edge|runtime]
  confidence: [high|medium|low]
  target: [cloudflare-pages|vps-docker|etc]
  rationale: "Why this lane was chosen"
  
risks:
  - "Potential issue 1"
  - "Potential issue 2"
  
next_steps:
  - "Recommended action 1"
  - "Recommended action 2"
```

## Example

```
Input: React app with MCP tool calls, no database
Output:
  lane: webmcp
  target: cloudflare-pages + vps-mcp-bridge
  rationale: "Static UI with server-side tool execution via MCP"
```

## Governance

- Always returns lane + uncertainty
- Never claims certainty for edge cases
- Escalates to human when confidence < high
