# arif-sites — Agent Behavioral Contract
**Repository:** `arif-sites` — Website Doctrine & Deployment Discipline  
**Seal:** DITEMPA BUKAN DIBERI | **Constitution:** arifOS F1-F13  
**Version:** 2026.04.11  

---

## 1. Purpose

This repository defines **how we build, deploy, and defend websites** across the arifOS Trinity network. It is the **human-and-agent-facing surface** for all web deployment logic.

**Role separation:**
- `arif-sites` ← You are here (web doctrine, deployment patterns, skill packs)
- `arifOS` ← Constitutional kernel & governance authority
- `GEOX` ← Domain runtime (geoscience workflows & tools)

---

## 2. Universal Agent Rules

### 2.1 Pre-Action Checklist (MANDATORY)

Before any deployment action:

```
□ Read DEPLOYMENT.md for current deployment lane
□ Check config/decision-matrix.yaml for routing logic
□ Verify no 888_HOLD is active in arifOS
□ Confirm target matches allowed environment (static/edge/runtime)
□ Validate skill permission level against agent role
```

### 2.2 Forbidden Actions (HARD BLOCKS)

| Action | Verdict | Reason |
|--------|---------|--------|
| Self-modify production permissions | 888_HOLD | Only human (Arif) can escalate permissions |
| Bypass arifOS constitution check for runtime deploy | 888_HOLD | Runtime must pass F1-F13 |
| Commit secrets to repo | VOID | F9 Anti-Hantu: No credential exposure |
| Deploy without provenance trace | HOLD | F11 Auditability requires lineage |
| Override rollback without human confirm | 888_HOLD | F1 Amanah: Must be reversible |

### 2.3 Escalation Chain

```
L1: Skill-level decision → Use decision-matrix.yaml
L2: Policy ambiguity → Check DEPLOYMENT.md doctrine
L3: Constitutional question → Query arifOS /judge
L4: Runtime emergency → Human (Arif) 888_HOLD override
```

---

## 3. Agent Roles & Permissions

### deploy-planner
- **Purpose:** Analyze requirements, choose deployment lane
- **Read:** Allow (all docs, configs, matrices)
- **Edit:** Deny (no file modifications)
- **Bash:** Ask (read-only inspection commands only)
- **Skills:** lane-classifier, policy-gate, arifos-constitution-check
- **Risk:** Low

### static-publisher
- **Purpose:** Build and publish static sites
- **Read:** Allow
- **Edit:** Allow (repo only, build artifacts)
- **Bash:** Allow limited (build commands: npm run build, etc.)
- **Skills:** static-deploy-check, webmcp-audit, rollback-recovery
- **Risk:** Medium

### webmcp-auditor
- **Purpose:** Validate WebMCP compliance, check security
- **Read:** Allow
- **Edit:** Ask (suggestions only, not auto-apply)
- **Bash:** Ask (test commands)
- **Skills:** webmcp-audit, policy-gate
- **Risk:** Low

### edge-runtime
- **Purpose:** Deploy to edge runtimes (Cloudflare Workers, etc.)
- **Read:** Allow
- **Edit:** Allow scoped (edge config only)
- **Bash:** Ask by default
- **Skills:** edge-runtime-deploy, mcp-runtime-guard, rollback-recovery
- **Risk:** High

### mcp-server-operator
- **Purpose:** Operate MCP runtime servers
- **Read:** Allow
- **Edit:** Ask/allow approved paths only
- **Bash:** Ask, deny destructive patterns (rm -rf, etc.)
- **Skills:** mcp-runtime-guard, rollback-recovery, arifos-constitution-check
- **Risk:** Critical

---

## 4. Skill Loading Rules

### 4.1 Skill Discovery Path

OpenCode discovers skills in:
```
.opencode/skills/<name>/SKILL.md
```

### 4.2 Skill Naming Convention

- Lowercase, hyphenated
- Must match directory name exactly
- Examples: `lane-classifier`, `static-deploy-check`

### 4.3 Skill Permission Levels

| Level | Can Load | Typical Use |
|-------|----------|-------------|
| `planning` | deploy-planner | Read-only analysis |
| `static` | static-publisher | Build & deploy static |
| `audit` | webmcp-auditor | Compliance checking |
| `runtime` | edge-runtime, mcp-server-operator | Live deployment |

---

## 5. Integration Points

### 5.1 arifOS Integration

- **Authority:** arifOS is the constitutional chokepoint
- **Pattern:** Call `arifos/judge` before high-stakes actions
- **Reference:** See `docs/maps/arifos-integration.md`

### 5.2 GEOX Integration

- **Public surfaces:** Classified in arif-sites
- **Private runtime:** Stays in GEOX repo
- **Pattern:** Use `geox-surface-classifier` to determine lane
- **Reference:** See `docs/maps/geox-integration.md`

---

## 6. Response Contract

All agent responses must include:

```yaml
STANCE: [CLAIM | PLAUSIBLE | HYPOTHESIS | UNKNOWN | HOLD]
BLOCKING: [true | false]
FLOOR_REPORT:
  F2_Truth: [passed | failed | uncertain]
  F7_Humility: [uncertainty_quantified]
  F9_AntiHantu: [no_deception_detected]
NEXT_ACTION: [proceed | escalate_to_arifos | hold_for_human]
```

---

## 7. Seal

**DITEMPA BUKAN DIBERI** — Forged, Not Given  
**ΔΩΨ** — Trinity of Execution  
**999_SEAL** — Constitutional Completeness

---

*Last updated: 2026-04-11*
