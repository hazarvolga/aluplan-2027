"""The FRILO edition cards link to the edition pages of the allplan.com shop (user request, 03.11.2026)."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "src/app/products/frilo/page.tsx"
CARDS = ROOT / "src/components/sections/EditionCards.tsx"
CARDS_CSS = ROOT / "src/components/sections/EditionCards.module.css"
LINKS = {
    "FRILO Concept": "https://www.allplan.com/en-US/shop/products/frilo/frilo-concept",
    "FRILO Professional Concrete": "https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-concrete",
    "FRILO Professional Steel": "https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-steel",
    "FRILO Professional Timber": "https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-timber",
    "FRILO Ultimate": "https://www.allplan.com/en-US/shop/products/frilo/frilo-ultimate",
}


class FriloEditionLinkTests(unittest.TestCase):
    def test_each_edition_card_has_its_shop_link(self):
        source = PAGE.read_text(encoding="utf-8")
        for title, href in LINKS.items():
            with self.subTest(edition=title):
                self.assertRegex(source, re.escape(f"title: '{title}'") + r"[^\n]*" + re.escape(f"link: {{ href: '{href}', label: 'Sürümü inceleyin ↗' }}"))

    def test_edition_cards_render_a_named_link(self):
        source = CARDS.read_text(encoding="utf-8")
        self.assertIn("link?: { href: string; label: string }", source)
        self.assertIn("aria-label={`${edition.link.label.replace(' ↗', '')}: ${edition.title} (yeni sekmede açılır)`}", source)
        self.assertIn('target="_blank" rel="noopener noreferrer"', source)
        self.assertIn(".cardLink{", CARDS_CSS.read_text(encoding="utf-8"))


class FriloEditionLinkRenderTests(unittest.TestCase):
    def test_built_page_has_every_shop_link(self):
        html = ROOT / ".next/server/app/products/frilo.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        for href in LINKS.values():
            self.assertIn(f'href="{href}"', text)


if __name__ == "__main__":
    unittest.main()
