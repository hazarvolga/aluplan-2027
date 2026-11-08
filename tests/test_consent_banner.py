"""The cookie/KVKK consent banner is a shared root component, not owned by SiteShell."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class ConsentBannerTests(unittest.TestCase):
    def test_banner_component_owns_consent_ui(self):
        src = read("src/components/shell/ConsentBanner.tsx")
        self.assertIn("alu-cookie-banner", src)
        self.assertIn("useConsentReady(", src)
        self.assertIn("useCookieConsent(", src)
        self.assertIn("writeConsent(", src)

    def test_siteshell_no_longer_renders_the_banner(self):
        src = read("src/components/shell/SiteShell.tsx")
        self.assertNotIn("alu-cookie-banner", src)


if __name__ == "__main__":
    unittest.main()
