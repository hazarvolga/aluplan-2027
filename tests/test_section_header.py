"""Every section header is the same left-aligned SectionHeader block."""

from pathlib import Path
import os
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/components/sections"
ADOPTERS = [
    "MediaGridSection", "BenefitsSection", "FAQSection", "LinkGroupGridSection", "WorkflowSection",
    "StructuredPageLayoutSection", "EditionCards", "ProductPageParts", "ProductEditionView", "PreviewClosingSection",
    "ReferencesDirectorySection",
]
PAGES = ["src/app/product-lifecycle/page.tsx", "src/app/paket-karsilastirma/page.tsx"]


class SectionHeaderSourceTests(unittest.TestCase):
    def test_header_is_left_aligned_and_the_centered_variant_is_gone(self):
        css = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")
        rule = re.search(r"\n\.alu-section-header \{(.*?)\n\}", css, re.S).group(1)
        self.assertIn("align-items: flex-start;", rule)
        self.assertIn("text-align: left;", rule)
        self.assertNotIn("alu-section-header-center", css)
        self.assertNotIn("alu-section-header-center", (SECTIONS / "SectionHeader.tsx").read_text(encoding="utf-8"))
        self.assertIn('className="alu-section-header"', (SECTIONS / "SectionHeader.tsx").read_text(encoding="utf-8"))

    def test_header_can_name_its_heading_for_aria_labelledby(self):
        source = (SECTIONS / "SectionHeader.tsx").read_text(encoding="utf-8")
        self.assertIn("id?: string", source)

    def test_sections_use_the_shared_header_instead_of_their_own(self):
        for name in ADOPTERS:
            source = (SECTIONS / f"{name}.tsx").read_text(encoding="utf-8")
            with self.subTest(component=name):
                self.assertIn("<SectionHeader", source)
        for path in PAGES:
            with self.subTest(page=path):
                self.assertIn("<SectionHeader", (ROOT / path).read_text(encoding="utf-8"))

    def test_edition_cards_no_longer_style_their_own_heading(self):
        css = (SECTIONS / "EditionCards.module.css").read_text(encoding="utf-8")
        self.assertNotIn(".heading h2", css)
        self.assertNotIn(".kicker", css)


class SectionHeaderRenderTests(unittest.TestCase):
    def test_no_built_page_uses_the_centered_header(self):
        app = ROOT / ".next/server/app"
        if not (app / "index.html").is_file():
            self.skipTest("build output missing")
        offenders = []
        for base, _, files in os.walk(app):
            for name in files:
                if name.endswith(".html") and "alu-section-header-center" in (Path(base) / name).read_text(encoding="utf-8"):
                    offenders.append(name)
        self.assertEqual(offenders, [])


if __name__ == "__main__":
    unittest.main()
