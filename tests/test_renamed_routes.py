"""Routes published under a new slug: /paket-karsilastirma (2027 comparison) and /faq."""

from pathlib import Path
import json
import os
import subprocess
import unittest
from scripts.extract_structured_pages import parse_faq_page


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
    def test_placeholder_redirects_with_301_to_comparison(self):
        redirect = config_redirects()["/package-overview"]
        self.assertEqual(redirect["destination"], "/paket-karsilastirma")
        self.assertEqual(redirect["statusCode"], 301)

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

    def test_lifecycle_remains_on_its_own_page_not_as_an_faq_category(self):
        directory = self.pages["/faq"]["structuredLayout"]["faqDirectory"]
        self.assertEqual(directory, parse_faq_page()["faqDirectory"])
        categories = directory["categories"]
        self.assertEqual([category["id"] for category in categories], ["subscription", "cloud", "conversion", "workgroup"])
        self.assertNotIn("lifecycle", [category["id"] for category in categories])
        self.assertEqual(sum(len(category["items"]) for category in categories), 19)
        lifecycle = (ROOT / "src/app/product-lifecycle/page.tsx").read_text(encoding="utf-8")
        for text in (
            "Bu ürün yaşam döngüsü politikasının kapsamı nedir?",
            "Ürün bakımı ile sürüm desteği arasındaki fark nedir?",
            "Ürün bakım aşamalarının her birinde hangi bakım hizmetleri yer alır?",
            "Her sürüm destek aşamasında hangi teknik destek ve bakım hizmetleri yer alır?",
            "Ana sürüm nedir?",
            "Ara sürüm nedir?",
        ):
            with self.subTest(text=text):
                self.assertIn(text, lifecycle)

    def test_no_generated_data_links_to_the_old_faq_url(self):
        for name in ("pages.json", "homepage.json", "navigation.json", "search-index.json"):
            with self.subTest(file=name):
                self.assertNotIn("/solutions-v2/faq", (DATA / name).read_text(encoding="utf-8"))

    def test_navigation_data_no_longer_carries_the_unused_direct_links(self):
        navigation = json.loads((DATA / "navigation.json").read_text(encoding="utf-8"))
        self.assertNotIn("directLinks", navigation)
        self.assertNotIn("directLinks", (ROOT / "scripts/generate_site_data.py").read_text(encoding="utf-8"))

    def test_faq_breadcrumb_is_home_then_the_page(self):
        self.assertEqual(
            self.pages["/faq"]["breadcrumbs"],
            [{"label": "Ana Sayfa", "href": "/"}, {"label": "Sıkça Sorulan Sorular", "href": "/faq"}],
        )


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


VIDEO_OLD = "/solutions-v2/training/video-library"
VIDEO_NEW = "/video-kutuphanesi"


class VideoLibraryRouteTests(unittest.TestCase):
    def test_old_urls_redirect_permanently_with_the_path_preserved(self):
        redirect = config_redirects()[f"{VIDEO_OLD}/:path*"]
        self.assertEqual(redirect["destination"], f"{VIDEO_NEW}/:path*")
        self.assertTrue(redirect["permanent"])

    def test_hub_and_playlists_are_published_under_the_new_slug(self):
        pages = json.loads((DATA / "pages.json").read_text(encoding="utf-8"))
        routes = [route for route in pages if route.startswith(VIDEO_NEW)]
        self.assertIn(VIDEO_NEW, routes)
        self.assertEqual(len(routes), 15)
        self.assertFalse([route for route in pages if "video-library" in route])
        self.assertEqual(pages[VIDEO_NEW]["canonical"], f"https://aluplan.com.tr{VIDEO_NEW}")

    def test_no_generated_data_uses_the_old_slug(self):
        for name in ("pages.json", "homepage.json", "navigation.json", "search-index.json", "playlists.json", "video-library.json"):
            with self.subTest(file=name):
                self.assertNotIn(VIDEO_OLD, (DATA / name).read_text(encoding="utf-8"))

    def test_hub_component_recognises_internal_playlists_by_path_not_by_the_old_prefix(self):
        hub = (ROOT / "src/components/sections/VideoLibraryHubSection.tsx").read_text(encoding="utf-8")
        self.assertNotIn("startsWith('/solutions-v2')", hub)
        self.assertIn("effectiveUrl.startsWith('/')", hub)

    def test_training_page_end_conversion_still_covers_the_moved_pages(self):
        policy = (ROOT / "src/components/sections/page-end-conversion-policy.ts").read_text(encoding="utf-8")
        self.assertIn("page.path.startsWith('/video-kutuphanesi')", policy)


TRAINING_HUB = "/solutions-v2/training"


class RemovedTrainingHubTests(unittest.TestCase):
    def test_hub_url_redirects_to_the_resources_page(self):
        redirect = config_redirects()[TRAINING_HUB]
        self.assertEqual(redirect["destination"], "/kaynaklar")
        self.assertTrue(redirect["permanent"])

    def test_classroom_training_url_redirects_to_the_resources_page(self):
        redirect = config_redirects()["/solutions-v2/training/classroom"]
        self.assertEqual(redirect["destination"], "/kaynaklar")
        self.assertTrue(redirect["permanent"])

    def test_online_training_url_redirects_to_the_resources_page(self):
        redirect = config_redirects()["/solutions-v2/training/online"]
        self.assertEqual(redirect["destination"], "/kaynaklar")
        self.assertTrue(redirect["permanent"])

    def test_webinar_url_redirects_to_the_recorded_webinars_page(self):
        redirect = config_redirects()["/solutions-v2/training/webinar"]
        self.assertEqual(redirect["destination"], "/kaydedilmis-webinarlar")
        self.assertTrue(redirect["permanent"])

    def test_remaining_training_subpages_redirect_to_the_resources_page(self):
        redirects = config_redirects()
        for slug in ("events", "individual", "e-learning", "quick-start"):
            with self.subTest(slug=slug):
                redirect = redirects[f"{TRAINING_HUB}/{slug}"]
                self.assertEqual(redirect["destination"], "/kaynaklar")
                self.assertTrue(redirect["permanent"])

    def test_no_training_page_is_published_any_more(self):
        pages = json.loads((DATA / "pages.json").read_text(encoding="utf-8"))
        self.assertEqual([path for path in pages if path.startswith(TRAINING_HUB)], [])

    def test_page_end_conversion_no_longer_matches_the_removed_training_prefix(self):
        policy = (ROOT / "src/components/sections/page-end-conversion-policy.ts").read_text(encoding="utf-8")
        self.assertNotIn("/solutions-v2/training", policy)
        self.assertIn("page.path.startsWith('/video-kutuphanesi')", policy)

    def test_llms_txt_describes_the_package_comparison_for_the_active_release(self):
        route = (ROOT / "src/app/llms.txt/route.ts").read_text(encoding="utf-8")
        self.assertIn("packageComparisonLine", route)
        self.assertIn("Basic, Concept, Professional ve Ultimate", route)
        self.assertIn("${packageComparisonLine}", route)

    def test_no_breadcrumb_links_to_the_removed_hub(self):
        pages = json.loads((DATA / "pages.json").read_text(encoding="utf-8"))
        offenders = [path for path, page in pages.items() if any(c["href"] == TRAINING_HUB for c in page["breadcrumbs"])]
        self.assertEqual(offenders, [])

    def test_mobile_drawer_no_longer_links_to_the_hub(self):
        self.assertNotIn(f'href="{TRAINING_HUB}"', SHELL.read_text(encoding="utf-8"))

    def test_hub_only_component_is_removed(self):
        self.assertFalse((ROOT / "src/components/sections/TrainingTabs.tsx").exists())
        self.assertNotIn("TrainingTabs", (ROOT / "src/components/sections/SubpageView.tsx").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
