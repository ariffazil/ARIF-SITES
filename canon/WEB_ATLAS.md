---
title: WEB_ATLAS
version: ATLAS-1.0
epoch: SEAL-2026-08-01-f13-batch-ack
actor: kimi-code/FI-008
sovereign: ARIF (Muhammad Arif bin Fazil, F13)
ratified_by: sovereign (F13) — 999_SEAL
doctrine: DITEMPA BUKAN DIBERI
---

# ⛩️ WEB_ATLAS — The Supreme Constitution

> **Premise:** Without foundation, automation is **BANGANG** because the agent
> moves fast inside a reality it does not understand. The Atlas is the foundation.

> **Authority:** Supreme. Every page, route, design, content, and verification
> decision in the arif-fazil.com federation defers to this document.

> **Forgery:** Any page, agent, or build that contradicts this document is
> **VOID** by F9 ANTIHANTU.

---

## 0. The One Law

> **No page may define its own identity, navigation, route, color, or proof status.
> It must inherit from Atlas.**

| If you are... | You consult Atlas to... |
|---|---|
| A human coder | know what is canonical before implementation |
| An AI agent | know what to propose, then await SEAL |
| A sovereign | decide what changes, then authorize the Atlas update |
| A build pipeline | know what to validate, what to lint, what to reject |
| A reader | navigate the federation consistently |

---

## 1. The Three Scopes (Trinity)

The federation has three active scopes. Each has a color, a pattern, an organ, and a doctrine.

```
                ┌───────────────────────────────────────────────┐
                │                                               │
                │              /arif (sovereign)                │
                │       bare background · F13 anchor            │
                │                                               │
                │   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
                │   │  /human  │   │/instit-  │   │  /earth  │  │
                │   │  RED     │   │ution     │   │ TEAL     │  │
                │   │  WELL    │   │ YELLOW   │   │ GEOX     │  │
                │   │ 12083    │   │ AAA 3001 │   │ 8081     │  │
                │   │ health   │   │ cockpit  │   │ earth    │  │
                │   └──────────┘   └──────────┘   └──────────┘  │
                │        ▲             ▲               ▲       │
                │        └─────────────┴───────────────┘       │
                │                       │                       │
                │                  /institution/aaa             │
                │                  (the BRIDGE center)         │
                │                  amber · only exception      │
                │                                               │
                └───────────────────────────────────────────────┘
                                  /laws (faintest — laws are quiet)
```

### 1.1 Sovereign /arif

- **Path:** `/arif`
- **Pattern:** BARE — no background image, no fractal
- **Color:** blue-900 (dark, severe)
- **Audience:** public, sovereign-only-F13
- **Doctrine:** "The absence of pattern IS the marker. Sovereign = no decoration."
- **Canonical role:** F13 anchor — the human's seat

### 1.2 /human — HUMAN scope

- **Path:** `/human`
- **Primary organ:** WELL (port 18083)
- **MCP endpoint:** `https://well.arif-fazil.com/mcp`
- **Pattern:** chordial-light (sparse, warm)
- **Color:** YELLOW (#FFCC00) — primary human warmth
- **Audience:** public, health-workers, sociologists
- **Doctrine:** "Substrate, dignity, witness. The people-side of the federation.
  Sovereignty is preserved — humans are NOT replaced."
- **Posture:** `REFLECT_ONLY` — WELL observes, never diagnoses

### 1.3 /institution — INSTITUTION scope

- **Path:** `/institution`
- **Primary organ:** AAA (port 3001) — the cockpit bridge
- **Pattern:** orthogonal-fractal (full unit-cell lattice, structural)
- **Color:** AMBER (#D4A853) — ONLY non-primer exception (AAA bridge)
- **Audience:** public, regulators, executives
- **Doctrine:** "Old + new institutions live here. WEALTH is the legacy.
  arifOS · A-FORGE · AAA are the agentic layer (the new institution). The
  transformation is visible: old beside new."
- **Posture:** `DISPLAY_ONLY` — AAA shows, never adjudicates

### 1.4 /earth — EARTH scope

- **Path:** `/earth`
- **Primary organ:** GEOX (port 8081)
- **Pattern:** chordial-dense (stellated, root-like)
- **Color:** TEAL (#00D4AA) — honest green-blue
- **Audience:** public, geoscientists, energy-professionals, philosophers
- **Doctrine:** "Known earth + the void. GEOX computes physical evidence.
  HERMES sits at the edge where known meets unknown. MCP is the membrane."
- **Posture:** `COMPUTE_ONLY` — GEOX computes, never adjudicates

### 1.5 /laws — Cross-cutting

- **Path:** `/laws`
- **Pattern:** orthogonal-fractal-FAINTEST (2% alpha)
- **Audience:** researchers, auditors, sovereign
- **Doctrine:** "F1-F13 constitutional floors. The laws that govern the
  federation. Quieter than scopes — laws are quiet."

---

## 2. The Universal Frame

Every page — without exception — uses the **universal_frame**.

```
┌────────────────────────────────────────────┐
│ sovereign_strip (32px sticky, blue-900)     │  ← F13_OK · actor · version · ?
├────────────────────────────────────────────┤
│ breadcrumb (mono, 12px, › at 40%)          │  ← arif › human › well
├────────────────────────────────────────────┤
│                                            │
│  page_content (h1 + lede + body)          │  ← varies per template
│                                            │
│   ┌──┐  ⊕  ┌──┐  ⊕  ┌──┐                  │
│   │  │     │  │     │  │   (trinity_ring) ◄── ONE per page
│   └──┘     └──┘     └──┘                  │
│                                            │
├────────────────────────────────────────────┤
│ prev_next_nav (◀ / ▶)                      │
├────────────────────────────────────────────┤
│ mission_footer (VAULT999 · last sealed ·    │
│   doctrine version · kernel build hash)    │
└────────────────────────────────────────────┘
```

**Invariant:** No page may redefine the frame. The frame is the Federation's
identity. If a page needs a different frame, that page is wrong.

---

## 3. The Three Templates

### 3.1 trinity-tile-page

- **Use:** Homepage (`/`), scope pages (`/human`, `/institution`, `/earth`)
- **Frame:** `universal_frame`
- **Anatomy:** sovereign_strip → breadcrumb → h1 → lede → trinity_tile_row (3 cards + AAA bridge) → toroidal_anchor → prev_next_nav → mission_footer
- **Toroidal:** `trinity_ring` (3 arcs converging on AAA bridge)

### 3.2 organ-page

- **Use:** Organ detail pages (`/human/well`, `/institution/aaa`, `/earth/geox`)
- **Frame:** `universal_frame`
- **Anatomy:** strip → breadcrumb → h1 → lede → organ_card grid → MCP affordance → epistemic_label strip → prev_next_nav → mission_footer
- **Toroidal:** `trinity_ring` (top of organ card grid) OR none

### 3.3 surface-page

- **Use:** Full content surfaces (`/arif`, `/laws`, `/institution/petronas`, `/institution/makcikgpt`)
- **Frame:** `universal_frame`
- **Anatomy:** strip → breadcrumb → h1 → lede → body (long-form) → epistemic_labels → prev_next_nav → mission_footer
- **Toroidal:** `mission_wheel` (on `/missions`) OR none

### 3.4 agent override

Same IA, agent render mode (carbon canvas, Plex Mono only, no shadows, no transforms, tight density, MARUAH voice, MCP affordance on every card).

---

## 4. The Color Law

Three primers. One exception. RED IS RATIONED.

| Color | Use | Hex | Token |
|---|---|---|---|
| Yellow | HUMAN | `#FFCC00` | `var(--yellow-500)` |
| Blue | INSTITUTION (ink) | `#1E3A8A` | `var(--blue-500)` |
| Teal | EARTH | `#00D4AA` | `var(--teal-500)` |
| Amber | AAA cockpit ONLY (exception) | `#D4A853` | `var(--amber-500)` |
| Red | RATIONED — 3 surfaces only | `#E63946` | `var(--red-500)` |

**Red is rationed to:**
1. Sovereign strip verdict chip
2. HOLD/VOID button backgrounds
3. VAULT999 seal indicators

Any red elsewhere = design VOID.

**Contrast (WCAG AAA verified):**
- Yellow on paper: 1.41:1 → use yellow-900 for TEXT (8.51:1 AAA)
- Blue on paper: 12.23:1 AAA — text-on-paper
- Teal on paper: 1.78:1 → use teal-900 for TEXT (9.08:1 AAA)

---

## 5. The Visual Anchor Law

**ONE torus per page.** Two or more = design VOID.

| Torus | Use |
|---|---|
| `trinity_ring` | 3 arcs converging on AAA bridge (homepage, scope pages, constellation views) |
| `mission_wheel` | 6 concentric arcs (Investigate, Interpret, Decide, Build, Monitor, Remember) — on `/missions` only |

The torus is the braningmark. Look once. Know it.

---

## 6. The Component Law

### 6.1 Button Grades

| Grade | Border | Color | Use |
|---|---|---|---|
| SEAL | solid | domain accent OR `--teal-500` | confirmed verdicts, primary CTAs |
| HOLD | dashed (2px) | `--yellow-500` | drafts, pending, awaiting sovereign |
| VOID | solid | `--red-500` (RATIONED) | irreversible actions only — hold-to-confirm 800ms |

### 6.2 Tactile Physics

| State | Lift | Shadow |
|---|---|---|
| Rest | 0px | `0 1px 0 {scope-dark}` |
| Hover | -1px | `0 2px 0 {scope-dark}` |
| Active | +1px | `inset 0 2px 4px rgba(0,0,0,0.25)` |
| Focus | — | 3px ring currentColor 30% |
| Disabled | 0px | none, opacity 0.4 |
| Loading | pulse | `0 1px 0 → 0 3px 0 → 0 1px 0` (1.2s) |

All interactive elements MUST have these states. No exceptions.

---

## 7. The Typography Law

| Voice | Family | Use |
|---|---|---|
| human | IBM Plex Sans | body, h2, h3, UI text |
| doctrine | IBM Plex Serif | display, h1, /laws, /arif/writings, doctrinal surfaces |
| machine | IBM Plex Mono | caption, breadcrumbs, code, IDs, epistemic labels, state labels, JSON keys |

**Rules:**
- Display: once per page (the trinity title)
- H1: once per page (the page title)
- Line length: 65ch body, 80ch headings
- Mono: structural not stylistic. Never paragraphs.
- Weight discipline: 400 / 600 / 700. No 500. No 300.
- Self-hosted only. No Google Fonts.

---

## 8. The Content Model

Every page has a content model. The page renders from the content model. The agent edits the content model, not random HTML.

```json
{
  "title": "WELL — Human Vitality",
  "audience": "human",
  "intent": "vitality",
  "ring": "HUMAN",
  "primary_action": {
    "label": "Read /human/well",
    "href": "/human/well",
    "grade": "SEAL"
  },
  "proof_action": {
    "label": "Verify on /999",
    "href": "/999/well",
    "grade": "VOID"
  },
  "epistemic_register": "EMPATHY",
  "ring_accents": ["yellow-500", "yellow-700", "yellow-50"]
}
```

Full schema: `content-model.schema.json`.

---

## 9. The Routing Law

### 9.1 One-hop (D3)

Every redirect lands directly on the canonical path. No chains.

```
arifos.arif-fazil.com → arif-fazil.com/institution/arifos/    [1 hop]
aaa.arif-fazil.com → arif-fazil.com/institution/aaa/         [1 hop]
well.arif-fazil.com → arif-fazil.com/human/well/             [1 hop]
```

### 9.2 MCP exempt (D1)

MCP endpoints dual-serve on subdomain AND canonical path. Never redirect.

```
forge.arif-fazil.com/mcp     ←→  arif-fazil.com/institution/aforge/mcp
mcp.arif-fazil.com/          ←→  arif-fazil.com/earth/mcp/
arifos.arif-fazil.com/mcp    ←→  arif-fazil.com/institution/arifos/mcp
```

### 9.3 Tombstones (D7)

Internal-only services return 410 Gone publicly.

```
openclaw.arif-fazil.com      → 410 (Tailscale mesh only)
claw.arif-fazil.com          → 410
headscale.arif-fazil.com     → 410
arifflow.arif-fazil.com      → 410
atlas.arif-fazil.com         → 410
```

### 9.4 Canary (D6)

WELL is the canary. 15-min cadence × 72h. 0 unexpected 5xx → green → Phase 4b opens remaining organs.

---

## 10. The MCP Law

Every organ has a single canonical MCP endpoint. Dual-served on subdomain + path for backward compatibility.

| Organ | Subdomain MCP | Path MCP |
|---|---|---|
| arifOS | `arifos.arif-fazil.com/mcp` | `/institution/arifos/mcp` |
| A-FORGE | `forge.arif-fazil.com/mcp` | `/institution/aforge/mcp` |
| AAA | `aaa.arif-fazil.com/mcp` | `/institution/aaa/mcp` |
| GEOX | `geox.arif-fazil.com/mcp` | `/earth/geox/mcp` |
| WEALTH | `wealth.arif-fazil.com/mcp` | `/institution/wealth/mcp` |
| WELL | `well.arif-fazil.com/mcp` | `/human/well/mcp` |
| arifOS canonical | `arifos.arif-fazil.com:8088/mcp` | (kernel) |
| Membrane | `mcp.arif-fazil.com/` | `/earth/mcp/` |

---

## 11. The Verification Gates

Before any deploy, the following must pass:

| Gate | Check |
|---|---|
| G1 JSON Schema | Every canon JSON validates against `public-state.schema.json` |
| G2 Schema parity | All 3 canon copies (source, live, web-canon) have md5 parity |
| G3 Build | `npm run build` exits 0 |
| G4 Caddy | `caddy validate` exits 0 |
| G5 Routes | Every canonical URL returns 200; every retired URL 301s correctly |
| G6 Links | No broken internal links |
| G7 Navigation | Universal frame appears on every page |
| G8 Tokens | Design tokens loaded; no hard-coded colors |
| G9 Layout | Templates.json lint passes (3-template discipline) |
| G10 Geometry | One torus per page (lint blocks) |
| G11 Typography | IBM Plex only (lint blocks) |
| G12 Components | Button grades (SEAL/HOLD/VOID) honored; red rationed |
| G13 Visual | Playwright screenshots match baseline |
| G14 Epistemic | Each claim has evidence label (OBS · DER · INT · SPEC) |
| G15 Floor | F1-F13 floors held (no VIOIDs from agent lane) |
| G16 F6 | Dual register (EMPATHY human, MARUAH kernel) |
| G17 Receipt | VAULT999 receipt sealed |

Full checklist: `verification-checklist.yaml`.

---

## 12. The Agent Workflow

```
1. Read atlas.json
2. Identify affected routes (sites.yaml)
3. Identify affected components (components.json)
4. Identify affected tokens (design-tokens.json, geometry.json)
5. Propose change using content-model.schema.json
6. Show diff (single page review)
7. Run build (npm run build, caddy validate)
8. Run route checks (every canonical URL 200; retired 301)
9. Run visual checks (Playwright + atlas lints)
10. Produce receipt (forge_vault mode=receipt)
11. WAIT for ARIF SEAL
```

If you skip a step, the result is BANGANG.

---

## 13. The Lint Rules (block-build on failure)

| Rule | Source | fail_action |
|---|---|---|
| `red_ration_buttons` | design-tokens.json | block build |
| `hold_to_confirm_required_for_void` | components.json | block build |
| `bop_travel_required` | components.json | block build |
| `contrast_minimum` | design-tokens.json | block build |
| `red_ration` | design-tokens.json | block build |
| `one_torus_per_page` | geometry.json | block build |
| `torus_present` | geometry.json | warn only |
| `single_skeleton` | typography.json | block build |
| `one_hop_redirects` | redirects.yaml | block build |
| `sovereign_bare` | geometry.json | block build |

---

## 14. The Federation Organs (with postures)

| Organ | Port | Path | MCP | Posture |
|---|---|---|---|---|
| arifOS | 8088 | /institution/arifos | arifos.arif-fazil.com/mcp | JUDGE_ONLY |
| A-FORGE | 7071 | /institution/aforge | forge.arif-fazil.com/mcp | EXECUTE_AFTER_SEAL |
| AAA | 3001 | /institution/aaa | aaa.arif-fazil.com/mcp | DISPLAY_ONLY |
| arifFLOW | 7073 | (tombstoned) | (internal) | METABOLIZE_ONLY |
| GEOX | 8081 | /earth/geox | geox.arif-fazil.com/mcp | COMPUTE_ONLY |
| WEALTH | 18082 | /institution/wealth | wealth.arif-fazil.com/mcp | COMPUTE_ONLY |
| WELL | 18083 | /human/well | well.arif-fazil.com/mcp | REFLECT_ONLY |
| HERMES | 8644 | /earth/hermes | (RFC 2119 silent) | REFLECT_ONLY |

**Posture legend:**
- `JUDGE_ONLY` — judges, never executes
- `EXECUTE_AFTER_SEAL` — acts only after SEAL from arifOS
- `DISPLAY_ONLY` — shows, never adjudicates
- `METABOLIZE_ONLY` — schedules, checkpoints, never judges
- `COMPUTE_ONLY` — computes, never adjudicates
- `REFLECT_ONLY` — observes, never diagnoses

---

## 15. The Floor Alignment (F1-F13)

| Floor | Atlas Enforcement |
|---|---|
| F1 AMANAH | All canon changes go through git. Reversible. |
| F2 TRUTH | Every claim has evidence label (OBS · DER · INT · SPEC). |
| F3 TRI-WITNESS | Human × AI × Verifier ≥ 0.75 — Atlas build + lint + Playwright |
| F4 CLARITY | ΔS ≤ 0 — Atlas lowers entropy by being THE source |
| F5 PEACE² | Non-destructive — Atlas never modifies an organ without sovereign ack |
| F6 DUAL-REGISTER | MARUAH on kernel, EMPATHY on human — templates.json agent_overrides |
| F7 HUMILITY | Ω₀ ∈ [0.03, 0.05] — Atlas admits its own gaps in this document |
| F8 GENIUS | G = (A·P·E·X)^(¼) ≥ 0.80 — components.json lint rules |
| F9 ANTIHANTU | No deception — Red rationed, three surfaces only |
| F10 ONTOLOGY | AI ≠ being — Federation.json postures never claim sentience |
| F11 AUDITABILITY | Every change is in git — F11 WAJIB gate in canon-sync.sh |
| F12 RESILIENCE | Injection defense — One-hop redirect, schema validation |
| F13 SOVEREIGN | Human veto final — SOVEREIGN_BARE / SOVEREIGN_BLANK invariants |

---

## 16. The Atlas Itself

The Atlas is a living document. It changes when:

| Trigger | Action |
|---|---|
| New scope added | Update sites.yaml + navigation.json + design-tokens.json + federation.json |
| New organ | Update sites.yaml + federation.json + redirects.yaml |
| New redirect | Update redirects.yaml + sites.yaml |
| New color | Update design-tokens.json (with WCAG matrix proof) |
| New component | Update components.json (withtactile physics) |
| New template | Update templates.json (with frame anatomy) |
| Floor changes | Update CANON + this doc, F13-gated |
| Doctrine ratified | 999_SEAL + update version + seal VAULT999 |

---

## 17. The Atlas Doctrine

> **The Atlas is the map. The territory is `/root/*` repos, `/var/www/html/` webroots, and the Caddy/Cloudflare membrane.**
>
> **The map is committed to be useful.**
>
> **Forgery is detectable.**

— DITEMPA BUKAN DIBERI
