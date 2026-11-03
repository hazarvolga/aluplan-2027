"""/kaynaklar replaces the homepage services section and the Kaynaklar menu target."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/kaynaklar"
PAGE = ROOT / "src/app/kaynaklar/page.tsx"
VIEW = ROOT / "src/components/sections/ResourcesDirectory.tsx"
HOMEPAGE = json.loads((ROOT / "src/data/homepage.json").read_text(encoding="utf-8"))
HIDDEN_GROUP = "Partner erişimi"


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class ResourcesRouteTests(unittest.TestCase):
    def test_page_uses_release_metadata_and_is_hidden_while_the_release_is_off(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn(f"buildRelease2027Metadata('{ROUTE}')", source)
        self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{ROUTE}'))", source)
        self.assertIn("isReleaseContentEnabled()", source)
        self.assertIn("notFound()", source)

    def test_route_is_registered_for_the_sitemap(self):
        self.assertIn(f"path: '{ROUTE}'", read("src/lib/release-2027-routes.ts"))

    def test_temporary_preview_route_is_gone(self):
        self.assertFalse((ROOT / "src/app/preview/kaynaklar").exists())


class ResourcesLinkTests(unittest.TestCase):
    def test_menu_points_to_the_page_while_the_release_is_on(self):
        shell = read("src/components/shell/SiteShell.tsx")
        self.assertIn("isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'", shell)

    def test_homepage_section_is_removed_for_the_release_and_kept_for_rollback(self):
        home = read("src/components/sections/HomepageView.tsx")
        self.assertIn("{!previewMaxHero && <ProfessionalServicesSection />}", home)


class ResourcesDirectoryTests(unittest.TestCase):
    def test_view_reads_the_homepage_service_data_without_copying_it(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertIn("getHomepageData", source)
        for service in HOMEPAGE["services"]:
            with self.subTest(service=service["title"]):
                self.assertNotIn(service["description"], source)
                self.assertNotIn(service["href"], source)

    def test_every_listed_service_resolves_and_nineteen_remain_without_partner(self):
        titles = {service["title"] for service in HOMEPAGE["services"]}
        listed = [
            title
            for group in HOMEPAGE["serviceGroups"] if group["title"] != HIDDEN_GROUP
            for title in group["serviceTitles"]
        ]
        self.assertEqual([title for title in listed if title not in titles], [])
        self.assertEqual(len(listed), 19)

    def test_view_leaves_out_the_partner_group(self):
        self.assertIn(HIDDEN_GROUP, VIEW.read_text(encoding="utf-8"))

    def test_external_links_open_safely_in_a_new_tab(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertIn('target="_blank"', source)
        self.assertIn('rel="noopener noreferrer"', source)


if __name__ == "__main__":
    unittest.main()
