#!/usr/bin/env python3
"""web_zen.py — Agentic web zen control surface (A-FORGE workshop modes).

NOT a new permanent MCP inventory tool. One CLI for future agents so they
do not re-discover 2026-07-23 deploy scars.

Modes (GREEN unless noted):
  sense              Map source/live, commodity APIs, SPA routes, missions
  verify             Content-truth crawl (HTTP + body markers)
  orphan             Dry-run rsync --delete preview (YELLOW read)
  ephemeral          Generate → test → destroy disposable script (GREEN sandbox)
  doctor             sense + verify + commodity + missions contract
  caddy-reload-hint  Print safe reload path (does NOT mutate)

Doctrine:
  Agent may create capability. Agent may NOT create authority.
  Tool Explorer = engine room. Humans use /missions.

DITEMPA BUKAN DIBERI — 2026-07-30
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
REPO = Path(os.environ.get("ARIF_SITES_REPO", "/root/arif-fazil.com"))
SITE_PUBLIC = REPO / "sites" / "arif-fazil.com" / "public"
SITE_DIST = REPO / "sites" / "arif-fazil.com" / "dist"
LIVE_ROOT = Path(os.environ.get("ARIF_SITES_HTML_ARIF", "/var/www/html/arif"))
CADDYFILE = Path(os.environ.get("ARIF_SITES_CADDYFILE", "/etc/caddy/Caddyfile"))
URLS_CORE = SCRIPT_DIR / "urls.core.txt"
FORGE_WORK = Path("/root/forge_work")
EPHEMERAL_ROOT = FORGE_WORK / "ephemeral"
DEFAULT_TIMEOUT = 12

# Content-truth markers: 200 alone is a soft-404 lie (F2)
# SPA routes: shell HTML will not contain React text — markers checked in JS bundle.
TRUTH_MARKERS: dict[str, list[str]] = {
    "https://arif-fazil.com/missions": ["Six missions", "Investigate", "human cockpit"],
    "https://arif-fazil.com/missions.json": ['"schema"', "investigate", "Six missions"],
    "https://arif-fazil.com/llms.txt": [
        "Canonical 8",
        "Ditempa Bukan Diberi",
        "Five Organs",
    ],
    "https://arif-fazil.com/wealth/vitals/": [
        "tripwire",
        "Sovereign extraction",
        "PETRONAS",
    ],
    "https://mcp.arif-fazil.com/explorer.html": ["Engine room", "missions"],
    "https://arif-fazil.com/000/": ["000", "genesis"],
    "https://arif-fazil.com/999/": ["999", "proof", "seal"],
    "https://arif-fazil.com/wealth/gold/api/proxies": ["brent", "timestamp"],
    "https://arif-fazil.com/economics": [
        "WEALTH",
        "capital",
        "KLCI",
        "Ringgit",
    ],
    "https://arif-fazil.com/writing": [
        "essay",
        "writing",
        "SERIES",
        "collection",
    ],
}

# Paths served as SPA shell (try_files → index.html). Markers live in assets.
SPA_SHELL_URLS = {
    "https://arif-fazil.com/missions",
    "https://arif-fazil.com/",
    "https://arif-fazil.com/doctrine",
}


@dataclass
class Check:
    name: str
    ok: bool
    detail: str
    band: str = "GREEN"  # GREEN | YELLOW | ORANGE | RED


@dataclass
class Report:
    mode: str
    ts: str
    ok: bool
    checks: list[Check] = field(default_factory=list)
    meta: dict[str, Any] = field(default_factory=dict)

    def add(self, name: str, ok: bool, detail: str, band: str = "GREEN") -> None:
        self.checks.append(Check(name, ok, detail, band))
        if not ok:
            self.ok = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "mode": self.mode,
            "ts": self.ts,
            "ok": self.ok,
            "checks": [asdict(c) for c in self.checks],
            "meta": self.meta,
            "doctrine": "capability≠authority · ephemeral first · missions not tool menus",
        }


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def fetch(
    url: str, timeout: int = DEFAULT_TIMEOUT, max_bytes: int = 200_000
) -> tuple[int, str, str]:
    """Return (status, body, error). max_bytes caps body (SPA assets need larger)."""
    # Prefer local asset when probing own site (faster + full file for F2)
    if url.startswith("https://arif-fazil.com/assets/"):
        local = LIVE_ROOT / url.split("https://arif-fazil.com/", 1)[1]
        if local.is_file():
            try:
                return 200, local.read_text(errors="replace"), ""
            except Exception as e:
                return 0, "", str(e)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "web-zen/1.0 (+arif-fazil.com; content-truth)"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read(max_bytes)
            body = raw.decode("utf-8", errors="replace")
            return int(resp.status), body, ""
    except urllib.error.HTTPError as e:
        try:
            body = e.read(50_000).decode("utf-8", errors="replace")
        except Exception:
            body = ""
        return int(e.code), body, str(e)
    except Exception as e:
        return 0, "", str(e)


def load_urls(path: Path | None = None) -> list[str]:
    p = path or URLS_CORE
    urls: list[str] = []
    if not p.exists():
        return urls
    for line in p.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        urls.append(line)
    return urls


def cmd_sense(args: argparse.Namespace) -> Report:
    r = Report(mode="sense", ts=utc_now(), ok=True)
    r.meta["paths"] = {
        "repo": str(REPO),
        "public": str(SITE_PUBLIC),
        "dist": str(SITE_DIST),
        "live": str(LIVE_ROOT),
        "caddy": str(CADDYFILE),
    }

    # Source / live presence
    for label, path in [
        ("source.missions.ts", REPO / "sites/arif-fazil.com/src/data/missions.ts"),
        ("source.missions.json", SITE_PUBLIC / "missions.json"),
        ("live.missions.json", LIVE_ROOT / "missions.json"),
        ("live.index.html", LIVE_ROOT / "index.html"),
        ("script.web_zen", SCRIPT_DIR / "web_zen.py"),
    ]:
        exists = path.exists()
        r.add(label, exists, str(path) if exists else f"MISSING {path}")

    # Caddy SPA + static registration (chaos killer for /missions 404)
    if CADDYFILE.exists():
        caddy = CADDYFILE.read_text(errors="replace")
        r.add(
            "caddy.spa_routes.missions",
            "/missions*" in caddy or re.search(r"missions\*", caddy) is not None,
            "missions* must be in @spa_routes (else catch-all 404)",
            "YELLOW",
        )
        r.add(
            "caddy.root_static.missions_json",
            "/missions.json" in caddy,
            "missions.json must be in @root_static",
            "YELLOW",
        )
    else:
        r.add("caddyfile", False, f"missing {CADDYFILE}", "ORANGE")

    # Commodity APIs (vitals proxies depend on gold :3456)
    for port, name in [(3456, "gold"), (3457, "oil"), (3458, "gas")]:
        code, body, err = fetch(f"http://127.0.0.1:{port}/api/ticker", timeout=5)
        ok = code == 200 and bool(body)
        r.add(
            f"commodity.{name}:{port}",
            ok,
            f"HTTP {code}"
            if ok
            else f"DOWN {err or code} — systemctl start {name}-api",
            "YELLOW" if not ok else "GREEN",
        )

    # Mission contract
    mj = LIVE_ROOT / "missions.json"
    if mj.exists():
        try:
            data = json.loads(mj.read_text())
            verbs = [m.get("verb") for m in data.get("missions", [])]
            r.add(
                "missions.count",
                len(verbs) == 6,
                f"verbs={verbs}",
            )
            r.add(
                "missions.doctrine",
                "Six missions" in json.dumps(data.get("doctrine", {})),
                "doctrine.title present",
            )
        except Exception as e:
            r.add("missions.json.parse", False, str(e), "YELLOW")

    # Engine room demotion
    exp = Path("/var/www/html/mcp/explorer.html")
    if exp.exists():
        txt = exp.read_text(errors="replace")
        r.add(
            "explorer.engine_room_banner",
            "engine-room-banner" in txt or "Engine room" in txt,
            "Tool Explorer must declare engine room ≠ cockpit",
        )

    return r


def cmd_verify(args: argparse.Namespace) -> Report:
    r = Report(mode="verify", ts=utc_now(), ok=True)
    urls = load_urls(Path(args.urls) if args.urls else None)
    if args.url:
        urls = [args.url]
    if not urls:
        r.add("urls", False, "no URLs loaded", "YELLOW")
        return r

    results = []
    for url in urls:
        code, body, err = fetch(url, timeout=args.timeout)
        markers = TRUTH_MARKERS.get(url, [])
        haystack = body
        spa_note = ""
        # SPA shell: pull linked index-*.js and search markers there (F2 honesty)
        if url.rstrip("/") in {u.rstrip("/") for u in SPA_SHELL_URLS} or (
            code == 200 and "assets/index-" in body and markers
        ):
            m = re.search(r"(/assets/index-[A-Za-z0-9_-]+\.js)", body)
            if m:
                asset_url = "https://arif-fazil.com" + m.group(1)
                ac, ab, _ = fetch(asset_url, timeout=args.timeout, max_bytes=3_000_000)
                if ac == 200 and ab:
                    haystack = body + "\n" + ab
                    spa_note = f" spa_bundle={m.group(1)} asset_bytes={len(ab)}"
        missing = [mk for mk in markers if mk.lower() not in haystack.lower()]
        # Soft-404 patterns
        soft = code == 200 and (
            "404 — Not Found" in body
            or body.strip() in ("", "404")
            or (len(body) < 80 and "not found" in body.lower())
        )
        ok = code == 200 and not soft and not missing
        detail = f"HTTP {code} bytes={len(body)}{spa_note}"
        if err:
            detail += f" err={err}"
        if soft:
            detail += " SOFT404"
        if missing:
            detail += f" missing_markers={missing}"
        r.add(f"url.{url}", ok, detail, "GREEN" if ok else "YELLOW")
        results.append({"url": url, "code": code, "ok": ok, "missing": missing})
    r.meta["results"] = results
    r.meta["pass"] = sum(1 for x in results if x["ok"])
    r.meta["fail"] = sum(1 for x in results if not x["ok"])
    return r


def cmd_orphan(args: argparse.Namespace) -> Report:
    """YELLOW — dry-run only. Never applies rsync --delete."""
    r = Report(
        mode="orphan", ts=utc_now(), ok=True, meta={"band": "YELLOW", "mutates": False}
    )
    src = Path(args.src)
    dest = Path(args.dest)
    if not src.is_dir() or not dest.is_dir():
        r.add("paths", False, f"src={src} dest={dest} must be directories", "ORANGE")
        return r

    # rsync dry-run delete list
    cmd = ["rsync", "-avzn", "--delete", f"{src}/", f"{dest}/"]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        out = (proc.stdout or "") + (proc.stderr or "")
    except Exception as e:
        r.add("rsync", False, str(e), "ORANGE")
        return r

    deleting = [ln for ln in out.splitlines() if ln.startswith("deleting ")]
    r.meta["delete_count"] = len(deleting)
    r.meta["delete_sample"] = deleting[:40]
    # Heuristic: any delete of non-trivial paths → HOLD signal
    hold = len(deleting) > 0
    r.add(
        "orphan.preview",
        True,  # command succeeded
        f"{len(deleting)} would be deleted (HOLD if unexpected)",
        "YELLOW" if hold else "GREEN",
    )
    if hold and not args.allow_deletes:
        r.add(
            "orphan.policy",
            False,
            "deletes listed — review before any rsync --delete; re-run with --allow-deletes only after human review",
            "ORANGE",
        )
        r.ok = False  # fail closed for automation
    return r


def cmd_ephemeral(args: argparse.Namespace) -> Report:
    """GREEN sandbox: write temp script, run, destroy. No secrets, no production paths."""
    r = Report(
        mode="ephemeral",
        ts=utc_now(),
        ok=True,
        meta={"band": "GREEN", "authority": "NONE"},
    )
    EPHEMERAL_ROOT.mkdir(parents=True, exist_ok=True)
    eid = hashlib.sha256(f"{time.time()}:{args.task}".encode()).hexdigest()[:12]
    work = EPHEMERAL_ROOT / f"ephem-{eid}"
    work.mkdir(parents=True, exist_ok=False)
    r.meta["work"] = str(work)
    r.meta["task"] = args.task

    # Deny list — ephemeral must not claim authority
    deny = [
        r"kunci-mas",
        r"vault\.flat",
        r"/\.secrets/",
        r"systemctl\s+(restart|stop|disable)",
        r"caddy\s+reload",
        r"git\s+push",
        r"DROP\s+TABLE",
        r"rm\s+-rf\s+/",
        r"chmod\s+777",
    ]

    code = args.code
    if args.code_file:
        code = Path(args.code_file).read_text()
    if not code:
        # Default safe probe generator for the stated task
        code = f'''#!/usr/bin/env python3
"""Ephemeral tool — auto-generated. Task: {args.task!r}
Destroys with parent CLI. No authority. GREEN only.
"""
import json, sys, urllib.request
task = {args.task!r}
# minimal: fetch missions.json and print mission verbs
url = "https://arif-fazil.com/missions.json"
try:
    with urllib.request.urlopen(url, timeout=10) as r:
        data = json.loads(r.read().decode())
    verbs = [m.get("verb") for m in data.get("missions", [])]
    print(json.dumps({{"task": task, "verbs": verbs, "ok": len(verbs) == 6}}))
    sys.exit(0 if len(verbs) == 6 else 2)
except Exception as e:
    print(json.dumps({{"task": task, "ok": False, "error": str(e)}}))
    sys.exit(1)
'''

    for pat in deny:
        if re.search(pat, code, re.I):
            r.add("ephemeral.deny", False, f"code matches deny pattern: {pat}", "RED")
            if not args.keep:
                shutil.rmtree(work, ignore_errors=True)
            return r

    script = work / "tool.py"
    script.write_text(code)
    script.chmod(0o700)
    r.add("ephemeral.write", True, str(script))

    # Test
    try:
        proc = subprocess.run(
            [sys.executable, str(script)],
            capture_output=True,
            text=True,
            timeout=args.timeout,
            cwd=str(work),
            env={
                **{
                    k: v
                    for k, v in os.environ.items()
                    if not re.search(
                        r"(API_KEY|SECRET|PASSWORD|PRIVATE_KEY|KUNCI|Bearer)", k, re.I
                    )
                },
                "HOME": str(work),
                "PYTHONDONTWRITEBYTECODE": "1",
            },
        )
        out = (proc.stdout or "")[-4000:]
        err = (proc.stderr or "")[-2000:]
        r.add(
            "ephemeral.test",
            proc.returncode == 0,
            f"exit={proc.returncode} stdout={out[:500]!r} stderr={err[:200]!r}",
        )
        r.meta["stdout"] = out
        r.meta["returncode"] = proc.returncode
    except subprocess.TimeoutExpired:
        r.add("ephemeral.test", False, f"timeout {args.timeout}s", "YELLOW")
    except Exception as e:
        r.add("ephemeral.test", False, str(e), "YELLOW")

    # Destroy
    if args.keep:
        r.add("ephemeral.destroy", True, f"KEPT {work} (--keep)", "YELLOW")
        r.meta["destroyed"] = False
    else:
        shutil.rmtree(work, ignore_errors=True)
        gone = not work.exists()
        r.add(
            "ephemeral.destroy",
            gone,
            "destroyed" if gone else f"FAILED to remove {work}",
        )
        r.meta["destroyed"] = gone

    r.meta["promotion"] = (
        "NOT_PROPOSED — run repeatedly + human approve before permanent skill"
    )
    return r


def cmd_doctor(args: argparse.Namespace) -> Report:
    r = Report(mode="doctor", ts=utc_now(), ok=True)
    for sub in (cmd_sense, cmd_verify):
        if sub is cmd_verify:
            ns = argparse.Namespace(urls=None, url=None, timeout=args.timeout)
        else:
            ns = args
        part = sub(ns)
        for c in part.checks:
            r.checks.append(c)
            if not c.ok:
                r.ok = False
        r.meta[part.mode] = part.meta

    # Ephemeral self-smoke (safe default task)
    eargs = argparse.Namespace(
        task="doctor-smoke: fetch missions verbs",
        code=None,
        code_file=None,
        keep=False,
        timeout=min(args.timeout, 20),
    )
    ep = cmd_ephemeral(eargs)
    for c in ep.checks:
        r.checks.append(Check(f"doctor.{c.name}", c.ok, c.detail, c.band))
        if not c.ok:
            r.ok = False
    r.meta["ephemeral"] = ep.meta

    # One-line agent instruction
    r.meta["agent_next"] = (
        "If doctor OK: use missions not tool explorer. "
        "If commodity DOWN: systemctl start gold-api oil-api gas-api. "
        "If missions 404: check Caddy @spa_routes + caddy reload (in-process if systemd NAMESPACE fails). "
        "Never rsync --delete without: python3 scripts/web-zen/web_zen.py orphan --src ... --dest ..."
    )
    return r


def cmd_caddy_hint(_args: argparse.Namespace) -> Report:
    r = Report(mode="caddy-reload-hint", ts=utc_now(), ok=True)
    r.add(
        "systemd_reload",
        False,
        "systemctl reload caddy often fails NAMESPACE (/tmp mount) on this host — do not assume it applied",
        "ORANGE",
    )
    r.add(
        "safe_path",
        True,
        "1) edit Caddyfile 2) caddy validate --config /etc/caddy/Caddyfile "
        "3) /usr/bin/caddy reload --config /etc/caddy/Caddyfile --force "
        "4) verify URLs with web_zen.py verify",
        "YELLOW",
    )
    r.meta["mutates"] = False
    r.meta["authority"] = (
        "Caddy reload is authority-adjacent — T3 if production blast radius unclear"
    )
    return r


def write_receipt(report: Report, out_dir: Path | None) -> Path | None:
    if out_dir is None:
        return None
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"web-zen-{report.mode}-{report.ts.replace(':', '')}.json"
    path.write_text(json.dumps(report.to_dict(), indent=2))
    return path


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="web_zen",
        description="Agentic web zen modes — sense · verify · orphan · ephemeral · doctor",
    )
    # Parent flags also on subparsers so `doctor --json` works (agents will).
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json", action="store_true", help="machine output only")
    common.add_argument(
        "--receipt-dir",
        default=str(
            FORGE_WORK / datetime.now(timezone.utc).strftime("%Y-%m-%d") / "web-zen"
        ),
        help="write JSON receipt",
    )
    common.add_argument("--no-receipt", action="store_true")
    p.add_argument("--json", action="store_true", help="machine output only")
    p.add_argument(
        "--receipt-dir",
        default=str(
            FORGE_WORK / datetime.now(timezone.utc).strftime("%Y-%m-%d") / "web-zen"
        ),
        help="write JSON receipt",
    )
    p.add_argument("--no-receipt", action="store_true")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser(
        "sense", parents=[common], help="Map substrate + APIs + missions contract"
    )
    s.set_defaults(func=cmd_sense)

    v = sub.add_parser("verify", parents=[common], help="Content-truth crawl")
    v.add_argument("--urls", help="URL list file")
    v.add_argument("--url", help="single URL")
    v.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT)
    v.set_defaults(func=cmd_verify)

    o = sub.add_parser(
        "orphan",
        parents=[common],
        help="Dry-run rsync --delete preview (fail closed if deletes)",
    )
    o.add_argument("--src", required=True)
    o.add_argument("--dest", required=True)
    o.add_argument(
        "--allow-deletes",
        action="store_true",
        help="do not fail when deletes listed (still dry-run)",
    )
    o.set_defaults(func=cmd_orphan)

    e = sub.add_parser(
        "ephemeral", parents=[common], help="Generate → test → destroy disposable tool"
    )
    e.add_argument(
        "--task", required=True, help="why this tool is needed (mission gap)"
    )
    e.add_argument("--code-file", help="path to python tool source")
    e.add_argument("--code", help="inline python (avoid secrets)")
    e.add_argument("--keep", action="store_true", help="do not destroy workdir (debug)")
    e.add_argument("--timeout", type=int, default=30)
    e.set_defaults(func=cmd_ephemeral)

    d = sub.add_parser(
        "doctor", parents=[common], help="sense + verify + ephemeral smoke"
    )
    d.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT)
    d.set_defaults(func=cmd_doctor)

    c = sub.add_parser(
        "caddy-reload-hint", parents=[common], help="safe reload path (no mutation)"
    )
    c.set_defaults(func=cmd_caddy_hint)

    args = p.parse_args(argv)
    report: Report = args.func(args)

    receipt = None
    if not args.no_receipt:
        receipt = write_receipt(report, Path(args.receipt_dir))
        report.meta["receipt"] = str(receipt) if receipt else None

    if args.json:
        print(json.dumps(report.to_dict(), indent=2))
    else:
        status = "OK" if report.ok else "FAIL"
        print(f"web_zen · {report.mode} · {status} · {report.ts}")
        for c in report.checks:
            mark = "✓" if c.ok else "✗"
            print(f"  {mark} [{c.band}] {c.name}: {c.detail}")
        if receipt:
            print(f"receipt: {receipt}")
        if report.meta.get("agent_next"):
            print(f"\nagent_next: {report.meta['agent_next']}")

    return 0 if report.ok else 1


if __name__ == "__main__":
    sys.exit(main())
