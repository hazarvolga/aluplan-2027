"""Release visibility and indexing are independent, centrally read decisions."""

from pathlib import Path
import json
import os
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
FLAGS_MODULE = "src/lib/release-flags.ts"


def source_files():
    yield ROOT / "next.config.mjs"
    for path in (ROOT / "src").rglob("*"):
        if path.suffix in {".ts", ".tsx", ".mjs"}:
            yield path


def run_matrix():
    result = subprocess.run(
        ["node", "tests/release_flags_runtime.mjs"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return {(row["show"], row["block"]): row for row in json.loads(result.stdout)}


def load_next_config(env: dict) -> subprocess.CompletedProcess:
    clean = {k: v for k, v in os.environ.items() if not k.startswith("ALUPLAN_")}
    return subprocess.run(
        ["node", "-e", "import('./next.config.mjs').then(() => process.stdout.write('loaded'))"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env={**clean, **env},
    )


class ReleaseFlagSourceTests(unittest.TestCase):
    def test_legacy_flag_removed(self):
        offenders = [
            str(p.relative_to(ROOT))
            for p in source_files()
            if p.name != "next.config.mjs" and "ALUPLAN_2027_PREVIEW" in p.read_text(encoding="utf-8")
        ]
        self.assertEqual(offenders, [])

    def test_config_refuses_legacy_flag_without_new_flags(self):
        result = load_next_config({"ALUPLAN_2027_PREVIEW": "1"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ALUPLAN_BLOCK_INDEXING", result.stderr)

    def test_config_loads_with_new_flags(self):
        result = load_next_config({"ALUPLAN_2027_PREVIEW": "1", "ALUPLAN_SHOW_2027": "1", "ALUPLAN_BLOCK_INDEXING": "1"})
        self.assertEqual((result.returncode, result.stdout), (0, "loaded"))

    def test_config_loads_without_any_flag(self):
        self.assertEqual(load_next_config({}).returncode, 0)

    def test_env_reads_centralized(self):
        allowed = {FLAGS_MODULE, "next.config.mjs"}
        offenders = [
            str(p.relative_to(ROOT))
            for p in source_files()
            if "process.env.ALUPLAN_" in p.read_text(encoding="utf-8")
            and str(p.relative_to(ROOT)) not in allowed
        ]
        self.assertEqual(offenders, [])

    def test_release_routes_own_pages(self):
        offenders = [
            str(p.relative_to(ROOT))
            for p in (ROOT / "src/app/2027").rglob("*.tsx")
            if re.search(r"@/app/preview", p.read_text(encoding="utf-8"))
        ]
        self.assertEqual(offenders, [])

    def test_indexing_header_follows_block_flag(self):
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        self.assertIn("process.env.ALUPLAN_BLOCK_INDEXING === '1'", config)
        self.assertIn("ALUPLAN_SHOW_2027", config)


class ReleaseFlagRuntimeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.matrix = run_matrix()

    def test_review_environment_blocks_indexing(self):
        row = self.matrix[("1", "1")]
        self.assertEqual(row["robots"]["rules"], {"userAgent": "*", "disallow": "/"})
        self.assertEqual(row["homepageVariant"], "release-2027")

    def test_live_domain_indexes_release_content(self):
        row = self.matrix[("1", "0")]
        self.assertEqual(row["robots"]["rules"][0]["allow"], "/")
        self.assertEqual(row["robots"]["sitemap"], "https://aluplan.com.tr/sitemap.xml")
        self.assertEqual(row["homepageVariant"], "release-2027")

    def test_indexable_site_allows_next_assets_for_all_crawlers(self):
        rules = self.matrix[("1", "0")]["robots"]["rules"]
        for rule in rules:
            with self.subTest(user_agent=rule["userAgent"]):
                self.assertNotIn("/_next/", rule.get("disallow", []))

    def test_rollback_restores_legacy_homepage(self):
        row = self.matrix[("0", "0")]
        self.assertEqual(row["homepageVariant"], "legacy")
        self.assertEqual(row["robots"]["rules"][0]["allow"], "/")

    def test_local_preview_routes_closed_in_production(self):
        for row in self.matrix.values():
            self.assertFalse(row["localPreview"])


if __name__ == "__main__":
    unittest.main()
