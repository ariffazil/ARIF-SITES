#!/usr/bin/env python3
"""
MakcikGPT Daily Publish Script

Reads the latest WEALTH briefing from public/data/wealth/latest.json,
translates the top rakyat-facing signal into BM Makcik voice,
and publishes a new article at src/data/makcikgpt/daily-YYYY-MM-DD.ts.

Usage:
    python3 scripts/makcikgpt-daily-publish.py [--date YYYY-MM-DD] [--dry-run]

Environment (optional but recommended):
    OPENAI_API_KEY or AZURE_OPENAI_KEY + AZURE_OPENAI_ENDPOINT
    If no key is provided, the script falls back to a deterministic template.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MAKCIK_DIR = REPO_ROOT / "sites" / "arif-fazil.com" / "src" / "data" / "makcikgpt"
LATEST_JSON = (
    REPO_ROOT
    / "sites"
    / "arif-fazil.com"
    / "public"
    / "data"
    / "wealth"
    / "latest.json"
)

DEFAULT_TAGLINES: dict[str, str] = {
    "COST OF LIVING": "Duit Raya vs Harga Barang",
    "POLITICS": "Teh Tarik Politik",
    "OIL_ENERGY": "Minyak & Gas Kita",
    "ECONOMY": "Ekonomi Rakyat",
    "GLOBAL": "Dunia Luar Sana",
}


def slugify(title: str) -> str:
    s = re.sub(r"[^\w\s-]", "", title.lower())
    s = re.sub(r"[\s_]+", "-", s)
    return s.strip("-")


def pick_top_signal(data: dict[str, Any]) -> dict[str, Any]:
    """Pick the most rakyat-relevant signal from the latest briefing."""
    so_what = data.get("so_what", [])
    if not so_what:
        raise ValueError("latest.json has no 'so_what' signals")

    priority = {"COST OF LIVING": 1, "POLITICS": 2, "OIL_ENERGY": 3, "ECONOMY": 4}
    scored: list[tuple[int, dict[str, Any]]] = []
    for item in so_what:
        domain = (item.get("domain") or "").upper()
        score = priority.get(domain, 10)
        scored.append((score, item))

    scored.sort(key=lambda x: x[0])
    return scored[0][1]


def build_prompt(signal: dict[str, Any], meta: dict[str, Any], date_str: str) -> str:
    domain = (signal.get("domain") or "Rakyat").lower().replace("_", " ")
    headline = signal.get("signal", "Berita hari ini")
    for_arif = signal.get("for_arif", "")
    date_label = datetime.strptime(date_str, "%Y-%m-%d").strftime("%d %B %Y")

    return (
        f"Tulis satu artikel BM gaya Makcik Pasar Malam untuk jiran-jiran Malaysia. "
        f"Tajuk utama: '{headline}'. "
        f"Domain: {domain}. "
        f"Naratif untuk rakyat biasa: {for_arif}. "
        "Gaya: warm, direct, jiran-friendly. Gunakan Bahasa Malaysia pasar yang mudah difahami. "
        "Panjang: 3-4 perenggan. Akhiri dengan nota 'DITEMPA BUKAN DIBERI — MakcikGPT bersuara untuk rakyat.'"
    )


def template_article(
    signal: dict[str, Any], date_str: str
) -> tuple[str, str, str, str]:
    """Fallback deterministic generator when no LLM key is available."""
    date_label = datetime.strptime(date_str, "%Y-%m-%d").strftime("%d %B %Y")
    domain = (signal.get("domain") or "Rakyat").upper()
    tagline = DEFAULT_TAGLINES.get(domain, "Cerita Harian")
    headline = signal.get("signal", "Berita Harian untuk Rakyat Malaysia")
    for_arif = signal.get("for_arif", "")
    title = f"{tagline}: {headline}"
    slug = f"daily-{date_str}"

    html = f"""<div class="cover">
<p class="cover-emoji">🇲🇾 🫖 🇲🇾</p>
<p class="cover-kicker">MakcikGPT Harian — {date_label}</p>
<h1 class="cover-title">{headline}</h1>
<p class="cover-subtitle">{tagline} — untuk jiran-jiran yang nak faham isi penting tanpa jargon</p>
<div class="cover-byline">
<strong>Oleh MakcikGPT</strong><br>
999 Meterai · Bahasa Makcik · {date_label}
</div>
</div>

<h1>{headline}</h1>
<p><strong>{for_arif}</strong></p>
<p>Makcik baca berita pagi tadi dan terus terfikir: siapa yang untung, siapa yang kena? Jiran-jiran kena tahu, jangan asyik dengar cakap orang saja.</p>
<p>Signal ini masuk kategori <strong>{domain}</strong>. Untuk kita rakyat biasa, yang penting ialah: hati-hati dengan cerita separuh masak, jangan share sebelum verify, dan ingat — duit kita, suara kita, maruah kita.</p>
<p><strong>DITEMPA BUKAN DIBERI — MakcikGPT bersuara untuk rakyat.</strong></p>
"""
    return slug, title, tagline, html


def call_openai(prompt: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")

    import urllib.request
    import urllib.error

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(
            {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are MakcikGPT, a wise Malaysian auntie who explains news in Bahasa Malaysia pasar. Output plain HTML body only, no markdown code blocks.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            }
        ).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"]


def call_azure(prompt: str) -> str:
    api_key = os.environ.get("AZURE_OPENAI_KEY")
    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    if not api_key or not endpoint:
        raise RuntimeError("AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT must be set")

    import urllib.request

    url = f"{endpoint.rstrip('/')}/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-01"
    req = urllib.request.Request(
        url,
        data=json.dumps(
            {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are MakcikGPT, a wise Malaysian auntie who explains news in Bahasa Malaysia pasar. Output plain HTML body only, no markdown code blocks.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            }
        ).encode("utf-8"),
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"]


def generate_article(
    signal: dict[str, Any], meta: dict[str, Any], date_str: str
) -> tuple[str, str, str, str]:
    date_label = datetime.strptime(date_str, "%Y-%m-%d").strftime("%d %B %Y")
    domain = (signal.get("domain") or "Rakyat").upper()
    tagline = DEFAULT_TAGLINES.get(domain, "Cerita Harian")
    headline = signal.get("signal", "Berita Harian untuk Rakyat Malaysia")
    title = f"{tagline}: {headline}"
    slug = f"daily-{date_str}"

    prompt = build_prompt(signal, meta, date_str)

    html: str | None = None
    if os.environ.get("OPENAI_API_KEY"):
        try:
            html = call_openai(prompt)
        except Exception as e:
            print(f"[warn] OpenAI failed: {e}", file=sys.stderr)
    elif os.environ.get("AZURE_OPENAI_KEY"):
        try:
            html = call_azure(prompt)
        except Exception as e:
            print(f"[warn] Azure OpenAI failed: {e}", file=sys.stderr)

    if html is None:
        print(
            "[info] No LLM key available; using deterministic template.",
            file=sys.stderr,
        )
        return template_article(signal, date_str)

    if not html.strip().startswith("<"):
        html = f"<h1>{headline}</h1>\n{html}\n<p><strong>DITEMPA BUKAN DIBERI — MakcikGPT bersuara untuk rakyat.</strong></p>"

    return slug, title, tagline, html


def escape_ts_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("`", "\\`")


def write_module(slug: str, title: str, date_str: str, html: str) -> Path:
    module_path = MAKCIK_DIR / f"{slug}.ts"
    var_name = slug.replace("-", "_")
    content = f"""import type {{ ArticleContent }} from './types';

const {var_name}: ArticleContent = {{
  slug: '{slug}',
  html: `{escape_ts_string(html)}`,
}};

export default {var_name};
"""
    module_path.write_text(content, encoding="utf-8")
    print(f"[write] {module_path}")
    return module_path


def update_index(
    slug: str, title: str, tagline: str, date_str: str, excerpt: str
) -> None:
    index_path = MAKCIK_DIR / "index.ts"
    index_text = index_path.read_text(encoding="utf-8")

    # Add import
    var_name = slug.replace("-", "_")
    import_line = f"import {var_name} from './{slug}';"
    if import_line not in index_text:
        index_text = index_text.replace(
            "export const makcikArticleModules: ArticleContent[] = [",
            f"{import_line}\nexport const makcikArticleModules: ArticleContent[] = [",
        )

    # Add module
    module_entry = f"  {var_name},"
    if module_entry not in index_text:
        index_text = index_text.replace(
            "export const makcikArticleModules: ArticleContent[] = [\n",
            f"export const makcikArticleModules: ArticleContent[] = [\n{module_entry}\n",
        )

    # Add meta
    tags = ["makcikgpt", "harian", "rakyat", "bm"]
    meta_entry = f"""  {{
    slug: '{slug}',
    title: '{escape_ts_string(title)}',
    subtitle: '{escape_ts_string(tagline)} — untuk jiran-jiran Malaysia',
    date: '{date_str}',
    domain: 'MAKCIKGPT × HARIAN',
    language: 'ms',
    excerpt: '{escape_ts_string(excerpt)}',
    tags: {json.dumps(tags)},
    seal: '999',
  }},
"""
    if f"slug: '{slug}'" not in index_text:
        index_text = index_text.replace(
            "export const makcikArticlesMeta: MakcikArticleMeta[] = [\n",
            f"export const makcikArticlesMeta: MakcikArticleMeta[] = [\n{meta_entry}",
        )

    index_path.write_text(index_text, encoding="utf-8")
    print(f"[update] {index_path}")


def build_site() -> None:
    site_dir = REPO_ROOT / "sites" / "arif-fazil.com"
    print(f"[build] npm run build in {site_dir}")
    subprocess.run(["npm", "run", "build"], cwd=site_dir, check=True)


def deploy_site() -> None:
    print("[deploy] ./deploy-vps.sh")
    subprocess.run(["./deploy-vps.sh"], cwd=REPO_ROOT, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish daily MakcikGPT article")
    parser.add_argument(
        "--date",
        default=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        help="Article date (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Generate files but do not build/deploy"
    )
    parser.add_argument(
        "--no-deploy", action="store_true", help="Build but do not deploy"
    )
    args = parser.parse_args()

    if not LATEST_JSON.exists():
        print(f"[error] Missing {LATEST_JSON}", file=sys.stderr)
        return 1

    data = json.loads(LATEST_JSON.read_text(encoding="utf-8"))
    meta = data.get("meta", {})

    signal = pick_top_signal(data)
    print(f"[signal] {signal.get('domain')}: {signal.get('signal')}")

    slug, title, tagline, html = generate_article(signal, meta, args.date)
    print(f"[article] {slug}: {title}")

    write_module(slug, title, args.date, html)
    update_index(slug, title, tagline, args.date, signal.get("for_arif", ""))

    if args.dry_run:
        print("[dry-run] Skipping build/deploy.")
        return 0

    build_site()

    if not args.no_deploy:
        deploy_site()

    return 0


if __name__ == "__main__":
    sys.exit(main())
