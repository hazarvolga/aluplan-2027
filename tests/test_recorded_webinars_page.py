"""/kaydedilmis-webinarlar carries the content of the removed /solutions-v2/training/webinar page."""

from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/kaydedilmis-webinarlar"
OLD_ROUTE = "/solutions-v2/training/webinar"
PAGE = ROOT / "src/app/kaydedilmis-webinarlar/page.tsx"
DATA = ROOT / "src/data/recorded-webinars.ts"
BUILT = ROOT / ".next/server/app/kaydedilmis-webinarlar.html"
INVENTORY = (ROOT / "docs/00-inventory/page-content.md").read_text(encoding="utf-8")
QUOTE_FORM = "https://forms.office.com/r/hXhnKAG912"
SOURCE_WEBINAR_COUNT = 13
CHANNEL_ADDITIONS = {
    "Allplan Akıllı BIM Eklentisi ile İmar Yönetmeliği Uygulaması": "HmRaR_NeVQA",
    "ALLPLAN ile Her Yerde ve Her Zaman Çalışma": "FUwkV_UcDso",
    "Allplan Bridge 2022 Webinar": "tTQ1fL-9P9M",
    "BIMX5 Kurum Rapor Eklentisi": "3L-AuAXlqz0",
    # Not webinars (a customer conference talk and a product demo); added to the archive at the owner's request.
    "Bridge Conference 2026: ALLPLAN ile Uçtan Uca Köprü ve Tünel Tasarımı": "uXg-6lUJ494",
    "SCIA Engineer ile Uçtan Uca Süreç": "So86QONybGA",
}
BIM1SOHBET = "Bim1Sohbet"
WEBINAR_COUNT = SOURCE_WEBINAR_COUNT + len(CHANNEL_ADDITIONS)
# Recordings found on the Allplan Turkey channel (@AllplanTurkey) and matched by title and date.
YOUTUBE_LINKS = {
    "Allplan Bridge 2021": "cQ57NOYXwJA",
    "BIMX5 Online Webinar - İmar Yönetmeliği": "Cvf_nwrSPBQ",
    "BIMX5 Online Webinar - 2B DWG Converter": "dBr2W3Qyd0Y",
    "Bimplus Online Webinar: BIM İşbirliği": "yF1GQhPJclI",
    "ALLPLAN PRECAST SEVİYENİZİ YÜKSELTİN": "-_6LiE0H-Sw",
    "Soru Cevap Semineri": "UaDnMdrmJ4w",
    "Allplan Engineering 2021 ve Yenilikler": "MhtYjJKLZtc",
    "Allplan 2018-2021: İpuçları": "vXZBQ0IPVsQ",
    # Same description as the card text; the recording is on the Bim1Sohbet channel (@bim1sohbet65).
    "Bimfili Youtube Kanalı: BIMX5 Nedir?": "b_i5Lvucy2s",
    **CHANNEL_ADDITIONS,
}


def webinar_entries() -> list[dict]:
    text = DATA.read_text(encoding="utf-8")
    start = text.index('"webinars"')
    return json.loads(text[text.index("[", start): text.rindex("]") + 1])
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
        self.assertEqual(text.count('"image": "/assets/images/webinars/'), SOURCE_WEBINAR_COUNT)
        entries = webinar_entries()
        self.assertEqual(len(entries), WEBINAR_COUNT)
        source_entries = [entry for entry in entries if entry["title"] not in CHANNEL_ADDITIONS]
        self.assertEqual(len(source_entries), SOURCE_WEBINAR_COUNT)
        for entry in source_entries:
            with self.subTest(webinar=entry["title"]):
                self.assertIn(entry["title"], INVENTORY)
                self.assertIn(entry["date"], INVENTORY)
                self.assertIn(entry["description"], INVENTORY)
                self.assertTrue((ROOT / "public" / entry["image"].lstrip("/")).is_file())

    def test_recordings_found_on_the_channel_are_linked_and_the_two_missing_webinars_are_added(self):
        entries = {entry["title"]: entry for entry in webinar_entries()}
        for title, video_id in YOUTUBE_LINKS.items():
            with self.subTest(webinar=title):
                self.assertEqual(entries[title]["youtubeId"], video_id)
        linked = {title for title, entry in entries.items() if entry["youtubeId"]}
        self.assertEqual(linked, set(YOUTUBE_LINKS))
        for title in CHANNEL_ADDITIONS:
            self.assertEqual(entries[title]["image"], "")
        self.assertEqual(entries["Allplan Bridge 2022 Webinar"]["date"], "19 Nisan 2022")
        self.assertEqual(entries["SCIA Engineer ile Uçtan Uca Süreç"]["date"], "Nisan 2026")
        self.assertEqual(entries["Bridge Conference 2026: ALLPLAN ile Uçtan Uca Köprü ve Tünel Tasarımı"]["date"], "Temmuz 2026")
        self.assertEqual(entries["BIMX5 Kurum Rapor Eklentisi"]["date"], "9 Temmuz 2021")
        self.assertEqual(entries["Allplan Akıllı BIM Eklentisi ile İmar Yönetmeliği Uygulaması"]["date"], "20 Ağustos 2022")
        self.assertEqual(entries["ALLPLAN ile Her Yerde ve Her Zaman Çalışma"]["date"], "17 Ağustos 2022")
        for title in ("Allplan Akıllı BIM Eklentisi ile İmar Yönetmeliği Uygulaması", "ALLPLAN ile Her Yerde ve Her Zaman Çalışma"):
            self.assertEqual(entries[title].get("source"), BIM1SOHBET)
        self.assertEqual(entries["Bimfili Youtube Kanalı: BIMX5 Nedir?"]["date"], "10 Haziran 2021")
        self.assertEqual(
            [entry["youtubeId"] for entry in webinar_entries() if not entry["youtubeId"]], [None] * 4
        )

    def test_the_media_grid_shows_the_broadcast_channel_as_the_card_subtitle(self):
        page = (ROOT / "src/components/sections/RecordedWebinars.tsx").read_text(encoding="utf-8")
        self.assertIn("subtitle: webinar.source", page)

    def test_data_carries_the_overview_benefits_audience_and_cta(self):
        text = data_text()
        texts = [*FIXED_TEXTS, *BENEFITS, *AUDIENCE, *(part for pair in STATS for part in pair)]
        self.assertEqual([item for item in texts if item not in text], [])

    def test_page_shares_the_compact_hero(self):
        self.assertIn("CompactPageHero", (ROOT / "src/components/sections/RecordedWebinars.tsx").read_text(encoding="utf-8"))

    def test_archive_reuses_the_shared_media_grid_and_viewer(self):
        page = (ROOT / "src/components/sections/RecordedWebinars.tsx").read_text(encoding="utf-8")
        self.assertIn("MediaGridWithViewer", page)
        self.assertNotIn("styles.webinar", page)
        wrapper = (ROOT / "src/components/sections/MediaGridWithViewer.tsx").read_text(encoding="utf-8")
        self.assertIn("MediaGridSection", wrapper)
        self.assertIn("MediaViewerDialogs", wrapper)
        view = (ROOT / "src/components/sections/SubpageView.tsx").read_text(encoding="utf-8")
        self.assertIn("MediaViewerDialogs", view)
        self.assertNotIn("<MediaDialog", view)

    def test_webinars_without_a_recording_link_show_no_status_label(self):
        text = data_text()
        self.assertNotIn("Arşivde", text)
        self.assertNotIn("archiveStatus", text)
        for entry in webinar_entries():
            with self.subTest(webinar=entry["title"]):
                self.assertIn("youtubeId", entry)
                self.assertTrue(entry["youtubeId"] is None or re.fullmatch(r"[A-Za-z0-9_-]{11}", entry["youtubeId"]))

    def test_hero_is_the_source_heading_and_the_archive_keeps_its_own_title(self):
        text = data_text()
        self.assertIn('"title": "Webinarlar"', text)
        self.assertIn('"archiveTitle": "Kaydedilmiş Webinarlar"', text)


class RecordedWebinarsRenderTests(unittest.TestCase):
    def test_every_text_is_on_the_page(self):
        shown = set(rendered().text)
        entries = webinar_entries()
        expected = [
            *BENEFITS, *AUDIENCE, *(part for pair in STATS for part in pair),
            "Kaydedilmiş Webinarlar", "Genel Bakış", "Kazanımlarınız", "Kimler İçin Uygun?", "Hazır mısınız?", "Webinar Takvimine Göz At",
            *(value for entry in entries for value in (entry["title"], entry["date"], entry["description"], entry.get("source")) if value),
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
