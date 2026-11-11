"""One search dialog serves the main site and the Akademi (with scopes and ranking)."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class SearchDialogTests(unittest.TestCase):
    def test_site_shell_uses_shared_dialog_with_all_scope(self):
        src = read("src/components/shell/SiteShell.tsx")
        self.assertIn("<SearchDialog", src)
        self.assertIn('defaultScope="all"', src)
        self.assertNotIn("Ürün, Çözüm ve Eğitim Arama", src)

    def test_akademi_header_opens_dialog_scoped_to_akademi(self):
        src = read("src/components/akademi/AkademiHeader.tsx")
        self.assertIn("<SearchDialog", src)
        self.assertIn('defaultScope="akademi"', src)
        self.assertIn("aria-label=\"Akademi'de ara (Ctrl+K)\"", src)

    def test_dialog_ranks_offers_scopes_and_owns_shortcut(self):
        src = read("src/components/shell/SearchDialog.tsx")
        self.assertIn("rankSearchEntries(", src)
        self.assertIn("aria-pressed", src)
        self.assertIn("e.metaKey || e.ctrlKey", src)
        self.assertIn("Ürün, Çözüm ve Eğitim Arama", src)

    def test_dialog_resets_scope_on_open_and_announces_results(self):
        src = read("src/components/shell/SearchDialog.tsx")
        # Reopening starts from the default scope, not the last one picked.
        self.assertIn("setScope(defaultScope)", src)
        # Result count (also after a scope change) is announced to screen readers.
        self.assertIn('aria-live="polite"', src)

    def test_search_page_uses_ranking(self):
        self.assertIn("rankSearchEntries(", read("src/components/sections/SearchPageSection.tsx"))


if __name__ == "__main__":
    unittest.main()
