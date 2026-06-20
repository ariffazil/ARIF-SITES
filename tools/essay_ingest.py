#!/usr/bin/env python3
"""
essay_ingest.py — Build script that converts content/essays/*.md into the
TypeScript modules + index.ts + articles.json that the React site uses.

**This is the single source of truth for the arif-fazil.com essay surface.**

Pipeline:
  1. Scan content/essays/*.md  (NEW agent-droppable content)
  2. Scan sites/.../data/essays/*.ts  (legacy hand-authored, including generated/)
  3. Generate:
     - sites/.../data/essays/<slug>.ts  (one per .md, preserving existing)
     - sites/.../data/essays/index.ts  (imports + sorted array)
     - sites/.../data/essays/articles.json  (metadata for all)
     - sites/.../data/essays/articles-annotated.json  (preserves _existing_slug/_has_module)

After running, the React build can proceed as normal — index.ts has all
the imports it needs, and the .ts modules are byte-compatible with the
existing structure.

Usage:
  python3 tools/essay_ingest.py            # Apply (default)
  python3 tools/essay_ingest.py --dry-run  # Preview diff
  python3 tools/essay_ingest.py --check    # Verify everything is in sync (exit 0/1)

REPO=ariffazil/arif-sites
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml

ROOT = Path("/root/arif-sites")
CONTENT_DIR = ROOT / "content" / "essays"
ESSAYS_DATA_DIR = ROOT / "sites" / "arif-fazil.com" / "src" / "data" / "essays"

# Files in ESSAYS_DATA_DIR that should NOT be treated as essay modules
INDEX_FILES = {"index.ts", "types.ts"}
GENERATED_DIR = ESSAYS_DATA_DIR / "generated"  # auto-generated Medium essays

TEMPLATE_LITERAL = "`"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from a .md file. Returns (meta, body)."""
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    try:
        meta = yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML frontmatter: {e}")
    body = parts[2].lstrip("\n")
    return meta, body


def js_string(value: str) -> str:
    """Render a Python string as a JS template literal (backticks-safe)."""
    if value is None:
        return '""'
    # Escape backticks and ${} for template literal
    escaped = value.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return f"`{escaped}`"


def js_array(values: list[str]) -> str:
    """Render a Python list of strings as a JS array."""
    quoted = ", ".join(js_string(v) for v in values)
    return f"[{quoted}]"


def render_ts_module(parsed: dict) -> str:
    """Render a parsed essay as a TypeScript module (matching existing style)."""
    comment = parsed.get("_comment", "")
    comment_block = f"// {comment}\n" if comment else ""
    return (
        f"{comment_block}import type {{ EssayContent }} from './types';\n\n"
        f"const content: EssayContent = {{\n"
        f"  title: {js_string(parsed['title'])},\n"
        f"  date: '{parsed['date']}',\n"
        f"  slug: '{parsed['slug']}',\n"
        f"  tags: {js_array(parsed['tags'])},\n"
        f"  excerpt: {js_string(parsed['excerpt'])},\n"
        f"  mediumUrl: '{parsed.get('mediumUrl', '')}',\n"
        f"  isDirectPublication: {str(parsed.get('isDirectPublication', True)).lower()},\n"
        f"  html: {js_string(parsed['html'])},\n"
        f"}};\n\n"
        f"export default content;\n"
    )


def load_legacy_ts_module(ts_path: Path) -> dict | None:
    """Parse a legacy .ts essay module (returns same shape as parse_frontmatter)."""
    try:
        text = ts_path.read_text(encoding="utf-8")
    except Exception:
        return None

    # Strip import + export
    start = text.find("const content: EssayContent = {")
    if start == -1:
        return None
    body_start = text.find("{", start)
    if body_start == -1:
        return None
    # Find matching brace
    depth = 0
    end = body_start
    for i in range(body_start, len(text)):
        c = text[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                end = i
                break
    content = text[body_start + 1 : end]

    def get_str_any(name):
        m = re.search(
            rf"^\s*{name}\s*:\s*([\'`])(.*?)\1\s*,?\s*$",
            content,
            re.MULTILINE | re.DOTALL,
        )
        return m.group(2) if m else None

    def get_tags():
        m = re.search(
            r"^\s*tags\s*:\s*\[(.*?)\]\s*,?\s*$", content, re.MULTILINE | re.DOTALL
        )
        if not m:
            return []
        return re.findall(r'"([^"]*)"', m.group(1))

    def get_html():
        m = re.search(r"^\s*html\s*:\s*`", content, re.MULTILINE)
        if not m:
            return None
        start = m.end()
        i = start
        depth_interp = 0
        while i < len(content):
            c = content[i]
            if depth_interp == 0 and c == "`":
                return content[start:i]
            elif c == "$" and i + 1 < len(content) and content[i + 1] == "{":
                depth_interp += 1
                i += 2
                continue
            elif depth_interp > 0 and c == "}":
                depth_interp -= 1
            i += 1
        return content[start:]

    def get_bool(name):
        m = re.search(rf"^\s*{name}\s*:\s*(true|false)\s*,?\s*$", content, re.MULTILINE)
        return m.group(1) == "true" if m else None

    return {
        "title": get_str_any("title"),
        "date": get_str_any("date"),
        "slug": get_str_any("slug"),
        "tags": get_tags(),
        "excerpt": get_str_any("excerpt"),
        "mediumUrl": get_str_any("mediumUrl") or "",
        "isDirectPublication": get_bool("isDirectPublication") or False,
        "html": get_html() or "",
        "_source": "ts",
    }


def collect_essays() -> list[dict]:
    """Collect all essays from .md (priority) and legacy .ts (fallback)."""
    essays = {}

    # 1. .md files (authoritative source for new content)
    if CONTENT_DIR.exists():
        for md_path in sorted(CONTENT_DIR.glob("*.md")):
            text = md_path.read_text(encoding="utf-8")
            meta, body = parse_frontmatter(text)
            if not meta.get("slug"):
                print(f"  ⚠️  Skipping {md_path.name}: no slug in frontmatter")
                continue
            parsed = {
                "title": meta.get("title", ""),
                "date": str(meta.get("date", "")),
                "slug": meta["slug"],
                "tags": meta.get("tags", []),
                "excerpt": meta.get("excerpt", ""),
                "mediumUrl": meta.get("mediumUrl", ""),
                "isDirectPublication": meta.get("isDirectPublication", False),
                "html": body,
                "_source": "md",
                "_path": md_path,
            }
            essays[parsed["slug"]] = parsed

    # 2. Legacy .ts files (hand-authored, including generated/)
    for ts_path in ESSAYS_DATA_DIR.glob("*.ts"):
        if ts_path.name in INDEX_FILES:
            continue
        parsed = load_legacy_ts_module(ts_path)
        if not parsed or not parsed.get("slug"):
            continue
        # If .md also has this slug, prefer .md (already in dict)
        if parsed["slug"] not in essays:
            parsed["_source"] = "ts"
            parsed["_path"] = ts_path
            essays[parsed["slug"]] = parsed

    # 3. Generated/ subfolder (Medium-linked auto essays)
    if GENERATED_DIR.exists():
        for ts_path in sorted(GENERATED_DIR.glob("*.ts")):
            parsed = load_legacy_ts_module(ts_path)
            if not parsed or not parsed.get("slug"):
                continue
            if parsed["slug"] not in essays:
                parsed["_source"] = "generated"
                parsed["_path"] = ts_path
                essays[parsed["slug"]] = parsed

    return list(essays.values())


def render_index_ts(essays: list[dict]) -> str:
    """Generate index.ts with imports + sorted array + getEssay function."""

    # Sort by date descending (newest first)
    def sort_key(e):
        try:
            return e.get("date", "0000-00-00")
        except Exception:
            return "0000-00-00"

    essays_sorted = sorted(essays, key=sort_key, reverse=True)

    # Group by source
    md_essays = [e for e in essays_sorted if e["_source"] == "md"]
    ts_essays = [e for e in essays_sorted if e["_source"] == "ts"]
    gen_essays = [e for e in essays_sorted if e["_source"] == "generated"]

    lines = [
        "/* AUTO-GENERATED by tools/essay_ingest.py — do not hand-edit. */",
        "/* Source of truth: content/essays/*.md  (Phase 1 forge 2026-06-06) */",
        "/* Regenerate: python3 tools/essay_ingest.py */",
        "",
        "import type { EssayMeta } from './types';",
        "",
    ]

    # Hand-authored .ts imports (existing legacy)
    if ts_essays:
        lines.append("// Hand-authored direct publication essays (legacy .ts files)")
        for e in ts_essays:
            import_name = e["_path"].stem  # filename without .ts
            lines.append(
                f"import e_{e['slug'].replace('-', '_')} from './{import_name}';"
            )
        lines.append("")

    # .md-generated .ts imports
    if md_essays:
        lines.append("// .md-sourced essays (auto-generated TypeScript modules)")
        for e in md_essays:
            import_name = e["slug"]  # the generated .ts uses slug as filename
            lines.append(
                f"import m_{e['slug'].replace('-', '_')} from './{import_name}';"
            )
        lines.append("")

    # Generated/ Medium essays
    if gen_essays:
        lines.append(
            "// Lightweight Medium-linked essay modules (auto-generated from articles.json)"
        )
        for e in gen_essays:
            import_name = e["_path"].stem
            lines.append(
                f"import g_{e['slug'].replace('-', '_')} from './generated/{import_name}';"
            )
        lines.append("")

    # essayModules array
    lines.append("const essayModules: EssayMeta[] = [")
    for e in essays_sorted:
        if e["_source"] == "md":
            ref = f"m_{e['slug'].replace('-', '_')}"
        elif e["_source"] == "ts":
            ref = f"e_{e['slug'].replace('-', '_')}"
        else:
            ref = f"g_{e['slug'].replace('-', '_')}"
        lines.append(
            f"  {{ title: {js_string(e['title'])}, date: '{e['date']}', slug: '{e['slug']}', excerpt: {js_string(e['excerpt'])}, tags: {js_array(e['tags'])}, mediumUrl: '{e.get('mediumUrl', '')}' }},"
        )
    lines.append("];")
    lines.append("")
    lines.append("export function getEssay(slug: string) {")
    lines.append("  return essayModules.find(e => e.slug === slug);")
    lines.append("}")
    lines.append("")

    return "\n".join(lines)


def render_articles_json(essays: list[dict]) -> str:
    """Update articles.json — preserve existing entries, ADD new .md-sourced essays.

    Strategy: existing articles.json may have slugs that differ from .ts module
    slugs (legacy data). We DO NOT regenerate from scratch. We only ADD new
    entries for essays sourced from .md that don't already exist in articles.json.
    """
    existing_path = ESSAYS_DATA_DIR / "articles.json"
    existing = []
    if existing_path.exists():
        try:
            existing = json.loads(existing_path.read_text(encoding="utf-8"))
        except Exception:
            existing = []

    existing_slugs = {a.get("slug") for a in existing}

    # Add new entries from .md essays that don't exist
    added = 0
    for e in essays:
        if e["_source"] != "md":
            continue
        if e["slug"] in existing_slugs:
            continue
        existing.append(
            {
                "slug": e["slug"],
                "title": e["title"],
                "date": e["date"],
                "categories": e.get("tags", []),
                "mediumUrl": e.get("mediumUrl", ""),
                "hasContent": True,
            }
        )
        added += 1

    # Sort by date desc
    existing.sort(key=lambda a: a.get("date", ""), reverse=True)

    if added > 0:
        print(
            f"  📝 articles.json: added {added} new entries (preserved {len(existing) - added} existing)"
        )
    else:
        print(
            f"  📝 articles.json: preserved all {len(existing)} existing entries (no new .md essays)"
        )
    return json.dumps(existing, indent=2, ensure_ascii=False) + "\n"


def render_articles_annotated_json(essays: list[dict]) -> str:
    """Update articles-annotated.json — preserve existing, ADD new .md entries.

    Same strategy as articles.json. Preserves the _existing_slug/_has_module
    debug markers and any custom annotations from prior runs.
    """
    existing_path = ESSAYS_DATA_DIR / "articles-annotated.json"
    existing = []
    if existing_path.exists():
        try:
            existing = json.loads(existing_path.read_text(encoding="utf-8"))
        except Exception:
            existing = []

    existing_slugs = {a.get("slug") for a in existing}

    added = 0
    for e in essays:
        if e["_source"] != "md":
            continue
        if e["slug"] in existing_slugs:
            continue
        existing.append(
            {
                "slug": e["slug"],
                "title": e["title"],
                "date": e["date"],
                "categories": e.get("tags", []),
                "mediumUrl": e.get("mediumUrl", ""),
                "hasContent": True,
                "_existing_slug": e["slug"],
                "_has_module": True,
            }
        )
        added += 1

    existing.sort(key=lambda a: a.get("date", ""), reverse=True)

    if added > 0:
        print(
            f"  📝 articles-annotated.json: added {added} new entries (preserved {len(existing) - added} existing)"
        )
    else:
        print(
            f"  📝 articles-annotated.json: preserved all {len(existing)} existing entries"
        )
    return json.dumps(existing, indent=2, ensure_ascii=False) + "\n"


def render_md_ts_module(parsed: dict) -> str:
    """Render a .md essay as a TypeScript module (matches legacy format)."""
    return render_ts_module(parsed)


def write_if_changed(path: Path, new_content: str) -> bool:
    """Write file only if content changed. Returns True if written."""
    if path.exists() and path.read_text(encoding="utf-8") == new_content:
        return False
    path.write_text(new_content, encoding="utf-8")
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Essay ingest: .md → .ts + index + articles"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Preview only, no writes"
    )
    parser.add_argument("--check", action="store_true", help="Verify in sync, exit 0/1")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    args = parser.parse_args()

    print("=" * 70)
    print("ESSAY INGEST — content/essays/*.md → TypeScript")
    print("=" * 70)
    print()

    # Step 1: Collect
    essays = collect_essays()
    print(f"  📚 Collected {len(essays)} essays:")
    by_source = {}
    for e in essays:
        by_source.setdefault(e["_source"], []).append(e)
    for src, items in by_source.items():
        print(f"     {src}: {len(items)}")
    print()

    # Step 2: Plan
    plan = []

    # .md essays → generate .ts files in ESSAYS_DATA_DIR (NOT in content/)
    for e in essays:
        if e["_source"] == "md":
            out_path = ESSAYS_DATA_DIR / f"{e['slug']}.ts"
            content = render_md_ts_module(e)
            plan.append(
                (
                    "MD→TS",
                    e["_path"],
                    out_path,
                    content,
                )
            )

    # index.ts (always regenerated)
    plan.append(
        (
            "REWRITE",
            ESSAYS_DATA_DIR / "index.ts",
            ESSAYS_DATA_DIR / "index.ts",
            render_index_ts(essays),
        )
    )

    # articles.json
    plan.append(
        (
            "REWRITE",
            ESSAYS_DATA_DIR / "articles.json",
            ESSAYS_DATA_DIR / "articles.json",
            render_articles_json(essays),
        )
    )

    # articles-annotated.json
    plan.append(
        (
            "REWRITE",
            ESSAYS_DATA_DIR / "articles-annotated.json",
            ESSAYS_DATA_DIR / "articles-annotated.json",
            render_articles_annotated_json(essays),
        )
    )

    # Print plan
    print("  📋 Plan:")
    for action, src, dst, _ in plan:
        # src may be a relative path string OR absolute Path
        if isinstance(src, str):
            src_str = src
        else:
            try:
                src_str = str(src.relative_to(ROOT))
            except ValueError:
                src_str = str(src)
        if isinstance(dst, str):
            dst_str = dst
        else:
            try:
                dst_str = str(dst.relative_to(ROOT))
            except ValueError:
                dst_str = str(dst)
        print(f"     [{action}] {src_str} → {dst_str}")
    print()

    # Step 3: Execute
    if args.dry_run:
        print("  🧪 DRY RUN — no writes")
        print()
        return 0

    written = 0
    skipped = 0
    for action, src, dst, content in plan:
        if action == "MD→TS":
            if write_if_changed(dst, content):
                written += 1
                if args.verbose:
                    print(f"     WROTE {dst.relative_to(ROOT)}")
            else:
                skipped += 1
                if args.verbose:
                    print(f"     UNCHANGED {dst.relative_to(ROOT)}")
        else:
            if write_if_changed(dst, content):
                written += 1
                if args.verbose:
                    print(f"     WROTE {dst.relative_to(ROOT)}")
            else:
                skipped += 1
                if args.verbose:
                    print(f"     UNCHANGED {dst.relative_to(ROOT)}")

    print()
    print(f"  ✅ Wrote: {written} | Unchanged: {skipped}")
    print()
    print("=" * 70)
    print("INGEST COMPLETE")
    print("=" * 70)
    print()
    print("Next step: cd sites/arif-fazil.com && npm run build")
    print("Then: git status && git add -A && git commit")

    return 0


if __name__ == "__main__":
    sys.exit(main())
