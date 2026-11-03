"""Bimplus page: the 'What is BIMPLUS' bullets are replaced by the 2027 launch text."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/products/allplan-bimplus"
BUILT = ROOT / ".next/server/app/products/allplan-bimplus.html"
INTRO = "BIMPLUS, inşaat projelerinde yer alan tüm disiplinler için açık BIM model bazlı veri ve proje iş birliği platformudur."
LEAD_IN = "2027’de yeni:"
BULLETS = [
    "BCF 3.0 değişimi: Daha akıcı koordinasyon ve güçlü birlikte çalışabilirlik için sorunları içe ve dışa aktarın.",
    "Odaklı model incelemeleri: Bindirmeleri kırpın ve 2B çizimleri 3B modellerle hizalayın. Ortografik görünümleri sorunlara, sahnelere ve slayt gösterilerine kaydedin.",
    "Excel destekli BIM verisi: Seçili nesneleri dinamik olarak inceleyin ve içe aktarma sırasında eksik temel metrajları otomatik hesaplayın.",
]
REPLACED = [
    "Proje verilerine her yerden, her zaman erişin",
    "Herhangi bir inşaat sektörü yazılımından proje verilerini",
    "Tüm aşamalarda BIM tabanlı projeleri yönetin ve kontrol edin",
]


def intro() -> dict:
    pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
    return pages[ROUTE]["structuredLayout"]["intro"]


class BimplusIntroTests(unittest.TestCase):
    def test_intro_keeps_the_paragraph_and_lists_the_2027_news(self):
        data = intro()
        self.assertEqual(data["paragraphs"], [INTRO, LEAD_IN])
        self.assertEqual(data["bullets"], BULLETS)
        self.assertEqual(data["title"], "BIMPLUS Nedir?")
        self.assertIn("videoEmbedUrl", data)

    def test_old_bullets_are_gone_from_the_intro(self):
        text = json.dumps(intro(), ensure_ascii=False)
        for old in REPLACED:
            self.assertNotIn(old, text)

    def test_built_page_shows_the_new_text(self):
        if not BUILT.is_file():
            self.skipTest("build output missing")
        html = BUILT.read_text(encoding="utf-8")
        for text in (LEAD_IN, *BULLETS):
            self.assertIn(text, html)


if __name__ == "__main__":
    unittest.main()
