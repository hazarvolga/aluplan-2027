"""Analytics and measurement load only after explicit cookie consent."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILD_HOME = ROOT / ".next/server/app/index.html"


class ConsentStoreTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(["node", "tests/consent_runtime.mjs"], cwd=ROOT, check=True, capture_output=True, text=True)
        cls.data = json.loads(result.stdout)

    def test_no_choice_reads_as_null(self):
        self.assertIsNone(self.data["initial"])
        self.assertIsNone(self.data["invalid"])

    def test_accept_is_stored_and_announced(self):
        self.assertEqual(self.data["afterAccept"], "accepted")
        self.assertEqual(self.data["stored"], "accepted")
        self.assertEqual(self.data["acceptEvents"], ["aluplan-consent-change"])

    def test_blocked_storage_degrades_without_throwing(self):
        self.assertIsNone(self.data["blockedRead"])
        self.assertEqual(self.data["blockedEvents"], ["aluplan-consent-change"])
        self.assertEqual(self.data["blockedAfterWrite"], "rejected")


class ConsentWiringTests(unittest.TestCase):
    def test_banner_uses_shared_store(self):
        shell = (ROOT / "src/components/shell/SiteShell.tsx").read_text(encoding="utf-8")
        self.assertIn("writeConsent(", shell)
        self.assertIn("useCookieConsent()", shell)
        self.assertNotIn("'cookie-consent'", shell)

    def test_analytics_require_acceptance(self):
        scripts = (ROOT / "src/components/shell/ConsentScripts.tsx").read_text(encoding="utf-8")
        self.assertIn("G-DQYT0D9MQ5", scripts)
        self.assertIn("if (consent !== 'accepted') return null;", scripts)
        layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")
        self.assertIn("<ConsentScripts />", layout)

    def test_csp_allows_ga4_collection_endpoints(self):
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        connect = next(line for line in config.splitlines() if '"connect-src' in line)
        image = next(line for line in config.splitlines() if '"img-src' in line)
        for origin in ("https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com",
                       "https://*.g.doubleclick.net", "https://*.google.com", "https://*.google.com.tr"):
            with self.subTest(directive="connect-src", origin=origin):
                self.assertIn(origin, connect)
        for origin in ("https://*.google-analytics.com", "https://*.googletagmanager.com",
                       "https://*.google.com", "https://*.google.com.tr"):
            with self.subTest(directive="img-src", origin=origin):
                self.assertIn(origin, image)

    def test_built_homepage_loads_no_analytics_before_consent(self):
        if not BUILD_HOME.is_file():
            self.skipTest("production build output missing")
        html = BUILD_HOME.read_text(encoding="utf-8")
        for marker in ("googletagmanager.com/gtag", "G-DQYT0D9MQ5", "/_vercel/insights", "/_vercel/speed-insights"):
            with self.subTest(marker=marker):
                self.assertNotIn(marker, html)


if __name__ == "__main__":
    unittest.main()
