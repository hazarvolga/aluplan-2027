"""Directory cards keep the destinations their source cards link to."""

from html.parser import HTMLParser
from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILD_APP = ROOT / ".next/server/app"

ADDON_HREFS = [
    f"/solutions/addons/{slug}"
    for slug in (
        "drive-curve", "steel-components", "parametric-terrain", "ramp", "geometry-tools",
        "2d-dwg-converter", "three-dimensioning", "graphical-text", "sketchup-converter",
    )
]

EXPECTED = {
    "/products": [
        "/products/allplan-aec", "/products/allplan-ultimate", "/products/civil",
        "/products/allplan-professional", "/products/allplan-concept",
        "/products/precast-detail", "/products/allplan-basic",
    ],
    "/solutions-v2/training": [
        f"/solutions-v2/training/{slug}"
        for slug in ("online", "webinar", "classroom", "events", "individual", "e-learning")
    ],
    "/solutions/addons": ADDON_HREFS,
    "/solutions/cds-addon": ADDON_HREFS,
    "/solutions/ax3000-mekanik-tesisat": [
        f"/solutions/ax3000/{slug}"
        for slug in ("sihhi-tesisat", "isitma", "havalandirma", "elektrik", "konut-havalandirma", "sprinkler")
    ],
}


def load_pages() -> dict:
    data = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
    pages = data if isinstance(data, list) else data.get("pages", data)
    if isinstance(pages, dict):
        pages = list(pages.values())
    return {page["path"]: page for page in pages}


class MainLinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.anchors: list[dict] = []

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.depth += 1
        elif tag == "a" and self.depth:
            self.anchors.append(dict(attrs))

    def handle_endtag(self, tag):
        if tag == "main" and self.depth:
            self.depth -= 1


def main_anchors(route: str) -> list[dict]:
    html_file = BUILD_APP / f"{route.lstrip('/')}.html"
    if not html_file.is_file():
        raise unittest.SkipTest(f"production build output missing: {html_file}")
    collector = MainLinkCollector()
    collector.feed(html_file.read_text(encoding="utf-8"))
    return collector.anchors


def main_hrefs(route: str) -> list[str]:
    return [anchor.get("href", "") for anchor in main_anchors(route)]


AX3000_DOCS_ROUTE = "/products/ax3000/dokumanlar"
AX3000_DOCUMENTS = [
    ("/docs/ax3000/ax3000-brochure-en.pdf", "PDF İndir: AX3000 Genel Broşür (İngilizce)"),
    ("/docs/ax3000/ax3000-brochure-de.pdf", "PDF İndir: AX3000 Genel Broşür (Almanca)"),
    ("/docs/ax3000/ax3000-brochure-en-alternative.pdf", "PDF İndir: AX3000 Genel Broşür — Alternatif (İngilizce)"),
    ("/docs/ax3000/ax3000-functions-en.pdf", "PDF İndir: MEP Fonksiyon Açıklamaları (İngilizce)"),
    ("/docs/ax3000/ax3000-functions-en.docx", "Word İndir: MEP Fonksiyon Açıklamaları — Word (İngilizce)"),
    ("/docs/ax3000/ax3000-functions-hexagon-en.docx", "Word İndir: MEP Fonksiyon Açıklamaları — Hexagon (İngilizce)"),
]


class DocumentGroupDataTests(unittest.TestCase):
    def test_ax3000_document_groups_follow_source(self):
        groups = load_pages()[AX3000_DOCS_ROUTE]["documentGroups"]
        self.assertEqual([g["id"] for g in groups], ["brosurler", "teknik-dokumanlar"])
        hrefs = [doc["href"] for g in groups for doc in g["documents"]]
        self.assertEqual(hrefs, [href for href, _ in AX3000_DOCUMENTS])

    def test_ax3000_document_files_exist(self):
        for href, _ in AX3000_DOCUMENTS:
            with self.subTest(href=href):
                self.assertTrue((ROOT / "public" / href.lstrip("/")).is_file())


class DocumentGroupRenderTests(unittest.TestCase):
    def test_ax3000_documents_render_as_downloads(self):
        downloads = [(a.get("href"), a.get("aria-label")) for a in main_anchors(AX3000_DOCS_ROUTE) if "download" in a]
        self.assertEqual(downloads, AX3000_DOCUMENTS)


class SectionCardLinkDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = load_pages()

    def linked_sections(self, route: str) -> list[dict]:
        return [s for s in self.pages[route]["sections"] if s.get("link")]

    def test_cards_link_to_source_destinations_in_order(self):
        for route, hrefs in EXPECTED.items():
            with self.subTest(route=route):
                self.assertEqual([s["link"]["href"] for s in self.linked_sections(route)], hrefs)

    def test_link_labels_are_source_cta_text(self):
        for route in EXPECTED:
            link_texts = [link["text"] for link in self.pages[route]["contentLinks"]]
            for section in self.linked_sections(route):
                with self.subTest(route=route, heading=section["heading"]):
                    self.assertTrue(any(section["link"]["label"] in text for text in link_texts))

    def test_every_card_destination_is_a_page(self):
        for route in EXPECTED:
            for section in self.linked_sections(route):
                with self.subTest(route=route, href=section["link"]["href"]):
                    self.assertIn(section["link"]["href"], self.pages)

    def test_repeated_heading_outside_the_card_grid_stays_unlinked(self):
        ultimate = [s for s in self.pages["/products"]["sections"] if s["heading"] == "ALLPLAN Ultimate"]
        self.assertEqual(len(ultimate), 2)
        self.assertIn("link", ultimate[0])
        self.assertNotIn("link", ultimate[1])


class SectionCardLinkRenderTests(unittest.TestCase):
    def test_card_destinations_rendered_in_main(self):
        for route, hrefs in EXPECTED.items():
            with self.subTest(route=route):
                rendered = main_hrefs(route)
                for href in hrefs:
                    self.assertIn(href, rendered)


AX3000_DOCS_LINKED_ROUTES = ["/solutions/ax3000-yapi-fizigi", "/solutions/ax3000-virtual-reality"]
AX3000_INTRO_CARD_HEADINGS = ("AX3000 Dokümanları</h2>", "Broşürler ve teknik kaynaklar</h2>")


class Ax3000DocumentsPageTests(unittest.TestCase):
    def test_documents_page_has_no_intro_cards_under_the_hero(self):
        html_file = BUILD_APP / "products/ax3000/dokumanlar.html"
        if not html_file.is_file():
            raise unittest.SkipTest(f"production build output missing: {html_file}")
        html = html_file.read_text(encoding="utf-8")
        for heading in AX3000_INTRO_CARD_HEADINGS:
            with self.subTest(heading=heading):
                self.assertNotIn(heading, html.split("<main", 1)[-1].split("</h1>", 1)[-1])
        self.assertIn("Teknik Dokümanlar", html)

    def test_related_ax3000_pages_link_to_the_documents_page(self):
        pages = load_pages()
        routes = [
            route for route in pages
            if "ax3000" in route and route not in (AX3000_DOCS_ROUTE, "/video-kutuphanesi/ax3000")
        ]
        for route in routes:
            with self.subTest(route=route):
                if route in AX3000_DOCS_LINKED_ROUTES:
                    self.assertNotIn(AX3000_DOCS_ROUTE, str(pages[route]))
                    self.assertIn(AX3000_DOCS_ROUTE, main_hrefs(route))
                else:
                    self.assertIn(AX3000_DOCS_ROUTE, str(pages[route]))


if __name__ == "__main__":
    unittest.main()
