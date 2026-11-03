"""Contact title, comparison table semantics, CTA label contrast and decorative alt text."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
TABLE = ROOT / "src/app/2027/compare/ComparisonTable.tsx"
ARCHITECTURE_HTML = ROOT / ".next/server/app/solutions/architecture.html"


def css_rule(css: str, selector: str) -> str:
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", css)
    return match.group(1) if match else ""


class TitleTests(unittest.TestCase):
    def test_no_page_title_repeats_the_brand(self):
        pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        offenders = [path for path, page in pages.items() if "Aluplan | Aluplan" in page["title"]]
        self.assertEqual(offenders, [])


class ComparisonTableTests(unittest.TestCase):
    def test_symbols_are_hidden_and_described_in_text(self):
        source = TABLE.read_text(encoding="utf-8")
        self.assertNotRegex(source, r"<span[^>]*aria-label=")
        self.assertIn('aria-hidden="true"', source)
        self.assertIn('className="alu-visually-hidden"', source)

    def test_tooltip_button_controls_its_tooltip(self):
        self.assertIn("aria-controls={visible ? `${id}-${index}` : undefined}", TABLE.read_text(encoding="utf-8"))


class ProductCardCtaContrastTests(unittest.TestCase):
    def test_cta_text_uses_primary_text_and_keeps_role_accent_on_icon(self):
        css = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")
        self.assertIn("color: var(--text-primary);", css_rule(css, ".alu-product-card__cta"))
        self.assertIn("var(--role-accent, var(--accent-fg))", css_rule(css, ".alu-product-card__cta .alu-icon"))


class DecorativeImageTests(unittest.TestCase):
    def test_empty_alt_images_are_decorative(self):
        if not ARCHITECTURE_HTML.is_file():
            self.skipTest("production build output missing")
        main = re.search(r"<main.*</main>", ARCHITECTURE_HTML.read_text(encoding="utf-8"), re.S).group(0)
        empty = re.findall(r'(<span class="alu-benefit-icon" aria-hidden="true">)?<img(?=[^>]*alt="")([^>]*)>', main)
        undecorated = [attrs for wrapper, attrs in empty if not wrapper and 'style="position:absolute' not in attrs]
        self.assertEqual(len(empty), 13)
        self.assertEqual(undecorated, [])


if __name__ == "__main__":
    unittest.main()
