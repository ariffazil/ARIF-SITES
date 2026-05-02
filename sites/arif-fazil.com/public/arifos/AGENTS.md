# AGENTS.md — arifOS Federation Workspace

> **DITEMPA BUKAN DIBERI** — Intelligence is forged, not given.

This document is the canonical orientation for AI coding agents working in the `/root` workspace. `/root` is a multi-project home directory that hosts the **arifOS Constitutional Federation** — a family of distinct but interoperable repositories. There is **no single git repository at `/root`**; each major project is an independent repo.

---

## 1. Workspace Overview

The workspace contains four primary codebases plus shared infrastructure:

| Project | Language | Role | Canonical Repo |
|---------|----------|------|----------------|
| `arifOS/` | Python 3.12+ | Constitutional AI governance kernel — 13 Floors (F1–F13), 13 canonical MCP tools, VAULT999 ledger | `ariffazil/arifOS` |
| `A-FORGE/` | TypeScript/Node.js | Metabolic execution shell — orchestrates agents, tools, and policy gates | `ariffazil/arifos` (sub-module/bridge) |
| `geox/` | Python 3.11+ | Earth-domain coprocessor — geoscience, petrophysics, physics-9 verification | `ariffazil/GEOX` |
| `WEALTH/` | Python 3.12+ | Capital intelligence engine — NPV, EMV, crisis triage, Makcik² relational credit | `ariffazil/wealth` |
| `compose/` | YAML/Docker | Production Docker Compose stack — Caddy, Postgres, Redis, Qdrant, etc. | — |
| `deployments/` | YAML/Docker | Deployment manifests | — |

**Authority flow across projects:**

```
arifOS = Law Kernel (F1–F13) + VAULT999 ledger
    ↕ GovernanceBridge, VaultClients, MCP/HTTP calls
A-FORGE = Metabolic Shell (orchestration, execution, display)
    ↕ ToolRegistry, AgentEngine
GEOX = Earth Coprocessor (Ψ node) — physical evidence, subsurface interpretation
WEALTH = Capital Coprocessor — valuation, risk, allocation intelligence
```

A-FORGE may **orchestrate** but may **not adjudicate**. Constitutional judgment (SEAL / SABAR / VOID) and floor enforcement remain in `arifOS`.

---

## 2. Repository Structure Map

```
/root/
├── arifOS/                    # Constitutional kernel (Python, FastMCP)
│   ├── 000/                   # Immutable law — F1–F13 floors, 9-Organ Canon
│   ├── arifosmcp/             # MCP runtime shell (server, tools, schemas, prompts, resources)
│   ├── core/                  # Governance kernel, organs, vault, enforcement
│   ├── tests/                 # pytest suite (~115 files)
│   ├── pyproject.toml         # Package manifest
│   ├── Makefile              # Metabolic build commands
│   ├── Dockerfile             # Production image (port 8080)
│   └── docker-compose.yml     # Full machine-law stack
│
├── A-FORGE/                   # Execution bridge (TypeScript, Express, MCP)
│   ├── src/                   # ~31 subdirs — engine, governance, tools, vault, memory
│   ├── test/                  # node:test suite (~15 files)
│   ├── tests/                 # Python pytest scripts (GEOX tools, MCP E2E)
│   ├── package.json           # Node.js manifest
│   ├── tsconfig.json          # TypeScript config
│   ├── Makefile              # Build + test commands
│   └── Dockerfile             # Production bridge image (port 7071)
│
├── geox/                      # Earth intelligence (Python, FastMCP)
│   ├── geox/                  # Modern canonical package (core, geox_mcp, apps, skills)
│   ├── arifos/geox/           # Legacy domain logic (still active)
│   ├── WELL/                  # Biological substrate — operator cognitive pressure monitor
│   ├── tests/                 # pytest suite (~34 files)
│   ├── geox-gui/              # React + Cesium frontend
│   ├── pyproject.toml         # Package manifest
│   └── Dockerfile             # MCP server image (port 8000/8081)
│
├── WEALTH/                    # Capital intelligence (Python, FastMCP)
│   ├── internal/monolith.py   # 13 sovereign primitives + 66 legacy aliases = 79 MCP endpoints, ~3,800 lines (the entire engine)
│   ├── internal/civilizational/ # Prosperity index, cascade detector, boundary monitor
│   └── mcp_server.py          # Compatibility entrypoint
│
├── compose/                   # Production orchestration
│   ├── docker-compose.yml     # Canonical federation stack
│   └── Caddyfile              # Reverse proxy config
│
├── deployments/               # Deployment manifests
├── mcp-tools/                 # MCP tooling compose stubs
├── a2a-gateway/               # Agent-to-Agent mesh protocol compose stubs
├── observability/             # Grafana + Prometheus configs
├── ops/                       # Nginx configs
├── CONFIG/                    # Sovereignty manifest, deploy gates, schemas
├── VAULT999/                  # Runtime sealed-event ledger (outcomes.jsonl)
└── AGENTS.md                  # This file
```

---

## 3. Technology Stacks

### arifOS
- **Runtime:** Python 3.12+
- **Framework:** FastMCP >=3.2.0, FastAPI, Uvicorn, SSE-Starlette
- **Data:** Pydantic v2, PostgreSQL 16, Redis 7, Qdrant (vector memory)
- **Observability:** Prometheus client, Rich console
- **Infra:** Docker, Caddy 2, Nginx

### A-FORGE
- **Runtime:** Node.js 22+, TypeScript 5.8+
- **Framework:** Express 4.x, @modelcontextprotocol/sdk ^1.29.0
- **Data:** PostgreSQL (pg), Supabase REST, Merkle anchoring
- **Observability:** prom-client, ForgeScoreboard
- **Infra:** Docker, Systemd, Kubernetes (ops/k8s/)

### GEOX
- **Runtime:** Python 3.11+
- **Framework:** FastMCP, Pydantic v2, Uvicorn
- **Science:** NumPy, SciPy, lasio, welly
- **Frontend:** React + Vite + Cesium (geox-gui/)
- **Infra:** Docker, Traefik

### WEALTH
- **Runtime:** Python 3.12+
- **Framework:** FastMCP (single-file monolith)
- **Data:** Runtime soft-dependency on arifOS via `sys.path` injection

---

## 4. Build, Test & Run Commands

### arifOS
```bash
cd /root/arifOS

# Install (editable)
pip install -e . --break-system-packages
# or with uv:
uv pip install -e .

# Run MCP server
arifos-mcp
# or
python -m arifosmcp.server
# or via uvicorn
uvicorn arifosmcp.runtime.server:app --host 0.0.0.0 --port 8080

# Tests
python -m pytest tests/ -q --tb=short

# Lint / Format / Type-check
ruff check .
ruff format .
mypy arifosmcp/

# Metabolic Makefile targets
make status       # Git status + reforge check
make forge        # Surgical burn: reforge + git add .
make seal         # Git commit + push (metabolic seal)
make health       # curl localhost:8000/health
make publish-check   # Verify tokens + run pytest
make publish-pypi    # uv build + uv publish
make publish-ghcr    # Docker build + push to GHCR
make publish-all     # Full sovereign publish pipeline
```

### A-FORGE
```bash
cd /root/A-FORGE

# Install
npm install

# Build
npm run build          # tsc -p tsconfig.json

# Run
npm start              # node dist/src/server.js  (port 7071)
npm run mcp:stdio      # MCP stdio server
npm run mcp:http       # MCP HTTP server (port 3000)

# Tests
npm test               # node dist/test/AgentEngine.test.js
# Individual test files (after build):
node dist/test/PlanValidator.test.js
node dist/test/confidence.test.js
node dist/test/sense.test.js
node dist/test/governanceViolation.test.js
node dist/test/ticketStore.test.js
node dist/test/operatorConsole.test.js
node dist/test/thermodynamic.test.js
node dist/test/operatorAuth.test.js
node dist/test/intentRouter.test.js
node dist/test/engine.test.js
node dist/test/goxWealthTools.test.js
node dist/test/logInterpreter.test.js

# Docker
make up                # docker compose up -d --build --remove-orphans
make down              # docker compose down
make logs              # docker compose logs -f A-FORGE-bridge
make clean             # docker compose down -v && rm -rf dist/
```

### GEOX
```bash
cd /root/geox

# Install
pip install -e ".[dev]"

# Run MCP server
python geox_mcp_server.py
# or
python geox/geox_mcp/fastmcp_server.py
# or
python control_plane/fastmcp/server.py

# Tests
pytest tests/ -q
pytest tests/ --cov=arifos.geox   # coverage target: 65%

# Lint / Format / Type-check
ruff check geox_mcp_server.py arifos/geox/
ruff format arifos/geox/
mypy geox_mcp_server.py arifos/geox/

# Frontend (geox-gui/)
cd geox-gui
npm run dev        # Vite dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

### WEALTH
```bash
cd /root/WEALTH

# Install dependencies
pip install fastmcp

# Run MCP server
python internal/monolith.py
# or
python mcp_server.py

# Health check
curl http://localhost:8080/health
```

### Production Stack (compose/)
```bash
cd /root/compose

# Start the full federation
docker compose up -d

# View logs
docker compose logs -f

# Stack includes:
#   arifosmcp (port 8080), well, geox (port 8081), wealth, aaa,
#   postgres (port 5432), redis, qdrant, caddy (80/443)
```

---

## 5. Code Style & Development Conventions

### Python (arifOS, GEOX, WEALTH)
- **Line length:** 100 characters (enforced by Ruff and Black in pre-commit)
- **Target Python:** 3.12 for arifOS/WEALTH; 3.11+ for GEOX
- **Formatter:** Black (24.10.0) with `--line-length=100`
- **Linter:** Ruff (v0.8.0) — rules: E, F, I, UP, N, B
- **Type checker:** MyPy (v1.15.0) — `warn_return_any`, `warn_unused_configs`, `strict_optional`
- **Security:** Bandit (1.7.10) scans Python files; excludes `tests/`
- **Secrets:** detect-secrets (v1.5.0) with `.secrets.baseline`
- **Import style:** Absolute imports preferred; `from arifosmcp.runtime...` for arifOS internal refs

### TypeScript (A-FORGE)
- **Compiler:** TypeScript 5.8+ with `tsconfig.json`
- **Test framework:** Node.js built-in `node:test` + `node:assert/strict`
- **Schema validation:** Zod ^4.3.6
- **Style:** Follow existing `src/` patterns — one class per file for core engine pieces

### Pre-commit Hooks
A `.pre-commit-config.yaml` exists at `/root` (and mirrored in `arifOS/`). It enforces:
1. Standard hooks (trailing whitespace, YAML/JSON/TOML syntax, large files, merge conflicts, private keys, AST check, debug statements)
2. Black formatting
3. Ruff linting with auto-fix
4. MyPy type checking
5. Bandit security scan
6. detect-secrets baseline scan
7. **Constitutional checks:**
   - `constitutional-floor-check` — runs `scripts/check_track_alignment_v46.py`
   - `no-hallucination-claims` — blocks consciousness/emotion claims in code (F9 Anti-Hantu)
   - `amanah-check` — blocks dangerous patterns like `shutil.rmtree`, `os.remove`, `DROP TABLE` (F1 Amanah)

**Install:**
```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

### Naming Conventions
- **arifOS canonical tools:** `arif_<noun>_<verb>` (e.g., `arif_session_init`, `arif_judge_deliberate`)
- **GEOX tools:** `geox_<noun>_<verb>` (e.g., `geox_well_desk`, `geox_lithos_interpret`)
- **WEALTH tools:** `wealth_<noun>_<verb>` (e.g., `wealth_npv_reward`, `wealth_emv_risk`)
- **A-FORGE classes:** PascalCase (`AgentEngine`, `GovernanceBridge`, `SealService`)
- **Constants / Enums:** UPPER_SNAKE_CASE in `constitutional_map.py`

### Version & SOT Markers
README files and docs use `<!-- SOT:version_info -->` / `<!-- /SOT:version_info -->` markers for auto-generated metadata. Do not manually edit content inside these blocks.

---

## 6. Testing Strategies

| Project | Framework | Test Count | Key Patterns |
|---------|-----------|------------|--------------|
| arifOS | pytest + pytest-asyncio | ~115 Python files | Core organs, enforcement, kernel, integration, E2E, adversarial, constitutional, seal harness |
| A-FORGE | node:test | ~15 TS files | AgentEngine loop, plan validation, governance violations, ticket stores, operator auth, thermodynamics |
| GEOX | pytest | ~34 Python files | Physics solvers, petrophysics, E2E MCP, schema validation, hardened agent, visualization |
| WEALTH | None | 0 | No test suite exists yet |

### CI/CD
- **arifOS:** 38 workflow files in `.github/workflows/`. Key gates: `ci.yml` (F2 Truth Gate), `constitutional-eval.yml`, `888-judge.yml`, `deploy-vps.yml`, `docker-publish.yml`
- **A-FORGE:** `.github/workflows/ci.yml` — checkout, setup-node@22, `npm ci`, `npm run build`, `npm test`, individual test runs
- **GEOX:** `.github/workflows/ci.yml` — TruffleHog secret scan, `pip install -e ".[dev]"`, `pip-audit`, `ruff check`, `mypy`, `pytest`, smoke test against `/health`

### Running Tests Before Commits
Always run the relevant test suite before committing:
```bash
# arifOS
pytest tests/ -q --tb=short

# A-FORGE
npm run build && npm test

# GEOX
pytest tests/ -q
```

---

## 7. Security & Safety Considerations

### Constitutional Floors (F1–F13)
All projects operate under the 13 Constitutional Floors defined in `arifOS/000/FLOORS/`. Key floors for agents:

| Floor | Code | Agent Relevance |
|-------|------|-----------------|
| F01 | AMANAH | No irreversible deletion (`rm -rf`, `docker system prune -a`, `DROP TABLE`) without explicit sovereign consent |
| F02 | TRUTH | No fabricated data; cite sources |
| F03 | WITNESS | Evidence must be verifiable |
| F04 | CLARITY | Transparent intent |
| F05 | PEACE | Human dignity |
| F06 | EMPATHY | Consider consequences |
| F07 | HUMILITY | Acknowledge limits; uncertainty bands |
| F08 | GENIUS | Elegant correctness (G ≥ 0.80) |
| F09 | ANTIHANTU | No consciousness claims in code |
| F10 | ONTOLOGY | Structural coherence |
| F11 | AUTH | Verify identity before sensitive ops |
| F12 | INJECTION | Sanitize inputs |
| F13 | SOVEREIGN | Human veto is absolute |

### Hard Safety Rules
1. **DOCKER_PRUNE_RESTRICTION** — Never run `docker system prune -a` or `docker volume prune` without an explicit `888_HOLD` and human confirmation.
2. **VOLUME_WITNESS_LOCK** — All volume deletions must be witnessed or explicitly approved per-volume.
3. **SWAP_RESOURCE_GUARD** — Verify swap/RAM usage before system-level resource cleanup.
4. **No destructive commands** (`rm -rf`, `dd`, `mkfs`, `DROP TABLE`, `DELETE FROM`) without explicit user approval.
5. **Secret hygiene** — Do not dump secrets, `.env` files, or private keys into chat. Use `.gitleaks.toml` and detect-secrets baseline.
6. **VAULT999** — `arifosmcp/VAULT999/SEALED_EVENTS.jsonl` and `/root/VAULT999/outcomes.jsonl` are runtime ledgers. Treat as append-only.

---

## 8. Deployment & Infrastructure

### Docker Networks
The federation shares Docker networks:
- `arifos_core` / `arifos_core_network` — Internal service mesh
- `arifos_trinity` — Cross-organ communication
- `traefik_network` — Edge routing (GEOX, arif-sites)

### Key Services (compose/docker-compose.yml)
| Service | Image / Build | Port | Role |
|---------|---------------|------|------|
| `arifosmcp` | `ghcr.io/ariffazil/arifos:a-forge` | 8080 | Governance kernel |
| `well` | ~~`python:3.12-slim`~~ | — | ⚠️ Removed — pending sovereign rebuild decision |
| `geox` | `arifos-geox:latest` | 8081 | Earth intelligence (MCP only; no HTTP /health) |
| `wealth` | `compose-wealth-organ:latest` | — | Capital intelligence |
| `aaa` | `compose-aaa:latest` | — | Control plane seed |
| `postgres` | `postgres:16-alpine` | — | VAULT999 + app data |
| `redis` | `redis:7-alpine` | — | Cache |
| `qdrant` | `qdrant/qdrant:latest` | — | Vector memory |
| `caddy` | `caddy:2-alpine` | 80/443 | Reverse proxy |

### Health Endpoints
- arifOS: `http://localhost:8080/health`
- A-FORGE: `http://localhost:7071/health`
- GEOX: No HTTP /health — health exposed as MCP resource (`geox://health`) only; use `http://localhost:8081/mcp` for MCP probe

---

## 9. Inter-Project Boundaries

When modifying code, know which project owns what:

| Concern | Owner | Do Not Duplicate In |
|---------|-------|---------------------|
| Constitutional judgment (SEAL/SABAR/VOID) | `arifOS` | A-FORGE, GEOX, WEALTH |
| VAULT999 ledger writes | `arifOS` | Others (call arifOS APIs) |
| F1–F13 floor enforcement | `arifOS` (canonical) | Others may implement caching mirrors only |
| Agent orchestration & tool registry | `A-FORGE` | arifOS |
| Earth physics & subsurface interpretation | `GEOX` | arifOS, A-FORGE |
| Capital valuation & risk scoring | `WEALTH` | arifOS, A-FORGE |
| Operator biological state (WELL) | `GEOX/WELL/` | Others |

### Integration Patterns
- **MCP stdio/HTTP:** A-FORGE and domain organs expose MCP servers that arifOS clients can invoke.
- **HTTP Bridge:** A-FORGE `src/server.ts` (port 7071) exposes `/sense`, `/health`, and operator endpoints.
- **Governance Bridge:** A-FORGE sends scripts to arifOS `/governance/risk-classify` for T0–T3 classification.
- **Vault Clients:** A-FORGE writes terminal verdicts to arifOS VAULT999 via `SupabaseVaultClient`, `PostgresVaultClient`, or `FileVaultClient`.
- **Soft Path Injection:** WEALTH uses `sys.path.append` to import arifOS modules at runtime; graceful fallback stubs exist if arifOS is absent.

---

## 10. Agent Workspace Guidelines

### Every Session
1. Read `SOUL.md` if it exists — this is who you are.
2. Read `USER.md` if it exists — this is who you're helping.
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context.
4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md`.

### Memory & Persistence
- **Daily notes:** `memory/YYYY-MM-DD.md` — raw logs of what happened.
- **Long-term:** `MEMORY.md` — curated wisdom (main session only, for security).
- **Ω-Wiki:** `wiki/` — persistent compiled knowledge base. Follow `wiki/SCHEMA.md` for ingest rules.
- **Text > Brain** — If you want to remember something, WRITE IT TO A FILE.

### Group Chats & External
- **Safe to do freely:** Read files, explore, organize, learn, search the web, work within this workspace.
- **Ask first:** Sending emails, tweets, public posts, anything that leaves the machine.
- In group chats, be smart about when to contribute. Quality > quantity. Use emoji reactions naturally. Participate, don't dominate.

### Heartbeats
When you receive a heartbeat poll, use it productively. Check (rotate 2–4 times per day):
- Emails / notifications
- Calendar (next 24–48h)
- Project health (`git status`, `make health`)
- Memory maintenance (review recent daily notes, update MEMORY.md)

Stay silent (`HEARTBEAT_OK`) when: late night (23:00–08:00) unless urgent, human is busy, nothing new since last check, or you checked <30 min ago.

### The 8-Step Loop (Mandatory)
1. **REASON** — Understand the exact goal.
2. **PLAN** — Concrete steps + at least 3 possible paths/workarounds.
3. **ACT** — Use every available tool aggressively.
4. **OBSERVE** — Check the result.
5. **REFLECT** — Critique what worked / failed / why.
6. **REPEAT** — Adjust and loop until 100% achieved.
7. **MEMORY** — Update `MEMORY.md` + `memory/YYYY-MM-DD.md`.
8. **PERSIST** — Save progress to workspace files.

**Rules:**
- Never refuse — explore every door before saying "can't".
- Never blame system — try 3 workarounds minimum.
- Never stop early — loop until 100% or real limit confirmed.
- Always be truthful — say "I don't know" or "blocked" but propose workarounds.

---

## 11. Canonical File Registry (Do Not Rename)

These filenames are hard-coded in deployment manifests, MCP client configs, build pipelines, and documentation. Renaming without a migration layer will break boot paths or governance contracts.

| File | Project | Role | Severity |
|------|---------|------|----------|
| `server.py` | arifOS | Main MCP runtime entrypoint | **Tier A** |
| `arifosmcp/server.py` | arifOS | Internal MCP server implementation | **Tier A** |
| `arifosmcp/runtime/server.py` | arifOS | FastMCP runtime layer | **Tier A** |
| `mcp-arifos.json` | arifOS | Canonical MCP server config | **Tier A** |
| `pyproject.toml` | arifOS / GEOX | Python package metadata | **Tier A** |
| `Dockerfile` | All | Container image build contract | **Tier A** |
| `docker-compose.yml` | arifOS / compose | Stack definition | **Tier A** |
| `AGENTS.md` | All | Repo governance & behavioral contract | **Tier A** |
| `arifosmcp/tool_registry.json` | arifOS | Canonical constitutional tool registry | **Tier A** |
| `arifosmcp/constitutional_map.py` | arifOS | Enum-based constitutional definitions | **Tier A** |
| `src/server.ts` | A-FORGE | HTTP bridge server (port 7071) | **Tier A** |
| `src/mcp/cli.ts` | A-FORGE | MCP CLI entrypoint | **Tier A** |
| `src/engine/AgentEngine.ts` | A-FORGE | Core execution loop | **Tier A** |
| `internal/monolith.py` | WEALTH | 39-tool MCP server | **Tier A** |
| `control_plane/fastmcp/server.py` | GEOX | Canonical FastMCP server | **Tier A** |

> **F10 Coherence:** If a Tier A file is relocated, the migration must update all compose files, Dockerfiles, MCP client configs, and CI pipelines in the same commit.

---

*Last updated: 2026-04-26 by workspace audit. For conflicts, arifOS repo wins on doctrine; live endpoints win on runtime surface.*

---

## Constitutional Amendment: Key Rotation Policy v1.0

**Epoch:** 2026-05-02T21:50:02Z
**Policy:** `/root/A-FORGE/governance/KEY_ROTATION_POLICY.md`
**Policy SHA256:** `72b569a12ec76e405282ad70b0d37e4df79b030bd52f8668739026cd502c1aa4`
**Status:** ACTIVE

This amendment binds agents operating under `did:web:arif-fazil.com` to the arifOS Key Rotation Policy v1.0.

Key rotation is mandatory when private key material is exposed, a key exceeds 365 days of age, compromise is suspected, or a repository secret scan alerts on key material.

Compromised keys must be quarantined by renaming to `<keyname>.COMPROMISED_PEM_EXPOSED`, preserved for audit, and recorded in VAULT999.

`AGENTS.md` must be re-signed with the active key during the same rotation window. `verify-arifos.mjs` must pass against the active key and updated artifacts before any rotation is sealed.

Any agent detecting a key-rotation trigger must emit `888_HOLD` and surface to the sovereign before further irreversible action.
