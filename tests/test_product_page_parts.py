"""SCIA, FRILO and the edition pages share one tab strip, one editions band and one FAQ block."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "scia": ROOT / "src/app/products/scia/page.tsx",
    "frilo": ROOT / "src/app/products/frilo/page.tsx",
    "edition view": ROOT / "src/components/sections/ProductEditionView.tsx",
}
PARTS = ROOT / "src/components/sections/ProductPageParts.tsx"


class ProductPagePartsTests(unittest.TestCase):
    def test_parts_define_the_shared_blocks(self):
        source = PARTS.read_text(encoding="utf-8")
        for name in ("ProductTabNav", "ProductEditionsBand", "ProductContentSection", "ProductFaq"):
            self.assertIn(f"export function {name}", source)

    def test_pages_use_the_shared_blocks_instead_of_their_own_markup(self):
        for name, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(page=name):
                self.assertIn("ProductPageParts", source)
                self.assertIn("<ProductTabNav", source)
                self.assertIn("<ProductEditionsBand", source)
                self.assertNotIn(".tabList", source)
                self.assertNotIn(".navigationSection", source)
                self.assertNotIn(".editionsSection", source)

    def test_scia_and_frilo_use_the_shared_faq_and_content_section(self):
        for name in ("scia", "frilo"):
            source = PAGES[name].read_text(encoding="utf-8")
            with self.subTest(page=name):
                self.assertIn("<ProductFaq", source)
                self.assertIn("<ProductContentSection", source)
                self.assertNotIn("<details", source)


if __name__ == "__main__":
    unittest.main()
