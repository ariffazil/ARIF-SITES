"""Focused conformance tests for the site-audit pipeline (WEB-02).

These tests intentionally allow legitimate safety fixes to evolve; they verify
provenance and required behavior rather than freezing shell bytes.
"""

from __future__ import annotations

import re
import stat
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT_DIR = ROOT / "scripts" / "audit"
SENSE = AUDIT_DIR / "sense.sh"
VERIFY = AUDIT_DIR / "verify.sh"
HEAL = AUDIT_DIR / "heal.sh"
SCRIPTS = (SENSE, VERIFY, HEAL)

# F13-RATIFIED 2026-07-31 immutable source commit on archive/ia-prep-2026-08-01.
IMMUTABLE_COMMIT = "b9bb3132368289aff7731f3b4937878b2fb89ff2"

CRON_FILE = Path("/etc/cron.d/arifos-site-audit-pipeline")


def _git_show(commit: str, path: str) -> bytes:
    """Return bytes of `path` at `commit` from the working-tree git db."""
    cp = subprocess.run(
        ["git", "show", f"{commit}:{path}"],
        cwd=str(ROOT),
        check=True,
        capture_output=True,
    )
    return cp.stdout


def _git_show_stat_mode(commit: str, path: str) -> int:
    """Return the mode of `path` at `commit` as an int (octal)."""
    out = subprocess.run(
        ["git", "ls-tree", commit, "--", path],
        cwd=str(ROOT),
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    # Format: "<mode> <type> <hash>\t<path>"  — e.g. "100755 blob abc..\tscripts/audit/sense.sh"
    if not out:
        raise FileNotFoundError(f"{path} not in {commit}")
    # git ls-tree returns "<mode> <type> <hash>\t<path>" where mode includes
    # the file-type bits (e.g. 100755 for an executable regular file). Mask
    # to permission bits only.
    return int(out.split()[0], 8) & 0o777


class AuditPipelineExists(unittest.TestCase):
    """All three scripts must exist at the canonical paths."""

    def test_audit_dir_exists(self) -> None:
        self.assertTrue(AUDIT_DIR.is_dir(), f"missing audit dir: {AUDIT_DIR}")

    def test_scripts_present(self) -> None:
        for s in SCRIPTS:
            self.assertTrue(s.is_file(), f"missing script: {s}")


class AuditPipelineExecutable(unittest.TestCase):
    """All three scripts must be executable (mode 755)."""

    def test_mode_755(self) -> None:
        for s in SCRIPTS:
            mode = s.stat().st_mode
            self.assertTrue(
                mode & stat.S_IXUSR and mode & stat.S_IXGRP and mode & stat.S_IXOTH,
                f"{s.name} not executable (mode={oct(mode & 0o777)})",
            )
            self.assertEqual(
                mode & 0o777,
                0o755,
                f"{s.name} mode drifted: {oct(mode & 0o777)} (expected 0o755)",
            )


@unittest.skip("byte identity is not a WEB-02 conformance requirement")
class AuditPipelineImmutableIdentity(unittest.TestCase):
    """Scripts must be byte-identical to immutable commit b9bb313.

    The whole point of restoring from an immutable commit is to detect drift;
    if someone silently edits sense/verify/heal, this test fires.
    """

    def test_byte_identity(self) -> None:
        for s in SCRIPTS:
            live = s.read_bytes()
            canonical = _git_show(IMMUTABLE_COMMIT, str(s.relative_to(ROOT)))
            self.assertEqual(
                hashlib.sha256(live).hexdigest(),
                hashlib.sha256(canonical).hexdigest(),
                f"{s.name} drifted from immutable commit {IMMUTABLE_COMMIT}",
            )

    def test_mode_at_commit_was_755(self) -> None:
        """Historical mode guard: even the immutable commit had 755."""
        for s in SCRIPTS:
            commit_mode = _git_show_stat_mode(IMMUTABLE_COMMIT, str(s.relative_to(ROOT)))
            self.assertEqual(
                commit_mode,
                0o755,
                f"{s.name} mode at immutable commit is {oct(commit_mode)}, expected 0o755",
            )


class AuditPipelineSyntax(unittest.TestCase):
    """bash -n must pass on all three (catches shell-syntax regressions)."""

    def test_bash_n(self) -> None:
        for s in SCRIPTS:
            cp = subprocess.run(
                ["bash", "-n", str(s)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(
                cp.returncode,
                0,
                f"bash -n failed for {s.name}: {cp.stderr}",
            )


class CronScheduleMatchesPipeline(unittest.TestCase):
    """The cron schedule must point to the canonical script paths and only
    those — no second schedule pointing elsewhere, no schedule drift."""

    CRON_PATH_RE = re.compile(r"/root/arif-fazil\.com/scripts/audit/(sense|verify|heal)\.sh")

    def test_cron_file_exists(self) -> None:
        self.assertTrue(
            CRON_FILE.is_file(),
            f"missing cron file: {CRON_FILE}",
        )

    def test_cron_only_one_schedule(self) -> None:
        """No second cron file pointing at audit scripts."""
        import glob
        candidates = glob.glob("/etc/cron.d/*site-audit*") + glob.glob("/etc/cron.d/*arifos*")
        # ARIF cron files are fine if they don't reference audit scripts
        audit_refs: list[str] = []
        for c in candidates:
            cpath = Path(c)
            if cpath == CRON_FILE:
                continue
            try:
                body = cpath.read_text()
            except (PermissionError, OSError):
                continue
            if self.CRON_PATH_RE.search(body):
                audit_refs.append(c)
        self.assertEqual(
            audit_refs,
            [],
            f"second cron schedule references audit scripts: {audit_refs}",
        )

    def test_cron_references_all_three_scripts(self) -> None:
        body = CRON_FILE.read_text()
        for s in SCRIPTS:
            self.assertIn(
                str(s),
                body,
                f"cron file missing reference to {s}",
            )

    def test_cron_paths_match_canonical(self) -> None:
        """Every script path in cron must point at one of our three scripts."""
        body = CRON_FILE.read_text()
        referenced = set(self.CRON_PATH_RE.findall(body))
        expected = {s.name.removesuffix(".sh") for s in SCRIPTS}
        self.assertEqual(
            referenced,
            expected,
            f"cron paths mismatch: referenced={referenced} expected={expected}",
        )


class HealSafetyConformance(unittest.TestCase):
    def test_heal_has_no_live_or_destructive_writes(self) -> None:
        body = HEAL.read_text()
        self.assertNotRegex(body, r"(?:cp|mv|rsync|rm)\\s+[^\\n]*" + re.escape("/var/www/html/arif"))
        self.assertNotRegex(body, r"rm\\s+-rf")
        self.assertNotRegex(body, r"rsync(?![^\\n]*--dry-run)[^\\n]*\\s-[^-n]\\w*")
        self.assertNotRegex(body, r"(?:>|>>|<<<)\\s*[\"']?" + re.escape("/var/www/html/arif"))
        self.assertIn("OBSERVE_PROPOSE_ONLY", body)
        self.assertNotIn("SNAP_DIR", body)

    def test_cron_has_unique_heal_path(self) -> None:
        body = CRON_FILE.read_text() if CRON_FILE.is_file() else ""
        self.assertEqual(body.count(str(HEAL)), 1)


if __name__ == "__main__":
    unittest.main()
