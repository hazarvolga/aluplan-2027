"""On phones the header is one compact row; the top bar items move into the menu drawer."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SHELL = (ROOT / "src/components/shell/SiteShell.tsx").read_text(encoding="utf-8")
CSS = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")


def phone_rules() -> str:
    blocks = re.findall(r"@media \(max-width: 40rem\) \{(.*?)\n\}\n", CSS, re.S)
    return "\n".join(block for block in blocks if "alu-topbar" in block or "alu-site-header" in block)


class MobileHeaderCssTests(unittest.TestCase):
    def test_top_bar_is_hidden_on_phones(self):
        rules = phone_rules()
        self.assertRegex(rules, r"\.alu-topbar \{[^}]*display: none;")

    def test_header_stays_one_row_with_icon_only_buttons(self):
        rules = phone_rules()
        self.assertRegex(rules, r"\.alu-site-header__inner \{[^}]*flex-wrap: nowrap;")
        self.assertRegex(rules, r"\.alu-site-header__inner > \.alu-cluster \.alu-button > span \{[^}]*display: none;")
        self.assertRegex(rules, r"\.alu-site-header__inner > \.alu-cluster \.alu-button \{[^}]*min-width: var\(--target-min\);[^}]*min-height: var\(--target-min\);")

    def test_the_tablet_and_desktop_top_bar_is_untouched(self):
        self.assertRegex(CSS, r"\n\.alu-topbar \{[^}]*padding-block")
        self.assertNotRegex(CSS, r"\n\.alu-topbar \{[^}]*display: none;")


class MobileHeaderMarkupTests(unittest.TestCase):
    def test_header_buttons_keep_their_accessible_names_when_labels_are_hidden(self):
        for label in ("Site içi arama (Ctrl+K)", "'Açık temaya geç'", "'Menüyü kapat'"):
            self.assertIn(label, SHELL)

    def test_drawer_carries_the_top_bar_items(self):
        drawer = SHELL[SHELL.index("alu-mobile-drawer"):]
        self.assertIn("alu-mobile-drawer__contact", drawer)
        self.assertIn("navData.topBar.email", drawer)
        self.assertIn("MAIN_QUOTE_FORM_URL", drawer)
        self.assertIn("navData.topBar.socialLinks.map", drawer)
        self.assertIn("Hızlı Talep Oluştur", drawer)


if __name__ == "__main__":
    unittest.main()
