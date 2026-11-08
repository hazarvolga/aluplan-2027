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


class AkademiLevelPageTests(unittest.TestCase):
    def test_level_route_is_flag_gated_and_never_indexed(self):
        page = read("src/app/akademi/[seviye]/page.tsx")
        self.assertIn("if (!isAkademiEnabled()) notFound();", page)
        self.assertIn("robots: { index: false, follow: false }", page)
        self.assertNotIn("isReleaseContentEnabled", page)

    def test_level_route_builds_no_pages_in_production(self):
        # generateStaticParams returns [] when the draft is off, so a production build creates
        # no /akademi/<slug> HTML; dynamicParams = false makes unbuilt slugs answer 404.
        page = read("src/app/akademi/[seviye]/page.tsx")
        self.assertIn("if (!isAkademiEnabled()) return [];", page)
        self.assertIn("export const dynamicParams = false;", page)

    def test_every_level_has_a_slug_and_slugs_are_unique(self):
        data = read("src/data/akademi.ts")
        slugs = re.findall(r"slug: '([a-z0-9-]+)'", data)
        self.assertEqual(len(slugs), 4)
        self.assertEqual(len(set(slugs)), 4)
        self.assertEqual(set(slugs), {"seviye-1", "seviye-2", "seviye-3", "seviye-4"})

    def test_level_pages_are_not_linked_from_sitemap_or_search(self):
        for path in ("src/app/sitemap.ts", "src/data/navigation.json",
                     "src/data/search-index.json", "src/data/search-extra-index.json"):
            with self.subTest(file=path):
                self.assertNotIn("/akademi", read(path))


class AkademiOverviewRedesignTests(unittest.TestCase):
    def test_overview_uses_the_shared_kit(self):
        src = read("src/components/sections/AkademiOverview.tsx")
        self.assertIn("@/components/akademi/kit", src)
        self.assertIn("LevelCard", src)
        # the old inline LevelCard implementation is gone
        self.assertNotIn("function LevelCard(", src)

    def test_entry_paths_link_into_the_program(self):
        src = read("src/components/sections/AkademiOverview.tsx")
        self.assertIn("/akademi/seviye-1", src)


if __name__ == "__main__":
    unittest.main()
