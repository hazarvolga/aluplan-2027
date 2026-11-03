"""/egitim-merkezlerimiz lists the academic partners and training centers."""

from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/egitim-merkezlerimiz"
PAGE = ROOT / "src/app/egitim-merkezlerimiz/page.tsx"
DATA = ROOT / "src/data/education-partners.ts"
BUILT = ROOT / ".next/server/app/egitim-merkezlerimiz.html"

TITLE = "Eğitim İş Ortaklarımız"
INTRO = "Akademik iş birliklerimiz ve yetkili eğitim merkezlerimiz."
UNIVERSITIES = {
    "Yıldız Teknik Üniversitesi": ["İnşaat Mühendisliği", "Mimarlık"],
    "İstanbul Aydın Üniversitesi": ["İnşaat Mühendisliği", "Mimarlık"],
    "Kastamonu MYO": [],
    "İstanbul Gelişim Üniversitesi": ["İnşaat Teknolojisi", "Mimarlık"],
    "Orta Doğu Teknik Üniversitesi": ["İnşaat Mühendisliği"],
}
CENTER_TEXTS = [
    "IMO Ankara", "Mizgin Bektaş", "Araştırma Görevlisi", "TMMOB İnşaat Mühendisleri Odası", "Ankara Şubesi",
    "0 312 294 3060",
    "LGN Proje Akademi", "Sahrayıcedit Mah. Ferit Bey Sok. No:24 / 12", "34734 Kadıköy / İstanbul",
    "info@lgnprojeakademi.com", "0 533 218 90 66",
]
CONTACT_HREFS = ["tel:03122943060", "tel:05332189066", "mailto:info@lgnprojeakademi.com"]


class MainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.text: list[str] = []
        self.hrefs: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.in_main = True
        if self.in_main and tag == "a" and attrs.get("href"):
            self.hrefs.append(attrs["href"])

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self.in_main and data.strip():
            self.text.append(data.strip())


def rendered() -> MainText:
    if not BUILT.is_file():
        raise unittest.SkipTest(f"production build output missing: {BUILT}")
    parser = MainText()
    parser.feed(BUILT.read_text(encoding="utf-8"))
    return parser


class EducationPartnersSourceTests(unittest.TestCase):
    def test_page_uses_release_metadata_and_is_hidden_while_the_release_is_off(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn(f"buildRelease2027Metadata('{ROUTE}')", source)
        self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{ROUTE}'))", source)
        self.assertIn("isReleaseContentEnabled()", source)
        self.assertIn("notFound()", source)

    def test_route_is_registered_for_the_sitemap(self):
        self.assertIn(f"path: '{ROUTE}'", (ROOT / "src/lib/release-2027-routes.ts").read_text(encoding="utf-8"))

    def test_data_module_carries_every_partner_text_and_contact_link(self):
        source = DATA.read_text(encoding="utf-8")
        texts = [TITLE, INTRO, *UNIVERSITIES, *(p for programs in UNIVERSITIES.values() for p in programs), *CENTER_TEXTS, *CONTACT_HREFS]
        self.assertEqual([text for text in texts if text not in source], [])

    def test_lgn_email_is_the_lgn_address_not_the_aluplan_one(self):
        self.assertNotIn("info@aluplan.com.tr", DATA.read_text(encoding="utf-8"))

    def test_page_shares_the_compact_hero_with_the_resources_page(self):
        self.assertIn("CompactPageHero", (ROOT / "src/components/sections/EducationPartners.tsx").read_text(encoding="utf-8"))
        self.assertIn("CompactPageHero", (ROOT / "src/components/sections/ResourcesDirectory.tsx").read_text(encoding="utf-8"))


class EducationPartnersRenderTests(unittest.TestCase):
    def test_every_text_is_on_the_page(self):
        shown = set(rendered().text)
        expected = [TITLE, INTRO, "Üniversiteler", "Eğitim Merkezlerimiz", *UNIVERSITIES, *(p for programs in UNIVERSITIES.values() for p in programs), *CENTER_TEXTS]
        self.assertEqual([text for text in expected if text not in shown], [])

    def test_contact_links_are_real_links(self):
        hrefs = rendered().hrefs
        for href in CONTACT_HREFS:
            with self.subTest(href=href):
                self.assertIn(href, hrefs)


if __name__ == "__main__":
    unittest.main()
