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
        for path in ("src/data/akademi-content.ts", "src/components/akademi/sidebar-nav.ts",
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

    def test_temel_groups_cover_every_lesson_once_in_order(self):
        import json
        index = json.loads(read("src/data/temel-modelleme/_index.json"))
        groups = json.loads(read("src/data/temel-modelleme/_groups.json"))
        self.assertGreaterEqual(len(groups), 2)
        for group in groups:
            self.assertTrue(group["title"].strip())
            self.assertTrue(group["lessons"])
        flat = [no for group in groups for no in group["lessons"]]
        self.assertEqual(flat, [lesson["no"] for lesson in index])

    def test_series_lessons_render_in_collapsible_groups(self):
        src = read("src/components/akademi/AkademiSidebar.tsx")
        self.assertIn("temel-modelleme/_groups.json", src)
        self.assertIn("<details", src)
        self.assertIn("<summary", src)
        # The group holding the current lesson starts open.
        self.assertRegex(src, r"open=\{")

    def test_levels_carry_competency_names(self):
        src = read("src/data/akademi-content.ts")
        for title in ("Temeller", "Üretim ve Dokümantasyon", "Disiplin Uzmanlığı", "BIM Yönetimi ve Otomasyon"):
            with self.subTest(title=title):
                self.assertIn(f"title: '{title}'", src)
        for old in ("title: 'Temel',", "title: 'Orta',", "title: 'İleri',", "title: 'Uzman',"):
            self.assertNotIn(old, src)
        # No component hard-codes an old level name as a label.
        self.assertNotIn("levelTitle: 'Temel'", read("src/components/sections/AkademiKatalogBolumu.tsx"))

    def test_curriculum_levels_render_as_collapsible_groups(self):
        src = read("src/components/akademi/AkademiSidebar.tsx")
        # Each level is a details/summary group, open when the path is inside that level.
        self.assertIn("className={styles.levelGroup}", src)
        self.assertIn("isInsideLevel", src)
        # The level page stays reachable from inside the group.
        self.assertIn("Seviyeye genel bakış", src)

    def test_inside_level_predicate_is_pure_and_exported(self):
        src = read("src/components/akademi/sidebar-nav.ts")
        self.assertIn("export function isInsideLevel", src)

    def test_sidebar_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/AkademiSidebar.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


if __name__ == "__main__":
    unittest.main()
