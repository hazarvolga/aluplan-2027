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

    def test_mobile_drawer_lists_resources_before_references(self):
        shell = read("src/components/shell/SiteShell.tsx")
        drawer = shell[shell.index("Mobil Gezinme Menüsü"):]
        self.assertIn("isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'", drawer)
        self.assertLess(drawer.index("/kaynaklar"), drawer.index('href="/references"'))

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

    def test_every_listed_service_resolves_and_twenty_one_remain_without_partner(self):
        titles = {service["title"] for service in HOMEPAGE["services"]}
        listed = [
            title
            for group in HOMEPAGE["serviceGroups"] if group["title"] != HIDDEN_GROUP
            for title in group["serviceTitles"]
        ]
        self.assertEqual([title for title in listed if title not in titles], [])
        self.assertEqual(len(listed), 21)

    def test_every_icon_is_bare_and_card_icons_sit_in_the_corner(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertNotIn("ServiceIcon", source)
        self.assertNotIn("alu-support-card__icon", source)
        tile = source[source.index("function Tile"):source.index("function SupportGroup")]
        featured = source[source.index("function SupportGroup"):source.index("function ListGroup")]
        rows = source[source.index("function ListGroup"):source.index("function GridGroup")]
        for card in (tile, featured, rows):
            self.assertIn("<BareIcon", card)
        css = (ROOT / "src/components/sections/ResourcesDirectory.module.css").read_text(encoding="utf-8")
        bare = css[css.index(".bareIcon"):].split("}")[0]
        self.assertNotIn("background", bare)
        self.assertNotIn("border", bare)

    def test_tile_groups_fill_their_last_row(self):
        css = (ROOT / "src/components/sections/ResourcesDirectory.module.css").read_text(encoding="utf-8")
        tiles = css[css.index(".tiles{"):].split("}")[0]
        self.assertIn("display:flex", tiles)
        self.assertIn("flex-wrap:wrap", tiles)
        self.assertNotIn("grid-template-columns", tiles)
        tile = css[css.index(".tile{"):].split("}")[0]
        self.assertIn("flex:1 1 18rem", tile)

    def test_license_row_buttons_share_one_width(self):
        source = VIEW.read_text(encoding="utf-8")
        rows = source[source.index("function ListGroup"):source.index("function GridGroup")]
        self.assertIn("styles.rowAction", rows)
        css = (ROOT / "src/components/sections/ResourcesDirectory.module.css").read_text(encoding="utf-8")
        action = css[css.index(".rowAction"):].split("}")[0]
        self.assertIn("flex:0 0 12rem", action)

    def test_learning_group_lists_the_video_library_and_training_centers(self):
        group = next(g for g in HOMEPAGE["serviceGroups"] if g["title"] == "Öğren ve yardım al")
        services = {s["title"]: s for s in HOMEPAGE["services"]}
        self.assertEqual(
            group["serviceTitles"],
            ["Video Kütüphanesi", "Kaydedilmiş Webinarlar", "Eğitim Merkezleri", "Teknik Destek", "Destek Platformu", "Danışmanlık", "Sertifika"],
        )
        pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        for title, icon in (("Video Kütüphanesi", "circle-play"), ("Eğitim Merkezleri", "map-pin")):
            with self.subTest(service=title):
                service = services[title]
                self.assertEqual(service["icon"], icon)
                self.assertTrue(service["description"] and service["cta"])
        self.assertIn("/video-kutuphanesi", pages)
        self.assertEqual(services["Video Kütüphanesi"]["href"], "/video-kutuphanesi")
        self.assertEqual(services["Eğitim Merkezleri"]["href"], "/egitim-merkezlerimiz")
        self.assertIn("path: '/egitim-merkezlerimiz'", read("src/lib/release-2027-routes.ts"))

    def test_the_removed_training_card_is_gone(self):
        self.assertNotIn("Eğitim", {service["title"] for service in HOMEPAGE["services"]})

    def test_view_leaves_out_the_partner_group(self):
        self.assertIn(HIDDEN_GROUP, VIEW.read_text(encoding="utf-8"))

    def test_external_links_open_safely_in_a_new_tab(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertIn('target="_blank"', source)
        self.assertIn('rel="noopener noreferrer"', source)


if __name__ == "__main__":
    unittest.main()
