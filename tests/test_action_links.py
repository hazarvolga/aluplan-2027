"""Operational and module navigation links keep their source destinations."""

from pathlib import Path
import json
import unittest

from test_card_directory import main_anchors


ROOT = Path(__file__).resolve().parents[1]
LICENSE_ROUTE = "/solutions-v2/connect-license"
LICENSE_ACTIONS = [
    ("Allplan Connect'e Git", "https://connect2.allplan.com/"),
    ("Ekip Üyelerine Lisans Atama Rehberi", "/solutions-v2/connect-license/how-to-assign"),
    ("Lisans Yöneticisi Bilgi Formu", "https://forms.office.com/r/HSrhvAkYmb"),
]
AX3000_MODULE_ROUTES = [
    f"/solutions/ax3000/{slug}"
    for slug in ("elektrik", "havalandirma", "isitma", "konut-havalandirma", "sihhi-tesisat", "sprinkler")
]
AX3000_NAV_HREFS = AX3000_MODULE_ROUTES[:4] + [AX3000_MODULE_ROUTES[5], AX3000_MODULE_ROUTES[4], "/products/ax3000/dokumanlar"]


def load_pages() -> dict:
    return json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))


def section_actions(page: dict) -> list[tuple[str, str, str]]:
    return [
        (section["heading"], action["label"], action["href"])
        for section in page["sections"]
        for action in section.get("actions", [])
    ]


class ActionLinkDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = load_pages()

    def test_license_operational_links_restored(self):
        actions = section_actions(self.pages[LICENSE_ROUTE])
        self.assertEqual(
            actions,
            [("Lisanslarınızı Yönetmeye Başlayın", label, href) for label, href in LICENSE_ACTIONS],
        )

    def test_license_form_is_not_the_quote_form(self):
        hrefs = [href for _, _, href in section_actions(self.pages[LICENSE_ROUTE])]
        self.assertNotIn("https://forms.office.com/r/hXhnKAG912", hrefs)

    def test_ax3000_module_navigation(self):
        for route in AX3000_MODULE_ROUTES:
            with self.subTest(route=route):
                self.assertEqual([href for _, _, href in section_actions(self.pages[route])], AX3000_NAV_HREFS)

    def test_ax3000_mechanical_cta_links(self):
        actions = section_actions(self.pages["/solutions/ax3000-mekanik-tesisat"])
        self.assertEqual(
            [(heading, href) for heading, _, href in actions],
            [
                ("Enerji Kimlik Belgesi", "/solutions/ax3000-yapi-fizigi"),
                ("Broşürler ve teknik dokümanlar tek yerde", "/products/ax3000/dokumanlar"),
            ],
        )


class ActionLinkRenderTests(unittest.TestCase):
    def test_license_links_render_with_safe_external_targets(self):
        anchors = {a.get("href"): a for a in main_anchors(LICENSE_ROUTE)}
        for label, href in LICENSE_ACTIONS:
            with self.subTest(href=href):
                self.assertIn(href, anchors)
                if href.startswith("https://"):
                    self.assertEqual(anchors[href].get("target"), "_blank")
                    self.assertEqual(anchors[href].get("rel"), "noopener noreferrer")

    def test_ax3000_navigation_renders_and_marks_current_page(self):
        for route in AX3000_MODULE_ROUTES:
            with self.subTest(route=route):
                anchors = main_anchors(route)
                hrefs = [a.get("href") for a in anchors]
                for href in AX3000_NAV_HREFS:
                    self.assertIn(href, hrefs)
                current = [a.get("href") for a in anchors if a.get("aria-current") == "page"]
                self.assertEqual(current, [route])


if __name__ == "__main__":
    unittest.main()
