"""Akademi lessons are searchable at lesson level through a generated, flag-gated index."""

from pathlib import Path
import json
import subprocess
import unicodedata
import unittest


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src/data/search-akademi-index.json"
SERIES = ("temel-modelleme", "arazi-modelleme", "lejant", "donati-detaylandirma",
          "celik-yapi", "prekast", "otomasyon-scripting", "openbim-ifc")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def entries():
    return json.loads(INDEX.read_text(encoding="utf-8"))


def norm(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower().replace("İ", "i"))
    return "".join(c for c in text if unicodedata.category(c) != "Mn").replace("ı", "i")


class AkademiSearchIndexTests(unittest.TestCase):
    def test_every_series_lesson_has_one_entry(self):
        paths = [e["path"] for e in entries()]
        for series in SERIES:
            for lesson in json.loads(read(f"src/data/{series}/_index.json")):
                with self.subTest(series=series, slug=lesson["slug"]):
                    self.assertEqual(paths.count(f"/akademi/{series}/{lesson['slug']}"), 1)

    def test_every_module_level_and_series_page_has_an_entry(self):
        paths = {e["path"] for e in entries()}
        for module in (ROOT / "src/data/akademi-content").glob("M*.json"):
            data = json.loads(module.read_text(encoding="utf-8"))
            self.assertIn(f"/akademi/{data['levelSlug']}/{data['slug']}", paths)
        for level in ("temel", "orta", "ileri", "uzman"):
            self.assertIn(f"/akademi/{level}", paths)
        for series in SERIES:
            self.assertIn(f"/akademi/{series}", paths)

    def test_entries_are_akademi_section_and_capped(self):
        for entry in entries():
            with self.subTest(path=entry["path"]):
                self.assertEqual(entry["section"], "Akademi")
                self.assertLessEqual(len(entry["keywords"]), 1500)
                self.assertTrue(entry["title"].strip())

    def test_lesson_keywords_carry_original_command_names(self):
        entry = next(e for e in entries() if e["path"] == "/akademi/lejant/mimari-lejant-hucresi-tanimlama")
        self.assertIn("zelle definieren", norm(entry["keywords"]))

    def test_index_is_current(self):
        result = subprocess.run(["node", "scripts/build_akademi_search_index.mjs", "--check"], cwd=ROOT)
        self.assertEqual(result.returncode, 0)

    def test_provider_loads_akademi_index_only_behind_flag(self):
        self.assertIn("showAkademi ? import('@/data/search-akademi-index.json')",
                      read("src/components/shell/SearchIndexProvider.tsx"))
        self.assertIn("showAkademi={isAkademiEnabled()}", read("src/app/layout.tsx"))


if __name__ == "__main__":
    unittest.main()
