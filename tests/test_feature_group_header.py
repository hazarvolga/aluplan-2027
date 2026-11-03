"""Feature groups inside a product section get a small numbered group label, not a second section heading."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/components/sections"


def read(name: str) -> str:
    return (SECTIONS / name).read_text(encoding="utf-8")


class GroupHeaderTests(unittest.TestCase):
    def test_group_header_is_a_numbered_h3_with_a_rule_and_count(self):
        source = read("GroupHeader.tsx")
        self.assertIn("<h3", source)
        self.assertRegex(source, r'className=\{styles\.number\} aria-hidden="true"')
        self.assertIn("className={styles.rule}", source)
        self.assertIn("özellik", source)

    def test_group_header_uses_tokens(self):
        css = read("GroupHeader.module.css")
        self.assertIn("var(--font-mono)", css)
        self.assertIn("var(--accent-fg)", css)
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,6}\b")

    def test_media_grid_renders_the_group_header_when_given_a_group(self):
        source = read("MediaGridSection.tsx")
        self.assertIn("group?: { index: number }", source)
        self.assertIn("<GroupHeader", source)

    def test_product_edition_features_pass_their_group_position(self):
        self.assertIn("group={{ index }}", read("ProductEditionView.tsx"))


class GroupHeaderRenderTests(unittest.TestCase):
    def test_built_rebar_page_shows_group_labels_as_h3(self):
        html = ROOT / ".next/server/app/products/allplan-rebar.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        self.assertNotRegex(text, r'<h2[^>]*>Detaylandır</h2>')
        self.assertRegex(text, r'<h3[^>]*>Detaylandır</h3>')


if __name__ == "__main__":
    unittest.main()
