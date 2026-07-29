from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "infra" / "runtime-overlays.json"
PER_SITE_SCRIPT = ROOT / "scripts" / "deploy-site.sh"
BATCH_SCRIPT = ROOT / "deploy-vps.sh"


class RuntimeOverlayRegistryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
        cls.sites = {entry["site"]: entry for entry in cls.registry["sites"]}
        # Build an alias-resolver so legacy-subdomain names like
        # arifos.arif-fazil.com collapse onto their owning site entry. The
        # registry's `aliases` per entry is the single source of truth — the
        # short `site` key plus legacy subdomain plus unified_path segment.
        cls.by_alias: dict[str, str] = {}
        for entry in cls.registry["sites"]:
            for alias in entry.get("aliases", []):
                if alias in cls.by_alias and cls.by_alias[alias] != entry["site"]:
                    raise AssertionError(
                        f"alias {alias!r} is owned by both "
                        f"{cls.by_alias[alias]!r} and {entry['site']!r}"
                    )
                cls.by_alias[alias] = entry["site"]

    def resolve(self, name: str) -> dict:
        canonical = self.by_alias.get(name)
        if canonical is None:
            self.fail(f"unknown site alias: {name!r}")
        return self.sites[canonical] if canonical in self.sites else self.sites[self.by_alias[name]]

    def test_registry_has_unique_explicit_owners(self) -> None:
        entries = self.registry["sites"]
        self.assertEqual(self.registry["canonical_repo_root"], "/root/arif-sites")
        self.assertEqual(len(entries), len({entry["site"] for entry in entries}))
        self.assertEqual(len(entries), len({entry["webroot"] for entry in entries}))
        for entry in entries:
            self.assertRegex(entry["site"], r"^[a-z0-9._-]+$")
            self.assertRegex(entry["webroot"], r"^[a-z0-9_-]+$")
            self.assertTrue(entry["owner"])
            paths = [overlay["path"] for overlay in entry["overlays"]]
            self.assertEqual(len(paths), len(set(paths)))
            for overlay in entry["overlays"]:
                self.assertTrue(overlay["owner"])
                self.assertIn(overlay["strategy"], {"preserve-live", "merge-source-wins"})
            for left_index, left in enumerate(paths):
                for right in paths[left_index + 1 :]:
                    self.assertFalse(
                        right.startswith(f"{left}/") or left.startswith(f"{right}/"),
                        f"ambiguous overlay paths for {entry['site']}: {left!r}, {right!r}",
                    )

    def assert_overlay_paths(self, site: str, expected: set[str]) -> None:
        actual = {item["path"] for item in self.resolve(site)["overlays"]}
        self.assertTrue(expected <= actual, f"{site} missing {sorted(expected - actual)}")

    def test_required_runtime_boundaries_are_registered(self) -> None:
        self.assert_overlay_paths(
            "arifos.arif-fazil.com",
            {
                ".well-known/observatory-snapshot-latest.json",
                ".well-known/observatory_signing_key.pub.pem",
                ".well-known/did-arifos-observatory.json",
                ".well-known/did.json",
                ".well-known/governance.jsonld",
                "manifest.txt",
                "federation-manifest.json",
                "zen",
            },
        )
        self.assert_overlay_paths("aaa.arif-fazil.com", {"_state"})
        self.assert_overlay_paths(
            "geox.arif-fazil.com",
            {
                ".well-known/agent-card.json",
                "ac_risk_console",
                "apps",
                "assets",
                "basin_explorer",
                "seismic_viewer",
                "webmcp",
                "well_context_desk",
            },
        )
        self.assert_overlay_paths("wealth.arif-fazil.com", {".well-known/agent.json"})
        self.assert_overlay_paths("well.arif-fazil.com", {"index.html"})
        self.assert_overlay_paths("mcp.arif-fazil.com", {".well-known"})
        self.assert_overlay_paths("forge.arif-fazil.com", {".well-known"})
        for commodity in ("oil", "gas", "gold"):
            self.assert_overlay_paths(commodity, {"api", "vendor"})

    def test_wiki_requires_strict_pinned_build(self) -> None:
        build = self.resolve("wiki.arif-fazil.com")["build"]
        self.assertTrue(build["pinned"])
        self.assertIn("--strict", build["command"])
        self.assertEqual(build["version_contains"], "1.6.1")
        markers = {marker["contains"] for marker in build["output_markers"]}
        self.assertIn("mkdocs-1.6.1, mkdocs-material-9.7.7", markers)
        self.assertNotEqual(build["output"], ".")

    def test_aliases_resolve_to_exactly_one_owner(self) -> None:
        # One source owner: every alias resolves to exactly one site entry.
        # If two sites ever claim the same alias, fail closed.
        counts: dict[str, list[str]] = {}
        for site_name, entry in self.sites.items():
            for alias in entry.get("aliases", []):
                counts.setdefault(alias, []).append(site_name)
        for alias, owners in counts.items():
            self.assertEqual(
                len(owners),
                1,
                f"alias {alias!r} resolves to multiple owners: {owners}",
            )

    def test_both_deploy_paths_consume_registry_and_fail_closed(self) -> None:
        per_site = PER_SITE_SCRIPT.read_text(encoding="utf-8")
        batch = BATCH_SCRIPT.read_text(encoding="utf-8")
        for script in (per_site, batch):
            self.assertIn("infra/runtime-overlays.json", script)
            self.assertIn('CANONICAL_REPO_ROOT="/root/arif-sites"', script)
            self.assertIn("unknown or ambiguously owned", script)
            self.assertNotIn('SITES_ROOT="/root/ARIF-SITES', script)
            self.assertNotRegex(script, re.compile(r"WEBROOT_NAME=.*SITE_NAME%"))
        self.assertIn('DEPLOY_SITE="$REPO_ROOT/scripts/deploy-site.sh"', batch)
        self.assertIn('"$DEPLOY_SITE" "$site" --apply', batch)

    def test_no_webroot_pre_swap_staging_and_receipts_use_jq(self) -> None:
        per_site = PER_SITE_SCRIPT.read_text(encoding="utf-8")
        self.assertNotIn(".pre-swap.", per_site)
        self.assertNotIn('${WEBROOT}.tmp', per_site)
        self.assertIn("STAGING_ROOT", per_site)
        self.assertIn("jq -n", per_site)
        self.assertIn("jq -e .", per_site)
        self.assertIn('trap on_exit EXIT', per_site)

    def test_dry_run_precedes_build_and_archive_creation(self) -> None:
        per_site = PER_SITE_SCRIPT.read_text(encoding="utf-8")
        dry_run_position = per_site.index('if [[ "$MODE" == "dry-run" ]]')
        validate_position = per_site.index('if [[ "$MODE" == "validate-build" ]]')
        archive_position = per_site.index('mkdir -p "$DEPLOY_DIR" "$STAGING_ROOT"')
        self.assertLess(dry_run_position, validate_position)
        self.assertLess(validate_position, archive_position)
        self.assertNotIn("npm ci", per_site)
        self.assertIn("isolated", per_site)


if __name__ == "__main__":
    unittest.main(verbosity=2)
