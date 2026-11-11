"""Akademi launch readiness: one switch (ALLPLAN_SHOW_AKADEMI) makes every Akademi page
indexable, shareable (OG/X card + image), listed in sitemap/llms.txt and linked from the site."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILD_APP = ROOT / ".next/server/app"
SERIES = ("temel-modelleme", "arazi-modelleme", "lejant", "donati-detaylandirma",
          "celik-yapi", "prekast", "otomasyon-scripting", "openbim-ifc")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def akademi_pages():
    return [p for p in (ROOT / "src/app/akademi").rglob("page.tsx") if "katalog" not in p.parts]


class AkademiLaunchSourceTests(unittest.TestCase):
    def test_no_akademi_page_hardcodes_noindex(self):
        for page in akademi_pages():
            with self.subTest(page=str(page.relative_to(ROOT))):
                src = page.read_text(encoding="utf-8")
                self.assertNotIn("index: false", src)
                self.assertIn("akademiMetadata(", src)

    def test_metadata_helper_ties_indexing_to_the_flag_and_adds_share_cards(self):
        src = read("src/lib/akademi-metadata.ts")
        self.assertIn("isAkademiEnabled()", src)
        # The site-wide review switch (ALUPLAN_BLOCK_INDEXING) also keeps the Akademi out of indexes.
        self.assertIn("isIndexingBlocked()", src)
        self.assertIn("openGraph", src)
        self.assertIn("summary_large_image", src)
        self.assertIn("`${SITE_ORIGIN}/og${page.path}`", src)
        self.assertIn("canonical", src)

    def test_catalog_lists_every_akademi_route_once(self):
        src = read("src/lib/akademi-pages.ts")
        self.assertIn("export function listAkademiPages", src)
        self.assertIn("export function getAkademiPage", src)
        for series in SERIES:
            self.assertIn(f"'/akademi/{series}'", src)

    def test_og_route_is_flag_gated_png(self):
        src = read("src/app/og/akademi/[[...path]]/route.tsx")
        self.assertIn("ImageResponse", src)
        self.assertIn("isAkademiEnabled()", src)
        self.assertIn("getAkademiPage(", src)

    def test_sitemap_and_llms_list_akademi_behind_the_flag(self):
        for path in ("src/app/sitemap.ts", "src/app/llms.txt/route.ts"):
            with self.subTest(file=path):
                src = read(path)
                self.assertIn("isAkademiEnabled()", src)
                self.assertIn("listAkademiPages()", src)

    def test_site_header_and_footer_link_akademi_behind_the_flag(self):
        shell = read("src/components/shell/SiteShell.tsx")
        self.assertIn("showAkademi", shell)
        self.assertGreaterEqual(shell.count('href="/akademi"'), 2)
        self.assertIn("showAkademi={isAkademiEnabled()}", read("src/app/layout.tsx"))

    def test_lessons_and_series_emit_structured_data(self):
        src = read("src/components/akademi/AkademiLessonJsonLd.tsx")
        self.assertIn("LearningResource", src)
        self.assertIn("Course", src)
        self.assertIn("AkademiLessonJsonLd", read("src/components/sections/TmLessonDetail.tsx"))
        self.assertIn("AkademiSeriesJsonLd", read("src/components/sections/TmOverview.tsx"))


class AkademiLaunchBuildTests(unittest.TestCase):
    """Checks the production build output (run after an ALLPLAN_SHOW_AKADEMI=1 build)."""

    def lesson_html(self):
        html_file = BUILD_APP / "akademi/lejant/mimari-lejant-hucresi-tanimlama.html"
        if not html_file.exists():
            self.skipTest(f"build output missing: {html_file}")
        return html_file.read_text(encoding="utf-8")

    def test_lesson_page_is_indexable_and_shareable(self):
        html = self.lesson_html()
        self.assertNotRegex(html, r'<meta name="robots" content="[^"]*noindex')
        self.assertIn('<link rel="canonical" href="https://aluplan.com.tr/akademi/lejant/mimari-lejant-hucresi-tanimlama"', html)
        self.assertIn('property="og:image" content="https://aluplan.com.tr/og/akademi/lejant/mimari-lejant-hucresi-tanimlama"', html)
        self.assertIn('name="twitter:card" content="summary_large_image"', html)
        self.assertRegex(html, r'"@type":"LearningResource"')


if __name__ == "__main__":
    unittest.main()
