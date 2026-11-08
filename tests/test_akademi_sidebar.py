"""The akademi sidebar is a labeled curriculum nav that links all four levels and
highlights the active one; mobile shows it as a drawer that closes on route change."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiSidebarTests(unittest.TestCase):
    def test_sidebar_is_a_labeled_nav_tracking_the_path(self):
        src = read("src/components/akademi/AkademiSidebar.tsx")
        self.assertIn("<nav", src)
        self.assertIn("aria-label", src)
        self.assertIn("usePathname(", src)

    def test_sidebar_links_every_level_from_data(self):
        src = read("src/components/akademi/AkademiSidebar.tsx")
        self.assertIn("buildSidebarLevels", src)
        self.assertIn("/akademi/", src)

    def test_active_helper_is_pure_and_exported(self):
        src = read("src/components/akademi/sidebar-nav.ts")
        self.assertIn("export function isAkademiLevelActive", src)

    def test_sidebar_links_use_semantic_level_slugs(self):
        # The sidebar builds /akademi/${slug} from the level data; those slugs are semantic
        # (temel/orta/ileri/uzman), so no seviye-N link can reach the sidebar.
        for path in ("src/data/akademi.ts", "src/components/akademi/sidebar-nav.ts",
                     "src/components/akademi/AkademiSidebar.tsx"):
            with self.subTest(file=path):
                self.assertNotIn("seviye-", read(path))

    def test_mobile_drawer_manages_focus_and_tab_order(self):
        src = read("src/components/akademi/AkademiSidebar.tsx")
        # Mobile-aware so off-screen links are not left in the tab order when closed.
        self.assertIn("matchMedia", src)
        self.assertIn("inert", src)
        # Focus is moved (into the drawer on open, back to the toggle on close).
        self.assertIn(".focus()", src)

    def test_sidebar_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/AkademiSidebar.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


if __name__ == "__main__":
    unittest.main()
