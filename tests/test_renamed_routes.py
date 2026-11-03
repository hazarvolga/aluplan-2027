"""Routes published under a new slug: /paket-karsilastirma (2027 comparison) and /faq."""

from pathlib import Path
import json
import os
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src/data"
SHELL = ROOT / "src/components/shell/SiteShell.tsx"


def config_redirects() -> dict[str, dict]:
    env = {k: v for k, v in os.environ.items() if not k.startswith("ALUPLAN_")}
    result = subprocess.run(
        ["node", "-e", "import('./next.config.mjs').then(async (m) => process.stdout.write(JSON.stringify(await m.default.redirects())))"],
        cwd=ROOT, check=True, capture_output=True, text=True, env=env,
    )
    return {item["source"]: item for item in json.loads(result.stdout)}


class RenamedRouteRedirectTests(unittest.TestCase):
    def test_old_urls_redirect_permanently_to_the_new_slugs(self):
        redirects = config_redirects()
        for old, new in (("/2027/compare", "/paket-karsilastirma"), ("/solutions-v2/faq", "/faq")):
            with self.subTest(old=old):
                self.assertEqual(redirects[old]["destination"], new)
                self.assertTrue(redirects[old]["permanent"])


class ComparePageRouteTests(unittest.TestCase):
    def test_comparison_lives_at_the_package_comparison_slug(self):
        self.assertTrue((ROOT / "src/app/paket-karsilastirma/page.tsx").is_file())
        self.assertFalse((ROOT / "src/app/2027/compare").exists())

    def test_release_off_keeps_serving_the_existing_page(self):
        source = (ROOT / "src/app/paket-karsilastirma/page.tsx").read_text(encoding="utf-8")
        self.assertIn("LegacyPackageComparison", source)
        self.assertIn("getPageData('/paket-karsilastirma')", source)

    def test_sitemap_lists_the_comparison_once(self):
        source = (ROOT / "src/app/sitemap.ts").read_text(encoding="utf-8")
        self.assertIn("!releasePaths.has(p.path)", source)


class FaqRouteTests(unittest.TestCase):
    def setUp(self):
        self.pages = json.loads((DATA / "pages.json").read_text(encoding="utf-8"))

    def test_faq_page_is_published_at_faq(self):
        page = self.pages["/faq"]
        self.assertEqual(page["path"], "/faq")
        self.assertEqual(page["canonical"], "https://aluplan.com.tr/faq")
        self.assertNotIn("/solutions-v2/faq", self.pages)

    def test_no_generated_data_links_to_the_old_faq_url(self):
        for name in ("pages.json", "homepage.json", "navigation.json", "search-index.json"):
            with self.subTest(file=name):
                self.assertNotIn("/solutions-v2/faq", (DATA / name).read_text(encoding="utf-8"))

    def test_navigation_data_places_faq_between_about_and_contact(self):
        links = [item["name"] for item in json.loads((DATA / "navigation.json").read_text(encoding="utf-8"))["directLinks"]]
        self.assertEqual(links[-3:], ["Hakkımızda", "S.S.S.", "İletişim"])


class MainMenuTests(unittest.TestCase):
    def test_desktop_and_mobile_menus_list_faq_between_about_and_contact(self):
        shell = SHELL.read_text(encoding="utf-8")
        self.assertEqual(shell.count('href="/faq"'), 2)
        for href in ('href="/about"', 'href="/faq"', 'href="/contact"'):
            self.assertEqual(shell.count(href), 2, href)
        first = [shell.index(h) for h in ('href="/about"', 'href="/faq"', 'href="/contact"')]
        second = [shell.index(h, first[-1] + 1) for h in ('href="/about"', 'href="/faq"', 'href="/contact"')]
        self.assertEqual(first, sorted(first))
        self.assertEqual(second, sorted(second))


if __name__ == "__main__":
    unittest.main()
