"""Routes listed in OWN_CHROME_PREFIXES (e.g. /akademi) render without the site chrome,
so they can supply their own layout. SiteShell short-circuits for them."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class RouteChromeTests(unittest.TestCase):
    def test_chrome_routes_helper_lists_akademi(self):
        src = read("src/lib/chrome-routes.ts")
        self.assertIn("OWN_CHROME_PREFIXES", src)
        self.assertIn("/akademi", src)
        self.assertIn("export function hasOwnChrome", src)

    def test_siteshell_short_circuits_for_own_chrome_routes(self):
        src = read("src/components/shell/SiteShell.tsx")
        self.assertIn("usePathname", src)
        self.assertIn("hasOwnChrome", src)


if __name__ == "__main__":
    unittest.main()
