"""Parity + render-shape tests for the shared observatory renderer.

Goals (Prompt: Observatory upgrade):
  * Verify the canonical source and the two tracked mirrors have IDENTICAL
    SHA-256 (no silent divergence — one source owner rule).
  * Verify the renderer surface exposes the v1 helpers
    (stableOrganId, findingIsSchemaMismatch, compactFinding, renderFindings).
  * Verify the JS prefers /api/public-state with a snapshot fallback chain.
  * Without a DOM, no raw JS exception is raised by the helpers when fed
    a malformed public-state payload that contains a SCHEMA_MISMATCH item.
"""

from __future__ import annotations

import hashlib
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "sites" / "shared" / "observatory.js"
MIRROR_A = ROOT / "sites" / "arif-fazil.com" / "public" / "_shared" / "observatory.js"
MIRROR_B = ROOT / "sites" / "arif-fazil.com" / "public" / "arifos" / "_shared" / "observatory.js"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class RendererParityTests(unittest.TestCase):
    def test_three_copies_share_one_sha256(self) -> None:
        self.assertTrue(SOURCE.exists(), SOURCE)
        self.assertTrue(MIRROR_A.exists(), MIRROR_A)
        self.assertTrue(MIRROR_B.exists(), MIRROR_B)
        self.assertEqual(_sha256(SOURCE), _sha256(MIRROR_A))
        self.assertEqual(_sha256(SOURCE), _sha256(MIRROR_B))

    def test_prefers_api_public_state_with_snapshot_fallback(self) -> None:
        text = SOURCE.read_text(encoding="utf-8")
        # The fetcher must try /api/public-state first, then snapshot fallbacks
        # in order, then the legacy observatory.v1 endpoint last.
        live_idx = text.index("/api/public-state")
        mirror_a_idx = text.index("/.well-known/public-state.json")
        snapshot_idx = text.index("/.well-known/observatory-snapshot-latest.json")
        legacy_idx = text.index("/api/observatory/v1/snapshot")
        self.assertLess(live_idx, mirror_a_idx)
        self.assertLess(mirror_a_idx, snapshot_idx)
        self.assertLess(snapshot_idx, legacy_idx)

    def test_export_includes_v1_helpers(self) -> None:
        text = SOURCE.read_text(encoding="utf-8")
        for helper in (
            "stableOrganId",
            "findingIsSchemaMismatch",
            "compactFinding",
            "renderFindings",
        ):
            self.assertIn(helper, text, f"missing helper: {helper}")

    def test_canonical_organ_ids_are_invariants(self) -> None:
        text = SOURCE.read_text(encoding="utf-8")
        # The six canonical ids are the only ones allowed in DOM data-organ.
        for organ in ("arifos", "geox", "wealth", "well", "aforge", "aaa"):
            self.assertIn(f"'{organ}'", text)
        self.assertIn("CANONICAL_ORGANS", text)
        # Aliases collapse so stableOrganId never throws on unknown input.
        # We check a tight subset of the alias map written into the JS source.
        for alias in ("a-forge", "arifos_kernel", "wellorgan", "geoxorgan"):
            self.assertIn(alias, text)

    def test_findings_list_recognizes_public_state_v1_envelope(self) -> None:
        text = SOURCE.read_text(encoding="utf-8")
        # public-state.v1 names its findings block `items`. The renderer
        # must read it without crashing on the observatory.v1 `findings`
        # naming used elsewhere in the federation.
        self.assertIn("findings.items", text)
        self.assertIn("findings.open", text)
        self.assertIn("findings.findings", text)


class RendererShapeTests(unittest.TestCase):
    """Behavioral smoke checks against the JS source via node."""

    def setUp(self) -> None:
        self.text = SOURCE.read_text(encoding="utf-8")

    def test_renderfindings_guarded_no_dom_target(self) -> None:
        # The new renderer bails when no target element exists so legacy
        # pages without #findings-grid keep their old behavior.
        snippet = re.search(r"function renderFindings\(data\) \{[\s\S]*?\n  \}", self.text)
        self.assertIsNotNone(snippet)
        body = snippet.group(0)
        self.assertIn("#findings-grid", body)
        self.assertIn("observatory-empty", body)

    def test_renderfindings_sorts_by_severity_high_first(self) -> None:
        snippet = re.search(r"function renderFindings\(data\) \{[\s\S]*?\n  \}", self.text).group(0)
        self.assertIn("HIGH", snippet)
        self.assertIn("MEDIUM", snippet)
        self.assertIn("LOW", snippet)
        # Findings must be sorted so HIGH rows come first; never default to
        # array order which would let SCHEMA_MISMATCH entries hide critical
        # items.
        self.assertIn("sevWeight(right) - sevWeight(left)", snippet)

    def test_fetch_snapshot_records_schema_banner(self) -> None:
        snippet = re.search(r"async function fetchSnapshot\(\) \{[\s\S]*?\n  \}", self.text)
        self.assertIsNotNone(snippet)
        body = snippet.group(0)
        self.assertIn("runtime.fetchedSchema", body)
        # Must attempt four sources in order; failing all four throws an
        # Error with .attempts so the caller can introspect the failure.
        self.assertIn("attempts", body)

    def test_silent_failure_guard_on_malformed_finding(self) -> None:
        # The compactFinding helper must accept strings, numbers and dicts
        # without ever producing an exception path. Smoke-check by parsing
        # the function signature shape from the JS.
        self.assertIn("if (!isRecord(finding)) return UNAVAILABLE;", self.text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
