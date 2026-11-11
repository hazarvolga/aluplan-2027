"""Akademi ships Course/ItemList structured data (ready for launch) while the pages
are indexable whenever the Akademi is enabled (see test_akademi_launch.py)."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiSeoTests(unittest.TestCase):
    def test_jsonld_component_emits_course_and_itemlist(self):
        src = read("src/components/akademi/AkademiJsonLd.tsx")
        self.assertIn("application/ld+json", src)
        self.assertIn("Course", src)
        self.assertIn("ItemList", src)
        self.assertIn("schema.org", src)

    def test_overview_and_level_render_the_jsonld(self):
        self.assertIn("AkademiJsonLd", read("src/components/sections/AkademiOverview.tsx"))
        self.assertIn("AkademiJsonLd", read("src/components/sections/AkademiLevelDetail.tsx"))

    # Indexing is now governed by the launch flag: see tests/test_akademi_launch.py.


if __name__ == "__main__":
    unittest.main()
