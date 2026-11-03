"""Third-party embeds go through one consent-aware component and never load before consent."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
EMBED_COMPONENT = ROOT / "src/components/ui/ConsentEmbed.tsx"
BUILD_APP = ROOT / ".next/server/app"
EMBED_PAGES = ["index", "contact", "about", "solutions/scalypso", "2027/civil", "solutions-v2/training/video-library/addon-geometry"]


def ui_sources():
    for folder in ("src/components", "src/app"):
        yield from (p for p in (ROOT / folder).rglob("*.tsx"))


class EmbedSourceTests(unittest.TestCase):
    def test_iframes_only_in_consent_embed(self):
        offenders = [str(p.relative_to(ROOT)) for p in ui_sources() if "<iframe" in p.read_text(encoding="utf-8") and p != EMBED_COMPONENT]
        self.assertEqual(offenders, [])

    def test_no_cookie_setting_youtube_domain(self):
        offenders = [str(p.relative_to(ROOT)) for p in ui_sources() if "youtube.com/embed" in p.read_text(encoding="utf-8")]
        self.assertEqual(offenders, [])

    def test_no_web_share_permission_requested(self):
        offenders = [str(p.relative_to(ROOT)) for p in ui_sources() if "web-share" in p.read_text(encoding="utf-8")]
        self.assertEqual(offenders, [])

    def test_facade_waits_for_consent(self):
        source = EMBED_COMPONENT.read_text(encoding="utf-8")
        self.assertIn("useCookieConsent()", source)
        self.assertIn("Videoyu oynat", source)
        self.assertIn("Haritayı göster", source)


class EmbedNormalizationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(["node", "tests/embeds_runtime.mjs"], cwd=ROOT, check=True, capture_output=True, text=True)
        cls.cases = json.loads(result.stdout)

    def test_youtube_uses_nocookie_domain(self):
        self.assertEqual(self.cases[0]["normalized"], "https://www.youtube-nocookie.com/embed/SnuaHSL18e8")
        self.assertEqual(self.cases[1]["normalized"], "https://www.youtube-nocookie.com/embed/abc?rel=0")
        self.assertEqual(self.cases[2]["normalized"], self.cases[2]["src"])

    def test_kinds(self):
        self.assertEqual([c["kind"] for c in self.cases], ["video", "video", "video", "map"])


class EmbedRenderTests(unittest.TestCase):
    def test_pages_render_no_iframe_before_consent(self):
        for page in EMBED_PAGES:
            html_file = BUILD_APP / f"{page}.html"
            if not html_file.is_file():
                self.skipTest(f"production build output missing: {html_file}")
            with self.subTest(page=page):
                self.assertFalse("<iframe" in html_file.read_text(encoding="utf-8"), f"{page} renders an iframe before consent")


if __name__ == "__main__":
    unittest.main()
