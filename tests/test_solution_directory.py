"""Solution directory data and rendering contracts."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


EXPECTED_HUBS = {
    "/solutions-v2/building-design": [
        ("Mimari", "/solutions/architecture"),
        ("Strüktürel Mühendislik", "/solutions/structural"),
        ("MEP", "/solutions/mep"),
        ("ALLPLAN ENDÜSTRİ ÇÖZÜMLERİ", "/solutions/allplan-industry"),
    ],
    "/solutions-v2/infrastructure": [
        ("Altyapı Mühendisliği", "/solutions/infrastructure"),
        ("Yol ve Demiryolu Tasarımı", "/solutions/road-railway"),
        ("Köprü Tasarımı", "/solutions/bridge-design"),
    ],
    "/solutions-v2/construction": [
        ("Prekast Üretimi", "/solutions/precast"),
        ("Çelik Detaylandırma & İmalat", "/solutions/steel"),
        ("Şantiye Planlaması", "/solutions/site-planning"),
    ],
    "/solutions-v2/addons": [
        ("CDS Add-On", "/solutions/cds-addon"),
        ("Allto PytonPart Generator", "https://allplantools.com/"),
        ("Allto PytonPart", "/solutions/pythonpart"),
        ("AX3000 MEP", "/solutions/ax3000"),
        ("Scalypso", "/solutions/scalypso"),
    ],
    "/solutions-v2/other": [
        ("BIMFlex", "/solutions/bimflex"),
        ("Donatı Mühendisliği", "/solutions/rebar-engineering"),
        ("İmar Yönetmeliği BIM Eklentisi", "/solutions/imar-yonetmeligi-bim-eklentisi"),
        ("BIMX5", "/solutions/bimx5"),
        ("Allplan Oska İşbirliği", "/solutions/oska"),
        ("Allplan Poz Kataloğu", "/solutions/poz-catalog"),
    ],
}


EXPECTED_CATALOG = [
    ("Mimari", "/solutions/architecture"),
    ("Strüktürel Mühendislik", "/solutions/structural"),
    ("MEP", "/solutions/mep"),
    ("ALLPLAN Endüstri Çözümleri", "/solutions/allplan-industry"),
    ("Altyapı Mühendisliği", "/solutions/infrastructure"),
    ("Yol ve Demiryolu Tasarımı", "/solutions/road-railway"),
    ("Köprü Tasarımı", "/solutions/bridge-design"),
    ("Prekast Üretimi", "/solutions/precast"),
    ("Çelik Detaylandırma & İmalat", "/solutions/steel"),
    ("Şantiye Planlaması", "/solutions/site-planning"),
    ("CDS Add-On", "/solutions/cds-addon"),
    ("Allto PythonPart Generator", "https://allplantools.com/"),
    ("Allto PythonPart", "/solutions/pythonpart"),
    ("AX3000 MEP", "/solutions/ax3000-mekanik-tesisat"),
    ("Scalypso", "/solutions/scalypso"),
    ("BIMFlex", "/solutions/bimflex"),
    ("Allplan BIMPLUS", "/products/allplan-bimplus"),
    ("BIMX5", "/solutions/bimx5"),
    ("Donatı Mühendisliği", "/solutions/rebar-engineering"),
    ("İmar Yönetmeliği BIM Eklentisi", "/solutions/imar-yonetmeligi-bim-eklentisi"),
    ("Allplan Oska İşbirliği", "/solutions/oska"),
    ("Allplan Poz Kataloğu", "/solutions/poz-catalog"),
]


EXPECTED_CATALOG_INTRO = {
    "kicker": "TÜM ÇÖZÜMLERİMİZ",
    "title": "Geleceği Tasarlayın",
    "description": "Bina tasarımından altyapı mühendisliğine, inşaat planlamasından eklentilere kadar projenizin her aşaması için geliştirilmiş BIM çözümlerini keşfedin.",
}


EXPECTED_CATALOG_IMAGES = {
    "Mimari": "/assets/solutions/architecture-hero.jpg",
    "Strüktürel Mühendislik": "/assets/solutions/structural-hero.jpg",
    "MEP": "/assets/solutions/mep-hero.jpg",
    "ALLPLAN Endüstri Çözümleri": "/assets/solutions/architecture-hero.jpg",
    "Altyapı Mühendisliği": "/assets/solutions/infrastructure-hero.jpg",
    "Yol ve Demiryolu Tasarımı": "/assets/solutions/road-railway-hero.jpg",
    "Köprü Tasarımı": "/assets/solutions/bridge-hero.jpg",
    "Prekast Üretimi": "/assets/solutions/precast-hero.jpg",
    "Çelik Detaylandırma & İmalat": "/assets/solutions/steel-hero.jpg",
    "Şantiye Planlaması": "/assets/solutions/site-planning-hero.jpg",
    "CDS Add-On": "/assets/solutions/mep-hero.jpg",
    "Allto PythonPart Generator": "/assets/solutions/architecture-hero.jpg",
    "Allto PythonPart": "/assets/solutions/architecture-hero.jpg",
    "AX3000 MEP": "/assets/solutions/mep-hero.jpg",
    "Scalypso": "/assets/solutions/site-planning-hero.jpg",
    "BIMFlex": "/assets/solutions/bimflex/kolon-model.png",
    "Allplan BIMPLUS": "/assets/solutions/architecture-hero.jpg",
    "BIMX5": "/assets/solutions/oska/bimx5-section.jpg",
    "Donatı Mühendisliği": "/assets/solutions/structural-hero.jpg",
    "İmar Yönetmeliği BIM Eklentisi": "/assets/solutions/planli-alanlar/planla-hesapla.png",
    "Allplan Oska İşbirliği": "/assets/solutions/oska/hero-banner.jpg",
    "Allplan Poz Kataloğu": "/assets/solutions/architecture-hero.jpg",
}


class SolutionDirectoryDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.navigation = json.loads(read("src/data/navigation.json"))
        cls.pages = json.loads(read("src/data/pages.json"))
        cls.directory = cls.navigation["solutionDirectory"]

    def test_five_hubs_preserve_the_independent_21_item_contract(self):
        groups = self.directory["groups"]
        self.assertEqual([group["hubPath"] for group in groups], list(EXPECTED_HUBS))

        actual_total = 0
        for group in groups:
            expected = EXPECTED_HUBS[group["hubPath"]]
            actual = [(item["title"], item["href"]) for item in group["hubItems"]]
            with self.subTest(hub=group["hubPath"]):
                self.assertEqual(actual, expected)
                self.assertTrue(all(item["description"] for item in group["hubItems"]))
            actual_total += len(actual)

        self.assertEqual(actual_total, 21)

    def test_hub_descriptions_preserve_each_hub_page_source(self):
        for group in self.directory["groups"]:
            source_sections = {
                section["heading"]: section
                for section in self.pages[group["hubPath"]]["sections"]
            }
            for item in group["hubItems"]:
                source = source_sections[item["title"]]
                with self.subTest(hub=group["hubPath"], item=item["title"]):
                    self.assertEqual(item["description"], source["items"][0])

    def test_header_and_footer_are_derived_from_the_same_hub_contract(self):
        groups = self.directory["groups"]
        header_pairs = [
            (section["title"], [(item["name"], item["href"]) for item in section["items"]])
            for section in self.navigation["solutionsMenu"]
        ]
        directory_pairs = [
            (group["title"], [(item["title"], item["href"]) for item in group["hubItems"]])
            for group in groups
        ]
        footer_pairs = [
            (item["label"], item["href"])
            for item in self.navigation["footer"]["solutions"]
        ]

        self.assertEqual(header_pairs, directory_pairs)
        self.assertEqual(
            footer_pairs,
            [(group["title"], group["hubPath"]) for group in groups],
        )

    def test_catalog_preserves_22_cards_and_explicit_target_exceptions(self):
        groups = self.directory["groups"]
        self.assertEqual([len(group["catalogItems"]) for group in groups], [4, 3, 3, 5, 7])
        actual = [
            (item["title"], item["href"])
            for group in groups
            for item in group["catalogItems"]
        ]
        self.assertEqual(actual, EXPECTED_CATALOG)
        self.assertTrue(
            all(item["description"] for group in groups for item in group["catalogItems"])
        )

    def test_catalog_preserves_source_intro_and_card_images(self):
        self.assertEqual(self.directory["catalogIntro"], EXPECTED_CATALOG_INTRO)
        actual_images = {
            item["title"]: item["image"]["src"]
            for group in self.directory["groups"]
            for item in group["catalogItems"]
        }
        self.assertEqual(actual_images, EXPECTED_CATALOG_IMAGES)

        source_sections = {
            section["heading"]: section
            for section in self.pages["/solutions"]["sections"]
        }
        for group in self.directory["groups"]:
            for item in group["catalogItems"]:
                source = source_sections[item["title"]]
                with self.subTest(item=item["title"]):
                    self.assertEqual(item["description"], source["items"][0])
                    self.assertEqual(item["image"], source["image"])

    def test_generator_does_not_keep_a_second_catalog_content_authority(self):
        generator = read("scripts/generate_site_data.py")
        self.assertNotIn('"catalogDescription":', generator)
        self.assertIn("build_solution_directory(pages_data)", generator)

    def test_only_allplantools_is_external_and_internal_targets_exist(self):
        all_items = [
            item
            for group in self.directory["groups"]
            for collection in (group["hubItems"], group["catalogItems"])
            for item in collection
        ]
        external_hrefs = {item["href"] for item in all_items if item["external"]}
        internal_hrefs = {item["href"] for item in all_items if not item["external"]}

        self.assertEqual(external_hrefs, {"https://allplantools.com/"})
        self.assertTrue(all(href.startswith("/") for href in internal_hrefs))
        self.assertEqual(sorted(internal_hrefs - self.pages.keys()), [])

    def test_directory_has_no_duplicate_targets_within_each_surface(self):
        for group in self.directory["groups"]:
            for key in ("hubItems", "catalogItems"):
                pairs = [(item["title"], item["href"]) for item in group[key]]
                with self.subTest(group=group["title"], surface=key):
                    self.assertEqual(len(pairs), len(set(pairs)))


class SolutionDirectoryBoundaryTests(unittest.TestCase):
    def test_dedicated_hub_and_catalog_boundaries_are_wired(self):
        parent = read("src/components/sections/SubpageView.tsx")
        hub = read("src/components/sections/SolutionHubSection.tsx")
        catalog = read("src/components/sections/SolutionCatalogSection.tsx")

        self.assertIn("import { SolutionHubSection } from './SolutionHubSection';", parent)
        self.assertIn("import { SolutionCatalogSection } from './SolutionCatalogSection';", parent)
        self.assertIn("getSolutionHub(page.path)", parent)
        self.assertIn("getSolutionCatalog()", parent)
        self.assertIn("<SolutionHubSection", parent)
        self.assertIn("<SolutionCatalogSection", parent)
        self.assertNotIn("contentLinks", hub)
        self.assertNotIn("contentLinks", catalog)

    def test_cards_use_next_link_and_secure_external_anchors(self):
        card = read("src/components/sections/SolutionDirectoryCard.tsx")
        self.assertNotIn("'use client'", card)
        self.assertIn("import Link from 'next/link';", card)
        self.assertIn('target="_blank"', card)
        self.assertIn('rel="noopener noreferrer"', card)
        self.assertIn("data-solution-card", card)
        self.assertIn("alu-solution-card", card)
        self.assertIn("item.image", card)
        self.assertIn('className="alu-solution-card__media"', card)

        catalog = read("src/components/sections/SolutionCatalogSection.tsx")
        self.assertIn("intro.kicker", catalog)
        self.assertIn("intro.title", catalog)
        self.assertIn("intro.description", catalog)

        for relative in (
            "src/components/sections/SolutionHubSection.tsx",
            "src/components/sections/SolutionCatalogSection.tsx",
        ):
            component = read(relative)
            with self.subTest(component=relative):
                self.assertNotIn("'use client'", component)
                self.assertIn("data-solution-directory", component)
        self.assertIn("<SolutionDirectoryCard", read("src/components/sections/SolutionHubSection.tsx"))

    def test_building_hub_uses_shared_catalog_presentation_without_changing_content(self):
        hub = read("src/components/sections/SolutionHubSection.tsx")
        self.assertIn("hub.hubPath === '/solutions-v2/building-design'", hub)
        self.assertIn("hub.hubItems.map", hub)
        self.assertIn("hub.catalogItems.find", hub)
        self.assertIn("<SolutionOverviewCards", hub)
        self.assertIn("<SolutionDirectoryCard", hub)
        data = json.loads(read("src/data/navigation.json"))["solutionDirectory"]
        building = next(g for g in data["groups"] if g["hubPath"] == "/solutions-v2/building-design")
        for item in building["hubItems"]:
            matches = [candidate for candidate in building["catalogItems"] if candidate["href"] == item["href"]]
            self.assertEqual(len(matches), 1)
            self.assertTrue(matches[0].get("image"))

    def test_catalog_uses_compact_rows_and_preserves_item_content(self):
        catalog = read("src/components/sections/SolutionCatalogSection.tsx")
        self.assertNotIn("<SolutionDirectoryCard", catalog)
        self.assertIn("<SolutionOverviewCards items={group.catalogItems}", catalog)
        cards = read("src/components/sections/SolutionOverviewCards.tsx")
        self.assertIn("item.description", cards)
        self.assertIn("item.image.alt", cards)
        self.assertIn("item.external ? '_blank' : undefined", cards)
        self.assertIn("item.external ? 'noopener noreferrer' : undefined", cards)
        self.assertIn("styles.featured", cards)
        self.assertIn("styles.productLink", cards)
        self.assertIn("ProductsOverview.module.css", cards)

    def test_catalog_group_headings_share_spacing_and_component(self):
        catalog = read("src/components/sections/SolutionCatalogSection.tsx")
        css = read("src/components/sections/SolutionCatalogSection.module.css")
        self.assertIn('<SectionHeader kicker=', catalog)
        self.assertIn('className={`alu-stack ${catalogStyles.group}`}', catalog)
        self.assertIn('padding-top: var(--space-stack-xl)', css)
        self.assertNotIn('--space-stack-2xl', catalog)


if __name__ == "__main__":
    unittest.main()
