"""Product pages describe the product by name and share a page-specific image."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://aluplan.com.tr"
DEFAULT_IMAGE = f"{ORIGIN}/opengraph-image.jpg"
EXPECTED_NAMES = {
    "/products/allplan": "ALLPLAN",
    "/products/allplan-2026": "ALLPLAN 2026",
    "/products/allplan-2026-yenilikler": "ALLPLAN 2026",
    "/products/allplan-aec": "ALLPLAN AEC",
    "/products/allplan-basic": "ALLPLAN Basic",
    "/products/allplan-bimplus": "ALLPLAN Bimplus",
    "/products/allplan-cloud-services": "ALLPLAN Cloud Services",
    "/products/allplan-concept": "ALLPLAN Concept",
    "/products/allplan-professional": "ALLPLAN Professional",
    "/products/allplan-ultimate": "ALLPLAN Ultimate",
    "/products/architecture": "ALLPLAN Architecture",
    "/products/ax3000": "AX3000",
    "/products/civil": "ALLPLAN Civil",
    "/products/precast": "ALLPLAN Precast",
    "/products/precast-detail": "ALLPLAN Precast Detail",
    "/products/sds2-home": "SDS2",
}


def schema(route: str) -> dict:
    result = subprocess.run(["node", "tests/schema_runtime.mjs", route], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def share_images(*routes: str) -> dict:
    result = subprocess.run(["node", "tests/share_image_runtime.mjs", *routes], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def software(graph: dict) -> dict:
    return next(entity for entity in graph["@graph"] if entity.get("@type") == "SoftwareApplication")


class ProductSchemaTests(unittest.TestCase):
    def test_every_software_page_is_covered(self):
        pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        software_pages = {path for path, page in pages.items() if page["schemaType"] == "SoftwareApplication"}
        self.assertEqual(software_pages, set(EXPECTED_NAMES))

    def test_software_application_uses_product_name(self):
        for route, name in EXPECTED_NAMES.items():
            with self.subTest(route=route):
                self.assertEqual(software(schema(route))["name"], name)

    def test_software_application_has_share_image(self):
        entity = software(schema("/products/civil"))
        self.assertTrue(entity["image"].startswith(f"{ORIGIN}/"))

    def test_products_do_not_claim_unverified_operating_system(self):
        for route in EXPECTED_NAMES:
            with self.subTest(route=route):
                self.assertNotIn("operatingSystem", software(schema(route)))


class ShareImageTests(unittest.TestCase):
    def test_family_route_uses_family_hero(self):
        image = share_images("/solutions/architecture")["/solutions/architecture"]
        self.assertEqual(image["url"], f"{ORIGIN}/assets/heroes/families/vf-01-building-design.jpg")

    def test_page_without_photo_uses_default(self):
        image = share_images("/kvkk")["/kvkk"]
        self.assertEqual(image["url"], DEFAULT_IMAGE)

    def test_metadata_uses_share_image(self):
        source = (ROOT / "src/lib/metadata.ts").read_text(encoding="utf-8")
        self.assertIn("getPageShareImage(page)", source)


if __name__ == "__main__":
    unittest.main()
