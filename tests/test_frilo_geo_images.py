"""FRILO Geotechnics 2027 news cards show the manufacturer's Images-for-web screenshots (feature N image -> feature N text)."""

from pathlib import Path
import struct
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "src/app/products/frilo/page.tsx"
IMAGES = ROOT / "src/lib/frilo-geo-images.ts"
PUBLIC = ROOT / "public/assets/previews/frilo/2027"
SLUGS = ("concept", "professional-pit", "professional-retaining", "ultimate")
MAX_BYTES = 450_000
MAX_WIDTH = 1200


def jpeg_width(path: Path) -> int:
    data = path.read_bytes()
    index = 2
    while index < len(data):
        marker, length = data[index + 1], struct.unpack(">H", data[index + 2:index + 4])[0]
        if marker in (0xC0, 0xC2):
            return struct.unpack(">H", data[index + 7:index + 9])[0]
        index += 2 + length
    raise ValueError(f"no frame header in {path}")


class FriloGeoImageTests(unittest.TestCase):
    def test_every_news_feature_has_a_web_derivative(self):
        for slug in SLUGS:
            for number in (1, 2, 3):
                path = PUBLIC / f"geo-{slug}-feature-{number}.jpg"
                with self.subTest(image=path.name):
                    self.assertTrue(path.is_file())
                    self.assertLessEqual(path.stat().st_size, MAX_BYTES)
                    self.assertLessEqual(jpeg_width(path), MAX_WIDTH)

    def test_edition_names_map_to_the_image_slugs(self):
        source = IMAGES.read_text(encoding="utf-8")
        for name, slug in (("FRILO Geotechnics Concept", "concept"), ("FRILO Geotechnics Professional Pit", "professional-pit"),
                           ("FRILO Geotechnics Professional Retaining", "professional-retaining"), ("FRILO Geotechnics Ultimate", "ultimate")):
            self.assertIn(f"'{name}': '{slug}'", source)

    def test_news_cards_use_the_update_card_with_an_image(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn("friloGeoNewsImage(edition.name, featureIndex)", source)
        self.assertIn("className={hero.updateCard}", source)
        self.assertIn("<GroupHeader", source)

    def test_images_are_logged(self):
        log = (ROOT / "docs/brand/assets-license-log.md").read_text(encoding="utf-8")
        for slug in SLUGS:
            self.assertIn(f"`FRILO-geo-{slug}`", log)


class FriloGeoImageRenderTests(unittest.TestCase):
    def test_built_page_shows_all_twelve_images(self):
        html = ROOT / ".next/server/app/products/frilo.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        for slug in SLUGS:
            for number in (1, 2, 3):
                self.assertIn(f"/assets/previews/frilo/2027/geo-{slug}-feature-{number}.jpg", text)


if __name__ == "__main__":
    unittest.main()
