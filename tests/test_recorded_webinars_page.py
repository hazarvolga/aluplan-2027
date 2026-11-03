"""/kaydedilmis-webinarlar carries the content of the removed /solutions-v2/training/webinar page."""

from html.parser import HTMLParser
from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/kaydedilmis-webinarlar"
OLD_ROUTE = "/solutions-v2/training/webinar"
PAGE = ROOT / "src/app/kaydedilmis-webinarlar/page.tsx"
DATA = ROOT / "src/data/recorded-webinars.ts"
BUILT = ROOT / ".next/server/app/kaydedilmis-webinarlar.html"
INVENTORY = (ROOT / "docs/00-inventory/page-content.md").read_text(encoding="utf-8")
QUOTE_FORM = "https://forms.office.com/r/hXhnKAG912"
WEBINAR_COUNT = 13
STATS = [("45-60", "Dakika Süre"), ("Ücretsiz", "Genellikle"), ("Uzman", "Konuşmacılar"), ("Soru", "Cevap Bölümü")]
BENEFITS = ["Zaman Verimliliği", "Güncel Konular", "Kolay Erişim", "Tekrar İzleme"]
AUDIENCE = [
    "Yenilikleri takip etmek isteyen yoğun profesyoneller",
    "Belirli bir özellik hakkında hızlı bilgi almak isteyen kullanıcılar",
    "Allplan potansiyelini keşfetmek isteyen yöneticiler",
    "Sürekli mesleki gelişimi hedefleyen öğrenciler ve akademisyenler",
]
FIXED_TEXTS = [
    "Kaydedilmiş Webinarlar", "Genel Bakış", "Kazanımlarınız", "Kimler İçin Uygun?", "Hazır mısınız?",
    "Webinar Takvimine Göz At", "Kısa, odaklanmış ve bilgi dolu çevrimiçi seminerler.",
    "Kaçırdığınız veya tekrar izlemek istediğiniz webinarlarımıza buradan ulaşabilirsiniz.",
    "Eğitim takvimini incelemek veya özel bir teklif almak için bizimle iletişime geçin.",
]


def data_text() -> str:
    return DATA.read_text(encoding="utf-8")


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.text: list[str] = []
        self.hrefs: list[str] = []
        self.images = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.in_main = True
        if self.in_main and tag == "a" and attrs.get("href"):
            self.hrefs.append(attrs["href"])
        if self.in_main and tag == "img":
            self.images += 1

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self.in_main and data.strip():
            self.text.append(data.strip())


def rendered() -> PageText:
    if not BUILT.is_file():
        raise unittest.SkipTest(f"production build output missing: {BUILT}")
    parser = PageText()
    parser.feed(BUILT.read_text(encoding="utf-8"))
    return parser


class RecordedWebinarsSourceTests(unittest.TestCase):
    def test_page_uses_release_metadata_and_is_hidden_while_the_release_is_off(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn(f"buildRelease2027Metadata('{ROUTE}')", source)
        self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{ROUTE}'))", source)
        self.assertIn("isReleaseContentEnabled()", source)
        self.assertIn("notFound()", source)

    def test_route_is_registered_for_the_sitemap(self):
        self.assertIn(f"path: '{ROUTE}'", (ROOT / "src/lib/release-2027-routes.ts").read_text(encoding="utf-8"))

    def test_every_webinar_in_the_data_is_backed_by_the_2026_inventory(self):
        text = data_text()
        self.assertEqual(text.count('"image": "/assets/images/webinars/'), WEBINAR_COUNT)
        start = text.index('"webinars"')
        entries = json.loads(text[text.index("[", start): text.rindex("]") + 1])
        self.assertEqual(len(entries), WEBINAR_COUNT)
        for entry in entries:
            with self.subTest(webinar=entry["title"]):
                self.assertIn(entry["title"], INVENTORY)
                self.assertIn(entry["date"], INVENTORY)
                self.assertIn(entry["description"], INVENTORY)
                self.assertTrue((ROOT / "public" / entry["image"].lstrip("/")).is_file())

    def test_data_carries_the_overview_benefits_audience_and_cta(self):
        text = data_text()
        texts = [*FIXED_TEXTS, *BENEFITS, *AUDIENCE, *(part for pair in STATS for part in pair)]
        self.assertEqual([item for item in texts if item not in text], [])

    def test_page_shares_the_compact_hero(self):
        self.assertIn("CompactPageHero", (ROOT / "src/components/sections/RecordedWebinars.tsx").read_text(encoding="utf-8"))

    def test_archive_does_not_fake_watch_links(self):
        source = (ROOT / "src/components/sections/RecordedWebinars.tsx").read_text(encoding="utf-8")
        self.assertNotIn("youtube", source.lower())


class RecordedWebinarsRenderTests(unittest.TestCase):
    def test_every_text_is_on_the_page(self):
        shown = set(rendered().text)
        text = data_text()
        start = text.index('"webinars"')
        entries = json.loads(text[text.index("[", start): text.rindex("]") + 1])
        expected = [
            *BENEFITS, *AUDIENCE, *(part for pair in STATS for part in pair),
            "Kaydedilmiş Webinarlar", "Genel Bakış", "Kazanımlarınız", "Kimler İçin Uygun?", "Hazır mısınız?", "Webinar Takvimine Göz At",
            *(value for entry in entries for value in (entry["title"], entry["date"], entry["description"])),
        ]
        self.assertEqual([item for item in expected if item not in shown], [])

    def test_cta_uses_the_common_request_form_and_every_webinar_has_a_thumbnail(self):
        page = rendered()
        self.assertIn(QUOTE_FORM, page.hrefs)
        self.assertEqual(page.images, WEBINAR_COUNT)


class RemovedWebinarPageTests(unittest.TestCase):
    def test_old_page_is_gone_from_the_data_and_redirects_to_the_new_one(self):
        pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        self.assertNotIn(OLD_ROUTE, pages)
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        self.assertIn(f"source: '{OLD_ROUTE}'", config)

    def test_learning_group_lists_the_recorded_webinars_card(self):
        homepage = json.loads((ROOT / "src/data/homepage.json").read_text(encoding="utf-8"))
        card = next(service for service in homepage["services"] if service["title"] == "Kaydedilmiş Webinarlar")
        self.assertEqual(card["href"], ROUTE)
        self.assertEqual(card["icon"], "video")
        self.assertTrue(card["description"] and card["cta"])
        group = next(g for g in homepage["serviceGroups"] if g["title"] == "Öğren ve yardım al")
        self.assertIn("Kaydedilmiş Webinarlar", group["serviceTitles"])


if __name__ == "__main__":
    unittest.main()
