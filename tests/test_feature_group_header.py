"""Feature groups inside a product section get a small numbered group label, not a second section heading."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]

def rebar_and_parametric_are_held() -> bool:
    """Held until ALLPLAN publishes them: the production build renders them as 404 (user-decisions.md, 03.11.2026)."""
    routes = (ROOT / "src/lib/release-2027-routes.ts").read_text(encoding="utf-8")
    return "heldUntilManufacturerRelease: true" in routes
SECTIONS = ROOT / "src/components/sections"


def read(name: str) -> str:
    return (SECTIONS / name).read_text(encoding="utf-8")


class GroupHeaderTests(unittest.TestCase):
    def test_group_header_is_a_numbered_h3_with_a_rule_and_count(self):
        source = read("GroupHeader.tsx")
        self.assertIn("<h3", source)
        self.assertRegex(source, r'className=\{styles\.number\} aria-hidden="true"')
        self.assertIn("className={styles.rule}", source)
        self.assertIn("{count} {unit}", source)
        self.assertIn("lead?: string", source)

    def test_group_header_uses_tokens(self):
        css = read("GroupHeader.module.css")
        self.assertIn("var(--font-mono)", css)
        self.assertIn("var(--accent-fg)", css)
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,6}\b")

    def test_media_grid_renders_the_group_header_when_given_a_group(self):
        source = read("MediaGridSection.tsx")
        self.assertIn("group?: { index: number; unit?: string }", source)
        self.assertIn("<GroupHeader", source)

    def test_product_edition_features_pass_their_group_position(self):
        self.assertIn("group={{ index }}", read("ProductEditionView.tsx"))


class GroupedPagesTests(unittest.TestCase):
    def test_bimplus_video_grids_are_grouped_under_one_header(self):
        config = (ROOT / "src/lib/grid-groups.ts").read_text(encoding="utf-8")
        self.assertIn("'/products/allplan-bimplus': { title: 'Bimplus uygulama videoları', unit: 'video' }", config)
        layout = read("StructuredPageLayoutSection.tsx")
        self.assertIn("gridGroupFor(pagePath)", layout)
        self.assertIn("group={gridGroup ? { index: gridIndex, unit: gridGroup.unit } : undefined}", layout)

    def test_frilo_geotechnics_news_is_grouped_under_one_header(self):
        page = (ROOT / "src/app/products/frilo/page.tsx").read_text(encoding="utf-8")
        self.assertIn('title="FRILO Geotechnics 2027 yenilikleri"', page)
        self.assertIn('<GroupHeader index={index} title={edition.newsTitle!} count={edition.features.length} unit="yenilik" />', page)
        self.assertEqual(page.count('kicker="FRILO GEOTECHNICS · 2027"'), 1)


class GroupHeaderRenderTests(unittest.TestCase):
    def test_built_rebar_page_shows_group_labels_as_h3(self):
        if rebar_and_parametric_are_held():
            self.skipTest("Rebar and Parametric are held until ALLPLAN publishes them")
        html = ROOT / ".next/server/app/products/allplan-rebar.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        self.assertNotRegex(text, r'<h2[^>]*>Detaylandır</h2>')
        self.assertRegex(text, r'<h3[^>]*>Detaylandır</h3>')

    def test_built_bimplus_and_frilo_pages_keep_every_group_title(self):
        app = ROOT / ".next/server/app/products"
        if not (app / "allplan-bimplus.html").is_file():
            self.skipTest("build output missing")
        bimplus = (app / "allplan-bimplus.html").read_text(encoding="utf-8")
        for title in ("Bimplus — Proje Yönetimi", "Bimplus — İşbirliği", "Projeler ve kullanıcılar baştan organize edilmelidir."):
            self.assertIn(title, bimplus)
        self.assertEqual(bimplus.count(">/ UYGULAMA VİDEOLARI<"), 1)
        frilo = (app / "frilo.html").read_text(encoding="utf-8")
        self.assertIn("FRILO Geotechnics 2027 yenilikleri", frilo)
        self.assertRegex(frilo, r"<h3[^>]*>FRILO Geotechnics Concept&#x27;teki Yenilikler</h3>")


if __name__ == "__main__":
    unittest.main()
