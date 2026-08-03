# AGENTIC_WEB_MASTER.md — Site Automation & Governance Master Plan

> **DITEMPA BUKAN DIBERI** — Forged, not given.
> `arif-fazil.com` is a self-describing, self-verifying machine organism with a human UI skin.

---

## 1. Ground Truth & Core Topology

`arif-fazil.com` operates across 4 core organ dimensions:
- **CONTENT**: `makcikgpt`, `wealth`, `essays`, `discoveries`
- **IDENTITY**: `soul.json`, `did.json`, `agent.json`, `geologist-credential.json`
- **PROOF**: `/999/`, `VAULT999` outcomes, surface payload hashes
- **FEDERATION**: `/constellation/`, `arifos-federation.json`, `webmcp.json`, `mcp.arif-fazil.com`

---

## 2. The 7 Governing Automation Loops

### Loop 1: Content $\rightarrow$ Surface Auto-Sync (Drift Elimination)
- Every route is auto-registered from typed source (`src/data/makcikgpt/*.ts` + `essays.json`).
- `generate-discovery.cjs` auto-emits: `sitemap.xml`, `llms.txt`, `llms-full.txt`, `llms.json`, `page.json`, `surfaces.json`, `feed.xml`.
- **Zero Hand-Authoring Rule**: Hand-edited discovery surfaces fail `make verify`.

### Loop 2: Identity Freshness & Credential Pinning
- W3C DID document (`did:web:arif-fazil.com`) and `.well-known/agent.json` signature-verified on build.
- Cryptographic geologist credentials (`proof/geologist-credential.json`) signature-checked against expiration.

### Loop 3: Proof Generation (`/999/` & VAULT999 Receipts)
- Builds compute payload leaf hashes (`computeCanonicalPayloadHash`).
- Signed deploy pipeline appends release receipts to `VAULT999` (`/root/arifOS/VAULT999/outcomes.jsonl`).
- `/999/` dynamically lists sealed outcome hashes.

### Loop 4: Dual-Audience Rendering (Human SPA + Machine Agent Surfaces)
- **Human Surface**: Pre-rendered SSR React SPA (`Vite` + `Puppeteer`).
- **Machine Surface**: Machine-readable Markdown mirrors under `/makcikgpt-md/`, `/wealth-md/`, `/essays-md/`.
- Dual JSON-LD: Schema.org standard `NewsArticle` + custom `af:claimRegister` namespaced provenance block.

### Loop 5: Federation Liveness & Constellation Truth
- `/constellation/` polls organ health (`arifOS` :8088, `GEOX` :8081, `WEALTH` :18082, `WELL` :18083).
- Strict degradation display: Distinguishes `TRANSPORT REACHABLE` from `GOVERNED` and `SEALED`. Stale telemetry auto-degrades to `UNKNOWN`.

### Loop 6: Atomic Deploy & Rollback Protocol (`FORGE`)
- Single deploy path: `make deploy` (`verify` $\rightarrow$ `build` $\rightarrow$ `reload`).
- Pre-deploy gate: Fail-closed verification (`make verify`).
- Rollback: Revert to previous sealed release + clear static Caddy/prerender cache (`rm -rf dist/`).

### Loop 7: Continuous Immune Audit
- `verify-surfaces.cjs` polls 53 public surfaces on every build/deploy.
- Asserts route parity: `llms.json` routes $\equiv$ `sitemap.xml` routes $\equiv$ live HTTP 200/301 endpoints.

---

## 3. Master Guard Gates (Enforced in `make verify`)

```bash
# G1: Zero Legacy URL Drift (100% /world/makcikgpt/ purity)
grep -rq "wealth/makcikgpt" scripts/ && exit 1

# G2: Discovery Parity Assert
node scripts/generate-discovery.cjs --check-parity || exit 1

# G3: Payload Hash Idempotency
node scripts/lib/makcik-source.cjs --test-hash-idempotency || exit 1

# G4: Graduated Sealed Article Provenance Gate
node scripts/lib/makcik-source.cjs --enforce-sealed-gate || exit 1

# G5: Valid JSON-LD Schema.org Check
node scripts/validate-jsonld.cjs || exit 1

# G6: Full Pipeline Generation Idempotency
make build && sha256sum dist/makcikgpt-md/*.md > /tmp/run1.sum
make build && sha256sum dist/makcikgpt-md/*.md > /tmp/run2.sum
diff /tmp/run1.sum /tmp/run2.sum || exit 1
```

---

## 4. Swarm Execution Contract

1. **One Source of Truth**: The typed code is canon; JSON/XML surfaces are build exhaust.
2. **Dual-Render Everything**: Every route publishes a human UI and an agentic `.md`/`.json` mirror.
3. **No Unsigned Seals**: Compute is open to any build; `VAULT999` write requires F13 sovereign signature during deploy.
