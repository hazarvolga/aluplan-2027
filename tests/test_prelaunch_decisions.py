"""User decisions of 03.11.2026 (docs/00-inventory/user-decisions.md)."""

from pathlib import Path
import json
import os
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
FEATURES = ROOT / "src/components/sections/Allplan2027FeaturesPreview.tsx"
OLD_COMPARISON_PDFS = (
    "/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf",
    "/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf",
)


def config_redirects() -> list[dict]:
    env = {k: v for k, v in os.environ.items() if not k.startswith("ALUPLAN_")}
    result = subprocess.run(
        ["node", "-e", "import('./next.config.mjs').then(async (m) => process.stdout.write(JSON.stringify(await m.default.redirects())))"],
        cwd=ROOT, check=True, capture_output=True, text=True, env=env,
    )
    return json.loads(result.stdout)


class FeaturesHeadingTests(unittest.TestCase):
    def test_h1_is_the_2027_line_and_tagline_follows(self):
        source = FEATURES.read_text(encoding="utf-8")
        self.assertIn('title="2027 yenilikleri: Allplan, Allplan Civil, FRILO, SCIA, SDS2"', source)
        self.assertIn('lead="Her mühendislik iş akışı için kapsamlı çözümler"', source)
        self.assertNotIn('title="Her mühendislik iş akışı için kapsamlı çözümler"', source)


class YoutubeCardTitleTests(unittest.TestCase):
    def test_channel_card_title_matches_the_channel(self):
        library = json.loads((ROOT / "src/data/video-library.json").read_text(encoding="utf-8"))
        text = json.dumps(library, ensure_ascii=False)
        self.assertIn('"title": "ALLPLAN YouTube Kanalı"', text)
        self.assertNotIn("Youtube Allplan Global", text)


class ComparisonPdfRedirectTests(unittest.TestCase):
    def test_old_comparison_pdfs_redirect_to_2027_compare(self):
        redirects = {r["source"]: r for r in config_redirects()}
        for pdf in OLD_COMPARISON_PDFS:
            with self.subTest(pdf=pdf):
                self.assertEqual(redirects[pdf]["destination"], "/paket-karsilastirma")
                self.assertTrue(redirects[pdf]["permanent"])


class CookiePreferencesTests(unittest.TestCase):
    def test_footer_offers_cookie_preferences(self):
        shell = (ROOT / "src/components/shell/SiteShell.tsx").read_text(encoding="utf-8")
        self.assertIn("onClick={clearConsent}", shell)
        self.assertIn("Çerez tercihleri", shell)

    def test_withdrawn_consent_disables_running_analytics(self):
        scripts = (ROOT / "src/components/shell/ConsentScripts.tsx").read_text(encoding="utf-8")
        self.assertIn("`ga-disable-${GA_MEASUREMENT_ID}`", scripts)
        self.assertIn("consent !== 'accepted'", scripts)

    def test_clear_consent_resets_choice(self):
        result = subprocess.run(["node", "tests/consent_runtime.mjs"], cwd=ROOT, check=True, capture_output=True, text=True)
        data = json.loads(result.stdout)
        self.assertIsNone(data["afterClear"])
        self.assertEqual(data["clearEvents"], ["aluplan-consent-change", "aluplan-consent-change"])


if __name__ == "__main__":
    unittest.main()
