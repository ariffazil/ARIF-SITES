#!/usr/bin/env python3
"""
migrate_novel_essays.py — One-off migration of Nobel 11/12/13 from .ts to .md

Extracts frontmatter fields from existing TypeScript modules and writes
.md files in the new content/essays/ directory. This is a one-time
migration to seed the new pipeline.

After this runs, essay_ingest.py takes over and the .ts files become
auto-generated (committed for build reproducibility, but never hand-edited).

REPO=ariffazil/arif-sites
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path("/root/arif-sites")
ESSAYS_DIR = ROOT / "content" / "essays"
SOURCE_DIR = ROOT / "sites" / "arif-fazil.com" / "src" / "data" / "essays"

# Files to migrate (proven Nobel Eureka trilogy)
MIGRATION_TARGETS = [
    "11-contrast-detection-universal-computational-primitive-avo-attention.ts",
    "12-physics-constrained-attention-zoeppritz-constitutional-floor.ts",
    "13-derivation-avo-attention-contrast-primitive.ts",
]


def extract_ts_field(content: str, field: str) -> str | None:
    """Extract a top-level field from a const content: EssayContent = {...} block."""
    # Match: field: <value>,
    # Handle: template literals, arrays, booleans
    pattern = rf"^\s*{field}\s*:\s*(.+?),\s*$"
    m = re.search(pattern, content, re.MULTILINE)
    if not m:
        return None
    return m.group(1).strip()


def parse_ts_to_md(ts_path: Path) -> dict:
    """Parse a TypeScript essay module into structured fields."""
    text = ts_path.read_text(encoding="utf-8")

    # Find the const content: EssayContent = { ... }; block
    # Strategy: find start after "const content: EssayContent = {"
    # and end at matching "};" (the outer block end)
    start = text.find("const content: EssayContent = {")
    if start == -1:
        raise ValueError(f"No const content block in {ts_path}")
    # Advance past the { to the first field
    body_start = text.find("{", start)
    if body_start == -1:
        raise ValueError(f"No opening brace in {ts_path}")

    # Find matching closing brace by counting depth
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

    # Extract simple fields
    def get_str(name):
        m = re.search(
            rf'^\s*{name}\s*:\s*[`\'"]([^`\'"]*?)[`\'"],?\s*$', content, re.MULTILINE
        )
        return m.group(1) if m else None

    def get_str_any(name):
        # Match: name: 'value'  OR  name: `value`  OR  name: 'value with \'escapes\''
        m = re.search(
            rf"^\s*{name}\s*:\s*([\'`])(.*?)\1\s*,?\s*$",
            content,
            re.MULTILINE | re.DOTALL,
        )
        if not m:
            return None
        return m.group(2)

    def get_bool(name):
        m = re.search(rf"^\s*{name}\s*:\s*(true|false)\s*,?\s*$", content, re.MULTILINE)
        return m.group(1) == "true" if m else None

    def get_tags():
        # Match: tags: ["a", "b", "c"],
        m = re.search(
            r"^\s*tags\s*:\s*\[(.*?)\]\s*,?\s*$", content, re.MULTILINE | re.DOTALL
        )
        if not m:
            return []
        return re.findall(r'"([^"]*)"', m.group(1))

    def get_html():
        # Match: html: `...`,  — body may contain anything except backtick+comma at end
        # Use the same depth-counting trick to find matching backtick
        m = re.search(r"^\s*html\s*:\s*`", content, re.MULTILINE)
        if not m:
            return None
        start = m.end()
        # Walk forward, counting template literal ${} interpolations
        i = start
        depth_interp = 0
        while i < len(content):
            c = content[i]
            if depth_interp == 0 and c == "`":
                # End of template literal
                return content[start:i]
            elif c == "$" and i + 1 < len(content) and content[i + 1] == "{":
                depth_interp += 1
                i += 2
                continue
            elif depth_interp > 0 and c == "}":
                depth_interp -= 1
            i += 1
        return content[start:]

    return {
        "title": get_str_any("title"),
        "date": get_str("date"),
        "slug": get_str("slug"),
        "tags": get_tags(),
        "excerpt": get_str_any("excerpt"),
        "mediumUrl": get_str("mediumUrl") or "",
        "isDirectPublication": get_bool("isDirectPublication"),
        "html": get_html(),
    }


def to_md(parsed: dict) -> str:
    """Render parsed fields as a .md file with YAML frontmatter."""
    import yaml

    # Strip surrounding single/double quotes from .ts template-literal remnants
    def clean(v):
        if v is None:
            return ""
        v = v.strip()
        if len(v) >= 2 and v[0] in ("'", '"') and v[-1] == v[0]:
            v = v[1:-1]
        return v

    frontmatter = {
        "title": clean(parsed["title"]),
        "date": clean(parsed["date"]),
        "slug": clean(parsed["slug"]),
        "tags": parsed["tags"],
        "excerpt": clean(parsed["excerpt"]),
        "mediumUrl": clean(parsed.get("mediumUrl", "")),
        "isDirectPublication": parsed.get("isDirectPublication", True),
    }
    # Default false for isDirectPublication if missing
    if frontmatter["mediumUrl"] == "":
        # YAML: empty string is fine
        pass
    fm = yaml.safe_dump(
        frontmatter,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        default_style=None,
    )
    body = parsed["html"] or ""
    return f"---\n{fm}---\n\n{body}\n"


def main():
    print("=" * 70)
    print("NOBEL ESSAYS .ts → .md MIGRATION")
    print("=" * 70)
    print()
    results = []
    for filename in MIGRATION_TARGETS:
        src = SOURCE_DIR / filename
        if not src.exists():
            print(f"  ❌ NOT FOUND: {src}")
            results.append((filename, "missing"))
            continue
        try:
            parsed = parse_ts_to_md(src)
            md_content = to_md(parsed)
            out_name = filename.replace(".ts", ".md")
            dst = ESSAYS_DIR / out_name
            dst.write_text(md_content, encoding="utf-8")
            size = len(md_content)
            print(f"  ✅ {filename}")
            print(f"     → {dst.relative_to(ROOT)}")
            print(f"     {size:,} chars | title={parsed['title'][:60]!r}...")
            print(f"     tags={parsed['tags']}")
            results.append((filename, f"OK ({size:,} chars)"))
        except Exception as e:
            print(f"  ❌ FAILED: {filename}: {e}")
            results.append((filename, f"FAIL: {e}"))

    print()
    print("=" * 70)
    print("MIGRATION SUMMARY")
    print("=" * 70)
    for fn, status in results:
        print(f"  {fn}: {status}")
    print()
    print(f"Output: {ESSAYS_DIR}")
    print()
    print("Next step: run tools/essay_ingest.py to generate the .ts modules")
    print("from these .md files + update index.ts + articles.json.")


if __name__ == "__main__":
    main()
