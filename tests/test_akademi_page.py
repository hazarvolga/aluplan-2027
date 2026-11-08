"""Aluplan Akademi is a draft (08.11.2026): visible locally, hidden and unindexed in production."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiDraftTests(unittest.TestCase):
    def test_page_uses_its_own_flag_not_the_2027_flag(self):
        page = read("src/app/akademi/page.tsx")
        self.assertIn("if (!isAkademiEnabled()) notFound();", page)
        self.assertNotIn("isReleaseContentEnabled", page)
        flags = read("src/lib/release-flags.ts")
        self.assertIn("process.env.ALUPLAN_SHOW_AKADEMI === '1'", flags)

    def test_page_is_never_indexed(self):
        page = read("src/app/akademi/page.tsx")
        self.assertIn("robots: { index: false, follow: false }", page)

    def test_draft_is_not_linked_from_sitemap_search_menu_or_llms(self):
        for path in ("src/app/sitemap.ts", "src/app/llms.txt/route.ts", "src/data/navigation.json",
                     "src/data/search-index.json", "src/data/search-extra-index.json"):
            with self.subTest(file=path):
                self.assertNotIn("/akademi", read(path))

    def test_production_deploy_does_not_enable_the_draft(self):
        for path in ("Dockerfile", ".github/workflows/ci.yml"):
            with self.subTest(file=path):
                self.assertNotIn("ALUPLAN_SHOW_AKADEMI", read(path))

    def test_level_three_tracks_have_equal_hours(self):
        data = read("src/data/akademi.ts")
        level_three = data[data.index("number: 3,"):data.index("number: 4,")]
        tracks = re.split(r"\n\s+\{\n\s+title: '", level_three)[1:]
        self.assertEqual(len(tracks), 4)
        totals = {sum(int(h) for h in re.findall(r"hours: (\d+)", track)) for track in tracks}
        self.assertEqual(len(totals), 1, f"track hours differ: {totals}")

    def test_quiz_is_described_as_self_assessment_not_certificate(self):
        data = read("src/data/akademi.ts")
        self.assertIn("sertifika yerine geçmez", data)


if __name__ == "__main__":
    unittest.main()
