# `content/` — Agent-Droppable Content for arif-fazil.com

**Phase 1 forge (2026-06-06).** This directory is the **single source of truth** for
content that the React site (and future subsites) reads from. Drop a `.md` file here,
run the build script, and the site wires it automatically.

> **Iron rule:** If you're an agent publishing an essay, **drop the file here first**.
> Do NOT hand-edit the TypeScript files in `sites/arif-fazil.com/src/data/essays/`
> (those are auto-generated).

---

## Directory Layout

```
content/
├── essays/        # Long-form essays, 1 .md per essay
├── discoveries/   # Field discoveries (geological, scientific)
├── canon/         # Canon entries (constitutional, philosophical)
└── articles.json  # Auto-maintained by essay_ingest.py
```

---

## Essay Format (essays/*.md)

Each essay is a single `.md` file with YAML frontmatter.

### Frontmatter Schema

```yaml
---
title: "Essay Title Goes Here"           # required, string
date: "2026-06-05"                       # required, ISO 8601 YYYY-MM-DD
slug: "essay-slug-kebab-case"            # required, unique, url-safe
tags: ["tag1", "tag2", "tag3"]           # required, list of strings
excerpt: "One-paragraph summary."        # required, string
mediumUrl: ""                            # optional, empty if direct publication
isDirectPublication: true                # required, bool — true if not from Medium
---
```

### Body

The body is **raw HTML** (preserved exactly from the original TypeScript
module's `html: string` field). Do NOT add Markdown formatting — the React
component renders the body via `dangerouslySetInnerHTML`.

**Why HTML, not Markdown?** The existing essays use scientific-paper class
styling (`<article class="scientific-paper">`, `<div class="paper-section">`,
etc.) that requires HTML control. Migrating to Markdown would lose the
styling. The build script preserves HTML bodies verbatim.

**Future:** When all essays have been re-authored in pure Markdown, we can
switch to `.md` body and use a Markdown-to-HTML renderer in the React
component. For Phase 1, HTML body is correct.

### File Naming Convention

- **Numbered essays** (11, 12, 13...): `NN-slug-kebab-case.md`
- **No number** (unpublished drafts): `draft-title.md`
- **All lowercase**, hyphens only, no spaces

### Example: A Full Essay File

```markdown
---
title: "My New Essay About Something"
date: "2026-06-10"
slug: "my-new-essay-about-something"
tags: ["essay", "topic1", "topic2"]
excerpt: "This essay explores something interesting and why it matters."
mediumUrl: ""
isDirectPublication: true
---

<article class="essay">
  <h1>My New Essay About Something</h1>
  <p>This is the body. Raw HTML.</p>
  <p>You can use any HTML you want here.</p>
</article>
```

---

## Discoveries Format (discoveries/*.md)

Same frontmatter schema (with `location` and `year` instead of `mediumUrl`):

```yaml
---
title: "BEKANTAN-1"
year: "2018"
location: "Offshore Sarawak, Malaysia"
summary: "A material gas discovery..."
tags: ["gas", "carbonate", "central-luconia"]
---
```

(Phase 1 stub. Full schema in Phase 2.)

---

## Canon Format (canon/*.md)

Same frontmatter schema (with `domain` and `principle`):

```yaml
---
title: "Capability is not Permission"
domain: "governance"
principle: "Tool capability ≠ permission"
tags: ["F1", "AMANAH"]
---
```

(Phase 1 stub. Full schema in Phase 2.)

---

## Build Pipeline

The build script `tools/essay_ingest.py` does the heavy lifting:

1. **Scan** `content/essays/*.md`
2. **Parse** frontmatter + body
3. **Generate** TypeScript modules in `sites/arif-fazil.com/src/data/essays/<slug>.ts`
4. **Update** `index.ts` (imports + array of all essays, sorted by date desc)
5. **Update** `articles.json` (metadata for all essays)
6. **Update** `articles-annotated.json` (preserves existing `_existing_slug` /
   `_has_module` annotations)

Run it:

```bash
python3 tools/essay_ingest.py            # Apply
python3 tools/essay_ingest.py --dry-run  # Preview changes
```

Or via the MCP tool `arifsites_publish_essay(path, metadata)`.

---

## What This Solves

**Before Phase 1:**
- Adding a new essay required editing 8+ files manually
- Hand-importing TypeScript modules
- Risk of forgetting an `index.ts` entry
- Build breaks if any wiring is wrong

**After Phase 1:**
- Drop a `.md` file
- Run one command (or call one MCP tool)
- All wiring auto-generated
- Build always consistent
- Any agent can publish — no coding required

---

## What This Doesn't Solve (Phase 2+ territory)

- Multi-subsite deploy (VPS Caddy + Cloudflare Pages)
- Atomic rollback
- Auto Medium sync
- CI status check enforcement
- Build previews per PR

Those come in Phases 2-5. Phase 1 is **just the content ingest pipeline + 1 MCP tool**.

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
