"""Design phase 4: overview and benefit bands of product edition pages use distinct card variants."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/components/sections"
CARDS = (SECTIONS / "EditionCards.tsx").read_text(encoding="utf-8")
CARDS_CSS = (SECTIONS / "EditionCards.module.css").read_text(encoding="utf-8")
VIEW = (SECTIONS / "ProductEditionView.tsx").read_text(encoding="utf-8")
ICONS = (ROOT / "src/lib/product-icons.ts").read_text(encoding="utf-8")
ALU_ICON = (ROOT / "src/components/ui/AluIcon.tsx").read_text(encoding="utf-8")
EDITION_DATA = {
    "/products/allplan-rebar": ROOT / "src/data/allplan-rebar-2027.ts",
    "/products/allplan-parametric": ROOT / "src/data/allplan-parametric-2027.ts",
}


def benefit_count(path: Path) -> int:
    source = path.read_text(encoding="utf-8")
    benefits = source.split('"benefits"')[1].split('"featuresTitle"')[0]
    return len(re.findall(r'"title":', benefits))


class EditionCardVariantTests(unittest.TestCase):
    def test_cards_offer_grid_steps_and_icons_variants(self):
        self.assertIn("variant?: 'grid' | 'steps' | 'icons'", CARDS)
        self.assertIn("data-variant={variant}", CARDS)
        for name in (".steps", ".icons", ".stepNumber", ".iconChip"):
            with self.subTest(selector=name):
                self.assertIn(name, CARDS_CSS)

    def test_step_number_is_decorative_and_label_is_kept(self):
        self.assertRegex(CARDS, r'className=\{styles\.stepNumber\} aria-hidden="true"')
        self.assertIn("edition.label", CARDS)

    def test_icon_chip_uses_accent_tokens(self):
        chip = re.search(r"\.iconChip\{[^}]*\}", CARDS_CSS).group(0)
        self.assertIn("var(--accent-bg)", chip)
        self.assertIn("var(--accent-fg)", chip)


class ProductEditionViewTests(unittest.TestCase):
    def test_overview_renders_as_steps_with_separate_label(self):
        self.assertIn('variant="steps"', VIEW)
        self.assertIn("label: item.label, title: item.title", VIEW)
        self.assertNotIn("`${item.label}: ${item.title}`", VIEW)

    def test_benefits_render_as_icon_cards(self):
        self.assertIn('variant="icons"', VIEW)
        self.assertIn("productBenefitIcons(content.path)", VIEW)

    def test_every_edition_page_has_one_icon_per_benefit(self):
        for path, data in EDITION_DATA.items():
            entry = re.search(re.escape(f"'{path}': [") + r"([^\]]*)\]", ICONS)
            with self.subTest(page=path):
                self.assertIsNotNone(entry)
                icons = re.findall(r"'([a-z0-9-]+)'", entry.group(1))
                self.assertEqual(len(icons), benefit_count(data))
                for icon in icons:
                    self.assertRegex(ALU_ICON, rf"\n  '?{re.escape(icon)}'?: ")


class EditionCardRenderTests(unittest.TestCase):
    def test_built_rebar_page_uses_both_variants(self):
        html = ROOT / ".next/server/app/products/allplan-rebar.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        self.assertIn('data-variant="steps"', text)
        self.assertIn('data-variant="icons"', text)
        self.assertIn("Donatılandır", text)


if __name__ == "__main__":
    unittest.main()
