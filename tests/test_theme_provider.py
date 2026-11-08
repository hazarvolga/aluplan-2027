"""ThemeModeProvider owns dark/light mode; SiteShell consumes it instead of local state."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class ThemeModeProviderTests(unittest.TestCase):
    def test_provider_owns_mode_and_persistence(self):
        src = read("src/components/theme/ThemeModeProvider.tsx")
        self.assertIn("aluplan-theme-mode", src)
        self.assertIn("setAttribute('data-mode'", src)
        self.assertIn("export function useThemeMode", src)
        self.assertIn("export function ThemeModeProvider", src)

    def test_siteshell_consumes_provider_not_local_mode_state(self):
        src = read("src/components/shell/SiteShell.tsx")
        self.assertNotIn("useState<'dark' | 'light'>", src)
        self.assertIn("useThemeMode(", src)


if __name__ == "__main__":
    unittest.main()
