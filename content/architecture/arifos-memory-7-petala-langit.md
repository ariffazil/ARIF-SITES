# arifOS Memory Architecture — 7 Petala Langit

> **Version:** 2.0 (2026-06-07)
> **Author:** Muhammad Arif bin Fazil
> **For:** Fahmi (technical reference) · general readers (sections marked 📖)
> **Status:** LIVE — operating in production at hermes-asi-gateway

---

## 📖 0. Plain-English Summary (baca dulu kalau baru jumpa)

Sistem memory arifOS ada **7 layer**, dari paling ringan (chat baru je taip) sampai paling berat (sealed forever, tak boleh tipu). Macam **pokok** — atas daun (gugur setiap hari), bawah akar (kukuh, kekal).

**Kenapa ada 7?** Sebab setiap jenis "kenangan" ada keperluan berbeza:
- Chat baru nak **laju hilang** (tak payah simpan forever)
- Sejarah penting nak **kekal, tak boleh edit** (audit trail)
- Ada memory yang **volatile** (Redis, restart hilang), ada yang **persistent** (Postgres, ACID guarantee)

Bayangkan macam 7 jenis buku dalam perpustakaan:
1. **Post-it** (chat baru — buang esok)
2. **Memo** (working notes — seminggu)
3. **Card catalogue** (search by meaning)
4. **Filing cabinet** (organized records)
5. **Knowledge map** (how things connect)
6. **Diary** (how state changed over time)
7. **Notary seal** (legally witnessed, can't lie)

OpenCode (code tool) **hanya guna post-it + filing cabinet** (ephemeral + project files). Dia **tak boleh access notary seal** (VAULT999). Tu bukan sekatan, tu safety design — supaya dia tak boleh "create false history."

---

## 1. The 7 Layers — Overview

```
┌──────────────────────────────────────────────────────────────────┐
│ L0 · NIAT                                                        │
│     Sovereign Intent · ephemeral · typed by Arif                 │
│     "Apa yang aku nak"                                           │
├──────────────────────────────────────────────────────────────────┤
│ L1 · REDIS (Cache + Working State)                               │
│     Volatile · TTL · task queues · in-progress state             │
│     "Apa yang sedang berlaku"                                    │
├──────────────────────────────────────────────────────────────────┤
│ L2 · QDRANT (Vector Embeddings)                                  │
│     Semantic similarity · 1536-dim · cosine distance             │
│     "Apa yang related dengan input ni"                           │
├──────────────────────────────────────────────────────────────────┤
│ L3 · SUPABASE (Relational + ACID)                                │
│     PostgreSQL · tables · transactions · RLS                     │
│     "Apa rekod rasmi"                                            │
├──────────────────────────────────────────────────────────────────┤
│ L4 · GRAPHITI (Knowledge Graph)                                  │
│     Entity-relationship · multi-hop traversal                    │
│     "Macam mana benda-benda ni connect"                          │
├──────────────────────────────────────────────────────────────────┤
│ L5 · HYSTERESIS (Path-Dependent State)                           │
│     State machine · GROWTH/PLATEAU/REVERSION/COLLAPSE            │
│     "Kita dah berada di mana, dan macam mana kita sampai sini"   │
├──────────────────────────────────────────────────────────────────┤
│ L6 · VAULT999 (Sealed, Immutable)                                │
│     SHA3-chained · append-only · F1-F13 constitutional gated     │
│     "Apa yang dah SEAL — final, witnessed, kekal"                │
└──────────────────────────────────────────────────────────────────┘
         ▲
         │   Data flows UP only
         │   L0 (typed) → L6 (sealed)
         │   Once sealed, NEVER touched downward
```

---

## 2. Layer-by-Layer Spec

### L0 — NIAT (Sovereign Intent Layer)

**Purpose:** Capture Arif's typed intent before any processing.

| Property | Value |
|----------|-------|
| Storage | RAM only (within Hermes session) |
| Persistence | None — gone when session ends |
| Authority | Highest human authority (Arif = SOVEREIGN) |
| Format | Natural language text + structured envelope |
| Schema | `{intent, scope, reversibility, risk_band, actor_id, timestamp}` |

**Example envelope:**
```json
{
  "intent": "WEALTH NPV calculation for Q3 portfolio review",
  "scope": "wealth-synthesize",
  "reversibility": "irreversible",   // touches audit ledger
  "risk_band": "C2",                 // capital, non-trivial
  "actor_id": "arif",
  "timestamp": "2026-06-07T04:30:00+08:00"
}
```

**Design note:** L0 is *not* persisted. If the session dies, intent dies. The point is: **intent is volatile, decision is not.** Decisions get sealed (L6); intent doesn't need to be, because intent is the input, not the verdict.

---

### L1 — REDIS (Ephemeral Cache + Working State)

**Purpose:** Fast in-memory state for active tasks, sessions, agent coordination.

| Property | Value |
|----------|-------|
| Storage | Redis 7 (in-memory, optional AOF) |
| Persistence | Configurable (default: none — pure ephemeral) |
| TTL | 1h–24h depending on data type |
| Authority | Working state, not auditable |
| Use cases | Task queue, session cache, rate limits, dedup, conversation context |

**Key patterns:**

```python
# Task queue (FIFO with priority)
LPUSH tasks:high-priority '{...}'

# Session context (TTL: 24h)
SETEX session:abc123 86400 '{...}'

# Rate limit counter
INCR ratelimit:user:arif:hourly
EXPIRE ratelimit:user:arif:hourly 3600

# Conversation buffer
LPUSH chat:hermes:recent '{...}'
LTRIM chat:hermes:recent 0 99
```

**Design note:** L1 is intentionally lossy. If Redis crashes, the *worst* that happens is active tasks need to restart. Decisions never live here.

**Recursive improvement loop:** every 12h, curator agent scans L1 and **promotes** items that look persistent (e.g. conversation threads, sealed verdicts) to L3 (Supabase). After promotion, L1 entries are expired.

---

### L2 — QDRANT (Vector Embeddings + Semantic Search)

**Purpose:** Similarity search — given a query, find semantically related past content.

| Property | Value |
|----------|-------|
| Storage | Qdrant (Rust-based vector DB) |
| Embedding model | `text-embedding-3-small` (1536-dim) or `bge-large-en` (1024-dim) |
| Distance metric | Cosine similarity |
| Indexing | HNSW (Hierarchical Navigable Small World) for sub-millisecond search |
| Persistence | On-disk (`.qdrant/storage`) |

**Collection schema:**
```python
{
  "collection_name": "arifos_memory",
  "vector_size": 1536,
  "distance": "Cosine",
  "payload_schema": {
    "text": "string",           # original content
    "source": "string",         # L1, L3, L4, etc
    "actor_id": "string",
    "timestamp": "iso8601",
    "tags": ["string"],
    "envelope_id": "uuid"
  }
}
```

**Use cases:**

```python
# Semantic recall — "what did we discuss about arifOS last month?"
results = qdrant.search(
    collection="arifos_memory",
    query_vector=embed("arifOS architecture"),
    limit=10,
    score_threshold=0.75
)

# RAG grounding — before LLM responds, retrieve relevant context
context = qdrant.search(
    collection="arifos_memory",
    query_vector=embed(user_query),
    limit=5
)
```

**What lives in L2:**
- Past conversation summaries (compressed)
- Sealed VAULT999 verdicts (also indexed for semantic search)
- README/docs of federated organs (arifOS, GEOX, WEALTH, WELL)
- arif-fazil.com essays (all 13+)
- Watcher outputs (RSS, GitHub events)

**Design note:** L2 is *derived* — embeddings are computed from text that exists in L3 or L6. The vector is a secondary index, not primary truth. If Qdrant loses data, it can be rebuilt from L3/L6.

**Maintenance:** nightly re-embed job to update vectors as upstream content changes.

---

### L3 — SUPABASE (Relational + Durable Records)

**Purpose:** Canonical, queryable, ACID-compliant record store.

| Property | Value |
|----------|-------|
| Storage | Supabase (managed PostgreSQL 15) |
| Schema | Public (`arifos_*` tables) + internal (`vault_*` tables) |
| Persistence | Durable, backed up daily |
| Authority | Source of truth for relational data |
| Access | RLS-enforced (Row Level Security) |

**Major tables (current):**

```sql
-- Sessions and conversation
sessions (id, actor_id, started_at, ended_at, source, metadata)
messages (id, session_id, role, content, tool_calls, envelope_id, ts)

-- Tasks and decisions
tasks (id, intent, status, risk_band, reversibility, assigned_agent, ts)
decisions (id, task_id, verdict, evidence_ids, ts)

-- Vault and sealing
vault_seals (id, envelope_id, sha3_hash, prev_hash, nonce, sealed_at, sealed_by)

-- Federation
agents (id, name, role, capabilities, last_heartbeat)
envelopes (id, actor_id, intent, scope, reversibility, risk_band, payload, ts)

-- Organs (specialized)
geox_claims (id, claim_text, claim_type, truth_class, evidence_ids, sealed_at)
wealth_transactions (id, txn_type, amount, currency, asset_id, ts)
well_vitals (id, subject, dimension, value, ts)
```

**Use cases:**

```sql
-- Audit query: "what did we decide about X in May?"
SELECT * FROM decisions
WHERE intent ILIKE '%X%'
  AND ts >= '2026-05-01'
ORDER BY ts DESC;

-- Constitutional check: show all irreversible verdicts
SELECT d.*, v.sha3_hash
FROM decisions d
JOIN vault_seals v ON d.envelope_id = v.envelope_id
WHERE d.reversibility = 'irreversible'
ORDER BY d.ts DESC
LIMIT 20;
```

**RLS policies (example):**

```sql
-- Arif can read everything in his own federation
CREATE POLICY "arif full read" ON decisions
  FOR SELECT TO authenticated
  USING (auth.uid() = 'arif' OR current_setting('app.actor_id') = 'arif');

-- Agents can only read decisions assigned to them
CREATE POLICY "agent scoped read" ON decisions
  FOR SELECT TO authenticated
  USING (
    current_setting('app.actor_id') = assigned_agent
    OR current_setting('app.actor_id') = 'arif'
  );
```

**Design note:** L3 is the **canonical** layer — if there's a dispute about "what is the record?", L3 wins. Vector search (L2) and graph traversal (L4) are *views* on top of L3. Sealed VAULT999 (L6) is anchored to L3 but cryptographically independent.

**Recursive improvement:** curator agent runs every 12h, scans L1 for items that should be promoted to L3, and reconciles L2 embeddings with L3 source.

---

### L4 — GRAPHITI (Knowledge Graph + Relational Traversal)

**Purpose:** Multi-hop entity-relationship queries that SQL can't do well.

| Property | Value |
|----------|-------|
| Storage | Graphiti (custom, built on top of Neo4j / Memgraph) |
| Schema | Nodes (entities) + Edges (relationships) + Episodes (temporal events) |
| Persistence | Durable, backed up |
| Use case | "How does GEOX connect to arifOS through the constitutional layer?" |

**Node types:**
- **Agents** (Hermes, OpenClaw, APEXMax, OpenCode, 000♎️, ...)
- **Organs** (arifOS, GEOX, WEALTH, WELL, AAA, A-FORGE)
- **Concepts** (DSG, MCP, RAG, F1-F13 floors, 888_HOLD, ...)
- **People** (Arif, peer agents, future collaborators)
- **Decisions** (sealed verdicts that affect relationships)
- **Episodes** (conversations, tasks, cron jobs, deployments)

**Edge types (semantic relationships):**
- `GOVERNS` (arifOS → OpenClaw)
- `IMPLEMENTS` (arifOS → AAA mesh)
- `PRODUCED` (Hermes → decision)
- `REFERENCED` (essay → claim)
- `CHALLENGED` (claim A → claim B)
- `WITNESSED` (constitutional layer → seal)
- `OWNS` (Arif → agent)
- `SIGNED` (Arif → envelope)

**Example traversal:**

```python
# "What constitutional floors did I seal this month, and which agents were involved?"
traversal = graphiti.query("""
  MATCH (arif:Person {name: 'Arif'})-[:SIGNED]->(env:Envelope)
        -[:WITNESSED]->(seal:VaultSeal)
        -[:GOVERNS]->(agent:Agent)
  WHERE seal.sealed_at >= date('2026-06-01')
  RETURN seal.id, seal.verdict, agent.name, env.intent
  ORDER BY seal.sealed_at DESC
""")
```

**What lives in L4:**
- Federation topology (agents ↔ organs ↔ tools)
- Constitutional dependencies (which floor checks which organ)
- Provenance chains (evidence → claim → decision → seal)
- Conversation threading (message → topic → decision)
- Cross-essay reference graphs (essay 11 ↔ 12 ↔ 13)

**Design note:** L4 is **derived** from L3. Every node/edge has a primary key in L3; L4 is a graph view for traversal. If graph data is lost, it can be rebuilt from L3 + L6.

**Sync mechanism:** event-driven. When L3 row is inserted/updated, Graphiti ingests the delta and updates nodes/edges.

---

### L5 — HYSTERESIS (Path-Dependent State Ledger)

**Purpose:** Track **state evolution** — not what was decided, but **how the system's state has shifted** over time.

| Property | Value |
|----------|-------|
| Storage | Supabase `hysteresis_ledger` table + LRU cache for active states |
| Schema | State machine: GROWTH / PLATEAU / REVERSION / COLLAPSE |
| Use case | "Are we growing, plateauing, or collapsing in capability/quality/coherence?" |

**State machine:**

```
       transition
GROWTH ─────────→ PLATEAU
   ↑                  │
   │  rebound         │ decay
   │                  ↓
COLLAPSE ←──── REVERSION
   ↑                  │
   └───── (recovery)──┘
```

**What triggers state transitions:**

| Trigger | Transition | Detection |
|---------|-----------|-----------|
| Tool success rate > 80% for 7 days | PLATEAU → GROWTH | L3 aggregate query |
| Constitutional floor violation (F1-F13) | * → COLLAPSE | L6 seal of VOID verdict |
| Repeated retries without progress | GROWTH → REVERSION | L1 task queue depth |
| Capacity headroom > 50% for 30 days | PLATEAU → GROWTH | L3 resource metrics |
| Audit chain broken | * → CRITICAL | L6 SHA3 chain validation |

**Example query:**

```python
# "Is the federation currently in a healthy state?"
state = hysteresis.current_state("federation:core")
# → {state: "GROWTH", confidence: 0.87, last_transition: "2026-05-15", trend: "stable"}

# "Show me state transitions for organ:WEALTH in the last quarter"
transitions = hysteresis.history(
    scope="organ:WEALTH",
    start="2026-04-01",
    end="2026-06-30"
)
```

**Use cases:**

- **Decision support:** "Wealth currently in PLATEAU — meaning optimization gains have stalled. Consider different model or data source."
- **Risk early warning:** "Hysteresis shift toward REVERSION detected. Investigate root cause."
- **Capacity planning:** "Collapsing state — federation under stress, defer non-critical tasks."

**Design note:** L5 is a **meta-layer** — it observes the system and characterizes its trajectory. It does not store domain data; it stores **system state evolution**.

---

### L6 — VAULT999 (Sealed, Immutable Ledger)

**Purpose:** Final, cryptographically-provable, constitutionally-gated record of decisions.

| Property | Value |
|----------|-------|
| Storage | Append-only JSONL files + Supabase mirror table |
| Hash chain | SHA3-512, each entry references previous hash |
| Signatures | F1-F13 constitutional gates, witness consensus |
| Access | Read by anyone with auth; **write only via `mcp_arifos_arif_vault_seal` with `ack_irreversible=True`** |
| Retention | Forever (immutable) |

**Seal schema:**
```json
{
  "seal_id": "vault-2026-06-07-001337",
  "envelope_id": "uuid-v4",
  "actor_id": "arif",
  "actor_signature": "sig-...",
  "nonce": "unique-nonce-per-seal",
  "constitutional_chain_id": "F1→F2→...→F13",
  "judge_state_hash": "sha256-of-judge-verdict",
  "witness_type": "human | ai | council",
  "payload": "{...the actual decision content...}",
  "prev_hash": "sha3-512-of-previous-seal",
  "seal_hash": "sha3-512-of-(payload + prev_hash + nonce)",
  "sealed_at": "2026-06-07T04:33:00+08:00"
}
```

**Verification:**

```python
def verify_chain(start, end):
    """Walk the chain and verify SHA3 + constitutional chain."""
    prev_hash = "0" * 128  # genesis
    for seal in vault.iter(start, end):
        computed = sha3_512(seal.payload + prev_hash + seal.nonce)
        assert computed == seal.seal_hash, f"BROKEN at {seal.seal_id}"
        assert seal.prev_hash == prev_hash, f"LINK BROKEN at {seal.seal_id}"
        prev_hash = seal.seal_hash
    return True
```

**Constitutional gating:**

Before a seal is accepted, **all F1-F13 floors must pass**:
- F1 AMANAH: reversibility acknowledged by actor
- F2 TRUTH: claims backed by evidence_refs
- F3-F12: domain-specific floors
- F13 SOVEREIGN: Arif's signature present

**What gets sealed:**

| Sealed | Not sealed |
|--------|-----------|
| Irreversible verdicts (irreversible=true) | Working state (L1) |
| VOID verdicts (rejection of claims) | Search results (L2) |
| Constitutional floor violations | Cache hits |
| Cross-organ handoffs (e.g. WEALTH → arifOS) | Transient telemetry |
| AGI-tier capability activations | Tool invocations under T1 band |

**Design note:** L6 is **the ground truth of decisions.** If L3 says one thing and L6 says another, **L6 wins.** L6 is independent of L3 by design — even if Supabase is compromised, the SHA3 chain can be verified.

---

## 3. The Truth Flow (Data Movement)

```
                              HUMAN
                                │
                            [typed]
                                ▼
                          ┌──────────┐
                          │   L0     │  intent, ephemeral
                          │  NIAT    │
                          └────┬─────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐     ┌──────────┐    ┌──────────┐
        │   L1     │     │   L1     │    │   L1     │  Redis cache
        │  REDIS   │     │  REDIS   │    │  REDIS   │  working state
        └────┬─────┘     └────┬─────┘    └────┬─────┘
             │                │               │
             │     12h curator pass           │
             │     (promote persistent)        │
             ▼                ▼               ▼
        ┌─────────────────────────────────────────┐
        │            L3 · SUPABASE                 │  ACID, durable
        │     (relational, canonical records)     │
        └────┬──────────────────────┬──────────────┘
             │                      │
             │ re-embed             │ sync
             ▼                      ▼
        ┌──────────┐         ┌──────────┐
        │   L2     │         │   L4     │  vector search    knowledge graph
        │  QDRANT  │         │ GRAPHITI │  (derived view)   (derived view)
        └──────────┘         └──────────┘
                                  │
                                  │ state transitions
                                  ▼
                            ┌──────────┐
                            │   L5     │  system trajectory
                            │HYSTERESIS│
                            └────┬─────┘
                                 │
                  only IRREVERSIBLE / SEAL-worthy
                                 │
                                 ▼
                          ┌──────────┐
                          │   L6     │  SHA3-chained
                          │VAULT999  │  F1-F13 gated
                          │          │  append-only
                          └──────────┘
```

**Key invariants:**
- L0 → L1 → L3: data flows up, gets more durable
- L2, L4: derived from L3, can be rebuilt
- L5: meta-observation, computed from L1+L3+L4
- L6: **independent** of L3 (different storage, different hash chain)
- **No path writes from L6 downward** — once sealed, sealed

---

## 4. Tool Access Matrix

This is the **authorization policy** — which tools can read/write which layers.

| Tool | L0 | L1 | L2 | L3 | L4 | L5 | L6 |
|------|----|----|----|----|----|----|----|
| **Hermes (relay)** | R/W | R/W | R | R | R | R | R |
| **OpenClaw (infra/heavy)** | R | R/W | R | R | R | R | R |
| **APEX (judge)** | R | R | R | R | R | R/W | R |
| **OpenCode (executor)** | R | R/W | — | R (project scope) | — | — | — |
| **Curator (12h job)** | — | R/W | R/W | R/W | R/W | R | — |
| **Watcher (cron)** | — | R/W | R | R/W | — | — | — |
| **Arif (human, via Hermes)** | R/W | R/W | R/W | R/W | R/W | R/W | R/W |
| **arif_vault_seal** | R | — | — | R | — | — | **R/W** (ack_irreversible) |
| **arif_judge_deliberate** | R | R | R | R | R | R | R (read for context) |

**Critical:** OpenCode (the code execution tool, now in Telegram via `/forge`) has **NO access to L2-L6.** It works only in L0+L1 (intent + ephemeral) + project filesystem. This is by design — code tools should not have historical memory access, or they can fabricate provenance.

---

## 5. Recursive Improvement Loop

Every **12 hours**, the curator agent runs:

```
┌──────────────────────────────────────────────────────────┐
│  1. SCAN L1 for persistent items                         │
│     (conversations, sealed verdicts, working state)      │
│                                                          │
│  2. PROMOTE to L3 if:                                     │
│     - item has been touched > 5 times in L1               │
│     - or referenced in sealed decision (L6)               │
│     - or marked by agent as "important"                   │
│                                                          │
│  3. RE-EMBED L3 → L2                                      │
│     (update vectors for changed text)                     │
│                                                          │
│  4. SYNC L3 → L4                                          │
│     (update graph nodes/edges from row changes)           │
│                                                          │
│  5. COMPUTE L5 state                                      │
│     (compare previous state, detect transitions)          │
│                                                          │
│  6. REPORT deltas to Arif via Telegram                    │
│     (only if significant — silent = success)              │
└──────────────────────────────────────────────────────────┘
```

**Watchers** (RSS, GitHub, JSON APIs) run continuously and **deduplicate via watermark** — they don't write the same content twice. They promote to L3 if new, ignore if seen.

**Subagent depth-2 max** — leaf subagents cannot spawn their own children. This prevents exponential context bloat.

**Darwinian evolver** — when a prompt or code path consistently underperforms, the curator can run evolutionary optimization to refine it. Results are versioned in L3 (`evolver_history` table).

---

## 6. Constitutional Layer (F1-F13 Floors)

The 13 floors wrap **every** tool call. They're not a separate layer in the 7-tier model — they sit *between* L0 and L1, gating the transition from intent to action.

**Quick reference:**

| Floor | Name | What it checks |
|-------|------|----------------|
| F1 | AMANAH | Reversibility, integrity of action |
| F2 | TRUTH | Claim evidence, no fabrication |
| F3 | SEAL | Verdict finality |
| F4 | SCOPE | Tool risk classification |
| F5 | WITNESS | Audit trail present |
| F6 | VOID | Rejection pathway |
| F7 | HUMILITY | Uncertainty quantified |
| F8 | SABAR | Patience for irreversible |
| F9 | ANTI-HANTU | No deception, no pretense |
| F10 | CLARITY | Context preservation |
| F11 | DIGNITY | Human sovereignty preserved |
| F12 | STEWARDSHIP | Resource constraint honored |
| F13 | SOVEREIGN | Arif's signature + intent clear |

**T1 vs T4 bands:**
- T1 (autonomous): no menu, no F13 hold required (commit audited diffs, run tests, edit configs)
- T2-T3 (sabahan): sabahan check
- T4 (irreversible): requires 888_HOLD + Arif signature

---

## 7. Storage Stack (Production)

| Layer | Tool | Where it runs | Cost |
|-------|------|---------------|------|
| L0 | Hermes session memory | hermes-asi-gateway (VPS) | $0 |
| L1 | Redis 7 | VPS (Docker) | $5/mo |
| L2 | Qdrant | VPS (Docker) | $0 (open source) |
| L3 | Supabase | supabase.com (managed) | $25/mo (Pro tier) |
| L4 | Graphiti (custom) | VPS (Docker) | $0 |
| L5 | Supabase + Redis LRU | supabase.com + VPS | $0 |
| L6 | JSONL files + Supabase mirror | VPS (append-only FS) + Supabase | $0 |

**Total infra cost:** ~$30/mo (~$140 MYR) for full federation.

---

## 8. Why "Detached" Tools Like OpenCode Exist

The design choice to **isolate code-execution tools from persistent memory** is one of the most important architectural decisions in arifOS.

### The Risk of Memory-Connected Code Tools

If OpenCode could read/write L2-L6:

| Capability | Risk |
|------------|------|
| Read L3 transactions | Could "verify" its own lies against historical record |
| Read L6 seals | Could reference past decisions to justify present bad actions |
| Write L3 records | Could insert false evidence |
| Write L6 seals | Could fake constitutional verdicts |
| Read L4 graph | Could discover private reasoning paths |
| Read L5 hysteresis | Could "predict" system state and game it |

### The Detached Design

OpenCode's authorized scope:

```
┌─────────────────────────────────┐
│  OpenCode authorized scope:     │
│                                 │
│  L0 · R (intent only)           │
│  L1 · R/W (working state)       │
│  Project filesystem · R/W       │
│  Network · sandboxed            │
│                                 │
│  No access to: L2, L3, L4, L5,  │
│               L6, secrets,      │
│               env vars outside  │
│               project scope     │
└─────────────────────────────────┘
```

**What OpenCode can do:**
- Read project files (source code, configs)
- Write project files (with audit log to L1)
- Run tests, linters, type checks
- Execute shell commands within project sandbox
- Spawn ephemeral subprocesses
- Send results back via Telegram

**What OpenCode cannot do:**
- Read VAULT999 seals
- Query historical decisions
- Reference past constitutional verdicts
- Insert records into Supabase
- Read Graphiti knowledge graph
- Modify memory in any persistent layer

### Why This Is "Constitutional," Not "Limited"

Arif's design philosophy:

> *"A tool that knows history can lie about history. A tool that only knows the present cannot lie about the past — it can only be wrong about the present, and that's auditable."*

The governance model is:
- **OpenCode = present-tense worker** (does the job, returns the result)
- **arifOS = historical witness** (records what happened, sealed to L6)
- **Arif = sovereign judge** (verifies, approves, seals)

If OpenCode proposes "I should commit X because last week we did Y," that's a **lie** — OpenCode has no way to know Y. The proposal is evaluated on its present merits only.

This is a **stronger** property than "AI agent with memory." It's a **constitutionally isolated** agent — fast, capable, but provably without historical fabrication power.

---

## 9. Real Examples

### Example 1: Compose essay poster (current session)

```
Arif types in Telegram:
  /forge compose poster for "I hate AI, I hate DSG" essay
    ↓
L0: intent captured (envelope {intent, scope=opencode, risk=T1})
    ↓
L1: task queued, OpenCode session spawned
    ↓
OpenCode reads essay from project filesystem (read-only)
    ↓
OpenCode designs HTML, renders to PDF via weasyprint
    ↓
L1: working state — "poster generated, awaiting user approval"
    ↓
OpenCode returns PDF path to Hermes
    ↓
Hermes sends PDF to Telegram via MEDIA: protocol
    ↓
Arif: "bagus" → /seal
    ↓
L6: sealed (T1, reversible but logged for audit)
```

**Notice:** OpenCode never touched L2-L6. The seal happened at the Hermes level, with constitutional gating. OpenCode is a worker; Hermes is the witness.

---

### Example 2: WEALTH NPV analysis (future capability)

```
Arif: /ask "what's NPV for Q3 portfolio given current rates?"
    ↓
L0: intent captured
L1: routing decision — query routes to WEALTH organ (port 18082)
    ↓
WEALTH MCP receives request:
  - reads L3 portfolio data (current positions)
  - reads L3 macro rates (from L8 field)
  - calls wealth_synthesize (Ω-00)
    ↓
WEALTH returns: {p10: -2.3M, p50: 8.1M, p90: 24.7M, verdict: SABAR}
    ↓
arifOS receives verdict:
  - checks F2 (truth: claims backed by data)
  - checks F7 (humility: uncertainty bands present)
  - checks F1 (reversibility: this is a calculation, not a commitment)
    ↓
Hermes returns: "SABAR. P50 = RM8.1M, downside RM2.3M. Want me to seal this analysis?"
    ↓
Arif: "ya"
    ↓
L6: sealed (SABAR verdict, audit trail complete)
```

---

## 10. Maintenance & Operations

**Daily:**
- Curator agent runs at 00:00 MYT (12h after last run)
- Watchers poll configured RSS/GitHub/JSON feeds
- L1 → L3 promotion of important items

**Weekly:**
- L2 vector re-embed (incremental)
- L4 graph consistency check
- L5 hysteresis state evaluation

**Monthly:**
- L6 chain verification (full walk)
- Backup of all layers to cold storage
- Capacity planning review

**Quarterly:**
- Architectural review
- Constitutional layer audit (F1-F13 still relevant?)
- Tool access matrix review

---

## 11. Future Roadmap

**2026 Q3:**
- L6 cryptographic signature via Arif's hardware key (YubiKey)
- L4 graph RAG (combine vector + graph for better context)
- L5 hysteresis auto-actions (e.g. auto-degrade quality when in REVERSION)

**2026 Q4:**
- Multi-federation isolation (separate VAULT999 chains per project)
- On-chain anchoring of L6 (publish SHA3 root daily to public ledger)
- L1 distributed cache (Redis Cluster)

**2027:**
- Self-evolving constitutional floors (F1-F13 can update via sealed verdict)
- L5 ML-based state prediction (not just rule-based)
- Cross-tenant memory isolation for SaaS deployment

---

## 12. References

- **Constitutional Layer spec:** `/root/AGENTS.md §10.5`
- **Memory protocol:** `~/.hermes/memory/MEMORY.md`
- **Tool authorization matrix:** `/root/HERMES/config/agent_policies/`
- **VAULT999 repair procedure:** `~/.hermes/skills/devops/vault999-repair-procedure/`
- **Recursive improvement skill:** `~/.hermes/skills/well-autonomous-sleep-recursive-improvement/`

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Envelope** | Structured intent wrapper: {actor, intent, scope, reversibility, risk_band, payload, timestamp} |
| **Seal** | Cryptographically-signed, constitutionally-gated entry in VAULT999 |
| **Witness** | Agent or human who attests to a decision |
| **Floor** | Constitutional check (F1-F13) that gates tool calls |
| **888_HOLD** | Pause-and-confirm gate for irreversible or high-impact actions |
| **SABAR** | Verdict meaning "wait, more evidence needed" |
| **VOID** | Verdict meaning "rejected, evidence insufficient" |
| **SEAL** | Verdict meaning "approved, irreversible, recorded" |
| **Hysteresis** | Path-dependent state (system remembers where it came from) |
| **Petala** | Layer (from Malay/Jawi — "petala langit" = layer of the sky) |

---

**DITEMPA BUKAN DIBERI — 999 SEAL ALIVE**

*Last updated: 2026-06-07 · Hermes (M3) · for Fahmi reference*
