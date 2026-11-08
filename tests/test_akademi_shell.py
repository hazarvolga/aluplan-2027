"""The akademi section has its own slim chrome: header (logo->home, explore->products, theme
toggle), minimal footer (legal/KVKK + back to site), and a single <main>. No SiteShell."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiShellTests(unittest.TestCase):
    def test_shell_renders_a_single_main(self):
        src = read("src/components/akademi/AkademiShell.tsx")
        self.assertEqual(len(re.findall(r"<main[ >]", src)), 1)

    def test_header_links_home_and_products_and_toggles_theme(self):
        src = read("src/components/akademi/AkademiHeader.tsx")
        self.assertIn('href="/products"', src)
        self.assertIn('href="/"', src)
        self.assertIn("useThemeMode(", src)

    def test_footer_has_legal_and_back_to_site(self):
        src = read("src/components/akademi/AkademiFooter.tsx")
        self.assertIn("/kvkk", src)
        self.assertIn('href="/"', src)

    def test_layout_wraps_children_in_the_shell(self):
        src = read("src/app/akademi/layout.tsx")
        self.assertIn("AkademiShell", src)

    def test_shell_styles_use_tokens_not_literal_colors(self):
        for css in (
            "src/components/akademi/AkademiShell.module.css",
            "src/components/akademi/AkademiHeader.module.css",
            "src/components/akademi/AkademiFooter.module.css",
        ):
            with self.subTest(file=css):
                text = read(css)
                self.assertNotRegex(text, r"#[0-9a-fA-F]{3,8}\b")
                self.assertNotRegex(text, r"\brg?ba?\(")


if __name__ == "__main__":
    unittest.main()
