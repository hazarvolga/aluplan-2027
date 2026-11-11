"""The akademi module detail route /akademi/[seviye]/[modul]: flag-gated, never indexed,
builds no pages in production, and renders the rich lesson info card from the content model."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = "src/app/akademi/[seviye]/[modul]/page.tsx"
DETAIL = "src/components/sections/AkademiModuleDetail.tsx"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiModuleRouteTests(unittest.TestCase):
    def test_route_is_flag_gated(self):
        page = read(PAGE)
        self.assertIn("if (!isAkademiEnabled()) notFound();", page)
        self.assertNotIn("isReleaseContentEnabled", page)

    def test_route_builds_no_pages_in_production(self):
        page = read(PAGE)
        self.assertIn("if (!isAkademiEnabled()) return [];", page)
        self.assertIn("export const dynamicParams = false;", page)
        self.assertIn("moduleRouteParams", page)

    def test_route_resolves_the_module_or_404s(self):
        page = read(PAGE)
        self.assertIn("getModuleBySlug", page)
        self.assertIn("notFound()", page)


class AkademiModuleDetailTests(unittest.TestCase):
    def test_detail_adds_no_second_main_landmark(self):
        # AkademiShell already renders the single <main>; the section must not add another.
        src = read(DETAIL)
        self.assertNotIn("<main", src)

    def test_detail_renders_the_student_lesson_parts(self):
        # The student page is a self-paced lesson: the taught lesson (DERS) is the
        # spine, plus the running-project callout and the interactive quiz.
        src = read(DETAIL)
        for token in ("module.lesson", "Lesson", "module.homework", "AkademiQuiz"):
            with self.subTest(token=token):
                self.assertIn(token, src)

    def test_detail_drops_curriculum_and_instructor_metadata(self):
        # Bloom levels, outcome codes, the classroom session timeline and the
        # duration bar are curriculum/instructor material, not student content.
        src = read(DETAIL)
        for token in ("outcome.bloom", "outcome.code", "Timeline",
                      "DistributionBar", "module.sessionFlow", "module.durationSplit"):
            with self.subTest(token=token):
                self.assertNotIn(token, src)

    def test_detail_has_prev_next_module_nav_and_breadcrumb(self):
        src = read(DETAIL)
        self.assertIn("<nav", src)
        self.assertIn("aria-label", src)

    def test_detail_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/sections/AkademiModuleDetail.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


class AkademiModuleLinkTests(unittest.TestCase):
    def test_module_card_links_to_the_module_detail_page(self):
        # Each module card on a level page links to /akademi/<levelSlug>/<slug>.
        src = read("src/components/akademi/kit/ModuleCard.tsx")
        self.assertIn("next/link", src)
        self.assertIn("/akademi/${module.levelSlug}/${module.slug}", src)

    def test_module_card_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/kit/ModuleCard.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


if __name__ == "__main__":
    unittest.main()
