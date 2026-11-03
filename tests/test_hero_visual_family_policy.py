from __future__ import annotations

import json
import subprocess
import unittest
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = json.loads((ROOT / "tests/fixtures/hero_visual_family_routes.json").read_text(encoding="utf-8"))
ROUTE_TO_FAMILY = {route: family for family, routes in FIXTURE.items() for route in routes}
SCOPE_SECTIONS = {"products", "solutions", "solutions-v2", "training", "video-library"}
FAMILY_STEMS = {
    "VF-00": "vf-00-ecosystem-overview",
    "VF-01": "vf-01-building-design",
    "VF-02": "vf-02-infrastructure-civil",
    "VF-03": "vf-03-construction-fabrication",
    "VF-04": "vf-04-addons-technical-tools",
    "VF-05": "vf-05-complementary-cloud",
    "VF-06": "vf-06-training-support-knowledge",
    "VF-07": "vf-07-allplan-product-platform",
}


def render_policy(routes: list[str], fallback_by_route: dict[str, str] | None = None) -> dict:
    completed = subprocess.run(
        ["node", "tests/hero_visual_family_runtime.mjs"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        input=json.dumps({
            "routes": routes,
            "fallbackByRoute": fallback_by_route or {},
        }),
    )
    return json.loads(completed.stdout)


class HeroVisualFamilyPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        cls.release_sources = {
            route: next(
                image["src"] for image in cls.pages[route].get("images", [])
                if image.get("src") and not image.get("isIcon")
            )
            for route in FIXTURE["VF-08"]
        }
        runtime = render_policy(
            [*ROUTE_TO_FAMILY, "/about", "/gizlilik-politikasi"],
            cls.release_sources,
        )
        cls.results = runtime["results"]
        cls.fallback = runtime["fallback"]
        cls.runtime_route_map = runtime["routeMap"]

    def test_fixture_covers_the_exact_91_route_presentation_scope(self):
        fixture_assignments = [route for routes in FIXTURE.values() for route in routes]
        scope_routes = {
            path for path, page in self.pages.items()
            if page.get("section") in SCOPE_SECTIONS
        }
        self.assertEqual(len(fixture_assignments), 91)
        self.assertTrue(all(count == 1 for count in Counter(fixture_assignments).values()))
        self.assertEqual(len(ROUTE_TO_FAMILY), 91)
        self.assertEqual(scope_routes, set(ROUTE_TO_FAMILY))
        self.assertEqual(self.runtime_route_map, ROUTE_TO_FAMILY)
        self.assertEqual(
            Counter(ROUTE_TO_FAMILY.values()),
            Counter({
                "VF-00": 2, "VF-01": 6, "VF-02": 7, "VF-03": 7,
                "VF-04": 30, "VF-05": 10, "VF-06": 21, "VF-07": 6,
                "VF-08": 2,
            }),
        )

    def test_timeless_families_use_approved_desktop_and_mobile_assets(self):
        for route, family_id in ROUTE_TO_FAMILY.items():
            if family_id == "VF-08":
                continue
            model = self.results[route]
            stem = FAMILY_STEMS[family_id]
            with self.subTest(route=route):
                self.assertEqual(model["presentation"], "background-only")
                self.assertEqual(model["familyId"], family_id)
                self.assertEqual(model["assetKind"], "family")
                self.assertEqual(model["background"], {
                    "desktopSrc": f"/assets/heroes/families/{stem}.jpg",
                    "mobileSrc": f"/assets/heroes/families/{stem}-mobile.jpg",
                })

    def test_annual_release_routes_preserve_the_page_source_image(self):
        self.assertEqual(
            set(FIXTURE["VF-08"]),
            {"/products/allplan-2026", "/products/allplan-2026-yenilikler"},
        )
        for route in FIXTURE["VF-08"]:
            model = self.results[route]
            with self.subTest(route=route):
                source_path = self.release_sources[route]
                self.assertTrue((ROOT / "public" / source_path.lstrip("/")).is_file())
                self.assertEqual(model["presentation"], "background-only")
                self.assertEqual(model["familyId"], "VF-08")
                self.assertEqual(model["assetKind"], "official-release")
                self.assertEqual(model["background"], {
                    "desktopSrc": source_path,
                    "mobileSrc": source_path,
                })

    def test_routes_outside_the_family_scope_preserve_framed_fallback(self):
        for route in ("/about", "/gizlilik-politikasi"):
            model = self.results[route]
            with self.subTest(route=route):
                self.assertEqual(model["presentation"], "framed")
                self.assertIsNone(model["familyId"])
                self.assertEqual(model["assetKind"], "page-fallback")
                self.assertEqual(model["background"], {
                    "desktopSrc": self.fallback,
                    "mobileSrc": self.fallback,
                })

    def test_presentation_policy_does_not_leak_into_content_or_schema_data(self):
        for relative in (
            "src/data/pages.json",
            "src/data/navigation.json",
            "src/data/homepage.json",
            "src/lib/schema.ts",
        ):
            content = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(relative=relative):
                self.assertNotIn("visualFamily", content)
                self.assertNotIn("/assets/heroes/families/", content)
                self.assertNotIn("VF-0", content)


if __name__ == "__main__":
    unittest.main()
