"""Compact layout for /solutions/ax3000-mekanik-tesisat keeps every source text and link."""

from html.parser import HTMLParser
from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/solutions/ax3000-mekanik-tesisat"
BUILT = ROOT / ".next/server/app/solutions/ax3000-mekanik-tesisat.html"
# Not shown in the compact layout: the card that repeats the H1, a leftover link caption, list bullets.
NOT_SHOWN = {"AX3000 Mekanik Tesisat", "Ax3000 Mekanik Tesisat", "AX3000 Doküman Merkezi", "•"}


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.text: list[str] = []
        self.classes: list[str] = []
        self.hrefs: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.in_main = True
        if self.in_main:
            self.classes.append(attrs.get("class") or "")
            if tag == "a" and attrs.get("href"):
                self.hrefs.append(attrs["href"])

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self.in_main and data.strip():
            self.text.append(data.strip())


def source_texts() -> set[str]:
    page = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))[ROUTE]
    link_labels = {"Devamını Oku", "AX3000 Dokümanları"}
    texts = set()
    for section in page["sections"]:
        texts.add(section["heading"])
        texts.update(section["items"])
    return texts - NOT_SHOWN - link_labels


def rendered() -> PageText:
    if not BUILT.is_file():
        raise unittest.SkipTest(f"production build output missing: {BUILT}")
    parser = PageText()
    parser.feed(BUILT.read_text(encoding="utf-8"))
    return parser


class LayoutSourceTests(unittest.TestCase):
    def test_subpage_view_uses_the_compact_component_for_the_route(self):
        view = (ROOT / "src/components/sections/SubpageView.tsx").read_text(encoding="utf-8")
        self.assertIn("Ax3000MechanicalContent", view)
        self.assertIn(ROUTE, view)

    def test_component_reuses_shared_link_components(self):
        source = (ROOT / "src/components/sections/Ax3000MechanicalContent.tsx").read_text(encoding="utf-8")
        self.assertIn("SectionCardLink", source)
        self.assertIn("SectionActions", source)


class LayoutRenderTests(unittest.TestCase):
    def test_no_per_item_card_grid(self):
        classes = " ".join(rendered().classes)
        self.assertNotIn("alu-spec-grid", classes)
        self.assertNotIn("alu-gallery-grid", classes)

    def test_every_source_text_is_still_on_the_page(self):
        shown = set(rendered().text)
        missing = sorted(text for text in source_texts() if text not in shown)
        self.assertEqual(missing, [])

    def test_module_and_document_links_are_preserved(self):
        hrefs = rendered().hrefs
        for href in (
            "/solutions/ax3000/sihhi-tesisat", "/solutions/ax3000/isitma", "/solutions/ax3000/havalandirma",
            "/solutions/ax3000/elektrik", "/solutions/ax3000/konut-havalandirma", "/solutions/ax3000/sprinkler",
            "/solutions/ax3000-yapi-fizigi", "/products/ax3000/dokumanlar",
        ):
            with self.subTest(href=href):
                self.assertIn(href, hrefs)

    def test_page_is_compact(self):
        self.assertLess(len(rendered().classes), 400)


if __name__ == "__main__":
    unittest.main()
