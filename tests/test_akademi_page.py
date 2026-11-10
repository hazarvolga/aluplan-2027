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
        # İleri (ileri) modules carry their track in trackTitle; each track's total must match.
        import json
        content_dir = ROOT / "src/data/akademi-content"
        by_track: dict[str, int] = {}
        for path in content_dir.glob("*.json"):
            m = json.loads(path.read_text(encoding="utf-8"))
            if m["levelSlug"] == "ileri":
                by_track[m["trackTitle"]] = by_track.get(m["trackTitle"], 0) + m["hours"]
        self.assertEqual(len(by_track), 4, f"expected 4 tracks, got {by_track}")
        self.assertEqual(len(set(by_track.values())), 1, f"track hours differ: {by_track}")

    def test_quiz_is_described_as_self_assessment_not_certificate(self):
        data = read("src/data/akademi-content.ts")
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

    def test_every_level_has_a_semantic_slug_and_slugs_are_unique(self):
        data = read("src/data/akademi-content.ts")
        slugs = re.findall(r"slug: '([a-z]+)',", data)
        self.assertEqual(set(slugs), {"temel", "orta", "ileri", "uzman"})
        self.assertNotIn("seviye-", data)

    def test_akademi_ts_is_retired(self):
        self.assertFalse((ROOT / "src/data/akademi.ts").exists(),
                         "akademi.ts should be deleted; akademi-content.ts is the single source")

    def test_pages_read_only_the_content_model(self):
        for path in ("src/components/sections/AkademiOverview.tsx",
                     "src/components/sections/AkademiLevelDetail.tsx",
                     "src/components/akademi/AkademiJsonLd.tsx",
                     "src/components/akademi/sidebar-nav.ts",
                     "src/app/akademi/page.tsx",
                     "src/app/akademi/[seviye]/page.tsx"):
            with self.subTest(file=path):
                src = read(path)
                self.assertIn("@/data/akademi-content", src)
                self.assertNotRegex(src, r"@/data/akademi'")

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
        # /akademi ve /akademi/katalog birleştirildikten sonra genel bakış, programa
        # tek bir satır-içi seviye bağlantısıyla değil, gömülü katalog girişiyle
        # (#katalog + AkademiKatalogBolumu: rol yolları, modüller, seviye kartları) bağlanır.
        self.assertIn("#katalog", src)
        self.assertIn("AkademiKatalogBolumu", src)
        self.assertNotIn("/akademi/seviye-", src)


class AkademiLevelDetailRedesignTests(unittest.TestCase):
    def test_level_detail_uses_the_kit(self):
        src = read("src/components/sections/AkademiLevelDetail.tsx")
        self.assertIn("@/components/akademi/kit", src)
        self.assertIn("ModuleCard", src)
        self.assertNotIn("function ModuleCard(", src)

    def test_level_detail_shows_no_classroom_hours(self):
        src = read("src/components/sections/AkademiLevelDetail.tsx")
        # Self-paced online course: no classroom hour totals or per-card hours.
        self.assertNotIn("showHours", src)
        self.assertNotIn("Toplam", src)
        self.assertNotIn("levelHours", src)

    def test_level_detail_keeps_prev_next_nav(self):
        src = read("src/components/sections/AkademiLevelDetail.tsx")
        self.assertIn("<nav", src)


if __name__ == "__main__":
    unittest.main()
