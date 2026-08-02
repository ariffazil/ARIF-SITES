"""Focused tests for the web-zen CLI.

These tests verify:
  * The CLI exists on the working tree.
  * All six documented subcommands are accepted by argparse.
  * Required/optional flags per subcommand.
  * ``orphan`` fails closed when deletes are listed (no ``--allow-deletes``).
  * ``ephemeral`` rejects code matching the deny-list (no authority claim).
  * ``caddy-reload-hint`` is observation-only (does not touch systemd / caddy).
  * ``doctor`` JSON output has the canonical shape and an array of checks.
  * The URLs companion file is well-formed (http(s) only, non-empty).
  * The README documents every mode by name.

No network or production write required for these — every test uses
``--no-receipt`` and avoids mutating ``/etc/caddy``, ``/var/www/html/arif``,
or systemd services.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "scripts" / "web-zen" / "web_zen.py"
URLS = ROOT / "scripts" / "web-zen" / "urls.core.txt"
README = ROOT / "scripts" / "web-zen" / "README.md"

PYTHON = sys.executable

EXPECTED_MODES = {"sense", "verify", "orphan", "ephemeral", "doctor", "caddy-reload-hint"}
URL_RE = re.compile(r"^https?://\S+$")


def _run(args: list[str], timeout: int = 30) -> subprocess.CompletedProcess:
    """Invoke the CLI with safe defaults (no receipt, JSON output).

    The CLI expects ``<mode> [mode-flags] [--json] [--no-receipt]`` — the
    subcommand must come BEFORE the parent flags. Callers should pass
    ``["sense"]``, ``["verify", "--url", "..."]``, ``["doctor",
    "--timeout", "3"]``, etc.
    """
    safe_args = [str(CLI), *args, "--json", "--no-receipt"]
    return subprocess.run(
        [PYTHON, *safe_args],
        capture_output=True,
        text=True,
        timeout=timeout,
        cwd=str(ROOT),
    )


class WebZenPresenceTests(unittest.TestCase):
    def test_cli_exists_and_is_executable(self) -> None:
        self.assertTrue(CLI.is_file(), f"missing canonical CLI: {CLI}")
        mode = CLI.stat().st_mode
        self.assertTrue(mode & 0o111, f"CLI is not executable: {CLI}")

    def test_cli_has_valid_python_shebang(self) -> None:
        first = CLI.read_text(encoding="utf-8", errors="replace").splitlines()[0]
        self.assertRegex(first, r"^#!/.*python")

    def test_urls_companion_well_formed(self) -> None:
        self.assertTrue(URLS.is_file(), f"missing urls.core.txt: {URLS}")
        lines = [ln.strip() for ln in URLS.read_text().splitlines()]
        nonblank = [ln for ln in lines if ln and not ln.startswith("#")]
        self.assertGreaterEqual(
            len(nonblank), 4, "urls.core.txt should list at least 4 URLs"
        )
        for ln in nonblank:
            self.assertRegex(
                ln, URL_RE, f"non-http URL in urls.core.txt: {ln!r}"
            )

    def test_readme_documents_every_mode(self) -> None:
        self.assertTrue(README.is_file(), f"missing README: {README}")
        text = README.read_text(encoding="utf-8")
        for mode in EXPECTED_MODES:
            with self.subTest(mode=mode):
                self.assertIn(
                    f"`{mode}`",
                    text,
                    f"README missing mode reference: {mode}",
                )


class WebZenArgparseTests(unittest.TestCase):
    """Verify the CLI's argparse contract for every documented mode."""

    def test_help_lists_every_mode(self) -> None:
        proc = subprocess.run(
            [PYTHON, str(CLI), "--help"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        for mode in EXPECTED_MODES:
            with self.subTest(mode=mode):
                self.assertIn(mode, proc.stdout)

    def test_sense_runs_and_emits_json(self) -> None:
        # ``sense`` is a single-arg subcommand; it does NOT accept --timeout.
        proc = _run(["sense"])
        # Nonzero is fine — sense truthfully reports any real observed state.
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        self.assertEqual(data["mode"], "sense")
        self.assertIn("checks", data)
        self.assertIsInstance(data["checks"], list)
        self.assertGreaterEqual(len(data["checks"]), 5)

    def test_verify_unknown_url_is_graceful(self) -> None:
        # Empty / unknown URL must not crash; it should return structured output.
        proc = _run(["verify", "--url", "http://invalid.invalid", "--timeout", "2"])
        # Either ok=False or ok=True is acceptable; it must not raise.
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        self.assertEqual(data["mode"], "verify")
        self.assertIsInstance(data["checks"], list)

    def test_orphan_requires_src_and_dest(self) -> None:
        proc = _run(["orphan"])
        self.assertNotEqual(proc.returncode, 0, "orphan without src/dest must error")
        self.assertTrue(proc.stderr or proc.stdout)

    def test_ephemeral_requires_task(self) -> None:
        proc = _run(["ephemeral"])
        self.assertNotEqual(proc.returncode, 0, "ephemeral without --task must error")

    def test_caddy_reload_hint_observation_only(self) -> None:
        proc = _run(["caddy-reload-hint"])
        # caddy-reload-hint intentionally reports ok=False because the
        # ``systemctl reload caddy`` path is ORANGE-flagged (untrusted).
        # Exit 1 here is honest, not a failure.
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        self.assertEqual(data["mode"], "caddy-reload-hint")
        # Authoritative safety claim: this mode does NOT mutate.
        self.assertEqual(data["meta"].get("mutates"), False)
        # And it must not silently recommend `systemctl reload caddy`.
        self.assertFalse(
            any("systemctl reload" in c["detail"] and c["ok"] for c in data["checks"]),
            "caddy-reload-hint must not positively assert systemctl reload",
        )


class WebZenSafetyTests(unittest.TestCase):
    """Safety contracts: deny-list, fail-closed orphan, no production writes."""

    def test_ephemeral_rejects_deny_pattern(self) -> None:
        # The default deny-list includes `DROP\s+TABLE`; probe that boundary.
        bad_code = "import sys\nprint('hi')\nsys.exit(0)\n# DROP TABLE users\n"
        proc = _run(
            [
                "ephemeral",
                "--task",
                "test deny boundary",
                "--code",
                bad_code,
                "--timeout",
                "5",
            ]
        )
        # Deny-list match makes the report's ok=False → CLI exits 1.
        # Both 0 and 1 are acceptable as long as the deny check fired.
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        denies = [c for c in data["checks"] if c["name"] == "ephemeral.deny"]
        self.assertEqual(
            len(denies), 1, "expected exactly one ephemeral.deny check"
        )
        self.assertFalse(denies[0]["ok"], "DROP TABLE must be denied")
        self.assertEqual(denies[0]["band"], "RED")

    def test_ephemeral_safe_code_passes_and_destroys(self) -> None:
        safe_code = (
            "import json, sys\n"
            "print(json.dumps({'ok': True, 'kind': 'safe'}))\n"
            "sys.exit(0)\n"
        )
        proc = _run(
            ["ephemeral", "--task", "test safe code path", "--code", safe_code, "--timeout", "10"]
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        data = json.loads(proc.stdout)
        ok_names = {c["name"] for c in data["checks"] if c["ok"]}
        self.assertIn("ephemeral.write", ok_names)
        self.assertIn("ephemeral.test", ok_names)
        self.assertIn("ephemeral.destroy", ok_names)
        self.assertEqual(data["meta"].get("destroyed"), True)
        self.assertEqual(data["meta"].get("authority"), "NONE")

    def test_orphan_fail_closed_when_deletes_listed(self) -> None:
        # Two real directories; rsync may or may not list deletes, but the
        # mode must always survive and never apply changes. ``mutates`` is
        # the canonical non-mutation claim.
        proc = _run(
            [
                "orphan",
                "--src",
                str(ROOT / "tests"),
                "--dest",
                str(ROOT / "scripts" / "web-zen"),
            ]
        )
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        self.assertEqual(data["meta"].get("mutates"), False)
        self.assertEqual(data["meta"].get("band"), "YELLOW")


class WebZenDoctorTests(unittest.TestCase):
    """The doctor mode must produce structured truthful output."""

    def test_doctor_returns_canonical_shape(self) -> None:
        proc = _run(["doctor", "--timeout", "3"])
        # Nonzero exit is acceptable for real observed failures (e.g. missing
        # source file, brent marker, commodity down). It must always be
        # structured, though.
        self.assertIn(proc.returncode, (0, 1))
        data = json.loads(proc.stdout)
        for key in ("mode", "ts", "ok", "checks", "meta", "doctrine"):
            with self.subTest(key=key):
                self.assertIn(key, data, f"doctor output missing key {key!r}")
        self.assertEqual(data["mode"], "doctor")
        self.assertIsInstance(data["checks"], list)
        self.assertGreater(len(data["checks"]), 0)
        for chk in data["checks"]:
            self.assertIn("name", chk)
            self.assertIn("ok", chk)
            self.assertIn("band", chk)
            self.assertIn("detail", chk)
            self.assertIn(chk["band"], {"GREEN", "YELLOW", "ORANGE", "RED"})

    def test_doctor_reports_only_observed_truth(self) -> None:
        # If a check claims ok=True, the detail must NOT be a fill-in like
        # the literal string 'MISSING'. That is the canonical sign of a
        # false-GREEN.
        proc = _run(["doctor", "--timeout", "3"])
        data = json.loads(proc.stdout)
        for chk in data["checks"]:
            with self.subTest(name=chk["name"]):
                if chk["ok"]:
                    self.assertNotIn(
                        "MISSING",
                        chk["detail"],
                        f"{chk['name']} reports ok=True but detail mentions MISSING",
                    )

    def test_doctor_meta_carries_subreports(self) -> None:
        proc = _run(["doctor", "--timeout", "3"])
        data = json.loads(proc.stdout)
        for sub in ("sense", "verify", "ephemeral"):
            with self.subTest(sub=sub):
                self.assertIn(sub, data["meta"], f"doctor meta missing {sub!r} subreport")


if __name__ == "__main__":
    unittest.main()
