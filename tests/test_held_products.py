"""Allplan Rebar and Parametric are held until ALLPLAN publishes them on allplan.com (decision of 03.11.2026)."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
HELD = {"/products/allplan-rebar": "allplan-rebar", "/products/allplan-parametric": "allplan-parametric"}


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class HeldProductTests(unittest.TestCase):
    def test_menu_no_longer_links_the_held_pages(self):
        navigation = read("src/data/navigation.json")
        generator = read("scripts/generate_site_data.py")
        for path in HELD:
            with self.subTest(path=path):
                self.assertNotIn(f'"href": "{path}"', navigation)
                self.assertNotIn(f'"href": "{path}"', generator)

    def test_routes_are_marked_held_and_left_out_of_sitemap_and_llms(self):
        routes = read("src/lib/release-2027-routes.ts")
        self.assertEqual(routes.count("heldUntilManufacturerRelease: true"), 2)
        self.assertIn("export const PUBLISHED_RELEASE_2027_ROUTES", routes)
        for path in ("src/app/sitemap.ts", "src/app/llms.txt/route.ts"):
            with self.subTest(file=path):
                source = read(path)
                self.assertIn("PUBLISHED_RELEASE_2027_ROUTES", source)
                self.assertNotIn("RELEASE_2027_ROUTES.map", source.replace("PUBLISHED_RELEASE_2027_ROUTES", ""))

    def test_pages_answer_404_outside_local_preview(self):
        for path, folder in HELD.items():
            source = read(f"src/app/products/{folder}/page.tsx")
            with self.subTest(page=path):
                self.assertIn(f"isHeldRelease2027Route('{path}') && !isLocalPreviewEnabled()", source)

    def test_decision_is_recorded(self):
        decisions = read("docs/00-inventory/user-decisions.md")
        self.assertIn("Allplan Rebar ve Allplan Parametric", decisions)
        self.assertIn("allplan.com", decisions)


class HeldProductRenderTests(unittest.TestCase):
    def test_built_held_pages_are_not_found(self):
        app = ROOT / ".next/server/app/products"
        if not (app / "frilo.html").is_file():
            self.skipTest("build output missing")
        for folder in HELD.values():
            html = app / f"{folder}.html"
            with self.subTest(page=folder):
                if html.is_file():
                    self.assertNotIn("<title>Allplan Rebar | Aluplan", html.read_text(encoding="utf-8"))
                    self.assertNotIn("<title>Allplan Parametric | Aluplan", html.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
