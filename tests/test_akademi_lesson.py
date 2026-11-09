"""The module detail page renders the lesson body (steps, mistakes, differentiation) and an
interactive self-assessment quiz whose results live only in the browser's localStorage."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "src/data/akademi-content"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiQuizComponentTests(unittest.TestCase):
    def test_quiz_is_a_client_component_with_guarded_storage(self):
        src = read("src/components/akademi/AkademiQuiz.tsx")
        self.assertIn("'use client'", src)
        self.assertIn("localStorage", src)
        # Storage access is wrapped so private windows / blocked storage don't crash the quiz.
        self.assertIn("try {", src)
        self.assertIn("catch", src)
        self.assertIn("QuizQuestion", src)

    def test_quiz_reveals_correct_answer_and_explanation(self):
        src = read("src/components/akademi/AkademiQuiz.tsx")
        self.assertIn("explanation", src)
        self.assertIn("correct", src)

    def test_quiz_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/AkademiQuiz.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


class AkademiModuleLessonRenderTests(unittest.TestCase):
    def test_detail_renders_lesson_body_and_quiz(self):
        src = read("src/components/sections/AkademiModuleDetail.tsx")
        for token in ("applicationSteps", "commonMistakes",
                      "AkademiQuiz", "module.quiz"):
            with self.subTest(token=token):
                self.assertIn(token, src)

    def test_detail_sections_are_conditional(self):
        # Each lesson-body section renders only when its data is present.
        src = read("src/components/sections/AkademiModuleDetail.tsx")
        self.assertIn("module.applicationSteps && module.applicationSteps.length > 0", src)
        self.assertIn("module.quiz && module.quiz.length > 0", src)


class AkademiLessonContentTests(unittest.TestCase):
    def modules(self):
        for path in sorted(CONTENT_DIR.glob("*.json")):
            yield path, json.loads(path.read_text(encoding="utf-8"))

    def test_every_module_has_application_steps_mistakes_and_quiz(self):
        for path, m in self.modules():
            with self.subTest(file=path.name):
                self.assertTrue(m.get("applicationSteps"), "applicationSteps present")
                self.assertTrue(m.get("commonMistakes"), "commonMistakes present")
                self.assertTrue(m.get("differentiation"), "differentiation present")
                self.assertTrue(m.get("quiz"), "quiz present")

    def test_every_quiz_question_has_one_correct_option(self):
        for path, m in self.modules():
            for q in m.get("quiz") or []:
                with self.subTest(file=path.name, q=q.get("id")):
                    correct = [o for o in q["options"] if o.get("correct")]
                    self.assertEqual(len(correct), 1, f"{q.get('id')}: one correct option")
                    self.assertGreaterEqual(len(q["options"]), 3)

    def test_quiz_outcome_codes_reference_real_outcomes(self):
        for path, m in self.modules():
            valid = {o["code"] for o in m["outcomes"] if o.get("code")}
            for q in m.get("quiz") or []:
                code = q.get("outcomeCode")
                if code:
                    with self.subTest(file=path.name, q=q.get("id")):
                        self.assertIn(code, valid, f"{q.get('id')}: outcomeCode {code} not a module outcome")


if __name__ == "__main__":
    unittest.main()


class AkademiLessonMediaTests(unittest.TestCase):
    """Lessons can show real ALLPLAN screenshots; every figure needs working src + alt,
    and the instructor session plan is separated from the student-facing lesson."""

    def test_figure_component_requires_alt_and_reserves_space(self):
        src = read("src/components/akademi/kit/Figure.tsx")
        self.assertIn("alt={alt}", src)
        self.assertIn("width={width}", src)
        self.assertIn("height={height}", src)
        self.assertIn("loading={priority", src)

    def test_figure_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/kit/Figure.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")

    def test_detail_renders_taught_lesson_not_instructor_material(self):
        src = read("src/components/sections/AkademiModuleDetail.tsx")
        # The taught lesson (DERS) is the spine; per-step figures still render.
        self.assertIn("module.lesson", src)
        self.assertIn("item.figure", src)
        # This is a self-paced online course: no instructor-facing material, no
        # classroom session plan, no classroom duration bar / format on the student page.
        self.assertNotIn("EĞİTMEN", src)
        self.assertNotIn("Timeline", src)
        self.assertNotIn("DistributionBar", src)
        self.assertNotIn("module.format", src)
        # Common mistakes are an accordion (details/summary).
        self.assertIn("<details", src)

    def test_lesson_component_renders_prose_figure_and_tryit(self):
        src = read("src/components/akademi/kit/Lesson.tsx")
        self.assertIn("section.body", src)
        self.assertIn("section.figure", src)
        self.assertIn("section.tryIt", src)
        # Bold key terms via safe text segmentation, not raw HTML.
        self.assertNotIn("dangerouslySetInnerHTML", src)

    def test_lesson_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/kit/Lesson.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")

    def test_m1_has_a_taught_lesson_with_sections(self):
        data = json.loads((CONTENT_DIR / "M1.json").read_text(encoding="utf-8"))
        lesson = data.get("lesson") or {}
        sections = lesson.get("sections") or []
        self.assertGreaterEqual(len(sections), 3, "M1 lesson should have at least 3 taught sections")
        for section in sections:
            self.assertTrue(section.get("heading"), "each section needs a heading")
            body = section.get("body") or []
            self.assertTrue(body and all(len(p) > 40 for p in body), "each section needs real prose")
        self.assertIsInstance(data.get("estimatedMinutes"), int)

    def test_every_akademi_figure_file_exists(self):
        """Any figure referenced by any module (demo, lesson section, or step) has a real file."""
        for path in sorted(CONTENT_DIR.glob("*.json")):
            data = json.loads(path.read_text(encoding="utf-8"))
            figures = list(data.get("demo") or [])
            for section in (data.get("lesson") or {}).get("sections") or []:
                if isinstance(section, dict) and section.get("figure"):
                    figures.append(section["figure"])
            for step in data.get("applicationSteps") or []:
                if isinstance(step, dict) and step.get("figure"):
                    figures.append(step["figure"])
            for fig in figures:
                with self.subTest(module=path.stem, src=fig.get("src")):
                    self.assertGreaterEqual(len(fig.get("alt", "")), 20)
                    asset = ROOT / "public" / fig["src"].lstrip("/")
                    self.assertTrue(asset.is_file(), f"missing image file: {asset}")
