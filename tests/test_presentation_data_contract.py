"""Contracts keeping annual content out of presentation components."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class PresentationDataContractTests(unittest.TestCase):
    def test_homepage_content_and_service_taxonomy_are_generated_data(self):
        homepage = json.loads(read("src/data/homepage.json"))

        self.assertEqual(homepage["releaseLabel"], "ALLPLAN 2026")
        self.assertEqual(homepage["packageMatrixLabel"], "Q3 2026 MATRİSİ")
        self.assertEqual(len(homepage["heroContent"]["tags"]), 14)
        self.assertEqual(
            [len(group["serviceTitles"]) for group in homepage["serviceGroups"]],
            [7, 5, 9, 1],
        )
        grouped_titles = [
            title
            for group in homepage["serviceGroups"]
            for title in group["serviceTitles"]
        ]
        service_titles = [item["title"] for item in homepage["services"]]
        self.assertEqual(len(grouped_titles), len(homepage["services"]))
        self.assertEqual(len(grouped_titles), len(set(grouped_titles)))
        self.assertEqual(len(service_titles), len(set(service_titles)))
        self.assertEqual(set(grouped_titles), set(service_titles))

        icon_source = read("src/components/ui/AluIcon.tsx")
        icon_names = set(re.findall(r"^\s*\| '([^']+)'", icon_source, re.MULTILINE))
        self.assertTrue(icon_names)
        self.assertTrue(
            all(item.get("icon") in icon_names for item in homepage["services"])
        )

    def test_annual_labels_are_consumed_from_generated_data_site_wide(self):
        search_component = read("src/components/sections/SearchPageSection.tsx")
        llms_route = read("src/app/llms.txt/route.ts")

        self.assertIn("getHomepageData", search_component)
        self.assertNotIn("örn. ALLPLAN 2026", search_component)
        self.assertIn("getHomepageData", llms_route)
        self.assertNotIn("Q3 2026 PDF", llms_route)

    def test_professional_services_has_a_dedicated_controlled_boundary(self):
        component = read("src/components/sections/ProfessionalServicesSection.tsx")
        parent = read("src/components/sections/HomepageView.tsx")

        self.assertTrue(component.startswith("'use client';"))
        for marker in [
            "getHomepageData",
            "serviceGroups",
            "useState<number>(0)",
            "useState<boolean>(false)",
            'role="tablist"',
            'role="tab"',
            "aria-selected",
            "showAllServices",
            "services.length",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("<ProfessionalServicesSection />", parent)
        self.assertNotIn("SERVICE_GROUPS", parent)
        self.assertNotIn("SERVICE_ICONS", parent)
        self.assertNotIn("showAllServices", parent)
        self.assertNotIn("activeGroupIdx", parent)

    def test_video_library_catalog_is_generated_data_not_component_content(self):
        catalog = json.loads(read("src/data/video-library.json"))
        component = read("src/components/sections/VideoLibraryHubSection.tsx")

        self.assertEqual(len(catalog["items"]), 22)
        self.assertEqual(
            [item["url"] for item in catalog["items"]].count("#"),
            4,
        )
        self.assertEqual(
            catalog["subscribe"]["href"],
            "https://www.youtube.com/@AllplanTurkey?sub_confirmation=1",
        )
        self.assertIn("getVideoLibraryData", component)
        self.assertNotIn("const VIDEO_LIBRARY_ITEMS", component)
        self.assertNotRegex(component, re.escape("Allplan 2026 sürümü için hazırlanmış"))


if __name__ == "__main__":
    unittest.main()
