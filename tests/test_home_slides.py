"""Home page product slides carry the Allplan 2027 slide headline and body from the inventory drafts."""

from pathlib import Path
import json
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
HEADLINES = {
    "ALLPLAN": "allplan.home.hero.title",
    "ALLPLAN Max": "max.slide.headline",
    "ALLPLAN Civil": "civil.slide.hero.title",
    "SDS2": "sds2.home.title",
}


def inventory() -> dict[str, str]:
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    return {unit.id: unit.tr for module in MODULES for unit in module.UNITS}


class HomeSlideTests(unittest.TestCase):
    def setUp(self):
        data = json.loads((ROOT / "src/data/homepage-2027-preview.json").read_text(encoding="utf-8"))
        self.links = {link["name"]: link for link in data["productLinks"]}
        self.tr = inventory()

    def test_slide_headlines_come_from_the_inventory_drafts(self):
        for name, source_id in HEADLINES.items():
            with self.subTest(product=name):
                self.assertEqual(self.links[name]["headline"], self.tr[source_id])
                self.assertEqual(self.links[name]["headlineSourceId"], source_id)

    def test_slide_bodies_stay_identical_to_the_inventory_drafts(self):
        for name, link in self.links.items():
            if link["sourceId"] in self.tr:
                with self.subTest(product=name):
                    self.assertEqual(link["detail"], self.tr[link["sourceId"]])

    def test_products_without_a_slide_keep_the_product_name_as_heading(self):
        for name in ("FRILO", "SCIA"):
            self.assertNotIn("headline", self.links[name])

    def test_panel_uses_the_slide_headline_when_present(self):
        source = (ROOT / "src/components/sections/ProductTabs.tsx").read_text(encoding="utf-8")
        self.assertIn("product.headline ?? product.name", source)


if __name__ == "__main__":
    unittest.main()
