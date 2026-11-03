"""Static assets are cacheable, security headers stay global and Node is pinned to one version."""

from pathlib import Path
import json
import os
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
STATIC_CACHE = "public, max-age=604800, stale-while-revalidate=86400"
STATIC_PREFIXES = ("/assets/:path*", "/docs/:path*", "/videos/:path*", "/images/:path*")
NODE_MAJOR = "24"


def config_headers() -> list[dict]:
    env = {k: v for k, v in os.environ.items() if not k.startswith("ALUPLAN_")}
    result = subprocess.run(
        ["node", "-e", "import('./next.config.mjs').then(async (m) => process.stdout.write(JSON.stringify(await m.default.headers())))"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        env=env,
    )
    return json.loads(result.stdout)


class CacheHeaderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rules = {rule["source"]: {h["key"]: h["value"] for h in rule["headers"]} for rule in config_headers()}

    def test_static_prefixes_are_cached_for_a_week(self):
        for prefix in STATIC_PREFIXES:
            with self.subTest(prefix=prefix):
                self.assertEqual(self.rules[prefix].get("Cache-Control"), STATIC_CACHE)

    def test_security_headers_still_apply_everywhere(self):
        global_rule = self.rules["/:path*"]
        for key in ("Content-Security-Policy", "Strict-Transport-Security", "X-Frame-Options"):
            self.assertIn(key, global_rule)
        self.assertNotIn("Cache-Control", global_rule)


class NodeVersionTests(unittest.TestCase):
    def test_engines_pin_node(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        self.assertEqual(package.get("engines", {}).get("node"), f"{NODE_MAJOR}.x")

    def test_nvmrc_matches(self):
        self.assertEqual((ROOT / ".nvmrc").read_text(encoding="utf-8").strip(), NODE_MAJOR)

    def test_ci_uses_same_major(self):
        ci = (ROOT / ".github/workflows/ci.yml").read_text(encoding="utf-8")
        self.assertIn("node-version-file: .nvmrc", ci)
        self.assertNotIn("node-version: 20", ci)


if __name__ == "__main__":
    unittest.main()
