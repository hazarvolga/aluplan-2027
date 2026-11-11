import importlib.util
import os
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location(
    "check_deepdive_coverage", os.path.join(ROOT, "scripts", "check_deepdive_coverage.py")
)
guard = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(guard)

LOG = """
| Seri | Ders | Kart (id) | Makale | Karar | Gerekçe | Görsel |
|---|---|---|---|---|---|---|
| Lejant | ders-a | de_1 | A | Taşındı | x | 1/1 |
| Lejant | ders-b | de_2 | B | Bekliyor | pdf | 0/? |
| Arazi Modelleme | ders-c | de_3 | C | Kapsandı | y | 0/0 |
"""


def lesson(slug, cards, images):
    return {
        "slug": slug,
        "articles": [{"id": i, "figures": f} for i, f in cards],
        "deepDive": {"blocks": [{"type": "image", "src": s} for s in images]},
    }


class ParseDecisionsTest(unittest.TestCase):
    def test_reads_series_slug_id_and_decision_per_row(self):
        d = guard.parse_decisions(LOG)
        self.assertEqual(d["lejant"][("ders-a", "de_1")], "Taşındı")
        self.assertEqual(d["lejant"][("ders-b", "de_2")], "Bekliyor")
        self.assertEqual(d["arazi-modelleme"][("ders-c", "de_3")], "Kapsandı")


class AuditSeriesTest(unittest.TestCase):
    def setUp(self):
        self.dec = guard.parse_decisions(LOG)["lejant"]

    def test_passes_when_every_card_logged_and_every_figure_placed_once(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/1.png"])], ["/x/1.png"]),
                   lesson("ders-b", [("de_2", [])], [])]
        self.assertEqual(guard.audit_series(lessons, self.dec), [])

    def test_reports_card_without_decision_row(self):
        lessons = [lesson("ders-a", [("de_1", []), ("de_9", [])], [])]
        errs = guard.audit_series(lessons, self.dec)
        self.assertTrue(any("de_9" in e and "karar" in e for e in errs))

    def test_reports_card_figure_missing_from_deepdive(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/1.png"])], [])]
        errs = guard.audit_series(lessons, self.dec)
        self.assertTrue(any("1.png" in e and "yerleşmemiş" in e for e in errs))

    def test_reports_figure_placed_twice_across_lessons(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/1.png"])], ["/x/1.png"]),
                   lesson("ders-b", [("de_2", [])], ["/x/1.png"])]
        errs = guard.audit_series(lessons, self.dec)
        self.assertTrue(any("1.png" in e and "birden fazla" in e for e in errs))

    def test_figure_counts_as_placed_when_identical_content_is_placed(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/1.png", "/x/1-copy.png"])], ["/x/1.png"])]
        digest = {"/x/1.png": "h", "/x/1-copy.png": "h"}.get
        self.assertEqual(guard.audit_series(lessons, self.dec, digest), [])

    def test_non_image_card_figures_are_ignored(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/broken.bin"])], [])]
        self.assertEqual(guard.audit_series(lessons, self.dec), [])

    def test_declared_equivalent_counts_as_placed(self):
        lessons = [lesson("ders-a", [("de_1", ["/x/de.png"])], ["/x/en.png"])]
        errs = guard.audit_series(lessons, self.dec, equivalents={"/x/de.png": "/x/en.png"})
        self.assertEqual(errs, [])

    def test_parse_equivalents_reads_four_column_table(self):
        text = "## Eşdeğer görseller\n| Seri | Kart görseli | Yerleşen eşdeğer | Neden |\n|---|---|---|---|\n| Prekast | `/x/de.png` | `/x/en.png` | dil |\n"
        self.assertEqual(guard.parse_equivalents(text), {"prekast": {"/x/de.png": "/x/en.png"}})

    def test_pending_article_figures_are_not_required(self):
        lessons = [lesson("ders-b", [("de_2", ["/x/2.png"])], [])]
        self.assertEqual(guard.audit_series(lessons, self.dec), [])


if __name__ == "__main__":
    unittest.main()
