"""Release-only pages are listed in the products menu only while the 2027 release content is on."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
SHELL = (ROOT / "src/components/shell/SiteShell.tsx").read_text(encoding="utf-8")
RELEASE_ITEMS = {
    "ALLPLAN Rebar": "/products/allplan-rebar",
    "ALLPLAN Parametric": "/products/allplan-parametric",
}


def allplan_group() -> list[dict]:
    navigation = json.loads((ROOT / "src/data/navigation.json").read_text(encoding="utf-8"))
    return next(group for group in navigation["productsMenu"] if group["title"] == "ALLPLAN")["items"]


class ReleaseMenuTests(unittest.TestCase):
    def test_partner_solutions_are_in_collaboration_group(self):
        navigation = json.loads((ROOT / 'src/data/navigation.json').read_text(encoding='utf-8'))
        groups = navigation['productsMenu']
        self.assertNotIn('ORTAK ÇÖZÜMLER', [group['title'] for group in groups])
        collaboration = next(group for group in groups if group['title'] == 'İŞBİRLİĞİ YAZILIMI')
        self.assertEqual([item['name'] for item in collaboration['items']], ['ALLPLAN BIMPLUS', 'Allplan Ortak Çözümleri'])
        self.assertEqual(collaboration['items'][1]['href'], 'https://www.allplan.com/allplan-partner-solutions/')
        self.assertTrue(collaboration['items'][1]['external'])
        generator = (ROOT / 'scripts/generate_site_data.py').read_text(encoding='utf-8')
        menu = generator.split('"productsMenu": [', 1)[1].split('"solutionsMenu": [', 1)[0]
        self.assertNotIn('"title": "ORTAK ÇÖZÜMLER"', menu)
        self.assertIn('"name": "Allplan Ortak Çözümleri"', menu.split('"title": "İŞBİRLİĞİ YAZILIMI"', 1)[1])

    def test_frilo_is_a_release_only_product_menu_entry(self):
        navigation = json.loads((ROOT / "src/data/navigation.json").read_text(encoding="utf-8"))
        items = [item for group in navigation["productsMenu"] for item in group["items"]]
        self.assertEqual([item for item in items if item["name"] == "FRILO"], [
            {"name": "FRILO", "href": "/products/frilo", "releaseOnly": True},
        ])
        generator = (ROOT / "scripts/generate_site_data.py").read_text(encoding="utf-8")
        self.assertIn('{"name": "FRILO", "href": "/products/frilo", "releaseOnly": True}', generator)

    def test_held_rebar_and_parametric_are_not_in_the_menu(self):
        # Held until ALLPLAN publishes them (docs/00-inventory/user-decisions.md, 03.11.2026).
        items = allplan_group()
        names = [item["name"] for item in items]
        self.assertEqual(names[:4], ["ALLPLAN Basic", "ALLPLAN Concept", "ALLPLAN Professional", "ALLPLAN Ultimate"])
        hrefs = {item["href"] for item in items}
        for href in RELEASE_ITEMS.values():
            self.assertNotIn(href, hrefs)

    def test_shell_hides_release_only_items_in_the_desktop_and_mobile_menus(self):
        self.assertIn("releaseOnly", SHELL)
        self.assertEqual(SHELL.count("visibleItems(sec.items)"), 2)
        self.assertNotIn("sec.items.map", SHELL)


if __name__ == "__main__":
    unittest.main()
