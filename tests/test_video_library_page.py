"""Compact /video-kutuphanesi hub keeps all 22 sources and shares the compact page hero."""

from html.parser import HTMLParser
from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "src/components/sections/VideoLibraryHubSection.tsx"
STYLES = ROOT / "src/components/sections/VideoLibraryHubSection.module.css"
BUILT = ROOT / ".next/server/app/video-kutuphanesi.html"
CATALOG = json.loads((ROOT / "src/data/video-library.json").read_text(encoding="utf-8"))
INVENTORY = (ROOT / "docs/00-inventory/page-content.md").read_text(encoding="utf-8")


class MainContent(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.text: list[str] = []
        self.hrefs: list[str] = []
        self.classes: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.in_main = True
        if self.in_main:
            self.classes.append(attrs.get("class") or "")
            if tag == "a":
                self.hrefs.append(attrs.get("href") or "")

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self.in_main and data.strip():
            self.text.append(data.strip())


def rendered() -> MainContent:
    if not BUILT.is_file():
        raise unittest.SkipTest(f"production build output missing: {BUILT}")
    parser = MainContent()
    parser.feed(BUILT.read_text(encoding="utf-8"))
    return parser


class VideoLibrarySourceTests(unittest.TestCase):
    def test_hero_texts_come_from_the_generated_catalog_and_the_2026_inventory(self):
        hero = CATALOG["hero"]
        self.assertEqual(sorted(hero), ["kicker", "lead", "title"])
        for value in hero.values():
            with self.subTest(value=value):
                self.assertIn(value, INVENTORY)

    def test_component_shares_the_compact_hero_and_drops_the_old_card_classes(self):
        source = COMPONENT.read_text(encoding="utf-8")
        self.assertIn("CompactPageHero", source)
        self.assertNotIn("alu-yt-", source)
        self.assertIn("videoLibrary.hero", source)

    def test_tiles_without_a_destination_are_not_links(self):
        source = COMPONENT.read_text(encoding="utf-8")
        self.assertIn("item.url !== '#'", source)

    def test_tile_groups_fill_their_last_row(self):
        css = STYLES.read_text(encoding="utf-8")
        tiles = css[css.index(".tiles{"):].split("}")[0]
        self.assertIn("display:flex", tiles)
        self.assertIn("flex-wrap:wrap", tiles)

    def test_hub_skips_the_generic_subpage_hero(self):
        view = (ROOT / "src/components/sections/SubpageView.tsx").read_text(encoding="utf-8")
        self.assertIn("page.path !== '/references' && !isVideoLibraryHub && <SubpageHeroSection", view)


class VideoLibraryRenderTests(unittest.TestCase):
    def test_every_title_description_and_count_is_on_the_page(self):
        shown = set(rendered().text)
        playlists = {p["url"]: p for p in json.loads((ROOT / "src/data/playlists.json").read_text(encoding="utf-8")).values()}
        expected = [CATALOG["hero"]["title"], CATALOG["hero"]["lead"], CATALOG["title"], CATALOG["description"], CATALOG["subscribe"]["title"], CATALOG["subscribe"]["description"], CATALOG["subscribe"]["label"]]
        for item in CATALOG["items"]:
            expected += [item["title"], item["description"]]
            if item["url"] in playlists:
                expected.append(f'{playlists[item["url"]]["count"]} Video')
        self.assertEqual([text for text in expected if text not in shown], [])

    def test_links_follow_the_source_destinations(self):
        page = rendered()
        internal = [item["url"] for item in CATALOG["items"] if item["url"].startswith("/")]
        external = [item["url"] for item in CATALOG["items"] if item["url"].startswith("http")]
        for href in [*internal, *external, CATALOG["subscribe"]["href"]]:
            with self.subTest(href=href):
                self.assertIn(href, page.hrefs)
        self.assertNotIn("#", page.hrefs)
        self.assertFalse([c for c in page.classes if "alu-yt" in c])


if __name__ == "__main__":
    unittest.main()
